/**
 * IELTS Tập 3 — Ngày 29 (band 5.0 → 6.0). Mục lục: docs/ielts-lo-trinh-0-8.md mục 3.3.
 *   Bài 1 Ngữ pháp  — Causative (have / get sth done · have sb do · get sb to do · make / let / allow / enable, bị động)
 *                     + ôn tổng ngữ pháp Tập 3: bảng 24 điểm + 30 câu kiểm tra [G34]
 *   Bài 2 Đọc       — Chiến thuật 900 từ / 20 phút, đọc bố cục (bản đồ đoạn), giọng lập luận; Passage 3 lần đầu
 *                     “The Useful Art of Forgetting” — 14 câu (MCQ · Y/N/NG · Matching sentence endings) [R20]
 *   Bài 3 Nghe      — Đề Listening đủ 40 câu lần 2 (AU+UK · US · UK+CA · NZ), nghe một lần, 2 phút kiểm [L16]
 *                     + 🔊 nối âm / âm yếu trong câu causative
 *   Bài tập         — 40 câu + một đoạn viết dùng causative.
 * Mọi bài đọc, kịch bản nghe, câu ví dụ đều tự soạn.
 */
import type { Lesson } from '../data';

/* ───────────────────────── Bài 1 — Ngữ pháp ───────────────────────── */
const D29_NGU_PHAP: Lesson = {
  id: "t3d29-ngu-phap",
  kind: "grammar",
  title: "Ngữ pháp: Causative (have / get something done · make · let · allow) + ôn tổng ngữ pháp Tập 3 — bảng 24 điểm",
  goal: "Nói và viết đúng việc “nhờ / thuê người khác làm” bằng have / get + tân ngữ + V3 (không còn nói “I cut my hair” khi thợ cắt), dùng đúng make · let · allow · enable ở cả chủ động lẫn bị động; rồi ôn lại trọn 24 điểm ngữ pháp của Tập 3 bằng một bảng và 30 câu kiểm tra, biết chính xác điểm nào còn yếu để ôn trước Đề 5 (GRA band 6).",
  minutes: 100,
  blocks: [
    {
      t: "recap",
      title: "Bài này học gì — đẩy band nào",
      items: [
        "**Causative** (thể sai khiến) = mình **không tự làm**, mà nhờ / thuê / bắt / cho phép người khác làm. Tiếng Việt nói “tôi đi cắt tóc”, tiếng Anh phải nói ==I had my hair cut==.",
        "Hai khuôn dịch vụ: ==have / get + vật + V3== (không cần nói ai làm) và ==have + người + V== · ==get + người + to V== (nói rõ ai làm).",
        "Bốn động từ “ép – cho phép”: **make** sb do · **let** sb do · **allow / enable** sb **to** do — và dạng bị động **be made to do · be allowed to do** (let không có bị động).",
        "Đẩy tiêu chí **GRA** (trộn cấu trúc phức, ít lỗi) cho cả Writing Task 2 lẫn Speaking Part 1 – 3. Đây là điểm ngữ pháp **cuối cùng** của Tập 3.",
        "Nửa sau bài: ==bảng 24 điểm== ngữ pháp Tập 3 (Ngày 1 → 29) + 30 câu kiểm tra. Sai câu nào, bảng chỉ thẳng Ngày cần mở lại.",
      ],
    },

    /* ── 1 ── */
    { t: "h", text: "1. Causative là gì? — “tôi cắt tóc” hay “tôi nhờ người cắt tóc”" },
    {
      t: "p",
      text: "Trong tiếng Việt, “hôm qua tôi cắt tóc”, “tôi vừa sửa xe”, “nhà tôi mới sơn lại” đều được hiểu là **có người khác làm cho mình**. Tiếng Anh thì không: ~~I cut my hair yesterday~~ nghĩa là bạn **tự cầm kéo cắt**. Muốn nói có người làm hộ (thường là trả tiền dịch vụ), tiếng Anh dùng một cấu trúc riêng gọi là **causative** — “gây ra việc đó”, tức là mình sắp xếp để việc được làm.",
    },
    {
      t: "sodo",
      kind: "compare",
      title: "Tự làm · bị động · nhờ người làm",
      caption: "Ba câu, ba nghĩa khác nhau.",
      cols: [
        { title: "Chủ động — tự làm", items: ["I **repaired** my laptop.", "Tôi tự tay sửa.", "Người làm = chủ ngữ."] },
        { title: "Bị động — không nói ai nhờ", items: ["My laptop **was repaired**.", "Máy đã được sửa.", "Không biết ai sắp xếp."] },
        { title: "Causative — nhờ / thuê", items: ["I **had** my laptop **repaired**.", "Tôi mang máy đi sửa.", "Tôi sắp xếp, người khác làm."] },
      ],
    },
    {
      t: "p",
      text: "Bạn đã gặp hai mảnh của cấu trúc này: **Ngày 7 (mục 3)** dạy make / let / have / help + tân ngữ + V, và **Ngày 13** dạy bị động be + V3. Causative là chỗ hai mảnh đó ghép lại: **have + vật + V3** thực chất là một câu bị động thu nhỏ nằm sau have (my laptop **was** repaired → I had my laptop repaired).",
    },

    /* ── 2 ── */
    { t: "h", text: "2. have / get + vật + V3 — nhờ, thuê dịch vụ (không cần nói ai làm)" },
    {
      t: "patterns",
      rows: [
        {
          formula: "S + have + O (vật) + V3",
          vi: "Sắp xếp / trả tiền để người khác làm việc gì cho mình. Trung tính, dùng được khi viết.",
          examples: [
            { en: "I have my eyes tested once a year.", vi: "Mỗi năm tôi đi khám mắt một lần." },
            { en: "The council had the old bridge repaired last year.", vi: "Năm ngoái hội đồng thành phố cho sửa cây cầu cũ." },
          ],
        },
        {
          formula: "S + get + O (vật) + V3",
          vi: "Cùng nghĩa, thân mật hơn — rất hay dùng khi NÓI. Còn mang nghĩa “lo cho xong” một việc.",
          examples: [
            { en: "I need to get my phone screen fixed.", vi: "Tôi cần đem điện thoại đi thay màn hình." },
            { en: "We must get this report finished by Friday.", vi: "Chúng ta phải lo cho xong bản báo cáo này trước thứ Sáu." },
          ],
        },
      ],
    },
    {
      t: "p",
      text: "Chỉ có **have / get** được chia thì; V3 đứng yên. Vì vậy đổi thì rất dễ — giống hệt bị động “chỉ chia BE” của Ngày 13.",
    },
    {
      t: "table",
      caption: "have + vật + V3 ở các thì hay gặp",
      head: ["Thì", "Câu mẫu", "Nghĩa"],
      rows: [
        ["Hiện tại đơn", "She **has** her car **serviced** every six months.", "Cô ấy đem xe đi bảo dưỡng sáu tháng một lần."],
        ["Hiện tại tiếp diễn", "We **are having** the kitchen **painted** this week.", "Tuần này nhà tôi đang thuê thợ sơn bếp."],
        ["Quá khứ đơn", "I **had** my passport photo **taken** yesterday.", "Hôm qua tôi đi chụp ảnh hộ chiếu."],
        ["Hiện tại hoàn thành", "He **has** just **had** his laptop **repaired**.", "Anh ấy vừa đem laptop đi sửa xong."],
        ["Tương lai", "I **am going to have** my hair **cut** tomorrow.", "Mai tôi sẽ đi cắt tóc."],
        ["Sau modal", "You **should have** your eyes **tested**.", "Bạn nên đi khám mắt."],
        ["Câu hỏi / phủ định", "**Did** you **have** it **checked**? — I **didn't have** it **checked**.", "Dùng do / does / did như động từ thường."],
      ],
    },
    {
      t: "note",
      title: "⚠️ Bốn lỗi người Việt hay sai với have something done",
      items: [
        "Dịch thẳng “tôi cắt tóc”: ~~I cut my hair at a salon.~~ → **I had my hair cut at a salon.** Thợ cắt thì không được nói I cut.",
        "Sai trật tự: ~~I had cut my hair.~~ (đây là quá khứ hoàn thành = tôi **đã tự cắt** trước một mốc) → **I had my hair cut.** Tân ngữ đứng **giữa** have và V3.",
        "Dùng V nguyên mẫu thay V3: ~~I had my bike repair.~~ → **I had my bike repaired.** Vật “được sửa” ⇒ V3.",
        "Hỏi – phủ định quên trợ động từ: ~~Had you your car washed?~~ → **Did you have your car washed?** Ở đây have là động từ thường.",
      ],
    },
    {
      t: "rule",
      formula: "S + have / get + O (vật) + V3 (+ by …)",
      vi: "Nhờ / thuê người khác làm: chỉ chia have / get; vật đứng giữa; động từ chính luôn ở V3.",
    },
    {
      t: "quiz",
      id: "t3d29-dich-vu-dich",
      title: "Dịch sang tiếng Anh — have / get something done (5 câu)",
      kind: "translate",
      grammar: "S + have / get + vật + V3",
      items: [
        { q: "Tuần trước tôi đi cắt tóc.", answers: ["I had my hair cut last week.", "I got my hair cut last week."], hint: "have / get + my hair + cut (V3 của cut vẫn là cut)" },
        { q: "Chúng tôi đang thuê người sửa mái nhà.", answers: ["We are having the roof repaired.", "We are having our roof repaired.", "We are getting the roof repaired.", "We're having the roof repaired.", "We are having the roof fixed.", "We are getting the roof fixed."], hint: "are having + the roof + repaired" },
        { q: "Bạn nên đem máy tính đi kiểm tra.", answers: ["You should have your computer checked.", "You should get your computer checked."], hint: "should + have / get + your computer + checked" },
        { q: "Cô ấy đi khám mắt hai năm một lần.", answers: ["She has her eyes tested every two years.", "She gets her eyes tested every two years.", "She has her eyes checked every two years.", "She gets her eyes checked every two years."], hint: "has + her eyes + tested + every two years" },
        { q: "Bạn có thuê người sơn nhà không? (quá khứ)", answers: ["Did you have your house painted?", "Did you get your house painted?", "Did you have the house painted?", "Did you get the house painted?"], hint: "Did you have + your house + painted?" },
      ],
    },

    /* ── 3 ── */
    { t: "h", text: "3. have + người + V · get + người + to V — nói rõ AI làm" },
    {
      t: "p",
      text: "Khi muốn nêu **người thực hiện**, tân ngữ là người và động từ phía sau ở **dạng chủ động** (vì người đó tự làm). Hai động từ, hai khuôn khác nhau — chỗ này lệch một chữ **to** là sai.",
    },
    {
      t: "patterns",
      rows: [
        {
          formula: "S + have + O (người) + V",
          vi: "Giao việc cho ai (thường là người có nhiệm vụ làm việc đó). KHÔNG có to.",
          examples: [
            { en: "The manager had her assistant book the tickets.", vi: "Quản lý giao trợ lý đặt vé." },
            { en: "I'll have the technician call you back.", vi: "Tôi sẽ bảo kỹ thuật viên gọi lại cho anh." },
          ],
        },
        {
          formula: "S + get + O (người) + to V",
          vi: "Thuyết phục / nhờ được ai làm gì (có chút công sức). CÓ to.",
          examples: [
            { en: "I got my brother to help me with the essay.", vi: "Tôi nhờ được anh trai giúp bài luận." },
            { en: "It is hard to get teenagers to read books.", vi: "Rất khó làm cho thiếu niên chịu đọc sách." },
          ],
        },
      ],
    },
    {
      t: "table",
      caption: "Vật hay người? — chọn dạng động từ theo tân ngữ",
      head: ["Tân ngữ", "Dạng động từ", "Ví dụ"],
      rows: [
        ["**Vật** (được làm)", "V3", "I had **my car washed**. · I got **my car washed**."],
        ["**Người** — sau have", "V nguyên mẫu không to", "I had **a mechanic check** the brakes."],
        ["**Người** — sau get", "to V", "I got **a mechanic to check** the brakes."],
      ],
    },
    {
      t: "note",
      title: "⚠️ Cẩn thận: lẫn have với get",
      items: [
        "~~I had my friend to help me.~~ → I had my friend **help** me. (have + người + V, không to)",
        "~~I got my friend help me.~~ → I got my friend **to help** me. (get + người + to V)",
        "~~I had the mechanic checked the brakes.~~ → I had the mechanic **check** the brakes. Người **tự làm** ⇒ không dùng V3.",
      ],
    },
    {
      t: "rule",
      formula: "have + O (người) + V  ·  get + O (người) + to V  ·  have / get + O (vật) + V3",
      vi: "Người làm ⇒ động từ chủ động (have: không to; get: có to). Vật được làm ⇒ V3.",
    },
    {
      t: "quiz",
      id: "t3d29-nguoi-dich",
      title: "Dịch sang tiếng Anh — nói rõ ai làm (4 câu)",
      kind: "translate",
      grammar: "have + người + V · get + người + to V",
      items: [
        { q: "Giáo viên bảo học sinh viết lại bài luận. (dùng had)", answers: ["The teacher had the students rewrite the essay.", "The teacher had the students rewrite their essays.", "The teacher had the students rewrite their essay.", "The teacher had students rewrite the essay."], hint: "had + the students + rewrite (không to)" },
        { q: "Tôi nhờ được chị gái đón tôi ở sân bay. (dùng got)", answers: ["I got my sister to pick me up at the airport.", "I got my sister to pick me up from the airport.", "I got my older sister to pick me up at the airport.", "I got my elder sister to pick me up at the airport."], hint: "got + my sister + to pick me up" },
        { q: "Làm sao chúng ta khiến mọi người tái chế nhiều hơn? (dùng get)", answers: ["How can we get people to recycle more?"], hint: "get + people + to recycle" },
        { q: "Tôi sẽ bảo lễ tân gửi email cho bạn. (dùng have)", answers: ["I will have the receptionist email you.", "I'll have the receptionist email you.", "I will have the receptionist send you an email.", "I'll have the receptionist send you an email."], hint: "will have + the receptionist + email / send" },
      ],
    },

    /* ── 4 ── */
    { t: "h", text: "4. have + vật + V3 với nghĩa “bị” — chuyện không may" },
    {
      t: "p",
      text: "Cùng khuôn **have + vật + V3** còn dùng cho việc **không mong muốn** xảy đến với đồ của mình: bị trộm, bị hỏng, bị huỷ. Lúc này chủ ngữ không nhờ ai cả — chủ ngữ là **người chịu thiệt**. Khuôn này rất hợp khi kể chuyện ở Speaking Part 2 (“a time when something went wrong”). Với nghĩa này thường dùng **have**, ít dùng get.",
    },
    {
      t: "examples",
      items: [
        { en: "I had my phone stolen on the bus last month.", vi: "Tháng trước tôi bị trộm điện thoại trên xe buýt." },
        { en: "Thousands of residents had their homes damaged by the flood.", vi: "Hàng nghìn cư dân bị lũ làm hư hại nhà cửa." },
        { en: "She had her visa application rejected twice.", vi: "Cô ấy bị từ chối hồ sơ xin visa hai lần." },
      ],
    },
    {
      t: "note",
      title: "⚠️ Cẩn thận: “tôi bị trộm điện thoại”",
      items: [
        "~~I was stolen my phone.~~ → **I had my phone stolen.** hoặc **My phone was stolen.** Thứ bị trộm là điện thoại, không phải “tôi”.",
        "~~My phone was robbed.~~ → rob đi với **người / nơi** (I was robbed · the bank was robbed); steal đi với **vật** (my phone was stolen).",
      ],
    },
    {
      t: "rule",
      formula: "S (người chịu) + have + O (vật của mình) + V3",
      vi: "Chuyện xui xảy đến với đồ của mình: I had my bike stolen. Không viết I was stolen my bike.",
    },

    /* ── 5 ── */
    { t: "h", text: "5. make · let · allow · enable · force — ép buộc và cho phép" },
    {
      t: "p",
      text: "Nhóm này cũng là causative theo nghĩa rộng: chủ ngữ **khiến** người khác làm (hoặc được làm) một việc. Đây là nhóm ăn điểm nhất trong **Task 2**, vì đề nào cũng bàn chuyện chính phủ, nhà trường, cha mẹ **bắt / cho phép / tạo điều kiện** cho ai làm gì. Ôn từ **Ngày 7 (mục 3)** và nâng thêm phần bị động.",
    },
    {
      t: "table",
      caption: "Năm động từ — có to hay không to?",
      head: ["Động từ", "Chủ động", "Bị động", "Nghĩa"],
      rows: [
        ["**make**", "make sb **do**", "be made **to do**", "bắt, khiến (không có lựa chọn)"],
        ["**let**", "let sb **do**", "— (dùng be allowed to do)", "cho phép (thân mật)"],
        ["**allow / permit**", "allow sb **to do**", "be allowed **to do**", "cho phép (trang trọng)"],
        ["**enable**", "enable sb **to do**", "be enabled to do (hiếm)", "tạo điều kiện, giúp làm được"],
        ["**force / require**", "force sb **to do**", "be forced / required **to do**", "ép buộc / yêu cầu"],
        ["**encourage**", "encourage sb **to do**", "be encouraged **to do**", "khuyến khích"],
      ],
    },
    {
      t: "examples",
      items: [
        { en: "Some schools make students wear a uniform.", vi: "Một số trường bắt học sinh mặc đồng phục." },
        { en: "Students are made to wear a uniform.", vi: "Học sinh bị bắt mặc đồng phục. (bị động: thêm to)" },
        { en: "My parents didn't let me stay out late. = I wasn't allowed to stay out late.", vi: "Bố mẹ không cho tôi đi chơi về khuya." },
        { en: "Online courses enable people in remote areas to gain qualifications.", vi: "Các khoá học trực tuyến giúp người ở vùng xa lấy được bằng cấp." },
        { en: "Drivers should be required to retake their test every ten years.", vi: "Tài xế nên bị yêu cầu thi lại bằng lái mười năm một lần." },
      ],
    },
    {
      t: "note",
      title: "⚠️ Cẩn thận: bốn lỗi band 5 với make / let / allow",
      items: [
        "~~The teacher made us to do extra homework.~~ → made us **do**. Chủ động: make + V **không to**.",
        "~~We were made do extra homework.~~ → We were made **to do**. Bị động của make thì **phải có to**.",
        "~~I wasn't let to go.~~ → I **wasn't allowed to** go. let không dùng ở bị động.",
        "~~The government should allow people use…~~ → allow people **to use**. Và ~~allow to use~~ (thiếu tân ngữ) → **allow people to use** hoặc bị động **people should be allowed to use**.",
      ],
    },
    {
      t: "rule",
      formula: "make / let + O + V  ·  allow / enable / force / encourage + O + to V  ·  be made / allowed / forced + to V",
      vi: "make, let: không to ở chủ động. Bị động của make thêm to; let mượn be allowed to.",
    },
    {
      t: "quiz",
      id: "t3d29-make-let-dich",
      title: "Dịch sang tiếng Anh — make · let · allow · enable (5 câu)",
      kind: "translate",
      grammar: "make / let + O + V · allow / enable + O + to V · be made / allowed + to V",
      items: [
        { q: "Bố mẹ không nên bắt con cái học cả ngày. (dùng make)", answers: ["Parents should not make their children study all day.", "Parents shouldn't make their children study all day.", "Parents should not make children study all day.", "Parents shouldn't make children study all day."], hint: "make + their children + study (không to)" },
        { q: "Công nghệ giúp mọi người làm việc tại nhà. (dùng enable)", answers: ["Technology enables people to work from home.", "Technology enables people to work at home."], hint: "enables + people + to work" },
        { q: "Học sinh không được phép dùng điện thoại trong lớp. (bị động của allow)", answers: ["Students are not allowed to use phones in class.", "Students are not allowed to use their phones in class.", "Students aren't allowed to use phones in class.", "Students aren't allowed to use their phones in class.", "Students are not allowed to use mobile phones in class."], hint: "are not allowed + to use" },
        { q: "Chúng tôi bị bắt phải chờ hai tiếng. (bị động của make)", answers: ["We were made to wait for two hours.", "We were made to wait two hours."], hint: "were made + to wait" },
        { q: "Giáo viên cho chúng tôi dùng từ điển. (dùng let)", answers: ["The teacher let us use a dictionary.", "The teacher let us use dictionaries.", "Our teacher let us use a dictionary.", "The teacher lets us use a dictionary.", "The teacher lets us use dictionaries."], hint: "let + us + use (không to)" },
      ],
    },

    /* ── 6 ── */
    { t: "h", text: "6. need + V-ing · want / would like + vật + V3 — hai khuôn họ hàng" },
    {
      t: "patterns",
      rows: [
        {
          formula: "N (vật) + need + V-ing  =  N + need + to be + V3",
          vi: "Vật “cần được” làm gì. V-ing ở đây mang nghĩa bị động.",
          examples: [
            { en: "The road needs repairing. = The road needs to be repaired.", vi: "Con đường cần được sửa." },
            { en: "Many old buildings need renovating.", vi: "Nhiều toà nhà cũ cần được cải tạo." },
          ],
        },
        {
          formula: "S + want / would like + O (vật) + V3",
          vi: "Muốn việc gì được (người khác) làm xong.",
          examples: [
            { en: "I'd like this document translated by Monday.", vi: "Tôi muốn tài liệu này được dịch xong trước thứ Hai." },
          ],
        },
      ],
    },
    {
      t: "note",
      title: "⚠️ Cẩn thận: need",
      items: [
        "~~The road needs to repair.~~ → The road needs **repairing** / needs **to be repaired**. Con đường không tự sửa được.",
        "Người cần làm gì thì vẫn là need + to V: **The council needs to repair the road.**",
      ],
    },
    {
      t: "rule",
      formula: "N (vật) + need + V-ing  =  N + need + to be + V3",
      vi: "Vật cần được làm gì: The system needs updating. Người cần làm gì: We need to update the system.",
    },

    /* ── 7 ── */
    { t: "h", text: "7. Dùng trong bài thi: band 5 → band 6" },
    {
      t: "table",
      caption: "Cùng một ý — viết / nói lại bằng causative",
      head: ["Ở đâu", "Band 5", "Band 6"],
      rows: [
        ["Speaking Part 1 (Hometown / Home)", "My house is old, so my parents repaired the roof last year. (nghe như bố mẹ tự trèo lên sửa)", "My house is quite old, so my parents **had the roof repaired** last year."],
        ["Speaking Part 2 (a problem)", "Someone stole my wallet on the bus.", "I **had my wallet stolen** on the bus, which was a nightmare."],
        ["Speaking Part 3 (children)", "Parents should force children do housework.", "I think parents should **get their children to do** some housework, but they shouldn't **make them do** everything."],
        ["Task 2 (education)", "Schools should let students to choose subjects.", "Schools should **allow students to choose** some of their subjects. / Students should **be allowed to choose**…"],
        ["Task 2 (technology)", "Because of the Internet, people can work at home.", "The Internet **enables people to work** from home, which reduces commuting."],
        ["Task 2 (government)", "The government should repair old roads.", "Many rural roads **need repairing**, so the government should **have them rebuilt** within five years."],
      ],
    },
    {
      t: "note",
      title: "💡 Mẹo dùng cho tự nhiên",
      items: [
        "**Nói**: ưu tiên **get** (get my hair cut, get it fixed) — nghe tự nhiên hơn have.",
        "**Viết Task 2**: ưu tiên **allow / enable / require / encourage + O + to V** và dạng bị động **be allowed / required to** — trang trọng, đúng giọng học thuật. Tránh let và get trong bài viết.",
        "Mỗi bài viết chỉ cần **1 – 2 câu** causative đúng. Nhồi nhiều không tăng điểm; sai một câu thì lộ ngay.",
      ],
    },
    {
      t: "mcq",
      id: "t3d29-causative-chon",
      title: "Luyện causative — chọn đáp án đúng (10 câu)",
      items: [
        { q: "I ___ at the garage yesterday.", options: ["serviced my car myself", "had my car serviced", "had serviced my car", "had my car service"], correct: 1, why: "Ở garage ⇒ thợ làm ⇒ **had + my car + serviced** (V3)." },
        { q: "The teacher made us ___ the experiment again.", options: ["to do", "doing", "do", "done"], correct: 2, why: "Chủ động: **make + O + V** không to." },
        { q: "We were made ___ outside for an hour.", options: ["to wait", "wait", "waiting", "waited"], correct: 0, why: "Bị động của make: **be made + to V**." },
        { q: "How can governments get people ___ less plastic?", options: ["use", "used", "using", "to use"], correct: 3, why: "**get + người + to V**." },
        { q: "She ___ her bag stolen while she was travelling.", options: ["was", "had", "has been", "did"], correct: 1, why: "Chuyện xui với đồ của mình: **had + her bag + stolen**." },
        { q: "Children under 16 ___ to work at night.", options: ["are not let", "do not allow", "are not allowed", "are not allowing"], correct: 2, why: "let không có bị động ⇒ **are not allowed to**." },
        { q: "The windows are dirty. They need ___.", options: ["cleaning", "to clean", "clean", "cleaned"], correct: 0, why: "Vật cần được làm: **need + V-ing** (= need to be cleaned)." },
        { q: "I'll have the engineer ___ you this afternoon.", options: ["to call", "called", "calling", "call"], correct: 3, why: "**have + người + V** không to." },
        { q: "Scholarships ___ poorer students to go to university.", options: ["make", "enable", "let", "have"], correct: 1, why: "Sau chỗ trống có **to go** ⇒ chỉ enable + O + to V hợp (make / let / have không có to)." },
        { q: "Did you ___ your application form checked before you sent it?", options: ["had", "made", "have", "let"], correct: 2, why: "Sau **Did** là V nguyên mẫu: **have + form + checked**." },
      ],
    },

    /* ── 8 ── */
    { t: "h", text: "8. Ôn tổng ngữ pháp Tập 3 — bảng 24 điểm" },
    {
      t: "p",
      text: "Tập 3 có 15 bài ngữ pháp (các ngày lẻ). Gom lại, đó là **24 điểm** dưới đây — đúng danh sách “ngữ pháp band 6” ở trang Mở đầu: đủ 12 thì, bị động, điều kiện 2 – 3, mệnh đề quan hệ, tường thuật, cụm danh từ. Cách dùng bảng: che cột Ví dụ, nhìn cột Công thức và **tự nói một câu của bạn**. Không nói được trong 5 giây ⇒ đánh dấu, mở lại đúng Ngày ở cột cuối.",
    },
    {
      t: "table",
      caption: "Nhóm A — Thì và mạo từ (điểm 1 – 6)",
      head: ["#", "Điểm ngữ pháp", "Công thức", "Ví dụ band 6", "Ngày"],
      rows: [
        ["1", "Hiện tại hoàn thành tiếp diễn", "S + have / has + been + V-ing + for / since", "I **have been learning** English **for** six years.", "N1"],
        ["2", "Quá khứ hoàn thành", "S + had + V3 (việc trước) … S + V-ed (việc sau)", "By 2010, the figure **had doubled**.", "N1"],
        ["3", "Mạo từ vòng 2: nói chung · the + adj", "Ø + N số nhiều · the + environment / government · the + adj", "**The elderly** need more support from **the government**.", "N3"],
        ["4", "Tương lai tiếp diễn / hoàn thành", "will be + V-ing · will have + V3 (by + mốc)", "By 2050, the population **will have reached** 10 billion.", "N5"],
        ["5", "Dự báo trong Task 1", "is projected / expected / predicted + to V", "Sales **are projected to rise** to 5 million by 2030.", "N5"],
        ["6", "Verb patterns đổi nghĩa", "stop / remember / try / regret + to V ≠ + V-ing", "He **stopped to check** his phone. ≠ He **stopped checking** it.", "N7"],
      ],
    },
    {
      t: "table",
      caption: "Nhóm B — Từ loại, giới từ, so sánh, bị động (điểm 7 – 12)",
      head: ["#", "Điểm ngữ pháp", "Công thức", "Ví dụ band 6", "Ngày"],
      rows: [
        ["7", "Tính từ -ed / -ing", "người cảm thấy: -ed · vật gây ra cảm giác: -ing", "I was **bored** because the lecture was **boring**.", "N7"],
        ["8", "Giới từ phụ thuộc (60 cụm)", "V / adj / N + giới từ cố định (+ N / V-ing)", "This **results in** a **lack of** exercise.", "N9"],
        ["9", "So sánh nâng cao: mức độ, bội số, phân số", "far / slightly + so sánh hơn · twice as … as · a third of", "Rents were **twice as high as** in 2000 — **by far** the highest.", "N11"],
        ["10", "So sánh kép", "The + so sánh hơn + S + V, the + so sánh hơn + S + V", "**The more** people drive, **the worse** the air becomes.", "N11"],
        ["11", "Bị động mọi thì + với modal", "be (chia thì) + V3 · modal + be + V3 · modal + have been + V3", "The problem **could have been avoided**.", "N13"],
        ["12", "Bị động thuật ý kiến chung", "It is + believed / said / argued + that + S + V", "**It is widely believed that** prison does not reduce crime.", "N13"],
      ],
    },
    {
      t: "table",
      caption: "Nhóm C — Giả định, mệnh đề quan hệ, tường thuật (điểm 13 – 19)",
      head: ["#", "Điểm ngữ pháp", "Công thức", "Ví dụ band 6", "Ngày"],
      rows: [
        ["13", "Điều kiện loại 2", "If + S + V-ed, S + would + V", "**If** public transport **were** free, fewer people **would drive**.", "N15"],
        ["14", "Điều kiện loại 3", "If + S + had + V3, S + would have + V3", "**If** I **had studied** harder, I **would have passed**.", "N15"],
        ["15", "wish / if only", "wish + S + V-ed (hiện tại) · had V3 (quá khứ)", "I **wish** I **had started** learning English earlier.", "N15"],
        ["16", "Mệnh đề quan hệ không xác định · “, which”", "N, who / which …, V · S + V, which + V(s/es)", "Rents are rising, **which means** many young people cannot move out.", "N17"],
        ["17", "Rút gọn mệnh đề quan hệ", "N + V-ing (chủ động) · N + V3 (bị động)", "People **living** in cities … · Products **made** in Vietnam …", "N17"],
        ["18", "Tường thuật + động từ tường thuật", "S + said / argued / claimed (that) + S + V lùi thì", "Critics **argue that** the tax is unfair.", "N19"],
        ["19", "Modal suy đoán", "must / might / can't + V · must / might / can't + have + V3", "The fall **may have been caused** by higher prices.", "N19"],
      ],
    },
    {
      t: "table",
      caption: "Nhóm D — Nối ý, mệnh đề danh ngữ, cụm danh từ, dấu câu, causative (điểm 20 – 24)",
      head: ["#", "Điểm ngữ pháp", "Công thức", "Ví dụ band 6", "Ngày"],
      rows: [
        ["20", "Nhượng bộ – đối lập · nguyên nhân – kết quả", "Although + S + V, … · Despite + N / V-ing · because of / due to + N · As a result, …", "**Although** cars are convenient, they pollute the air. · **Despite the cost**, …", "N21"],
        ["21", "Mệnh đề danh ngữ · It is + adj + that / to", "What / Whether / The fact that + S + V … · It is + adj + that / to V", "**What worries me is that** children read less. · **It is essential to** act now.", "N23"],
        ["22", "Cụm danh từ phức + danh hoá mức 1", "(a / the) + adj + N + of / in + N · động từ → danh từ", "**A sharp rise in the number of** tourists · the **growth of** online shopping", "N25"],
        ["23", "Dấu câu + bảng tự soát 6 lượt", "Hai mệnh đề độc lập: dấu chấm · ; · , + and / but / so (không chỉ dấu phẩy)", "~~Prices rose, people bought less.~~ → Prices rose**, so** people bought less.", "N27"],
        ["24", "Causative", "have / get + vật + V3 · make / let + O + V · allow / enable + O + to V", "I **had my laptop repaired**. · Students should **be allowed to choose**.", "N29"],
      ],
    },
    {
      t: "sodo",
      kind: "mindmap",
      title: "24 điểm gom thành 5 nhóm — để nhớ",
      center: "Ngữ pháp band 6",
      branches: [
        { label: "**Thời gian**", items: ["HTHT tiếp diễn", "QK hoàn thành", "TL tiếp diễn / hoàn thành", "dự báo Task 1"] },
        { label: "**Ai làm – bị gì**", items: ["bị động mọi thì + modal", "It is believed that", "causative"] },
        { label: "**Không thật – không chắc**", items: ["điều kiện 2 · 3", "wish / if only", "modal suy đoán"] },
        { label: "**Nối và gói ý**", items: ["mệnh đề quan hệ + rút gọn", "nhượng bộ · nhân quả", "mệnh đề danh ngữ", "cụm danh từ", "tường thuật"] },
        { label: "**Chính xác từng chữ**", items: ["mạo từ", "giới từ phụ thuộc", "-ed / -ing · to V / V-ing", "so sánh", "dấu câu"] },
      ],
    },
    {
      t: "note",
      title: "💡 Cách học bảng 24 điểm trong 20 phút",
      items: [
        "Lượt 1 (8 phút): che cột Ví dụ, mỗi dòng **tự nói một câu về chính bạn**. Đánh dấu ✗ dòng nào ngập ngừng.",
        "Lượt 2 (7 phút): chỉ các dòng ✗ — mở mục **Tra cứu công thức** của Tập 3, đọc lại rule 1 dòng, viết 2 câu.",
        "Lượt 3 (5 phút): làm 30 câu ở mục 9. Câu sai ghi vào **sổ lỗi** kèm số thứ tự điểm (#1 – #24).",
      ],
    },

    /* ── 9 ── */
    { t: "h", text: "9. Kiểm tra ôn tổng — 30 câu (đạt ≥ 21/30)" },
    {
      t: "p",
      text: "24 câu trắc nghiệm — **mỗi câu một điểm** của bảng, theo đúng thứ tự #1 → #24 — rồi 6 câu dịch trộn điểm. Làm một mạch 20 phút, không mở bảng. Sai câu số mấy thì ôn điểm số đó.",
    },
    {
      t: "mcq",
      id: "t3d29-on-tong",
      title: "Ôn tổng ngữ pháp Tập 3 (24 câu — câu n kiểm điểm #n)",
      items: [
        { q: "She ___ for the same company since she graduated.", options: ["is working", "has been working", "works", "had worked"], correct: 1, why: "#1 — kéo dài từ quá khứ tới giờ + since ⇒ **has been working** (N1)." },
        { q: "By the time the police arrived, the thieves ___.", options: ["escaped", "have escaped", "had escaped", "were escaping"], correct: 2, why: "#2 — việc xảy ra **trước** một mốc quá khứ ⇒ **had + V3** (N1)." },
        { q: "___ should pay a higher rate of tax.", options: ["The rich", "The riches", "Rich", "A rich"], correct: 0, why: "#3 — **the + adj** = cả nhóm người, động từ số nhiều (N3)." },
        { q: "By 2040, scientists ___ a cure for the disease.", options: ["will find", "are finding", "will be found", "will have found"], correct: 3, why: "#4 — by + mốc tương lai ⇒ **will have + V3** (N5)." },
        { q: "The number of electric cars ___ to double by 2030.", options: ["projects", "is projected", "is projecting", "will project"], correct: 1, why: "#5 — dự báo Task 1: **is projected + to V** (N5)." },
        { q: "I'll never forget ___ the sea for the first time.", options: ["to see", "see", "seeing", "seen"], correct: 2, why: "#6 — forget + **V-ing** = quên một việc **đã** xảy ra (N7)." },
        { q: "The results of the survey were very ___.", options: ["surprising", "surprised", "surprise", "surprisingly"], correct: 0, why: "#7 — vật gây cảm giác ⇒ **-ing** (N7)." },
        { q: "Many health problems result ___ a poor diet.", options: ["in", "of", "by", "from"], correct: 3, why: "#8 — result **from** + nguyên nhân; result **in** + kết quả (N9)." },
        { q: "Rents in the capital are ___ as in other cities.", options: ["twice higher", "twice as high", "two times high", "as twice high"], correct: 1, why: "#9 — bội số: **twice as + adj + as** (N11)." },
        { q: "The more you practise, ___ you become.", options: ["the more confident", "more confident", "the most confident", "the confident"], correct: 0, why: "#10 — **The more …, the more …** (N11)." },
        { q: "This mistake ___ if the data had been checked.", options: ["could avoid", "could be avoid", "could have been avoided", "could have avoided"], correct: 2, why: "#11 — modal + **have been + V3**: lẽ ra đã có thể được tránh (N13)." },
        { q: "___ that stress is one of the main causes of illness.", options: ["It believes", "It is believe", "People is believed", "It is believed"], correct: 3, why: "#12 — **It is believed that** + mệnh đề (N13)." },
        { q: "If I ___ more free time, I would learn to play the piano.", options: ["have", "had", "would have", "had had"], correct: 1, why: "#13 — trái hiện tại: **If + V-ed, would + V** (N15)." },
        { q: "If the government had acted earlier, the river ___.", options: ["would not have been polluted", "would not be polluting", "will not be polluted", "had not been polluted"], correct: 0, why: "#14 — trái quá khứ: **would (not) have + V3**; con sông bị ô nhiễm ⇒ bị động (N15)." },
        { q: "I wish I ___ so much money last month.", options: ["didn't spend", "wouldn't spend", "hadn't spent", "haven't spent"], correct: 2, why: "#15 — ước về **quá khứ** ⇒ **had (not) + V3** (N15)." },
        { q: "More people now work from home, ___ reduces traffic.", options: ["that", "what", "it", "which"], correct: 3, why: "#16 — **, which** thay cho cả ý đứng trước; không dùng that sau dấu phẩy (N17)." },
        { q: "Students ___ part-time often have less time to study.", options: ["work", "working", "worked", "are working"], correct: 1, why: "#17 — rút gọn chủ động: students **who work** → students **working** (N17)." },
        { q: "The minister ___ that taxes would not rise.", options: ["told", "said us", "claimed", "spoke"], correct: 2, why: "#18 — **claim that…**; told cần tân ngữ người (told us that), spoke không đi với that (N19)." },
        { q: "The lights are off and nobody answers. They ___ out.", options: ["must have gone", "must go", "can't have gone", "should go"], correct: 0, why: "#19 — suy đoán chắc về việc **đã** xảy ra: **must have + V3** (N19)." },
        { q: "___ the high cost, many families still choose private schools.", options: ["Although", "Because of", "However", "Despite"], correct: 3, why: "#20 — sau chỗ trống là **cụm danh từ** ⇒ Despite (Although + mệnh đề) (N21)." },
        { q: "___ worries many parents is the amount of time children spend online.", options: ["That", "What", "Which", "It"], correct: 1, why: "#21 — mệnh đề danh ngữ làm chủ ngữ: **What worries… is…** (N23)." },
        { q: "There has been ___ of people working from home.", options: ["sharp rising in number", "a sharply rise of the number", "a sharp rise in the number", "a sharp rise on numbers"], correct: 2, why: "#22 — cụm danh từ: **a + adj + rise + in + the number of** (N25)." },
        { q: "Câu nào chấm câu ĐÚNG?", options: ["Prices rose sharply; as a result, sales fell.", "Prices rose sharply, sales fell.", "Prices rose sharply, as a result sales fell.", "Prices rose sharply as a result, sales fell."], correct: 0, why: "#23 — hai mệnh đề độc lập không nối chỉ bằng dấu phẩy; dùng **; as a result,** hoặc dấu chấm (N27)." },
        { q: "My laptop was very slow, so I ___ at a shop near my house.", options: ["had fixed it", "fixed it by a shop", "had it fix", "had it fixed"], correct: 3, why: "#24 — nhờ dịch vụ: **had + it + fixed** (V3) (N29)." },
      ],
    },
    {
      t: "quiz",
      id: "t3d29-on-tong-dich",
      title: "Ôn tổng — dịch sang tiếng Anh (6 câu, trộn điểm)",
      kind: "translate",
      grammar: "Trộn: #1 · #13 · #16 · #20 · #12 · #24",
      items: [
        { q: "Tôi đã học tiếng Anh được sáu năm rồi (và vẫn đang học).", answers: ["I have been learning English for six years.", "I've been learning English for six years.", "I have been studying English for six years.", "I've been studying English for six years."], hint: "#1 — have been + V-ing + for" },
        { q: "Nếu vé rẻ hơn, nhiều người sẽ đi tàu hơn.", answers: ["If tickets were cheaper, more people would travel by train.", "If tickets were cheaper, more people would take the train.", "If tickets were cheaper, more people would go by train.", "If the tickets were cheaper, more people would travel by train.", "If the tickets were cheaper, more people would take the train."], hint: "#13 — If + were, would + V" },
        { q: "Nhiều người trẻ chuyển lên thành phố, điều này gây áp lực lên nhà ở.", answers: ["Many young people move to cities, which puts pressure on housing.", "Many young people move to the city, which puts pressure on housing.", "Many young people are moving to cities, which puts pressure on housing.", "Many young people move to cities, which puts pressure on accommodation."], hint: "#16 — , which + puts pressure on" },
        { q: "Mặc dù năng lượng mặt trời sạch, nó vẫn đắt.", answers: ["Although solar energy is clean, it is still expensive.", "Although solar power is clean, it is still expensive.", "Although solar energy is clean, it's still expensive.", "Though solar energy is clean, it is still expensive."], hint: "#20 — Although + S + V, S + V (không thêm but)" },
        { q: "Người ta tin rằng đọc sách cải thiện trí nhớ. (bắt đầu bằng It)", answers: ["It is believed that reading improves memory.", "It is believed that reading books improves memory.", "It is believed that reading improves our memory.", "It is believed that reading improves the memory."], hint: "#12 — It is believed that + S + V" },
        { q: "Tôi bị trộm xe đạp tuần trước. (bắt đầu bằng I)", answers: ["I had my bike stolen last week.", "I had my bicycle stolen last week."], hint: "#24 — had + my bike + stolen" },
      ],
    },
    {
      t: "table",
      caption: "Đọc kết quả 30 câu",
      head: ["Điểm", "Nghĩa là", "Việc cần làm"],
      rows: [
        ["**26 – 30**", "Ngữ pháp Tập 3 đã chắc — GRA sẵn sàng cho band 6", "Chỉ soát sổ lỗi, sang bài Đọc."],
        ["**21 – 25**", "Đạt. Còn 1 – 2 nhóm chưa tự động", "Mỗi câu sai: mở Ngày tương ứng, đọc lại rule + làm lại bài dịch của mục đó."],
        ["**≤ 20**", "Chưa đạt — đừng vội thi Đề 5", "Dành thêm một buổi: ôn nhóm sai nhiều nhất (A / B / C / D) rồi làm lại 30 câu vào hôm sau."],
      ],
    },
  ],
};
/* ───────────────────────── Bài 2 — Đọc ───────────────────────── */
const D29_DOC: Lesson = {
  id: "t3d29-doc",
  kind: "reading",
  title: "Đọc: Chiến thuật 900 từ / 20 phút — đọc bố cục, và Passage 3 lần đầu",
  goal: "Nắm bố cục một bài đọc 900 từ trong 3 phút bằng “bản đồ đoạn”, nhận ra giọng lập luận của Passage 3 (ai nói gì, tác giả nghĩ gì), rồi làm trọn một Passage 3 gồm 14 câu (Multiple choice · Yes / No / Not Given · Matching sentence endings) trong đúng 20 phút — mục tiêu ≥ 8/14 (Reading band 6).",
  minutes: 75,
  blocks: [
    {
      t: "recap",
      title: "Bài này học gì — đẩy band nào",
      items: [
        "**Passage 3** là bài khó nhất của đề Reading: dài ~900 từ, là một bài **lập luận** (có nhiều ý kiến, có quan điểm tác giả), không phải bài kể – tả như Passage 1.",
        "Band 6 cần 23 – 26/40. Thường là: Passage 1 ≥ 10 · Passage 2 ≥ 8 · ==Passage 3 ≥ 6 – 8==. Hôm nay bạn làm Passage 3 **lần đầu** với mục tiêu ≥ 8/14.",
        "Kỹ thuật chính: ==đọc bố cục 3 phút== → ghi **bản đồ đoạn** (mỗi đoạn 3 – 5 chữ) → làm câu hỏi 15 phút → 2 phút soát, không bỏ trống.",
        "Nối **Tập 2 Ngày 24** (phân giờ 17 – 20 – 23, thứ tự làm bài) và **Tập 3 Ngày 1** (skim, đọc câu hỏi trước, paraphrase 4 mức), **Ngày 23** (Yes / No / Not Given, từ cực đoan), **Ngày 27** (đủ 3 passage 60 phút).",
        "Ba dạng trong bài hôm nay đều đã học: Multiple choice (Ngày 11), Y / N / NG (Ngày 23), Matching sentence endings (Tập 2 Ngày 18). Hôm nay học cách làm chúng **trên văn bản lập luận, đúng giờ**.",
      ],
    },

    /* ── 1 ── */
    { t: "h", text: "1. Passage 3 khác Passage 1 – 2 ở đâu?" },
    {
      t: "table",
      caption: "Ba passage của đề Academic Reading",
      head: ["", "Passage 1", "Passage 2", "Passage 3"],
      rows: [
        ["**Kiểu văn bản**", "Mô tả, kể: lịch sử một phát minh, một loài vật", "Mô tả + giải thích, thường có tiêu đề đoạn", "**Lập luận**: nêu một quan điểm cũ, đưa bằng chứng, đánh giá, kết luận có mức độ"],
        ["**Độ dài**", "~700 – 800 từ", "~800 – 900 từ", "~850 – 950 từ, câu dài 30 – 40 từ"],
        ["**Dạng câu hay gặp**", "T / F / NG, điền từ, bảng", "Matching headings, matching information, summary", "**Multiple choice, Yes / No / Not Given, matching endings / features, summary hộp từ**"],
        ["**Câu hỏi hỏi gì**", "Chi tiết: ai, khi nào, bao nhiêu", "Ý chính từng đoạn, chi tiết ở đâu", "**Quan điểm** của tác giả, mục đích của một ví dụ, ý của cả đoạn"],
        ["**Thời gian nên dành**", "17 phút", "20 phút", "**20 – 23 phút**"],
      ],
    },
    {
      t: "p",
      text: "Điểm khác lớn nhất: ở Passage 3, đáp án hiếm khi nằm trong **một từ** để bạn dò (scan). Nó nằm trong **ý của cả câu hoặc cả đoạn**, và thường gắn với câu hỏi “tác giả **nghĩ gì** về điều này?”. Vì vậy người chỉ quen dò từ khoá sẽ đúng Passage 1 mà rơi gần hết Passage 3. Thuốc chữa là hiểu **bố cục lập luận** trước khi đọc câu hỏi.",
    },
    {
      t: "note",
      title: "📌 Khuôn lập luận hay gặp nhất của Passage 3",
      items: [
        "**Đoạn đầu**: quan điểm cũ / điều mọi người vẫn tin → câu xoay bằng **Yet / However / But** → luận điểm của bài.",
        "**Các đoạn giữa**: mỗi đoạn một bằng chứng hoặc một nhà nghiên cứu; cuối đoạn thường có một câu **đánh giá** của tác giả.",
        "**Đoạn áp chót**: hệ quả thực tế (vậy ta nên làm gì).",
        "**Đoạn cuối**: giới hạn của lập luận (**There are limits… / Of course…**) + kết luận có mức độ (**Even so… / Nevertheless…**).",
      ],
    },

    /* ── 2 ── */
    { t: "h", text: "2. Đọc bố cục 900 từ trong 3 phút — bản đồ đoạn" },
    {
      t: "p",
      text: "900 từ đọc kỹ từng chữ mất 6 – 7 phút, và đọc xong vẫn chưa trả lời được câu nào. Đọc **bố cục** (skim có mục đích) chỉ mất 3 phút và cho bạn một thứ quý hơn: biết **đoạn nào nói về gì**, để mỗi câu hỏi bạn đi thẳng tới đúng đoạn.",
    },
    {
      t: "sodo",
      kind: "flow",
      title: "3 phút đọc bố cục",
      caption: "Đọc bằng mắt, tay ghi 3 – 5 chữ cạnh mỗi đoạn (thi máy: dùng nút Notes hoặc giấy nháp).",
      steps: [
        { label: "**Tiêu đề + dòng phụ**", sub: "10 giây: chủ đề gì? có chữ nào báo quan điểm (myth, useful, rethinking)?" },
        { label: "**Trọn đoạn đầu**", sub: "40 giây: tìm câu xoay Yet / However → đó là luận điểm của bài." },
        { label: "**Câu đầu mỗi đoạn giữa**", sub: "15 giây / đoạn: đoạn này là bằng chứng, ví dụ, hay phản đề? Thấy tên riêng, năm → khoanh." },
        { label: "**Trọn đoạn cuối**", sub: "30 giây: kết luận mạnh hay có mức độ? Tác giả đứng về phía nào?" },
        { label: "**Liếc tên các dạng câu hỏi**", sub: "20 giây: có mấy dạng, dạng nào theo thứ tự bài." },
      ],
    },
    {
      t: "table",
      caption: "Mẫu bản đồ đoạn (bạn sẽ tự ghi cho bài đọc ở mục 5 rồi so với bản mẫu ở mục 6)",
      head: ["Đoạn", "Ghi 3 – 5 chữ", "Vai trong lập luận"],
      rows: [
        ["A", "quan điểm cũ → luận điểm", "Mở: điều mọi người tin + Yet…"],
        ["B", "nghiên cứu đầu tiên + hạn chế", "Bằng chứng 1 (và phê bình)"],
        ["C – E", "mỗi đoạn một thí nghiệm / một nhóm người", "Bằng chứng 2 – 4"],
        ["F", "vậy nên học thế nào", "Hệ quả thực tế"],
        ["G", "giới hạn + kết", "Nhượng bộ rồi kết luận"],
      ],
    },
    {
      t: "note",
      title: "⚠️ Ba cách đọc bố cục sai",
      items: [
        "**Đọc kỹ từ đầu** vì sợ sót: hết 7 phút mới tới câu hỏi ⇒ thiếu giờ cho 3 – 4 câu cuối (mất trắng).",
        "**Bỏ luôn bước đọc bố cục**, nhảy vào câu 27: mỗi câu phải dò lại cả bài ⇒ chậm hơn, và hay chọn nhầm câu có từ giống.",
        "**Dừng lại tra từ lạ** khi đang skim: lúc này chỉ cần biết đoạn nói về gì. Từ lạ chỉ đoán khi câu hỏi **chạm** tới nó (quy trình 4 bước, Ngày 9).",
      ],
    },
    {
      t: "rule",
      formula: "Tiêu đề → trọn đoạn đầu → câu đầu mỗi đoạn → trọn đoạn cuối → ghi bản đồ đoạn (3 phút)",
      vi: "Chưa có bản đồ đoạn thì chưa đọc câu hỏi. Có bản đồ rồi, mỗi câu hỏi chỉ đọc kỹ MỘT đoạn.",
    },

    /* ── 3 ── */
    { t: "h", text: "3. Phân 20 phút cho một passage 900 từ" },
    {
      t: "table",
      caption: "Đồng hồ cho Passage 3 (14 câu)",
      head: ["Phút", "Việc", "Ghi chú"],
      rows: [
        ["0 – 3", "Đọc bố cục + ghi bản đồ đoạn", "Không trả lời câu nào trong 3 phút này."],
        ["3 – 10", "Dạng **theo thứ tự bài** trước: Multiple choice, Y / N / NG", "~1 phút 20 giây / câu. Câu nào quá 2 phút ⇒ chọn tạm, đánh dấu, đi tiếp."],
        ["10 – 16", "Dạng tiếp theo (thường cũng theo thứ tự): Y / N / NG hoặc summary", "Đáp án câu sau nằm **sau** đáp án câu trước — không đọc ngược lên."],
        ["16 – 19", "Dạng **không theo thứ tự**: matching endings / features", "Lúc này bạn đã đọc kỹ gần hết bài nên làm rất nhanh."],
        ["19 – 20", "Soát: không ô trống, đúng chính tả, đúng YES / NO (không ghi TRUE / FALSE)", "Câu chưa chắc: giữ lựa chọn đầu, trừ khi tìm được bằng chứng mới."],
      ],
    },
    {
      t: "note",
      title: "💡 Mẹo thứ tự làm cả đề 60 phút (ôn Tập 2 Ngày 24 · Tập 3 Ngày 27)",
      items: [
        "Mặc định **1 → 2 → 3**, phân giờ **17 – 20 – 23**. Passage 1 dễ nhất: phải lấy ≥ 10 câu ở đây.",
        "Nếu ở Ngày 27 bạn luôn thiếu giờ cho Passage 3: thử đặt **giới hạn cứng** — hết phút 17 rời Passage 1, hết phút 37 rời Passage 2, dù còn câu.",
        "Thi máy không có 10 phút chép đáp án: mọi đáp án gõ **ngay** khi làm. Hai phút cuối chỉ để soát.",
      ],
    },

    /* ── 4 ── */
    { t: "h", text: "4. Ai nói? Tác giả nghĩ gì? — đọc giọng lập luận" },
    {
      t: "p",
      text: "Câu hỏi Passage 3 hay bẫy bằng cách lấy **ý của người khác** (một nhà nghiên cứu, “nhiều người”, quan điểm cũ) rồi hỏi “the writer…”. Muốn không sập, khi đọc phải luôn tự hỏi: **câu này là giọng của ai?** Bảng dưới là các tín hiệu cần thuộc.",
    },
    {
      t: "table",
      caption: "Tín hiệu giọng trong văn bản lập luận",
      head: ["Tín hiệu", "Ví dụ", "Nghĩa là"],
      rows: [
        ["Quan điểm cũ / số đông", "was treated as… · It might be assumed that… · textbooks presented it as…", "**Chưa chắc** là ý tác giả — thường sắp bị phản bác."],
        ["Xoay ý", "Yet… · However… · nevertheless… · Even so…", "Ý **sau** từ này mới là ý tác giả ủng hộ."],
        ["Tường thuật người khác", "researchers proposed that… · the authors argued… · on this view…", "Ý của **nhà nghiên cứu** (ôn động từ tường thuật, Ngày 19)."],
        ["Tác giả đánh giá", "admirably rigorous · striking · a more persuasive view · poorly matched", "Tính từ / trạng từ đánh giá = **quan điểm tác giả** → đáp án câu Y / N / NG và MCQ."],
        ["Nói có mức độ (hedging)", "suggests · appears to · seems to · may · partly · not entirely", "Tác giả **không khẳng định 100 %** → đáp án chứa always / all / proves thường sai."],
        ["Nhượng bộ", "This picture is intuitive, and it is not entirely wrong. · There are, of course, limits…", "Tác giả công nhận một phần phía bên kia — hay ra câu hỏi."],
      ],
    },
    {
      t: "mcq",
      id: "t3d29-doc-giong",
      title: "Khởi động — câu này là giọng của ai? (4 câu)",
      items: [
        { q: "“It might be assumed that such a gift would guarantee success at school…” — ý “trí nhớ siêu việt bảo đảm thành công” là của ai?", options: ["Một giả định phổ biến mà tác giả sắp phản bác", "Tác giả khẳng định", "Một nhà nghiên cứu có tên", "Không thể biết"], correct: 0, why: "**It might be assumed that…** báo một giả định thông thường; thường theo sau là **but…** để bác." },
        { q: "“Ebbinghaus's method was admirably rigorous, but it had an unintended consequence.” — Tác giả nghĩ gì về phương pháp này?", options: ["Hoàn toàn tin tưởng", "Hoàn toàn bác bỏ", "Khen cách làm nhưng chỉ ra một hệ quả không hay", "Không nêu ý kiến"], correct: 2, why: "**admirably rigorous** = khen; **but … unintended consequence** = hạn chế. Đáp án đúng phải có **cả hai** vế." },
        { q: "“The benefit appears to depend on a certain amount of forgetting.” — Câu hỏi viết: “The benefit **definitely** depends on forgetting.” Chọn gì?", options: ["YES — cùng ý", "Cẩn thận: appears to ≠ definitely, câu hỏi nói mạnh hơn bài", "NOT GIVEN vì không có chữ definitely", "NO vì bài nói ngược lại"], correct: 1, why: "**appears to** là nói có mức độ. Câu hỏi đẩy lên **definitely** ⇒ không khớp ý tác giả (ôn từ cực đoan, Ngày 23)." },
        { q: "“On this view, forgetting is partly something the brain does.” — Cụm **on this view** cho biết gì?", options: ["Đây là sự thật đã được chứng minh", "Tác giả phản đối ý này", "Đây là ví dụ minh hoạ", "Đây là kết luận rút ra từ cách nhìn vừa trình bày"], correct: 3, why: "**On this view** = theo cách nhìn này — tác giả đang tóm ý của hướng nghiên cứu vừa nêu, và có chữ **partly** để giữ mức độ." },
      ],
    },

    /* ── 5 ── */
    { t: "h", text: "5. Passage 3 — làm đúng 20 phút" },
    {
      t: "p",
      text: "Đặt đồng hồ **20 phút**. Ba phút đầu chỉ đọc bố cục và ghi bản đồ đoạn ra giấy (A → G). Sau đó làm Questions 27 – 40 theo đúng thứ tự in. Không tra từ điển. Hết giờ thì dừng — câu chưa làm, **đoán** cho đủ rồi mới xem đáp án.",
    },
    {
      t: "passage",
      title: "The Useful Art of Forgetting",
      intro: "READING PASSAGE 3 — You should spend about 20 minutes on Questions 27–40, which are based on the passage below.",
      paras: [
        { label: "A", text: "For most of the twentieth century, forgetting was treated as the enemy of learning. Students were told to fight it with repetition, and psychologists described it mainly as decay: a memory, once formed, simply faded like ink in sunlight unless it was regularly refreshed. This picture is intuitive, and it is not entirely wrong. Yet a growing body of research suggests that it is seriously incomplete. Many scientists now argue that forgetting is not merely a failure of the memory system but one of its essential functions – and that a brain which could not forget would be a far less useful instrument than the one we have." },
        { label: "B", text: "The first systematic study of forgetting was carried out in the 1880s by the German psychologist Hermann Ebbinghaus, who memorised lists of meaningless syllables and tested himself at intervals. His results, plotted as the famous ‘forgetting curve’, showed that most of the loss occurs quickly, within the first day, after which the decline becomes much more gradual. Ebbinghaus's method was admirably rigorous, but it had an unintended consequence. Because he had deliberately chosen material with no meaning, his curve described how people forget things that do not matter to them. For decades, textbooks nevertheless presented it as a general law of memory, encouraging the belief that all knowledge leaks away at the same depressing rate." },
        { label: "C", text: "Later work complicated this picture. Experiments in the 1990s showed that the act of recalling one item can make related items harder to retrieve. Volunteers who repeatedly practised remembering some words from a category – ‘orange’, say, from a list of fruit – afterwards found it more difficult to recall the fruit they had not practised than words from categories they had not touched at all. The implication is striking: the brain does not simply allow unused memories to fade; it actively suppresses the competitors of the memory it wants. Forgetting, on this view, is partly something the brain does rather than something that happens to it." },
        { label: "D", text: "Why would evolution favour such a system? One answer comes from thinking about what memory is for. In a widely discussed review published in 2017, two researchers at the University of Toronto proposed that the purpose of memory is not to preserve the past as faithfully as possible but to guide intelligent decisions in the future. A world that changes constantly punishes creatures that cling to outdated information: the animal that remembers exactly where food was found last year, but cannot let go of that memory when the supply moves, is at a disadvantage. Forgetting old details, the authors argued, keeps behaviour flexible. It also helps us to generalise. Someone who remembered every dog they had ever met in perfect detail might struggle to form the simple, useful concept ‘dog’." },
        { label: "E", text: "Evidence from the small number of people with extraordinary autobiographical memory points the same way. These individuals can recall what they did, wore and ate on almost any date in their adult lives. It might be assumed that such a gift would guarantee success at school or at work, but the people concerned do not generally perform better than average on standard tests of learning, and several have described their memory as a burden. Painful episodes return with the same emotional force years afterwards, and trivial details crowd in uninvited. Whether these cases tell us much about ordinary minds is debatable, since they are so rare; but they offer little support for the idea that remembering more is always better." },
        { label: "F", text: "None of this means that students should stop revising. What it does suggest is that the traditional strategy – reading the same notes again and again until they feel familiar – is poorly matched to how memory works. Laboratory and classroom studies have consistently found that information is retained longer when study sessions are spread out and when learners test themselves rather than re-read. Curiously, the benefit appears to depend on a certain amount of forgetting between sessions. Retrieving a fact that has begun to slip away takes effort, and it is this effort, rather than the repetition itself, that seems to strengthen the memory. A fact revised while it is still fresh is recalled easily and gains almost nothing." },
        { label: "G", text: "There are, of course, limits to the argument. The forgetting that accompanies diseases of old age is a loss, not an adaptation, and nobody should confuse the two. Nor do we yet understand how the brain ‘decides’ which memories to keep; proposals involving sleep and emotional significance are plausible but remain difficult to test in humans. Even so, the shift in thinking is real. A century ago, a perfect memory would have been regarded as the ideal towards which education should strive. Today, a more persuasive view is that a good memory is a selective one, and that the ability to lose information gracefully is part of what makes the human mind efficient. Students who understand this may feel less anxious when they cannot remember everything – and may plan their revision more wisely." },
      ],
    },
    {
      t: "p",
      text: "**Questions 27 – 31.** Choose the correct letter, **A, B, C or D**.",
    },
    {
      t: "mcq",
      id: "t3d29-doc-mcq",
      title: "Questions 27–31 — Multiple choice",
      items: [
        {
          q: "27. In paragraph A, what does the writer say about the traditional idea that memories simply decay?",
          options: ["It has been shown to be completely mistaken.", "It is partly right but leaves out something important.", "It is no longer taught to students.", "It is supported by a growing body of research."],
          correct: 1,
          why: "Đoạn A: “**not entirely wrong**. Yet… **seriously incomplete**” = đúng một phần nhưng thiếu. A sai vì “completely mistaken” quá mạnh; D lấy nguyên cụm “a growing body of research” nhưng nghiên cứu ấy nói điều **ngược lại**.",
        },
        {
          q: "28. What problem does the writer identify with Ebbinghaus's research?",
          options: ["He used only himself as a subject.", "His results were plotted inaccurately.", "Conclusions based on meaningless material were applied too widely.", "The intervals between his tests were too short."],
          correct: 2,
          why: "Đoạn B: ông chọn vật liệu vô nghĩa nên đường cong chỉ tả cách quên **thứ không quan trọng**, vậy mà sách “**presented it as a general law of memory**”. A có thật trong bài (tested himself) nhưng tác giả **không nêu nó là vấn đề** — bẫy “đúng nhưng không trả lời câu hỏi”.",
        },
        {
          q: "29. The experiments carried out in the 1990s showed that",
          options: ["practising some items made other items of the same kind harder to recall.", "words from categories that were not used were forgotten fastest.", "names of fruit are more difficult to remember than other words.", "unused memories fade at a steady rate."],
          correct: 0,
          why: "Đoạn C: “recalling one item can make **related items harder to retrieve**”. B ngược: từ thuộc nhóm **không đụng tới** lại dễ nhớ hơn. D là quan điểm cũ mà đoạn này bác (“does not simply allow unused memories to fade”).",
        },
        {
          q: "30. The writer mentions an animal and its food supply in order to illustrate",
          options: ["the fact that animals have poorer memories than humans.", "the danger of holding on to information that is no longer true.", "the way memory records the past accurately.", "the need to form general concepts."],
          correct: 1,
          why: "Đoạn D: sinh vật “**cling to outdated information**” bị thiệt; con vật “cannot let go of that memory when the supply moves”. D là ý của ví dụ **khác** (con chó) ở cuối đoạn — bẫy “đúng đoạn, sai ví dụ”.",
        },
        {
          q: "31. What does the writer suggest about people with extraordinary autobiographical memory?",
          options: ["They are usually very successful in education.", "They prove that ordinary people should try to remember less.", "Their emotional memories become weaker over time.", "Their unusual memory can bring problems as well as abilities."],
          correct: 3,
          why: "Đoạn E: họ nhớ gần như mọi ngày (khả năng) nhưng “described their memory as **a burden**”, ký ức đau trở lại nguyên vẹn. A bị bác (“do not generally perform better”); B quá mạnh — tác giả còn nói các ca này “debatable”; C ngược (“the same emotional force”).",
        },
      ],
    },
    {
      t: "p",
      text: "**Questions 32 – 36.** Do the following statements agree with the claims of the writer in Reading Passage 3? Chọn **YES** nếu câu khớp với ý tác giả · **NO** nếu trái với ý tác giả · **NOT GIVEN** nếu không thể biết tác giả nghĩ gì về điều này.",
    },
    {
      t: "mcq",
      id: "t3d29-doc-ynng",
      title: "Questions 32–36 — Yes / No / Not Given",
      items: [
        { q: "32. Reading notes repeatedly until they seem familiar is an effective way to revise.", options: ["YES", "NO", "NOT GIVEN"], correct: 1, why: "Đoạn F: chiến lược này “is **poorly matched** to how memory works” ⇒ trái ý tác giả ⇒ NO." },
        { q: "33. Learners remember information for longer if they test themselves instead of re-reading.", options: ["YES", "NO", "NOT GIVEN"], correct: 0, why: "Đoạn F: “information is **retained longer** when… learners **test themselves rather than re-read**” ⇒ YES (retained longer = remember for longer)." },
        { q: "34. Most students prefer spreading out their study sessions to studying in one long session.", options: ["YES", "NO", "NOT GIVEN"], correct: 2, why: "Bài nói học giãn cách **hiệu quả hơn**, không hề nói học sinh **thích** cách nào ⇒ NOT GIVEN. Bẫy: có đúng từ khoá (spread out, sessions) nhưng hỏi một điều khác." },
        { q: "35. Revising a fact immediately after learning it greatly improves how well it is remembered.", options: ["YES", "NO", "NOT GIVEN"], correct: 1, why: "Đoạn F, câu cuối: “A fact revised while it is still fresh… **gains almost nothing**” ⇒ NO." },
        { q: "36. The memory loss caused by illnesses of old age is a different thing from normal, useful forgetting.", options: ["YES", "NO", "NOT GIVEN"], correct: 0, why: "Đoạn G: “is **a loss, not an adaptation**, and nobody should **confuse the two**” ⇒ YES." },
      ],
    },
    {
      t: "p",
      text: "**Questions 37 – 40.** Complete each sentence with the correct ending, **A – F**, below. (Có 6 đuôi câu cho 4 câu — thừa 2.)",
    },
    {
      t: "table",
      caption: "Sentence endings",
      head: ["", "Ending"],
      rows: [
        ["**A**", "demands an effort that makes the memory stronger."],
        ["**B**", "preserves every detail of past experience."],
        ["**C**", "memory loss is fastest shortly after learning."],
        ["**D**", "can be improved by learning lists of meaningless material."],
        ["**E**", "the main role of memory is to help with future choices."],
        ["**F**", "is one that keeps some things and lets others go."],
      ],
    },
    {
      t: "quiz",
      id: "t3d29-doc-duoi",
      title: "Questions 37–40 — ghi MỘT chữ cái (A–F)",
      kind: "fill",
      items: [
        { q: "37. Ebbinghaus's forgetting curve shows that ___", answers: ["C"], hint: "Đoạn B — đường cong dốc ở đâu?" },
        { q: "38. The researchers in Toronto proposed that ___", answers: ["E"], hint: "Đoạn D — memory is for…" },
        { q: "39. Recalling a fact that is beginning to be forgotten ___", answers: ["A"], hint: "Đoạn F — it is this effort…" },
        { q: "40. According to the writer, a good memory ___", answers: ["F"], hint: "Đoạn G — a selective one" },
      ],
    },

    /* ── 6 ── */
    { t: "h", text: "6. Chữa bài — bản đồ đoạn và từng câu" },
    {
      t: "table",
      caption: "Bản đồ đoạn mẫu — so với bản bạn tự ghi",
      head: ["Đoạn", "Bản đồ (3 – 5 chữ)", "Câu hỏi rơi vào"],
      rows: [
        ["A", "quên = suy tàn? chưa đủ → quên là **chức năng**", "27"],
        ["B", "Ebbinghaus, đường cong quên — **vật liệu vô nghĩa**", "28 · 37"],
        ["C", "thập niên 1990: nhớ cái này **đè** cái liên quan", "29"],
        ["D", "2017 Toronto: trí nhớ để **quyết định tương lai**; con vật, con chó", "30 · 38"],
        ["E", "người nhớ siêu việt — **gánh nặng**", "31"],
        ["F", "ôn thi: giãn cách + tự kiểm tra; cần **gắng sức**", "32 – 35 · 39"],
        ["G", "giới hạn (bệnh tuổi già, chưa rõ cơ chế) → trí nhớ tốt = **chọn lọc**", "36 · 40"],
      ],
    },
    {
      t: "note",
      title: "Giải thích Questions 37–40 (Matching sentence endings)",
      items: [
        "**37 — C.** Đoạn B: “most of the loss occurs **quickly, within the first day**” = memory loss is fastest shortly after learning. Đuôi D bẫy bằng “meaningless material” — bài không hề nói học danh sách vô nghĩa giúp cải thiện trí nhớ.",
        "**38 — E.** Đoạn D: “the purpose of memory is… to **guide intelligent decisions in the future**” = help with future choices. Đuôi B (“preserves every detail”) là điều họ **phủ nhận** (“not to preserve the past as faithfully as possible”).",
        "**39 — A.** Đoạn F: “Retrieving a fact that has begun to slip away **takes effort**, and it is this effort… that seems to **strengthen the memory**”.",
        "**40 — F.** Đoạn G: “a good memory is **a selective one**” = keeps some things and lets others go.",
        "Cách làm: đọc **nửa đầu câu** trước, tìm đúng đoạn bằng tên riêng / từ khoá (Ebbinghaus, Toronto), đọc kỹ 1 – 2 câu ở đó, **tự nói ý bằng lời mình**, rồi mới nhìn danh sách đuôi. Kiểm thêm **ngữ pháp**: sau “shows that / proposed that” phải là một **mệnh đề** (C, E); sau chủ ngữ “Recalling… / a good memory” phải là **động từ** (A, B, D, F).",
      ],
    },
    {
      t: "table",
      caption: "Paraphrase trong bài — 8 cặp đáng chép vào sổ",
      head: ["Trong câu hỏi", "Trong bài", "Kiểu paraphrase"],
      rows: [
        ["partly right but leaves out something important", "not entirely wrong… seriously incomplete", "đồng nghĩa + đổi cấu trúc"],
        ["applied too widely", "presented it as a general law of memory", "diễn giải ý"],
        ["harder to recall", "harder to retrieve", "đồng nghĩa"],
        ["holding on to information that is no longer true", "cling to outdated information", "đồng nghĩa (cụm động từ ↔ động từ)"],
        ["bring problems as well as abilities", "described their memory as a burden", "khái quát hoá"],
        ["remember … for longer", "is retained longer", "chủ động ↔ bị động"],
        ["immediately after learning it", "while it is still fresh", "diễn giải ý"],
        ["keeps some things and lets others go", "a selective one", "giải nghĩa một tính từ"],
      ],
    },
    {
      t: "vocab",
      items: [
        { w: "decay", pos: "n / v", ipa: "/dɪˈkeɪ/", vi: "sự suy tàn, phân rã; mục nát dần", ex: "Psychologists once described forgetting mainly as decay.", exVi: "Các nhà tâm lý học từng mô tả việc quên chủ yếu là sự suy tàn.", more: "tooth decay (sâu răng) · urban decay (sự xuống cấp đô thị)" },
        { w: "retrieve", pos: "v", ipa: "/rɪˈtriːv/", vi: "lấy lại, truy xuất (thông tin)", ex: "Recalling one item can make related items harder to retrieve.", exVi: "Nhớ lại một mục có thể làm các mục liên quan khó truy xuất hơn.", more: "retrieval (n) · retrieve data / information" },
        { w: "suppress", pos: "v", ipa: "/səˈpres/", vi: "kìm nén, dập, ức chế", ex: "The brain actively suppresses competing memories.", exVi: "Bộ não chủ động ức chế các ký ức cạnh tranh.", more: "suppression (n) · suppress a feeling / a protest" },
        { w: "outdated", pos: "adj", ipa: "/ˌaʊtˈdeɪtɪd/", vi: "lỗi thời, không còn đúng", ex: "Creatures that cling to outdated information are at a disadvantage.", exVi: "Sinh vật bám vào thông tin lỗi thời sẽ bị bất lợi.", more: "= out of date · outdated methods / equipment" },
        { w: "burden", pos: "n", ipa: "/ˈbɜːdn/", vi: "gánh nặng", ex: "Several of them described their memory as a burden.", exVi: "Vài người trong số họ mô tả trí nhớ của mình là một gánh nặng.", more: "a financial burden · place a burden on sb" },
        { w: "retain", pos: "v", ipa: "/rɪˈteɪn/", vi: "giữ lại, lưu giữ", ex: "Information is retained longer when study sessions are spread out.", exVi: "Thông tin được lưu lâu hơn khi các buổi học được giãn ra.", more: "AWL 4 (Ngày 8) · retention (n)" },
        { w: "plausible", pos: "adj", ipa: "/ˈplɔːzəbl/", vi: "nghe hợp lý, có thể đúng", ex: "These proposals are plausible but difficult to test.", exVi: "Các đề xuất này nghe hợp lý nhưng khó kiểm chứng.", more: "≠ implausible · a plausible explanation" },
        { w: "selective", pos: "adj", ipa: "/sɪˈlektɪv/", vi: "có chọn lọc", ex: "A good memory is a selective one.", exVi: "Một trí nhớ tốt là một trí nhớ có chọn lọc.", more: "select (v) → selection (n) → selective (adj)" },
      ],
    },

    /* ── 7 ── */
    { t: "h", text: "7. Năm bẫy của Passage 3 — và cách tự chấm" },
    {
      t: "table",
      caption: "Bẫy hôm nay bạn vừa gặp",
      head: ["Bẫy", "Gặp ở câu", "Cách tránh"],
      rows: [
        ["**Đúng trong bài nhưng không trả lời câu hỏi**", "28 (A: tested himself)", "Đọc lại **câu hỏi**: hỏi “vấn đề tác giả nêu” chứ không hỏi “chi tiết nào có thật”."],
        ["**Mượn nguyên cụm từ của bài**", "27 (D: a growing body of research)", "Lựa chọn chép y chữ trong bài thường là bẫy; đáp án thật hay được paraphrase."],
        ["**Đúng đoạn, sai ví dụ**", "30 (D: general concepts)", "Xác định đúng **câu** chứa ví dụ được hỏi, đọc câu ngay trước nó."],
        ["**Nói quá mức tác giả**", "27 (A: completely) · 31 (B: prove)", "Gạch chân từ mức độ trong lựa chọn: completely, always, prove, all."],
        ["**Có từ khoá nhưng hỏi chuyện khác**", "34 (prefer)", "Y / N / NG: tìm **động từ chính** của câu hỏi (prefer ≠ is retained longer) trước khi dò từ khoá."],
      ],
    },
    {
      t: "table",
      caption: "Tự chấm Passage 3 (14 câu)",
      head: ["Số câu đúng", "Mức", "Việc cần làm"],
      rows: [
        ["**11 – 14**", "Trên mức band 6 cho Passage 3", "Lần sau ép còn 18 phút."],
        ["**8 – 10**", "Đúng mức band 6", "Xem lại câu sai thuộc bẫy nào ở bảng trên, ghi vào sổ lỗi."],
        ["**5 – 7**", "Gần đạt", "Nếu sai nhiều ở 32 – 36 ⇒ ôn **Ngày 23**; sai nhiều ở 27 – 31 ⇒ ôn **Ngày 11**; không kịp giờ ⇒ luyện lại mục 2 với bài đọc Ngày 27."],
        ["**≤ 4**", "Chưa đạt", "Đọc lại bài **không bấm giờ**, tự dịch từng đoạn, rồi ba ngày sau làm lại. Ôn Ngày 1 (paraphrase 4 mức)."],
      ],
    },
    {
      t: "rule",
      formula: "Passage 3 = 3 phút bố cục + 15 phút trả lời (dạng theo thứ tự trước) + 2 phút soát — luôn hỏi “giọng của ai?”",
      vi: "Mục tiêu band 6: ≥ 8/14 ở Passage 3, không ô trống. Đáp án nói mạnh hơn tác giả (always, prove, completely) gần như luôn sai.",
    },
  ],
};
/* ───────────────────────── Bài 3 — Nghe ───────────────────────── */
const D29_NGHE: Lesson = {
  id: "t3d29-nghe",
  kind: "listening",
  title: "Nghe: Đề Listening đủ 40 câu lần 2 — nghe một lần, 2 phút kiểm",
  goal: "Làm trọn một đề Listening 40 câu (Part 1 Note completion · Part 2 Multiple choice + Matching · Part 3 Multiple choice + Matching · Part 4 Note completion) đúng như thi máy — nghe một lần, không tua, 2 phút kiểm cuối — đạt ≥ 23/40 (band 6.0) và biết mình rơi điểm ở Part nào, vì bẫy gì.",
  minutes: 75,
  blocks: [
    {
      t: "recap",
      title: "Bài này học gì — đẩy band nào",
      items: [
        "Đây là **đề Listening đủ 40 câu lần 2** của Tập 3 (lần 1 ở Ngày 21). Mục tiêu cuối tập: ==≥ 23/40 = band 6.0==.",
        "Luật hôm nay: **nghe MỘT lần**, không dừng, không tua, không xem lời. Bốn Part làm liền nhau, khoảng 30 phút. Chấm xong mới được nghe lại.",
        "Ôn kỹ năng **L16** (nối Tập 2 Ngày 19 · Tập 3 Ngày 1 · 16): lỡ một câu thì bỏ, nghe câu kế; cuối bài có ==2 phút kiểm== chính tả, số ít – số nhiều, giới hạn số từ.",
        "Bốn giọng: Part 1 **Úc + Anh** · Part 2 **Mỹ** · Part 3 **Anh + Canada** · Part 4 **New Zealand** — đủ các giọng đã luyện trong tập.",
        "Sau khi chấm: điền **bảng phân tích lỗi** (sai vì chính tả · vì bẫy đổi ý · vì lỡ nhịp · vì từ vựng) — đây là thứ quyết định bạn ôn gì trước Đề 5.",
      ],
    },

    { t: "h", text: "Trước khi bắt đầu — 3 phút chuẩn bị" },
    {
      t: "table",
      caption: "Mục tiêu từng Part cho band 6",
      head: ["Part", "Dạng hôm nay", "Giọng", "Mục tiêu"],
      rows: [
        ["1 (câu 1 – 10)", "Note completion — ONE WORD AND/OR A NUMBER", "Úc + Anh", "**8 – 9** / 10 — điểm dễ, không được rơi vì chính tả"],
        ["2 (câu 11 – 20)", "Multiple choice (A / B / C) + Matching (A – G)", "Mỹ", "**6 – 7** / 10"],
        ["3 (câu 21 – 30)", "Multiple choice + Matching (A – G)", "Anh + Canada", "**5 – 6** / 10"],
        ["4 (câu 31 – 40)", "Note completion — ONE WORD ONLY", "New Zealand", "**5 – 6** / 10"],
      ],
    },
    {
      t: "note",
      title: "📌 Làm như phòng thi máy",
      items: [
        "Đeo tai nghe, chuẩn bị giấy nháp. Trước mỗi Part, **đọc câu hỏi 30 giây**: gạch từ khoá, đoán loại từ (danh từ? số? tên riêng?).",
        "Gõ đáp án **ngay khi nghe**. Thi máy không có 10 phút chép đáp án — chỉ có 2 phút kiểm cuối bài.",
        "**Lỡ một câu**: gõ đại một đáp án hợp ngữ pháp (hoặc để trống tạm), chuyển mắt xuống câu kế ngay. Tiếc một câu là mất ba câu.",
        "Người nói **đổi ý** (Actually… / Sorry, that's the old… / But now…) ⇒ đáp án là thông tin **sau cùng**.",
        "Xong Part 4: đặt đồng hồ **2 phút** soát theo bảng ở cuối bài, rồi mới bấm chấm.",
      ],
    },

    /* ── PART 1 ── */
    { t: "h", text: "PART 1 — Questions 1–10: Evening cookery course" },
    {
      t: "p",
      text: "Complete the notes below. Write **ONE WORD AND/OR A NUMBER** for each answer.",
    },
    {
      t: "table",
      caption: "HARBOUR STREET COOKERY SCHOOL — course enquiry",
      head: ["Mục", "Ghi chú"],
      rows: [
        ["Course", "‘Flavours of Asia’ — suitable for beginners"],
        ["Day", "every **(1) ___** evening, 6.30 – 9.00"],
        ["Length", "**(2) ___** weeks"],
        ["Class size", "maximum **(3) ___** people"],
        ["Fee", "£ **(4) ___** if booked before the end of the month (ingredients included)"],
        ["Bring", "an **(5) ___** and a **(6) ___** for taking food home"],
        ["Teacher", "Mrs **(7) ___**"],
        ["Evening entrance", "on **(8) ___** Lane"],
        ["Parking", "free after 6 p.m. in the **(9) ___** car park"],
        ["Customer", "Daniel Whitlock — allergic to **(10) ___**"],
      ],
    },
    {
      t: "listen",
      id: "t3d29-nghe-p1",
      title: "Part 1 — A phone call to a cookery school",
      note: "Nghe MỘT lần. Giọng Úc (Kelly) và giọng Anh (Daniel).",
      dan: { so: "Day 29, Practice Test, Part 1", boiCanh: "a telephone conversation between a receptionist at a cookery school and a man who wants to join an evening course.", cau: [1, 10] },
      lines: [
        { who: "Kelly", voice: "au-nu", text: "Good morning, Harbour Street Cookery School, Kelly speaking. How can I help?" },
        { who: "Daniel", voice: "uk-nam", text: "Oh, hi. I saw your advert for evening courses, and I'd like some information about the Asian cooking one, please." },
        { who: "Kelly", voice: "au-nu", text: "Sure — that's ‘Flavours of Asia’. It's our most popular course. Have you been to any of our classes before?" },
        { who: "Daniel", voice: "uk-nam", text: "No, never. I'm pretty much a beginner. Is that a problem?" },
        { who: "Kelly", voice: "au-nu", text: "Not at all, it's designed for beginners. Now, last term it ran on Tuesdays, but the teacher's changed, so from this term it's every Thursday evening." },
        { who: "Daniel", voice: "uk-nam", text: "Thursday's fine. What time?" },
        { who: "Kelly", voice: "au-nu", text: "Half past six till nine." },
        { who: "Daniel", voice: "uk-nam", text: "And how long does the course last? The advert said ten weeks, I think." },
        { who: "Kelly", voice: "au-nu", text: "That's the old leaflet, sorry. We've shortened it — it's eight weeks now, but each session is half an hour longer, so you cover the same dishes." },
        { who: "Daniel", voice: "uk-nam", text: "OK. Are the classes big?" },
        { who: "Kelly", voice: "au-nu", text: "Well, the kitchen has sixteen cooking stations, but we only take twelve people, so that everyone gets enough help." },
        { who: "Daniel", voice: "uk-nam", text: "That sounds good. And the cost?" },
        { who: "Kelly", voice: "au-nu", text: "The full fee is two hundred and ten pounds. But if you book before the end of this month, it's a hundred and eighty-five. That includes all the ingredients." },
        { who: "Daniel", voice: "uk-nam", text: "Great, I'll book now, then. Do I need to bring anything? Knives, for example?" },
        { who: "Kelly", voice: "au-nu", text: "No, we provide knives and all the equipment. You just need an apron — we don't supply those any more — and a container, so that you can take your food home afterwards." },
        { who: "Daniel", voice: "uk-nam", text: "An apron and a container. Got it. And who's the teacher?" },
        { who: "Kelly", voice: "au-nu", text: "It's Mrs Okafor. That's O-K-A-F-O-R. She ran a restaurant in Melbourne for fifteen years." },
        { who: "Daniel", voice: "uk-nam", text: "Lovely. Now, I've never been to the school. Is it actually on Harbour Street?" },
        { who: "Kelly", voice: "au-nu", text: "The building is, but the entrance for evening classes is round the corner, on Mill Lane — that's M-I-double L. The Harbour Street door is locked after five." },
        { who: "Daniel", voice: "uk-nam", text: "Mill Lane. And is there anywhere to park?" },
        { who: "Kelly", voice: "au-nu", text: "Don't use the supermarket car park — they charge you after one hour. The library car park, just opposite our entrance, is free after six p.m." },
        { who: "Daniel", voice: "uk-nam", text: "Perfect." },
        { who: "Kelly", voice: "au-nu", text: "Can I take your name?" },
        { who: "Daniel", voice: "uk-nam", text: "Daniel Whitlock. W-H-I-T-L-O-C-K." },
        { who: "Kelly", voice: "au-nu", text: "And is there anything you can't eat, Daniel? Are you vegetarian?" },
        { who: "Daniel", voice: "uk-nam", text: "No, I eat meat and fish. But I'm allergic to nuts, so I have to be careful." },
        { who: "Kelly", voice: "au-nu", text: "I'll make a note of that for Mrs Okafor. Right, you're booked on the course, and I'll email you a confirmation this afternoon." },
      ],
    },
    {
      t: "quiz",
      id: "t3d29-de-p1",
      title: "Questions 1–10 — ONE WORD AND/OR A NUMBER",
      kind: "fill",
      items: [
        { q: "1. Day: every ___ evening", answers: ["Thursday", "thursday"] },
        { q: "2. Length: ___ weeks", answers: ["8", "eight"] },
        { q: "3. Class size: maximum ___ people", answers: ["12", "twelve"] },
        { q: "4. Fee (early booking): £ ___", answers: ["185", "one hundred and eighty-five", "a hundred and eighty-five"] },
        { q: "5. Bring: an ___", answers: ["apron"] },
        { q: "6. … and a ___ for taking food home", answers: ["container"] },
        { q: "7. Teacher: Mrs ___", answers: ["Okafor", "okafor"] },
        { q: "8. Evening entrance: on ___ Lane", answers: ["Mill", "mill"] },
        { q: "9. Parking: free after 6 p.m. in the ___ car park", answers: ["library"] },
        { q: "10. Allergic to ___", answers: ["nuts"] },
      ],
    },

    /* ── PART 2 ── */
    { t: "h", text: "PART 2 — Questions 11–20: Volunteering at a science museum" },
    {
      t: "p",
      text: "**Questions 11 – 15.** Choose the correct letter, **A, B or C**. Sau đó **Questions 16 – 20**: What does the speaker say about each area of the museum? Choose **FIVE** answers from the box (**A – G**).",
    },
    {
      t: "table",
      caption: "Questions 16–20 — Features (thừa 2 lựa chọn)",
      head: ["", "Feature"],
      rows: [
        ["**A**", "It has just reopened after repairs."],
        ["**B**", "It is the busiest area at weekends."],
        ["**C**", "Volunteers need extra training to work there."],
        ["**D**", "It is mainly used by school groups."],
        ["**E**", "It has the fewest visitors."],
        ["**F**", "Volunteers there should speak a second language."],
        ["**G**", "It will close next month."],
      ],
    },
    {
      t: "listen",
      id: "t3d29-nghe-p2",
      title: "Part 2 — A talk for new museum volunteers",
      note: "Nghe MỘT lần. Giọng Mỹ. Câu 11 – 15 đi trước, 16 – 20 theo đúng thứ tự khu vực trong đề.",
      dan: { so: "Day 29, Practice Test, Part 2", boiCanh: "the volunteer coordinator of a science museum talking to a group of new volunteers.", cau: [11, 20] },
      lines: [
        { who: "Coordinator", voice: "us-nu", text: "Hi, everyone, and welcome to Riverside Science Museum. I'm Dana, the volunteer coordinator, and I'd like to tell you a little about the museum and about what you'll be doing here." },
        { who: "Coordinator", voice: "us-nu", text: "First, the building itself. Because of the old tracks you can still see outside, a lot of visitors assume this used to be a railway station. In fact, it was built in 1925 as a power station — the tracks were only for bringing in coal. The warehouses next door are much newer, and they don't belong to us." },
        { who: "Coordinator", voice: "us-nu", text: "So, what will you actually do? Some people expect to give guided tours, but those are led by our paid guides, who have science degrees. And you won't be selling tickets or handling money. Your main job is simply to be in the galleries and answer visitors' questions — where things are, how an exhibit works, what time the next show starts." },
        { who: "Coordinator", voice: "us-nu", text: "Now, time. We used to ask volunteers for one full day a week, and frankly we lost a lot of good people that way. So the rule now is one half-day every week, either morning or afternoon. A few of you asked whether you could come just twice a month. I'm afraid that isn't enough — you'd forget everything between visits." },
        { who: "Coordinator", voice: "us-nu", text: "What do you get in return? Well, parking is for full-time staff only, sorry. In the café you get twenty percent off, so lunch isn't free, but it's cheap. What is completely free is entry to all our special exhibitions — and you can bring a guest." },
        { who: "Coordinator", voice: "us-nu", text: "On your first day, please don't wait at the main entrance — it doesn't open until ten. Come at nine fifteen to the education center, which is the glass door at the side of the building. We'll give you your badge there, and later in the morning someone will show you the staff office on the second floor." },
        { who: "Coordinator", voice: "us-nu", text: "Let me finish by telling you about the five areas where volunteers work. The Ocean Gallery, on the first floor, was closed for three months because of a leak in the roof. The repairs are finished, and it opened again last week, so some of the signs are still missing — be patient." },
        { who: "Coordinator", voice: "us-nu", text: "Next to it is the Space Dome, where we show films about the planets. It's popular, but the staff control the line, so that isn't your job. However, because volunteers there help with the projector and the emergency exits, you can't work in the Dome until you've done an additional two-hour training session with our technician." },
        { who: "Coordinator", voice: "us-nu", text: "The Invention Lab is a workshop space. Families do wander in occasionally, but nearly every weekday it's booked by classes of students with their teachers, so that's who you'll mostly be helping." },
        { who: "Coordinator", voice: "us-nu", text: "Then there's the Body Zone, with the giant heart you can walk through. On a Saturday or Sunday, nowhere in the museum is as crowded as this — we need at least four volunteers there. By the way, a second language is always useful with tourists, but that matters more at the information desk than in any gallery." },
        { who: "Coordinator", voice: "us-nu", text: "Finally, the Garden Terrace on the roof. Hardly anyone finds it — on some days fewer than fifty people go up there — so it's a calm place to start if you're feeling nervous. And one last thing: the Dinosaur Hall closes next month for rebuilding, so we won't be placing volunteers there." },
      ],
    },
    {
      t: "mcq",
      id: "t3d29-de-p2-chon",
      title: "Questions 11–15 — Multiple choice",
      items: [
        { q: "11. The museum building was originally", options: ["a railway station.", "a power station.", "a warehouse."], correct: 1, why: "“a lot of visitors **assume** … railway station. **In fact**, it was built in 1925 as a **power station**.” Warehouses là toà bên cạnh." },
        { q: "12. The main job of volunteers is to", options: ["give guided tours.", "sell tickets.", "answer visitors' questions."], correct: 2, why: "Tours do hướng dẫn viên được trả lương dẫn; không bán vé; “Your main job is… **answer visitors' questions**”." },
        { q: "13. Volunteers must work at least", options: ["one half-day a week.", "one full day a week.", "two half-days a month."], correct: 0, why: "“We **used to** ask… one full day” (cũ) → “the rule **now** is one half-day every week”; hai lần một tháng “isn't enough”." },
        { q: "14. Which of these do volunteers get free of charge?", options: ["lunch in the café", "entry to special exhibitions", "parking"], correct: 1, why: "Bãi xe chỉ cho nhân viên; café giảm 20 % (“lunch **isn't free**”); “completely free is **entry to all our special exhibitions**”." },
        { q: "15. On their first day, volunteers should go to", options: ["the main entrance.", "the staff office on the second floor.", "the education center."], correct: 2, why: "“please **don't** wait at the main entrance… Come… to the **education center**”; phòng nhân viên chỉ được dẫn tới **sau đó**." },
      ],
    },
    {
      t: "quiz",
      id: "t3d29-de-p2-noi",
      title: "Questions 16–20 — ghi MỘT chữ cái (A–G)",
      kind: "fill",
      items: [
        { q: "16. Ocean Gallery ___", answers: ["A"] },
        { q: "17. Space Dome ___", answers: ["C"] },
        { q: "18. Invention Lab ___", answers: ["D"] },
        { q: "19. Body Zone ___", answers: ["B"] },
        { q: "20. Garden Terrace ___", answers: ["E"] },
      ],
    },

    /* ── PART 3 ── */
    { t: "h", text: "PART 3 — Questions 21–30: A research report on bottled water" },
    {
      t: "p",
      text: "**Questions 21 – 25.** Choose the correct letter, **A, B or C**. Sau đó **Questions 26 – 30**: What do the students decide to do about each section of their report? Choose **FIVE** answers from the box (**A – G**).",
    },
    {
      t: "table",
      caption: "Questions 26–30 — Decisions (thừa 2 lựa chọn)",
      head: ["", "Decision"],
      rows: [
        ["**A**", "make it shorter"],
        ["**B**", "add a graph"],
        ["**C**", "move it to the appendix"],
        ["**D**", "rewrite the opening"],
        ["**E**", "check the figures again"],
        ["**F**", "leave it as it is"],
        ["**G**", "ask the tutor for advice"],
      ],
    },
    {
      t: "listen",
      id: "t3d29-nghe-p3",
      title: "Part 3 — Two students discussing their report",
      note: "Nghe MỘT lần. Priya (giọng Anh) và Marcus (giọng Canada).",
      dan: { so: "Day 29, Practice Test, Part 3", boiCanh: "two business students, Priya and Marcus, discussing a research report they are writing about bottled water.", cau: [21, 30] },
      lines: [
        { who: "Priya", voice: "uk-nu", text: "So, Marcus, we need to finish this bottled-water report by Friday. Shall we go through it?" },
        { who: "Marcus", voice: "ca-nam", text: "Sure. You know, people keep asking why we chose this topic. I tell them it came from Dr Hale's lecture on consumer behaviour." },
        { who: "Priya", voice: "uk-nu", text: "Did it, though? The lecture was three weeks after we'd started. I thought it was because we kept seeing students all over campus carrying bottles, when there are free water fountains on every floor." },
        { who: "Marcus", voice: "ca-nam", text: "You're right, that was it. The lecture just gave us some theory later." },
        { who: "Priya", voice: "uk-nu", text: "The taste test was fun. I honestly expected the expensive brand to win, or maybe tap water, just to prove a point." },
        { who: "Marcus", voice: "ca-nam", text: "And neither happened." },
        { who: "Priya", voice: "uk-nu", text: "No! What amazed me was that forty-one out of sixty people simply couldn't say which was which. They were guessing." },
        { who: "Marcus", voice: "ca-nam", text: "The survey is the part I'm less happy with. Two hundred responses is plenty, and nobody complained that the questions were confusing. But nearly everyone who answered was between eighteen and twenty-two. We can't say anything about older consumers." },
        { who: "Priya", voice: "uk-nu", text: "That's fair. We should admit that. What about the reasons people gave for buying bottles? I assumed it would be health — you know, ‘it's cleaner’." },
        { who: "Marcus", voice: "ca-nam", text: "Some said that, and a few mentioned taste. But the biggest group by far just said it's easier: you grab a bottle between lectures and you don't have to carry anything around." },
        { who: "Priya", voice: "uk-nu", text: "Yes, I agree — it's convenience above everything else. Oh, and did you read Dr Hale's comments on the draft?" },
        { who: "Marcus", voice: "ca-nam", text: "I did. I thought she'd want more statistics, but she said we've got enough numbers. Her advice was to stop listing six different suggestions and concentrate on a single, clear recommendation." },
        { who: "Priya", voice: "uk-nu", text: "OK. Let's go through the sections, then. The introduction — I find it dull. It starts with a dictionary definition of bottled water." },
        { who: "Marcus", voice: "ca-nam", text: "Agreed. The rest of it is fine, but let's write a new first paragraph, starting with that figure about how many bottles are sold on campus each week." },
        { who: "Priya", voice: "uk-nu", text: "Good. Now the literature review. It's eight hundred words, and the whole report is only two thousand." },
        { who: "Marcus", voice: "ca-nam", text: "I wondered about moving it to the appendix, but you can't really do that with a literature review. We'll just have to cut it down to about four hundred." },
        { who: "Priya", voice: "uk-nu", text: "Fine. The method section?" },
        { who: "Marcus", voice: "ca-nam", text: "Dr Hale said it was clear, and the questionnaire is already in the appendix. I wouldn't touch it." },
        { who: "Priya", voice: "uk-nu", text: "Me neither. Then the results. I've checked the figures twice already, so they're right, but that big table is really hard to read." },
        { who: "Marcus", voice: "ca-nam", text: "What if we kept the table and put a simple bar chart next to it, showing the three main reasons?" },
        { who: "Priya", voice: "uk-nu", text: "Yes, let's do that. And finally the conclusion. I'm not sure whether we're allowed to include our own opinion there, or the calculation of how much a student could save in a year." },
        { who: "Marcus", voice: "ca-nam", text: "I don't know either, and I don't want to guess. Let's email Dr Hale and see what she says before we write it." },
        { who: "Priya", voice: "uk-nu", text: "OK. I'll send that this afternoon." },
      ],
    },
    {
      t: "mcq",
      id: "t3d29-de-p3-chon",
      title: "Questions 21–25 — Multiple choice",
      items: [
        { q: "21. Why did the students choose bottled water as their topic?", options: ["A lecture gave them the idea.", "One of them used to work for a water company.", "They noticed how many students on campus were buying it."], correct: 2, why: "Marcus nói do bài giảng, Priya **sửa lại**: bài giảng diễn ra **sau** khi đã bắt đầu; lý do thật là thấy sinh viên khắp trường cầm chai. Marcus: “You're right, that was it.”" },
        { q: "22. What surprised Priya about the taste test?", options: ["Most people preferred tap water.", "Most people could not tell the types of water apart.", "Most people preferred the most expensive brand."], correct: 1, why: "Cô **đã đoán** A hoặc C; “neither happened”. “forty-one out of sixty… **couldn't say which was which**”." },
        { q: "23. Marcus thinks the main weakness of the survey was that", options: ["too few people answered.", "the questions were unclear.", "almost all the people who answered were the same age."], correct: 2, why: "200 phiếu “is plenty”; không ai thấy câu hỏi khó hiểu; “**nearly everyone… between eighteen and twenty-two**”." },
        { q: "24. The students agree that the main reason people buy bottled water is", options: ["convenience.", "health.", "taste."], correct: 0, why: "Priya **tưởng** là health; Marcus: nhóm lớn nhất nói “it's **easier**”; Priya: “I agree — it's **convenience** above everything else.”" },
        { q: "25. Their tutor advised them to", options: ["include more statistics.", "focus on one clear recommendation.", "interview managers of water companies."], correct: 1, why: "“I thought she'd want more statistics, **but**… concentrate on **a single, clear recommendation**.”" },
      ],
    },
    {
      t: "quiz",
      id: "t3d29-de-p3-noi",
      title: "Questions 26–30 — ghi MỘT chữ cái (A–G)",
      kind: "fill",
      items: [
        { q: "26. Introduction ___", answers: ["D"] },
        { q: "27. Literature review ___", answers: ["A"] },
        { q: "28. Method ___", answers: ["F"] },
        { q: "29. Results ___", answers: ["B"] },
        { q: "30. Conclusion ___", answers: ["G"] },
      ],
    },

    /* ── PART 4 ── */
    { t: "h", text: "PART 4 — Questions 31–40: Sand, a hidden resource" },
    {
      t: "p",
      text: "Complete the notes below. Write **ONE WORD ONLY** for each answer.",
    },
    {
      t: "table",
      caption: "SAND — A HIDDEN RESOURCE",
      head: ["Phần", "Notes"],
      rows: [
        ["**Uses**", "• the natural resource humans use most after **(31) ___**"],
        ["", "• the main ingredient of concrete and of **(32) ___**"],
        ["", "• very pure sand is needed to make computer **(33) ___**"],
        ["**Why desert sand is unsuitable**", "• its grains have been shaped by the **(34) ___**, so they are too smooth and round"],
        ["", "• grains of river sand have sharp **(35) ___** and lock together"],
        ["", "• one desert city bought sand from **(36) ___**"],
        ["**Effects of removing sand from rivers**", "• banks collapse; serious damage to **(37) ___**"],
        ["", "• underground water level falls → problems for **(38) ___**"],
        ["", "• sandy river beds are where many **(39) ___** breed"],
        ["**Solutions**", "• crushed rock or recycled concrete instead of river sand"],
        ["", "• buildings designed to use more **(40) ___**"],
      ],
    },
    {
      t: "listen",
      id: "t3d29-nghe-p4",
      title: "Part 4 — A lecture about sand",
      note: "Nghe MỘT lần. Giọng New Zealand. Không có quãng nghỉ giữa bài — đọc trước cả 10 câu.",
      dan: { so: "Day 29, Practice Test, Part 4", boiCanh: "part of a lecture about sand as a natural resource.", cau: [31, 40] },
      lines: [
        { who: "Lecturer", voice: "nz-nu", text: "Good afternoon. In today's lecture I want to talk about a material that most of us never think about, although modern life would be impossible without it: sand." },
        { who: "Lecturer", voice: "nz-nu", text: "Let's start with the scale. If we leave out air, sand is the natural resource that humans use most after water. We take around fifty billion tonnes of sand and gravel out of the ground every year — far more than oil, coal or any metal." },
        { who: "Lecturer", voice: "nz-nu", text: "Where does it all go? Most of it goes into construction. Sand is the main ingredient of concrete, so every road, bridge and apartment block contains huge amounts of it. It is also the main ingredient of glass — every window and every bottle began as sand. And a very pure form of sand is the raw material for the chips inside our computers and phones. So there's a little sand in almost everything you own." },
        { who: "Lecturer", voice: "nz-nu", text: "Now, you might say: surely we can't run out of sand — just look at the deserts. And this is the surprising part. Desert sand is almost useless for building. For thousands of years those grains have been blown around by the wind, and this has made them too smooth and too round. They simply slide over each other." },
        { who: "Lecturer", voice: "nz-nu", text: "Sand from rivers is different. Because it has been shaped by water, its grains have sharp edges, so they lock together and make strong concrete. That is why one famous desert city, when it was building the world's tallest tower, actually had to buy its sand from Australia." },
        { who: "Lecturer", voice: "nz-nu", text: "So the sand we want comes from rivers, lakes and coasts, and removing it does real damage. When too much is taken from a river bed, the banks collapse and the river becomes deeper and faster. In several countries this has caused serious damage to bridges, because their foundations are left standing on nothing." },
        { who: "Lecturer", voice: "nz-nu", text: "A second effect is less visible. As the river bed drops, the level of the water under the ground falls too. Wells dry up, and that creates serious problems for farmers, who depend on that water for their crops." },
        { who: "Lecturer", voice: "nz-nu", text: "And third, there's wildlife. Sandy river beds are the places where many fish breed, so when the sand goes, the fish go too — and so do the incomes of local families." },
        { who: "Lecturer", voice: "nz-nu", text: "What can be done? Banning sand mining completely isn't realistic, because people need homes. But there are alternatives. Crushed rock can replace river sand in many types of concrete, and so can recycled concrete from old buildings that have been knocked down. Finally, architects can help by designing buildings that use more wood, which, unlike sand, can be grown again. In the second half of the lecture, we'll look at how some governments are trying to control the trade." },
      ],
    },
    {
      t: "quiz",
      id: "t3d29-de-p4",
      title: "Questions 31–40 — ONE WORD ONLY",
      kind: "fill",
      items: [
        { q: "31. the natural resource humans use most after ___", answers: ["water"] },
        { q: "32. the main ingredient of concrete and of ___", answers: ["glass"] },
        { q: "33. needed to make computer ___", answers: ["chips"] },
        { q: "34. grains have been shaped by the ___", answers: ["wind"] },
        { q: "35. river sand grains have sharp ___", answers: ["edges"] },
        { q: "36. one desert city bought sand from ___", answers: ["Australia", "australia"] },
        { q: "37. serious damage to ___", answers: ["bridges"] },
        { q: "38. problems for ___", answers: ["farmers"] },
        { q: "39. where many ___ breed", answers: ["fish"] },
        { q: "40. buildings designed to use more ___", answers: ["wood"] },
      ],
    },

    /* ── 2 phút kiểm ── */
    { t: "h", text: "Hai phút kiểm — rồi mới chấm" },
    {
      t: "p",
      text: "Thi máy cho bạn **2 phút** sau Part 4 để xem lại cả 40 câu. Hai phút không đủ để nghĩ lại nội dung — chỉ đủ để **soát hình thức**. Đặt đồng hồ và đi đúng 5 lượt dưới đây; ở Ngày 1 và Ngày 16 bạn đã làm quy trình này cho 10 và 20 câu, hôm nay làm cho cả 40.",
    },
    {
      t: "note",
      title: "Bảng soát 2 phút (5 lượt, mỗi lượt ~25 giây)",
      items: [
        "**Ô trống**: không được còn ô nào trống — câu lỡ thì đoán một từ hợp ngữ pháp, trắc nghiệm thì chọn đại.",
        "**Giới hạn số từ**: Part 1 “ONE WORD AND/OR A NUMBER” — gõ “the library” (2 từ) là sai. Part 4 “ONE WORD ONLY” — gõ “sharp edges” là sai.",
        "**Số ít – số nhiều**: đọc cả cụm trong đề: “damage to **bridges**”, “where many **fish** breed”, “computer **chips**”, “allergic to **nuts**” — thiếu -s là mất điểm.",
        "**Chính tả + tên riêng**: Thursday · apron · container · library · Australia; tên được đánh vần (Okafor, Mill) phải đúng từng chữ.",
        "**Chữ cái matching**: câu 16 – 20 và 26 – 30 mỗi câu MỘT chữ cái, không chữ nào dùng hai lần.",
      ],
    },
    {
      t: "table",
      caption: "Điểm thô → band Listening (bảng quy đổi phổ biến)",
      head: ["Số câu đúng / 40", "Band", "Nghĩa là"],
      rows: [
        ["30 – 31", "7.0", "Vượt đích Tập 3 — sẵn sàng cho Tập 4."],
        ["26 – 29", "6.5", "Trên đích."],
        ["**23 – 25**", "**6.0**", "**Đạt đích Tập 3.**"],
        ["18 – 22", "5.5", "Gần đạt — xem bảng phân tích lỗi bên dưới, ôn đúng 1 – 2 Part yếu."],
        ["16 – 17", "5.0", "Chưa lên so với cuối Tập 2 — nghe lại cả 4 Part kèm lời, làm lại sau 3 ngày."],
      ],
    },

    /* ── Giải thích ── */
    { t: "h", text: "Chữa bài — bẫy ở đâu, câu nào trong kịch bản" },
    {
      t: "note",
      title: "Giải thích Part 1 (câu 1–10)",
      items: [
        "**1 Thursday** — bẫy đổi ý: “last term it ran on **Tuesdays**, but… from this term it's every **Thursday**”.",
        "**2 eight (8)** — Daniel nêu “ten weeks” (tờ rơi cũ); Kelly sửa: “it's **eight** weeks now”. Thông tin **sau cùng** thắng.",
        "**3 twelve (12)** — “**sixteen** cooking stations, **but** we only take **twelve** people”. Câu hỏi hỏi số **người**, không hỏi số bếp.",
        "**4 185** — “full fee is **210**… if you book before the end of this month, it's **a hundred and eighty-five**”. Đề ghi rõ “if booked before the end of the month”.",
        "**5 apron · 6 container** — dao được cấp sẵn (bẫy “Knives, for example?”). Đề đã có “**an** ___” ⇒ từ bắt đầu bằng nguyên âm ⇒ apron.",
        "**7 Okafor · 8 Mill** — đánh vần; “double L” = LL. Toà nhà ở Harbour Street nhưng **lối vào buổi tối** ở Mill Lane.",
        "**9 library** — bãi xe siêu thị tính tiền sau 1 giờ (bẫy). **10 nuts** — không ăn chay (“I eat meat and fish”), chỉ dị ứng nuts; nhớ **-s**.",
      ],
    },
    {
      t: "note",
      title: "Giải thích Part 2 (câu 16–20)",
      items: [
        "**16 A** — Ocean Gallery “closed for three months… repairs are finished, and it **opened again last week**”.",
        "**17 C** — Space Dome: “popular” dễ kéo sang B, nhưng người nói bảo xếp hàng không phải việc của bạn; ý chính: “you can't work in the Dome until you've done an **additional two-hour training session**”.",
        "**18 D** — Invention Lab: “nearly every weekday it's **booked by classes of students with their teachers**” = school groups (paraphrase).",
        "**19 B** — Body Zone: “On a Saturday or Sunday, **nowhere in the museum is as crowded** as this” = busiest at weekends. Ngay sau đó có câu về **second language** — nhưng nói rõ nó quan trọng ở **quầy thông tin**, không phải gallery ⇒ F là bẫy.",
        "**20 E** — Garden Terrace: “**Hardly anyone** finds it… fewer than fifty people”. G (close next month) là của **Dinosaur Hall**, không có trong câu hỏi.",
      ],
    },
    {
      t: "note",
      title: "Giải thích Part 3 (câu 26–30)",
      items: [
        "**26 D** — Introduction: “let's **write a new first paragraph**” = rewrite the opening; “the rest of it is fine”.",
        "**27 A** — Literature review: Marcus **nghĩ tới** appendix (C) rồi tự bác: “you can't really do that… **cut it down** to about four hundred”.",
        "**28 F** — Method: “I wouldn't touch it.” — “Me neither.” Chữ appendix xuất hiện lần nữa (bảng hỏi **đã ở** phụ lục) — vẫn là bẫy C.",
        "**29 B** — Results: “I've **checked the figures twice already**” (loại E) → “put a simple **bar chart** next to it” = add a graph.",
        "**30 G** — Conclusion: “I don't want to guess. Let's **email Dr Hale** and see what she says” = ask the tutor for advice.",
        "Bài học Part 3: lựa chọn sai thường **được nói ra** rồi bị bác (appendix, check the figures, more statistics). Chỉ chọn khi nghe được câu **chốt đồng ý** của người thứ hai.",
      ],
    },
    {
      t: "note",
      title: "Giải thích Part 4 (câu 31–40)",
      items: [
        "**31 water** — “the natural resource that humans use most **after water**”. Bẫy: oil, coal, metal được nhắc ngay sau.",
        "**32 glass · 33 chips** — “also the main ingredient of **glass**”; “raw material for the **chips** inside our computers” (số nhiều).",
        "**34 wind** — “blown around by the **wind**”; nước (water) là thứ tạo hình cát **sông** ⇒ không điền water lần nữa.",
        "**35 edges** — “its grains have **sharp edges**”. **36 Australia** — viết hoa.",
        "**37 bridges** — “serious damage to **bridges**”. **38 farmers** — “serious problems for **farmers**”. Đề paraphrase: “the level of the water under the ground” → “underground water level”.",
        "**39 fish** — “where many **fish breed**” (fish số nhiều không thêm -es). **40 wood** — “designing buildings that use more **wood**”.",
      ],
    },
    {
      t: "table",
      caption: "Bảng phân tích lỗi — đếm số câu sai theo nguyên nhân",
      head: ["Nguyên nhân", "Dấu hiệu", "Ôn ở đâu"],
      rows: [
        ["**Chính tả / số nhiều / quá số từ**", "Nghe đúng nhưng gõ sai: brige, farmer, the library", "Ngày 1 (2 phút kiểm) · Ngày 16 mục 5 — đây là điểm **lấy lại nhanh nhất**"],
        ["**Bẫy đổi ý**", "Ghi Tuesday, 10, 16, 210", "Ngày 9 (bẫy đổi ý, hai đáp án gần nhau)"],
        ["**Lỡ nhịp**", "Sai liền 2 – 3 câu sau một câu khó", "Ngày 16 (sơ đồ “lỡ một câu thì làm gì”)"],
        ["**Paraphrase khi matching**", "Sai 16 – 20, 26 – 30", "Ngày 8 · Ngày 20 (Matching Part 3)"],
        ["**Từ vựng / giọng lạ**", "Không bắt được apron, gravel; khó nghe giọng NZ", "Ngày 12 · 20 · 24 (giọng CA / NZ) + nghe lại kèm lời"],
      ],
    },
    {
      t: "note",
      title: "📌 Ghi sổ lỗi Listening — ngay sau khi chấm",
      items: [
        "Ghi 4 con số: điểm Part 1 / 2 / 3 / 4. So với đề lần 1 (Ngày 21): Part nào **lên**, Part nào đứng yên?",
        "Mỗi câu sai một dòng: số câu · bạn ghi gì · đáp án · nguyên nhân (một trong 5 dòng ở bảng trên).",
        "Bây giờ mới nghe lại — **mở lời thoại**, dừng ở đúng câu sai, nói to câu chứa đáp án 2 lần (shadowing).",
      ],
    },

    /* ── Phát âm ── */
    { t: "h", text: "Phát âm: nối âm và âm yếu trong câu causative (had‿it fixed · get‿it done)" },
    {
      t: "p",
      text: "Hôm nay bài ngữ pháp dạy **have / get something done**. Khi nói nhanh, người bản xứ **nối** phụ âm cuối với nguyên âm đầu (ôn Ngày 3) và đọc **yếu** các từ ngữ pháp như my, it, to (ôn Ngày 9, Ngày 20): “had it” nghe như /ˈhædɪt/, “get it” như /ˈɡetɪt/. Nhấn rơi vào **danh từ** và **V3** — hai từ mang nghĩa. Đọc chậm một lần, rồi đọc liền hơi.",
    },
    {
      t: "table",
      caption: "Nghe thế nào — nói thế nào",
      head: ["Viết", "Nói nhanh", "Nhấn vào"],
      rows: [
        ["had it fixed", "ha-dit **FIXED**", "fixed"],
        ["get it done", "ge-tit **DONE**", "done"],
        ["had my **hair** cut", "had-my **HAIR** **CUT**", "hair · cut"],
        ["got him to help", "go-tim-tə **HELP** (h của him rất nhẹ)", "help"],
        ["made us wait", "may-dəs **WAIT**", "wait"],
      ],
    },
    {
      t: "phatam",
      id: "t3d29-phat-am",
      title: "Luyện phát âm — nối âm và âm yếu trong câu causative",
      note: "Đọc liền hơi, không ngắt giữa had / get và it. Máy chấm từng từ: chú ý âm cuối /d/ /t/ của V3 (fixed /fɪkst/, repaired /rɪˈpeəd/).",
      items: [
        { text: "I had it fixed yesterday.", ipa: "aɪ hæd ɪt fɪkst jestədeɪ", vi: "Hôm qua tôi đem nó đi sửa." },
        { text: "I need to get it done by Friday.", ipa: "aɪ niːd tə ɡet ɪt dʌn baɪ fraɪdeɪ", vi: "Tôi cần lo xong việc này trước thứ Sáu." },
        { text: "She had her hair cut last week.", ipa: "ʃi hæd hə heə kʌt lɑːst wiːk", vi: "Tuần trước cô ấy đi cắt tóc." },
        { text: "We are having the roof repaired.", ipa: "wi ə hævɪŋ ðə ruːf rɪpeəd", vi: "Nhà tôi đang thuê sửa mái." },
        { text: "I got him to help me with it.", ipa: "aɪ ɡɒt hɪm tə help mi wɪð ɪt", vi: "Tôi nhờ được anh ấy giúp việc đó." },
        { text: "They made us wait for an hour.", ipa: "ðeɪ meɪd əs weɪt fər ən aʊə", vi: "Họ bắt chúng tôi chờ một tiếng." },
        { text: "We weren't allowed to use our phones.", ipa: "wi wɜːnt əlaʊd tə juːz aʊə fəʊnz", vi: "Chúng tôi không được phép dùng điện thoại." },
        { text: "I had my wallet stolen on the bus.", ipa: "aɪ hæd maɪ wɒlɪt stəʊlən ɒn ðə bʌs", vi: "Tôi bị trộm ví trên xe buýt." },
      ],
    },
    {
      t: "rule",
      formula: "Nghe một lần → gõ ngay → lỡ thì bỏ → 2 phút kiểm (ô trống · số từ · -s · chính tả · chữ cái) → chấm → sổ lỗi",
      vi: "Đích Tập 3: ≥ 23/40. Chưa đạt thì chưa phải do “nghe kém” — hãy đếm xem bao nhiêu câu mất vì hình thức và bẫy đổi ý trước.",
    },
  ],
};
/* ───────────────────────── Bài tập ───────────────────────── */
const D29_BAI_TAP: Lesson = {
  id: "t3d29-bai-tap",
  kind: "homework",
  title: "Bài tập Ngày 29 — causative · ôn 24 điểm ngữ pháp · giọng lập luận Passage 3 · 2 phút kiểm Listening",
  goal: "Tự kiểm cả ngày bằng 40 câu có đáp án (causative, ôn tổng ngữ pháp, đọc giọng lập luận, soát đáp án Listening) và một đoạn viết ngắn dùng causative; đúng từ 28 câu trở lên là đạt.",
  minutes: 55,
  blocks: [
    {
      t: "recap",
      title: "Bài tập hôm nay",
      items: [
        "**Phần A** — causative: 10 câu điền dạng đúng + 6 câu ghép câu.",
        "**Phần B** — ôn tổng ngữ pháp Tập 3: 8 câu sửa lỗi (mỗi câu một điểm trong bảng 24 điểm).",
        "**Phần C** — đọc: 6 câu về bố cục và giọng lập luận của Passage 3.",
        "**Phần D** — nghe: 6 câu soát đáp án (2 phút kiểm) + 4 câu chép chính tả.",
        "**Phần E** — viết 80 – 100 chữ dùng ít nhất 3 cấu trúc causative (AI chấm).",
        "Đạt: ==≥ 28/40==. Câu sai ghi vào sổ lỗi kèm số điểm (#1 – #24) hoặc tên bẫy.",
      ],
    },

    { t: "h", text: "Phần A — Causative (16 câu)" },
    {
      t: "quiz",
      id: "t3d29-bt-causative-dien",
      title: "A1. Viết dạng đúng của động từ trong ngoặc (10 câu)",
      kind: "fill",
      grammar: "have / get + vật + V3 · have + người + V · get + người + to V · make / let + O + V · be made / allowed + to V · need + V-ing",
      items: [
        { q: "I had my passport ___ (renew) last month.", answers: ["renewed"], hint: "vật + V3" },
        { q: "The teacher made the whole class ___ (stay) after school.", answers: ["stay"], hint: "make + O + V" },
        { q: "The whole class was made ___ (stay) after school.", answers: ["to stay"], hint: "bị động của make: + to V" },
        { q: "We got a local company ___ (design) our website.", answers: ["to design"], hint: "get + người / tổ chức + to V" },
        { q: "We are getting our website ___ (design) by a local company.", answers: ["designed"], hint: "vật + V3" },
        { q: "My parents never let me ___ (watch) TV on school nights.", answers: ["watch"], hint: "let + O + V" },
        { q: "Visitors are not allowed ___ (take) photographs in the gallery.", answers: ["to take"], hint: "be allowed + to V" },
        { q: "The old bridge needs ___ (repair) before winter.", answers: ["repairing", "to be repaired"], hint: "vật + need + V-ing" },
        { q: "He had his bike ___ (steal) outside the library.", answers: ["stolen"], hint: "chuyện xui: have + vật + V3" },
        { q: "Free bus passes enable older people ___ (travel) more easily.", answers: ["to travel"], hint: "enable + O + to V" },
      ],
    },
    {
      t: "build",
      id: "t3d29-bt-causative-ghep",
      title: "A2. Ghép câu — bấm các mảnh theo đúng thứ tự (6 câu)",
      items: [
        { vi: "Tôi đi khám răng sáu tháng một lần.", chips: ["I", "have", "my teeth", "checked", "every six months", "check"], answer: ["I", "have", "my teeth", "checked", "every six months"] },
        { vi: "Bạn đã đem xe đi sửa chưa?", chips: ["Have", "you", "had", "your car", "repaired", "yet", "repair"], answer: ["Have", "you", "had", "your car", "repaired", "yet"] },
        { vi: "Cô ấy nhờ được hàng xóm cho mèo ăn.", chips: ["She", "got", "her neighbour", "to feed", "the cat", "feed"], answer: ["She", "got", "her neighbour", "to feed", "the cat"] },
        { vi: "Nhân viên bị bắt làm thêm giờ.", chips: ["Employees", "were made", "to work", "overtime", "work"], answer: ["Employees", "were made", "to work", "overtime"] },
        { vi: "Chính phủ nên cho phép người dân tự chọn trường.", chips: ["The government", "should allow", "people", "to choose", "their own schools", "choose"], answer: ["The government", "should allow", "people", "to choose", "their own schools"] },
        { vi: "Chúng tôi sẽ thuê người lắp pin mặt trời vào năm tới.", chips: ["We", "are going to", "have", "solar panels", "installed", "next year", "install"], answer: ["We", "are going to", "have", "solar panels", "installed", "next year"] },
      ],
    },

    { t: "h", text: "Phần B — Sửa lỗi theo bảng 24 điểm (8 câu)" },
    {
      t: "p",
      text: "Mỗi câu có **đúng một lỗi** thuộc một điểm trong bảng 24 điểm. Viết lại **cả câu** cho đúng. Gợi ý cho biết số điểm.",
    },
    {
      t: "quiz",
      id: "t3d29-bt-sua-loi",
      title: "B. Viết lại câu cho đúng (8 câu)",
      kind: "translate",
      grammar: "Mỗi câu một lỗi — xem số điểm ở gợi ý",
      items: [
        { q: "I am living in this city since 2019.", answers: ["I have been living in this city since 2019.", "I have lived in this city since 2019.", "I've been living in this city since 2019.", "I've lived in this city since 2019."], hint: "#1 — since ⇒ have been + V-ing" },
        { q: "The poors need more help from the government.", answers: ["The poor need more help from the government."], hint: "#3 — the + adj không thêm -s" },
        { q: "Air pollution can result to serious health problems.", answers: ["Air pollution can result in serious health problems."], hint: "#8 — result in + kết quả" },
        { q: "House prices are twice higher than ten years ago.", answers: ["House prices are twice as high as ten years ago.", "House prices are twice as high as they were ten years ago."], hint: "#9 — twice as + adj + as" },
        { q: "If I would have more money, I would travel abroad.", answers: ["If I had more money, I would travel abroad."], hint: "#13 — mệnh đề if không có would" },
        { q: "Many people shop online, that saves them a lot of time.", answers: ["Many people shop online, which saves them a lot of time."], hint: "#16 — sau dấu phẩy dùng which" },
        { q: "Although the bus is cheap, but many people prefer to drive.", answers: ["Although the bus is cheap, many people prefer to drive.", "The bus is cheap, but many people prefer to drive."], hint: "#20 — although và but không đi cùng nhau" },
        { q: "The teacher made us to rewrite the whole essay.", answers: ["The teacher made us rewrite the whole essay."], hint: "#24 — make + O + V (không to)" },
      ],
    },

    { t: "h", text: "Phần C — Đọc: bố cục và giọng lập luận (6 câu)" },
    {
      t: "mcq",
      id: "t3d29-bt-doc",
      title: "C. Chiến thuật Passage 3 (6 câu)",
      items: [
        { q: "Ba phút đầu của một passage 900 từ, bạn làm gì?", options: ["Đọc kỹ đoạn A và B", "Làm ngay câu đầu tiên", "Đọc tiêu đề, đoạn đầu, câu đầu mỗi đoạn, đoạn cuối và ghi bản đồ đoạn", "Dịch các từ lạ"], correct: 2, why: "Đọc **bố cục** để biết đoạn nào nói gì; chưa trả lời câu nào trong 3 phút này." },
        { q: "Trong Passage 3, dạng nào nên làm SAU CÙNG?", options: ["Matching sentence endings (không theo thứ tự bài)", "Multiple choice", "Yes / No / Not Given", "Dạng nào in trước làm trước, không ngoại lệ"], correct: 0, why: "Dạng theo thứ tự bài làm trước; đến lúc làm dạng không theo thứ tự thì bạn đã đọc kỹ gần hết bài." },
        { q: "“Many people believe that a perfect memory is an advantage. **Yet** the evidence suggests otherwise.” — Ý tác giả là:", options: ["Trí nhớ hoàn hảo là lợi thế", "Không nêu ý kiến", "Mọi người đều sai hoàn toàn", "Bằng chứng không ủng hộ niềm tin đó"], correct: 3, why: "Ý sau **Yet** mới là ý tác giả; “suggests” giữ mức độ nên không phải “sai hoàn toàn”." },
        { q: "Bài viết: “The method **appears to** work for most learners.” Câu hỏi: “The method works for **all** learners.” Đáp án Y / N / NG hợp lý nhất?", options: ["YES", "NO", "NOT GIVEN", "TRUE"], correct: 1, why: "most ≠ all; tác giả nói có mức độ, câu hỏi nói tuyệt đối ⇒ trái ý tác giả ⇒ **NO**. (TRUE không phải đáp án của dạng này.)" },
        { q: "Lựa chọn MCQ chép **nguyên một cụm** trong bài thì:", options: ["Chắc chắn đúng", "Thường là bẫy — phải đọc xem cụm đó trong bài nói gì", "Chắc chắn sai", "Chỉ đúng ở Passage 1"], correct: 1, why: "Đáp án thật thường được **paraphrase**; cụm chép y nguyên hay được dùng để dụ (ví dụ câu 27, lựa chọn D)." },
        { q: "Hết phút 20 mà Passage 3 còn 2 câu chưa làm, bạn nên:", options: ["Để trống vì đoán sai bị trừ điểm", "Xin thêm giờ", "Đoán cho đủ — IELTS không trừ điểm câu sai", "Quay lại sửa Passage 1"], correct: 2, why: "Không bao giờ để trống: câu sai không bị trừ điểm." },
      ],
    },

    { t: "h", text: "Phần D — Nghe: soát đáp án và chép chính tả (10 câu)" },
    {
      t: "mcq",
      id: "t3d29-bt-nghe-soat",
      title: "D1. Đáp án nào được tính điểm? (6 câu)",
      items: [
        { q: "Đề: ONE WORD ONLY — “serious damage to ___”. Băng: “serious damage to bridges”.", options: ["bridge", "bridges", "the bridges", "brige"], correct: 1, why: "Giữ đúng **số nhiều** như băng; “the bridges” quá số từ; brige sai chính tả." },
        { q: "Đề: ONE WORD AND/OR A NUMBER — “£ ___”. Băng: “a hundred and eighty-five pounds”.", options: ["185 pounds sterling", "£185 each person", "185", "one eight five pounds only"], correct: 2, why: "Đề đã in sẵn £ ⇒ chỉ gõ **185**. Con số viết bằng chữ số luôn an toàn nhất." },
        { q: "Băng: “last term it ran on Tuesdays, but from this term it's every Thursday”. Đáp án:", options: ["Thursday", "Tuesday", "Tuesday / Thursday", "Tuesdays"], correct: 0, why: "Thông tin **sau cùng** là đáp án; không được ghi hai đáp án." },
        { q: "Băng đánh vần: “O-K-A-F-O-R”. Bạn gõ:", options: ["Okaffor", "Okafer", "Ocafor", "Okafor"], correct: 3, why: "Tên riêng được đánh vần phải đúng **từng chữ**; viết hoa chữ đầu." },
        { q: "Matching 16 – 20: bạn đã dùng chữ B cho câu 17, giờ câu 19 cũng thấy hợp B. Làm gì trong 2 phút kiểm?", options: ["Để cả hai là B", "Xoá cả hai", "Đổi câu 19 thành chữ bất kỳ", "Xem lại ghi chú: mỗi chữ chỉ dùng một lần — giữ B cho câu có bằng chứng rõ hơn, câu kia chọn chữ còn lại hợp nhất"], correct: 3, why: "Trong dạng “choose FIVE answers” mỗi lựa chọn dùng tối đa một lần." },
        { q: "Đề: ONE WORD ONLY — “where many ___ breed”. Băng: “many fish breed”.", options: ["fishes", "fish", "fishs", "a fish"], correct: 1, why: "fish số nhiều vẫn là **fish**; “a fish” sai ngữ pháp sau many và quá số từ." },
      ],
    },
    {
      t: "dictation",
      id: "t3d29-bt-chinh-ta",
      title: "D2. Nghe đánh vần — gõ lại (4 câu)",
      items: [
        { label: "Tên giáo viên", spell: "O-K-A-F-O-R", answer: "Okafor" },
        { label: "Họ của khách", spell: "W-H-I-T-L-O-C-K", answer: "Whitlock" },
        { label: "Một từ trong Part 1", spell: "C-O-N-T-A-I-N-E-R", answer: "container" },
        { label: "Một từ trong Part 4", spell: "F-O-U-N-D-A-T-I-O-N-S", answer: "foundations" },
      ],
    },

    { t: "h", text: "Phần E — Viết ngắn dùng causative" },
    {
      t: "essay",
      id: "t3d29-bt-viet",
      task: "Task 2",
      prompt: "Write ONE paragraph (80–100 words) answering this question: “What should schools allow students to do, and what should they make students do?” Use at least THREE of these structures: allow / enable + object + to V · make / let + object + V · be allowed / be made + to V · have / get something done.",
      minWords: 80,
      tips: [
        "Câu chủ đề nêu lập trường: Schools should allow students to…, but they should also make them…",
        "Một lý do + một ví dụ cụ thể cho mỗi vế.",
        "Soát riêng một lượt chữ to: make / let KHÔNG to; allow / enable CÓ to; bị động của make CÓ to.",
      ],
    },
    {
      t: "note",
      title: "📌 Việc tiếp theo",
      items: [
        "Ghi vào sổ lỗi: điểm 30 câu ôn tổng ngữ pháp · điểm Passage 3 (… /14) · điểm Listening (… /40, từng Part).",
        "Mai là **Ngày 30 — ngày cuối Tập 3**: 30 idiom + ôn 30 chủ đề, viết lại 2 bài cũ theo sổ lỗi, thi nói với giám khảo AI lần 2, kiểm tra chặng Ngày 25 – 30. Tối nay chọn sẵn **2 bài viết cũ** (1 Task 1 + 1 Task 2) có điểm AI thấp nhất.",
        "Sau Ngày 30: làm **Đề 5** ở Online Test — thi cuối Tập 3.",
      ],
    },
  ],
};

export const NGAY_29: Lesson[] = [D29_NGU_PHAP, D29_DOC, D29_NGHE, D29_BAI_TAP];
