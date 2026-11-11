/**
 * Ngày 15 — tự soạn (không chụp sách, 12/11/2026) — ngày cuối Tập 1:
 *   Basic Grammar: Câu bị động (mọi thì đã học + modal; dùng mô tả quy trình)
 *   Basic Vocabulary: Bản đồ & quy trình (giới từ vị trí, hướng, động từ biến đổi; figure map + process)
 *   Listening Skills: Form Completion (ôn Section 1 nâng cao: bẫy sửa thông tin, số điện thoại, đánh vần, ngày tháng)
 *   Homework: dịch có 💡, trắc nghiệm, chia bị động, điền theo bản đồ, viết Task 1 quy trình.
 *
 * Bài thi cuối khoá (review) do người điều phối thêm sau — tệp này KHÔNG có.
 * Mọi số liệu hình vẽ là tự đặt; bài mẫu khớp từng con số trong hình.
 */
import type { Lesson } from '../data';

/* ─────────────────────────── Ngữ pháp ─────────────────────────── */

const D15_GRAMMAR: Lesson = {
  id: "d15-ngu-phap",
  kind: "grammar",
  title: "Câu bị động (Passive Voice) — mọi thì đã học + mô tả quy trình",
  goal: "Đổi câu chủ động sang bị động ở hiện tại đơn, hiện tại tiếp diễn, quá khứ đơn, tương lai, modal (và hiện tại hoàn thành); biết khi nào dùng và khi nào bỏ “by…”; viết được đoạn mô tả quy trình Writing Task 1 bằng câu bị động.",
  minutes: 70,
  blocks: [
    {
      t: "recap",
      title: "Bài này học gì",
      items: [
        "**Câu bị động** (passive voice) = đưa **người/vật CHỊU tác động** lên làm chủ ngữ: Farmers grow rice. → **Rice is grown** (by farmers).",
        "Công thức gốc: ==S + be + V3== — **be** chia theo thì, **V3** (quá khứ phân từ) giữ nguyên.",
        "Mọi thì: **is grown** · **is being grown** · **was grown** · **will be grown** · **can be grown** · **has been grown**.",
        "Dùng khi **không biết / không cần** ai làm, khi muốn nhấn vào **sự việc** — đặc biệt trong **văn học thuật** và **mô tả quy trình** (Task 1).",
        "Bẫy: động từ **không có tân ngữ** (happen, arrive, rise, take place) **không** có bị động: ~~The accident was happened~~.",
      ],
    },

    /* ── 1 ── */
    { t: "h", text: "1. Chủ động và bị động — khác nhau ở đâu?" },
    {
      t: "p",
      text: "Câu **chủ động** (active voice) bắt đầu bằng **người làm** hành động. Câu **bị động** (passive voice) bắt đầu bằng **thứ chịu** hành động. Nghĩa gần như không đổi — chỉ đổi **điều được nhấn mạnh**. Tiếng Việt cũng có bị động (“Lúa **được** trồng ở miền Tây”, “Cây cầu **bị** phá”), nhưng tiếng Anh dùng **nhiều hơn hẳn**, nhất là trong khoa học, báo chí và bài thi IELTS.",
    },
    {
      t: "sodo",
      kind: "compare",
      title: "Cùng một sự việc — hai cách nói",
      caption: "Chủ ngữ bị động (rice) chính là tân ngữ của câu chủ động. Người làm (farmers) xuống cuối sau by — hoặc bỏ hẳn nếu không cần.",
      cols: [
        {
          title: "**Chủ động** — nhấn vào NGƯỜI LÀM",
          anh: "man-farmer",
          items: [
            "**Farmers** grow rice in the Mekong Delta.",
            "S (người làm) + V + O",
            "Dùng khi người làm là quan trọng",
          ],
        },
        {
          title: "**Bị động** — nhấn vào SỰ VIỆC",
          anh: "sheaf-of-rice",
          items: [
            "**Rice** is grown in the Mekong Delta (by farmers).",
            "S (vật chịu tác động) + be + V3 (+ by …)",
            "Dùng khi sự việc / sản phẩm là trọng tâm",
          ],
        },
      ],
    },
    {
      t: "table",
      caption: "Khi nào nên dùng câu bị động?",
      head: ["Lý do", "Ví dụ", "Dịch"],
      rows: [
        ["**Không biết** ai làm", "My bike **was stolen** last night.", "Xe đạp của tôi bị trộm đêm qua."],
        ["Người làm **hiển nhiên / không quan trọng**", "The rubbish **is collected** every Monday.", "Rác được thu gom mỗi thứ Hai. (ai cũng biết là công nhân vệ sinh)"],
        ["Muốn nhấn vào **sự việc / sản phẩm**", "The bridge **was opened** in 2020.", "Cây cầu được thông xe năm 2020."],
        ["Văn **học thuật**, báo cáo, **quy trình**", "The leaves **are dried** at 90°C.", "Lá được sấy ở 90°C."],
        ["**Tránh nói thẳng** ai có lỗi (lịch sự)", "Mistakes **were made**.", "Đã có sai sót xảy ra."],
      ],
    },
    {
      t: "note",
      title: "Ghi nhớ",
      items: [
        "Chỉ động từ **có tân ngữ** (transitive — ngoại động từ) mới đổi được sang bị động: grow **rice**, build **a bridge**, steal **a bike**.",
        "Bị động KHÔNG phải là “trình độ cao hơn” chủ động. Dùng đúng chỗ thì hay; dùng tràn lan thì câu nặng nề. Writing Task 1 **quy trình** và **bản đồ** là nơi bị động **bắt buộc** gần như mọi câu.",
      ],
    },

    /* ── 2 ── */
    { t: "h", text: "2. Cách đổi câu chủ động → bị động: 4 bước" },
    {
      t: "sodo",
      kind: "flow",
      title: "4 bước đổi sang bị động",
      caption: "Bước 3 là chỗ hay sai nhất: be phải chia theo THÌ của động từ gốc và theo chủ ngữ MỚI.",
      steps: [
        { label: "1. Tìm tân ngữ (O)", sub: "Workers built **the bridge** in 1990." },
        { label: "2. Đưa O lên làm chủ ngữ", sub: "**The bridge** …" },
        { label: "3. be (đúng thì, đúng chủ ngữ) + V3", sub: "built = quá khứ đơn, chủ ngữ số ít → **was built**" },
        { label: "4. by + người làm (nếu cần)", sub: "The bridge was built in 1990 (by workers → bỏ, không cần)" },
      ],
    },
    {
      t: "table",
      head: ["Chủ động", "Bị động", "Ghi chú"],
      rows: [
        ["People **speak** English all over the world.", "English **is spoken** all over the world.", "hiện tại đơn, chủ ngữ số ít → is"],
        ["They **make** these phones in Vietnam.", "These phones **are made** in Vietnam.", "chủ ngữ mới số nhiều → are"],
        ["Someone **cleaned** the classroom yesterday.", "The classroom **was cleaned** yesterday.", "quá khứ đơn → was; someone → bỏ"],
        ["J.K. Rowling **wrote** the Harry Potter books.", "The Harry Potter books **were written by** J.K. Rowling.", "người làm quan trọng → giữ by"],
        ["The city **will open** a new library.", "A new library **will be opened**.", "tương lai → will be + V3"],
      ],
    },
    {
      t: "patterns",
      rows: [
        {
          formula: "S + be (am / is / are / was / were / will be…) + V3 (+ by + O)",
          vi: "Công thức chung. be là động từ duy nhất thay đổi theo thì; V3 không bao giờ đổi.",
          examples: [
            { en: "Coffee is grown in the Central Highlands.", vi: "Cà phê được trồng ở Tây Nguyên." },
            { en: "The museum was designed by a Japanese architect.", vi: "Bảo tàng được thiết kế bởi một kiến trúc sư người Nhật." },
          ],
        },
      ],
    },
    {
      t: "rule",
      formula: "Chủ động: S + V + O → Bị động: O (làm S mới) + be (chia theo thì + S mới) + V3 (+ by + S cũ)",
      vi: "Chỉ đổi được khi động từ có tân ngữ. by + người làm chỉ giữ khi thông tin đó quan trọng.",
    },
    {
      t: "quiz",
      id: "d15-np-dich-cach-doi",
      title: "Dịch sang tiếng Anh — câu bị động cơ bản (4 câu)",
      kind: "translate",
      grammar: "S + am / is / are + V3 (hiện tại đơn) · S + was / were + V3 (quá khứ đơn) · … + by + người làm (khi cần).",
      items: [
        { q: "Tiếng Anh được nói ở nhiều quốc gia.", hint: "English, is spoken, in many countries", answers: ["English is spoken in many countries.", "English is spoken in a lot of countries.", "English is spoken in many nations."] },
        { q: "Chiếc điện thoại này được sản xuất ở Việt Nam.", hint: "This phone, is made / is produced, in Vietnam", answers: ["This phone is made in Vietnam.", "This phone is produced in Vietnam.", "This phone is manufactured in Vietnam.", "This phone was made in Vietnam.", "This phone was produced in Vietnam.", "This phone was manufactured in Vietnam."] },
        { q: "Xe máy của anh ấy bị trộm tối qua.", hint: "His motorbike, was stolen, last night", answers: ["His motorbike was stolen last night.", "His motorcycle was stolen last night.", "His motorbike got stolen last night.", "Last night his motorbike was stolen.", "Last night, his motorbike was stolen."] },
        { q: "Bức tranh này được vẽ bởi một học sinh lớp 6.", hint: "This picture / painting, was painted / drawn, by a sixth-grade student", answers: ["This picture was painted by a sixth-grade student.", "This painting was painted by a sixth-grade student.", "This picture was drawn by a sixth-grade student.", "This picture was painted by a sixth grader.", "This picture was drawn by a sixth grader.", "This painting was done by a sixth-grade student.", "This picture was painted by a grade 6 student.", "This picture was drawn by a grade 6 student.", "This picture was painted by a Year 6 student.", "This picture was drawn by a Year 6 student."] },
      ],
    },

    /* ── 3 ── */
    { t: "h", text: "3. V3 — quá khứ phân từ (past participle)" },
    {
      t: "p",
      text: "**V3** là dạng thứ ba của động từ (cột thứ ba trong bảng bất quy tắc). Động từ **có quy tắc**: V3 = V2 = **V-ed** (clean → cleaned → cleaned). Động từ **bất quy tắc** phải học thuộc. Bảng dưới gom những động từ **hay dùng nhất trong mô tả quy trình và bản đồ**.",
    },
    {
      t: "table",
      caption: "35 động từ bất quy tắc hay gặp trong câu bị động",
      head: ["V", "V2 (quá khứ)", "V3", "Nghĩa"],
      rows: [
        ["build", "built", "**built**", "xây"],
        ["make", "made", "**made**", "làm, chế tạo"],
        ["grow", "grew", "**grown**", "trồng, mọc"],
        ["take", "took", "**taken**", "lấy, mang"],
        ["give", "gave", "**given**", "cho"],
        ["write", "wrote", "**written**", "viết"],
        ["speak", "spoke", "**spoken**", "nói"],
        ["know", "knew", "**known**", "biết"],
        ["see", "saw", "**seen**", "nhìn thấy"],
        ["show", "showed", "**shown**", "chỉ, cho thấy"],
        ["choose", "chose", "**chosen**", "chọn"],
        ["break", "broke", "**broken**", "làm vỡ"],
        ["steal", "stole", "**stolen**", "trộm"],
        ["eat", "ate", "**eaten**", "ăn"],
        ["drive", "drove", "**driven**", "lái"],
        ["freeze", "froze", "**frozen**", "làm đông"],
        ["shake", "shook", "**shaken**", "lắc"],
        ["hide", "hid", "**hidden**", "giấu"],
        ["cut", "cut", "**cut**", "cắt"],
        ["put", "put", "**put**", "đặt"],
        ["set", "set", "**set**", "đặt, lắp"],
        ["spread", "spread", "**spread**", "trải ra, lan ra"],
        ["send", "sent", "**sent**", "gửi"],
        ["sell", "sold", "**sold**", "bán"],
        ["buy", "bought", "**bought**", "mua"],
        ["bring", "brought", "**brought**", "mang đến"],
        ["teach", "taught", "**taught**", "dạy"],
        ["keep", "kept", "**kept**", "giữ"],
        ["leave", "left", "**left**", "để lại"],
        ["hold", "held", "**held**", "tổ chức, cầm"],
        ["find", "found", "**found**", "tìm thấy"],
        ["feed", "fed", "**fed**", "cho ăn"],
        ["grind", "ground", "**ground**", "xay, nghiền"],
        ["dig", "dug", "**dug**", "đào"],
        ["pay", "paid", "**paid**", "trả tiền"],
      ],
    },
    {
      t: "note",
      title: "Cẩn thận: chính tả -ed của động từ có quy tắc",
      items: [
        "Tận cùng **-e** → chỉ thêm **-d**: produce → produc**ed**, store → stor**ed**.",
        "Phụ âm + **-y** → **-ied**: dry → dr**ied**, carry → carr**ied**. (Nguyên âm + y giữ nguyên: play → play**ed**.)",
        "Một nguyên âm + một phụ âm, nhấn âm cuối → **gấp đôi** phụ âm: stop → sto**pped**, plan → pla**nned**, refer → refe**rred**.",
        "Hay nhầm V2 và V3: ~~The bridge was builded~~ → **built**; ~~Tea is grew~~ → **grown**; ~~The letter was wrote~~ → **written**.",
      ],
    },
    {
      t: "quiz",
      id: "d15-np-v3",
      title: "Viết V3 của động từ trong ngoặc (8 câu)",
      kind: "fill",
      items: [
        { q: "(1) Rice is ___ (grow) in many parts of Asia.", answers: ["grown"], hint: "bất quy tắc: grow – grew – ___" },
        { q: "(2) The old cinema was ___ (build) in 1975.", answers: ["built"], hint: "bất quy tắc" },
        { q: "(3) The fruit is ___ (dry) in the sun for three days.", answers: ["dried"], hint: "phụ âm + y → -ied" },
        { q: "(4) These cars are ___ (make) in Korea.", answers: ["made"], hint: "bất quy tắc" },
        { q: "(5) The coffee beans are ___ (grind) into a fine powder.", answers: ["ground"], hint: "bất quy tắc: grind – ground – ___" },
        { q: "(6) The bottles are ___ (store) in a cool room.", answers: ["stored"], hint: "tận cùng -e → thêm -d" },
        { q: "(7) Two new teachers were ___ (choose) for the project.", answers: ["chosen"], hint: "bất quy tắc" },
        { q: "(8) The meeting was ___ (plan) for Friday.", answers: ["planned"], hint: "gấp đôi phụ âm" },
      ],
    },

    /* ── 4 ── */
    { t: "h", text: "4. Bị động theo từng thì — bảng tổng" },
    {
      t: "p",
      text: "Đến Ngày 15, bạn đã học **hiện tại đơn** (Ngày 1), **hiện tại tiếp diễn và quá khứ đơn** (Ngày 9), **modal** (Ngày 13). Bảng dưới đưa **mọi thì đó** sang bị động, thêm **tương lai** và **hiện tại hoàn thành** (phần thêm — rất cần cho bài bản đồ). Quy tắc chỉ có một: **chia be theo thì, giữ V3**.",
    },
    {
      t: "table",
      head: ["Thì", "Chủ động", "Bị động", "Ví dụ bị động"],
      rows: [
        ["Hiện tại đơn", "S + V(s/es)", "S + **am / is / are + V3**", "Rice **is grown** in the delta."],
        ["Hiện tại tiếp diễn", "S + am / is / are + V-ing", "S + **am / is / are being + V3**", "A new bridge **is being built**."],
        ["Quá khứ đơn", "S + V2 / V-ed", "S + **was / were + V3**", "The school **was built** in 1995."],
        ["Quá khứ tiếp diễn (thêm)", "S + was / were + V-ing", "S + **was / were being + V3**", "The road **was being repaired** when I arrived."],
        ["Hiện tại hoàn thành (thêm)", "S + have / has + V3", "S + **have / has been + V3**", "The factory **has been converted** into flats."],
        ["Tương lai đơn", "S + will + V", "S + **will be + V3**", "A hospital **will be opened** next year."],
        ["Modal (Ngày 13)", "S + can / must / should + V", "S + **can / must / should be + V3**", "Glass **can be recycled** many times."],
      ],
    },
    {
      t: "sodo",
      kind: "timeline",
      title: "Câu bị động trên trục thời gian",
      caption: "Mỗi thì giữ đúng ý nghĩa thời gian của nó — chỉ đổi sang khung be + V3.",
      marks: [
        { from: -9, to: 9, label: "**is grown** — sự thật, lặp lại (hiện tại đơn)", kieu: "lap", mau: 1 },
        { from: -7, label: "**was built** — xong ở một thời điểm quá khứ", kieu: "diem", mau: 2 },
        { from: -5, to: 0, label: "**has been converted** — từ quá khứ đến nay (kết quả bây giờ)", kieu: "doan", mau: 2 },
        { from: -1, to: 1, label: "**is being built** — đang diễn ra", kieu: "doan", mau: 3 },
        { from: 6, label: "**will be opened** — tương lai", kieu: "diem", mau: 3 },
      ],
    },

    { t: "h", text: "4a. Hiện tại đơn bị động: am / is / are + V3" },
    {
      t: "p",
      text: "Dùng cho **sự thật, thói quen, quy trình lặp lại** — loại câu chiếm gần hết bài mô tả quy trình Task 1. Chủ ngữ số ít / không đếm được → **is**; số nhiều → **are**.",
    },
    {
      t: "patterns",
      rows: [
        {
          formula: "S (số ít / không đếm được) + is + V3 · S (số nhiều) + are + V3",
          vi: "Sự thật hiện tại, quy trình.",
          examples: [
            { en: "Milk is delivered to the factory every morning.", vi: "Sữa được giao đến nhà máy mỗi sáng." },
            { en: "The bottles are washed and filled by machines.", vi: "Các chai được rửa và chiết đầy bằng máy." },
          ],
        },
      ],
    },
    {
      t: "rule",
      formula: "S + am / is / are + V3 (+ by + O)",
      vi: "Hiện tại đơn bị động — sự thật và quy trình (Task 1 process).",
    },
    {
      t: "quiz",
      id: "d15-np-dich-hien-tai",
      title: "Dịch sang tiếng Anh — hiện tại đơn bị động (4 câu)",
      kind: "translate",
      grammar: "S + is / are + V3. Chủ ngữ số nhiều (the leaves, the bottles) → are; số ít / không đếm được (milk, coffee) → is.",
      items: [
        { q: "Cà phê được trồng ở Tây Nguyên.", hint: "Coffee, is grown, in the Central Highlands", answers: ["Coffee is grown in the Central Highlands.", "Coffee is grown in the Central Highlands of Vietnam.", "Coffee is grown in the Highlands."] },
        { q: "Rác được thu gom hai lần một tuần.", hint: "Rubbish / Waste, is collected, twice a week", answers: ["Rubbish is collected twice a week.", "Waste is collected twice a week.", "The rubbish is collected twice a week.", "Garbage is collected twice a week.", "Trash is collected twice a week.", "The waste is collected twice a week."] },
        { q: "Các chai nhựa được rửa sạch bằng nước nóng.", hint: "The plastic bottles, are washed, with hot water / in hot water", answers: ["The plastic bottles are washed with hot water.", "The plastic bottles are washed in hot water.", "Plastic bottles are washed with hot water.", "Plastic bottles are washed in hot water.", "The plastic bottles are cleaned with hot water.", "Plastic bottles are cleaned with hot water."] },
        { q: "Bài thi được chấm bởi hai giám khảo.", hint: "The test / The exam, is marked, by two examiners", answers: ["The test is marked by two examiners.", "The exam is marked by two examiners.", "The test is graded by two examiners.", "The exam is graded by two examiners.", "The test is scored by two examiners.", "The exam is scored by two examiners."] },
      ],
    },

    { t: "h", text: "4b. Quá khứ đơn bị động: was / were + V3" },
    {
      t: "p",
      text: "Dùng cho việc **đã xảy ra và đã xong** — lịch sử, tin tức, và mô tả **bản đồ quá khứ** (In 1990, a school **was built** here).",
    },
    {
      t: "patterns",
      rows: [
        {
          formula: "S (số ít) + was + V3 · S (số nhiều) + were + V3",
          vi: "Việc đã xong trong quá khứ, thường có mốc thời gian (in 2010, last year, ago).",
          examples: [
            { en: "The Long Bien Bridge was completed in 1902.", vi: "Cầu Long Biên được hoàn thành năm 1902." },
            { en: "Thousands of trees were cut down to make way for the road.", vi: "Hàng nghìn cây bị chặt để nhường chỗ cho con đường." },
          ],
        },
      ],
    },
    {
      t: "rule",
      formula: "S + was / were + V3 (+ by + O) + mốc thời gian quá khứ",
      vi: "Quá khứ đơn bị động — lịch sử, tin tức, bản đồ năm cũ.",
    },
    {
      t: "quiz",
      id: "d15-np-dich-qua-khu",
      title: "Dịch sang tiếng Anh — quá khứ đơn bị động (4 câu)",
      kind: "translate",
      grammar: "S + was / were + V3 (+ by + O). Chủ ngữ số nhiều (trees, houses) → were.",
      items: [
        { q: "Trường của tôi được xây năm 1998.", hint: "My school, was built, in 1998", answers: ["My school was built in 1998.", "My school was constructed in 1998."] },
        { q: "Nhiều ngôi nhà đã bị phá huỷ trong cơn bão.", hint: "Many houses, were destroyed, in the storm / during the storm", answers: ["Many houses were destroyed in the storm.", "Many houses were destroyed during the storm.", "A lot of houses were destroyed in the storm.", "Many houses were destroyed by the storm.", "Lots of houses were destroyed in the storm.", "Many homes were destroyed in the storm."] },
        { q: "Bức thư được gửi đi hôm thứ Hai.", hint: "The letter, was sent, on Monday", answers: ["The letter was sent on Monday.", "The letter was posted on Monday.", "The letter was sent off on Monday."] },
        { q: "Những cái cây cũ đã bị chặt để làm bãi đỗ xe.", hint: "The old trees, were cut down, to make way for / to build, a car park", answers: ["The old trees were cut down to make way for a car park.", "The old trees were cut down to build a car park.", "The old trees were cut down to make a car park.", "The old trees were cut down to make room for a car park.", "The old trees were cut down for a car park.", "The old trees were cut down to make way for a parking lot.", "The old trees were cut down to build a parking lot."] },
      ],
    },

    { t: "h", text: "4c. Hiện tại tiếp diễn bị động: am / is / are being + V3" },
    {
      t: "p",
      text: "Dùng cho việc **đang được làm** ngay bây giờ hoặc trong giai đoạn này. Hay gặp trong tin tức và Listening (“The car park **is being repaired**, so…”). Thêm **being** giữa be và V3.",
    },
    {
      t: "patterns",
      rows: [
        {
          formula: "S + am / is / are + being + V3",
          vi: "Đang được làm (chưa xong).",
          examples: [
            { en: "A new metro line is being built in Ho Chi Minh City.", vi: "Một tuyến tàu điện ngầm mới đang được xây ở TP. Hồ Chí Minh." },
            { en: "Sorry, your room is being cleaned at the moment.", vi: "Xin lỗi, phòng của bạn đang được dọn." },
          ],
        },
      ],
    },
    {
      t: "rule",
      formula: "S + am / is / are + being + V3",
      vi: "Hiện tại tiếp diễn bị động — việc đang được tiến hành.",
    },
    {
      t: "quiz",
      id: "d15-np-dich-tiep-dien",
      title: "Dịch sang tiếng Anh — hiện tại tiếp diễn bị động (3 câu)",
      kind: "translate",
      grammar: "S + is / are + being + V3.",
      items: [
        { q: "Con đường trước nhà tôi đang được mở rộng.", hint: "The road in front of my house, is being widened", answers: ["The road in front of my house is being widened.", "The street in front of my house is being widened.", "The road in front of my house is being expanded.", "The road in front of my house is being made wider."] },
        { q: "Thư viện đang được sửa chữa nên tạm đóng cửa.", hint: "The library, is being repaired, so, it is closed / it is temporarily closed", answers: ["The library is being repaired, so it is closed.", "The library is being repaired so it is closed.", "The library is being repaired, so it's closed.", "The library is being repaired, so it is temporarily closed.", "The library is being repaired, so it's temporarily closed.", "The library is being repaired so it is temporarily closed.", "The library is being renovated, so it is closed.", "The library is being renovated, so it is temporarily closed."] },
        { q: "Hiện nay nhiều cây xanh đang được trồng trong thành phố.", hint: "Many trees, are being planted, in the city, now / at the moment", answers: ["Many trees are being planted in the city now.", "Many trees are now being planted in the city.", "Many trees are being planted in the city at the moment.", "At the moment, many trees are being planted in the city.", "Many trees are being planted in the city.", "Lots of trees are being planted in the city now.", "A lot of trees are being planted in the city now."] },
      ],
    },

    { t: "h", text: "4d. Tương lai & modal bị động: will be / can be / must be / should be + V3" },
    {
      t: "p",
      text: "Sau **will** và mọi **modal** (Ngày 13), dùng **be** nguyên mẫu + V3. Đây là nơi hai bài ngữ pháp gặp nhau: modal bị động rất hay dùng trong **Writing Task 2** (“Plastic bags **should be banned**”) và trong **bản đồ kế hoạch tương lai** (“The car park **will be replaced** by a park”).",
    },
    {
      t: "patterns",
      rows: [
        {
          formula: "S + will be + V3",
          vi: "Sẽ được làm (kế hoạch, dự đoán).",
          examples: [
            { en: "The old market will be replaced by a shopping centre.", vi: "Khu chợ cũ sẽ được thay bằng một trung tâm mua sắm." },
          ],
        },
        {
          formula: "S + can / must / should / may + be + V3",
          vi: "Có thể được / phải được / nên được làm.",
          examples: [
            { en: "Glass can be recycled again and again.", vi: "Thuỷ tinh có thể được tái chế nhiều lần." },
            { en: "Mobile phones must be switched off during the exam.", vi: "Điện thoại di động phải được tắt trong giờ thi." },
            { en: "Fast food advertising should be banned on children's TV.", vi: "Quảng cáo đồ ăn nhanh nên bị cấm trên kênh truyền hình thiếu nhi." },
          ],
        },
      ],
    },
    {
      t: "note",
      title: "Cẩn thận: be sau modal luôn ở dạng nguyên mẫu",
      items: [
        "~~can is recycled~~, ~~must are switched off~~ → **can be recycled**, **must be switched off** (sau modal là **be**, không chia).",
        "~~will built~~ → **will be built** (thiếu be là thành chủ động sai nghĩa).",
        "Phủ định: **won't be + V3**, **can't be + V3**, **shouldn't be + V3**: This plastic **can't be recycled**.",
      ],
    },
    {
      t: "rule",
      formula: "S + will / can / must / should / may + be + V3",
      vi: "Tương lai & modal bị động — be luôn nguyên mẫu sau will và modal.",
    },
    {
      t: "quiz",
      id: "d15-np-dich-modal",
      title: "Dịch sang tiếng Anh — tương lai & modal bị động (4 câu)",
      kind: "translate",
      grammar: "S + will be + V3 · S + can / must / should + be + V3.",
      items: [
        { q: "Một bệnh viện mới sẽ được xây vào năm sau.", hint: "A new hospital, will be built, next year", answers: ["A new hospital will be built next year.", "Next year a new hospital will be built.", "Next year, a new hospital will be built.", "A new hospital will be constructed next year."] },
        { q: "Túi ni-lông nên bị cấm ở các siêu thị.", hint: "Plastic bags, should be banned, in supermarkets", answers: ["Plastic bags should be banned in supermarkets.", "Plastic bags should be banned at supermarkets.", "Plastic bags ought to be banned in supermarkets."] },
        { q: "Giấy có thể được tái chế nhiều lần.", hint: "Paper, can be recycled, many times", answers: ["Paper can be recycled many times.", "Paper can be recycled several times.", "Paper can be recycled a number of times.", "Paper can be recycled many times over."] },
        { q: "Bài tập phải được nộp trước thứ Sáu.", hint: "The assignment / Assignments, must be submitted / handed in, before Friday / by Friday", answers: ["The assignment must be submitted before Friday.", "The assignment must be submitted by Friday.", "The assignment must be handed in before Friday.", "The assignment must be handed in by Friday.", "Assignments must be submitted by Friday.", "Assignments must be submitted before Friday.", "The homework must be submitted by Friday.", "The homework must be handed in by Friday."] },
      ],
    },

    { t: "h", text: "4e. Hiện tại hoàn thành bị động: has / have been + V3 (phần thêm)" },
    {
      t: "p",
      text: "Thì hiện tại hoàn thành bạn sẽ học kỹ ở Tập 2, nhưng **dạng bị động** của nó xuất hiện **trong mọi bài mô tả hai bản đồ** (quá khứ → hiện tại): việc thay đổi đã xảy ra ở một lúc nào đó và **kết quả còn đến bây giờ**. Học trước một khung là đủ dùng: **has / have been + V3**.",
    },
    {
      t: "patterns",
      rows: [
        {
          formula: "S (số ít) + has been + V3 · S (số nhiều) + have been + V3",
          vi: "Đã được làm (không nói rõ lúc nào), kết quả thấy được bây giờ — bản đồ “then and now”.",
          examples: [
            { en: "The farmland has been replaced by a housing estate.", vi: "Đất nông nghiệp đã được thay bằng một khu nhà ở." },
            { en: "Two new bridges have been built across the river.", vi: "Hai cây cầu mới đã được xây qua sông." },
          ],
        },
      ],
    },
    {
      t: "rule",
      formula: "S + has / have been + V3",
      vi: "Hiện tại hoàn thành bị động — thay đổi đã xảy ra, kết quả còn đến nay (bản đồ trước–sau).",
    },
    {
      t: "quiz",
      id: "d15-np-dich-hoan-thanh",
      title: "Dịch sang tiếng Anh — hiện tại hoàn thành bị động (3 câu)",
      kind: "translate",
      grammar: "S + has been + V3 (số ít) · S + have been + V3 (số nhiều).",
      items: [
        { q: "Nhà máy cũ đã được chuyển thành khu căn hộ.", hint: "The old factory, has been converted into, flats / apartments", answers: ["The old factory has been converted into flats.", "The old factory has been converted into apartments.", "The old factory has been turned into flats.", "The old factory has been turned into apartments.", "The old factory has been converted into an apartment block."] },
        { q: "Nhiều cây xanh đã bị chặt.", hint: "Many trees, have been cut down", answers: ["Many trees have been cut down.", "A lot of trees have been cut down.", "Lots of trees have been cut down."] },
        { q: "Một sân chơi đã được thêm vào cạnh trường học.", hint: "A playground, has been added, next to the school", answers: ["A playground has been added next to the school.", "A playground has been built next to the school.", "A playground has been added beside the school.", "A playground has been built beside the school.", "A new playground has been added next to the school."] },
      ],
    },

    /* ── 5 ── */
    { t: "h", text: "5. Phủ định và câu hỏi ở bị động" },
    {
      t: "table",
      head: ["Thì", "Phủ định", "Câu hỏi"],
      rows: [
        ["Hiện tại đơn", "The room **isn't cleaned** every day.", "**Is** the room **cleaned** every day?"],
        ["Quá khứ đơn", "The tickets **weren't sold** online.", "**Were** the tickets **sold** online?"],
        ["Hiện tại tiếp diễn", "The road **isn't being repaired**.", "**Is** the road **being repaired**?"],
        ["Tương lai / modal", "The library **won't be closed**. / It **can't be recycled**.", "**Will** the library **be closed**? / **Can** it **be recycled**?"],
        ["Câu hỏi Wh-", "—", "**Where were** these photos **taken**? · **When was** the bridge **built**?"],
      ],
    },
    {
      t: "note",
      title: "Mẹo: câu hỏi bị động hay gặp trong Speaking",
      items: [
        "**Where were you born?** — **be born** luôn ở dạng bị động: I **was born** in Hue (~~I born~~, ~~I am born~~).",
        "**What is your hometown known for?** → It **is known for** its beaches / its food.",
        "**Is English taught at primary schools in your country?** → Yes, it **is taught** from Grade 3.",
      ],
    },

    /* ── 6 ── */
    { t: "h", text: "6. Khi nào giữ “by + người làm”?" },
    {
      t: "table",
      head: ["Giữ by…", "Bỏ by…"],
      rows: [
        ["Người làm là **thông tin mới, quan trọng**: The novel was written **by Nguyen Du**.", "Người làm **không biết**: My wallet was stolen (~~by someone~~)."],
        ["Người làm **gây bất ngờ**: The bridge was designed **by a 19-year-old student**.", "Người làm **hiển nhiên**: The criminal was arrested (~~by the police~~)."],
        ["Phương tiện / công cụ: The leaves are rolled **by machine** / **by hand**.", "Người làm **chung chung**: English is spoken here (~~by people~~)."],
      ],
    },
    {
      t: "note",
      title: "Mẹo Task 1 quy trình",
      items: [
        "Trong quy trình, gần như **không bao giờ** có by + người (~~by workers~~, ~~by people~~). Chỉ giữ **by + phương tiện** khi hình có ghi: **by hand**, **by machine**, **by truck / by lorry**, **by conveyor belt**.",
        "Không có “a / the” sau by với phương tiện chung: **by machine**, **by truck** (~~by a truck~~ — nhưng **in a truck** thì có a).",
      ],
    },

    /* ── 7 ── */
    { t: "h", text: "7. Bị động trong mô tả quy trình (Writing Task 1 — Process)" },
    {
      t: "p",
      text: "Một dạng đề Task 1 là **process diagram** (sơ đồ quy trình): hình cho các bước làm ra một sản phẩm, rồi bạn mô tả lại trong **ít nhất 150 từ**. Vì trọng tâm là **sản phẩm** chứ không phải người làm, gần như **mọi câu đều là bị động ở hiện tại đơn**. Hình dưới đây là một quy trình tự đặt để luyện.",
    },
    {
      t: "figure",
      fig: {
        kind: "process",
        title: "How black tea is produced",
        note: "Số liệu tự đặt cho bài luyện.",
        steps: [
          { label: "Leaves picked by hand", note: "every 7–10 days" },
          { label: "Leaves spread out to wither", note: "12–16 hours" },
          { label: "Rolled by machine", note: "breaks the leaf cells" },
          { label: "Left to oxidise", note: "about 2 hours — turn dark brown" },
          { label: "Dried in hot ovens", note: "about 90°C" },
          { label: "Sorted by size", note: "" },
          { label: "Packed and sent to shops", note: "" },
        ],
      },
    },
    {
      t: "table",
      caption: "Từ nối trình tự — mỗi bước một từ nối khác nhau",
      head: ["Vị trí", "Từ nối", "Ví dụ trong bài mẫu"],
      rows: [
        ["Bước đầu", "First / Firstly / To begin with / At the first stage", "**First**, tea leaves are picked by hand…"],
        ["Bước giữa", "Then / Next / After that / Following this / Subsequently", "**Next**, the leaves are rolled by a machine…"],
        ["Nối hai bước", "Once + S + have/has been + V3 / After + V-ing", "**Once** they have been dried, the tea is sorted…"],
        ["Bước cuối", "Finally / Lastly / At the final stage", "**Finally**, it is packed and sent to shops."],
        ["Chỉ thời lượng / điều kiện", "for + khoảng thời gian · at + nhiệt độ · until + …", "left to wither **for** 12 to 16 hours · **at** about 90°C"],
      ],
    },
    {
      t: "examples",
      items: [
        { en: "The diagram shows how black tea is produced. There are seven stages in the process, beginning with the picking of the leaves and ending with the packing of the final product.", vi: "[Mở bài + tổng quan] Sơ đồ cho thấy trà đen được sản xuất như thế nào. Quy trình có bảy giai đoạn, bắt đầu bằng việc hái lá và kết thúc bằng việc đóng gói thành phẩm." },
        { en: "First, tea leaves are picked by hand every seven to ten days. They are then spread out and left to wither for 12 to 16 hours. Next, the leaves are rolled by a machine, which breaks their cells.", vi: "Đầu tiên, lá trà được hái bằng tay mỗi bảy đến mười ngày. Sau đó chúng được trải ra và để héo trong 12 đến 16 giờ. Tiếp theo, lá được vò bằng máy, làm vỡ các tế bào lá." },
        { en: "After that, they are left to oxidise for about two hours, during which time they turn dark brown. The leaves are then dried in hot ovens at about 90°C.", vi: "Sau đó, chúng được để ô-xi hoá khoảng hai giờ, trong thời gian đó lá chuyển màu nâu sẫm. Rồi lá được sấy trong lò nóng ở khoảng 90°C." },
        { en: "Once they have been dried, the tea is sorted by size. Finally, it is packed and sent to shops.", vi: "Khi đã được sấy khô, trà được phân loại theo kích cỡ. Cuối cùng, trà được đóng gói và gửi đến các cửa hàng." },
      ],
    },
    {
      t: "note",
      title: "Ghi nhớ: vì sao đoạn mẫu “chuẩn Task 1”",
      items: [
        "**Đủ 7 bước, đúng thứ tự, đúng số liệu** trong hình: every 7–10 days · 12–16 hours · about 2 hours · about 90°C.",
        "Câu **tổng quan** (overview): có **bao nhiêu bước**, **bắt đầu** và **kết thúc** bằng gì — câu quan trọng nhất của Task 1.",
        "Mỗi câu một từ nối **khác nhau** (First, then, Next, After that, Once, Finally) và **đổi chủ ngữ** (tea leaves → They → the leaves → the tea → it) để khỏi lặp.",
        "**turn dark brown** để chủ động — vì “chuyển màu” là việc lá **tự** xảy ra, không ai làm. Không phải câu nào cũng bị động.",
        "Đoạn này khoảng 120 từ để tập trung vào câu bị động. Bài Task 1 thật cần **ít nhất 150 từ**: mở bài + tổng quan + hai đoạn thân bài — xem hai bài mẫu đầy đủ (bản đồ, tái chế thuỷ tinh) ở bài **Từ vựng** hôm nay.",
      ],
    },
    {
      t: "rule",
      formula: "Từ nối (First / Next / After that / Once… / Finally) + S + is / are (+ then) + V3 (+ by machine / for + thời gian / at + nhiệt độ)",
      vi: "Khung câu mô tả quy trình — hiện tại đơn bị động, mỗi bước một từ nối.",
    },
    {
      t: "quiz",
      id: "d15-np-dich-quy-trinh",
      title: "Dịch sang tiếng Anh — câu mô tả quy trình (5 câu)",
      kind: "translate",
      grammar: "Từ nối + S + is / are + V3 (+ by machine / for + thời gian / at + nhiệt độ / into + hình dạng). Once + S + have / has been + V3, …",
      items: [
        { q: "Đầu tiên, sữa được thu gom từ các trang trại.", hint: "First, milk, is collected, from farms", answers: ["First, milk is collected from farms.", "First milk is collected from farms.", "First, the milk is collected from farms.", "First, milk is collected from the farms.", "Firstly, milk is collected from farms.", "To begin with, milk is collected from farms."] },
        { q: "Tiếp theo, nó được đun nóng đến 70°C.", hint: "Next, it, is heated, to 70°C", answers: ["Next, it is heated to 70°C.", "Next it is heated to 70°C.", "Next, it is heated to 70 degrees.", "Next, it is heated to 70 degrees Celsius.", "Next, the milk is heated to 70°C.", "Then, it is heated to 70°C."] },
        { q: "Sau đó, hỗn hợp được đổ vào khuôn.", hint: "After that, the mixture, is poured, into moulds", answers: ["After that, the mixture is poured into moulds.", "After that the mixture is poured into moulds.", "After that, the mixture is poured into molds.", "Then, the mixture is poured into moulds.", "After that, the mixture is poured into a mould.", "After that, the mixture is poured into a mold."] },
        { q: "Các viên gạch được để khô trong hai ngày.", hint: "The bricks, are left to dry, for two days", answers: ["The bricks are left to dry for two days.", "The bricks are left to dry for 2 days.", "The bricks are dried for two days."] },
        { q: "Cuối cùng, sản phẩm được đóng gói và vận chuyển đến siêu thị bằng xe tải.", hint: "Finally, the product(s), is / are packaged, and transported, to supermarkets, by truck / by lorry", answers: ["Finally, the product is packaged and transported to supermarkets by truck.", "Finally, the products are packaged and transported to supermarkets by truck.", "Finally, the product is packaged and transported to supermarkets by lorry.", "Finally, the products are packaged and transported to supermarkets by lorry.", "Finally, the product is packed and transported to supermarkets by truck.", "Finally, the products are packed and transported to supermarkets by truck.", "Finally the product is packaged and transported to supermarkets by truck.", "Finally, the product is packaged and delivered to supermarkets by truck.", "Finally, the products are packaged and delivered to supermarkets by truck."] },
      ],
    },

    /* ── 8 ── */
    { t: "h", text: "8. Động từ KHÔNG có bị động — bẫy lớn" },
    {
      t: "p",
      text: "Động từ **không có tân ngữ** (intransitive — nội động từ) thì **không có ai/cái gì “chịu” hành động**, nên **không đổi sang bị động được**. Người Việt hay sai vì tiếng Việt nói “tai nạn **được** xảy ra”, “giá **bị** tăng”.",
    },
    {
      t: "table",
      head: ["Động từ", "Sai", "Đúng"],
      rows: [
        ["happen / occur (xảy ra)", "~~The accident was happened at 9 p.m.~~", "The accident **happened** at 9 p.m."],
        ["take place (diễn ra)", "~~The festival is taken place in May.~~", "The festival **takes place** in May."],
        ["arrive (đến)", "~~The train was arrived late.~~", "The train **arrived** late."],
        ["rise / fall (tăng / giảm — Task 1)", "~~The number of tourists was risen.~~", "The number of tourists **rose**."],
        ["die (chết)", "~~Many fish were died.~~", "Many fish **died**."],
        ["appear / disappear (xuất hiện / biến mất)", "~~The forest has been disappeared.~~", "The forest **has disappeared**."],
        ["remain (vẫn giữ nguyên)", "~~The school was remained the same.~~", "The school **remained** the same / **remained unchanged**."],
      ],
    },
    {
      t: "note",
      title: "Cẩn thận: increase / reduce / change có HAI kiểu",
      items: [
        "**increase, decrease, change, open, close** vừa là nội động từ vừa là ngoại động từ: Prices **increased** (tự tăng) / Prices **were increased** by the company (công ty tăng giá).",
        "**rise** (tự tăng — không bị động) ≠ **raise** (nâng lên — có bị động): Taxes **rose**. / Taxes **were raised** by the government.",
        "**be born** thì ngược lại: **luôn** dùng dạng bị động: I **was born** in 2004.",
      ],
    },

    /* ── 9 ── */
    { t: "h", text: "9. Lỗi bị động người Việt hay mắc & bài luyện tổng hợp" },
    {
      t: "table",
      head: ["Sai", "Đúng", "Vì sao"],
      rows: [
        ["~~The bridge built in 1990.~~", "The bridge **was built** in 1990.", "Thiếu **be** → thành chủ động vô nghĩa (cây cầu tự xây)."],
        ["~~Rice is grew here.~~", "Rice is **grown** here.", "Sau be dùng **V3**, không dùng V2."],
        ["~~The leaves is dried.~~", "The leaves **are** dried.", "be chia theo chủ ngữ **số nhiều**."],
        ["~~Glass can recycled.~~", "Glass can **be** recycled.", "Sau modal là **be + V3**."],
        ["~~A new road is building now.~~", "A new road **is being built** now.", "Đang được làm → **being + V3**."],
        ["~~The meeting was taken place online.~~", "The meeting **took place** online.", "take place không có bị động."],
        ["~~I was born on 2004.~~", "I was born **in** 2004.", "Năm dùng **in**; ngày dùng on (on 30 May 2004)."],
        ["~~The tea is packed by workers.~~", "The tea **is packed**.", "Bỏ by + người làm hiển nhiên."],
      ],
    },
    {
      t: "quiz",
      id: "d15-np-dien",
      title: "Chia động từ trong ngoặc ở dạng bị động đúng thì (10 câu)",
      kind: "fill",
      items: [
        { q: "(1) Football ___ (play) all over the world. (hiện tại đơn)", answers: ["is played"], hint: "is / are + V3" },
        { q: "(2) The first iPhone ___ (sell) in 2007. (quá khứ đơn)", answers: ["was sold"], hint: "was / were + V3" },
        { q: "(3) Look! The windows ___ (clean) right now. (đang)", answers: ["are being cleaned"], hint: "are being + V3" },
        { q: "(4) The results ___ (announce) next Monday. (tương lai)", answers: ["will be announced"], hint: "will be + V3" },
        { q: "(5) Plastic bottles ___ (can / recycle) easily.", answers: ["can be recycled"], hint: "modal + be + V3" },
        { q: "(6) Many old houses ___ (knock down) since 2010. (hiện tại hoàn thành)", answers: ["have been knocked down"], hint: "have been + V3" },
        { q: "(7) The grapes ___ (crush) to make juice. (quy trình)", answers: ["are crushed"], hint: "chủ ngữ số nhiều" },
        { q: "(8) These photos ___ (take) by my grandfather in 1975.", answers: ["were taken"], hint: "quá khứ, số nhiều" },
        { q: "(9) Phones ___ (must / switch off) during the flight.", answers: ["must be switched off"], hint: "modal + be + V3" },
        { q: "(10) The accident ___ (happen) on a rainy night. (cẩn thận!)", answers: ["happened"], hint: "happen không có bị động" },
      ],
    },
    {
      t: "mcq",
      id: "d15-np-kiem-tra",
      title: "Kiểm tra cuối bài — câu bị động (10 câu)",
      items: [
        { q: "Our classroom ___ every afternoon.", options: ["cleans", "is cleaned", "is cleaning"], correct: 1, why: "Phòng học **được** dọn (không tự dọn) → bị động hiện tại đơn **is cleaned**." },
        { q: "The Eiffel Tower ___ in 1889.", options: ["was completed", "completed", "is completed"], correct: 0, why: "Việc đã xong năm 1889 → **was completed**. ~~completed~~ thiếu be (tháp tự hoàn thành)." },
        { q: "A new airport ___ near the city at the moment.", options: ["is built", "was built", "is being built"], correct: 2, why: "**at the moment** → đang được xây: **is being built**." },
        { q: "These vegetables ___ without chemicals.", options: ["are grown", "are grew", "grown"], correct: 0, why: "be + **V3**: grow → **grown**; chủ ngữ số nhiều → **are**." },
        { q: "The concert ___ in the main hall next Saturday.", options: ["will be taken place", "will take place", "will be took place"], correct: 1, why: "**take place** không có bị động → **will take place**." },
        { q: "Old batteries ___ thrown away with normal rubbish.", options: ["shouldn't", "shouldn't being", "shouldn't be"], correct: 2, why: "Modal bị động: **shouldn't be + V3**." },
        { q: "Where ___ you born?", options: ["were", "did", "are"], correct: 0, why: "**be born** → câu hỏi quá khứ: **Where were you born?**" },
        { q: "Task 1: “The old factory ___ into a museum.” (bản đồ: trước là nhà máy, nay là bảo tàng)", options: ["has converted", "has been converted", "converted"], correct: 1, why: "Nhà máy **được** chuyển đổi, kết quả còn đến nay → **has been converted**." },
        { q: "Câu nào KHÔNG nên giữ “by…”?", options: ["The song was written by a 12-year-old girl.", "The thief was arrested by the police.", "The leaves are rolled by machine."], correct: 1, why: "**by the police** là hiển nhiên (ai khác bắt trộm?) → bỏ. by a 12-year-old girl là thông tin bất ngờ; by machine là phương tiện trong quy trình." },
        { q: "The number of visitors ___ sharply in 2020.", options: ["was fallen", "was fell", "fell"], correct: 2, why: "**fall** là nội động từ → không có bị động: **fell**." },
      ],
    },
  ],
};

/* ─────────────────────────── Từ vựng ─────────────────────────── */

const D15_VOCAB: Lesson = {
  id: "d15-tu-vung",
  kind: "vocab",
  title: "Từ vựng: Bản đồ & quy trình (Maps & Processes)",
  goal: "Dùng đúng từ chỉ hướng, giới từ vị trí, tên địa điểm và động từ biến đổi để mô tả hai bản đồ “trước – sau”; dùng động từ quy trình và từ nối trình tự để mô tả một quy trình sản xuất — hai dạng Writing Task 1 và Listening Map Labelling.",
  minutes: 60,
  blocks: [
    {
      t: "recap",
      title: "Bài này học gì",
      items: [
        "**Bản đồ (maps)**: hướng (north, south-east…), ==in the north of ≠ to the north of==, 14 giới từ vị trí (opposite, between, next to…), 16 địa điểm có hình.",
        "**Động từ biến đổi** cho bản đồ “trước – sau”: ==be built · be demolished · be replaced by · be converted into · be extended · remain unchanged== (dùng ngay câu bị động của bài ngữ pháp).",
        "**Quy trình (processes)**: 20 động từ (collect, sort, crush, heat, pour…) + danh từ (stage, raw material, end product) + từ nối trình tự.",
        "Hai hình **Task 1 tự đặt**: bản đồ làng Ashford **2005 → nay** và quy trình **tái chế chai thuỷ tinh** — mỗi hình có **bài mẫu khớp từng chi tiết**.",
      ],
    },
    {
      t: "p",
      text: "Writing Task 1 không chỉ có biểu đồ số liệu. Hai dạng còn lại là **bản đồ** (map — thường hai bản đồ cùng một nơi ở hai thời điểm) và **quy trình** (process — các bước làm ra một sản phẩm hoặc một chu trình tự nhiên). Cả hai dạng cần một bộ từ riêng; Listening Part 2 (map labelling) cũng dùng đúng bộ từ chỉ vị trí này.",
    },

    /* ── Phần A: Bản đồ ── */
    { t: "h", text: "1. Phương hướng (directions)" },
    {
      t: "vocab",
      items: [
        { w: "north", pos: "n, adj, adv", ipa: "/nɔːθ/", vi: "phía bắc; hướng bắc", ex: "The new houses are in the north of the village.", exVi: "Các ngôi nhà mới nằm ở phía bắc ngôi làng.", more: "Tính từ **northern** (/ˈnɔːðən/ — âm th đổi thành /ð/): the **northern** part. Trạng từ: move **north** / **northwards**.", anh: "compass" },
        { w: "south", pos: "n, adj, adv", ipa: "/saʊθ/", vi: "phía nam; hướng nam", ex: "The river runs along the south of the town.", exVi: "Con sông chạy dọc phía nam thị trấn.", more: "Tính từ **southern** /ˈsʌðən/ (nguyên âm đổi /ʌ/). **southwards** = về phía nam." },
        { w: "east", pos: "n, adj, adv", ipa: "/iːst/", vi: "phía đông; hướng đông", ex: "The car park is on the east side of the shopping centre.", exVi: "Bãi đỗ xe ở phía đông trung tâm mua sắm.", more: "Tính từ **eastern** /ˈiːstən/ · on the **east** side / on the **eastern** edge." },
        { w: "west", pos: "n, adj, adv", ipa: "/west/", vi: "phía tây; hướng tây", ex: "The school was moved to the west of the city.", exVi: "Ngôi trường được dời về phía tây thành phố.", more: "Tính từ **western** /ˈwestən/." },
        { w: "north-east", pos: "n, adj", ipa: "/ˌnɔːθ ˈiːst/", vi: "phía đông bắc", ex: "A forest covered the north-east of the island.", exVi: "Một khu rừng phủ phía đông bắc hòn đảo.", more: "Luôn nói **north/south** TRƯỚC: north-east, south-west (~~east-north~~). Gạch nối có hay không đều được (northeast)." },
        { w: "south-west", pos: "n, adj", ipa: "/ˌsaʊθ ˈwest/", vi: "phía tây nam", ex: "The houses in the south-west have remained unchanged.", exVi: "Những ngôi nhà ở phía tây nam vẫn giữ nguyên.", more: "Tương tự: **north-west** (tây bắc), **south-east** (đông nam)." },
        { w: "edge", pos: "n", ipa: "/edʒ/", vi: "rìa, mép", ex: "A small shop stood on the eastern edge of the village.", exVi: "Một cửa hàng nhỏ nằm ở rìa phía đông ngôi làng.", more: "**on the edge of** · **on the outskirts of** (vùng ven, ngoại ô)." },
        { w: "centre", pos: "n", ipa: "/ˈsentə(r)/", vi: "trung tâm, chính giữa", ex: "There is a fountain in the centre of the square.", exVi: "Có một đài phun nước ở chính giữa quảng trường.", more: "**in the centre of** · Mỹ viết **center** · **city centre** (trung tâm thành phố)." },
      ],
    },
    {
      t: "sodo",
      kind: "compare",
      title: "in the north of ≠ to the north of",
      caption: "Một chữ khác nhau mà vị trí khác hẳn: “in” = nằm TRONG khu vực đó; “to … of” = nằm NGOÀI, về phía đó.",
      cols: [
        {
          title: "**in** the north **of** the town",
          items: [
            "Nằm **bên trong** thị trấn, ở phần phía bắc",
            "The hospital is **in the north of** the town.",
            "= bệnh viện thuộc thị trấn, ở khu bắc",
          ],
        },
        {
          title: "**to** the north **of** the town",
          items: [
            "Nằm **bên ngoài** thị trấn, về phía bắc",
            "The airport is **to the north of** the town.",
            "= sân bay ngoài thị trấn, đi về phía bắc",
          ],
        },
      ],
    },

    { t: "h", text: "2. Giới từ và cụm chỉ vị trí (14 cụm)" },
    {
      t: "table",
      head: ["Cụm", "Nghĩa", "Ví dụ"],
      rows: [
        ["**next to** / **beside**", "ngay cạnh", "The park is **next to** the main road."],
        ["**opposite** / **across from**", "đối diện (bên kia đường)", "The bank is **opposite** the post office."],
        ["**between** A **and** B", "ở giữa A và B", "The café is **between** the bank **and** the hotel."],
        ["**in front of**", "phía trước", "There is a bus stop **in front of** the school."],
        ["**behind**", "phía sau", "The car park is **behind** the hospital."],
        ["**near** / **close to**", "gần", "The station is **close to** the river."],
        ["**on the corner of** A **and** B", "ở góc đường A và B", "The pharmacy is **on the corner of** Hill Road **and** Park Street."],
        ["**at the end of**", "ở cuối (đường, hành lang)", "The library is **at the end of** the corridor."],
        ["**along**", "dọc theo", "Trees were planted **along** the river."],
        ["**across** / **over**", "băng qua, bắc qua", "A bridge has been built **across** the river."],
        ["**surrounded by**", "được bao quanh bởi", "The lake is **surrounded by** trees."],
        ["**adjacent to**", "liền kề (trang trọng)", "The new car park is **adjacent to** the shopping centre."],
        ["**on the left / right of**", "ở bên trái / phải của", "**On the right of** the entrance is the reception."],
        ["**to the east / west of**", "về phía đông / tây của", "The park lies **to the east of** the main road."],
      ],
    },
    {
      t: "note",
      title: "Cẩn thận: giới từ vị trí người Việt hay sai",
      items: [
        "~~opposite to the bank~~ → **opposite the bank** (không có to). Nhưng **across from** thì có from.",
        "~~next the school~~ → **next to** the school. ~~besides the river~~ (= ngoài ra) → **beside** the river (bên cạnh).",
        "~~between the bank with the hotel~~ → **between** the bank **and** the hotel.",
        "Đường phố: **in / on** Hill Road (Anh dùng cả hai); số nhà dùng **at**: at 27 Hill Road.",
        "Mô tả bản đồ dùng **lies / is located / is situated** cho đỡ lặp “is”: The park **lies** to the east of the road.",
      ],
    },

    { t: "h", text: "3. Thẻ hình: địa điểm trên bản đồ (16 từ)" },
    {
      t: "hinh",
      title: "Địa điểm hay gặp trong bản đồ Task 1 và Listening Map",
      items: [
        { anh: "houses", w: "housing estate", ro: "/ˈhaʊzɪŋ ɪsteɪt/", vi: "khu nhà ở (nhiều nhà xây cùng lúc)" },
        { anh: "house-with-garden", w: "detached house", ro: "/dɪˌtætʃt ˈhaʊs/", vi: "nhà riêng có vườn" },
        { anh: "office-building", w: "office block", ro: "/ˈɒfɪs blɒk/", vi: "toà nhà văn phòng" },
        { anh: "department-store", w: "shopping centre", ro: "/ˈʃɒpɪŋ sentə/", vi: "trung tâm mua sắm" },
        { anh: "factory", w: "factory", ro: "/ˈfæktri/", vi: "nhà máy" },
        { anh: "hospital", w: "hospital", ro: "/ˈhɒspɪtl/", vi: "bệnh viện" },
        { anh: "school", w: "school", ro: "/skuːl/", vi: "trường học" },
        { anh: "post-office", w: "post office", ro: "/ˈpəʊst ɒfɪs/", vi: "bưu điện" },
        { anh: "station", w: "train station", ro: "/ˈtreɪn steɪʃn/", vi: "ga tàu" },
        { anh: "bus-stop", w: "bus stop", ro: "/ˈbʌs stɒp/", vi: "trạm xe buýt" },
        { anh: "railway-track", w: "railway line", ro: "/ˈreɪlweɪ laɪn/", vi: "đường ray, tuyến đường sắt" },
        { anh: "motorway", w: "motorway", ro: "/ˈməʊtəweɪ/", vi: "đường cao tốc" },
        { anh: "bridge-at-night", w: "bridge", ro: "/brɪdʒ/", vi: "cây cầu" },
        { anh: "evergreen-tree", w: "woodland", ro: "/ˈwʊdlənd/", vi: "rừng cây, khu rừng nhỏ" },
        { anh: "tractor", w: "farmland", ro: "/ˈfɑːmlænd/", vi: "đất nông nghiệp" },
        { anh: "building-construction", w: "construction site", ro: "/kənˈstrʌkʃn saɪt/", vi: "công trường xây dựng" },
      ],
    },

    { t: "h", text: "4. Động từ biến đổi — mô tả bản đồ “trước – sau” (16 từ)" },
    {
      t: "p",
      text: "Bản đồ Task 1 hay cho **cùng một nơi ở hai năm** (2005 và nay, 1990 và 2020…). Bạn mô tả **cái gì đã thay đổi** — gần như luôn bằng **câu bị động**: cái được xây, cái bị phá, cái được chuyển thành cái khác. Ví dụ dưới đây dùng **has been + V3** (thay đổi tới nay) hoặc **was + V3** (năm cũ).",
    },
    {
      t: "vocab",
      items: [
        { w: "build / construct", pos: "v", ipa: "/bɪld/ · /kənˈstrʌkt/", vi: "xây, xây dựng", ex: "A new bridge has been built across the river.", exVi: "Một cây cầu mới đã được xây qua sông.", more: "construct trang trọng hơn. Danh từ **construction**. V3: built / constructed." },
        { w: "demolish", pos: "v", ipa: "/dɪˈmɒlɪʃ/", vi: "phá huỷ, phá dỡ (công trình)", ex: "The old cinema was demolished in 2015.", exVi: "Rạp chiếu phim cũ bị phá dỡ năm 2015.", more: "= **knock down** / **pull down** (thân mật hơn). Danh từ **demolition**." },
        { w: "knock down", pos: "phr v", ipa: "/ˌnɒk ˈdaʊn/", vi: "đập bỏ, phá đổ", ex: "Several houses were knocked down to widen the road.", exVi: "Vài ngôi nhà bị đập bỏ để mở rộng con đường." },
        { w: "replace", pos: "v", ipa: "/rɪˈpleɪs/", vi: "thay thế", ex: "The farmland has been replaced by a housing estate.", exVi: "Đất nông nghiệp đã được thay bằng một khu nhà ở.", more: "**A is replaced by B** = B thay A (B là cái MỚI). Đừng đảo ngược: ~~a housing estate was replaced by farmland~~ (nghĩa là nhà ở biến thành ruộng)." },
        { w: "convert", pos: "v", ipa: "/kənˈvɜːt/", vi: "chuyển đổi (công năng)", ex: "The factory has been converted into a shopping centre.", exVi: "Nhà máy đã được chuyển thành trung tâm mua sắm.", more: "**convert A into B** · = **turn A into B**. Danh từ **conversion**." },
        { w: "extend", pos: "v", ipa: "/ɪkˈstend/", vi: "kéo dài, nối dài; mở rộng", ex: "The main road has been extended southwards.", exVi: "Con đường chính đã được kéo dài về phía nam.", more: "Danh từ **extension** (phần nới thêm của toà nhà: a new extension)." },
        { w: "expand", pos: "v", ipa: "/ɪkˈspænd/", vi: "mở rộng (diện tích, quy mô)", ex: "The hospital was expanded to twice its original size.", exVi: "Bệnh viện được mở rộng gấp đôi diện tích ban đầu.", more: "Danh từ **expansion**. Gần nghĩa **enlarge**." },
        { w: "reduce", pos: "v", ipa: "/rɪˈdjuːs/", vi: "thu nhỏ, giảm bớt", ex: "The forest has been reduced to half its original size.", exVi: "Khu rừng đã bị thu hẹp còn một nửa diện tích ban đầu.", more: "**reduce to** + kích thước còn lại · **reduce by** + phần bị mất (reduced **by** 50%)." },
        { w: "remove", pos: "v", ipa: "/rɪˈmuːv/", vi: "dỡ bỏ, loại bỏ", ex: "The old fence was removed to create more space.", exVi: "Hàng rào cũ được dỡ bỏ để tạo thêm không gian." },
        { w: "relocate", pos: "v", ipa: "/ˌriːləʊˈkeɪt/", vi: "di dời (đến chỗ khác)", ex: "The bus station has been relocated to the edge of town.", exVi: "Bến xe buýt đã được di dời ra rìa thị trấn.", more: "= **move**. Danh từ **relocation**." },
        { w: "develop", pos: "v", ipa: "/dɪˈveləp/", vi: "xây dựng, khai thác (một khu đất) thành khu đô thị / công trình", ex: "The land to the north of the river has been developed into a housing estate.", exVi: "Khu đất phía bắc sông đã được xây dựng thành một khu nhà ở.", more: "**develop** A **into** B · danh từ **development** (a new housing development = khu nhà mới) · **developed / undeveloped** land." },
        { w: "plant", pos: "v", ipa: "/plɑːnt/", vi: "trồng (cây)", ex: "Trees have been planted along the river.", exVi: "Cây xanh đã được trồng dọc bờ sông." },
        { w: "cut down", pos: "phr v", ipa: "/ˌkʌt ˈdaʊn/", vi: "chặt (cây)", ex: "Half of the forest has been cut down.", exVi: "Một nửa khu rừng đã bị chặt.", more: "Trang trọng: **cleared** (the forest was cleared). V3 của cut vẫn là **cut**." },
        { w: "widen", pos: "v", ipa: "/ˈwaɪdn/", vi: "mở rộng (đường, lối đi)", ex: "The road was widened to four lanes.", exVi: "Con đường được mở rộng thành bốn làn.", more: "Hậu tố **-en** = làm cho…: widen, shorten, strengthen." },
        { w: "remain unchanged", pos: "phr", ipa: "/rɪˌmeɪn ʌnˈtʃeɪndʒd/", vi: "vẫn giữ nguyên", ex: "The houses in the south-west have remained unchanged.", exVi: "Những ngôi nhà ở phía tây nam vẫn giữ nguyên.", more: "**remain** là nội động từ → KHÔNG bị động (~~was remained~~). Cách khác: **stayed the same**." },
        { w: "make way for", pos: "phr", ipa: "/ˌmeɪk ˈweɪ fə(r)/", vi: "nhường chỗ cho, dọn chỗ cho", ex: "The shop was demolished to make way for a car park.", exVi: "Cửa hàng bị phá để nhường chỗ cho bãi đỗ xe." },
      ],
    },

    { t: "h", text: "5. Bài mẫu Task 1 — hai bản đồ làng Ashford" },
    {
      t: "p",
      text: "**Đề:** The maps below show the village of Ashford in 2005 and today. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words. — Phía **bắc** ở **trên cùng** cả hai bản đồ. Nhìn kỹ từng ô: cái gì **giữ nguyên**, cái gì **mất**, cái gì **mới**.",
    },
    {
      t: "figure",
      fig: {
        kind: "map",
        title: "Ashford village — 2005",
        note: "Bản đồ tự đặt cho bài luyện. Phía Bắc ở trên cùng.",
        map: {
          cols: 12,
          rows: 10,
          paths: [
            { x: 5.6, y: 0.2, w: 0.8, h: 7.3, label: "Main Road" },
            { x: 0.2, y: 7.5, w: 11.6, h: 1, label: "River Ash" },
          ],
          boxes: [
            { x: 0.4, y: 0.4, w: 4.8, h: 3, label: "Farmland" },
            { x: 6.8, y: 0.4, w: 4.8, h: 3, label: "Forest" },
            { x: 0.4, y: 3.8, w: 4.8, h: 3.4, label: "Houses" },
            { x: 6.8, y: 3.8, w: 2.6, h: 3.4, label: "Factory" },
            { x: 9.8, y: 3.8, w: 1.8, h: 3.4, label: "Shop" },
            { x: 0.4, y: 8.7, w: 11.2, h: 1.1, label: "Fields" },
          ],
        },
      },
    },
    {
      t: "figure",
      fig: {
        kind: "map",
        title: "Ashford village — today",
        note: "Bản đồ tự đặt cho bài luyện. Phía Bắc ở trên cùng.",
        map: {
          cols: 12,
          rows: 10,
          paths: [
            { x: 5.6, y: 0.2, w: 0.8, h: 9.6, label: "Main Road" },
            { x: 0.2, y: 7.5, w: 11.6, h: 1, label: "River Ash" },
          ],
          boxes: [
            { x: 0.4, y: 0.4, w: 4.8, h: 3, label: "Housing estate" },
            { x: 6.8, y: 0.4, w: 2.4, h: 3, label: "Park" },
            { x: 9.4, y: 0.4, w: 2.2, h: 3, label: "Forest" },
            { x: 0.4, y: 3.8, w: 4.8, h: 3.4, label: "Houses" },
            { x: 6.8, y: 3.8, w: 2.6, h: 3.4, label: "Shopping centre" },
            { x: 9.8, y: 3.8, w: 1.8, h: 3.4, label: "Car park" },
            { x: 5.2, y: 7.35, w: 1.6, h: 1.3, label: "Bridge" },
            { x: 0.4, y: 8.7, w: 4.8, h: 1.1, label: "Fields" },
            { x: 6.8, y: 8.7, w: 3.2, h: 1.1, label: "Train station" },
          ],
        },
      },
    },
    {
      t: "table",
      caption: "Bước 1 — lập bảng thay đổi trước khi viết",
      head: ["Vị trí", "2005", "Nay", "Động từ dùng"],
      rows: [
        ["Tây bắc (north-west)", "Farmland", "Housing estate", "**has been replaced by**"],
        ["Đông bắc (north-east)", "Forest (cả khu)", "Park + Forest (còn một nửa)", "**has been cut down** / **has been created**"],
        ["Tây nam (south-west)", "Houses", "Houses", "**have remained unchanged**"],
        ["Phía đông, giữa", "Factory", "Shopping centre", "**has been converted into**"],
        ["Rìa phía đông", "Shop", "Car park", "**has been demolished to make way for**"],
        ["Main Road", "dừng ở bờ sông", "kéo dài qua cầu mới", "**has been extended** / **has been built**"],
        ["Bờ nam sông", "Fields", "Fields + Train station", "**has been built**"],
      ],
    },
    {
      t: "examples",
      items: [
        { en: "The two maps show the village of Ashford in 2005 and how it looks today.", vi: "[Mở bài] Hai bản đồ cho thấy làng Ashford năm 2005 và diện mạo của nó hiện nay." },
        { en: "Overall, the village has become far more developed, with new housing, shops and transport links, while some of its green space has been lost.", vi: "[Tổng quan] Nhìn chung, ngôi làng đã phát triển hơn nhiều, với nhà ở, cửa hàng và đường giao thông mới, trong khi một phần không gian xanh đã mất đi." },
        { en: "In 2005, the north-west of the village was farmland, but this area has since been replaced by a housing estate. To the east of the main road, half of the forest has been cut down and a park has been created in its place. The houses in the south-west have remained unchanged.", vi: "[Thân 1 — phía bắc] Năm 2005, phía tây bắc làng là đất nông nghiệp, nhưng từ đó khu này đã được thay bằng một khu nhà ở. Ở phía đông con đường chính, một nửa khu rừng đã bị chặt và một công viên được tạo ra ở chỗ đó. Những ngôi nhà ở phía tây nam vẫn giữ nguyên." },
        { en: "In the south-east, the factory has been converted into a shopping centre, and the shop next to it has been demolished to make way for a car park. The most noticeable change, however, is in the south. The main road, which used to end at the river, has been extended across a new bridge, and a train station has been built on the southern bank, to the east of the road.", vi: "[Thân 2 — phía nam] Ở phía đông nam, nhà máy đã được chuyển thành trung tâm mua sắm, và cửa hàng bên cạnh đã bị phá để nhường chỗ cho bãi đỗ xe. Tuy nhiên, thay đổi dễ thấy nhất nằm ở phía nam. Con đường chính, vốn dừng ở bờ sông, đã được kéo dài qua một cây cầu mới, và một ga tàu đã được xây ở bờ nam, phía đông con đường." },
      ],
    },
    {
      t: "note",
      title: "Ghi nhớ: vì sao bài mẫu đạt chuẩn Task 1 bản đồ (162 từ)",
      items: [
        "**Đủ 7 thay đổi** trong bảng — không bỏ sót ô nào, kể cả cái **không đổi** (the houses… have remained unchanged).",
        "**Tổng quan** nói xu hướng chung (more developed, green space lost) — không liệt kê chi tiết.",
        "Chia thân bài theo **vùng** (bắc → nam) chứ không nhảy lung tung — giám khảo đọc theo được bằng mắt trên bản đồ.",
        "Thì: **was** cho năm 2005, **has been + V3** cho thay đổi đến nay, **used to** (đã từng) cho trạng thái cũ. Không viết “I can see…” — Task 1 không dùng ngôi thứ nhất.",
      ],
    },
    {
      t: "rule",
      formula: "In [năm cũ], the [vị trí] was + N, but this has since been replaced by / converted into + N. · N + has / have been + V3 (+ to make way for + N). · N + has / have remained unchanged.",
      vi: "Khung câu bản đồ “trước – sau”: vị trí + thì đúng + động từ biến đổi ở bị động.",
    },
    {
      t: "quiz",
      id: "d15-tv-dich-ban-do",
      title: "Dịch sang tiếng Anh — câu mô tả bản đồ (5 câu)",
      kind: "translate",
      grammar: "N + has / have been + V3 (replaced by / converted into / built / demolished / extended) · N + has / have remained unchanged · in the north of / to the east of.",
      items: [
        { q: "Bệnh viện đã được mở rộng gấp đôi.", hint: "The hospital, has been expanded, to twice its original size / to double its size", answers: ["The hospital has been expanded to twice its original size.", "The hospital has been expanded to double its size.", "The hospital has been expanded to twice its size.", "The hospital has been expanded to double its original size.", "The hospital has doubled in size."] },
        { q: "Khu chợ cũ đã được thay bằng một bãi đỗ xe.", hint: "The old market, has been replaced by, a car park", answers: ["The old market has been replaced by a car park.", "The old market has been replaced with a car park.", "The old market has been replaced by a parking lot.", "The old market was replaced by a car park."] },
        { q: "Ngôi trường ở phía tây vẫn giữ nguyên.", hint: "The school in the west, has remained unchanged", answers: ["The school in the west has remained unchanged.", "The school in the west remained unchanged.", "The school in the west has stayed the same.", "The school in the west has remained the same."] },
        { q: "Một cây cầu mới đã được xây bắc qua sông.", hint: "A new bridge, has been built, across / over the river", answers: ["A new bridge has been built across the river.", "A new bridge has been built over the river.", "A new bridge has been constructed across the river.", "A new bridge has been constructed over the river."] },
        { q: "Nhà máy đã bị phá dỡ để nhường chỗ cho một công viên.", hint: "The factory, has been demolished / knocked down, to make way for, a park", answers: ["The factory has been demolished to make way for a park.", "The factory has been knocked down to make way for a park.", "The factory was demolished to make way for a park.", "The factory was knocked down to make way for a park.", "The factory has been pulled down to make way for a park."] },
      ],
    },

    /* ── Phần B: Quy trình ── */
    { t: "h", text: "6. Quy trình tự nhiên và quy trình nhân tạo" },
    {
      t: "sodo",
      kind: "compare",
      title: "Hai loại process diagram trong Task 1",
      caption: "Loại nhân tạo dùng bị động gần như mọi câu; loại tự nhiên dùng nhiều chủ động hơn (vật tự lớn lên, tự biến đổi).",
      cols: [
        {
          title: "**Natural process** — chu trình tự nhiên",
          anh: "seedling",
          items: [
            "Vòng đời con vật, cây cối; vòng tuần hoàn nước",
            "Thường là **vòng tròn** (cycle) — không có điểm cuối",
            "Nhiều **chủ động**: The eggs **hatch**. The plant **grows**.",
            "Từ hay gặp: stage, cycle, develop into, turn into",
          ],
        },
        {
          title: "**Man-made process** — quy trình sản xuất",
          anh: "factory",
          items: [
            "Làm ra sản phẩm: trà, gạch, giấy tái chế…",
            "Có **điểm đầu** (nguyên liệu) và **điểm cuối** (thành phẩm)",
            "Gần như toàn **bị động**: The glass **is crushed**.",
            "Từ hay gặp: raw material, machine, end product",
          ],
        },
      ],
    },

    { t: "h", text: "7. Động từ quy trình (20 từ)" },
    {
      t: "vocab",
      items: [
        { w: "collect", pos: "v", ipa: "/kəˈlekt/", vi: "thu gom", ex: "Used bottles are collected from recycling bins.", exVi: "Chai đã dùng được thu gom từ các thùng tái chế.", more: "Danh từ **collection** (the collection of waste)." },
        { w: "load", pos: "v", ipa: "/ləʊd/", vi: "chất (hàng) lên", ex: "The bottles are loaded onto trucks and transported to the plant.", exVi: "Các chai được chất lên xe tải và vận chuyển đến nhà máy.", more: "**load** A **onto** B · trái nghĩa **unload** (dỡ xuống). **transport** (v) /trænˈspɔːt/ = vận chuyển — động từ nhấn âm **sau**, danh từ (Ngày 12) nhấn âm **đầu**.", anh: "delivery-truck" },
        { w: "deliver", pos: "v", ipa: "/dɪˈlɪvə(r)/", vi: "giao (hàng)", ex: "The finished products are delivered to shops.", exVi: "Thành phẩm được giao đến các cửa hàng.", more: "Danh từ **delivery**." },
        { w: "sort", pos: "v", ipa: "/sɔːt/", vi: "phân loại", ex: "The rubbish is sorted into paper, plastic and metal.", exVi: "Rác được phân loại thành giấy, nhựa và kim loại.", more: "**sort A into B** · **sort by** colour / size." },
        { w: "wash", pos: "v", ipa: "/wɒʃ/", vi: "rửa", ex: "The fruit is washed to remove dirt.", exVi: "Trái cây được rửa để loại bỏ đất bẩn." },
        { w: "crush", pos: "v", ipa: "/krʌʃ/", vi: "nghiền vụn, ép nát", ex: "The glass is crushed into small pieces.", exVi: "Thuỷ tinh được nghiền thành mảnh nhỏ.", more: "**crush into** + kết quả · gần nghĩa **grind** (xay mịn — grind/ground/ground)." },
        { w: "grind", pos: "v", ipa: "/ɡraɪnd/", vi: "xay, nghiền mịn", ex: "The roasted beans are ground into powder.", exVi: "Hạt rang được xay thành bột.", more: "Bất quy tắc: grind – **ground** – **ground**." },
        { w: "heat", pos: "v", ipa: "/hiːt/", vi: "đun nóng, làm nóng", ex: "The mixture is heated to 1,500°C.", exVi: "Hỗn hợp được nung nóng đến 1.500°C.", more: "**heat to** + nhiệt độ đích · **heat at** + nhiệt độ duy trì.", anh: "fire" },
        { w: "melt", pos: "v", ipa: "/melt/", vi: "tan chảy; làm tan chảy", ex: "The glass melts at a very high temperature.", exVi: "Thuỷ tinh nóng chảy ở nhiệt độ rất cao.", more: "Vừa nội vừa ngoại động từ: The ice **melts** (tự tan) / The glass **is melted** (bị nấu chảy)." },
        { w: "mix", pos: "v", ipa: "/mɪks/", vi: "trộn", ex: "The clay is mixed with sand and water.", exVi: "Đất sét được trộn với cát và nước.", more: "**mix A with B** · danh từ **mixture** (hỗn hợp)." },
        { w: "pour", pos: "v", ipa: "/pɔː(r)/", vi: "đổ, rót", ex: "The liquid is poured into moulds.", exVi: "Chất lỏng được đổ vào khuôn.", more: "Đọc như **poor** giọng Anh /pɔː/. **pour into** + vật chứa." },
        { w: "shape", pos: "v", ipa: "/ʃeɪp/", vi: "tạo hình", ex: "The hot glass is shaped into bottles.", exVi: "Thuỷ tinh nóng được tạo hình thành chai.", more: "**shape A into B** · gần nghĩa **form**, **mould**." },
        { w: "cool", pos: "v", ipa: "/kuːl/", vi: "làm nguội", ex: "The bricks are left to cool for two days.", exVi: "Gạch được để nguội trong hai ngày.", more: "**be left to cool** = được để cho nguội. Trái nghĩa **heat**." },
        { w: "dry", pos: "v", ipa: "/draɪ/", vi: "làm khô, sấy", ex: "The leaves are dried in the sun.", exVi: "Lá được phơi khô dưới nắng.", more: "V3: **dried** (y → ied)." },
        { w: "filter", pos: "v", ipa: "/ˈfɪltə(r)/", vi: "lọc", ex: "The water is filtered to remove small particles.", exVi: "Nước được lọc để loại bỏ hạt nhỏ." },
        { w: "place", pos: "v", ipa: "/pleɪs/", vi: "đặt, xếp vào", ex: "The fish is placed in wooden barrels.", exVi: "Cá được xếp vào các thùng gỗ.", more: "Trang trọng hơn **put** · **place** A **in / on** B · danh từ **place** = nơi chốn. (**store** = cất trữ — Ngày 14.)" },
        { w: "fill", pos: "v", ipa: "/fɪl/", vi: "làm đầy, chiết đầy", ex: "The bottles are filled with juice.", exVi: "Các chai được chiết đầy nước ép.", more: "**fill A with B** (~~fill B into A~~)." },
        { w: "label", pos: "v", ipa: "/ˈleɪbl/", vi: "dán nhãn", ex: "Each bottle is labelled before it leaves the factory.", exVi: "Mỗi chai được dán nhãn trước khi rời nhà máy.", more: "V3 Anh: **labelled** (gấp đôi l); Mỹ: **labeled**." },
        { w: "package", pos: "v", ipa: "/ˈpækɪdʒ/", vi: "đóng gói", ex: "The biscuits are packaged in boxes of twelve.", exVi: "Bánh quy được đóng gói thành hộp mười hai cái.", more: "= **pack**. Danh từ **packaging** (bao bì).", anh: "package" },
        { w: "harvest", pos: "v", ipa: "/ˈhɑːvɪst/", vi: "thu hoạch", ex: "The rice is harvested in October.", exVi: "Lúa được thu hoạch vào tháng Mười.", more: "Danh từ: **the harvest** (vụ thu hoạch).", anh: "sheaf-of-rice" },
      ],
    },
    {
      t: "vocab",
      items: [
        { w: "stage", pos: "n", ipa: "/steɪdʒ/", vi: "giai đoạn", ex: "There are eight stages in the process.", exVi: "Quy trình có tám giai đoạn.", more: "**at the first / final stage** · gần nghĩa **step**, **phase**." },
        { w: "raw material", pos: "n", ipa: "/ˌrɔː məˈtɪəriəl/", vi: "nguyên liệu thô", ex: "Sand is the main raw material for glass.", exVi: "Cát là nguyên liệu thô chính để làm thuỷ tinh." },
        { w: "recycling plant", pos: "n", ipa: "/riːˈsaɪklɪŋ plɑːnt/", vi: "nhà máy tái chế", ex: "The bottles are taken to a recycling plant.", exVi: "Các chai được đưa đến nhà máy tái chế.", more: "**plant** ở đây = nhà máy (power plant, recycling plant), không phải cái cây.", anh: "recycling-symbol" },
        { w: "machine", pos: "n", ipa: "/məˈʃiːn/", vi: "máy móc", ex: "The leaves are rolled by machine.", exVi: "Lá được vò bằng máy.", more: "**by machine** / **by hand** (không mạo từ).", anh: "gear" },
        { w: "conveyor belt", pos: "n", ipa: "/kənˈveɪə belt/", vi: "băng chuyền", ex: "The bottles move along a conveyor belt.", exVi: "Các chai di chuyển trên băng chuyền." },
        { w: "mould", pos: "n", ipa: "/məʊld/", vi: "khuôn", ex: "The liquid glass is poured into moulds.", exVi: "Thuỷ tinh lỏng được đổ vào khuôn.", more: "Mỹ viết **mold**. Cũng là động từ: **mould** = tạo hình bằng khuôn." },
        { w: "temperature", pos: "n", ipa: "/ˈtemprətʃə(r)/", vi: "nhiệt độ", ex: "The oven is kept at a temperature of 90°C.", exVi: "Lò được giữ ở nhiệt độ 90°C.", more: "**at a temperature of** · **high / low** temperature.", anh: "thermometer" },
        { w: "end product", pos: "n", ipa: "/ˈend ˌprɒdʌkt/", vi: "thành phẩm, sản phẩm cuối cùng", ex: "The end product is sold in supermarkets.", exVi: "Thành phẩm được bán ở siêu thị.", more: "= **final product** · **finished product**." },
      ],
    },
    {
      t: "note",
      title: "Mẹo: đừng dùng một động từ cho mọi bước",
      items: [
        "Người mới hay viết ~~is put~~ ở mọi câu (is put in a machine, is put in a truck…). Dùng đúng động từ: **transported**, **poured**, **placed**, **loaded**, **fed into** (cho vào máy).",
        "Đề bài in sẵn từ trong hình (dạng danh từ: “Collection”, “Sorting”) — **đổi sang động từ bị động**: Collection → **are collected**; Sorting → **is sorted**. Vừa đúng ngữ pháp vừa không chép nguyên văn.",
        "Thêm **mục đích** bằng **to + V** hoặc **in order to**: washed **to remove** labels; heated **in order to** melt it.",
      ],
    },

    { t: "h", text: "8. Bài mẫu Task 1 — quy trình tái chế chai thuỷ tinh" },
    {
      t: "figure",
      fig: {
        kind: "process",
        title: "How glass bottles are recycled",
        note: "Số liệu tự đặt cho bài luyện.",
        steps: [
          { label: "Used bottles collected", note: "from recycling bins" },
          { label: "Transported to recycling plant", note: "by truck" },
          { label: "Sorted by colour", note: "clear / green / brown" },
          { label: "Washed", note: "labels and dirt removed" },
          { label: "Crushed into small pieces", note: "called “cullet”" },
          { label: "Mixed with sand, heated", note: "to 1,500°C" },
          { label: "Poured into moulds", note: "shaped into new bottles" },
          { label: "Filled, labelled, delivered", note: "to shops" },
        ],
      },
    },
    {
      t: "examples",
      items: [
        { en: "The diagram illustrates how used glass bottles are recycled to make new ones. The process consists of eight stages, from the collection of old bottles to the delivery of new ones to shops, and most of these stages take place at a recycling plant.", vi: "[Mở bài + tổng quan] Sơ đồ minh hoạ cách chai thuỷ tinh đã qua sử dụng được tái chế để làm chai mới. Quy trình gồm tám giai đoạn, từ việc thu gom chai cũ đến việc giao chai mới đến cửa hàng, và phần lớn các giai đoạn diễn ra tại một nhà máy tái chế." },
        { en: "First, used bottles are collected from recycling bins, after which they are loaded onto trucks and transported to a recycling plant. At the plant, the glass is sorted by colour into clear, green and brown, and it is then washed to remove labels and dirt.", vi: "Đầu tiên, chai đã dùng được thu gom từ các thùng tái chế, sau đó được chất lên xe tải và chở đến nhà máy tái chế. Tại nhà máy, thuỷ tinh được phân loại theo màu thành trong suốt, xanh lá và nâu, rồi được rửa để loại bỏ nhãn và bụi bẩn." },
        { en: "Next, the clean glass is crushed into small pieces, which are known as cullet. After that, the cullet is mixed with sand and heated to a temperature of 1,500°C until it melts and becomes liquid.", vi: "Tiếp theo, thuỷ tinh sạch được nghiền thành mảnh nhỏ, gọi là cullet. Sau đó, cullet được trộn với cát và nung đến nhiệt độ 1.500°C cho đến khi nóng chảy thành chất lỏng." },
        { en: "The liquid glass is then poured into moulds and shaped into new bottles. Finally, these bottles are filled, labelled and delivered to shops, where they can be bought and later recycled again.", vi: "Thuỷ tinh lỏng sau đó được đổ vào khuôn và tạo hình thành chai mới. Cuối cùng, những chai này được chiết đầy, dán nhãn và giao đến cửa hàng, nơi chúng được mua và sau này lại được tái chế." },
      ],
    },
    {
      t: "note",
      title: "Ghi nhớ: đối chiếu bài mẫu với hình (156 từ)",
      items: [
        "8 ô trong hình = 8 bước trong bài, **đúng thứ tự**; mọi chi tiết phụ đều có: from recycling bins · trucks · clear / green / brown · labels and dirt · cullet · 1,500°C · moulds · to shops.",
        "Từ nối không lặp: **First → At the plant → then → Next → After that → then → Finally**.",
        "Câu cuối thêm **where they can be bought and later recycled again** — nhắc rằng đây là một **vòng tuần hoàn**, cách kết tự nhiên cho quy trình tái chế (không thêm số liệu ngoài hình).",
      ],
    },
    {
      t: "rule",
      formula: "The diagram illustrates how + N + is / are + V3. + The process consists of [số] stages, from [bước đầu] to [bước cuối]. + First / Next / After that / Finally + S + is / are + V3.",
      vi: "Khung bài quy trình: mở bài (paraphrase đề) + tổng quan (số bước, đầu, cuối) + từng bước bị động có từ nối.",
    },
    {
      t: "quiz",
      id: "d15-tv-dich-quy-trinh",
      title: "Dịch sang tiếng Anh — câu quy trình (4 câu)",
      kind: "translate",
      grammar: "S + is / are + V3 (+ into / with / by / to …) · The process consists of + số + stages, from … to …",
      items: [
        { q: "Quy trình gồm sáu giai đoạn.", hint: "The process, consists of, six stages", answers: ["The process consists of six stages.", "The process consists of 6 stages.", "There are six stages in the process.", "The process has six stages.", "The process is made up of six stages."] },
        { q: "Thuỷ tinh được nghiền thành những mảnh nhỏ.", hint: "The glass, is crushed, into small pieces", answers: ["The glass is crushed into small pieces.", "Glass is crushed into small pieces.", "The glass is broken into small pieces."] },
        { q: "Hỗn hợp được nung nóng đến 1.500 độ C.", hint: "The mixture, is heated, to 1,500°C", answers: ["The mixture is heated to 1,500°C.", "The mixture is heated to 1500°C.", "The mixture is heated to 1,500 degrees Celsius.", "The mixture is heated to 1500 degrees Celsius.", "The mixture is heated to 1,500 degrees.", "The mixture is heated to 1500 degrees."] },
        { q: "Các chai được chiết đầy và dán nhãn.", hint: "The bottles, are filled, and labelled", answers: ["The bottles are filled and labelled.", "The bottles are filled and labeled.", "Bottles are filled and labelled.", "Bottles are filled and labeled."] },
      ],
    },

    { t: "h", text: "9. Luyện tập" },
    {
      t: "mcq",
      id: "d15-tv-chon",
      title: "Chọn đáp án đúng (8 câu)",
      items: [
        { q: "The bank is ___ the post office, on the other side of the street.", options: ["opposite to", "next", "opposite"], correct: 2, why: "**opposite** + danh từ (không có to). next phải là **next to**." },
        { q: "The airport is 20 km ___ the city.", options: ["to the north of", "in the north of", "on the north of"], correct: 0, why: "Cách thành phố 20 km → nằm **ngoài** thành phố → **to the north of**." },
        { q: "The farmland has been ___ by a housing estate.", options: ["converted", "replaced", "removed"], correct: 1, why: "**be replaced by** + cái mới. convert đi với **into**; remove không đi với by + cái mới." },
        { q: "The old warehouse has been converted ___ a museum.", options: ["to be", "by", "into"], correct: 2, why: "Cụm cố định **convert A into B**." },
        { q: "The trees along the river have ___.", options: ["remained unchanged", "been remained", "remain unchanged"], correct: 0, why: "**remain** không có bị động → **have remained unchanged**." },
        { q: "The coffee beans are ___ into a fine powder.", options: ["grinded", "ground", "grind"], correct: 1, why: "grind – ground – **ground** (bất quy tắc)." },
        { q: "The bottles are transported to the factory ___.", options: ["by truck", "by a truck", "with truck"], correct: 0, why: "Phương tiện: **by + danh từ không mạo từ** (by truck, by train, by hand)." },
        { q: "Which word means the FINAL result of a manufacturing process?", options: ["raw material", "conveyor belt", "end product"], correct: 2, why: "**end product** = thành phẩm. raw material = nguyên liệu đầu vào; conveyor belt = băng chuyền." },
      ],
    },
    {
      t: "quiz",
      id: "d15-tv-ban-do",
      title: "Điền theo hai bản đồ Ashford (8 câu) — mỗi chỗ một từ",
      kind: "fill",
      items: [
        { q: "(1) In 2005, the north-west of the village was ___.", answers: ["farmland"], hint: "nhìn ô góc trên bên trái, bản đồ 2005" },
        { q: "(2) The farmland has been replaced ___ a housing estate.", answers: ["by", "with"], hint: "replaced ___ + cái mới" },
        { q: "(3) The park lies to the ___ of the main road.", answers: ["east"], hint: "hướng" },
        { q: "(4) The factory has been ___ into a shopping centre.", answers: ["converted", "turned"], hint: "chuyển đổi công năng" },
        { q: "(5) The shop has been ___ to make way for a car park.", answers: ["demolished", "removed"], hint: "phá dỡ" },
        { q: "(6) The houses in the south-west have remained ___.", answers: ["unchanged"], hint: "giữ nguyên" },
        { q: "(7) A new bridge has been built ___ the river.", answers: ["across", "over"], hint: "bắc qua" },
        { q: "(8) The train station is ___ the southern bank of the river.", answers: ["on"], hint: "giới từ với bank (bờ)" },
      ],
    },
    {
      t: "quiz",
      id: "d15-tv-quy-trinh",
      title: "Điền theo quy trình tái chế chai thuỷ tinh (8 câu) — mỗi chỗ một từ",
      kind: "fill",
      items: [
        { q: "(1) Used bottles are ___ from recycling bins.", answers: ["collected"], hint: "bước 1" },
        { q: "(2) They are transported to a recycling plant ___ truck.", answers: ["by"], hint: "phương tiện" },
        { q: "(3) The glass is sorted by ___.", answers: ["colour", "color"], hint: "clear / green / brown" },
        { q: "(4) It is washed to ___ labels and dirt.", answers: ["remove"], hint: "to + V (mục đích)" },
        { q: "(5) The clean glass is ___ into small pieces.", answers: ["crushed"], hint: "bước 5" },
        { q: "(6) The cullet is mixed with sand and ___ to 1,500°C.", answers: ["heated"], hint: "bước 6" },
        { q: "(7) The liquid glass is ___ into moulds.", answers: ["poured"], hint: "đổ" },
        { q: "(8) ___, the bottles are filled, labelled and delivered to shops.", answers: ["Finally", "Lastly"], hint: "từ nối bước cuối" },
      ],
    },
  ],
};

/* ─────────────────────────── Nghe ─────────────────────────── */
/*
 * Kịch bản tự viết, dạng Section 1 nâng cao. Số điện thoại: người gọi đọc bằng chữ
 * ("oh seven nine one two, double four six…"), người nghe đọc lại từng chữ số cách nhau
 * ("0 7 9 1 2 4 4 6 0 5 8") để giọng máy đọc rõ từng số và đáp án có mặt nguyên văn trong lời.
 */

const D15_LISTENING: Lesson = {
  id: "d15-nghe",
  kind: "listening",
  title: "Listening: Form Completion — ôn trọn Section 1 nâng cao",
  goal: "Làm đúng dạng Form Completion (Section 1) với các bẫy khó: thông tin bị sửa giữa chừng, số điện thoại có double/triple/oh, tên phải đánh vần, ngày tháng, tiền và số dễ nhầm (13/30) — viết đúng giới hạn ONE WORD AND/OR A NUMBER.",
  minutes: 55,
  blocks: [
    {
      t: "recap",
      title: "Bài này học gì",
      items: [
        "**Form Completion** = điền vào **phiếu / đơn** (họ tên, địa chỉ, số điện thoại, ngày, giá…) — dạng gần như luôn có ở **Section 1**, câu dễ lấy điểm nhất nếu không dính bẫy.",
        "**6 bẫy**: ==sửa thông tin== (“no, sorry…”) · **số điện thoại** (oh, double, triple) · **đánh vần** (G/J, A/E/I, M/N) · **ngày tháng** · **13 / 30** · **tiền sau giảm giá**.",
        "Giới hạn **ONE WORD AND/OR A NUMBER**: được viết 1 từ (evening), 1 số (270), hoặc 1 từ + 1 số (30th… / 27 Holloway). Mã bưu điện (NW5 2QT) tính là MỘT mã. Viết 2 từ là sai.",
        "Luyện: **chép đánh vần 8 mục**, **phát âm 13/30**, 2 cuộc gọi: **đăng ký khoá học** (10 câu) và **báo mất đồ** (8 câu).",
      ],
    },

    { t: "h", text: "1. Form Completion trong Section 1" },
    {
      t: "table",
      head: ["Đặc điểm", "Section 1", "Ghi nhớ"],
      rows: [
        ["Người nói", "**2 người**, thường qua điện thoại: một người hỏi, một người cung cấp thông tin", "Người **điền phiếu** thường đọc lại (read back) — nghe lần hai miễn phí"],
        ["Bối cảnh", "Đời sống: đăng ký khoá học, đặt phòng, thuê xe, báo mất đồ, mua bảo hiểm…", "Từ vựng dễ, bẫy nằm ở **chi tiết**"],
        ["Đáp án", "Tên riêng, số, ngày, tiền, một danh từ", "Viết **hoa** tên riêng cũng được, không bắt buộc; nhưng **chính tả** phải đúng tuyệt đối"],
        ["Giới hạn", "ONE WORD AND/OR A NUMBER (hay gặp nhất)", "£270 → viết **270** (ký hiệu £ đã in sẵn trên phiếu)"],
      ],
    },
    {
      t: "sodo",
      kind: "flow",
      title: "Chiến thuật Form Completion — 6 bước",
      caption: "Bước 2 quan trọng nhất: đoán đúng LOẠI đáp án (số? tên? ngày?) thì tai biết phải chờ cái gì.",
      steps: [
        { label: "1. Đọc tiêu đề phiếu", sub: "Biết bối cảnh: Enrolment form → hỏi tên, ngày sinh, trình độ, học phí" },
        { label: "2. Đoán loại đáp án", sub: "Ghi bên lề: tên / số / ngày / tiền / danh từ" },
        { label: "3. Nghe thông tin ĐẦU TIÊN", sub: "…nhưng chưa viết vội nếu nghe thấy “but”, “actually”, “sorry”" },
        { label: "4. Chờ thông tin CHỐT", sub: "Câu sửa, câu đọc lại (So that's…), câu xác nhận (That's right)" },
        { label: "5. Ghi nhanh", sub: "Số: ghi số; tên: ghi từng chữ cái khi nghe đánh vần" },
        { label: "6. Soát cuối bài", sub: "Chính tả · số ít/nhiều · không lặp chữ đã in sẵn · đúng giới hạn từ" },
      ],
    },

    { t: "h", text: "2. Sáu bẫy của Section 1 nâng cao" },
    {
      t: "table",
      head: ["Bẫy", "Nghe thấy", "Đáp án / cách xử lý"],
      rows: [
        ["**1. Sửa thông tin**", "“It's the 13th… oh, sorry — it's the 30th.” · “Mornings would be perfect… oh, wait, I've got a job, so evenings.”", "Viết thông tin **sau cùng** được chốt: **30th**, **evening**. Dấu hiệu: sorry, actually, no wait, I mean, I've just remembered."],
        ["**2. Số điện thoại**", "“oh seven nine one two, **double** four six, oh five eight”", "oh = **0**; double four = **44**; triple one = **111**. Viết liền: 07912446058."],
        ["**3. Đánh vần**", "“D, U, O, N, G” · “H, O, **double L**, O, W, A, Y”", "Ghi từng chữ cái ngay khi nghe. double L = **LL**."],
        ["**4. Ngày tháng**", "“the thirtieth of May” / “May the thirtieth”", "Viết theo phiếu: **30** / **30th** May. Đúng cả 30 May, May 30, 30th May."],
        ["**5. Số 13 / 30**", "thir**TEEN** (nhấn sau, /tiːn/ dài) · **THIR**ty (nhấn đầu, /ti/ ngắn)", "Nghe **trọng âm** và độ dài âm cuối — xem bài phát âm mục 4."],
        ["**6. Tiền / giá sau giảm**", "“normally £360… with the 25% student discount, that's £270”", "Phiếu ghi “(with student discount)” → **270**, không phải 360."],
      ],
    },
    {
      t: "note",
      title: "Cẩn thận: những chỗ người Việt hay mất điểm ở Section 1",
      items: [
        "**Viết sai chính tả tên** dù nghe đúng: không ghi kịp khi người nói đánh vần nhanh. Luyện ghi **từng chữ cái** (mục 3).",
        "**Viết cả ký hiệu và đơn vị đã in sẵn**: phiếu ghi “£___ per term” mà viết **£270 per term** → thừa. Chỉ viết **270**.",
        "**Nhầm chữ cái**: **G** /dʒiː/ ↔ **J** /dʒeɪ/; **A** /eɪ/ ↔ **E** /iː/ ↔ **I** /aɪ/; **M** ↔ **N**; **B** ↔ **V** ↔ **P**. Người Việt hay lẫn **E** /iː/ với **I** /aɪ/ vì chữ “i” tiếng Việt đọc giống chữ **E** tiếng Anh.",
        "**Z** đọc “zed” /zed/ (Anh) hoặc “zee” /ziː/ (Mỹ) — Section 1 có cả hai giọng.",
        "**Đọc lại sai**: đôi khi người điền phiếu **đọc lại sai** và người kia **sửa**: “So that's 74?” — “No, 47.” Viết số được **sửa**, không phải số đọc lại.",
      ],
    },

    { t: "h", text: "3. Bảng chữ cái theo âm — luyện tai nghe đánh vần" },
    {
      t: "table",
      caption: "Chữ cái cùng một nguyên âm dễ nghe nhầm với nhau",
      head: ["Âm", "Chữ cái", "Cặp hay nhầm"],
      rows: [
        ["/eɪ/", "A · H · J · K", "**A ↔ E** · **J ↔ G**"],
        ["/iː/", "B · C · D · E · G · P · T · V · (Z Mỹ)", "**B ↔ V ↔ P** · **D ↔ T** · **C ↔ Z**"],
        ["/e/", "F · L · M · N · S · X · (Z Anh)", "**M ↔ N** · **F ↔ S**"],
        ["/aɪ/", "I · Y", "**I ↔ E** (người Việt hay viết I thành E)"],
        ["/əʊ/", "O", "O còn được dùng thay số 0 trong số điện thoại"],
        ["/uː/", "Q · U · W", "**W** = “double U” — đọc dài, đừng nhầm thành “double” + U = UU"],
        ["/ɑː/", "R", "R giọng Anh không cuốn lưỡi /ɑː/; giọng Mỹ /ɑːr/"],
      ],
    },
    {
      t: "dictation",
      id: "d15-nghe-danh-van",
      title: "Nghe đánh vần — tên, địa chỉ, mã bưu điện, số điện thoại (8 mục)",
      items: [
        { label: "Surname", spell: "G, I, double B, S", answer: "Gibbs" },
        { label: "Surname", spell: "J, A, R, V, I, S", answer: "Jarvis" },
        { label: "Surname", spell: "M, A, C, K, E, N, Z, I, E", answer: "Mackenzie" },
        { label: "Street name", spell: "B, E, A, U, M, O, N, T", answer: "Beaumont" },
        { label: "Postcode (viết có một dấu cách ở giữa, kiểu XX0 0XX)", spell: "B, S, 6, 7, R, E", answer: "BS6 7RE" },
        { label: "Phone number (viết liền)", spell: "0, 1, 6, 3, 2, double 5, 8, 9, 0, 4", answer: "01632558904" },
        { label: "Booking reference", spell: "F, X, 4, 9, 7, Q", answer: "FX497Q" },
        { label: "Email", spell: "K, dot, W, I, L, S, O, N, at, mail, dot, com", answer: "k.wilson@mail.com" },
      ],
    },

    { t: "h", text: "4. Số: 13 hay 30? và cách đọc số điện thoại, ngày tháng" },
    {
      t: "table",
      head: ["Loại số", "Cách nói", "Cách viết"],
      rows: [
        ["-teen / -ty", "thir**TEEN** /θɜːˈtiːn/ — nhấn âm sau, “tiin” dài · **THIR**ty /ˈθɜːti/ — nhấn âm đầu, “ti” ngắn", "13 · 30 · 14 · 40 · 15 · 50 …"],
        ["Số điện thoại", "đọc **từng chữ số**; 0 = “oh” (Anh) / “zero” (Mỹ); hai số giống nhau = **double**, ba số = **triple**", "oh two oh, seven nine four six, three triple one → 02079463111"],
        ["Ngày", "**the thirtieth of May** (Anh) / **May thirtieth** (Mỹ) — đọc số thứ tự", "30 May · 30th May · May 30"],
        ["Năm", "two thousand and four (2004) · twenty twenty-five (2025) · nineteen ninety-eight (1998)", "2004 · 2025 · 1998"],
        ["Tiền", "two hundred and seventy pounds · three pounds fifty", "£270 · £3.50"],
        ["Giờ", "half past six · quarter to nine · six thirty", "6.30 / 6:30 · 8.45"],
      ],
    },
    {
      t: "phatam",
      id: "d15-phat-am",
      title: "Luyện phát âm — số dễ nhầm và câu Section 1",
      note: "Bấm “Nghe mẫu”, rồi “Đọc & chấm”. -teen: nhấn âm SAU, kéo dài /iː/. -ty: nhấn âm ĐẦU, âm cuối ngắn /i/. Đọc đánh vần rõ từng chữ cái, ngắt nhẹ giữa các chữ.",
      items: [
        { text: "thirteen, thirty", ipa: "θɜːtiːn θɜːti", vi: "thir-TEEN · THIR-ty" },
        { text: "fourteen, forty", ipa: "fɔːtiːn fɔːti", vi: "four-TEEN · FOR-ty" },
        { text: "fifteen, fifty", ipa: "fɪftiːn fɪfti", vi: "fif-TEEN · FIF-ty" },
        { text: "sixteen, sixty", ipa: "sɪkstiːn sɪksti", vi: "six-TEEN · SIX-ty" },
        { text: "eighteen, eighty", ipa: "eɪtiːn eɪti", vi: "eigh-TEEN · EIGH-ty" },
        { text: "The bus leaves at four fifteen.", ipa: "ðə bʌs liːvz ət fɔː fɪftiːn", vi: "fifteen nhấn âm sau" },
        { text: "It costs thirty pounds.", ipa: "ɪt kɒsts θɜːti paʊndz", vi: "thirty nhấn âm đầu" },
        { text: "My number is double two, oh, nine.", ipa: "maɪ nʌmbə ɪz dʌbl tuː əʊ naɪn", vi: "double · oh" },
        { text: "My surname is spelt G, I, double B, S.", ipa: "maɪ sɜːneɪm ɪz spelt dʒiː aɪ dʌbl biː es", vi: "G /dʒiː/ · I /aɪ/" },
      ],
    },

    { t: "h", text: "5. Practice 1 — Questions 1–10 (Enrolment form)" },
    {
      t: "canh",
      anh: ["telephone-receiver", "woman-office-worker", "man-student", "notebook"],
      caption: "Minh, một sinh viên Việt Nam đang ở London, gọi điện đến trung tâm ngoại ngữ Greenfield để đăng ký khoá tiếng Anh tổng quát. Cô lễ tân điền phiếu đăng ký trong lúc nói chuyện.",
    },
    {
      t: "table",
      caption: "Greenfield Language Centre — Enrolment Form · Complete the form. Write ONE WORD AND/OR A NUMBER for each answer.",
      head: ["Mục", "Thông tin"],
      rows: [
        ["Course", "General English"],
        ["Name", "Minh **(1) ______**"],
        ["Date of birth", "**(2) ______** May 2004"],
        ["Mobile", "**(3) ______**"],
        ["Address", "27 **(4) ______** Street, London"],
        ["Postcode", "**(5) ______**"],
        ["Level", "**(6) ______**"],
        ["Classes", "**(7) ______** classes, Monday to Thursday"],
        ["Fee", "£ **(8) ______** (with student discount)"],
        ["Heard about the school from", "a **(9) ______**"],
        ["Bring on first day", "a **(10) ______**"],
      ],
    },
    {
      t: "listen",
      id: "d15-nghe-bai-1",
      title: "Greenfield Language Centre — enrolment",
      dan: { so: "Day 15, Practice 1", boiCanh: "a telephone conversation between a receptionist at a language school and a student who wants to join a course.", cau: [1, 10] },
      note: "Giọng Anh-Anh (lễ tân) và Anh-Mỹ (sinh viên), khoảng 3 phút. Chỉ nghe một lần như thi thật.",
      lines: [
        { who: "Receptionist", voice: "uk-nu", text: "Good afternoon, Greenfield Language Centre. How can I help you?", vi: "Chào buổi chiều, Trung tâm Ngoại ngữ Greenfield xin nghe. Tôi giúp gì được cho bạn?" },
        { who: "Minh", voice: "us-nam", text: "Hi. I'd like to sign up for one of your English courses, please. The General English course.", vi: "Chào chị. Tôi muốn đăng ký một khoá tiếng Anh. Khoá tiếng Anh tổng quát ạ." },
        { who: "Receptionist", voice: "uk-nu", text: "Of course. I'll fill in an enrolment form for you now. Can I have your first name?", vi: "Được chứ. Tôi sẽ điền phiếu đăng ký cho bạn ngay. Cho tôi xin tên của bạn?" },
        { who: "Minh", voice: "us-nam", text: "It's Minh. M, I, N, H.", vi: "Là Minh. M, I, N, H." },
        { who: "Receptionist", voice: "uk-nu", text: "Thank you. And your surname?", vi: "Cảm ơn. Còn họ của bạn?" },
        { who: "Minh", voice: "us-nam", text: "Duong. That's D, U, O, N, G.", vi: "Dương. Là D, U, O, N, G." },
        { who: "Receptionist", voice: "uk-nu", text: "D, U, O, N, G. Lovely. And what's your date of birth?", vi: "D, U, O, N, G. Tốt quá. Ngày sinh của bạn là gì?" },
        { who: "Minh", voice: "us-nam", text: "It's the 13th of May, 2004. Oh, sorry, not the 13th. I always say that wrong. It's the 30th. The 30th of May, 2004.", vi: "Là ngày 13 tháng Năm, 2004. Ôi, xin lỗi, không phải 13. Tôi toàn nói nhầm. Là ngày 30. Ngày 30 tháng Năm, 2004." },
        { who: "Receptionist", voice: "uk-nu", text: "No problem. The 30th of May. And a mobile number?", vi: "Không sao. Ngày 30 tháng Năm. Còn số di động?" },
        { who: "Minh", voice: "us-nam", text: "Sure. It's oh seven nine one two, double four six, oh five eight.", vi: "Vâng. Là không bảy chín một hai, hai số bốn, sáu, không năm tám." },
        { who: "Receptionist", voice: "uk-nu", text: "Let me read that back. 0 7 9 1 2, 4 4 6, 0 5 8.", vi: "Để tôi đọc lại. 0 7 9 1 2, 4 4 6, 0 5 8." },
        { who: "Minh", voice: "us-nam", text: "That's right.", vi: "Đúng rồi ạ." },
        { who: "Receptionist", voice: "uk-nu", text: "And your address here in London?", vi: "Còn địa chỉ của bạn ở London?" },
        { who: "Minh", voice: "us-nam", text: "I'm staying at 27 Holloway Street. Holloway is H, O, double L, O, W, A, Y.", vi: "Tôi đang ở số 27 phố Holloway. Holloway là H, O, hai chữ L, O, W, A, Y." },
        { who: "Receptionist", voice: "uk-nu", text: "And the postcode?", vi: "Còn mã bưu điện?" },
        { who: "Minh", voice: "us-nam", text: "N, W, 5, 2, Q, T.", vi: "N, W, 5, 2, Q, T." },
        { who: "Receptionist", voice: "uk-nu", text: "NW5 2QT. Thank you. Now, do you know what level you are?", vi: "NW5 2QT. Cảm ơn. Giờ, bạn có biết trình độ của mình không?" },
        { who: "Minh", voice: "us-nam", text: "Well, I did a short test on your website, and it said elementary. But I studied English for six years at school, so I think that's a bit low.", vi: "À, tôi có làm một bài kiểm tra ngắn trên trang web của trung tâm, và kết quả là sơ cấp. Nhưng tôi đã học tiếng Anh sáu năm ở trường nên tôi nghĩ vậy hơi thấp." },
        { who: "Receptionist", voice: "uk-nu", text: "That's quite common. Actually, I can see a note here from your speaking interview on Monday. The teacher has put you in the intermediate group.", vi: "Chuyện đó khá thường gặp. Thực ra, tôi thấy ở đây có ghi chú từ buổi phỏng vấn nói hôm thứ Hai của bạn. Giáo viên đã xếp bạn vào nhóm trung cấp." },
        { who: "Minh", voice: "us-nam", text: "Oh, great. Intermediate it is.", vi: "Ồ, tuyệt. Vậy là trung cấp." },
        { who: "Receptionist", voice: "uk-nu", text: "We have morning classes from nine to twelve, or evening classes from six to nine, Monday to Thursday.", vi: "Chúng tôi có lớp buổi sáng từ chín đến mười hai giờ, hoặc lớp buổi tối từ sáu đến chín giờ, từ thứ Hai đến thứ Năm." },
        { who: "Minh", voice: "us-nam", text: "Mornings would be perfect. Oh, wait. I've just started a part-time job at a café, and my shifts are in the morning. So it'll have to be the evening classes.", vi: "Buổi sáng thì tuyệt. Ồ, khoan đã. Tôi vừa bắt đầu làm thêm ở một quán cà phê, và ca của tôi vào buổi sáng. Vậy phải là lớp buổi tối." },
        { who: "Receptionist", voice: "uk-nu", text: "Evening, then. Now, the course fee is three hundred and sixty pounds for ten weeks. But you mentioned you're a student?", vi: "Vậy là buổi tối. Học phí là ba trăm sáu mươi bảng cho mười tuần. Nhưng bạn có nói bạn là sinh viên phải không?" },
        { who: "Minh", voice: "us-nam", text: "Yes, I'm doing a foundation course at the university.", vi: "Vâng, tôi đang học khoá dự bị ở trường đại học." },
        { who: "Receptionist", voice: "uk-nu", text: "In that case, you get a student discount of twenty-five per cent, so that's £270 in total.", vi: "Vậy thì bạn được giảm giá sinh viên hai mươi lăm phần trăm, tổng cộng là 270 bảng." },
        { who: "Minh", voice: "us-nam", text: "That's very reasonable.", vi: "Giá đó rất hợp lý." },
        { who: "Receptionist", voice: "uk-nu", text: "Can I ask how you heard about us? Was it our website?", vi: "Cho tôi hỏi bạn biết đến chúng tôi qua đâu? Qua trang web à?" },
        { who: "Minh", voice: "us-nam", text: "Not exactly. My cousin studied here last year. Well, actually, she didn't tell me herself. She just sent me a photo of your leaflet.", vi: "Không hẳn. Chị họ tôi học ở đây năm ngoái. À, thật ra chị ấy không tự kể với tôi. Chị ấy chỉ gửi tôi ảnh tờ rơi của trung tâm." },
        { who: "Receptionist", voice: "uk-nu", text: "Ah, the leaflet. Good to know it works! And finally, on your first day, please arrive ten minutes early. You don't need a dictionary, because we have plenty in the classroom, but do bring a notebook. The teachers like students to keep a vocabulary record.", vi: "À, tờ rơi. Mừng là nó có tác dụng! Cuối cùng, ngày đầu tiên bạn vui lòng đến sớm mười phút. Bạn không cần mang từ điển vì trong lớp có nhiều, nhưng nhớ mang một cuốn vở. Giáo viên muốn học viên ghi sổ từ vựng." },
        { who: "Minh", voice: "us-nam", text: "A notebook. No problem. Thanks very much.", vi: "Một cuốn vở. Không vấn đề gì. Cảm ơn chị nhiều." },
      ],
    },
    {
      t: "quiz",
      id: "d15-nghe-p1",
      title: "Questions 1–10 — ONE WORD AND/OR A NUMBER",
      kind: "fill",
      items: [
        { q: "(1) Name: Minh ___", answers: ["Duong"], hint: "họ — nghe đánh vần" },
        { q: "(2) Date of birth: ___ May 2004", answers: ["30th", "30"], hint: "ngày — cẩn thận câu sửa" },
        { q: "(3) Mobile: ___ (viết liền)", answers: ["07912446058", "07912 446 058", "07912 446058"], hint: "oh = 0, double four = 44" },
        { q: "(4) Address: 27 ___ Street, London", answers: ["Holloway"], hint: "tên đường — nghe đánh vần" },
        { q: "(5) Postcode: ___", answers: ["NW5 2QT", "NW52QT"], hint: "chữ + số" },
        { q: "(6) Level: ___", answers: ["intermediate"], hint: "trình độ — giáo viên xếp" },
        { q: "(7) ___ classes, Monday to Thursday", answers: ["evening"], hint: "buổi — cẩn thận câu sửa" },
        { q: "(8) Fee: £ ___ (with student discount)", answers: ["270"], hint: "số tiền SAU giảm giá" },
        { q: "(9) Heard about the school from a ___", answers: ["leaflet"], hint: "danh từ số ít" },
        { q: "(10) Bring on first day: a ___", answers: ["notebook"], hint: "danh từ số ít" },
      ],
    },
    {
      t: "note",
      title: "Giải thích đáp án 1–5",
      items: [
        "**(1) Duong** — “Duong. That's **D, U, O, N, G**.” Lễ tân đọc lại một lần nữa — cơ hội soát chính tả.",
        "**(2) 30 / 30th** — Bẫy **sửa thông tin** + **13/30**: “It's the 13th of May… Oh, sorry, **not the 13th**… It's the **30th**.” Lễ tân xác nhận: “The 30th of May.” Không viết “May” (đã in sẵn).",
        "**(3) 07912446058** — “oh seven nine one two, **double four** six, oh five eight” → 0-7-9-1-2-**4-4**-6-0-5-8. Đếm lại: số di động Anh có **11 chữ số**.",
        "**(4) Holloway** — “H, O, **double L**, O, W, A, Y.” Lỗi hay gặp: ~~Holoway~~ (quên một L), ~~Hollowey~~ (nhầm A/E).",
        "**(5) NW5 2QT** — đánh vần N, W, 5, 2, Q, T; lễ tân đọc lại “NW5 2QT”. Mã bưu điện Anh luôn có **một khoảng trắng** ở giữa (cả hai cách viết đều được chấm đúng trong bài này).",
      ],
    },
    {
      t: "note",
      title: "Giải thích đáp án 6–10",
      items: [
        "**(6) intermediate** — Bẫy: “it said **elementary**” (bài test trên mạng). Thông tin chốt đến sau **Actually**: “The teacher has put you in the **intermediate** group.”",
        "**(7) evening** — Bẫy **đổi ý**: “Mornings would be perfect. **Oh, wait**… my shifts are in the morning. So it'll have to be the **evening** classes.”",
        "**(8) 270** — Bẫy **giá sau giảm**: £360 là giá gốc; phiếu ghi “(with student discount)” → “so that's **£270** in total.” Kiểm tra: 360 × 75% = 270 ✓.",
        "**(9) leaflet** — Bẫy chuỗi: “Was it our **website**?” — “Not exactly. My **cousin**… Well, actually… she sent me a photo of your **leaflet**.” Phiếu ghi “from **a** ___” → danh từ số ít đếm được: leaflet (cousin cũng vừa “a ___” nhưng người nói đã tự sửa: cô ấy không tự kể).",
        "**(10) notebook** — Bẫy **không cần**: “You **don't need** a dictionary… but **do bring** a notebook.” (Nhớ bài modal Ngày 13: don't need = không cần.)",
      ],
    },

    { t: "h", text: "6. Practice 2 — Questions 1–8 (Lost property report)" },
    {
      t: "canh",
      anh: ["bus", "backpack", "laptop", "telephone-receiver"],
      caption: "Sarah để quên ba lô trên xe buýt và gọi đến văn phòng đồ thất lạc của công ty xe buýt thành phố. Nhân viên điền phiếu báo mất đồ.",
    },
    {
      t: "table",
      caption: "City Bus Company — Lost Property Report · Write ONE WORD AND/OR A NUMBER for each answer.",
      head: ["Mục", "Thông tin"],
      rows: [
        ["Item", "a **(1) ______**"],
        ["Colour", "**(2) ______**"],
        ["Bus route", "number **(3) ______**"],
        ["Day lost", "**(4) ______** afternoon"],
        ["Contents", "laptop, **(5) ______**, water bottle"],
        ["Name", "Sarah **(6) ______**"],
        ["Phone", "**(7) ______**"],
        ["Collection fee", "£ **(8) ______**"],
      ],
    },
    {
      t: "listen",
      id: "d15-nghe-bai-2",
      title: "City Bus Company — lost property",
      dan: { so: "Day 15, Practice 2", boiCanh: "a telephone conversation between a woman who has lost a bag and an officer at a bus company.", cau: [1, 8] },
      note: "Giọng Anh-Anh (nhân viên) và Anh-Mỹ (người gọi), khoảng 2 phút 30 giây.",
      lines: [
        { who: "Officer", voice: "uk-nam", text: "City Bus Lost Property, Daniel speaking.", vi: "Phòng đồ thất lạc Xe buýt Thành phố, Daniel xin nghe." },
        { who: "Sarah", voice: "us-nu", text: "Hi. I think I left my bag on one of your buses yesterday afternoon.", vi: "Chào anh. Tôi nghĩ tôi đã để quên túi trên một chuyến xe buýt của các anh chiều hôm qua." },
        { who: "Officer", voice: "uk-nam", text: "Right, let's see if we can find it. What kind of bag was it?", vi: "Được, để xem chúng tôi có tìm được không. Đó là loại túi gì?" },
        { who: "Sarah", voice: "us-nu", text: "It's a backpack. A medium-sized one.", vi: "Là một chiếc ba lô. Cỡ vừa." },
        { who: "Officer", voice: "uk-nam", text: "And what colour is it?", vi: "Màu gì vậy?" },
        { who: "Sarah", voice: "us-nu", text: "Grey. Well, actually, it's more silver than grey. It's quite shiny.", vi: "Màu xám. À, thật ra nó giống màu bạc hơn là xám. Nó khá bóng." },
        { who: "Officer", voice: "uk-nam", text: "Silver. OK. Which bus were you on?", vi: "Màu bạc. Được. Chị đi tuyến xe nào?" },
        { who: "Sarah", voice: "us-nu", text: "The number 74. No, sorry, the 47. I always mix them up. The 47 from the university to the city centre.", vi: "Số 74. Không, xin lỗi, số 47. Tôi hay lẫn hai số này. Tuyến 47 từ trường đại học vào trung tâm thành phố." },
        { who: "Officer", voice: "uk-nam", text: "And you said yesterday. So that was Tuesday?", vi: "Chị nói là hôm qua. Vậy là thứ Ba?" },
        { who: "Sarah", voice: "us-nu", text: "No, it was Wednesday. Today's Thursday.", vi: "Không, là thứ Tư. Hôm nay là thứ Năm." },
        { who: "Officer", voice: "uk-nam", text: "Oh yes, of course. Wednesday. Can you tell me what was inside?", vi: "À phải rồi. Thứ Tư. Chị cho biết bên trong có gì?" },
        { who: "Sarah", voice: "us-nu", text: "My laptop, an umbrella, and a water bottle. Oh, and some lecture notes, but they're not important.", vi: "Máy tính xách tay, một cái ô và một chai nước. À, và vài tờ ghi chép bài giảng, nhưng không quan trọng." },
        { who: "Officer", voice: "uk-nam", text: "Laptop, umbrella, water bottle. Let me take your name.", vi: "Máy tính, ô, chai nước. Cho tôi xin tên chị." },
        { who: "Sarah", voice: "us-nu", text: "Sarah Pembroke. That's P, E, M, B, R, O, K, E.", vi: "Sarah Pembroke. Là P, E, M, B, R, O, K, E." },
        { who: "Officer", voice: "uk-nam", text: "And a contact number, please?", vi: "Và số điện thoại liên lạc?" },
        { who: "Sarah", voice: "us-nu", text: "It's oh two oh, seven nine four six, three triple one.", vi: "Là không hai không, bảy chín bốn sáu, ba, ba số một." },
        { who: "Officer", voice: "uk-nam", text: "So, 0 2 0, 7 9 4 6, 3 1 1 1.", vi: "Vậy là 0 2 0, 7 9 4 6, 3 1 1 1." },
        { who: "Sarah", voice: "us-nu", text: "Yes, that's it.", vi: "Vâng, đúng rồi." },
        { who: "Officer", voice: "uk-nam", text: "Well, there's good news. A silver backpack was handed in last night from route 47. If it's yours, you can collect it from our office at the central bus station. There's a small handling fee, I'm afraid.", vi: "Có tin tốt đây. Tối qua có người nộp lại một chiếc ba lô màu bạc từ tuyến 47. Nếu là của chị, chị có thể đến nhận ở văn phòng chúng tôi tại bến xe trung tâm. Tiếc là có một khoản phí xử lý nhỏ." },
        { who: "Sarah", voice: "us-nu", text: "How much is that?", vi: "Bao nhiêu vậy anh?" },
        { who: "Officer", voice: "uk-nam", text: "It used to be five pounds, but it's £3.50 now. Please bring some photo ID with you.", vi: "Trước đây là năm bảng, nhưng giờ là 3,50 bảng. Chị nhớ mang theo giấy tờ có ảnh." },
        { who: "Sarah", voice: "us-nu", text: "Great. Thank you so much.", vi: "Tuyệt quá. Cảm ơn anh rất nhiều." },
      ],
    },
    {
      t: "quiz",
      id: "d15-nghe-p2",
      title: "Questions 1–8 — ONE WORD AND/OR A NUMBER",
      kind: "fill",
      items: [
        { q: "(1) Item: a ___", answers: ["backpack"], hint: "loại túi" },
        { q: "(2) Colour: ___", answers: ["silver"], hint: "cẩn thận câu sửa" },
        { q: "(3) Bus route: number ___", answers: ["47"], hint: "cẩn thận câu sửa" },
        { q: "(4) Day lost: ___ afternoon", answers: ["Wednesday"], hint: "ngày trong tuần" },
        { q: "(5) Contents: laptop, ___, water bottle", answers: ["umbrella"], hint: "món đồ thứ hai" },
        { q: "(6) Name: Sarah ___", answers: ["Pembroke"], hint: "nghe đánh vần" },
        { q: "(7) Phone: ___ (viết liền)", answers: ["02079463111", "020 7946 3111"], hint: "triple one = 111" },
        { q: "(8) Collection fee: £ ___", answers: ["3.50", "3.5"], hint: "giá hiện tại" },
      ],
    },
    {
      t: "note",
      title: "Giải thích Practice 2",
      items: [
        "**(1) backpack** — “It's a **backpack**.” Phiếu có “a ___” → một danh từ.",
        "**(2) silver** — Bẫy sửa: “**Grey**. Well, **actually**, it's more **silver** than grey.” Nhân viên xác nhận: “Silver.”",
        "**(3) 47** — Bẫy sửa + số đảo: “The number **74**. **No, sorry**, the **47**.”",
        "**(4) Wednesday** — Bẫy đọc lại sai: nhân viên hỏi “So that was **Tuesday**?” — người gọi sửa: “No, it was **Wednesday**.” Viết thông tin **được sửa**.",
        "**(5) umbrella** — “My laptop, an **umbrella**, and a water bottle.” Lecture notes là thông tin thừa (not important).",
        "**(6) Pembroke** — “**P, E, M, B, R, O, K, E**.” Dễ sai: ~~Pembrok~~ (thiếu E cuối) hoặc ~~Penbroke~~ (M/N).",
        "**(7) 02079463111** — “oh two oh, seven nine four six, three **triple one**” → 020 7946 **3111**. Số máy bàn London có 11 chữ số, bắt đầu 020.",
        "**(8) 3.50** — Bẫy giá cũ/mới: “It **used to be** five pounds, but it's **£3.50 now**.” **used to** = trước đây (không còn đúng).",
      ],
    },
    {
      t: "note",
      title: "Mẹo cuối bài: danh sách soát 30 giây sau Section 1",
      items: [
        "**Chính tả** tên riêng khớp đúng từng chữ cái đã nghe? Chữ đôi (LL, BB) có đủ không?",
        "**Số**: đếm số chữ số của số điện thoại; ngày có khớp với tháng in sẵn không; tiền là giá **sau cùng**?",
        "**Không lặp** chữ in sẵn: £, May, Street, afternoon, number…",
        "**Giới hạn**: mọi đáp án là **một từ và/hoặc một số**? Không có đáp án nào hai từ?",
        "Gặp câu **chưa nghe được**: đoán một đáp án hợp loại từ — để trống chắc chắn mất điểm.",
      ],
    },
  ],
};

/* ─────────────────────────── Bài tập ─────────────────────────── */

const D15_HOMEWORK: Lesson = {
  id: "d15-bai-tap",
  kind: "homework",
  title: "Bài tập Ngày 15",
  goal: "Ôn trọn Ngày 15: dịch câu bị động và câu bản đồ/quy trình, chia và viết lại câu bị động, điền giới từ vị trí, trắc nghiệm tổng hợp và viết một bài Task 1 quy trình hoàn chỉnh.",
  minutes: 50,
  blocks: [
    {
      t: "recap",
      title: "Bài tập hôm nay (36 câu + 1 bài Task 1)",
      items: [
        "**I. Dịch Việt → Anh** (10 câu, có 💡): bị động các thì + câu bản đồ / quy trình.",
        "**II. Chia bị động** (6 câu) và **III. Viết lại câu chủ động → bị động** (5 câu).",
        "**IV. Giới từ vị trí** (5 câu). **V. Trắc nghiệm tổng hợp** (10 câu).",
        "**VI. Writing Task 1**: mô tả quy trình làm nước mắm (≥ 150 từ) — dùng câu bị động + từ nối trình tự.",
      ],
    },
    {
      t: "sodo",
      kind: "compare",
      title: "Bị động trong hai dạng Task 1 — đừng dùng lẫn thì",
      caption: "Bài Task 1 cuối bài tập là QUY TRÌNH → cột phải. Nếu gặp đề bản đồ hai năm → cột trái.",
      cols: [
        {
          title: "**Bản đồ trước – sau** (map)",
          anh: "world-map",
          items: [
            "Thay đổi đến nay: **has / have been + V3**",
            "Năm cũ: **was / were + V3** · **used to**",
            "Động từ: replaced by · converted into · demolished · extended",
            "Không đổi: **has remained unchanged** (không bị động)",
          ],
        },
        {
          title: "**Quy trình** (process)",
          anh: "gear",
          items: [
            "Mọi bước: **is / are + V3** (hiện tại đơn)",
            "Từ nối: First · Next · After that · Once… · Finally",
            "Động từ: collected · sorted · heated · poured · packaged",
            "Bước tự xảy ra để chủ động: ferments · melts · turns brown",
          ],
        },
      ],
    },
    { t: "h", text: "I. Dịch sang tiếng Anh (10 câu)" },
    {
      t: "quiz",
      id: "d15-bt-dich",
      title: "I. Dịch sang tiếng Anh — bị động, bản đồ, quy trình (10 câu)",
      kind: "translate",
      grammar: "is / are + V3 · was / were + V3 · is / are being + V3 · will be + V3 · can / should / must be + V3 · has / have been + V3. Bản đồ: replaced by / converted into / demolished / remained unchanged.",
      items: [
        { q: "Gạo được xuất khẩu sang nhiều nước.", hint: "Rice, is exported, to many countries", answers: ["Rice is exported to many countries.", "Rice is exported to a lot of countries.", "Rice is exported to many other countries."] },
        { q: "Cây cầu này được xây năm 1902.", hint: "This bridge, was built, in 1902", answers: ["This bridge was built in 1902.", "This bridge was constructed in 1902.", "The bridge was built in 1902."] },
        { q: "Một con đường mới đang được xây gần nhà tôi.", hint: "A new road, is being built, near my house", answers: ["A new road is being built near my house.", "A new road is being constructed near my house.", "A new road is being built near my home."] },
        { q: "Kết quả sẽ được công bố vào thứ Sáu.", hint: "The results, will be announced, on Friday", answers: ["The results will be announced on Friday.", "The result will be announced on Friday.", "The results will be published on Friday.", "The results will be released on Friday."] },
        { q: "Rác nên được phân loại trước khi vứt.", hint: "Rubbish / Waste, should be sorted, before it is thrown away", answers: ["Rubbish should be sorted before it is thrown away.", "Waste should be sorted before it is thrown away.", "Rubbish should be sorted before being thrown away.", "Waste should be sorted before being thrown away.", "Rubbish should be sorted before it's thrown away.", "Garbage should be sorted before it is thrown away.", "Trash should be sorted before it is thrown away.", "Rubbish should be separated before it is thrown away."] },
        { q: "Tôi sinh ra ở Đà Nẵng.", hint: "I, was born, in Da Nang", answers: ["I was born in Da Nang.", "I was born in Danang."] },
        { q: "Ngân hàng cũ đã được chuyển thành một quán cà phê.", hint: "The old bank, has been converted into / turned into, a café", answers: ["The old bank has been converted into a café.", "The old bank has been converted into a cafe.", "The old bank has been turned into a café.", "The old bank has been turned into a cafe.", "The old bank was converted into a café.", "The old bank was converted into a cafe."] },
        { q: "Bãi đỗ xe nằm phía sau bệnh viện.", hint: "The car park, is, behind the hospital", answers: ["The car park is behind the hospital.", "The car park is located behind the hospital.", "The parking lot is behind the hospital.", "The car park lies behind the hospital."] },
        { q: "Đầu tiên, trái cây được rửa sạch và cắt thành miếng nhỏ.", hint: "First, the fruit, is washed, and cut into small pieces", answers: ["First, the fruit is washed and cut into small pieces.", "First the fruit is washed and cut into small pieces.", "Firstly, the fruit is washed and cut into small pieces.", "First, the fruit is cleaned and cut into small pieces.", "First, fruit is washed and cut into small pieces."] },
        { q: "Cuối cùng, nước ép được đóng chai và giao đến các cửa hàng.", hint: "Finally, the juice, is bottled, and delivered to shops", answers: ["Finally, the juice is bottled and delivered to shops.", "Finally the juice is bottled and delivered to shops.", "Finally, the juice is bottled and delivered to stores.", "Lastly, the juice is bottled and delivered to shops.", "Finally, the juice is bottled and sent to shops."] },
      ],
    },
    { t: "h", text: "II. Chia động từ ở dạng bị động (6 câu)" },
    {
      t: "quiz",
      id: "d15-bt-chia",
      title: "II. Chia động từ trong ngoặc — bị động đúng thì (6 câu)",
      kind: "fill",
      items: [
        { q: "(1) Vietnamese ___ (speak) by about 100 million people. (hiện tại đơn)", answers: ["is spoken"], hint: "is + V3" },
        { q: "(2) The Reunification Palace ___ (design) by architect Ngo Viet Thu. (quá khứ)", answers: ["was designed"], hint: "was + V3" },
        { q: "(3) Your car ___ (wash) at the moment. Please wait. (đang)", answers: ["is being washed"], hint: "is being + V3" },
        { q: "(4) The new stadium ___ (open) next year. (tương lai)", answers: ["will be opened"], hint: "will be + V3" },
        { q: "(5) This medicine ___ (must / keep) in a cool place.", answers: ["must be kept"], hint: "must be + V3" },
        { q: "(6) Two new schools ___ (build) in our district since 2020.", answers: ["have been built"], hint: "have been + V3" },
      ],
    },
    { t: "h", text: "III. Viết lại câu ở dạng bị động (5 câu)" },
    {
      t: "p",
      text: "Viết lại **cả câu** ở dạng bị động. Bỏ người làm nếu không cần thiết (they, people, someone).",
    },
    {
      t: "quiz",
      id: "d15-bt-viet-lai",
      title: "III. Chủ động → bị động — viết cả câu (5 câu)",
      kind: "fill",
      items: [
        { q: "(1) People grow tea in Thai Nguyen.", answers: ["Tea is grown in Thai Nguyen."], hint: "bỏ people" },
        { q: "(2) Someone stole my phone yesterday.", answers: ["My phone was stolen yesterday."], hint: "bỏ someone" },
        { q: "(3) They are repairing the bridge.", answers: ["The bridge is being repaired."], hint: "đang → being" },
        { q: "(4) The company will build a new factory.", answers: ["A new factory will be built.", "A new factory will be built by the company."], hint: "will be + V3" },
        { q: "(5) You should recycle plastic bottles.", answers: ["Plastic bottles should be recycled."], hint: "should be + V3" },
      ],
    },
    { t: "h", text: "IV. Giới từ vị trí (5 câu)" },
    {
      t: "quiz",
      id: "d15-bt-gioi-tu",
      title: "IV. Điền một từ chỉ vị trí (5 câu)",
      kind: "fill",
      items: [
        { q: "(1) The café is ___ the bank and the hotel. (ở giữa)", answers: ["between"], hint: "___ A and B" },
        { q: "(2) The post office is ___ the school, on the other side of the road. (đối diện)", answers: ["opposite"], hint: "không có to" },
        { q: "(3) Trees have been planted ___ the river. (dọc theo)", answers: ["along"], hint: "dọc theo" },
        { q: "(4) The lake is surrounded ___ forest.", answers: ["by"], hint: "surrounded ___" },
        { q: "(5) The pharmacy is ___ the corner of King Street and Hill Road.", answers: ["on", "at"], hint: "___ the corner of" },
      ],
    },
    { t: "h", text: "V. Trắc nghiệm tổng hợp (10 câu)" },
    {
      t: "mcq",
      id: "d15-bt-chon",
      title: "V. Chọn đáp án đúng (10 câu)",
      items: [
        { q: "The museum ___ by a team of volunteers every Monday.", options: ["cleans", "is cleaning", "is cleaned"], correct: 2, why: "Bảo tàng **được** dọn (by a team of volunteers), việc lặp lại mỗi thứ Hai → bị động hiện tại đơn **is cleaned**. cleans / is cleaning là chủ động — bảo tàng không tự dọn." },
        { q: "These shoes ___ in Italy.", options: ["were made", "made", "were make"], correct: 0, why: "be + **V3**: were **made**. ~~made~~ thiếu be; ~~were make~~ sai dạng V." },
        { q: "The accident ___ at 8 p.m.", options: ["was happened", "is happened", "happened"], correct: 2, why: "**happen** không có bị động." },
        { q: "Mobile phones ___ switched off in the exam room.", options: ["must", "must be", "must being"], correct: 1, why: "Modal bị động: **must be + V3**." },
        { q: "Mô tả hai bản đồ “trước – sau”, thì nào phù hợp nhất cho thay đổi đến nay?", options: ["has been + V3", "is being + V3", "will be + V3"], correct: 0, why: "Thay đổi đã xảy ra, kết quả còn đến nay → **has / have been + V3**." },
        { q: "The airport is 15 km ___ the city.", options: ["in the south of", "south", "to the south of"], correct: 2, why: "Cách 15 km → **ngoài** thành phố → **to the south of**." },
        { q: "In a process diagram, which sentence is best?", options: ["The bottles are washed.", "Workers wash the bottles.", "The bottles wash."], correct: 0, why: "Quy trình nhân tạo → **bị động**, bỏ người làm hiển nhiên." },
        { q: "Section 1: “Is that 74?” — “No, 47.” Bạn viết:", options: ["74", "47", "74 / 47"], correct: 1, why: "Viết thông tin **được sửa** cuối cùng: **47**." },
        { q: "“double L” khi đánh vần nghĩa là:", options: ["L", "LL", "L-L-L"], correct: 1, why: "double = hai lần → **LL**." },
        { q: "Phiếu ghi “£___ per week”. Bạn nghe “It's £80 per week.” Bạn viết:", options: ["£80 per week", "£80", "80"], correct: 2, why: "Chỉ viết phần **còn thiếu**: **80**. Ký hiệu £ và per week đã in sẵn." },
      ],
    },
    { t: "h", text: "VI. Writing Task 1 — quy trình" },
    {
      t: "figure",
      fig: {
        kind: "process",
        title: "How fish sauce is made",
        note: "Số liệu tự đặt cho bài luyện.",
        steps: [
          { label: "Fresh anchovies caught", note: "at sea, by fishing boats" },
          { label: "Washed", note: "in sea water" },
          { label: "Mixed with salt", note: "3 parts fish : 1 part salt" },
          { label: "Placed in wooden barrels", note: "" },
          { label: "Left to ferment", note: "12–18 months" },
          { label: "Liquid drained", note: "from the bottom of the barrel" },
          { label: "Filtered", note: "" },
          { label: "Bottled and sold", note: "" },
        ],
      },
    },
    {
      t: "essay",
      id: "d15-bt-viet",
      task: "Task 1",
      prompt: "The diagram shows how fish sauce is made. Summarise the information by selecting and reporting the main features. Write at least 150 words.",
      minWords: 150,
      tips: [
        "Mở bài: paraphrase đề — **The diagram illustrates the process by which fish sauce is produced.**",
        "Tổng quan: **The process consists of eight stages, beginning with… and ending with…**",
        "Mỗi bước một câu **bị động hiện tại đơn** + từ nối khác nhau: First · Next · After that · Then · Once… · Finally.",
        "Đủ chi tiết trong hình: at sea · in sea water · 3 parts fish to 1 part salt · wooden barrels · 12–18 months · from the bottom of the barrel.",
        "Chia thân bài làm hai đoạn: (1) chuẩn bị cá — bước 1–4; (2) ủ, lấy nước và đóng chai — bước 5–8. Không viết ý kiến cá nhân.",
      ],
    },
  ],
};

/* ─────────────────────────── Kiểm tra chặng 3 (Ngày 13–15) + ôn tổng Tập 1 ─────────────────────────── */
/**
 * Bài kiểm tra chặng 3 — gom Ngày 13–15 thành 8 phần + một phần ôn trọng điểm Ngày 1–12, kết thúc
 * bằng hướng dẫn vào Đề 1 (thi cuối Tập 1 trong Phòng thi máy). Mọi câu hỏi, kịch bản nghe, bài
 * đọc, hình quy trình đều VIẾT MỚI. id bài tập bắt đầu bằng `d15-kt-` (đừng đổi — điểm lưu theo id).
 * Viết thẳng trong tệp ngày vì script mục lục chạy node strip-types, không nạp được import tương đối.
 */
const KIEM_TRA_3: Lesson = {
  id: "d15-kiem-tra",
  kind: "review",
  title: "Bài kiểm tra chặng 3 (Ngày 13–15) + ôn tổng Tập 1",
  goal: "Tự đo xem đã nắm chắc modal (kể cả be able to · ought to · had better), câu bị động (kể cả has / have been + V3), từ vựng học trực tuyến / bản đồ / quy trình, Listening Part 4 (Note · Summary · trắc nghiệm) & Form Completion, Summary Completion có hộp từ, bài luận Discussion, Part 2 kể trải nghiệm, Task 1 quy trình và bản đồ trước – sau chưa; ôn lại trọng điểm ngữ pháp lẫn kỹ năng Ngày 1–12 — rồi biết mình đã sẵn sàng thi Đề 1 (thi cuối Tập 1) hay chưa.",
  minutes: 155,
  blocks: [
    {
      t: "recap",
      title: "Bài kiểm tra này đo gì",
      items: [
        "**9 phần**, khoảng **155 phút** — chia **hai buổi**: buổi A = phần 1–5 (~70′), buổi B = phần 6–9 (~85′). Phần 1–8 là kiến thức **Ngày 13–15**; phần 9 ôn trọng điểm **Ngày 1–12** (ngữ pháp + chiến thuật kỹ năng).",
        "**Đạt** = từ **70 %** trở lên ở **từng phần**. Đầu mỗi phần ghi ngưỡng đạt và **Ngày cần ôn** nếu trượt.",
        "Mọi câu đều **mới** so với bài học — cùng kiến thức, khác ngữ liệu.",
        "Đạt cả 9 phần ⇒ bạn **sẵn sàng thi Đề 1** — bài thi cuối Tập 1 đủ Nghe · Đọc · Viết trong **Phòng thi máy tính** (hướng dẫn ở cuối bài). Trượt phần nào thì ôn đúng Ngày ghi ở phần đó **trước khi** vào Đề 1.",
        "Viết là phần nặng nhất (một bài Discussion trọn vẹn + một bài Task 1 quy trình + điền một bài mẫu bản đồ trước – sau) — làm ở buổi B khi còn tỉnh táo.",
      ],
    },
    {
      t: "p",
      text: "Đây là **bài kiểm tra chặng 3** — chặng cuối của Tập 1. Ba ngày vừa qua dạy hai mảng ngữ pháp \"nặng ký\" nhất của tập (**động từ khuyết thiếu** và **câu bị động**), hai dạng bài Listening khó nhất với người mới (**Part 4** bài giảng, **Form Completion** nhiều bẫy), dạng Reading **Summary Completion có hộp từ**, bài luận **Discussion**, **Part 2** kể chuyện và Task 1 **quy trình / bản đồ**. Sau bài này là **Đề 1** — vì vậy phần cuối ôn lại cả những gì bạn học từ Ngày 1.",
    },
    {
      t: "sodo",
      kind: "mindmap",
      title: "Chặng 3 (Ngày 13–15) — những gì sẽ bị kiểm",
      center: "Ngày 13–15",
      branches: [
        { label: "Ngữ pháp", items: ["N13 modal: can / could / must / have to / mustn't / don't have to / should / might", "N13 be able to · ought to · had better", "N15 bị động: am-is-are + V3 · was-were + V3 · being + V3 · modal + be + V3 · has / have been + V3"], anh: "memo" },
        { label: "Từ vựng", items: ["N13 học trực tuyến & truyền thống", "N15 phương hướng · giới từ vị trí · động từ biến đổi · động từ quy trình"], anh: "books" },
        { label: "Nghe", items: ["N13 Part 4 · bài giảng, Note Completion", "N13 Part 4 · Summary Completion + trắc nghiệm", "N15 Form Completion · sáu bẫy Section 1"], anh: "headphone" },
        { label: "Đọc", items: ["N14 Summary Completion có hộp từ · đoán loại từ · chia hộp"], anh: "notebook" },
        { label: "Viết", items: ["N14 Discussion: hai quan điểm + ý kiến", "N15 Task 1 quy trình · bị động + từ nối trình tự", "N15 Task 1 bản đồ trước – sau · has been + V3"], anh: "pencil" },
        { label: "Nói · Phát âm", items: ["N14 Part 2 cue card · quá khứ + từ nối thời gian", "can / can't · -ed · số & đánh vần · /ɪ/ – /iː/"], anh: "microphone" },
        { label: "Ôn tổng Tập 1", items: ["N1–12: thì · đại từ · danh từ · tính từ – trạng từ · collocation", "N2–10 kỹ năng: từ khoá · giới hạn số từ · overview · mở – thân – kết bài · Matching Features · trả lời Part 1"], anh: "graduation-cap" },
      ],
      caption: "Mỗi nhánh là một phần của bài kiểm tra. Nhánh \"Ôn tổng\" là phần 9 — trượt nhánh này thì ôn theo Ngày ghi trong lời giải từng câu.",
    },
    {
      t: "note",
      title: "Cách làm bài",
      items: [
        "**Gập sách, gập vở**: không mở lại bài học, không tra từ điển, không hỏi Gia sư AI trong lúc làm.",
        "Thời gian gợi ý — buổi A (70′): Ngữ pháp 15′ · Từ vựng 10′ · Dịch 8′ · Nghe 22′ · Đọc 15′. Buổi B (85′): Viết 55′ (Discussion 30′ + Task 1 quy trình 20′ + bản đồ 5′) · Nói 10′ · Phát âm 5′ · Ôn tổng 15′. Cộng **155′**.",
        "Phần **Nghe**: hai bài Part 4 **chỉ nghe một lần** như thi thật; Form Completion nghe tối đa 2 lần. Chưa mở lời thoại cho tới khi điền xong.",
        "Phần **Đọc**: 15 phút cho bài ~450 từ, 8 câu. Phần **Viết**: bấm giờ đúng như phòng thi (Task 2 — 40′ trong thi thật, ở đây 30′ vì đã quen đề; Task 1 — 20′).",
        "Phần **Nói** Part 2: bấm giờ **1 phút** ghi chú rồi nói **2 phút** liền mạch — không dừng giữa chừng để nghĩ.",
        "Làm xong một phần thì **ghi điểm ra giấy** rồi mới sang phần sau. Cuối bài đối chiếu với bảng dưới đây.",
      ],
    },
    {
      t: "table",
      caption: "Cách tính điểm — ĐẠT = từ 70 % trở lên ở TỪNG phần",
      head: ["Phần", "Số câu", "Đạt khi", "Chưa đạt thì ôn lại"],
      rows: [
        ["1. Ngữ pháp", "15 + 8", "≥ 17/23 câu đúng (cộng hai khối)", "Ngày 13 · Modal (mục 2–6) — Ngày 15 · Bị động (mục 2, 4a–4e, 5, 8)"],
        ["2. Từ vựng", "12 + 6", "≥ 9/12 và ≥ 5/6", "Ngày 13 · Từ vựng (mục 1–4, 6) — Ngày 15 · Từ vựng (mục 1–2, 4, 7)"],
        ["3. Dịch Việt → Anh", "6", "≥ 5 câu đúng", "Bài dịch 💡 trong Ngày 13 và Ngày 15; phần I của Bài tập Ngày 13, 14, 15"],
        ["4. Nghe", "6 + 6 + 7", "≥ 14/19 câu đúng (cộng ba bài)", "Ngày 13 · Part 4 (mục 2–4, Practice 1–2 ở mục 5–6) — Ngày 15 · Form Completion (mục 2–4)"],
        ["5. Đọc", "8", "≥ 6 câu đúng", "Ngày 14 · Summary Completion (mục 2, 6)"],
        ["6. Viết", "2 bài + 8 chỗ trống", "AI chấm ≥ band 4.0; Discussion có ĐỦ quan điểm A – quan điểm B – ý kiến riêng; Task 1 quy trình có overview (số bước, đầu – cuối) và câu bị động đúng; bài mẫu bản đồ ≥ 6/8 chỗ đúng", "Ngày 14 · Viết (mục 2–5) — Ngày 15 · Ngữ pháp mục 4e, 7 + Từ vựng mục 1–2, 4–5, 7–8"],
        ["7. Nói", "Part 2 + 3 câu Part 3", "AI chấm ≥ band 4.0; Part 2 nói đủ 2 phút, trả lời đủ 4 gạch đầu dòng bằng thì quá khứ", "Ngày 14 · Nói (mục 2–4, 7)"],
        ["8. Phát âm", "8 dòng", "≥ 70 điểm ở ít nhất 6/8 dòng", "Ngày 13 (mục Thêm: can / can't) — Ngày 14 mục 8 (-ed) — Ngày 15 mục 3–4 (số, đánh vần)"],
        ["9. Ôn tổng Tập 1", "12 + 12", "≥ 17/24 câu đúng (cộng hai khối)", "Mỗi câu ghi rõ Ngày (và mục) trong lời giải — sai câu nào ôn Ngày đó"],
      ],
    },

    /** ───────────── 1. Ngữ pháp ───────────── **/
    { t: "h", text: "Phần 1 — Ngữ pháp (15 + 8 câu · đạt ≥ 17/23 · trượt thì ôn Ngày 13, 15)" },
    {
      t: "p",
      text: "Chọn đáp án đúng. **Khối 1a** — câu 1–7: **động từ khuyết thiếu** (bắt buộc / không cần / xin phép / phỏng đoán / khả năng / lời khuyên / có thể); câu 8–15: **câu bị động** ở hiện tại đơn, quá khứ đơn, hiện tại tiếp diễn, với modal, câu hỏi — và một động từ **không có** bị động. **Khối 1b** (8 câu): **be able to** (tương lai, một lần làm được), **ought to**, **had better (not)** và **bị động hiện tại hoàn thành has / have been + V3** (câu tả bản đồ trước – sau). Điểm phần 1 = cộng hai khối.",
    },
    {
      t: "mcq",
      id: "d15-kt-ngu-phap",
      title: "Phần 1a — Ngữ pháp (15 câu)",
      items: [
        { q: "You ___ wear a helmet on the building site. It's the law.", options: ["should", "might", "must"], correct: 2, why: "\"It's the law\" = **bắt buộc** → **must** (hoặc have to). should chỉ là lời khuyên; might = có thể. (Ngày 13, mục 4)" },
        { q: "We ___ pay for the course. The company covers the fee.", options: ["mustn't", "don't have to", "can't"], correct: 1, why: "Công ty trả rồi → **không cần** trả = **don't have to**. ~~mustn't~~ = **cấm** — nghĩa hoàn toàn khác. (Ngày 13, mục 4)" },
        { q: "___ I borrow your charger for a minute?", options: ["Could", "Must", "Should"], correct: 0, why: "**Xin phép** lịch sự → **Could I…?** (hoặc Can / May I). Must / Should không dùng để xin phép. (Ngày 13, mục 3)" },
        { q: "The lights are off. They ___ be at home.", options: ["can't", "must", "mustn't"], correct: 0, why: "**Phỏng đoán** gần như chắc chắn là **không** (đèn tắt) → **can't be**. must be = chắc là có; ~~mustn't be~~ không dùng cho phỏng đoán. (Ngày 13, mục 6)" },
        { q: "When I was five, I ___ already swim.", options: ["can", "could", "might"], correct: 1, why: "**Khả năng trong quá khứ** (When I was five) → **could**. (Ngày 13, mục 2)" },
        { q: "You look tired. You ___ take a break.", options: ["should", "must to", "have"], correct: 0, why: "**Lời khuyên** → **should** + V nguyên mẫu. ~~must to~~ sai (modal không có to); have thiếu to. (Ngày 13, mục 1, 5)" },
        { q: "She ___ come to the party, but she isn't sure yet.", options: ["must", "has to", "might"], correct: 2, why: "\"isn't sure yet\" → **có thể**, chưa chắc → **might**. must / has to = chắc chắn hoặc bắt buộc. (Ngày 13, mục 6)" },
        { q: "The bottles ___ with hot water before they are refilled.", options: ["wash", "are washed", "washed"], correct: 1, why: "Chai **được rửa** (bị động hiện tại đơn, quy trình): are + V3 (washed). (Ngày 15, mục 4a, 7)" },
        { q: "The old factory ___ in 2019 and a park was built there.", options: ["was demolished", "demolished", "is demolished"], correct: 0, why: "**in 2019** + nhà máy **bị phá** → bị động **quá khứ đơn**: was + demolished. (Ngày 15, mục 4b)" },
        { q: "The plastic ___ into small pieces by a machine.", options: ["is cut", "cuts", "is cutting"], correct: 0, why: "Có **by a machine** (người/vật thực hiện) → bị động: is + **cut** (V3 của cut là cut). ~~is cutting~~ là chủ động tiếp diễn. (Ngày 15, mục 3, 6)" },
        { q: "Online lessons ___ by thousands of students every day.", options: ["watch", "are watching", "are watched"], correct: 2, why: "Bài học **được xem** → bị động hiện tại đơn, chủ ngữ số nhiều → **are watched**. (Ngày 15, mục 4a)" },
        { q: "The accident ___ last night near the station.", options: ["was happened", "happened", "is happened"], correct: 1, why: "**happen** là động từ **không có bị động** (không có tân ngữ) → chỉ dùng chủ động quá khứ: happened. ~~was happened~~ là lỗi rất hay gặp. (Ngày 15, mục 8)" },
        { q: "The report must ___ by Friday.", options: ["be finished", "finish", "been finished"], correct: 0, why: "**modal + be + V3** → must **be finished**. Báo cáo **được** hoàn thành, không tự hoàn thành. (Ngày 15, mục 4d)" },
        { q: "The new bridge ___ at the moment, so the road is closed.", options: ["is built", "is being built", "builds"], correct: 1, why: "**at the moment** → hiện tại **tiếp diễn** bị động: is **being** built. is built = hiện tại đơn (thường xuyên), không hợp. (Ngày 15, mục 4c)" },
        { q: "___ English spoken in this office?", options: ["Does", "Are", "Is"], correct: 2, why: "Câu hỏi bị động: đảo **be** lên đầu: **Is** + English + spoken…? English là danh từ không đếm được → is. (Ngày 15, mục 5)" },
      ],
    },

    {
      t: "mcq",
      id: "d15-kt-ngu-phap-2",
      title: "Phần 1b — be able to · ought to · had better · has / have been + V3 (8 câu)",
      items: [
        { q: "After this course, you ___ write a full Task 2 essay in forty minutes.", options: ["will can", "will be able to", "can will"], correct: 1, why: "Khả năng ở **tương lai** → **will be able to** + V. Hai modal không đứng cạnh nhau: ~~will can~~ sai (luật vàng Ngày 13 mục 1). (ôn Ngày 13, mục 2)" },
        { q: "The river flooded the road, but luckily we ___ get home before dark.", options: ["were able to", "could", "can"], correct: 0, why: "**Một lần làm được** việc khó trong một tình huống cụ thể ở quá khứ → **were able to** (hoặc managed to). **could** chỉ khả năng **chung** trong quá khứ — ~~we could get home~~ nghe sai với người bản xứ; can là hiện tại. (ôn Ngày 13, mục 2)" },
        { q: "Parents ___ read to their children every evening.", options: ["ought", "should to", "ought to"], correct: 2, why: "**ought** luôn đi với **to** + V nguyên mẫu: **ought to read** (= should, trang trọng hơn). ~~ought read~~ thiếu to; ngược lại **should** thì **không** có to: ~~should to read~~. (ôn Ngày 13, mục 5)" },
        { q: "It's already eight o'clock. You'd better ___ now, or you'll miss the train.", options: ["leave", "to leave", "leaving"], correct: 0, why: "**had better ('d better) + V nguyên mẫu** — không có to: ~~had better to leave~~. had better nói về **bây giờ / sắp tới**, không phải quá khứ. (ôn Ngày 13, mục 5)" },
        { q: "The exam starts at nine sharp. You ___ be late again.", options: ["hadn't better", "had better not", "had not better to"], correct: 1, why: "Phủ định của had better: **had better not + V** ('d better not be late). ~~hadn't better~~ sai vị trí not; ~~had not better to~~ vừa sai vị trí vừa thừa to. (ôn Ngày 13, mục 5)" },
        { q: "Which sentence is most suitable for an IELTS Writing Task 2 essay?", options: ["The government had better build more libraries.", "You'd better build more libraries.", "The government ought to build more libraries in rural areas."], correct: 2, why: "Task 2 đưa giải pháp bằng **should / ought to**. **had better** mang giọng **cảnh báo, đe doạ** và chỉ hợp khi nói chuyện thân mật; **You** cũng không hợp văn viết học thuật. (ôn Ngày 13, mục 5)" },
        { q: "Since 2010, two new bridges ___ across the river.", options: ["has been built", "have been built", "have built"], correct: 1, why: "Thay đổi đã xảy ra, kết quả còn tới nay (bản đồ \"then and now\") → **hiện tại hoàn thành bị động**: chủ ngữ số nhiều (two bridges) → **have been + V3**. ~~has been built~~ sai số; ~~have built~~ là chủ động (cầu không tự xây). (ôn Ngày 15, mục 4e)" },
        { q: "Compared with the 1990 map, the farmland in the north ___ by a housing estate.", options: ["has replaced", "have been replaced", "has been replaced"], correct: 2, why: "**the farmland** (số ít, không đếm được) → **has been replaced by** + cái MỚI. ~~has replaced~~ là chủ động — nghĩa thành \"đất nông nghiệp thay thế khu nhà\", ngược hẳn; ~~have been replaced~~ sai số. (ôn Ngày 15, mục 4e; Từ vựng mục 4)" },
      ],
    },

    /** ───────────── 2. Từ vựng ───────────── **/
    { t: "h", text: "Phần 2 — Từ vựng (12 + 6 câu · đạt ≥ 9/12 và ≥ 5/6 · trượt thì ôn từ vựng Ngày 13, 15)" },
    {
      t: "p",
      text: "**2a**: điền **một từ** (hoặc từ ghép có gạch nối) vào chỗ trống, nghĩa tiếng Việt trong ngoặc; câu 1–5 từ chủ đề **Học trực tuyến & truyền thống** (Ngày 13), câu 6–12 từ **Bản đồ & quy trình** (Ngày 15) — chú ý viết đúng **dạng** (V3 cho bị động). **2b**: chọn từ / cụm đúng.",
    },
    {
      t: "quiz",
      id: "d15-kt-tu-vung",
      title: "Phần 2a — Từ vựng chủ đề (12 câu)",
      kind: "fill",
      items: [
        { q: "Students who study ___ can watch recorded lectures whenever they like. (trực tuyến)", answers: ["online"], hint: "Ngày 13" },
        { q: "In a ___ classroom, the teacher and the students meet in the same room. (truyền thống)", answers: ["traditional"], hint: "Ngày 13" },
        { q: "Learning at home needs a lot of ___ because nobody checks your work. (tính tự giác, tự kỷ luật)", answers: ["self-discipline", "self discipline", "selfdiscipline"], hint: "Ngày 13" },
        { q: "The students' ___ was poor: only half of them came to the lectures. (sự chuyên cần, có mặt)", answers: ["attendance"], hint: "Ngày 13" },
        { q: "Our ___ for the final essay is the 20th of June. (hạn nộp)", answers: ["deadline"], hint: "Ngày 13" },
        { q: "The station is in the ___ of the town, next to the market. (trung tâm)", answers: ["centre", "center", "middle", "heart"], hint: "Ngày 15 · vị trí" },
        { q: "The new houses were built to the ___ of the river, where the fields used to be. (phía tây)", answers: ["west"], hint: "Ngày 15 · phương hướng" },
        { q: "The old cinema was ___ and a car park now stands in its place. (bị phá dỡ — V3)", answers: ["demolished", "knocked down", "pulled down", "torn down"], hint: "Ngày 15 · động từ biến đổi" },
        { q: "The road was ___ from two lanes to four. (được mở rộng — V3)", answers: ["widened", "expanded"], hint: "Ngày 15 · động từ biến đổi" },
        { q: "The grapes are ___ by hand in late September. (được thu hoạch — V3)", answers: ["harvested", "picked"], hint: "Ngày 15 · động từ quy trình" },
        { q: "The clean bottles are ___ with juice and then sealed. (được đổ đầy — V3)", answers: ["filled"], hint: "Ngày 15 · động từ quy trình" },
        { q: "The finished products are ___ to shops by lorry. (được giao — V3)", answers: ["delivered", "transported", "sent", "distributed", "shipped"], hint: "Ngày 15 · động từ quy trình" },
      ],
    },
    {
      t: "mcq",
      id: "d15-kt-collocation",
      title: "Phần 2b — Chọn từ đúng (6 câu)",
      items: [
        { q: "Students must ___ the deadline or lose ten per cent of their marks.", options: ["meet", "make", "do"], correct: 0, why: "Collocation: **meet a deadline** = nộp đúng hạn (Ngày 13, mục 6; Ngày 11 cũng có **meet a target**). ~~make / do a deadline~~ sai." },
        { q: "Online courses give learners more ___ about when and where to study.", options: ["isolation", "flexibility", "supervision"], correct: 1, why: "**flexibility** = sự linh hoạt (ưu điểm của học trực tuyến). isolation = cô lập (nhược điểm); supervision = sự giám sát (có ở lớp truyền thống). (Ngày 13, mục 2, 4)" },
        { q: "The new café is ___ to the post office, so it is easy to find.", options: ["opposite", "between", "next"], correct: 2, why: "**next to** = ngay cạnh. ~~opposite to~~ sai (opposite không có to: opposite the post office); between phải đi với **A and B**. (Ngày 15, mục 2)" },
        { q: "The car park ___ into a playground in 2015.", options: ["was extended", "was converted", "was relocated"], correct: 1, why: "**convert A into B** = chuyển đổi A thành B. extend = mở rộng; relocate = dời đi chỗ khác — cả hai không đi với **into**. (Ngày 15, mục 4)" },
        { q: "The hot liquid is ___ into moulds to give it its shape.", options: ["sorted", "harvested", "poured"], correct: 2, why: "**pour into moulds** = đổ vào khuôn (quy trình). sort = phân loại; harvest = thu hoạch. (Ngày 15, mục 7)" },
        { q: "Many parents worry about their children's ___ because they spend hours on tablets.", options: ["screen time", "tuition fees", "attendance"], correct: 0, why: "**screen time** = thời gian nhìn màn hình — từ khoá khi nói nhược điểm của học trực tuyến. tuition fees = học phí; attendance = chuyên cần. (Ngày 13, mục 2, 4)" },
      ],
    },

    /** ───────────── 3. Dịch ───────────── **/
    { t: "h", text: "Phần 3 — Dịch Việt → Anh (6 câu · đạt ≥ 5 · trượt thì ôn bài dịch 💡 Ngày 13, 15)" },
    {
      t: "p",
      text: "Dịch mỗi câu sang tiếng Anh, viết **cả câu**. Mỗi câu gộp **modal** hoặc **bị động** với từ vựng của chặng. Cố không bấm 💡; máy chấp nhận nhiều cách viết đúng.",
    },
    {
      t: "quiz",
      id: "d15-kt-dich",
      title: "Phần 3 — Dịch Việt → Anh (6 câu)",
      kind: "translate",
      grammar: "S + don't have to + V · S + can + V · S + must be + V3 · S + am/is/are + V3 (+ from / by) · S + was/were + V3 + mốc quá khứ · to make way for + N",
      items: [
        {
          q: "Bạn không cần đến lớp vào thứ Sáu.",
          hint: "don't have to, come to class / go to class, on Friday",
          answers: [
            "You don't have to come to class on Friday.",
            "You do not have to come to class on Friday.",
            "You don't have to go to class on Friday.",
            "You do not have to go to class on Friday.",
            "You don't have to attend class on Friday.",
            "You don't have to come to the class on Friday.",
            "You don't have to go to the class on Friday.",
            "You don't need to come to class on Friday.",
            "You don't need to go to class on Friday.",
          ],
        },
        {
          q: "Nước mắm được làm từ cá và muối.",
          hint: "fish sauce, is made from, fish and salt",
          answers: [
            "Fish sauce is made from fish and salt.",
            "Fish sauce is made of fish and salt.",
            "Fish sauce is produced from fish and salt.",
          ],
        },
        {
          q: "Cây cầu này được xây vào năm 1990.",
          hint: "this bridge, was built, in 1990",
          answers: [
            "This bridge was built in 1990.",
            "This bridge was constructed in 1990.",
            "The bridge was built in 1990.",
          ],
        },
        {
          q: "Sinh viên có thể xem lại bài giảng đã ghi hình bất cứ lúc nào.",
          hint: "students, can watch, the recorded lectures, again, at any time / whenever they want",
          answers: [
            "Students can watch the recorded lectures at any time.",
            "Students can watch the recorded lectures again at any time.",
            "Students can watch recorded lectures at any time.",
            "Students can watch recorded lectures again at any time.",
            "Students can watch the recorded lectures any time.",
            "Students can watch the recorded lectures whenever they want.",
            "Students can watch the recorded lectures again whenever they want.",
            "Students can watch the recorded lectures whenever they like.",
            "Students can rewatch the recorded lectures at any time.",
            "Students can re-watch the recorded lectures at any time.",
            "Students can watch the recorded lectures anytime.",
          ],
        },
        {
          q: "Bài tập phải được nộp trước thứ Hai.",
          hint: "the assignment, must be submitted / handed in, by Monday",
          answers: [
            "The assignment must be submitted by Monday.",
            "The assignment must be handed in by Monday.",
            "The assignment must be submitted before Monday.",
            "The assignment must be handed in before Monday.",
            "The homework must be submitted by Monday.",
            "The homework must be handed in by Monday.",
            "The assignment has to be submitted by Monday.",
            "The assignment has to be handed in by Monday.",
          ],
        },
        {
          q: "Những ngôi nhà cũ đã bị phá dỡ để nhường chỗ cho một trung tâm mua sắm.",
          hint: "the old houses, were demolished / knocked down, to make way for, a shopping centre",
          answers: [
            "The old houses were demolished to make way for a shopping centre.",
            "The old houses were knocked down to make way for a shopping centre.",
            "The old houses were demolished to make way for a shopping center.",
            "The old houses were knocked down to make way for a shopping center.",
            "The old houses were demolished to make way for a shopping mall.",
            "The old houses were knocked down to make way for a shopping mall.",
            "The old houses were demolished to make room for a shopping centre.",
            "The old houses were torn down to make way for a shopping centre.",
          ],
        },
      ],
    },

    /** ───────────── 4. Nghe ───────────── **/
    { t: "h", text: "Phần 4 — Nghe (6 + 6 + 7 câu · đạt ≥ 14/19 · trượt thì ôn Ngày 13, 15)" },
    {
      t: "p",
      text: "Ba bài: **Recording 1 — Part 4** (bài giảng về cách làm sô-cô-la, Note Completion, **nghe một lần**), **Recording 2 — Form Completion** (đăng ký khoá học trực tuyến, nghe tối đa 2 lần) và **Recording 3 — Part 4** (bài giảng về cách ghi chép, **Summary Completion + trắc nghiệm** như Practice 2 Ngày 13, **nghe một lần**). Đọc ghi chú / phiếu **trước**, đoán loại từ (danh từ? số? V3?), bám **từ tín hiệu** (First… Next… Once…), và luôn lấy thông tin **sau khi sửa**.",
    },
    { t: "h", text: "Recording 1 — Part 4 · Questions 1–6" },
    {
      t: "canh",
      anh: ["man-teacher", "sun-behind-cloud", "factory", "package"],
      caption: "Một giảng viên mô tả **quy trình làm sô-cô-la** từ quả ca cao trên cây tới thanh sô-cô-la trong hộp: thu hoạch → ủ lên men → phơi → rang → xay → trộn → đổ khuôn. Đúng kiểu bài giảng Part 4 kể một quy trình bằng câu **bị động**.",
    },
    {
      t: "table",
      caption: "How chocolate is made — Complete the notes. Write ONE WORD AND/OR A NUMBER for each answer.",
      head: ["Stage", "Notes"],
      rows: [
        ["Harvesting", "• pods are cut from the trees by hand · • each pod contains about **(1) ______** beans"],
        ["Fermenting", "• beans are covered with leaves and left for about **(2) ______** days · • this gives them their flavour"],
        ["Drying", "• beans are spread out in the **(3) ______** for one to two weeks"],
        ["At the factory", "• beans are roasted at around **(4) ______** °C · • the **(5) ______** are removed · • beans are ground into a thick paste"],
        ["Mixing & shaping", "• paste is mixed with sugar and, for milk chocolate, **(6) ______** powder · • poured into moulds and cooled"],
      ],
    },
    {
      t: "listen",
      id: "d15-kt-nghe-1",
      title: "How chocolate is made",
      dan: { so: "Checkpoint Test 3, Recording 1", boiCanh: "part of a lecture about how chocolate is produced.", cau: [1, 6] },
      note: "Giọng Anh-Anh (nam), khoảng 2 phút rưỡi. Chỉ nghe MỘT lần như thi thật, rồi điền.",
      lines: [
        { who: "Lecturer", voice: "uk-nam", text: "Good afternoon. Last week we looked at where cacao trees are grown. Today I want to follow the beans on their journey from the tree to the chocolate bar, and you'll see that it's a surprisingly long process with seven main stages.", vi: "Chào buổi chiều. Tuần trước ta đã xem cây ca cao được trồng ở đâu. Hôm nay tôi muốn theo hạt ca cao trên hành trình từ cây tới thanh sô-cô-la, và các bạn sẽ thấy đó là một quy trình dài đến bất ngờ với bảy giai đoạn chính." },
        { who: "Lecturer", voice: "uk-nam", text: "The first stage is harvesting. The pods grow directly on the trunk of the tree, and because they ripen at different times, machines can't be used. Each pod is cut from the tree by hand, with a knife. People often guess that a pod holds hundreds of beans, but in fact there are only about forty inside, surrounded by a sweet white pulp.", vi: "Giai đoạn đầu là thu hoạch. Quả mọc thẳng trên thân cây, và vì chín không cùng lúc nên không dùng máy được. Mỗi quả được cắt khỏi cây bằng tay, bằng dao. Nhiều người đoán một quả chứa hàng trăm hạt, nhưng thật ra chỉ khoảng bốn mươi hạt, bao quanh bởi lớp cơm trắng ngọt." },
        { who: "Lecturer", voice: "uk-nam", text: "Next comes fermenting, which is the stage most people have never heard of. The beans and the pulp are taken out of the pods, piled up, and covered with large leaves. Some farms leave them for four days, but about six days is normal. During this time the beans become warm and change colour, and this is what gives chocolate its flavour. Beans that are not fermented taste bitter and quite unpleasant.", vi: "Tiếp theo là ủ lên men, giai đoạn mà phần lớn mọi người chưa từng nghe. Hạt và cơm được lấy ra khỏi quả, chất đống và phủ lá to. Một số trang trại để bốn ngày, nhưng khoảng sáu ngày là bình thường. Trong thời gian này hạt nóng lên và đổi màu, và chính điều này tạo ra hương vị sô-cô-la. Hạt không lên men có vị đắng và khá khó chịu." },
        { who: "Lecturer", voice: "uk-nam", text: "After that, the beans have to be dried. At this stage they are not dried in ovens — that would be too expensive for most farmers. Instead, they are spread out on mats or wooden tables in the sun, and turned regularly, for one to two weeks. Once they are dry, they are put into sacks and sent to the factory, which is often on the other side of the world.", vi: "Sau đó, hạt phải được làm khô. Ở giai đoạn này hạt không được sấy trong lò — quá tốn kém với phần lớn nông dân. Thay vào đó, hạt được trải trên chiếu hoặc bàn gỗ dưới nắng, đảo đều, trong một đến hai tuần. Khi đã khô, hạt được cho vào bao và gửi tới nhà máy, thường ở tận bên kia thế giới." },
        { who: "Lecturer", voice: "uk-nam", text: "At the factory, the beans are first roasted. The temperature is quite low compared with coffee: coffee beans are roasted at over two hundred degrees, but cacao beans at around one hundred and thirty degrees, for about half an hour. Roasting makes the thin shells around the beans loose, so in the next stage the shells are removed by a machine that blows them away. What is left is then ground into a thick, dark paste.", vi: "Tại nhà máy, hạt được rang trước. Nhiệt độ khá thấp so với cà phê: hạt cà phê rang trên hai trăm độ, còn hạt ca cao khoảng một trăm ba mươi độ, trong khoảng nửa giờ. Rang làm lớp vỏ mỏng quanh hạt bong ra, nên ở bước kế tiếp vỏ được tách bằng một chiếc máy thổi bay chúng đi. Phần còn lại được xay thành một thứ bột nhão đặc, sẫm màu." },
        { who: "Lecturer", voice: "uk-nam", text: "This paste is pure chocolate, but it is far too bitter to eat. So, in the mixing stage, it is combined with sugar, and, if you are making milk chocolate, with milk powder as well. The mixture is stirred for many hours until it is completely smooth.", vi: "Thứ bột nhão này là sô-cô-la nguyên chất, nhưng quá đắng để ăn. Vì vậy, ở giai đoạn trộn, nó được kết hợp với đường, và nếu làm sô-cô-la sữa thì thêm cả bột sữa. Hỗn hợp được khuấy nhiều giờ cho tới khi hoàn toàn mịn." },
        { who: "Lecturer", voice: "uk-nam", text: "Finally, the liquid chocolate is poured into moulds, cooled, and wrapped. From the tree to the shop, the whole process can take several months. Now, let's look at the first stage in more detail.", vi: "Cuối cùng, sô-cô-la lỏng được đổ vào khuôn, làm nguội và gói. Từ cây tới cửa hàng, cả quy trình có thể mất vài tháng. Giờ ta xem kỹ hơn giai đoạn đầu tiên." },
      ],
    },
    {
      t: "quiz",
      id: "d15-kt-nghe-1-dien",
      title: "Questions 1–6 — ONE WORD AND/OR A NUMBER",
      kind: "fill",
      items: [
        { q: "(1) each pod contains about ___ beans", answers: ["40", "forty"] },
        { q: "(2) beans are covered with leaves and left for about ___ days", answers: ["6", "six"] },
        { q: "(3) beans are spread out in the ___ for one to two weeks", answers: ["sun"] },
        { q: "(4) beans are roasted at around ___ °C", answers: ["130"] },
        { q: "(5) the ___ are removed", answers: ["shells"] },
        { q: "(6) paste is mixed with sugar and, for milk chocolate, ___ powder", answers: ["milk"] },
      ],
    },
    {
      t: "note",
      title: "Giải thích đáp án 1–6",
      items: [
        "**(1) 40** — bẫy **con số mồi**: \"People often guess… **hundreds**… but in fact there are only about **forty**\". Sau **but in fact** là số thật.",
        "**(2) 6** — \"Some farms leave them for **four** days, **but** about **six** days is normal\". Ghi chú hỏi \"about ___ days\" → six.",
        "**(3) sun** — tín hiệu phủ định rồi khẳng định: \"**not** dried in ovens… **Instead**, they are spread out… **in the sun**\". Không viết ~~ovens~~.",
        "**(4) 130** — hai con số: cà phê **over two hundred**, ca cao **around one hundred and thirty**. Ghi chú nói về **beans** (ca cao) → 130. Viết bằng **chữ số**: ~~one hundred and thirty~~ là **bốn từ** — vượt giới hạn ONE WORD AND/OR A NUMBER, bị chấm sai dù đúng ý.",
        "**(5) shells** — \"the **shells** are removed by a machine\". Cần danh từ **số nhiều** (động từ **are**).",
        "**(6) milk** — \"with **milk powder** as well\". Chỗ trống đứng trước **powder** → chỉ điền **milk** (một từ).",
      ],
    },
    { t: "h", text: "Recording 2 — Form Completion · Questions 7–12" },
    {
      t: "canh",
      anh: ["telephone-receiver", "woman-office-worker", "man-student", "calendar"],
      caption: "Oliver gọi tới **Bright Minds Online Academy** để đăng ký một khoá học trực tuyến. Nhân viên tư vấn (Jess, giọng Mỹ) điền phiếu. Bẫy: **ngày sinh bị sửa**, **học phí có giảm giá**, **hai cách thanh toán**.",
    },
    {
      t: "table",
      caption: "Bright Minds Online Academy — Registration Form · Complete the form. Write ONE WORD AND/OR A NUMBER for each answer.",
      head: ["Mục", "Thông tin"],
      rows: [
        ["Course", "Introduction to **(7) ______**"],
        ["Start date", "**(8) ______** September"],
        ["First name", "Oliver"],
        ["Family name", "**(9) ______**"],
        ["Date of birth", "**(10) ______** August 1999"],
        ["Fee", "£ **(11) ______**"],
        ["Payment", "by **(12) ______**"],
      ],
    },
    {
      t: "listen",
      id: "d15-kt-nghe-2",
      title: "Registering for an online course",
      dan: { so: "Checkpoint Test 3, Recording 2", boiCanh: "a telephone conversation between an advisor at an online academy and a man who wants to register for a course.", cau: [7, 12] },
      note: "Giọng Anh-Mỹ (Jess, nữ) và Anh-Anh (Oliver, nam), khoảng 2 phút. Nghe tối đa 2 lần.",
      lines: [
        { who: "Jess", voice: "us-nu", text: "Bright Minds Online Academy, this is Jess. How can I help you today?", vi: "Học viện Trực tuyến Bright Minds, Jess xin nghe. Tôi giúp gì được ạ?" },
        { who: "Oliver", voice: "uk-nam", text: "Hello. I'd like to register for one of your courses, please. I was looking at the mathematics course, but actually I think the statistics one is more useful for my job.", vi: "Chào chị. Tôi muốn đăng ký một khoá học. Tôi đã xem khoá toán, nhưng thật ra tôi nghĩ khoá thống kê hữu ích hơn cho công việc." },
        { who: "Jess", voice: "us-nu", text: "Sure. So that's Introduction to Statistics. There are two start dates: the third of September and the first of October.", vi: "Vâng. Vậy là Nhập môn Thống kê. Có hai ngày khai giảng: mùng ba tháng Chín và mùng một tháng Mười." },
        { who: "Oliver", voice: "uk-nam", text: "September, please. The earlier one.", vi: "Tháng Chín ạ. Đợt sớm hơn." },
        { who: "Jess", voice: "us-nu", text: "The third of September. Great. Can I take your name?", vi: "Mùng ba tháng Chín. Tốt. Cho tôi xin tên anh?" },
        { who: "Oliver", voice: "uk-nam", text: "It's Oliver Hadley. Hadley is H, A, D, L, E, Y.", vi: "Oliver Hadley. Hadley là H, A, D, L, E, Y." },
        { who: "Jess", voice: "us-nu", text: "H, A, D, L, E, Y. And your date of birth, for the certificate?", vi: "H, A, D, L, E, Y. Và ngày sinh của anh, để ghi chứng chỉ?" },
        { who: "Oliver", voice: "uk-nam", text: "The twenty-first of August, nineteen ninety-nine. Sorry — I always mix those up. It's the twelfth. The twelfth of August.", vi: "Ngày hai mươi mốt tháng Tám, một chín chín chín. Xin lỗi — tôi hay nhầm hai số đó. Là ngày mười hai. Mười hai tháng Tám." },
        { who: "Jess", voice: "us-nu", text: "No problem. The twelfth of August, 1999. Now, the fee. The course normally costs one hundred and eighty pounds, but if you register before the end of this month there's a discount, so you'd pay one hundred and fifty.", vi: "Không sao. Mười hai tháng Tám, 1999. Giờ là học phí. Khoá bình thường một trăm tám mươi bảng, nhưng nếu đăng ký trước cuối tháng này thì được giảm, anh trả một trăm năm mươi." },
        { who: "Oliver", voice: "uk-nam", text: "One hundred and fifty. That's good. How do I pay?", vi: "Một trăm năm mươi. Tốt quá. Tôi thanh toán thế nào?" },
        { who: "Jess", voice: "us-nu", text: "You can pay by bank transfer, but that takes about three days, and your place isn't confirmed until the money arrives. Most people pay by card, which is instant.", vi: "Anh có thể chuyển khoản, nhưng mất khoảng ba ngày, và chỗ của anh chưa được xác nhận cho tới khi tiền về. Phần lớn mọi người trả bằng thẻ, có hiệu lực ngay." },
        { who: "Oliver", voice: "uk-nam", text: "Card, then. I'll do it now.", vi: "Vậy bằng thẻ. Tôi làm ngay bây giờ." },
        { who: "Jess", voice: "us-nu", text: "Perfect. I'll send you a payment link by email, and you'll get your login details as soon as it goes through.", vi: "Tuyệt. Tôi sẽ gửi đường dẫn thanh toán qua email, và anh sẽ nhận thông tin đăng nhập ngay khi giao dịch xong." },
      ],
    },
    {
      t: "quiz",
      id: "d15-kt-nghe-2-dien",
      title: "Questions 7–12 — ONE WORD AND/OR A NUMBER",
      kind: "fill",
      items: [
        { q: "(7) Course: Introduction to ___", answers: ["Statistics"] },
        { q: "(8) Start date: ___ September", answers: ["3", "3rd", "third"] },
        { q: "(9) Family name: ___", answers: ["Hadley"] },
        { q: "(10) Date of birth: ___ August 1999", answers: ["12", "12th", "twelfth"] },
        { q: "(11) Fee: £ ___", answers: ["150"] },
        { q: "(12) Payment: by ___", answers: ["card"] },
      ],
    },
    {
      t: "note",
      title: "Giải thích đáp án 7–12",
      items: [
        "**(7) Statistics** — bẫy đổi ý: \"I was looking at the **mathematics** course, **but actually**… the **statistics** one\". Lấy lựa chọn **cuối**.",
        "**(8) 3** — hai ngày (3 September / 1 October); Oliver chọn \"September… The earlier one\" → **3rd September**. Viết 3 hay 3rd đều được.",
        "**(9) Hadley** — đánh vần H-A-D-L-E-Y. Hay nhầm **A** /eɪ/ với **E** /iː/, **Y** với **I**.",
        "**(10) 12** — bẫy **sửa lời** kinh điển: 21st → \"Sorry… It's the **twelfth**\". Jess đọc lại để xác nhận.",
        "**(11) 150** — giá gốc **180**, giảm còn **150**; phiếu hỏi số tiền **phải trả** → 150. Viết **chữ số** 150 — ~~one hundred and fifty~~ là bốn từ, vượt giới hạn ONE WORD AND/OR A NUMBER.",
        "**(12) card** — bank transfer được nhắc trước nhưng kèm nhược điểm; Oliver chốt \"**Card**, then\".",
      ],
    },
    { t: "h", text: "Recording 3 — Part 4 · Questions 13–19" },
    {
      t: "canh",
      anh: ["woman-teacher", "laptop", "pencil", "notebook"],
      caption: "Một giảng viên trả lời câu hỏi mà sinh viên nào cũng gặp: **ghi chép bài giảng bằng máy tính hay viết tay** thì nhớ tốt hơn? Đúng dạng Practice 2 Ngày 13: **Summary Completion** (tóm tắt viết lại bằng từ khác) rồi **3 câu trắc nghiệm**.",
    },
    {
      t: "p",
      text: "**Questions 13–16.** Complete the summary below. Write **ONE WORD ONLY** for each answer. **Questions 17–19.** Choose the correct letter, **A, B or C**. — Đọc trước **cả đoạn tóm tắt** và đoán loại từ (so sánh hơn? tính từ? động từ? danh từ số nhiều?); tóm tắt **không dùng lại** chữ của bài giảng mà paraphrase. Bài **chỉ nghe một lần**: điền tóm tắt trong khi nghe; thông tin cho 3 câu trắc nghiệm nằm ở **phần cuối** bài, sau chỗ trống (16).",
    },
    {
      t: "table",
      caption: "Summary — Taking notes in lectures",
      head: ["", "Complete the summary below. Write ONE WORD ONLY for each answer."],
      rows: [
        ["", "Most students today type their lecture notes, mainly because typing is **(13) ______** than writing by hand. In one American study, laptop users and hand-writers did equally well on simple **(14) ______** questions, but the hand-writers were much better at understanding and applying ideas. Because typing is so fast, laptop users tended to record the speaker's words without thinking, while hand-writers had to **(15) ______** what was important. The lecturer advises students to review their notes within twenty-four hours and rewrite the key points in their own **(16) ______**."],
      ],
    },
    {
      t: "listen",
      id: "d15-kt-nghe-3",
      title: "Laptop or pen? Taking notes in lectures",
      dan: { so: "Checkpoint Test 3, Recording 3", boiCanh: "part of a lecture about different ways of taking notes.", cau: [13, 19] },
      note: "Giọng Anh-Anh (nữ), khoảng 2 phút rưỡi. Chỉ nghe MỘT lần như thi thật. Câu hỏi đi đúng thứ tự bài giảng: 13–16 (tóm tắt) trước, 17–19 (trắc nghiệm) ở phần cuối.",
      lines: [
        { who: "Lecturer", voice: "uk-nu", text: "Good morning. Note-taking has a long and rather interesting history, but I'm not going to go into that today. Instead, I want to look at a question that almost every student faces: is it better to take notes on a laptop or by hand? Most students today type their notes, mainly because it's faster. A typical student can type about thirty-three words a minute, but can only write about twenty-two by hand.", vi: "Chào buổi sáng. Việc ghi chép có một lịch sử dài và khá thú vị, nhưng hôm nay tôi sẽ không nói về điều đó. Thay vào đó, tôi muốn bàn một câu hỏi mà gần như sinh viên nào cũng gặp: ghi chép bằng máy tính xách tay hay viết tay thì tốt hơn? Phần lớn sinh viên ngày nay gõ ghi chép, chủ yếu vì nhanh hơn. Một sinh viên bình thường gõ được khoảng ba mươi ba từ một phút, nhưng viết tay chỉ được khoảng hai mươi hai từ." },
        { who: "Lecturer", voice: "uk-nu", text: "A well-known study in the United States tested this. Researchers asked students to watch short talks and take notes, either on a laptop or with pen and paper. Afterwards, the students answered questions about what they had heard. On simple factual questions — names, dates and so on — the two groups did equally well. But on questions that asked them to understand ideas and apply them, the students who wrote by hand did much better.", vi: "Một nghiên cứu nổi tiếng ở Mỹ đã kiểm chứng điều này. Các nhà nghiên cứu cho sinh viên xem những bài nói ngắn và ghi chép, bằng máy tính hoặc bằng bút giấy. Sau đó sinh viên trả lời câu hỏi về những gì đã nghe. Với các câu hỏi dữ kiện đơn giản — tên, ngày tháng… — hai nhóm làm tốt như nhau. Nhưng với các câu hỏi đòi hiểu ý và vận dụng, nhóm viết tay làm tốt hơn hẳn." },
        { who: "Lecturer", voice: "uk-nu", text: "Why should that be? When we look at the laptop notes, they're longer, but much of what is in them has been copied word for word from the speaker. Typing is so fast that students simply record everything without thinking about it. Handwriting is slower, so students have to choose what is important and put it into their own words — and that extra effort is exactly what helps memory.", vi: "Vì sao lại thế? Nhìn ghi chép trên máy tính, chúng dài hơn, nhưng phần lớn nội dung bị chép nguyên văn lời người nói. Gõ nhanh đến mức sinh viên chỉ ghi lại mọi thứ mà không suy nghĩ. Viết tay chậm hơn, nên sinh viên phải chọn điều gì quan trọng và diễn đạt bằng lời của mình — chính nỗ lực thêm đó giúp trí nhớ." },
        { who: "Lecturer", voice: "uk-nu", text: "So what should you do? My advice is simple. Whichever method you use, review your notes within twenty-four hours and rewrite the key points in your own words.", vi: "Vậy bạn nên làm gì? Lời khuyên của tôi đơn giản thôi. Dù dùng cách nào, hãy xem lại ghi chép trong vòng hai mươi bốn giờ và viết lại các ý chính bằng lời của chính mình." },
        { who: "Lecturer", voice: "uk-nu", text: "You might think it would be enough just to warn laptop users about the problem. Interestingly, the researchers tried exactly that: when they told the laptop users not to copy word for word, it made almost no difference — they still did it. So, should we ban laptops from lecture theatres? I don't think so. Laptops have clear advantages: typed notes are easy to search, to share with classmates and to store safely.", vi: "Có thể bạn nghĩ chỉ cần cảnh báo người dùng máy tính về vấn đề này là đủ. Điều thú vị là các nhà nghiên cứu đã thử đúng như vậy: khi họ dặn nhóm dùng máy tính đừng chép nguyên văn, kết quả gần như không đổi — họ vẫn chép. Vậy có nên cấm máy tính trong giảng đường không? Tôi không nghĩ thế. Máy tính có những lợi thế rõ ràng: ghi chép đánh máy dễ tìm kiếm, dễ chia sẻ với bạn cùng lớp và dễ lưu trữ an toàn." },
        { who: "Lecturer", voice: "uk-nu", text: "Some of you have asked about using laptops in exams — I'll answer that question by email. Next week, we'll look at another learning technique: testing yourself, instead of simply reading your notes again.", vi: "Vài bạn đã hỏi về việc dùng máy tính trong phòng thi — tôi sẽ trả lời qua email. Tuần sau, chúng ta sẽ xem một kỹ thuật học khác: tự kiểm tra mình, thay vì chỉ đọc lại ghi chép." },
      ],
    },
    {
      t: "quiz",
      id: "d15-kt-nghe-3-tom-tat",
      title: "Questions 13–16 — Summary · ONE WORD ONLY",
      kind: "fill",
      items: [
        { q: "(13) typing is ___ than writing by hand", answers: ["faster"], hint: "is ___ than → tính từ so sánh hơn" },
        { q: "(14) did equally well on simple ___ questions", answers: ["factual"], hint: "simple ___ questions → tính từ" },
        { q: "(15) hand-writers had to ___ what was important", answers: ["choose"], hint: "had to ___ → động từ nguyên mẫu" },
        { q: "(16) rewrite the key points in their own ___", answers: ["words"], hint: "their own ___ → danh từ số nhiều" },
      ],
    },
    {
      t: "mcq",
      id: "d15-kt-nghe-3-chon",
      title: "Questions 17–19 — Multiple choice (A, B or C)",
      items: [
        { q: "(17) What happened when the laptop users were told not to copy the speaker's words?", options: ["A They took much shorter notes.", "B They did better on the factual questions.", "C They continued to copy word for word."], correct: 2, why: "\"when the researchers told the laptop users **not to copy word for word**, it made **almost no difference** — they **still did it**\" → C. Bẫy A: bài nói ghi chép máy tính **dài hơn** (longer), không ngắn hơn. Bẫy B: câu hỏi dữ kiện thì hai nhóm **ngang nhau** từ đầu." },
        { q: "(18) What does the lecturer say is an advantage of typed notes?", options: ["A They are easy to search and share.", "B They help students remember ideas.", "C They are usually shorter."], correct: 0, why: "\"Laptops have clear **advantages**: typed notes are **easy to search, to share** with classmates and to store\" → A. B là ưu điểm của **viết tay** (that extra effort… helps memory); C ngược với bài (laptop notes are **longer**)." },
        { q: "(19) What will the next lecture be about?", options: ["A using laptops in exams", "B a way of testing yourself", "C the history of note-taking"], correct: 1, why: "\"**Next week**, we'll look at another learning technique: **testing yourself**\" → B. Bẫy **cả ba đều được nhắc**: laptops in exams → trả lời **by email**; history → **not going to go into that today**. Từ tín hiệu **Next week** báo đúng chỗ đáp án (Ngày 13, mục 3)." },
      ],
    },
    {
      t: "note",
      title: "Giải thích đáp án 13–19 — paraphrase giữa tóm tắt và bài giảng",
      items: [
        "**(13) faster** — \"Most students today type their notes, **mainly because it's faster**\". Sau **is … than** phải là **so sánh hơn**: viết ~~fast~~ là sai. Con số 33 / 22 từ một phút chỉ là chi tiết minh hoạ.",
        "**(14) factual** — \"On **simple factual questions** — names, dates and so on — the two groups did **equally well**\". Tóm tắt đã in sẵn **simple**, chỗ trống chỉ còn **factual**.",
        "**(15) choose** — \"students **have to choose** what is important\" ↔ \"hand-writers **had to** ___ what was important\". Chép đúng động từ nguyên mẫu, không thêm -s.",
        "**(16) words** — \"rewrite the key points **in your own words**\" ↔ \"in their own ___\" — danh từ **số nhiều**; ~~word~~ là sai.",
        "**(17)–(19)** đều có bẫy **\"cả ba đều được nhắc\"** như Practice 2 Ngày 13 (mục 6): nghe **động từ / tín hiệu** đi kèm (made almost no difference · advantages · Next week) chứ đừng chọn phương án chỉ vì nghe thấy chữ của nó.",
      ],
    },

    /** ───────────── 5. Đọc ───────────── **/
    { t: "h", text: "Phần 5 — Đọc (8 câu · đạt ≥ 6 · trượt thì ôn Ngày 14)" },
    {
      t: "p",
      text: "Đặt đồng hồ **15 phút**. Dạng **Summary Completion có hộp từ** (Ngày 14): đọc đoạn tóm tắt trước, đoán **loại từ** cho từng chỗ trống (danh từ / tính từ / trạng từ / động từ), **chia hộp từ theo loại**, rồi tìm đoạn tương ứng trong bài (B–C) và nhận ra paraphrase. Hộp có **12 từ cho 8 chỗ trống** — 4 từ gây nhiễu.",
    },
    {
      t: "passage",
      title: "Learning a language online: what the evidence says",
      intro: "Bài đọc viết riêng cho bài kiểm tra này — 5 đoạn A–E, khoảng 450 từ. Các nghiên cứu và con số đều tự đặt.",
      paras: [
        {
          label: "A",
          text: "Twenty years ago, anyone who wanted to learn a foreign language had two choices: join a class, or buy a set of books and cassettes and study alone. Today there is a third option. Language apps, video lessons and online tutors are available on every phone, and some of the most popular apps have more than fifty million active users. The question that teachers, students and employers all want answered is a simple one: does it work?",
        },
        {
          label: "B",
          text: "The first large study to compare the two approaches was carried out at a university in the Netherlands in 2019. Researchers divided 300 adult beginners in Spanish into two groups. One group attended a traditional class twice a week for three months; the other used an app for the same number of hours. At the end, both groups took the same written test. The results surprised many people: the app users scored slightly higher in vocabulary and grammar, and there was almost no difference in reading. However, when the students were asked to hold a short conversation with a native speaker, the classroom group performed far better. The researchers concluded that apps are an efficient way to learn words and rules, but that speaking is a skill which has to be practised with real people.",
        },
        {
          label: "C",
          text: "A second finding was less expected. Only 41 per cent of the app group finished the three-month programme, compared with 88 per cent of the classroom group. The most common reason for giving up was not boredom or difficulty. It was the absence of a fixed time to study: without a timetable, learners kept putting the next lesson off until \"tomorrow\". Students in the classroom group, on the other hand, said that they often went to class simply because their friends would be there.",
        },
        {
          label: "D",
          text: "Since then, several schools and companies have tried to combine the strengths of both methods. In this \"blended\" model, students learn vocabulary and grammar on an app at home, and then use the lesson time only for speaking and discussion. A 2023 report on 40 language schools in Germany found that blended courses produced better speaking results than either pure online courses or pure classroom courses, and that students were more satisfied, mainly because the face-to-face time felt more valuable.",
        },
        {
          label: "E",
          text: "None of this means that the classroom is about to disappear. For people who live far from a school, work irregular hours or cannot afford a tutor, an app may be the only realistic option, and the research shows that it can take them a long way. But for anyone whose goal is to talk to other people, the evidence is clear: at some point, you have to put the phone down and open your mouth.",
        },
      ],
    },
    {
      t: "p",
      text: "**Questions 1–8.** Complete the summary using the list of words, **A–L**, below. Write the correct letter, **A–L**. — **Hoàn thành đoạn tóm tắt bằng danh sách từ A–L. Viết chữ cái đúng.**",
    },
    {
      t: "table",
      caption: "The Dutch study (paragraphs B–C)",
      head: ["", "Summary"],
      rows: [
        ["", "In 2019, Dutch researchers compared 300 **(1) ______** in Spanish who studied either in a class or with an app for three months. In the written test, the app users did **(2) ______** better in vocabulary and grammar, while the reading results of the two groups were very **(3) ______**. However, the classroom students were much stronger at **(4) ______**. A second finding concerned the number of students who **(5) ______** the course: fewer than half of the app group did so. The main reason was not that the lessons were **(6) ______**, but that learners had no fixed **(7) ______** for studying. Classroom students, in contrast, often attended because of their **(8) ______**."],
      ],
    },
    {
      t: "table",
      caption: "List of words",
      head: ["", "", "", "", "", ""],
      rows: [
        ["**A** slightly", "**B** friends", "**C** teachers", "**D** similar", "**E** completed", "**F** beginners"],
        ["**G** speaking", "**H** difficult", "**I** timetable", "**J** different", "**K** reading", "**L** quickly"],
      ],
    },
    {
      t: "quiz",
      id: "d15-kt-doc-tom-tat",
      title: "Questions 1–8 — viết chữ cái A–L (ô luyện nhận cả chữ cái hoặc từ)",
      kind: "fill",
      items: [
        { q: "(1) Dutch researchers compared 300 ___ in Spanish", answers: ["F", "beginners"], hint: "300 ___ → danh từ số nhiều chỉ người" },
        { q: "(2) the app users did ___ better in vocabulary and grammar", answers: ["A", "slightly"], hint: "did ___ better → trạng từ chỉ mức độ" },
        { q: "(3) the reading results of the two groups were very ___", answers: ["D", "similar"], hint: "were very ___ → tính từ" },
        { q: "(4) the classroom students were much stronger at ___", answers: ["G", "speaking"], hint: "stronger at ___ → danh từ (kỹ năng)" },
        { q: "(5) the number of students who ___ the course", answers: ["E", "completed"], hint: "who ___ the course → động từ quá khứ" },
        { q: "(6) The main reason was not that the lessons were ___", answers: ["H", "difficult"], hint: "were ___ → tính từ" },
        { q: "(7) learners had no fixed ___ for studying", answers: ["I", "timetable"], hint: "no fixed ___ → danh từ" },
        { q: "(8) Classroom students often attended because of their ___", answers: ["B", "friends"], hint: "their ___ → danh từ" },
      ],
    },
    {
      t: "note",
      title: "Giải thích đáp án 1–8",
      items: [
        "**(1) F beginners** — đoạn B: \"300 adult **beginners** in Spanish\". Chia hộp: danh từ chỉ người có **beginners / teachers / friends** — chỉ **beginners** đi với \"in Spanish\".",
        "**(2) A slightly** — \"scored **slightly** higher\" = did slightly better. Bẫy **L quickly** (cũng là trạng từ) nhưng bài không nói về tốc độ.",
        "**(3) D similar** — \"almost **no difference** in reading\" = results were very **similar**. Bẫy **J different** là ngược nghĩa.",
        "**(4) G speaking** — \"hold a short **conversation**… the classroom group performed **far better**\" = much stronger at **speaking**. Bẫy **K reading**: bài nói reading **không khác nhau**.",
        "**(5) E completed** — \"**finished** the three-month programme\" = completed the course; \"Only 41 per cent\" = fewer than half.",
        "**(6) H difficult** — \"not boredom or **difficulty**\" → tính từ **difficult** (hộp cho dạng tính từ, bài dùng danh từ — đây là paraphrase đổi loại từ).",
        "**(7) I timetable** — \"without a **timetable**\" = had no fixed timetable; \"a fixed time to study\" ngay trước đó.",
        "**(8) B friends** — \"because their **friends** would be there\". Bẫy **C teachers**: bài không nói về giáo viên ở đoạn này.",
      ],
    },

    /** ───────────── 6. Viết ───────────── **/
    { t: "h", text: "Phần 6 — Viết (2 bài + 8 chỗ trống · đạt khi AI chấm ≥ band 4.0, đủ cấu trúc và bài 6c ≥ 6/8 · trượt thì ôn Ngày 14, 15)" },
    {
      t: "p",
      text: "**Bài 6a** (30 phút): viết **trọn** một bài **Discussion** ít nhất 230 từ — đủ **3 nhiệm vụ**: quan điểm A, quan điểm B, ý kiến của bạn (Ngày 14). **Bài 6b** (20 phút): viết **trọn** một bài Task 1 mô tả **quy trình** theo hình bên dưới, ít nhất 150 từ, bằng câu **bị động** + từ nối trình tự (Ngày 15). **Bài 6c** (5 phút): điền 8 chỗ trống trong bài mẫu **hai bản đồ trước – sau** (Ngày 15, Từ vựng mục 4–5). Viết xong bấm AI chấm, đọc kỹ nhận xét về **Task Response / Task Achievement**.",
    },
    {
      t: "essay",
      id: "d15-kt-viet-discussion",
      task: "Task 2",
      prompt: "Some people believe that the best way to learn about other cultures is to travel abroad, while others think that books and the internet are enough. Discuss both views and give your own opinion. Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words. (Trong bài kiểm tra: tối thiểu 230 từ, 30 phút.)",
      minWords: 230,
      tips: [
        "Mở bài 2 câu: **Some people argue that + [A], while others believe that + [B]. In my opinion, (although + S + V,) + S + V.** — ý kiến của bạn phải xuất hiện ngay ở mở bài.",
        "Thân bài 1 (quan điểm A — đi du lịch): **On the one hand, those who support… argue that…** + lý do + **For example,** + ví dụ cụ thể. Không dùng **I think** ở đoạn này.",
        "Thân bài 2 (quan điểm B — sách & internet): **On the other hand, …** + lý do (rẻ, không cần visa, học được từ nhà — từ vựng Ngày 13: **accessible, cost-effective, flexibility**) — và nếu bạn đồng ý B thì nói luôn **I agree with those who…**.",
        "Kết bài: **In conclusion, while… , I believe that…** — nhắc lại ý kiến, **không thêm ý mới**.",
        "Modal cho ý kiến mềm (Ngày 13): **may / might / can** (**Travel can be expensive; books may give only one point of view**). Soát: chủ ngữ số nhiều → động từ không -s; mỗi đoạn 1–2 từ nối là đủ.",
      ],
    },
    {
      t: "figure",
      fig: {
        kind: "process",
        title: "How black tea is produced — from leaf to packet",
        note: "Quy trình tự đặt cho bài kiểm tra (đơn giản hoá). Viết mỗi bước một câu bị động.",
        steps: [
          { label: "Leaves picked", note: "by hand, top two leaves + bud" },
          { label: "Withered", note: "spread on racks, warm air, 12–18 hours" },
          { label: "Rolled", note: "by machine — breaks the leaves" },
          { label: "Oxidised", note: "cool, damp room, 2–3 hours; leaves turn brown" },
          { label: "Dried", note: "hot-air ovens, about 100 °C" },
          { label: "Sorted", note: "by size, through sieves" },
          { label: "Packed", note: "into bags or boxes; sent to shops" },
        ],
      },
    },
    {
      t: "essay",
      id: "d15-kt-viet-task1",
      task: "Task 1",
      prompt: "The diagram above shows how black tea is produced. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words. (Steps — 1 leaves picked by hand (top two leaves and bud) · 2 withered on racks in warm air for 12–18 hours · 3 rolled by machine to break the leaves · 4 oxidised in a cool, damp room for 2–3 hours until brown · 5 dried in hot-air ovens at about 100 °C · 6 sorted by size through sieves · 7 packed into bags or boxes and sent to shops.)",
      minWords: 150,
      tips: [
        "Mở bài: **The diagram illustrates the process by which black tea is produced / made.** (shows → illustrates; how … is produced → the process by which…).",
        "Overview: **The process consists of seven stages, beginning with the picking of the leaves and ending with the packing of the finished tea.** — nêu **số bước** + **bước đầu – bước cuối**, không chi tiết.",
        "Mỗi bước một câu **bị động hiện tại đơn** (Ngày 15, mục 7): **are picked · are withered · are rolled · are oxidised · are dried · are sorted · are packed** — và từ nối khác nhau: **First · Next · After that · Then · Once … · Following this · Finally**.",
        "Đưa đủ chi tiết trong hình: by hand · 12–18 hours · by machine · 2–3 hours, turn brown · about 100 °C · by size · bags or boxes. Chia thân bài: (1) bước 1–4 (xử lý lá), (2) bước 5–7 (sấy, phân loại, đóng gói).",
        "Không viết ý kiến cá nhân, không bịa bước không có trong hình. Nhắm 160–180 từ.",
      ],
    },
    { t: "h", text: "Bài 6c — Bản đồ trước – sau: điền bài mẫu (8 chỗ trống · đạt ≥ 6)" },
    {
      t: "p",
      text: "**5 phút.** Hai bản đồ cùng một nơi ở hai thời điểm — dạng Task 1 bạn học ở Ngày 15 (bài mẫu làng Ashford). Trước khi điền, tự lập **bảng thay đổi** như bước 1 của bài mẫu: ô nào **giữ nguyên**, ô nào **mới**, ô nào **mất / đổi công năng**. Rồi điền **một từ** vào mỗi chỗ trống (V3 cho câu bị động **has been + V3**, hướng, giới từ). Phía **Bắc** ở trên cùng cả hai bản đồ.",
    },
    {
      t: "figure",
      fig: {
        kind: "map",
        title: "Millbrook town centre — 2000",
        note: "Bản đồ tự đặt cho bài kiểm tra. Phía Bắc ở trên cùng.",
        map: {
          cols: 12,
          rows: 10,
          paths: [{ x: 0.2, y: 4.6, w: 11.6, h: 0.9, label: "High Street" }],
          boxes: [
            { x: 0.4, y: 0.4, w: 2.2, h: 3.8, label: "Library" },
            { x: 3.6, y: 0.4, w: 4.2, h: 3.8, label: "Market" },
            { x: 8.2, y: 0.4, w: 3.4, h: 3.8, label: "Park" },
            { x: 0.4, y: 5.9, w: 3.4, h: 3.7, label: "Cinema" },
            { x: 4.2, y: 5.9, w: 3.6, h: 3.7, label: "Houses" },
            { x: 8.2, y: 5.9, w: 3.4, h: 3.7, label: "Factory" },
          ],
        },
      },
    },
    {
      t: "figure",
      fig: {
        kind: "map",
        title: "Millbrook town centre — today",
        note: "Bản đồ tự đặt cho bài kiểm tra. Phía Bắc ở trên cùng.",
        map: {
          cols: 12,
          rows: 10,
          paths: [{ x: 0.2, y: 4.6, w: 11.6, h: 0.9, label: "High Street" }],
          boxes: [
            { x: 0.4, y: 0.4, w: 3, h: 3.8, label: "Library" },
            { x: 3.6, y: 0.4, w: 4.2, h: 3.8, label: "Shopping centre" },
            { x: 8.2, y: 0.4, w: 3.4, h: 1.8, label: "Park" },
            { x: 8.2, y: 2.4, w: 3.4, h: 1.8, label: "Car park" },
            { x: 0.4, y: 5.9, w: 3.4, h: 3.7, label: "Bus station" },
            { x: 4.2, y: 5.9, w: 3.6, h: 3.7, label: "Houses" },
            { x: 8.2, y: 5.9, w: 3.4, h: 3.7, label: "Apartments" },
          ],
        },
      },
    },
    {
      t: "examples",
      items: [
        { en: "[Introduction] The two maps show the centre of Millbrook in 2000 and how it looks today.", vi: "[Mở bài] Hai bản đồ cho thấy trung tâm thị trấn Millbrook năm 2000 và diện mạo hiện nay." },
        { en: "[Overview] Overall, the town centre has become more commercial and has better transport facilities, while the houses in the south have (1) ___ unchanged.", vi: "[Tổng quan] Nhìn chung, trung tâm thị trấn đã mang tính thương mại hơn và có hạ tầng giao thông tốt hơn, trong khi khu nhà ở phía nam vẫn (1) ___ nguyên." },
        { en: "[Body 1 — the north] In the north-west, the library has been (2) ___ to the east, so it is now larger than before. Next to it, the old market has been (3) ___ by a shopping centre. To the (4) ___ of the shopping centre, half of the park has been converted (5) ___ a car park.", vi: "[Thân bài 1 — phía bắc] Ở phía tây bắc, thư viện đã được (2) ___ về phía đông nên giờ lớn hơn trước. Bên cạnh, khu chợ cũ đã được (3) ___ bằng một trung tâm mua sắm. Ở phía (4) ___ của trung tâm mua sắm, một nửa công viên đã được chuyển (5) ___ bãi đỗ xe." },
        { en: "[Body 2 — the south] In the south-west, the cinema, which (6) ___ to stand beside the High Street, has been (7) ___ to make way for a bus station. Finally, the factory in the south-east has been (8) ___ into apartments.", vi: "[Thân bài 2 — phía nam] Ở phía tây nam, rạp chiếu phim — nơi (6) ___ nằm cạnh phố High Street — đã bị (7) ___ để nhường chỗ cho một bến xe buýt. Cuối cùng, nhà máy ở phía đông nam đã được (8) ___ thành khu căn hộ." },
      ],
    },
    {
      t: "quiz",
      id: "d15-kt-viet-ban-do",
      title: "Bài 6c — Điền bài mẫu bản đồ trước – sau (8 chỗ trống, mỗi chỗ một từ)",
      kind: "fill",
      items: [
        { q: "(1) …while the houses in the south have ___ unchanged.", answers: ["remained", "stayed"] },
        { q: "(2) …the library has been ___ to the east, so it is now larger than before. (V3)", answers: ["extended", "expanded", "enlarged"] },
        { q: "(3) …the old market has been ___ by a shopping centre. (V3)", answers: ["replaced"] },
        { q: "(4) To the ___ of the shopping centre, half of the park… (hướng)", answers: ["east"] },
        { q: "(5) …half of the park has been converted ___ a car park. (giới từ)", answers: ["into", "to"] },
        { q: "(6) …the cinema, which ___ to stand beside the High Street… (trước đây thường…)", answers: ["used"] },
        { q: "(7) …has been ___ to make way for a bus station. (V3)", answers: ["demolished", "removed"] },
        { q: "(8) …the factory in the south-east has been ___ into apartments. (V3)", answers: ["converted", "turned", "transformed", "developed", "redeveloped", "changed", "made"] },
      ],
    },
    {
      t: "note",
      title: "Giải thích bài 6c — bảng thay đổi trước khi viết",
      items: [
        "**Giữ nguyên**: khu nhà (Houses) ở giữa phía nam → **(1) have remained unchanged** — remain là nội động từ, **không** bị động (~~have been remained~~).",
        "**Lớn hơn**: thư viện rộng thêm về phía **đông** → **(2) has been extended** (hoặc expanded / enlarged). **Mới thay cũ**: chợ → trung tâm mua sắm → **(3) has been replaced by** + cái MỚI.",
        "**Chia đôi**: công viên ở **phía đông** trung tâm mua sắm → **(4) To the east of** · nửa phía nam thành bãi đỗ xe → **(5) converted into** (convert A **into** B).",
        "**Mất hẳn**: rạp chiếu phim → bến xe buýt → **(7) has been demolished to make way for**; **(6) which used to stand** = trạng thái cũ, nay không còn. **Đổi công năng**: nhà máy → căn hộ → **(8) has been converted into** (hoặc turned into).",
        "Thì: **has / have been + V3** cho thay đổi tới nay (Ngày 15, Ngữ pháp mục 4e); chia thân bài theo **vùng** (bắc → nam) như bài mẫu Ashford (Ngày 15, Từ vựng mục 5).",
      ],
    },

    /** ───────────── 7. Nói ───────────── **/
    { t: "h", text: "Phần 7 — Nói (Part 2 + Part 3 · đạt khi AI chấm ≥ band 4.0, nói đủ 2 phút · trượt thì ôn Ngày 14)" },
    {
      t: "p",
      text: "**Part 2**: đọc thẻ đề, bấm giờ **1 phút** ghi chú theo sơ đồ ý (Ngày 14, mục 4), rồi ghi âm **2 phút** — kể bằng **quá khứ đơn** + từ nối thời gian (First, Then, After that, In the end), trả lời **đủ 4 gạch đầu dòng**. **Part 3**: 3 câu, mỗi câu 4–6 câu theo O–R–E + mặt kia; dùng modal cho ý mềm (**people might… / schools should…**).",
    },
    {
      t: "speak",
      id: "d15-kt-noi-p2",
      part: "2",
      questions: [
        "Describe a course or a lesson you took that you found useful. You should say: what the course was; where and when you took it; what you learned from it; and explain why you found it useful.",
      ],
    },
    {
      t: "speak",
      id: "d15-kt-noi-p3",
      part: "3",
      questions: [
        "Do you think online courses can replace traditional classrooms?",
        "What qualities should a good teacher have?",
        "Should schools teach students how to learn by themselves?",
      ],
    },

    /** ───────────── 8. Phát âm ───────────── **/
    { t: "h", text: "Phần 8 — Phát âm (8 dòng · đạt ≥ 70 điểm ở 6/8 dòng · trượt thì ôn mục phát âm Ngày 13, 14, 15)" },
    {
      t: "phatam",
      id: "d15-kt-phat-am",
      title: "Phần 8 — Phát âm (8 dòng)",
      note: "Bấm “Nghe mẫu” một lần, rồi “Đọc & chấm”. Đạt khi ít nhất 6/8 dòng từ 70 điểm. Trọng tâm: can / can't và dạng yếu của modal (N13) · đuôi -ed (N14) · /ɪ/ – /iː/ (ôn Ngày 4) · số và đánh vần (N15) · ôn /θ/ /ð/, -s/-es của cả Tập 1.",
      items: [
        { text: "can, can't, could, should", ipa: "kæn kɑːnt kʊd ʃʊd", vi: "N13 · can /æ/ ngắn · can't /ɑː/ dài" },
        { text: "I can speak English, but I can't speak French.", ipa: "aɪ kən spiːk ɪŋɡlɪʃ bʌt aɪ kɑːnt spiːk frentʃ", vi: "N13 · can yếu /kən/, can't mạnh /kɑːnt/" },
        { text: "The bottles are collected, sorted and crushed.", ipa: "ðə bɒtlz ə kəlektɪd sɔːtɪd ənd krʌʃt", vi: "N14 · collected /ɪd/ · sorted /ɪd/ · crushed /t/ — câu bị động quy trình" },
        { text: "sheep, ship, leave, live", ipa: "ʃiːp ʃɪp liːv lɪv", vi: "Ôn Ngày 4 · /iː/ dài – /ɪ/ ngắn" },
        { text: "My number is oh seven seven, double three, nine.", ipa: "maɪ nʌmbə ɪz əʊ sevn sevn dʌbl θriː naɪn", vi: "N15 · oh = 0 · double three = 33" },
        { text: "She has to finish the assignment by Thursday.", ipa: "ʃi hæs tə fɪnɪʃ ði əsaɪnmənt baɪ θɜːzdeɪ", vi: "N13 · has to = /hæs tə/ · /θ/ trong Thursday" },
        { text: "These three things are worth thinking about.", ipa: "ðiːz θriː θɪŋz ə wɜːθ θɪŋkɪŋ əbaʊt", vi: "Ôn · /ð/ trong these · /θ/ trong three, things, worth, thinking" },
        { text: "He watches videos and takes notes every evening.", ipa: "hi wɒtʃɪz vɪdiəʊz ənd teɪks nəʊts evri iːvnɪŋ", vi: "Ôn Ngày 1 · watches /ɪz/ · videos /z/ · takes, notes /s/" },
      ],
    },

    /** ───────────── 9. Ôn tổng Tập 1 ───────────── **/
    { t: "h", text: "Phần 9 — Ôn trọng điểm Ngày 1–12 (12 + 12 câu · đạt ≥ 17/24 · sai câu nào ôn Ngày ghi trong lời giải)" },
    {
      t: "p",
      text: "**Khối 9a** (12 câu) \"quét\" nhanh những điểm **ngữ pháp – từ vựng** hay sai nhất của cả Tập 1; **khối 9b** (12 câu) quét **chiến thuật kỹ năng** của các ngày Đọc – Viết – Nói (Ngày 2, 4, 6, 8, 10): từ khoá, giới hạn số từ, overview, cấu trúc mở – thân – kết bài, bẫy Matching Features, cách trả lời Part 1. Lời giải mỗi câu ghi rõ Ngày đã học. Đây là phần cuối cùng trước Đề 1: sai câu nào, mở lại **đúng Ngày** ghi trong lời giải và làm lại bài tập Ngày đó.",
    },
    {
      t: "mcq",
      id: "d15-kt-on-tap",
      title: "Phần 9a — Ôn tổng Tập 1: ngữ pháp & từ vựng (12 câu)",
      items: [
        { q: "My cousin ___ English at a secondary school.", options: ["teaches", "teach", "teaching"], correct: 0, why: "**Ngày 1** · hiện tại đơn, chủ ngữ số ít → thêm **-es** sau **ch**: teaches." },
        { q: "Could you lend ___ your notes from yesterday's lecture?", options: ["I", "me", "my"], correct: 1, why: "**Ngày 3** · sau động từ lend cần **đại từ tân ngữ**: me. my phải có danh từ theo sau." },
        { q: "How ___ time do we have left before the exam?", options: ["many", "a few", "much"], correct: 2, why: "**Ngày 5** · **time** (thời gian) không đếm được → How **much**." },
        { q: "She drives very ___, so I always feel safe in her car.", options: ["careful", "carefully", "care"], correct: 1, why: "**Ngày 7** · bổ nghĩa cho động từ drives → **trạng từ** carefully." },
        { q: "Trains are ___ than buses in this city.", options: ["faster", "more fast", "the fastest"], correct: 0, why: "**Ngày 7** · có **than** → so sánh hơn, tính từ ngắn → fast**er**. ~~more fast~~ sai." },
        { q: "Don't call her now — she ___ a lecture.", options: ["gives", "gave", "is giving"], correct: 2, why: "**Ngày 9** · **now** + đang xảy ra → hiện tại tiếp diễn: is giving." },
        { q: "They ___ a food bank in their town in 2015.", options: ["open", "opened", "opens"], correct: 1, why: "**Ngày 9** · mốc **in 2015** → quá khứ đơn: opened." },
        { q: "Our tutor ___ us some very useful advice about the exam.", options: ["said", "made", "gave"], correct: 2, why: "**Ngày 11** · collocation **give advice**. ~~make advice~~ sai; **said** không đi với tân ngữ **us** kiểu này." },
        { q: "Which sentence has the correct word order?", options: ["I read quietly the news at home every morning.", "I read the news quietly at home every morning.", "I every morning read the news at home quietly."], correct: 1, why: "**Ngày 11** · S – V – O – cách thức – nơi chốn – thời gian: I read (V) the news (O) quietly (cách thức) at home (nơi) every morning (thời gian)." },
        { q: "Sales ___ slightly in 2020 before recovering the following year.", options: ["dipped", "peaked", "soared"], correct: 0, why: "**Ngày 11** · **slightly… before recovering** → giảm nhẹ = **dipped**. peaked = đạt đỉnh; soared = tăng vọt." },
        { q: "I was ill last week, so I need to ___ with the lessons I missed.", options: ["catch up", "give away", "wrap up"], correct: 0, why: "**Ngày 3 / Ngày 5** · **catch up (with)** = bắt kịp, học bù. give away = cho đi (Ngày 9); wrap up = kết thúc (Ngày 7)." },
        { q: "In a True / False / Not Given task, a statement that the passage does NOT mention at all should be marked ___.", options: ["NOT GIVEN", "FALSE", "TRUE"], correct: 0, why: "**Ngày 12** · bài **không nói** → **NOT GIVEN**. FALSE chỉ khi bài nói **ngược lại**. Đây là lỗi mất điểm số 1 của dạng này." },
      ],
    },

    {
      t: "mcq",
      id: "d15-kt-on-ky-nang",
      title: "Phần 9b — Ôn tổng Tập 1: chiến thuật kỹ năng Ngày 2–10 (12 câu)",
      items: [
        { q: "In a Reading question, \"in the 1980s\" refers to", options: ["the year 1980 only.", "the ten years from 1980 to 1989.", "any time after 1980."], correct: 1, why: "**Ngày 2 · Đọc, mục 5** (từ khoá thời gian): **the 1980s** = **những năm 1980**, cả thập kỷ 1980–1989 — khoảng thời gian (Time Period), không phải một mốc. Nhầm thành \"năm 1980\" là lỗi người Việt hay gặp." },
        { q: "Bài Task 2 dùng từ hay, ít lỗi ngữ pháp, nhưng chỉ trả lời **một nửa** câu hỏi của đề. Tiêu chí nào bị kéo xuống nặng nhất?", options: ["Task Response", "Lexical Resource", "Grammatical Range and Accuracy"], correct: 0, why: "**Ngày 2 · Viết, mục 4**: **Task Response** hỏi \"có trả lời **đúng và đủ** đề không\". Trả lời một nửa đề → TR thấp, kéo cả bài xuống dù từ vựng (LR) và ngữ pháp (GRA) tốt." },
        { q: "NO MORE THAN TWO WORDS. Passage: \"The hotel opened in 1925 in what had been the old railway station.\" — Question: \"Before 1925, the hotel building was a ___.\" Which answer is accepted?", options: ["old railway station", "the railway station", "railway station"], correct: 2, why: "**Ngày 4 · Đọc, mục 1** (bước 1: khoanh **giới hạn số từ** trước tiên): **railway station** = 2 từ, chép đúng từ trong bài, khớp với \"a ___\". Hai phương án kia đều **3 từ** → sai cả câu dù đúng ý." },
        { q: "Trong bài Task 1, đoạn nào nêu **hai đặc điểm nổi bật nhất** và **không** đưa số liệu chi tiết?", options: ["Introduction", "Body 1", "Overview"], correct: 2, why: "**Ngày 4 · Viết, mục 3**: **Overview** (mở bằng Overall,) = 2 xu hướng / điểm nổi bật, **không số**. Introduction chỉ paraphrase đề; Body mới có số liệu. Thiếu overview thì Task Achievement khó vượt band 5." },
        { q: "Trong dạng **Flow-chart Completion** (Ngày 6), đáp án thường", options: ["nằm theo thứ tự của bài đọc.", "nằm hết ở đoạn đầu tiên.", "phải là từ đồng nghĩa, không lấy từ trong bài."], correct: 0, why: "**Ngày 6 · Đọc** (khối “Ghi nhớ về dạng bài” ở đầu bài, trước mục 1): sơ đồ đi **theo trình tự** bài — đáp án câu sau nằm **sau** đáp án câu trước; từ điền phải **chép đúng từ trong bài** (C sai)." },
        { q: "Mở bài **Opinion** (Ngày 6) gồm hai câu theo thứ tự nào?", options: ["Thesis (quan điểm + lý do) → paraphrase đề", "Paraphrase đề → thesis (quan điểm + 1–2 lý do)", "Paraphrase đề → một ví dụ cụ thể"], correct: 1, why: "**Ngày 6 · Viết, mục 2** (bước 2–4): **paraphrase đề** trước, **thesis** sau, ghép thành một đoạn. Ví dụ cụ thể thuộc về **thân bài** (Ngày 8), không nằm ở mở bài." },
        { q: "Examiner: \"Where do you usually study?\" — Which is the best Part 1 answer?", options: ["Yes, I do. I study a lot.", "I'm studying in my bedroom at the moment.", "I usually study in my bedroom, because it's quiet and I can concentrate."], correct: 2, why: "**Ngày 6 · Nói, mục 2** (5 bước câu hỏi Wh-): nghe đúng từ hỏi **Where** → trả lời **nơi chốn** ngay + **thêm 1 chi tiết**, dùng **hiện tại đơn** cho thói quen (usually). A trả lời kiểu Yes/No; B dùng tiếp diễn \"lúc này\" — lệch câu hỏi thói quen (Ngày 9 mục 4)." },
        { q: "ONE WORD AND/OR A NUMBER. Table cell: \"___ per cent of roofs\". Passage: \"…about 40 per cent of roofs in the city…\". You write", options: ["40", "40 per cent", "about 40"], correct: 0, why: "**Ngày 8 · Đọc, mục 1** (bước 6): bảng đã in sẵn **per cent** → **không viết lại đơn vị**; ~~40 per cent~~ và ~~about 40~~ đều thừa từ → vượt giới hạn, sai." },
        { q: "Thứ tự đúng của một đoạn **thân bài** Task 2 (Ngày 8)?", options: ["Example → Topic sentence → Explanation", "Topic sentence → Explanation → Example", "Explanation → Example → Topic sentence"], correct: 1, why: "**Ngày 8 · Viết, mục 2**: **Topic sentence** (ý chính, bám thesis) → **Explanation** (vì sao / dẫn tới gì) → **Example** (cụ thể) → (Link, tuỳ chọn). Mỗi đoạn **một** ý." },
        { q: "Matching Features: \"Dr Lee points out that the volunteers in Dr Park's study were paid.\" — Whose idea is this?", options: ["Dr Park's", "both Dr Lee's and Dr Park's", "Dr Lee's"], correct: 2, why: "**Ngày 10 · Đọc, mục 2** (bẫy 2): ý thuộc về **chủ ngữ** của động từ nói / cho rằng — **Dr Lee** points out. Tên đứng sau **'s** / **in** (Dr Park's study) chỉ là người **bị nhắc tới**." },
        { q: "Câu nào **KHÔNG** nên có trong kết bài Task 2?", options: ["In conclusion, I firmly believe that schools should teach cooking.", "For example, my cousin learned to cook at school and now eats very healthily.", "It is an essential life skill, and it also helps teenagers eat better."], correct: 1, why: "**Ngày 10 · Viết, mục 3** (năm điều KHÔNG làm): kết bài **không thêm ví dụ mới**, không thêm ý mới. A = báo hiệu + nhắc lại quan điểm; C = gói 2 lý do bằng lời khác — đúng 3 bước mục 2." },
        { q: "Which answer is correct?", options: ["I hardly ever eat fast food.", "I eat hardly ever fast food.", "I am hardly ever eating fast food."], correct: 0, why: "**Ngày 10 · Nói, mục 2**: trạng từ tần suất đứng **trước động từ thường** và đi với **hiện tại đơn**: I **hardly ever eat**… ~~eat hardly ever fast food~~ sai vị trí; ~~am hardly ever eating~~ sai thì." },
      ],
    },

    /** ───────────── 10. Tổng kết + Đề 1 ───────────── **/
    {
      t: "recap",
      title: "Xong bài kiểm tra — bước tiếp theo",
      items: [
        "**Đạt cả 9 phần** (mỗi phần ≥ 70 %) → bạn **sẵn sàng thi Đề 1** (hướng dẫn ngay dưới). Hoàn thành Tập 1 — từ mất gốc tới band 3.5–4.5!",
        "Chưa đạt **Ngữ pháp / Dịch** → ôn **Ngày 13** (modal: mục 2–6 — **be able to** mục 2, **mustn't** vs **don't have to** mục 4, **ought to / had better** mục 5) và **Ngày 15** (bị động: 4 bước mục 2, bảng các thì mục 4, **has / have been + V3** mục 4e, động từ không có bị động mục 8); làm lại bài dịch 💡 trong đó.",
        "Chưa đạt **Từ vựng** → mở lại **Ngày 13** (mục 1–4, 6) và **Ngày 15** (mục 1–2, 4, 7), dùng \"Che nghĩa / Che từ\"; động từ quy trình và biến đổi phải thuộc cả **dạng V3**.",
        "Chưa đạt **Nghe** → làm lại **Ngày 13** (Part 4: từ tín hiệu mục 3, Practice 1 Note Completion mục 5, Practice 2 Summary + trắc nghiệm mục 6) và **Ngày 15** (sáu bẫy mục 2, Practice 1–2). Chưa đạt **Đọc** → làm lại **Ngày 14** (7 bước mục 2, luyện paraphrase mục 6).",
        "Chưa đạt **Viết** → **Ngày 14** (dàn ý 4 đoạn mục 3, khung câu mục 4–5) và **Ngày 15** (ngữ pháp mục 4e, 7; bài Từ vựng: động từ biến đổi + bài mẫu bản đồ Ashford mục 4–5, bài mẫu quy trình mục 8). Chưa đạt **Nói / Phát âm** → **Ngày 14** (mục 2–4, 8) và **Ngày 13** (mục Thêm). Chưa đạt **Ôn tổng** → ôn đúng Ngày ghi ở từng câu sai (khối 9b: mở lại đúng **mục chiến thuật** của bài Đọc / Viết / Nói Ngày đó). Ôn xong thì **làm lại đúng phần đó**.",
      ],
    },
    { t: "h", text: "Sẵn sàng thi Đề 1 — thi cuối Tập 1 trong phòng thi máy tính" },
    {
      t: "p",
      text: "**Đề 1** là bài thi cuối Tập 1, làm trong **Phòng thi máy tính** (mục 🖥️ **Online Test** ở trang khoá, đường dẫn `/language/en/ielts/thi-may`), đúng dạng IELTS trên máy: **Listening** (4 Part, 40 câu, ~30 phút + 2 phút kiểm đáp án) · **Reading** (3 bài, 40 câu, 60 phút) · **Writing** (Task 1 + Task 2, 60 phút). Độ khó đặt ở **band 3.5–4.5** — đúng tầm của người học hết Tập 1. **Speaking** không nằm trong Đề 1: làm riêng bằng các khối ghi âm Part 1–3 của Ngày 12 và Ngày 14 (AI chấm).",
    },
    {
      t: "sodo",
      kind: "flow",
      title: "Đường vào Đề 1",
      steps: [
        { label: "1. Đạt cả 9 phần của bài này", sub: "trượt phần nào thì ôn Ngày đó và làm lại phần đó trước" },
        { label: "2. Chọn một buổi trống 2 giờ 45 phút", sub: "điện thoại im lặng, tai nghe, giấy nháp, nước uống" },
        { label: "3. Mở Phòng thi máy → Đề 1 → chế độ thi đủ", sub: "làm liền Listening → Reading → Writing, không tạm dừng" },
        { label: "4. Nộp bài, đọc kết quả", sub: "điểm thô → band ước tính; AI chấm 2 bài viết theo 4 tiêu chí" },
        { label: "5. Ghi band từng kỹ năng vào sổ", sub: "band ≥ 4.0 mỗi kỹ năng ⇒ sang Tập 2; thấp hơn ⇒ ôn Ngày tương ứng rồi thi lại sau 1 tuần" },
      ],
      caption: "Đề 1 là thước đo thật đầu tiên. Kết quả thấp hơn mong đợi là bình thường — nó chỉ cho bạn biết chính xác cần ôn gì trước Tập 2.",
    },
    {
      t: "note",
      title: "Mẹo làm Đề 1 — gom từ cả Tập 1",
      items: [
        "**Listening**: đọc trước câu hỏi trong thời gian cho phép; viết đáp án ngay khi nghe; dạng điền — kiểm **giới hạn số từ** và **số nhiều**; bẫy **sửa lời** (Ngày 7, 15) và **con số mồi** (Ngày 13) xuất hiện ở mọi Part.",
        "**Reading**: 20 phút mỗi bài, **không** đọc hết bài trước — đọc câu hỏi, gạch từ khoá, dò vị trí (Ngày 2). TFNG: hỏi \"bài có nói ý này không?\" **trước** khi hỏi \"đúng hay ngược?\" (Ngày 12). Summary có hộp: chia hộp theo loại từ (Ngày 14).",
        "**Writing**: Task 1 **20 phút** (overview không số — Ngày 4, 12; quy trình dùng bị động — Ngày 15), Task 2 **40 phút** (mở bài 5 bước — Ngày 6; thân bài câu chủ đề – giải thích – ví dụ — Ngày 8; kết bài không ý mới — Ngày 10; Discussion đủ 3 nhiệm vụ — Ngày 14). Để lại **3 phút** soát -s, thì, mạo từ.",
        "**Trước ngày thi**: ngủ đủ, không học thêm từ mới. Đúng như lời giảng Ngày 13 — **routine matters as much as talent**.",
      ],
    },
  ],
};

export const NGAY_15: Lesson[] = [D15_GRAMMAR, D15_VOCAB, D15_LISTENING, D15_HOMEWORK, KIEM_TRA_3];
