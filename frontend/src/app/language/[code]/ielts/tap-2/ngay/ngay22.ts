/**
 * IELTS Tập 2 — Ngày 22 (chặng 4) — tự soạn 12/11/2026, không chép sách / đề thật.
 *   Bài 1 (vocab)   — Family, relationships & generations [VC17] + cụm động từ gia đình, họ từ · 🔊 (thêm) /ʌ/
 *   Bài 2 (reading) — Diagram label completion [R16] (+ ôn TFNG) — hệ thống thu nước mưa · tháp đón gió
 *   Bài 3 (writing) — Task 1 map: trước / sau, bị động quá khứ & hiện tại hoàn thành [W14]
 *   Bài tập         — 36 câu.
 */
import type { Lesson } from '../data';

/* ─────────────────────────── Bài 1 · Từ vựng ─────────────────────────── */

const T2D22_VOCAB: Lesson = {
  id: "t2d22-tu-vung",
  kind: "vocab",
  title: "Từ vựng: Gia đình, quan hệ & thế hệ (Family, relationships & generations)",
  goal: "Dùng đúng 20 từ + 10 cụm động từ chủ đề gia đình – thế hệ (relative, sibling, extended family, generation gap, bring up, get on with, look after…) và 10 cụm tính cách – giao tiếp (easy-going, a team player, make small talk…) để nói Part 1–3 và viết Task 2 về gia đình, người già, trẻ em (LR band 5).",
  minutes: 60,
  blocks: [
    {
      t: "recap",
      title: "Bài này học gì — đẩy band nào",
      items: [
        "**20 từ**: relative, sibling, nuclear / extended family, generation gap, upbringing, household chores, breadwinner, close-knit, in-laws…",
        "**10 cụm động từ**: bring up · grow up · look after · get on with · take after · look up to · fall out with · rely on · settle down · get together.",
        "**Họ từ**: relate → relationship / relative · depend → dependent / independent · responsible → responsibility.",
        "Chủ đề gia đình ra ở **Part 1** (Family), **Part 2** (Describe a family member you admire), **Part 3** (Ngày 21: gia đình xưa – nay), **Task 2** (người già sống với con cái? trẻ em có nên làm việc nhà?).",
        "Đẩy **LR**: thay “my family is happy / my mother is good” bằng từ cụ thể (**close-knit, supportive, strict, we get on well**).",
        "**Thêm 10 cụm tính cách – giao tiếp** (mục 4b): easy-going, outgoing, a workaholic, a team player, make small talk, keep in touch… — mỗi tính cách kèm một chuyện nhỏ chứng minh.",
      ],
    },

    /* ── 1 ── */
    { t: "h", text: "1. Các thành viên gia đình — nhìn hình" },
    {
      t: "hinh",
      title: "Chạm để nghe · bật Che nghĩa để tự kiểm tra",
      items: [
        { anh: "old-man", w: "grandfather", ro: "/ˈɡrænfɑːðə(r)/", vi: "ông" },
        { anh: "old-woman", w: "grandmother", ro: "/ˈɡrænmʌðə(r)/", vi: "bà" },
        { anh: "man", w: "father", ro: "/ˈfɑːðə(r)/", vi: "bố" },
        { anh: "woman", w: "mother", ro: "/ˈmʌðə(r)/", vi: "mẹ" },
        { anh: "boy", w: "son", ro: "/sʌn/", vi: "con trai" },
        { anh: "girl", w: "daughter", ro: "/ˈdɔːtə(r)/", vi: "con gái" },
        { anh: "baby", w: "baby", ro: "/ˈbeɪbi/", vi: "em bé" },
        { anh: "wedding", w: "wedding", ro: "/ˈwedɪŋ/", vi: "đám cưới" },
        { anh: "people-hugging", w: "hug", ro: "/hʌɡ/", vi: "cái ôm; ôm" },
        { anh: "house-with-garden", w: "home", ro: "/həʊm/", vi: "tổ ấm, nhà" },
      ],
    },
    {
      t: "sodo",
      kind: "mindmap",
      title: "Họ hàng — người Việt hay thiếu từ ở nhánh “họ”",
      caption: "Tiếng Anh không phân biệt bên nội / bên ngoại hay anh / em như tiếng Việt: uncle = chú, bác, cậu, dượng; cousin = anh chị em họ. Muốn rõ thì thêm: my mother's brother, my older cousin.",
      center: "**My family**",
      branches: [
        { label: "Gia đình gần", items: ["parents · siblings", "brother / sister", "older / younger"], anh: "people-hugging" },
        { label: "Ông bà – cháu", items: ["grandparents", "grandchildren", "grandson / granddaughter"], anh: "old-woman" },
        { label: "Họ hàng", items: ["uncle · aunt", "cousin", "nephew (cháu trai) · niece (cháu gái)"], anh: "busts-in-silhouette" },
        { label: "Qua hôn nhân", items: ["husband · wife", "in-laws", "mother-in-law · son-in-law"], anh: "ring" },
      ],
    },

    /* ── 2 ── */
    { t: "h", text: "2. 20 từ chủ đề gia đình – thế hệ" },
    {
      t: "vocab",
      items: [
        { w: "relative", pos: "n", ipa: "/ˈrelətɪv/", vi: "họ hàng, người thân", ex: "We visit our relatives in the countryside every Tet.", exVi: "Tết nào chúng tôi cũng về thăm họ hàng ở quê.", more: "**close / distant relatives** (họ gần / xa). = **relation**." },
        { w: "sibling", pos: "n", ipa: "/ˈsɪblɪŋ/", vi: "anh chị em ruột", ex: "I have two siblings: an older brother and a younger sister.", exVi: "Tôi có hai anh chị em ruột: một anh trai và một em gái.", more: "Part 1 hay hỏi: **Do you have any siblings?**" },
        { w: "nuclear family", pos: "n", ipa: "/ˌnjuːkliə ˈfæməli/", vi: "gia đình hạt nhân (bố mẹ + con)", ex: "Most young couples in cities now live in nuclear families.", exVi: "Phần lớn các cặp vợ chồng trẻ ở thành phố giờ sống theo gia đình hạt nhân." },
        { w: "extended family", pos: "n", ipa: "/ɪkˌstendɪd ˈfæməli/", vi: "đại gia đình (nhiều thế hệ, họ hàng)", ex: "In the past, three generations of an extended family often lived under one roof.", exVi: "Ngày xưa, ba thế hệ của một đại gia đình thường sống chung một mái nhà.", more: "**live under one roof** = sống chung một nhà." },
        { w: "generation", pos: "n", ipa: "/ˌdʒenəˈreɪʃn/", vi: "thế hệ", ex: "My grandparents' generation grew up without the internet.", exVi: "Thế hệ ông bà tôi lớn lên không có internet.", more: "**the younger / older generation** · **three generations**." },
        { w: "generation gap", pos: "n", ipa: "/ˌdʒenəˈreɪʃn ɡæp/", vi: "khoảng cách thế hệ", ex: "Social media has widened the generation gap in many families.", exVi: "Mạng xã hội đã nới rộng khoảng cách thế hệ trong nhiều gia đình.", more: "**widen / bridge the generation gap** (nới rộng / thu hẹp)." },
        { w: "upbringing", pos: "n", ipa: "/ˈʌpbrɪŋɪŋ/", vi: "sự nuôi dạy, giáo dưỡng", ex: "She had a strict upbringing in a traditional family.", exVi: "Cô ấy được nuôi dạy nghiêm khắc trong một gia đình truyền thống.", more: "Danh từ của **bring up** (mục 3)." },
        { w: "bond", pos: "n", ipa: "/bɒnd/", vi: "sự gắn bó, mối dây liên kết", ex: "There is a strong bond between my mother and her sisters.", exVi: "Mẹ tôi và các dì có sự gắn bó rất bền chặt.", more: "**a strong / close bond** · **strengthen the bond**." },
        { w: "household", pos: "n", ipa: "/ˈhaʊshəʊld/", vi: "hộ gia đình (những người sống chung một nhà)", ex: "The average household in Vietnam has three or four people.", exVi: "Hộ gia đình trung bình ở Việt Nam có ba đến bốn người.", more: "Hay dùng làm tính từ: **household income / appliances**." },
        { w: "household chores", pos: "n (pl)", ipa: "/ˌhaʊshəʊld ˈtʃɔːz/", vi: "việc nhà", ex: "Children should help with household chores such as washing up.", exVi: "Trẻ em nên phụ việc nhà như rửa bát.", more: "**do the chores** (~~make the chores~~) · = **housework** (không đếm được)." },
        { w: "breadwinner", pos: "n", ipa: "/ˈbredwɪnə(r)/", vi: "trụ cột kinh tế, người kiếm tiền chính", ex: "In many families today, both parents are breadwinners.", exVi: "Ở nhiều gia đình ngày nay, cả bố lẫn mẹ đều là trụ cột kinh tế.", more: "Task 2 về vai trò giới: **the main breadwinner**." },
        { w: "single-parent family", pos: "n", ipa: "/ˌsɪŋɡl ˌpeərənt ˈfæməli/", vi: "gia đình đơn thân", ex: "The number of single-parent families has risen in recent years.", exVi: "Số gia đình đơn thân đã tăng trong những năm gần đây." },
        { w: "elderly", pos: "adj", ipa: "/ˈeldəli/", vi: "cao tuổi (lịch sự hơn old)", ex: "Many elderly people live alone after their children move away.", exVi: "Nhiều người cao tuổi sống một mình sau khi con cái chuyển đi.", more: "**the elderly** = người cao tuổi nói chung (động từ số nhiều)." },
        { w: "independent", pos: "adj", ipa: "/ˌɪndɪˈpendənt/", vi: "tự lập, độc lập", ex: "Living in a dormitory helped me become more independent.", exVi: "Sống ở ký túc xá giúp tôi tự lập hơn.", more: "**independent of** sb · danh từ **independence** (Ngày 21: “a new kind of independence”)." },
        { w: "responsibility", pos: "n", ipa: "/rɪˌspɒnsəˈbɪləti/", vi: "trách nhiệm", ex: "Looking after a younger sibling teaches children responsibility.", exVi: "Trông em dạy trẻ tính trách nhiệm.", more: "**take responsibility for** sth · tính từ **responsible for**." },
        { w: "respect", pos: "v / n", ipa: "/rɪˈspekt/", vi: "tôn trọng; sự tôn trọng", ex: "In Vietnamese culture, children are expected to respect their elders.", exVi: "Trong văn hoá Việt, con cháu được kỳ vọng phải kính trọng người lớn.", more: "**show respect for / to** sb · **elders** = người lớn tuổi hơn." },
        { w: "supportive", pos: "adj", ipa: "/səˈpɔːtɪv/", vi: "luôn ủng hộ, quan tâm giúp đỡ", ex: "My parents were very supportive when I changed my major.", exVi: "Bố mẹ tôi rất ủng hộ khi tôi đổi ngành học." },
        { w: "strict", pos: "adj", ipa: "/strɪkt/", vi: "nghiêm khắc", ex: "My father was strict about homework but never shouted at us.", exVi: "Bố tôi nghiêm khắc chuyện bài vở nhưng chưa bao giờ quát chúng tôi.", more: "**strict with** sb · **strict about** sth." },
        { w: "close-knit", pos: "adj", ipa: "/ˌkləʊs ˈnɪt/", vi: "gắn bó khăng khít", ex: "I come from a close-knit family, so we eat dinner together every night.", exVi: "Tôi sinh ra trong một gia đình gắn bó, nên tối nào cả nhà cũng ăn cơm cùng nhau.", more: "**close** ở đây đọc /kləʊs/ (gần gũi), không phải /kləʊz/ (đóng)." },
        { w: "in-laws", pos: "n (pl)", ipa: "/ˈɪn lɔːz/", vi: "nhà chồng / nhà vợ (bố mẹ vợ/chồng…)", ex: "My aunt gets on very well with her in-laws.", exVi: "Dì tôi rất hợp với nhà chồng.", more: "**mother-in-law** (mẹ chồng / mẹ vợ) · số nhiều **mothers-in-law**." },
      ],
    },
    {
      t: "quiz",
      id: "t2d22-tv-dich",
      title: "Dịch sang tiếng Anh — từ chủ đề (5 câu)",
      kind: "translate",
      grammar: "Dùng đúng từ trong 💡.",
      items: [
        { q: "Tôi sinh ra trong một gia đình rất gắn bó.", hint: "I come from / grew up in, a very close-knit family", answers: ["I come from a very close-knit family.", "I grew up in a very close-knit family.", "I was born into a very close-knit family.", "I was born in a very close-knit family."] },
        { q: "Bạn có anh chị em ruột không?", hint: "Do you have any siblings?", answers: ["Do you have any siblings?", "Have you got any siblings?"] },
        { q: "Trẻ em nên giúp làm việc nhà.", hint: "Children should help with, household chores / housework", answers: ["Children should help with household chores.", "Children should help with the household chores.", "Children should help with housework.", "Children should help with the housework.", "Children should help with the chores.", "Children should do household chores."] },
        { q: "Có một khoảng cách thế hệ lớn giữa tôi và ông tôi.", hint: "There is a big generation gap, between my grandfather and me", answers: ["There is a big generation gap between my grandfather and me.", "There's a big generation gap between my grandfather and me.", "There is a big generation gap between me and my grandfather.", "There's a big generation gap between me and my grandfather.", "There is a wide generation gap between my grandfather and me.", "There is a big generation gap between my grandpa and me."] },
        { q: "Người cao tuổi nên được tôn trọng.", hint: "The elderly / Elderly people, should be respected", answers: ["The elderly should be respected.", "Elderly people should be respected.", "Old people should be respected.", "We should respect the elderly.", "We should respect elderly people."] },
      ],
    },

    /* ── 3 ── */
    { t: "h", text: "3. 10 cụm động từ về gia đình — hay nhất cho Speaking" },
    {
      t: "vocab",
      items: [
        { w: "bring up", pos: "phr v", ipa: "/brɪŋ ʌp/", vi: "nuôi dạy (con)", ex: "I was brought up by my grandparents in Hue.", exVi: "Tôi được ông bà nuôi lớn ở Huế.", more: "Hay dùng bị động **be brought up by**. ≠ **grow up** (tự lớn lên)." },
        { w: "grow up", pos: "phr v", ipa: "/ɡrəʊ ʌp/", vi: "lớn lên", ex: "I grew up in a small fishing village.", exVi: "Tôi lớn lên ở một làng chài nhỏ.", more: "Quá khứ **grew up**. ~~I was grown up in~~ là sai." },
        { w: "look after", pos: "phr v", ipa: "/lʊk ˈɑːftə(r)/", vi: "chăm sóc, trông nom", ex: "My mother looks after my grandmother, who is ninety.", exVi: "Mẹ tôi chăm sóc bà, năm nay chín mươi tuổi.", more: "= **take care of**." },
        { w: "get on (well) with", pos: "phr v", ipa: "/ɡet ɒn wɪð/", vi: "hợp, hoà thuận với", ex: "I get on really well with my older sister.", exVi: "Tôi rất hợp với chị gái.", more: "Mỹ: **get along with**. Part 1: **Who are you closest to in your family?**" },
        { w: "take after", pos: "phr v", ipa: "/teɪk ˈɑːftə(r)/", vi: "giống (bố mẹ, ông bà về tính cách / ngoại hình)", ex: "People say I take after my father — we're both very quiet.", exVi: "Mọi người bảo tôi giống bố — cả hai đều rất trầm." },
        { w: "look up to", pos: "phr v", ipa: "/lʊk ˈʌp tə/", vi: "ngưỡng mộ, kính trọng", ex: "I have always looked up to my grandmother.", exVi: "Tôi luôn ngưỡng mộ bà.", more: "Ăn điểm cho Part 2 **Describe a person you admire**." },
        { w: "fall out with", pos: "phr v", ipa: "/fɔːl ˈaʊt wɪð/", vi: "cãi nhau, giận nhau với", ex: "My cousins fell out with each other over a small piece of land.", exVi: "Mấy anh em họ của tôi giận nhau vì một mảnh đất nhỏ.", more: "Quá khứ **fell out**." },
        { w: "rely on", pos: "phr v", ipa: "/rɪˈlaɪ ɒn/", vi: "dựa vào, trông cậy vào", ex: "Many working parents rely on grandparents for childcare.", exVi: "Nhiều bố mẹ đi làm trông cậy vào ông bà để trông con.", more: "= **depend on** · **childcare** = việc trông trẻ." },
        { w: "settle down", pos: "phr v", ipa: "/ˌsetl ˈdaʊn/", vi: "ổn định (lập gia đình, an cư)", ex: "My parents want me to settle down before I turn thirty.", exVi: "Bố mẹ muốn tôi lập gia đình ổn định trước ba mươi tuổi." },
        { w: "get together", pos: "phr v", ipa: "/ɡet təˈɡeðə(r)/", vi: "tụ họp", ex: "Our whole family gets together at my grandparents' house at Tet.", exVi: "Cả nhà tôi tụ họp ở nhà ông bà vào dịp Tết.", more: "Danh từ **a get-together** (buổi họp mặt)." },
      ],
    },
    {
      t: "quiz",
      id: "t2d22-cum-dien",
      title: "Điền cụm động từ đúng dạng (8 câu)",
      kind: "fill",
      items: [
        { q: "I was ___ up by my aunt after my parents moved abroad.", answers: ["brought"], hint: "be brought up (bị động)" },
        { q: "She ___ up in Da Nang but now lives in Hanoi.", answers: ["grew"], hint: "grow up — quá khứ" },
        { q: "Who ___ after your little brother when your parents are at work?", answers: ["looks"], hint: "look after — hiện tại, who → ngôi 3" },
        { q: "I get ___ well with my mother-in-law.", answers: ["on", "along"], hint: "get ___ with" },
        { q: "He really takes ___ his grandfather — they're both great storytellers.", answers: ["after"], hint: "take ___ = giống" },
        { q: "I've always looked up ___ my older brother.", answers: ["to"], hint: "look up ___" },
        { q: "My sister and I ___ out last week, but we're friends again now.", answers: ["fell"], hint: "fall out — quá khứ" },
        { q: "The whole family ___ together every Sunday for lunch.", answers: ["gets", "get"], hint: "get together — hiện tại, the whole family → số ít (Anh-Anh đôi khi dùng get)" },
      ],
    },

    /* ── 4 ── */
    { t: "h", text: "4. Họ từ và câu mẫu ăn điểm" },
    {
      t: "table",
      caption: "Năm họ từ chủ đề gia đình",
      head: ["Động từ", "Danh từ", "Tính từ", "Ghi chú"],
      rows: [
        ["relate /rɪˈleɪt/", "relationship · relative · relation", "related (to)", "**relationship with** sb · **be related to** sb (có họ với)"],
        ["depend /dɪˈpend/", "dependence · independence", "dependent (on) · independent (of)", "**financially independent** (tự lập tài chính)"],
        ["marry /ˈmæri/", "marriage", "married (to)", "**get married to** sb (~~married with~~)"],
        ["—", "parent · parenting", "parental", "**parental support** · **good parenting**"],
        ["—", "responsibility", "responsible (for) · irresponsible", "**take responsibility for**"],
      ],
    },
    {
      t: "note",
      title: "Cẩn thận: ba lỗi người Việt hay gặp",
      items: [
        "~~She married with a doctor.~~ → She **married** a doctor. / She **got married to** a doctor.",
        "~~My family has 4 members.~~ — nghe như hội đồng quản trị. Tự nhiên hơn: There are **four people in my family**.",
        "**old people** dễ nghe thô — dùng **elderly people / older people / the elderly** trong bài viết và Part 3.",
      ],
    },
    {
      t: "examples",
      items: [
        { en: "In many Vietnamese families, grandparents play a key role in bringing up their grandchildren.", vi: "Ở nhiều gia đình Việt, ông bà đóng vai trò then chốt trong việc nuôi dạy cháu." },
        { en: "Living with three generations under one roof strengthens family bonds, but it can also lead to conflict.", vi: "Ba thế hệ sống chung một mái nhà làm gắn kết gia đình hơn, nhưng cũng có thể dẫn tới xung đột." },
        { en: "Children who do household chores tend to become more independent and responsible adults.", vi: "Trẻ làm việc nhà có xu hướng lớn lên thành người tự lập và có trách nhiệm hơn." },
        { en: "As more young people move to cities for work, the traditional extended family is gradually being replaced by the nuclear family.", vi: "Khi ngày càng nhiều người trẻ lên thành phố làm việc, đại gia đình truyền thống dần được thay bằng gia đình hạt nhân." },
      ],
    },
    {
      t: "rule",
      formula: "N + play(s) a key role in + V-ing · V-ing + strengthens + N, but it can also lead to + N · S + tend to + V",
      vi: "Ba khung câu dùng lại cho Task 2 và Part 3 về gia đình: vai trò, mặt lợi – mặt hại, xu hướng.",
    },
    {
      t: "mcq",
      id: "t2d22-tv-chon",
      title: "Chọn từ đúng (6 câu)",
      items: [
        { q: "My aunt ___ a teacher from Hue last year.", options: ["married with", "got married to", "married to", "was marry"], correct: 1, why: "**get married to** sb hoặc **marry** sb. ~~married with~~ là lỗi dịch từ “cưới với”." },
        { q: "Her ___ with her mother-in-law is not very good.", options: ["relative", "related", "relate", "relationship"], correct: 3, why: "Sau **Her** cần danh từ chỉ **mối quan hệ** → **relationship**. relative = người họ hàng." },
        { q: "After getting a job, he became financially ___.", options: ["independent", "independence", "depend", "dependence"], correct: 0, why: "Sau **became** cần tính từ → **independent**." },
        { q: "Most families in the city are ___ families, with just parents and children.", options: ["extended", "relative", "nuclear", "household"], correct: 2, why: "Chỉ bố mẹ + con = **nuclear** family." },
        { q: "It is the ___ of parents to keep their children safe.", options: ["responsible", "responsibility", "responsibly", "respond"], correct: 1, why: "Sau **the** + trước **of** → danh từ **responsibility**." },
        { q: "My grandparents are getting old, so my mother ___ them every day.", options: ["looks after", "takes after", "falls out with", "looks up to"], correct: 0, why: "Chăm sóc → **looks after**." },
      ],
    },

    /* ── 4b ── */
    { t: "h", text: "4b. Thêm: tính cách & giao tiếp — 10 cụm dễ dùng" },
    {
      t: "p",
      text: "Đề người (Part 2 “Describe a family member / a friend / a colleague”) và Part 1 Friends luôn cần **tả tính cách**. Đừng dừng ở “she is kind / he is nice”: chọn một cụm dưới đây rồi **kể một chuyện nhỏ chứng minh** (vd “she's a real team player — last year she stayed late to help me finish my project”). Kết hợp với get on with · fall out with · look up to ở mục 3.",
    },
    {
      t: "vocab",
      items: [
        { w: "easy-going", pos: "adj", ipa: "/ˌiːzi ˈɡəʊɪŋ/", vi: "dễ tính, thoải mái", ex: "My dad is very easy-going — he rarely gets angry.", exVi: "Bố tôi rất dễ tính — hiếm khi nổi giận.", more: "Gần nghĩa **laid-back** /ˌleɪd ˈbæk/ (thong thả, không vội). Trái nghĩa: **strict, uptight**." },
        { w: "outgoing", pos: "adj", ipa: "/ˈaʊtɡəʊɪŋ/", vi: "hướng ngoại, cởi mở", ex: "My cousin is so outgoing that she makes friends everywhere she goes.", exVi: "Em họ tôi hướng ngoại tới mức đi đâu cũng có bạn.", more: "Trái nghĩa: **shy, reserved** (kín đáo). ~~She is very outside.~~" },
        { w: "bad-tempered", pos: "adj", ipa: "/ˌbæd ˈtempəd/", vi: "nóng tính, dễ cáu", ex: "My grandfather can be a bit bad-tempered in the morning.", exVi: "Ông tôi buổi sáng hơi dễ cáu.", more: "Nói nhẹ đi bằng **a bit / can be**. Cũng: **lose your temper** = nổi nóng." },
        { w: "stubborn", pos: "adj", ipa: "/ˈstʌbən/", vi: "bướng bỉnh, cứng đầu", ex: "My little brother is too stubborn to admit he is wrong.", exVi: "Em trai tôi quá bướng nên không chịu nhận mình sai.", more: "Nói tích cực hơn: **determined** (quyết tâm). Đọc /ʌ/ như **mother** (mục 5)." },
        { w: "a workaholic", pos: "n", ipa: "/ə ˌwɜːkəˈhɒlɪk/", vi: "người nghiện việc", ex: "My mother is a workaholic — she even answers emails at dinner.", exVi: "Mẹ tôi là người nghiện việc — đến bữa tối cũng trả lời email.", more: "Trọng âm work-a-**HOL**-ic. Đuôi -aholic: **a chocoholic** (người mê sô-cô-la, đùa)." },
        { w: "a team player", pos: "n", ipa: "/ə ˈtiːm ˌpleɪə(r)/", vi: "người biết làm việc nhóm", ex: "Employers are looking for team players, not just clever individuals.", exVi: "Nhà tuyển dụng tìm người biết làm việc nhóm, không chỉ người giỏi riêng lẻ.", more: "Dùng được cả Task 2 (education, employment): **teamwork skills**." },
        { w: "a good listener", pos: "n", ipa: "/ə ɡʊd ˈlɪsnə(r)/", vi: "người biết lắng nghe", ex: "I always talk to my sister when I'm worried because she's a good listener.", exVi: "Tôi luôn tâm sự với chị khi lo lắng vì chị là người biết lắng nghe.", more: "Chữ **t** trong listen câm: /ˈlɪsn/." },
        { w: "make small talk", pos: "phrase", ipa: "/meɪk ˈsmɔːl tɔːk/", vi: "nói chuyện xã giao (thời tiết, chuyện vặt)", ex: "I'm not good at making small talk with people I don't know.", exVi: "Tôi không giỏi nói chuyện xã giao với người lạ.", more: "~~say small talk~~ · ~~do small talk~~. Luôn là **make**." },
        { w: "have a lot in common (with)", pos: "phrase", ipa: "/hæv ə lɒt ɪn ˈkɒmən/", vi: "có nhiều điểm chung (với)", ex: "My best friend and I have a lot in common — we both love football and cooking.", exVi: "Bạn thân và tôi có nhiều điểm chung — cả hai đều mê bóng đá và nấu ăn.", more: "Phủ định: **have nothing / little in common**." },
        { w: "keep in touch (with)", pos: "phrase", ipa: "/kiːp ɪn tʌtʃ/", vi: "giữ liên lạc (với)", ex: "I still keep in touch with my primary school friends through social media.", exVi: "Tôi vẫn giữ liên lạc với bạn tiểu học qua mạng xã hội.", more: "Cũng: **stay in touch** · **lose touch with** (mất liên lạc). Gọi điện: **call sb** (~~call to sb~~)." },
      ],
    },
    {
      t: "quiz",
      id: "t2d22-tinh-cach",
      title: "Tính cách & giao tiếp — điền một từ (5 câu)",
      kind: "fill",
      items: [
        { q: "She never worries about anything — she's really easy-___.", answers: ["going"], hint: "easy-going" },
        { q: "I find it hard to ___ small talk at parties.", answers: ["make"], hint: "___ small talk" },
        { q: "We've known each other for ten years because we have a lot in ___.", answers: ["common"], hint: "have a lot in ___" },
        { q: "After we graduated, we promised to keep in ___.", answers: ["touch"], hint: "keep in ___" },
        { q: "He works twelve hours a day, even at weekends — he's a real ___.", answers: ["workaholic"], hint: "người nghiện việc" },
      ],
    },

    /* ── 5 ── */
    { t: "h", text: "5. Thêm: phát âm /ʌ/ — mother, brother, cousin, son" },
    {
      t: "p",
      text: "Rất nhiều từ gia đình chứa nguyên âm **/ʌ/** — ngắn, miệng mở vừa, lưỡi thả lỏng, gần âm “ă” tiếng Việt: m**o**ther, br**o**ther, c**ou**sin, s**o**n, **u**ncle, c**ou**ple, y**ou**ng, l**o**ve. Chữ viết là **o** hoặc **ou** nên người Việt hay đọc nhầm thành “o” (~~mo-đờ~~) hay “âu”. Cặp dễ nhầm: **/ʌ/** (cup) – **/æ/** (cap, miệng mở to và bè hơn).",
    },
    {
      t: "phatam",
      id: "t2d22-phat-am",
      title: "Luyện phát âm — nguyên âm /ʌ/ trong từ gia đình",
      note: "Bấm “Nghe mẫu”, rồi “Đọc & chấm”. Giữ /ʌ/ ngắn và gọn; th trong mother, brother là /ð/ (rung đầu lưỡi giữa hai hàm răng).",
      items: [
        { text: "mother, brother, cousin", ipa: "mʌðə brʌðə kʌzn", vi: "/ʌ/ viết bằng o, ou" },
        { text: "son, sun, uncle", ipa: "sʌn sʌn ʌŋkl", vi: "son và sun đọc GIỐNG nhau" },
        { text: "cup, cap", ipa: "kʌp kæp", vi: "/ʌ/ ngắn gọn · /æ/ mở bè" },
        { text: "a young couple", ipa: "ə jʌŋ kʌpl", vi: "young · couple" },
        { text: "My cousin is my uncle's son.", ipa: "maɪ kʌzn ɪz maɪ ʌŋklz sʌn", vi: "ba lần /ʌ/" },
        { text: "My brother and his young son love football.", ipa: "maɪ brʌðə ənd hɪz jʌŋ sʌn lʌv fʊtbɔːl", vi: "brother · young · son · love" },
        { text: "Some couples have one child.", ipa: "sʌm kʌplz hæv wʌn tʃaɪld", vi: "some · couples · one — ba lần /ʌ/" },
        { text: "My mother's country is lovely in summer.", ipa: "maɪ mʌðəz kʌntri ɪz lʌvli ɪn sʌmə", vi: "mother · country · lovely · summer" },
      ],
    },
  ],
};

/* ─────────────────────────── Bài 2 · Đọc ─────────────────────────── */

const T2D22_READING: Lesson = {
  id: "t2d22-doc",
  kind: "reading",
  title: "Diagram label completion — điền nhãn sơ đồ",
  goal: "Điền đúng nhãn cho sơ đồ một thiết bị / công trình: đọc sơ đồ trước, tìm đoạn mô tả, dùng ngôn ngữ vị trí (at the top of, attached to, beneath…) để khớp từng ô, chép đúng chính tả trong giới hạn từ — Reading band 5: ≥ 4/5 nhãn đúng.",
  minutes: 65,
  blocks: [
    {
      t: "recap",
      title: "Bài này học gì — đẩy band nào",
      items: [
        "**Diagram label completion**: đề cho một **sơ đồ** (máy móc, công trình, hiện tượng tự nhiên) có ô trống; bạn điền **từ lấy trong bài đọc**.",
        "Thông tin cho sơ đồ thường nằm **gọn trong 1–2 đoạn mô tả**, nhưng thứ tự câu hỏi **có thể không** theo thứ tự bài — đọc đoạn đó thật kỹ.",
        "Chìa khoá là **ngôn ngữ vị trí và chuyển động**: at the top / base of · attached to · connected to · beneath · flows into · passes through.",
        "Nhãn gần như luôn là **danh từ / cụm danh từ**, chép **đúng chính tả** trong bài, đúng **giới hạn từ** (ONE WORD ONLY / NO MORE THAN TWO WORDS).",
        "Dạng này hay đi cùng bài **khoa học – công nghệ** (Passage 1–2). Hôm nay ôn thêm **TFNG** ở bài 2 (Tập 2 Ngày 6).",
      ],
    },

    /* ── 1 ── */
    { t: "h", text: "1. Năm bước làm Diagram label completion" },
    {
      t: "sodo",
      kind: "flow",
      title: "Từ sơ đồ → đoạn văn → nhãn",
      steps: [
        { label: "1 · Đọc sơ đồ trước (1 phút)", sub: "Nó là gì? Phần nào ĐÃ có nhãn (đó là “mỏ neo” để dò bài)? Mũi tên chỉ dòng nước / khí đi đâu?" },
        { label: "2 · Đoán loại từ cho mỗi ô", sub: "Gần như luôn là danh từ: một bộ phận (pipe, filter), một chất (water, air), một nơi (room, channel)." },
        { label: "3 · Tìm đoạn mô tả", sub: "Dò tên thiết bị và các nhãn mỏ neo → thường là 1–2 đoạn liền nhau." },
        { label: "4 · Khớp từng ô bằng từ vị trí", sub: "Ô nằm TRÊN cái bể → tìm câu có above / on top of / near the top of the tank." },
        { label: "5 · Chép đúng & đếm từ", sub: "Đúng chính tả như bài; không thêm mạo từ khi giới hạn ONE WORD; số ít / nhiều theo bài." },
      ],
    },
    {
      t: "table",
      caption: "Ngôn ngữ vị trí và chuyển động — gặp trong mọi bài mô tả thiết bị",
      head: ["Nhóm", "Từ / cụm", "Nghĩa"],
      rows: [
        ["Vị trí trên – dưới", "at the top of · on top of · above · at the base / bottom of · beneath · underneath · below", "ở đỉnh · trên đỉnh · phía trên · ở chân / đáy · bên dưới"],
        ["Bên cạnh – bên trong", "next to · beside · alongside · inside · within · surrounding", "cạnh · bên cạnh · dọc theo · bên trong · bao quanh"],
        ["Gắn – nối", "attached to · fixed to · connected to · linked to · joins", "gắn vào · cố định vào · nối với"],
        ["Chuyển động", "flows into · runs down · passes through · enters · leaves · is pushed / pulled", "chảy vào · chảy xuống · đi qua · vào · ra · bị đẩy / hút"],
        ["Bộ phận hay gặp", "pipe · tube · tank · chamber · shaft · opening · vent · valve · filter · pump", "ống · ống nhỏ · bể · buồng · ống đứng / giếng · lỗ mở · lỗ thông · van · bộ lọc · máy bơm"],
      ],
    },
    {
      t: "vocab",
      items: [
        { w: "pipe", pos: "n", ipa: "/paɪp/", vi: "ống (dẫn nước, khí)", ex: "Water runs down a pipe into the tank.", exVi: "Nước chảy xuống theo một ống vào bể.", more: "**downpipe** = ống thoát nước mưa thẳng đứng · **overflow pipe** = ống tràn." },
        { w: "tank", pos: "n", ipa: "/tæŋk/", vi: "bể, thùng chứa", ex: "The storage tank holds 2,000 litres of water.", exVi: "Bể chứa chứa được 2.000 lít nước." },
        { w: "filter", pos: "n / v", ipa: "/ˈfɪltə(r)/", vi: "bộ lọc; lọc", ex: "A mesh filter removes leaves and insects.", exVi: "Một tấm lưới lọc loại bỏ lá và côn trùng.", more: "**mesh** /meʃ/ = lưới mắt nhỏ." },
        { w: "shaft", pos: "n", ipa: "/ʃɑːft/", vi: "ống đứng, giếng (thẳng đứng, dài)", ex: "Cool air moves down the shaft into the house.", exVi: "Khí mát di chuyển xuống theo ống đứng vào nhà.", more: "**lift shaft** (giếng thang máy) · **mine shaft** (giếng mỏ)." },
        { w: "opening", pos: "n", ipa: "/ˈəʊpnɪŋ/", vi: "lỗ mở, khe hở", ex: "Wind enters through openings at the top of the tower.", exVi: "Gió vào qua các lỗ mở trên đỉnh tháp." },
        { w: "vent", pos: "n", ipa: "/vent/", vi: "lỗ thông hơi", ex: "Warm air escapes through vents in the ceiling.", exVi: "Khí nóng thoát ra qua các lỗ thông hơi trên trần." },
        { w: "underground", pos: "adj / adv", ipa: "/ˈʌndəɡraʊnd/ (adj) · /ˌʌndəˈɡraʊnd/ (adv)", vi: "dưới mặt đất, ngầm", ex: "An underground channel carries water from the mountains.", exVi: "Một kênh ngầm dẫn nước từ núi về.", more: "**channel** /ˈtʃænl/ = kênh, rãnh dẫn nước." },
      ],
    },

    /* ── 2 ── */
    { t: "h", text: "2. Practice 1 — Questions 1–6: Collecting rainwater at home" },
    {
      t: "passage",
      title: "Collecting rainwater at home",
      intro: "Bài mô tả ngắn (khoảng 250 từ). Đọc sơ đồ TRƯỚC, rồi mới đọc bài.",
      paras: [
        { label: "A", text: "In many parts of Vietnam, heavy rain falls for several months of the year, yet some households still pay for tap water or buy it in large bottles. A simple rainwater collection system can reduce these costs, and it requires no complicated technology." },
        { label: "B", text: "The system begins at the roof. When rain falls, it runs down the sloping roof into a gutter, a narrow open channel fixed along the lower edge of the roof. The gutter carries the water to one corner of the house, where it flows into a vertical downpipe. Before the water reaches the storage tank, it passes through a mesh filter, which sits on top of the tank and stops leaves, dust and insects from getting in." },
        { label: "C", text: "The storage tank itself is usually made of plastic or stainless steel. It is placed next to the house on a flat concrete base, which must be strong enough to support the weight of the water — a full 2,000-litre tank weighs about two tonnes. When the tank is full, any extra water leaves through an overflow pipe near the top of the tank and drains away into the garden." },
        { label: "D", text: "Water is taken out through a tap at the bottom of the tank, which can be used to water plants or wash a motorbike. To send the water into the house, a small electric pump is fixed beside the tank. Experts recommend boiling rainwater before drinking it, as the roof itself may not be completely clean." },
      ],
    },
    {
      t: "figure",
      fig: {
        kind: "map",
        title: "A rooftop rainwater collection system",
        note: "Sơ đồ tự vẽ cho bài luyện — điền nhãn 1–6. Mũi tên: nước đi từ mái → bể.",
        map: {
          cols: 12,
          rows: 10,
          boxes: [
            { x: 0.4, y: 0.4, w: 6.4, h: 2.2, label: "Roof" },
            { x: 0.4, y: 2.6, w: 6.4, h: 0.6, blank: "1" },
            { x: 6.8, y: 2.4, w: 0.8, h: 3.4, blank: "2" },
            { x: 6.2, y: 5.6, w: 3.2, h: 0.7, blank: "3" },
            { x: 6.2, y: 6.3, w: 3.2, h: 2.5, label: "Storage tank" },
            { x: 9.4, y: 5.8, w: 2.4, h: 0.6, blank: "4" },
            { x: 9.8, y: 6.6, w: 1.8, h: 1.2, blank: "5" },
            { x: 9.4, y: 8.0, w: 0.9, h: 0.6, label: "Tap" },
            { x: 6.0, y: 8.8, w: 3.6, h: 0.8, blank: "6" },
            { x: 0.4, y: 3.4, w: 5.4, h: 6.2, label: "House" },
          ],
          pins: [{ x: 6.6, y: 1.6, label: "rain ↓" }],
        },
      },
    },
    {
      t: "p",
      text: "**Questions 1–6.** Label the diagram. Choose **NO MORE THAN TWO WORDS** from the passage for each answer. (Ô 1 dọc mép dưới mái · ô 2 ống đứng · ô 3 trên nắp bể · ô 4 gần đỉnh bể, chảy ra vườn · ô 5 cạnh bể, đưa nước vào nhà · ô 6 dưới đáy bể.)",
    },
    {
      t: "quiz",
      id: "t2d22-doc-p1",
      title: "Questions 1–6 — NO MORE THAN TWO WORDS",
      kind: "fill",
      items: [
        { q: "(1) kênh hở dọc mép dưới của mái", answers: ["gutter"], hint: "đoạn B — along the lower edge of the roof" },
        { q: "(2) ống thẳng đứng dẫn nước xuống", answers: ["downpipe", "vertical downpipe"], hint: "đoạn B — vertical" },
        { q: "(3) đặt trên nắp bể, chặn lá và côn trùng", answers: ["mesh filter", "filter"], hint: "đoạn B — sits on top of the tank" },
        { q: "(4) gần đỉnh bể, xả nước thừa ra vườn", answers: ["overflow pipe"], hint: "đoạn C — near the top of the tank" },
        { q: "(5) gắn cạnh bể, đưa nước vào nhà", answers: ["electric pump", "pump"], hint: "đoạn D — beside the tank" },
        { q: "(6) nền phẳng dưới đáy bể", answers: ["concrete base", "base"], hint: "đoạn C — flat … on which the tank is placed" },
      ],
    },
    {
      t: "note",
      title: "Giải thích Practice 1",
      items: [
        "**(1) gutter** — “runs down the sloping roof into **a gutter**, a narrow open channel **fixed along the lower edge of the roof**”. Đúng vị trí ô 1. (Không chọn ~~channel~~ — đó là lời giải thích của gutter.)",
        "**(2) (vertical) downpipe** — “flows into **a vertical downpipe**” = ống đứng ở góc nhà.",
        "**(3) (mesh) filter** — “a **mesh filter**, which **sits on top of the tank**” — từ vị trí **on top of** khớp ô 3.",
        "**(4) overflow pipe** — “leaves through **an overflow pipe near the top of the tank** and drains away into the garden”. Bẫy **tap** — tap ở **đáy** bể (at the bottom).",
        "**(5) (electric) pump** — “**a small electric pump** is fixed **beside the tank**”. small electric pump = 3 từ → chỉ viết **electric pump** hoặc **pump**.",
        "**(6) (concrete) base** — “placed next to the house on **a flat concrete base**”. flat concrete base = 3 từ → **concrete base**.",
      ],
    },

    /* ── 3 ── */
    { t: "h", text: "3. Practice 2 — Questions 7–15: The windcatcher (dạng Passage 1)" },
    {
      t: "canh",
      anh: ["desert", "classical-building", "wind-face", "droplet"],
      caption: "Ở những thành phố sa mạc nóng như thiêu, người xưa làm mát nhà mà không cần điện — bằng những ngọn tháp đón gió trên mái nhà.",
    },
    {
      t: "passage",
      title: "The windcatcher: air conditioning without electricity",
      intro: "Khoảng 460 từ. Thời gian gợi ý: 13 phút cho bài và 9 câu hỏi.",
      paras: [
        { label: "A", text: "Long before electric air conditioners were invented, people living in the hot, dry regions of the Middle East had found a way to keep their homes cool. Their solution was the windcatcher, a tall tower built on the roof of a house. Nobody knows exactly where the first windcatchers were built, but towers with a similar purpose appear in paintings from ancient Egypt, and the design was later developed to a very high level in Persia, which is now Iran." },
        { label: "B", text: "The city of Yazd, in the centre of Iran, is sometimes called 'the city of windcatchers' because of the hundreds of towers that rise above its old houses. Most are between five and ten metres high, but the tallest, which stands in a historic garden in the city, is more than thirty metres high. Their height matters, because wind blows faster and carries less dust higher above the ground." },
        { label: "C", text: "The way a windcatcher works is simple. At the top of the tower there are several openings that face different directions. When the wind blows, it enters the openings on the side facing the wind and is pushed down a vertical shaft inside the tower. This shaft leads the moving air into the rooms below, where it creates a pleasant breeze. At the same time, warm air inside the house, which is lighter than cool air, rises and escapes through vents high up in the walls of the main room, so the air in the house is constantly replaced." },
        { label: "D", text: "The most effective windcatchers were combined with water. In some houses, the shaft continued down into a basement, a room built partly below the ground where the temperature stays low even in summer. Beneath the basement ran an underground channel carrying cool water from the distant mountains. As the air passed over this water, it lost heat, so the air that finally reached the living rooms was noticeably cooler than the air outside. Families often rested in the basement during the hottest hours of the day." },
        { label: "E", text: "A windcatcher needs no electricity and produces no pollution, and it has almost no moving parts that can break. Its main disadvantages are that it works poorly on days without wind and that the openings can let in dust and insects unless they are covered with fine nets." },
        { label: "F", text: "In recent years, architects have shown new interest in this ancient technology. Modern versions, built from metal and plastic rather than mud brick, have been added to schools, offices and shopping centres in several countries, including some with cool climates, where they are used to bring fresh air into crowded buildings. Supporters say that such designs could help to reduce the huge amount of energy used for air conditioning around the world." },
      ],
    },
    {
      t: "figure",
      fig: {
        kind: "map",
        title: "How a traditional windcatcher cools a house",
        note: "Sơ đồ tự vẽ cho bài luyện (mặt cắt đứng) — điền nhãn 7–11.",
        map: {
          cols: 12,
          rows: 10,
          boxes: [
            { x: 5, y: 0.2, w: 2.2, h: 0.8, blank: "7" },
            { x: 5, y: 1, w: 2.2, h: 2.6, blank: "8" },
            { x: 0.6, y: 3.0, w: 1.6, h: 0.6, blank: "9" },
            { x: 0.6, y: 3.6, w: 10.8, h: 2.6, label: "Living room" },
            { x: 0.6, y: 6.4, w: 10.8, h: 1.8, blank: "10" },
            { x: 0.2, y: 8.6, w: 11.6, h: 1, blank: "11" },
          ],
          pins: [
            { x: 2.8, y: 0.6, label: "wind →" },
            { x: 0.9, y: 2.4, label: "warm air ↑" },
          ],
        },
      },
    },
    {
      t: "p",
      text: "**Questions 7–11.** Label the diagram. Choose **ONE WORD ONLY** from the passage for each answer.",
    },
    {
      t: "quiz",
      id: "t2d22-doc-p2-nhan",
      title: "Questions 7–11 — ONE WORD ONLY",
      kind: "fill",
      items: [
        { q: "(7) phần trên cùng của tháp — gió đi vào ở đây", answers: ["openings"], hint: "đoạn C — At the top of the tower there are several…" },
        { q: "(8) ống thẳng đứng bên trong tháp", answers: ["shaft"], hint: "đoạn C — a vertical … inside the tower" },
        { q: "(9) trên cao ở tường phòng chính — khí nóng thoát ra", answers: ["vents"], hint: "đoạn C — escapes through … high up in the walls" },
        { q: "(10) phòng xây một phần dưới mặt đất", answers: ["basement"], hint: "đoạn D — a room built partly below the ground" },
        { q: "(11) kênh dẫn nước mát nằm dưới cùng", answers: ["channel"], hint: "đoạn D — an underground … carrying cool water" },
      ],
    },
    {
      t: "p",
      text: "**Questions 12–15.** Do the following statements agree with the information given in the passage? Choose **TRUE**, **FALSE** or **NOT GIVEN**. (Ôn TFNG — dạng hỏi THÔNG TIN, không phải quan điểm như YNNG ở Ngày 20.)",
    },
    {
      t: "mcq",
      id: "t2d22-doc-p2-tfng",
      title: "Questions 12–15",
      items: [
        { q: "(12) Windcatchers were first used in ancient Egypt.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 2, why: "Đoạn A: “**Nobody knows exactly** where the first windcatchers were built” — tranh Ai Cập cổ chỉ cho thấy các tháp “with a similar purpose”, bài không xác nhận cũng không phủ nhận Ai Cập là nơi đầu tiên → **NOT GIVEN**." },
        { q: "(13) The tallest windcatcher in Yazd is over thirty metres high.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 0, why: "Đoạn B: “the tallest… is **more than thirty metres** high” → over thirty metres = more than thirty metres → **TRUE**." },
        { q: "(14) A windcatcher works equally well whether or not there is wind.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 1, why: "Đoạn E: “it **works poorly on days without wind**” → mâu thuẫn → **FALSE**." },
        { q: "(15) Modern windcatchers are only built in countries with hot climates.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 1, why: "Đoạn F: “in several countries, **including some with cool climates**” → câu đề có từ **only** bị bác bỏ → **FALSE**." },
      ],
    },
    {
      t: "note",
      title: "Nhìn lại — bài học từ Practice 2",
      items: [
        "Nhãn 7–11 đều nằm trong **đoạn C–D**: đó là “đoạn mô tả” — đọc kỹ hai đoạn đó, các đoạn còn lại chỉ đọc lướt cho câu TFNG.",
        "**(9) vents** là ô khó: nó không đi theo dòng khí mát mà theo **khí nóng** (warm air… escapes through vents **high up in the walls**). Mũi tên trên sơ đồ giúp bạn biết đang theo dòng khí nào.",
        "**(10) basement** — bài **định nghĩa** luôn: “a basement, **a room built partly below the ground**”. Đề hay dựa vào câu định nghĩa kiểu “X, a … that …”.",
        "Chép đúng chính tả: **shaft** (không phải ~~shalf~~), **basement**, **channel** (hai n).",
      ],
    },
  ],
};

/* ─────────────────────────── Bài 3 · Viết ─────────────────────────── */

const T2D22_WRITING: Lesson = {
  id: "t2d22-viet",
  kind: "writing",
  title: "Task 1 map — so sánh trước / sau, bị động quá khứ",
  goal: "Viết trọn một bài Task 1 hai bản đồ ≥ 150 từ: lập bảng thay đổi, viết tổng quan xu hướng chung, mô tả theo vùng bằng ngôn ngữ phương hướng, chọn đúng thì (quá khứ đơn bị động khi cả hai năm đều đã qua; HTHT bị động khi so với “today”) — TA · CC · LR · GRA band 5.",
  minutes: 70,
  blocks: [
    {
      t: "recap",
      title: "Bài này học gì — đẩy band nào",
      items: [
        "Dạng **map** (bản đồ): hai bản đồ cùng một nơi ở **hai thời điểm** — mô tả cái gì **mới**, cái gì **mất**, cái gì **đổi**, cái gì **giữ nguyên**. Tập 1 Ngày 15 đã gặp; hôm nay viết **trọn bài band 5**.",
        "**Chọn thì theo năm**: 2000 và **2020** (cả hai đã qua) → **quá khứ đơn bị động** (was built, were demolished). 2000 và **today / now** → **HTHT bị động** (has been built).",
        "Bố cục: Mở bài → **Tổng quan** (xu hướng chung: hiện đại hơn, ít cây xanh hơn…) → Thân 1 (một nửa bản đồ) → Thân 2 (nửa còn lại).",
        "Ngôn ngữ **phương hướng**: in the north-west of · to the east of · opposite · next to · at the southern end of.",
        "Band 5 cần: đủ các thay đổi chính, có tổng quan, bị động phần lớn đúng, ≥ 150 từ.",
        "Nâng cấp (mục 3b–3c): tổng quan **“underwent a number of changes, the most important of which…”**, gói hai thay đổi bằng **replacing / with + N / there used to be… but**, tả **đúng như hình** + mỗi thay đổi kèm vị trí; biến thể **chọn địa điểm S1 / S2** (hiện tại đơn + would / could).",
      ],
    },

    /* ── 1 ── */
    { t: "h", text: "1. Đề bài và hai bản đồ" },
    {
      t: "p",
      text: "**Đề:** The maps below show the centre of the town of Westbrook in 2000 and in 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words. — Phía **bắc** ở trên cùng. Nhìn từng ô: cái gì giữ nguyên, cái gì mất, cái gì mới.",
    },
    {
      t: "figure",
      fig: {
        kind: "map",
        title: "Westbrook town centre — 2000",
        note: "Bản đồ tự đặt cho bài luyện. Phía Bắc ở trên cùng.",
        map: {
          cols: 12,
          rows: 10,
          paths: [{ x: 0.2, y: 4.4, w: 11.6, h: 1.1, label: "Main Street (cars)" }],
          boxes: [
            { x: 0.4, y: 0.4, w: 3.6, h: 3.6, label: "Market" },
            { x: 4.3, y: 0.4, w: 3.6, h: 3.6, label: "Houses" },
            { x: 8.2, y: 0.4, w: 3.4, h: 3.6, label: "Park" },
            { x: 0.4, y: 5.9, w: 3.6, h: 3.6, label: "Bus station" },
            { x: 4.3, y: 5.9, w: 3.6, h: 3.6, label: "Car park" },
            { x: 8.2, y: 5.9, w: 3.4, h: 3.6, label: "Factory" },
          ],
        },
      },
    },
    {
      t: "figure",
      fig: {
        kind: "map",
        title: "Westbrook town centre — 2020",
        note: "Bản đồ tự đặt cho bài luyện. Phía Bắc ở trên cùng.",
        map: {
          cols: 12,
          rows: 10,
          paths: [{ x: 0.2, y: 4.4, w: 11.6, h: 1.1, label: "Main Street (pedestrians only)" }],
          boxes: [
            { x: 0.4, y: 0.4, w: 3.6, h: 3.6, label: "Shopping centre" },
            { x: 4.3, y: 0.4, w: 3.6, h: 3.6, label: "Apartments" },
            { x: 8.2, y: 0.4, w: 3.4, h: 3.6, label: "Park" },
            { x: 10, y: 0.6, w: 1.4, h: 1.2, label: "Café" },
            { x: 0.4, y: 5.9, w: 3.6, h: 3.6, label: "Library" },
            { x: 4.3, y: 5.9, w: 3.6, h: 3.6, label: "Square" },
            { x: 8.2, y: 5.9, w: 3.4, h: 3.6, label: "Bus station" },
          ],
        },
      },
    },
    {
      t: "table",
      caption: "Bước 1 — lập bảng thay đổi (2 phút) trước khi viết",
      head: ["Vị trí", "2000", "2020", "Động từ dùng"],
      rows: [
        ["Tây bắc (north-west)", "Market", "Shopping centre", "**was replaced by / was turned into**"],
        ["Giữa phía bắc", "Houses", "Apartments", "**were demolished** and apartments **were built**"],
        ["Đông bắc (north-east)", "Park", "Park + Café", "**remained**; a café **was added**"],
        ["Tây nam (south-west)", "Bus station", "Library", "**was relocated to** the south-east; a library **was built** on the site"],
        ["Giữa phía nam", "Car park", "Square", "**was converted into** a square"],
        ["Đông nam (south-east)", "Factory", "Bus station", "**was knocked down**; the bus station **was moved** there"],
        ["Main Street", "cars", "pedestrians only", "**was pedestrianised** (closed to traffic)"],
      ],
    },

    /* ── 2 ── */
    { t: "h", text: "2. Chọn thì: quá khứ đơn bị động hay HTHT bị động?" },
    {
      t: "sodo",
      kind: "compare",
      title: "Nhìn năm thứ hai trong đề",
      cols: [
        {
          title: "Hai mốc **đều trong quá khứ** (2000 – 2020)",
          anh: "spiral-calendar",
          items: [
            "→ **quá khứ đơn bị động**: was / were + V3",
            "Between 2000 and 2020, the market **was replaced by** a shopping centre.",
            "By 2020, the houses **had been demolished** (band 6+ — quá khứ hoàn thành, nhận ra là đủ).",
          ],
        },
        {
          title: "Mốc sau là **today / now / at present**",
          anh: "alarm-clock",
          items: [
            "→ **HTHT bị động**: has / have been + V3",
            "Since 2005, the market **has been replaced by** a shopping centre.",
            "Trạng thái hiện tại: There **is** now a library …",
          ],
        },
      ],
    },
    {
      t: "table",
      caption: "Động từ biến đổi cho bản đồ — dạng bị động",
      head: ["Ý", "Động từ", "Ví dụ (quá khứ đơn bị động)"],
      rows: [
        ["Xây mới", "build · construct · add · open", "A café **was added** in the corner of the park."],
        ["Phá bỏ", "demolish · knock down · pull down · remove", "The factory **was knocked down**."],
        ["Thay bằng cái khác", "replace (by / with) · convert / turn into", "The car park **was converted into** a square."],
        ["Dời đi", "relocate · move", "The bus station **was relocated to** the south-east."],
        ["Mở rộng / thu hẹp", "extend · expand · enlarge · reduce", "The road **was extended** to the river."],
        ["Cấm xe", "pedestrianise · close to traffic", "Main Street **was pedestrianised**."],
        ["Giữ nguyên (chủ động!)", "remain (unchanged) · stay the same", "The park **remained** in the north-east."],
      ],
    },
    {
      t: "note",
      title: "Cẩn thận: remain KHÔNG có bị động",
      items: [
        "~~The park was remained.~~ → The park **remained** (unchanged). remain là nội động từ — không có tân ngữ nên không có bị động (giống happen, Tập 1 Ngày 15).",
        "**replace A with B** (chủ động) = **A was replaced by / with B** (bị động). Đừng đảo: ~~A shopping centre was replaced by the market~~ (sai nghĩa: thành ra chợ là cái mới).",
        "**relocate** = dời **chỗ** của cùng một thứ; **replace** = **thứ khác** chiếm chỗ.",
      ],
    },
    {
      t: "table",
      caption: "Ngôn ngữ phương hướng và vị trí",
      head: ["Muốn nói", "Cụm từ"],
      rows: [
        ["Một vùng của bản đồ", "**in the north / south-west** of the town centre · **in the north-eastern corner**"],
        ["So với một vật khác", "**to the east of** the park · **opposite** the library · **next to / beside** the square"],
        ["in ≠ to", "**in the north of** the town = nằm TRONG thị trấn, ở phần phía bắc · **to the north of** the town = nằm NGOÀI thị trấn, về phía bắc"],
        ["Hai bên đường", "**on the northern side of** Main Street · **on both sides of** the road"],
        ["Đầu / cuối", "**at the western end of** Main Street"],
      ],
    },
    {
      t: "rule",
      formula: "In [year], the [vị trí] was + N, but by [year] it had been / (between …) it was + V3 (replaced by / converted into / relocated to) + N. · N + remained (unchanged).",
      vi: "Khung câu bản đồ hai mốc quá khứ: vị trí + quá khứ đơn bị động; giữ nguyên dùng remained (chủ động).",
    },
    {
      t: "quiz",
      id: "t2d22-viet-dich",
      title: "Dịch sang tiếng Anh — câu bản đồ (5 câu)",
      kind: "translate",
      grammar: "Hai mốc quá khứ → was/were + V3 · today → has/have been + V3 · remained (không bị động) · in the north of / to the east of.",
      items: [
        { q: "Khu chợ ở phía tây bắc đã được thay bằng một trung tâm mua sắm. (2000 → 2020)", hint: "The market in the north-west, was replaced by, a shopping centre", answers: ["The market in the north-west was replaced by a shopping centre.", "The market in the northwest was replaced by a shopping centre.", "The market in the north-west was replaced with a shopping centre.", "The market in the north-west was turned into a shopping centre.", "The market in the north-west was converted into a shopping centre."] },
        { q: "Nhà máy đã bị phá bỏ. (2000 → 2020)", hint: "The factory, was demolished / was knocked down", answers: ["The factory was demolished.", "The factory was knocked down.", "The factory was pulled down."] },
        { q: "Bến xe buýt đã được dời sang phía đông nam. (2000 → 2020)", hint: "The bus station, was relocated / moved, to the south-east", answers: ["The bus station was relocated to the south-east.", "The bus station was moved to the south-east.", "The bus station was relocated to the southeast.", "The bus station was moved to the southeast."] },
        { q: "Công viên vẫn giữ nguyên.", hint: "The park, remained unchanged / stayed the same", answers: ["The park remained unchanged.", "The park remained the same.", "The park stayed the same.", "The park has remained unchanged.", "The park did not change."] },
        { q: "Một thư viện mới đã được xây ở chỗ bến xe cũ. (today)", hint: "A new library, has been built, on the site of the old bus station", answers: ["A new library has been built on the site of the old bus station.", "A new library has been built where the old bus station was.", "A new library has been constructed on the site of the old bus station.", "A new library has been built in place of the old bus station."] },
      ],
    },

    /* ── 3 ── */
    { t: "h", text: "3. Bài mẫu — Westbrook 2000 và 2020" },
    {
      t: "examples",
      items: [
        { en: "The maps illustrate how the centre of Westbrook changed between 2000 and 2020.", vi: "[Mở bài] Hai bản đồ minh hoạ trung tâm Westbrook đã thay đổi thế nào từ năm 2000 đến 2020." },
        { en: "Overall, the town centre became more modern and more pedestrian-friendly, as most of the older buildings were replaced and cars were removed from the main street. Only the park remained largely the same.", vi: "[Tổng quan] Nhìn chung, trung tâm thị trấn trở nên hiện đại và thân thiện với người đi bộ hơn, khi phần lớn công trình cũ bị thay thế và ô tô bị đưa khỏi phố chính. Chỉ có công viên gần như giữ nguyên." },
        { en: "To the north of Main Street, the market in the north-west was replaced by a shopping centre, while the houses next to it were demolished and a block of apartments was built in their place. The park in the north-east remained, although a small café was added in its north-eastern corner.", vi: "[Thân 1 — phía bắc] Ở phía bắc phố Main, khu chợ phía tây bắc được thay bằng một trung tâm mua sắm, còn dãy nhà bên cạnh bị phá bỏ và một khu chung cư được xây ở chỗ đó. Công viên ở phía đông bắc vẫn còn, dù một quán cà phê nhỏ được thêm vào góc đông bắc." },
        { en: "The southern side saw even greater changes. The bus station was relocated from the south-west to the site of the old factory in the south-east, and a library was built where it had stood. The car park between them was converted into a public square. Finally, Main Street itself was closed to traffic and became a street for pedestrians only.", vi: "[Thân 2 — phía nam] Phía nam còn thay đổi nhiều hơn. Bến xe buýt được dời từ phía tây nam sang chỗ nhà máy cũ ở phía đông nam, và một thư viện được xây ở nơi bến xe từng nằm. Bãi đỗ xe ở giữa được chuyển thành một quảng trường công cộng. Cuối cùng, chính phố Main bị cấm xe và trở thành phố chỉ dành cho người đi bộ." },
      ],
    },
    {
      t: "table",
      caption: "Bài mẫu: 157 từ — vì sao đạt mức band 6",
      head: ["Tiêu chí", "Bài mẫu làm gì"],
      rows: [
        ["**Task Achievement**", "Tổng quan **xu hướng chung** (more modern, pedestrian-friendly; only the park stayed); **đủ 7 thay đổi** trong bảng; không thêm ý kiến (không viết “this is a good change”)."],
        ["**Coherence & Cohesion**", "Chia thân bài **theo vùng** (bắc / nam phố Main) — giám khảo dò theo bản đồ được; nối: **while, although, Finally**; tham chiếu: **in their place, where it had stood, between them, itself**."],
        ["**Lexical Resource**", "Đủ loại động từ biến đổi: replaced by, demolished, built, added, relocated, converted into, closed to traffic; tính từ ghép **pedestrian-friendly**; **saw even greater changes** (chủ ngữ là “phía nam”)."],
        ["**Grammatical Range & Accuracy**", "**Quá khứ đơn bị động** xuyên bài (vì cả hai năm đã qua); **remained** chủ động; một câu **quá khứ hoàn thành** (where it **had stood**) đúng chỗ; câu phức với as, while, although."],
      ],
    },
    {
      t: "note",
      title: "Cẩn thận: năm lỗi làm bài bản đồ mất điểm",
      items: [
        "**Kể từng ô theo thứ tự lung tung** → mất CC. Luôn đi theo vùng (bắc → nam, hoặc tây → đông).",
        "**Thiếu tổng quan** hoặc tổng quan chỉ là “There are many changes” → TA tối đa band 5. Nói **xu hướng**: hiện đại hơn / ít cây xanh / nhiều dịch vụ hơn.",
        "**Dùng sai thì**: hai năm đã qua mà viết ~~has been built~~ — giám khảo coi là lỗi ngữ pháp lặp lại.",
        "**Chỉ dùng there was / there is**: “In 2000 there was a market. In 2020 there is a shopping centre.” → đúng nhưng quá đơn điệu (band 4–5). Thay bằng câu bị động biến đổi.",
        "**Đoán ý đồ**: ~~The factory was removed because it caused pollution.~~ — bản đồ không cho lý do; Task 1 không suy diễn.",
      ],
    },
    {
      t: "mcq",
      id: "t2d22-viet-chon",
      title: "Chọn câu đúng cho bài bản đồ (6 câu)",
      items: [
        { q: "Đề: 2000 và 2020. Câu đúng:", options: ["The car park has been converted into a square.", "The car park was converted into a square.", "The car park converted into a square.", "The car park is converted into a square."], correct: 1, why: "Hai mốc **đều đã qua** → quá khứ đơn bị động **was converted into**." },
        { q: "Đề: 2005 và today. Câu đúng:", options: ["A new bridge is built.", "A new bridge built.", "A new bridge has been built.", "A new bridge had built."], correct: 2, why: "Mốc sau là **today** → HTHT bị động **has been built**." },
        { q: "Câu đúng về thứ KHÔNG đổi:", options: ["The park was remained.", "The park was remain.", "The park remains unchanging.", "The park remained unchanged."], correct: 3, why: "**remain** không có bị động → **remained unchanged**." },
        { q: "Khu nhà cũ bị phá, chung cư mới chiếm chỗ. Câu đúng nghĩa:", options: ["The houses were replaced by apartments.", "The apartments were replaced by houses.", "The houses replaced apartments.", "The houses were relocated to apartments."], correct: 0, why: "Cái **cũ** (houses) **was / were replaced by** cái **mới** (apartments). Đảo lại là sai nghĩa." },
        { q: "Câu tổng quan tốt nhất:", options: ["Overall, there are many changes.", "Overall, a café was added to the park.", "Overall, the town centre became more modern, and almost all the old buildings were replaced.", "Overall, I think the town is nicer now."], correct: 2, why: "Tổng quan = **xu hướng chung** + điểm nổi bật nhất; không chi tiết lẻ, không ý kiến." },
        { q: "Vị trí của café trên bản đồ 2020:", options: ["in the south-west of the park", "in the north-eastern corner of the park", "opposite the library", "at the western end of Main Street"], correct: 1, why: "Café nằm ở **góc đông bắc** của công viên (phía trên, bên phải)." },
      ],
    },

    {
      t: "note",
      title: "Cẩn thận: thêm ba lỗi về độ CHÍNH XÁC",
      items: [
        "**Tả đúng như hình**: hình vẽ 3 cây thì là ==three trees / a few trees==, không phải ~~a forest~~; hình vẽ 2 toà nhà thì không viết ~~many buildings~~. Đổi số lượng hay loại vật = thông tin sai → trừ Task Achievement.",
        "**Nêu khoảng năm MỘT lần** ở đầu khổ (==Between 2000 and 2020, …== / ==Over the twenty-year period, …==), rồi các câu sau chỉ cần động từ bị động. Lặp “from 2000 to 2020” ở mọi câu làm bài nặng và mất điểm CC.",
        "**Mỗi câu thay đổi phải kèm VỊ TRÍ** (in the north-west, next to the park, at the western end of…). ~~A café was added.~~ → A café was added **in the north-eastern corner of the park**. Giám khảo phải dò được trên bản đồ.",
      ],
    },

    /* ── 3b ── */
    { t: "h", text: "3b. Câu khung nâng cấp — tổng quan và gói hai thay đổi trong một câu" },
    {
      t: "table",
      caption: "Khung câu bản đồ band 5.5–6 (dùng 2–3 cái mỗi bài, không cần tất cả)",
      head: ["Dùng để", "Khung", "Ví dụ (Westbrook)"],
      rows: [
        ["**Tổng quan**", "X **underwent a number of changes**, the most important of which **was / were** + N / V-ing", "Westbrook town centre underwent a number of changes, the most important of which was the pedestrianisation of Main Street."],
        ["Gói 2 thay đổi: **replacing**", "S + was + V3 …, **replacing** + N (cái cũ)", "A shopping centre was built in the north-west, **replacing** the old market."],
        ["Gói 2 thay đổi: **with + N**", "S + was + V3, **with** + N + V-ing / V3", "The houses were demolished, **with** a block of apartments built in their place."],
        ["Gói 2 thay đổi: **accompanied by**", "S + was + V3, **which was accompanied by** + N", "The bus station was moved to the south-east, **which was accompanied by** the construction of a library on its old site."],
        ["Cái cũ → cái mới", "**There used to be** + N + …, **but it was** (later) **redeveloped into** + N", "**There used to be** a car park south of Main Street, **but it was redeveloped into** a public square."],
        ["**Mở thân bài 2**", "**As can be seen from the map**, … · **Turning to** the southern part, …", "**As can be seen from the map**, the southern side changed even more dramatically."],
      ],
    },
    {
      t: "rule",
      formula: "X underwent a number of changes, the most important of which was + N. · S + was + V3 …, replacing + N. · There used to be + N, but it was redeveloped into + N.",
      vi: "Tổng quan có “the most important of which”; trong thân bài, gói hai thay đổi cùng chỗ vào một câu thay vì hai câu đơn.",
    },
    {
      t: "quiz",
      id: "t2d22-viet-goi-cau",
      title: "Gộp hai câu bản đồ thành một (4 câu)",
      kind: "translate",
      grammar: "…, replacing + N · …, with + N + V3 · There used to be + N, but it was redeveloped into + N · X underwent a number of changes, the most important of which was + N",
      items: [
        { q: "Gộp: “A hotel was built in the east. It replaced the forest.”", hint: "A hotel was built in the east, replacing the forest", answers: ["A hotel was built in the east, replacing the forest.", "A hotel was built in the east of the village, replacing the forest.", "A hotel was constructed in the east, replacing the forest."] },
        { q: "Gộp: “There was a car park in the south. It was turned into a square.”", hint: "There used to be a car park in the south, but it was redeveloped into a square", answers: ["There used to be a car park in the south, but it was redeveloped into a square.", "There used to be a car park in the south, but it was turned into a square.", "There used to be a car park in the south, but it was converted into a square."] },
        { q: "Gộp: “The old houses were knocked down. Apartments were built in their place.”", hint: "The old houses were knocked down, with apartments built in their place", answers: ["The old houses were knocked down, with apartments built in their place.", "The old houses were demolished, with apartments built in their place.", "The old houses were knocked down, with apartments being built in their place."] },
        { q: "Dịch: Ngôi làng đã trải qua nhiều thay đổi, quan trọng nhất là việc xây một sân golf.", hint: "The village underwent a number of changes, the most important of which was the construction of a golf course", answers: ["The village underwent a number of changes, the most important of which was the construction of a golf course.", "The village underwent a number of changes, the most important of which was the building of a golf course.", "The village underwent many changes, the most important of which was the construction of a golf course.", "The village has undergone a number of changes, the most important of which is the construction of a golf course.", "The village has undergone a number of changes, the most important of which was the construction of a golf course."] },
      ],
    },

    /* ── 3c ── */
    { t: "h", text: "3c. Biến thể: chọn địa điểm — hai vị trí đề xuất S1 và S2" },
    {
      t: "p",
      text: "Có loại đề bản đồ **không có hai mốc thời gian** mà cho **một** bản đồ với **hai vị trí đề xuất** (S1, S2) cho một công trình mới (siêu thị, trường học, bệnh viện…). Không có gì “đã thay đổi”, nên **không dùng bị động quá khứ**. Bạn so sánh hai vị trí: mỗi chỗ **gần / xa** cái gì, **rộng / hẹp**, đi lại thế nào.",
    },
    {
      t: "figure",
      fig: {
        kind: "map",
        title: "Two proposed sites (S1 and S2) for a new supermarket in Riverton",
        note: "Bản đồ tự đặt cho bài luyện. Phía Bắc ở trên cùng.",
        map: {
          cols: 12,
          rows: 10,
          paths: [
            { x: 0.2, y: 4.4, w: 11.6, h: 1.1, label: "Main road" },
            { x: 8.9, y: 0.2, w: 0.5, h: 8.1, label: "Railway" },
            { x: 0.2, y: 8.6, w: 11.6, h: 1.1, label: "River" },
          ],
          boxes: [
            { x: 0.4, y: 0.4, w: 3.6, h: 3.6, label: "Housing" },
            { x: 4.3, y: 0.4, w: 4.3, h: 3.6, label: "Town centre" },
            { x: 9.6, y: 0.4, w: 2, h: 3.6, label: "Farmland" },
            { x: 0.4, y: 5.9, w: 3.6, h: 2.4, label: "Housing" },
            { x: 4.3, y: 5.9, w: 1.8, h: 2.4, label: "S1" },
            { x: 6.3, y: 5.9, w: 2.3, h: 2.4, label: "Park" },
            { x: 9.6, y: 5.8, w: 2, h: 2.6, label: "S2" },
          ],
          pins: [{ x: 9.15, y: 4.95, label: "Station" }],
        },
      },
    },
    {
      t: "sodo",
      kind: "compare",
      title: "Bản đồ trước – sau ≠ bản đồ chọn địa điểm",
      cols: [
        { title: "**Trước – sau** (Westbrook)", items: ["hai mốc thời gian", "**was replaced / was built** (bị động quá khứ)", "tổng quan = xu hướng thay đổi chung", "thân bài chia theo vùng"] },
        { title: "**Chọn địa điểm** (S1 / S2)", items: ["một bản đồ, hai vị trí", "**is located / lies / is close to** (hiện tại đơn)", "ưu – nhược: **would / could** + V", "tổng quan = khác biệt chính giữa hai vị trí", "thân 1 = S1 · thân 2 = S2"] },
      ],
    },
    {
      t: "table",
      caption: "Ngôn ngữ cho bài chọn địa điểm",
      head: ["Ý", "Cụm"],
      rows: [
        ["Vị trí", "S1 **is located / is situated / lies** + in the south of / next to / opposite … · **on the outskirts** (ở rìa thị trấn) · **in the heart of** the town"],
        ["Gần – xa", "**close to / within walking distance of** · **far from / some distance from**"],
        ["Ưu điểm (dự đoán)", "A supermarket here **would** be easy to reach · it **could** provide more parking"],
        ["Nhược điểm (dự đoán)", "**However / On the other hand**, shoppers **would** probably need to drive · there **would** be little room for…"],
        ["Tổng quan", "Overall, **the main difference is that** S1 is…, **whereas** S2 is…"],
      ],
    },
    {
      t: "examples",
      items: [
        { en: "The map shows two possible sites, S1 and S2, for a new supermarket in the town of Riverton.", vi: "[Mở bài] Bản đồ cho thấy hai vị trí có thể, S1 và S2, cho một siêu thị mới ở thị trấn Riverton." },
        { en: "Overall, the main difference is that S1 is in the heart of the town, close to housing and the town centre, whereas S2 lies on the eastern edge, next to the railway and farmland.", vi: "[Tổng quan] Nhìn chung, khác biệt chính là S1 nằm ở giữa thị trấn, gần khu nhà ở và trung tâm, còn S2 nằm ở rìa phía đông, cạnh đường sắt và đất nông nghiệp." },
        { en: "S1 is located to the south of the main road, directly opposite the town centre, with housing immediately to its west and a park to its east. A supermarket here would be within walking distance for most residents. However, the site is smaller than S2 and is bordered by the river to the south, so there would be little room for a car park.", vi: "[Thân 1 — S1] S1 nằm phía nam đường chính, ngay đối diện trung tâm, khu nhà ở sát phía tây và công viên ở phía đông. Siêu thị ở đây sẽ nằm trong khoảng đi bộ được với phần lớn cư dân. Tuy nhiên, khu đất nhỏ hơn S2 và giáp sông ở phía nam, nên sẽ ít chỗ cho bãi đỗ xe." },
        { en: "As can be seen from the map, S2 is situated on the outskirts, to the east of the railway and close to the station. Being larger, it could provide more parking, and goods could be delivered by train. On the other hand, it is further from where most people live, so shoppers would probably need to drive or take the train.", vi: "[Thân 2 — S2] Như bản đồ cho thấy, S2 nằm ở ngoại vi, phía đông đường sắt và gần nhà ga. Vì rộng hơn, nó có thể có nhiều chỗ đỗ xe hơn, và hàng hoá có thể chở tới bằng tàu. Mặt khác, nó xa nơi phần lớn người dân sống hơn, nên người mua sắm có lẽ sẽ phải lái xe hoặc đi tàu." },
      ],
    },
    {
      t: "table",
      caption: "Bài mẫu chọn địa điểm: 177 từ (đã đếm) — ước tính band 6",
      head: ["Tiêu chí", "Bài mẫu làm gì"],
      rows: [
        ["**Task Achievement**", "Tổng quan nêu **khác biệt chính** (giữa thị trấn ↔ rìa thị trấn); mỗi vị trí đủ: gần gì, rộng/hẹp, đi lại; ưu – nhược chỉ suy từ thứ **có trên bản đồ** (sông, đường sắt, nhà ga)."],
        ["**Coherence & Cohesion**", "Thân 1 = S1, Thân 2 = S2; mở thân 2 bằng **As can be seen from the map**; nối **However · On the other hand · whereas**."],
        ["**Grammar**", "**Hiện tại đơn** cho vị trí (is located, lies, is bordered by); **would / could** cho điều sẽ xảy ra nếu chọn chỗ đó; không câu bị động quá khứ nào."],
      ],
    },
    {
      t: "mcq",
      id: "t2d22-viet-dia-diem",
      title: "Bài chọn địa điểm — chọn câu đúng (3 câu)",
      items: [
        { q: "Câu nào đúng cho bài chọn địa điểm?", options: ["S1 was built next to the river.", "S1 is located next to the river.", "S1 has been located next to the river."], correct: 1, why: "Chưa có gì được xây — chỉ là vị trí đề xuất → **hiện tại đơn**: is located. A và C tả như việc đã xảy ra." },
        { q: "Câu tổng quan tốt nhất:", options: ["Overall, S2 is better, so the town should choose it.", "Overall, there are two sites on the map.", "Overall, the main difference is that S1 is near the town centre, whereas S2 is on the outskirts next to the railway."], correct: 2, why: "Tổng quan = **khác biệt chính** giữa hai vị trí. A đưa ý kiến chọn chỗ (đề không hỏi); B không nói gì." },
        { q: "Nói nhược điểm của S2 đúng nhất:", options: ["Shoppers would probably need to drive there.", "Shoppers needed to drive there.", "Shoppers are driving there."], correct: 0, why: "Nhược điểm là điều **sẽ** xảy ra nếu xây ở đó → **would + V**. Quá khứ hay tiếp diễn đều sai vì siêu thị chưa có." },
      ],
    },

    /* ── 4 ── */
    { t: "h", text: "4. Viết bài — làng chài Hai Thanh, 1990 và hôm nay" },
    {
      t: "figure",
      fig: {
        kind: "map",
        title: "Hai Thanh fishing village — 1990",
        note: "Bản đồ tự đặt cho bài luyện. Phía Bắc ở trên cùng; biển ở phía đông.",
        map: {
          cols: 12,
          rows: 10,
          paths: [{ x: 5.6, y: 0.2, w: 0.8, h: 9.6, label: "Narrow road" }],
          boxes: [
            { x: 0.4, y: 0.4, w: 4.8, h: 4.2, label: "Rice fields" },
            { x: 0.4, y: 5, w: 4.8, h: 4.6, label: "Houses" },
            { x: 6.8, y: 0.4, w: 2.4, h: 4.2, label: "Forest" },
            { x: 6.8, y: 5, w: 2.4, h: 2.2, label: "Fish market" },
            { x: 6.8, y: 7.6, w: 2.4, h: 2, label: "Fishing boats" },
            { x: 9.6, y: 0.4, w: 2, h: 9.2, label: "Beach / Sea" },
          ],
        },
      },
    },
    {
      t: "figure",
      fig: {
        kind: "map",
        title: "Hai Thanh fishing village — today",
        note: "Bản đồ tự đặt cho bài luyện. Phía Bắc ở trên cùng; biển ở phía đông.",
        map: {
          cols: 12,
          rows: 10,
          paths: [{ x: 5.4, y: 0.2, w: 1.2, h: 9.6, label: "Main road (widened)" }],
          boxes: [
            { x: 0.4, y: 0.4, w: 4.8, h: 4.2, label: "Golf course" },
            { x: 0.4, y: 5, w: 4.8, h: 4.6, label: "Houses" },
            { x: 6.8, y: 0.4, w: 2.4, h: 4.2, label: "Hotels" },
            { x: 6.8, y: 5, w: 2.4, h: 2.2, label: "Seafood restaurants" },
            { x: 6.8, y: 7.6, w: 2.4, h: 2, label: "Marina (tourist boats)" },
            { x: 9.6, y: 0.4, w: 2, h: 9.2, label: "Beach / Sea" },
          ],
        },
      },
    },
    {
      t: "essay",
      id: "t2d22-viet-bai",
      task: "Task 1",
      prompt: "The maps show the fishing village of Hai Thanh in 1990 and today. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
      minWords: 150,
      tips: [
        "Mốc sau là **today** → dùng **HTHT bị động**: has been replaced by / have been built / has been widened.",
        "Tổng quan: làng chài → **khu du lịch** (tourist resort); nông nghiệp và rừng mất đi; khu nhà ở giữ nguyên.",
        "Thân 1: phía **tây** con đường (rice fields → golf course; houses remained). Thân 2: phía **đông** (forest → hotels; fish market → seafood restaurants; fishing boats → marina; road widened).",
        "Từ gợi ý: tourist resort, cleared (rừng bị phá), converted into, a marina for tourist boats, has been widened.",
        "Không viết lý do (vì du lịch phát triển…) — chỉ mô tả cái bản đồ cho thấy.",
      ],
    },
  ],
};

/* ─────────────────────────── Bài tập ─────────────────────────── */

const T2D22_HOMEWORK: Lesson = {
  id: "t2d22-bai-tap",
  kind: "homework",
  title: "Bài tập Ngày 22",
  goal: "Ôn trọn Ngày 22: từ và cụm động từ gia đình, điền nhãn sơ đồ từ bài đọc, và câu bị động mô tả bản đồ trước – sau.",
  minutes: 45,
  blocks: [
    {
      t: "recap",
      title: "Bài tập hôm nay (36 câu)",
      items: [
        "**I. Dịch Việt → Anh** (10 câu, có 💡).",
        "**II. Trắc nghiệm** (10 câu): từ vựng, cụm động từ, ngôn ngữ bản đồ.",
        "**III. Điền dạng từ** (6 câu).",
        "**IV. Điền nhãn sơ đồ** (5 câu) — một đoạn mô tả ngắn.",
        "**V. Viết lại câu bản đồ ở bị động** (5 câu).",
      ],
    },
    {
      t: "sodo",
      kind: "mindmap",
      title: "Ôn nhanh Ngày 22",
      center: "**Ngày 22**",
      branches: [
        { label: "Gia đình", items: ["sibling · relative · in-laws", "bring up · get on with · look after", "close-knit · generation gap"], anh: "people-hugging" },
        { label: "Diagram label", items: ["đọc sơ đồ trước", "từ vị trí: on top of · beside · beneath", "đúng giới hạn từ, đúng chính tả"], anh: "gear" },
        { label: "Task 1 map", items: ["2 năm quá khứ → was + V3", "today → has been + V3", "remained (không bị động)"], anh: "world-map" },
      ],
    },

    { t: "h", text: "I. Dịch sang tiếng Anh (10 câu)" },
    {
      t: "quiz",
      id: "t2d22-bt-dich",
      title: "I. Dịch sang tiếng Anh (10 câu)",
      kind: "translate",
      grammar: "Cụm động từ gia đình · từ chủ đề · was/were + V3 (hai mốc quá khứ) · has/have been + V3 (today) · remained.",
      items: [
        { q: "Tôi được bà ngoại nuôi lớn.", hint: "I was brought up by, my grandmother", answers: ["I was brought up by my grandmother.", "I was raised by my grandmother.", "I was brought up by my grandma.", "My grandmother brought me up.", "My grandmother raised me."] },
        { q: "Tôi rất hợp với anh họ.", hint: "I get on very well with, my cousin", answers: ["I get on very well with my cousin.", "I get along very well with my cousin.", "I get on really well with my cousin.", "I get along really well with my cousin."] },
        { q: "Cô ấy giống mẹ — cả hai đều rất kiên nhẫn.", hint: "She takes after her mother — they are both very patient", answers: ["She takes after her mother — they are both very patient.", "She takes after her mother; they are both very patient.", "She takes after her mother. They are both very patient.", "She takes after her mother, they are both very patient.", "She takes after her mother - they are both very patient.", "She takes after her mother — they're both very patient.", "She takes after her mum — they are both very patient."] },
        { q: "Nhiều bố mẹ đi làm trông cậy vào ông bà để trông con.", hint: "Many working parents, rely on, grandparents, for childcare", answers: ["Many working parents rely on grandparents for childcare.", "Many working parents rely on their parents for childcare.", "Many working parents depend on grandparents for childcare.", "Many working parents rely on grandparents to look after their children.", "Many working parents rely on the grandparents for childcare."] },
        { q: "Cả nhà tôi tụ họp vào dịp Tết.", hint: "My whole family, gets together, at Tet", answers: ["My whole family gets together at Tet.", "My whole family gets together during Tet.", "My whole family gets together for Tet.", "My family gets together at Tet.", "The whole family gets together at Tet."] },
        { q: "Sống ở ký túc xá giúp tôi tự lập hơn.", hint: "Living in a dormitory, helped me (to) become more independent", answers: ["Living in a dormitory helped me become more independent.", "Living in a dormitory helped me to become more independent.", "Living in a dorm helped me become more independent.", "Living in a dormitory made me more independent."] },
        { q: "Ba thế hệ sống chung dưới một mái nhà.", hint: "Three generations, live, under one roof", answers: ["Three generations live under one roof.", "Three generations live under the same roof.", "Three generations live together under one roof."] },
        { q: "Nhà máy đã bị phá bỏ để nhường chỗ cho một công viên. (2000 → 2020)", hint: "The factory, was demolished / knocked down, to make way for a park", answers: ["The factory was demolished to make way for a park.", "The factory was knocked down to make way for a park.", "The factory was pulled down to make way for a park."] },
        { q: "Con đường chính đã được mở rộng. (today)", hint: "The main road, has been widened", answers: ["The main road has been widened.", "The main road has been made wider."] },
        { q: "Khu nhà ở phía tây vẫn giữ nguyên.", hint: "The houses in the west, remained / have remained unchanged", answers: ["The houses in the west remained unchanged.", "The houses in the west have remained unchanged.", "The houses in the west remained the same.", "The houses in the west have stayed the same.", "The houses in the west stayed the same."] },
      ],
    },

    { t: "h", text: "II. Trắc nghiệm (10 câu)" },
    {
      t: "mcq",
      id: "t2d22-bt-chon",
      title: "II. Chọn đáp án đúng (10 câu)",
      items: [
        { q: "My cousins are my uncle's and aunt's children. My cousins and I are ___.", options: ["siblings", "relatives", "in-laws", "parents"], correct: 1, why: "Anh em họ là **relatives** (họ hàng), không phải siblings (anh chị em ruột)." },
        { q: "I really ___ my grandfather — he's my hero.", options: ["look up to", "look after", "take after", "fall out with"], correct: 0, why: "Ngưỡng mộ → **look up to**." },
        { q: "My parents ___ me up to be honest.", options: ["brought", "grew", "took", "got"], correct: 0, why: "**bring sb up** = nuôi dạy → **brought** me up." },
        { q: "She ___ an engineer last year.", options: ["married with", "got married with", "married", "was married with"], correct: 2, why: "**marry** sb (không giới từ) hoặc get married **to** sb." },
        { q: "In the past, many people lived in ___ families with grandparents, uncles and aunts.", options: ["nuclear", "single-parent", "household", "extended"], correct: 3, why: "Nhiều thế hệ, nhiều họ hàng → **extended** family." },
        { q: "Map (1995 → 2015): The hospital ___.", options: ["has been extended", "was extended", "extended", "is extended"], correct: 1, why: "Hai mốc quá khứ → **was extended**." },
        { q: "Map (2000 → now): Two new schools ___.", options: ["were built", "built", "have been built", "have built"], correct: 2, why: "Mốc sau là **now** → **have been built**." },
        { q: "Câu đúng:", options: ["The forest was remained.", "The forest was remaining.", "The forest has remained been.", "The forest remained."], correct: 3, why: "**remain** không có bị động." },
        { q: "Diagram — “A filter sits ___ the tank” (ô nằm trên nắp bể):", options: ["beneath", "beside", "inside", "on top of"], correct: 3, why: "Trên nắp → **on top of**." },
        { q: "Diagram label, giới hạn ONE WORD ONLY. Bài: “…an underground channel carrying cool water”. Ô: “underground ___”.", options: ["cool channel", "a channel", "channel", "water channel"], correct: 2, why: "“underground” đã in sẵn, chỉ một từ → **channel**." },
      ],
    },

    { t: "h", text: "III. Điền dạng đúng của từ (6 câu)" },
    {
      t: "quiz",
      id: "t2d22-bt-dang-tu",
      title: "III. Điền dạng từ (6 câu)",
      kind: "fill",
      items: [
        { q: "She has a very good ___ with her parents. (RELATE)", answers: ["relationship"], hint: "a good + danh từ (mối quan hệ)" },
        { q: "Teenagers want to be more ___ from their parents. (DEPEND)", answers: ["independent"], hint: "be more + tính từ; from = tự lập khỏi" },
        { q: "Their ___ lasted for fifty years. (MARRY)", answers: ["marriage"], hint: "Their + danh từ" },
        { q: "Children should learn to take ___ for their actions. (RESPONSIBLE)", answers: ["responsibility"], hint: "take ___ for" },
        { q: "___ support is important for young students. (PARENT)", answers: ["Parental", "parental"], hint: "tính từ trước support" },
        { q: "My grandfather had a very strict ___. (BRING UP)", answers: ["upbringing"], hint: "a strict + danh từ" },
      ],
    },

    { t: "h", text: "IV. Điền nhãn sơ đồ (5 câu)" },
    {
      t: "passage",
      title: "A simple solar water heater",
      paras: [
        { label: "A", text: "A solar water heater uses sunlight to heat water without any electricity. Its main part is a flat, black panel called a collector, which is fixed to the roof at an angle so that it faces the sun. Inside the collector, thin copper tubes carry water. Because black surfaces absorb heat, the water in the tubes quickly becomes hot." },
        { label: "B", text: "Hot water is lighter than cold water, so it rises naturally through a pipe into an insulated tank placed above the collector. Cold water from the bottom of the tank flows back down into the collector to be heated. A thick layer of foam surrounding the tank keeps the water warm overnight, and a tap fitted near the top of the tank, where the water is hottest, supplies hot water to the house." },
      ],
    },
    {
      t: "figure",
      fig: {
        kind: "map",
        title: "A simple solar water heater",
        note: "Sơ đồ tự vẽ cho bài luyện — điền nhãn 1–5.",
        map: {
          cols: 12,
          rows: 10,
          boxes: [
            { x: 6.2, y: 0.6, w: 4.4, h: 0.6, blank: "4" },
            { x: 6.6, y: 1.2, w: 3.6, h: 2.6, blank: "3" },
            { x: 10.3, y: 1.4, w: 1.4, h: 0.8, blank: "5" },
            { x: 0.6, y: 5, w: 7, h: 4.2, blank: "1" },
            { x: 2.6, y: 7.3, w: 4.4, h: 1.5, blank: "2" },
          ],
          paths: [{ x: 7.6, y: 3.8, w: 0.3, h: 1.4, label: "pipe" }],
          pins: [{ x: 1.2, y: 1.2, label: "☀ sun" }],
        },
      },
    },
    {
      t: "quiz",
      id: "t2d22-bt-nhan",
      title: "IV. Label the diagram — ONE WORD ONLY (5 câu)",
      kind: "fill",
      items: [
        { q: "(1) tấm phẳng màu đen gắn nghiêng trên mái", answers: ["collector", "panel"], hint: "đoạn A — a flat, black panel called a…" },
        { q: "(2) ống mảnh bằng đồng bên trong tấm (1)", answers: ["tubes"], hint: "đoạn A — thin copper …" },
        { q: "(3) bể chứa đặt PHÍA TRÊN tấm (1)", answers: ["tank"], hint: "đoạn B — placed above the collector" },
        { q: "(4) lớp bao quanh bể giữ nhiệt qua đêm", answers: ["foam"], hint: "đoạn B — a thick layer of … surrounding the tank" },
        { q: "(5) gắn gần đỉnh bể, cấp nước nóng vào nhà", answers: ["tap"], hint: "đoạn B — near the top of the tank" },
      ],
    },

    { t: "h", text: "V. Viết lại câu bản đồ ở bị động (5 câu)" },
    {
      t: "quiz",
      id: "t2d22-bt-bi-dong",
      title: "V. Viết lại ở bị động — giữ nguyên thì (5 câu)",
      kind: "fill",
      grammar: "Chủ động quá khứ đơn → was/were + V3 · HTHT → has/have been + V3 · Bỏ “they / the council” (không cần by).",
      items: [
        { q: "They built a new bridge in 2010. → A new bridge ___", answers: ["A new bridge was built in 2010.", "was built in 2010.", "was built in 2010"], hint: "was + V3" },
        { q: "The council has closed the old cinema. → The old cinema ___", answers: ["The old cinema has been closed.", "has been closed.", "has been closed", "The old cinema has been closed by the council.", "has been closed by the council."], hint: "has been + V3" },
        { q: "They converted the warehouse into a museum. → The warehouse ___", answers: ["The warehouse was converted into a museum.", "was converted into a museum.", "was converted into a museum"], hint: "was converted into" },
        { q: "They have planted trees along the river. → Trees ___", answers: ["Trees have been planted along the river.", "have been planted along the river.", "have been planted along the river"], hint: "have been + V3 (Trees số nhiều)" },
        { q: "They moved the bus station to the north. → The bus station ___", answers: ["The bus station was moved to the north.", "was moved to the north.", "was moved to the north", "The bus station was relocated to the north.", "was relocated to the north."], hint: "was + V3" },
      ],
    },
  ],
};

export const NGAY_22: Lesson[] = [T2D22_VOCAB, T2D22_READING, T2D22_WRITING, T2D22_HOMEWORK];
