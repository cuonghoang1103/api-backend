/**
 * IELTS Tập 2 · Ngày 6 — Từ vựng Technology & innovation + đoán nghĩa từ ngữ cảnh [VC10 VD10]
 * · Reading: True / False / Not Given 2 — 5 bẫy cơ bản [R05] · Writing: Discussion essay trọn bài + dàn ý
 * 5 phút + chia 20/40 phút [W04 W18 X04] · Bài tập (34 câu) · ✅ Kiểm tra chặng 1 (Ngày 1–6) `t2d6-kiem-tra`.
 *
 * Đề cương: docs/ielts-lo-trinh-0-8.md mục 3.2 hàng N6. Ngày chẵn không ghi 🔊 ⇒ khối `phatam` (1/ngày) đặt ở
 * bài Từ vựng: trọng âm từ công nghệ (nhập trước S12 — học hệ thống ở Ngày 11 / 13). Bài kiểm tra chặng có
 * thêm một khối `phatam` riêng (phần 8) như `d6-kiem-tra` / `d12-kiem-tra` của Tập 1.
 * Bài đọc, kịch bản nghe, bài mẫu, câu bài tập đều tự soạn; mọi số liệu là số tự đặt.
 */
import type { Lesson } from '../data';

/* ─────────────────────────── Bài 1 · Từ vựng ─────────────────────────── */

const T2D6_VOCAB: Lesson = {
  id: 't2d6-tu-vung',
  kind: 'vocab',
  title: 'Technology & innovation + đoán nghĩa từ ngữ cảnh',
  goal: 'Dùng được 20 từ + 10 cụm về công nghệ – đổi mới để nói và viết về điện thoại, mạng xã hội, trí tuệ nhân tạo, tự động hoá; đoán được nghĩa từ lạ trong bài Reading / Listening bằng 5 loại manh mối ngữ cảnh thay vì bỏ cuộc.',
  minutes: 85,
  blocks: [
    {
      t: 'recap',
      title: 'Bài này đẩy band nào, tiêu chí nào',
      items: [
        'Đẩy **Lexical Resource** lên band 5 với chủ đề **công nghệ** — gặp ở Task 2 (smartphones, AI, online learning), Part 1 (Do you use your phone a lot?) và Part 3.',
        'Đẩy **Reading / Listening**: band 5 không cần biết **mọi** từ. Kỹ năng **đoán nghĩa từ ngữ cảnh** (guessing from context) giúp bạn đi tiếp thay vì kẹt ở một từ lạ.',
        '**5 loại manh mối**: ==định nghĩa · từ đồng nghĩa · từ trái nghĩa / đối lập · ví dụ · cấu tạo từ (tiền tố, hậu tố — Ngày 4)==.',
        '20 từ + 10 cụm + 5 họ từ + 4 câu mẫu Task 2, theo đúng khuôn từ vựng chủ đề (Ngày 2, 4).',
        '🔊 Thêm: **trọng âm** từ công nghệ — tech**NO**logy, **DI**gital, inno**VA**tion (học hệ thống ở Ngày 11, 13).',
      ],
    },

    { t: 'h', text: '1. Technology & innovation — 20 từ cốt lõi' },
    {
      t: 'vocab',
      items: [
        { w: 'device', pos: 'n', ipa: '/dɪˈvaɪs/', vi: 'thiết bị', ex: 'Most teenagers own at least two digital devices.', exVi: 'Phần lớn thiếu niên có ít nhất hai thiết bị số.', more: 'Danh từ **device** /s/ ≠ động từ **devise** /z/ (nghĩ ra). **mobile devices**.', anh: 'mobile-phone' },
        { w: 'gadget', pos: 'n', ipa: '/ˈɡædʒɪt/', vi: 'đồ công nghệ nhỏ, thiết bị tiện ích', ex: 'He loves buying the latest gadgets.', exVi: 'Anh ấy mê mua đồ công nghệ mới nhất.', more: '**the latest gadgets**. Thân mật hơn device.', anh: 'watch' },
        { w: 'innovation', pos: 'n', ipa: '/ˌɪnəˈveɪʃn/', vi: 'sự đổi mới, cái mới', ex: 'The smartphone was the greatest innovation of the decade.', exVi: 'Điện thoại thông minh là đổi mới lớn nhất của thập kỷ.', more: 'Họ từ: **innovate** (v) · **innovative** (adj) · **innovator** (n).', anh: 'light-bulb' },
        { w: 'artificial intelligence', pos: 'n', ipa: '/ˌɑːtɪfɪʃl ɪnˈtelɪdʒəns/', vi: 'trí tuệ nhân tạo (AI)', ex: 'Artificial intelligence can now translate speech instantly.', exVi: 'Trí tuệ nhân tạo giờ có thể dịch lời nói ngay lập tức.', more: 'Viết tắt **AI** /ˌeɪ ˈaɪ/ — dùng Ø: **AI is changing…** (không ~~the AI~~ khi nói chung).', anh: 'robot' },
        { w: 'automation', pos: 'n', ipa: '/ˌɔːtəˈmeɪʃn/', vi: 'sự tự động hoá', ex: 'Automation has replaced many factory jobs.', exVi: 'Tự động hoá đã thay thế nhiều việc làm ở nhà máy.', more: 'Họ từ: **automate** (v) · **automatic** (adj) · **automatically** (adv).', anh: 'mechanical-arm' },
        { w: 'digital', pos: 'adj', ipa: '/ˈdɪdʒɪtl/', vi: 'số, kỹ thuật số', ex: 'Older people may struggle with digital banking.', exVi: 'Người lớn tuổi có thể gặp khó với ngân hàng số.', more: '**digital skills / literacy** (kỹ năng số) · **digitise** (số hoá).' },
        { w: 'cutting-edge', pos: 'adj', ipa: '/ˌkʌtɪŋ ˈedʒ/', vi: 'tiên tiến nhất, mũi nhọn', ex: 'The hospital uses cutting-edge equipment.', exVi: 'Bệnh viện dùng thiết bị tiên tiến nhất.', more: 'Gần nghĩa: **state-of-the-art**, **advanced**. Từ band 6 — dùng đúng chỗ là ăn điểm.' },
        { w: 'breakthrough', pos: 'n', ipa: '/ˈbreɪkθruː/', vi: 'bước đột phá', ex: 'Scientists have made a breakthrough in battery technology.', exVi: 'Các nhà khoa học đã có bước đột phá về công nghệ pin.', more: '**make / achieve a breakthrough in** sth.' },
        { w: 'obsolete', pos: 'adj', ipa: '/ˈɒbsəliːt/', vi: 'lỗi thời, không còn dùng', ex: 'CDs have become almost obsolete.', exVi: 'Đĩa CD gần như đã lỗi thời.', more: 'Gần nghĩa: **out of date**, **outdated**. Trái nghĩa: **up to date**.', anh: 'optical-disk' },
        { w: 'user-friendly', pos: 'adj', ipa: '/ˌjuːzə ˈfrendli/', vi: 'dễ dùng', ex: 'The new app is very user-friendly.', exVi: 'Ứng dụng mới rất dễ dùng.', more: '**friendly** là tính từ (Ngày 4 — -ly không phải lúc nào cũng là trạng từ). Cùng kiểu: **eco-friendly**.' },
        { w: 'privacy', pos: 'n', ipa: '/ˈprɪvəsi/', vi: 'quyền riêng tư', ex: 'Many users worry about the privacy of their data.', exVi: 'Nhiều người dùng lo về quyền riêng tư dữ liệu.', more: 'Anh đọc /ˈprɪvəsi/, Mỹ /ˈpraɪvəsi/. **data privacy** · **invade sb’s privacy**.', anh: 'locked-with-key' },
        { w: 'screen time', pos: 'n', ipa: '/ˈskriːn taɪm/', vi: 'thời gian dùng màn hình', ex: 'Parents should limit their children’s screen time.', exVi: 'Cha mẹ nên giới hạn thời gian dùng màn hình của con.', anh: 'television' },
        { w: 'addicted (to)', pos: 'adj', ipa: '/əˈdɪktɪd/', vi: 'nghiện', ex: 'Some teenagers are addicted to online games.', exVi: 'Một số thiếu niên nghiện game online.', more: '**addiction to** (n) · **addictive** (adj, gây nghiện): an addictive game. Sau **to** dùng N / V-ing.' },
        { w: 'e-commerce', pos: 'n', ipa: '/ˌiː ˈkɒmɜːs/', vi: 'thương mại điện tử', ex: 'E-commerce has grown rapidly in Southeast Asia.', exVi: 'Thương mại điện tử tăng nhanh ở Đông Nam Á.', more: 'Gần nghĩa: **online shopping**. Không đếm được.' },
        { w: 'digital divide', pos: 'n', ipa: '/ˌdɪdʒɪtl dɪˈvaɪd/', vi: 'khoảng cách số (giữa người có / không có công nghệ)', ex: 'The digital divide between cities and villages is still wide.', exVi: 'Khoảng cách số giữa thành phố và làng quê vẫn còn lớn.', more: '**bridge / close the digital divide** (thu hẹp khoảng cách số).' },
        { w: 'virtual', pos: 'adj', ipa: '/ˈvɜːtʃuəl/', vi: 'ảo', ex: 'Students can take a virtual tour of the museum.', exVi: 'Học sinh có thể tham quan bảo tàng ảo.', more: '**virtual reality (VR)** · **virtually** (adv) = **gần như**: virtually everyone (gần như mọi người).', anh: 'goggles' },
        { w: 'algorithm', pos: 'n', ipa: '/ˈælɡərɪðəm/', vi: 'thuật toán', ex: 'Social media algorithms decide what we see first.', exVi: 'Thuật toán mạng xã hội quyết định ta thấy gì trước.', more: 'Đọc /ð/ ở "-rithm". Trọng âm đầu: **AL**gorithm.' },
        { w: 'upgrade', pos: 'v, n', ipa: '/ˌʌpˈɡreɪd/ (v) · /ˈʌpɡreɪd/ (n)', vi: 'nâng cấp', ex: 'I upgrade my phone every three years.', exVi: 'Ba năm tôi nâng cấp điện thoại một lần.', more: 'Tiền tố **up-**. Danh từ: **a free upgrade**.' },
        { w: 'install', pos: 'v', ipa: '/ɪnˈstɔːl/', vi: 'cài đặt', ex: 'You need to install the app before the class.', exVi: 'Bạn cần cài ứng dụng trước buổi học.', more: '**installation** (n). Ngược: **uninstall** (gỡ cài đặt).' },
        { w: 'wearable', pos: 'adj, n', ipa: '/ˈweərəbl/', vi: 'đeo được (thiết bị đeo)', ex: 'Wearable devices can track your heart rate.', exVi: 'Thiết bị đeo có thể theo dõi nhịp tim.', more: 'Hậu tố **-able** (Ngày 4): wear + able. **wearable technology / wearables**.', anh: 'watch' },
      ],
    },

    { t: 'h', text: '2. 10 cụm từ ăn điểm' },
    {
      t: 'vocab',
      items: [
        { w: 'keep up with', pos: 'phr v', ipa: '/kiːp ˈʌp wɪð/', vi: 'theo kịp', ex: 'It is hard for older people to keep up with new technology.', exVi: 'Người lớn tuổi khó theo kịp công nghệ mới.' },
        { w: 'rely heavily on', pos: 'phr', ipa: '/rɪˈlaɪ ˈhevɪli ɒn/', vi: 'phụ thuộc nhiều vào', ex: 'Modern businesses rely heavily on the internet.', exVi: 'Doanh nghiệp hiện đại phụ thuộc nhiều vào internet.', more: '**rely on** (Ngày 3 — giới từ phụ thuộc) + trạng từ **heavily** (không dùng ~~very~~).' },
        { w: 'have access to', pos: 'phr', ipa: '/hæv ˈækses tə/', vi: 'có thể tiếp cận, sử dụng', ex: 'Not every student has access to a computer at home.', exVi: 'Không phải học sinh nào ở nhà cũng có máy tính dùng.', more: 'Danh từ **access** đi với **to**: have access **to** the internet. Động từ **access** thì **không** có to: **access the internet** (~~access to the internet~~ khi là động từ).' },
        { w: 'go viral', pos: 'phr', ipa: '/ɡəʊ ˈvaɪrəl/', vi: 'lan truyền mạnh (trên mạng)', ex: 'Her video went viral overnight.', exVi: 'Video của cô ấy lan truyền chóng mặt chỉ sau một đêm.' },
        { w: 'replace human workers', pos: 'phr', ipa: '/rɪˈpleɪs ˈhjuːmən ˈwɜːkəz/', vi: 'thay thế người lao động', ex: 'Robots may replace human workers in many factories.', exVi: 'Robot có thể thay thế người lao động ở nhiều nhà máy.', more: '**replace A with B** (thay A bằng B).' },
        { w: 'invade sb’s privacy', pos: 'phr', ipa: '/ɪnˈveɪd ˈprɪvəsi/', vi: 'xâm phạm quyền riêng tư của ai', ex: 'Some apps invade users’ privacy by tracking their location.', exVi: 'Một số ứng dụng xâm phạm quyền riêng tư bằng cách theo dõi vị trí.', more: 'Danh từ: **an invasion of privacy**.' },
        { w: 'stay connected', pos: 'phr', ipa: '/steɪ kəˈnektɪd/', vi: 'giữ liên lạc', ex: 'Video calls help families stay connected.', exVi: 'Gọi video giúp gia đình giữ liên lạc.', more: 'Gần nghĩa: **keep in touch (with)**.' },
        { w: 'make life easier', pos: 'phr', ipa: '/meɪk laɪf ˈiːziə(r)/', vi: 'làm cuộc sống dễ dàng hơn', ex: 'Online banking has made life easier for busy people.', exVi: 'Ngân hàng trực tuyến làm cuộc sống người bận rộn dễ hơn.', more: '**make + O + adj** (make life easier / more convenient).' },
        { w: 'be glued to (a screen)', pos: 'phr', ipa: '/bi ˈɡluːd tə/', vi: 'dán mắt vào (màn hình)', ex: 'Children are glued to their tablets for hours.', exVi: 'Trẻ em dán mắt vào máy tính bảng hàng giờ.', more: 'Thân mật; dùng tốt ở Speaking. Writing: **spend excessive time on screens**.' },
        { w: 'switch off', pos: 'phr v', ipa: '/swɪtʃ ˈɒf/', vi: 'tắt; ngắt kết nối (nghỉ ngơi)', ex: 'I switch off my phone after 10 p.m.', exVi: 'Tôi tắt điện thoại sau 10 giờ tối.', more: 'Nghĩa bóng: **switch off from work** (thôi nghĩ về công việc).' },
      ],
    },
    {
      t: 'table',
      caption: '5 họ từ công nghệ',
      head: ['Danh từ', 'Động từ', 'Tính từ', 'Trạng từ'],
      rows: [
        ['technology · technologist', '—', 'technological', 'technologically'],
        ['innovation · innovator', 'innovate', 'innovative', 'innovatively'],
        ['automation', 'automate', 'automatic · automated', 'automatically'],
        ['convenience', '—', 'convenient · inconvenient', 'conveniently'],
        ['connection', 'connect', 'connected', '—'],
      ],
    },
    {
      t: 'examples',
      items: [
        { en: 'Although technology has made life easier in many ways, people who are glued to their screens may become less active.', vi: 'Dù công nghệ làm cuộc sống dễ hơn theo nhiều cách, người dán mắt vào màn hình có thể trở nên ít vận động hơn.' },
        { en: 'Automation is likely to replace human workers in routine jobs, so governments should invest in retraining.', vi: 'Tự động hoá có thể thay thế người lao động ở công việc lặp lại, nên chính phủ cần đầu tư đào tạo lại.' },
        { en: 'Closing the digital divide means making sure that children in rural areas have access to the internet.', vi: 'Thu hẹp khoảng cách số nghĩa là bảo đảm trẻ em vùng nông thôn được tiếp cận internet.' },
        { en: 'Many social media apps invade users’ privacy by collecting data without clear permission.', vi: 'Nhiều ứng dụng mạng xã hội xâm phạm quyền riêng tư bằng cách thu thập dữ liệu khi chưa xin phép rõ ràng.' },
      ],
    },
    {
      t: 'mcq',
      id: 't2d6-cong-nghe-chon',
      title: 'Chọn từ / cụm đúng (8 câu)',
      items: [
        { q: 'Video calls help families who live far apart ___.', options: ['go viral', 'stay connected', 'switch off'], correct: 1, why: '**stay connected** = giữ liên lạc.' },
        { q: 'Typewriters became ___ when computers appeared.', options: ['obsolete', 'wearable', 'user-friendly'], correct: 0, why: '**obsolete** = lỗi thời, không còn dùng.' },
        { q: 'Many teenagers are ___ to social media.', options: ['addictive', 'addiction', 'addicted'], correct: 2, why: '**be addicted to** = nghiện (tính từ -ed tả người). addictive tả thứ gây nghiện.' },
        { q: 'The company is famous for its ___ products, such as folding phones.', options: ['innovative', 'innovation', 'innovate'], correct: 0, why: 'Trước danh từ **products** → tính từ **innovative**.' },
        { q: 'It is difficult for my grandparents to ___ new apps.', options: ['rely heavily on', 'keep up with', 'invade'], correct: 1, why: '**keep up with** = theo kịp.' },
        { q: 'Children in remote villages often do not ___ fast internet.', options: ['make life easier', 'go viral', 'have access to'], correct: 2, why: '**have access to** + N = được tiếp cận.' },
        { q: 'The new banking app is very ___: even my grandmother can use it.', options: ['user-friendly', 'cutting-edge', 'virtual'], correct: 0, why: '**user-friendly** = dễ dùng (bà cũng dùng được).' },
        { q: 'Scientists have made a major ___ in cancer treatment.', options: ['gadget', 'breakthrough', 'upgrade'], correct: 1, why: '**make a breakthrough** = có bước đột phá.' },
      ],
    },

    { t: 'h', text: '3. Đoán nghĩa từ ngữ cảnh — 5 loại manh mối' },
    {
      t: 'p',
      text: 'Một bài Reading có thể có **20–30 từ** bạn chưa biết. Người band 4 dừng lại ở từng từ; người band 5 trở lên **đoán nghĩa gần đúng** rồi đi tiếp — vì phần lớn câu hỏi không hỏi đúng từ đó, và đoán "tích cực hay tiêu cực, là vật hay là việc" đã đủ để trả lời. Có 5 loại **manh mối** (context clues) giúp đoán:',
    },
    {
      t: 'table',
      head: ['Manh mối', 'Dấu hiệu trong câu', 'Ví dụ (từ in đậm là từ lạ)'],
      rows: [
        ['① **Định nghĩa**', 'is / means / is called / , which is… / dấu gạch ngang / ngoặc', 'The phone uses **biometrics** — the measurement of a person’s face or fingerprints — to unlock. → nhận dạng sinh trắc học'],
        ['② **Đồng nghĩa** gần đó', 'or · also · similarly · và một từ quen cùng ý', 'The app is **ubiquitous**; it is found everywhere in the city. → có mặt khắp nơi'],
        ['③ **Trái nghĩa / đối lập**', 'but · however · while · unlike · instead of · rather than', 'Old phones were **cumbersome**, but modern ones are light and easy to carry. → cồng kềnh'],
        ['④ **Ví dụ**', 'such as · for example · including · like', '**Peripherals**, such as keyboards, mice and printers, are sold separately. → thiết bị ngoại vi'],
        ['⑤ **Cấu tạo từ** (Ngày 4)', 'tiền tố, gốc, hậu tố quen', '**Unaffordable** = un- (không) + afford (đủ tiền) + -able (có thể) → không đủ tiền mua'],
      ],
    },
    {
      t: 'sodo',
      kind: 'flow',
      title: 'Gặp từ lạ khi đang đọc — 4 bước, tối đa 15 giây',
      steps: [
        { label: '① **Loại từ** gì?', sub: 'Đứng sau a / the → danh từ · sau is / very → tính từ · sau chủ ngữ → động từ.' },
        { label: '② **Tích cực hay tiêu cực?**', sub: 'Nhìn từ xung quanh: problem, unfortunately, but… hay benefit, successful…' },
        { label: '③ Tìm **manh mối** ①–⑤', sub: 'Định nghĩa? đồng nghĩa? but / however? such as? tiền tố – hậu tố?' },
        { label: '④ **Đoán – kiểm – đi tiếp**', sub: 'Thay nghĩa đoán vào câu: có hợp lý không? Hợp lý → đọc tiếp, đừng tra.' },
      ],
      caption: 'Câu hỏi KHÔNG hỏi tới từ đó → bỏ qua luôn. Chỉ dừng lại đoán khi từ đó nằm trong câu chứa đáp án.',
    },
    {
      t: 'rule',
      formula: 'Từ lạ → loại từ → tích cực / tiêu cực → manh mối (định nghĩa · đồng nghĩa · but / however · such as · tiền tố – hậu tố) → đoán và đi tiếp',
      vi: 'Đoán gần đúng là đủ cho phần lớn câu hỏi; tra từ điển trong phòng thi là không thể.',
    },
    {
      t: 'mcq',
      id: 't2d6-doan-nghia',
      title: 'Đoán nghĩa từ in đậm (6 câu)',
      items: [
        { q: 'Smartphones have become **indispensable**; most people say they could not manage a single day without one. → indispensable nghĩa là:', options: ['đắt đỏ', 'không thể thiếu', 'dễ vỡ'], correct: 1, why: 'Manh mối **giải thích ngay sau dấu chấm phẩy**: "could not manage a single day without one" → không thể thiếu. Cấu tạo: in- (không) + dispense (bỏ đi) + -able.' },
        { q: 'Unlike the **sluggish** computers in our old office, the new laptops start in seconds. → sluggish nghĩa là:', options: ['chậm chạp', 'mới', 'đắt tiền'], correct: 0, why: 'Manh mối **đối lập**: Unlike… ↔ "start in seconds" (nhanh) → sluggish = chậm chạp.' },
        { q: 'The company sells **peripherals**, such as headphones, webcams and keyboards. → peripherals là:', options: ['phần mềm', 'nhân viên bán hàng', 'thiết bị đi kèm máy tính'], correct: 2, why: 'Manh mối **ví dụ**: such as headphones, webcams, keyboards → thiết bị ngoại vi.' },
        { q: 'Many older people find online forms **daunting**, and some give up before they finish. → daunting mang nghĩa:', options: ['miễn phí', 'thú vị', 'làm nản lòng, đáng sợ'], correct: 2, why: 'Hệ quả **tiêu cực**: "some give up before they finish" → daunting = làm nản, khó khăn đáng sợ.' },
        { q: 'The app is **intuitive**, or easy to understand without instructions. → intuitive:', options: ['dễ hiểu, dùng theo trực giác', 'phức tạp', 'mới ra mắt'], correct: 0, why: 'Manh mối **đồng nghĩa** sau **or**: "easy to understand without instructions".' },
        { q: 'Prices of electric cars are still **prohibitive** for most families — few can afford them. → prohibitive:', options: ['rẻ', 'quá cao (không mua nổi)', 'được cấm'], correct: 1, why: 'Manh mối giải thích: "few can afford them" → giá quá cao. (Bẫy: gốc prohibit = cấm, nhưng ở đây nói về giá.)' },
      ],
    },
    {
      t: 'vocab',
      items: [
        { w: 'indispensable', pos: 'adj', ipa: '/ˌɪndɪˈspensəbl/', vi: 'không thể thiếu', ex: 'A laptop is indispensable for university students today.', exVi: 'Máy tính xách tay là thứ không thể thiếu với sinh viên ngày nay.', more: 'Gần nghĩa **essential**. Cấu tạo: in- + dispens + -able.' },
        { w: 'ubiquitous', pos: 'adj', ipa: '/juːˈbɪkwɪtəs/', vi: 'có mặt khắp nơi', ex: 'Smartphones are ubiquitous in Vietnamese cities.', exVi: 'Điện thoại thông minh có mặt khắp nơi ở thành phố Việt Nam.', more: 'Từ band 7 — dùng 1 lần trong bài là đủ.' },
        { w: 'cumbersome', pos: 'adj', ipa: '/ˈkʌmbəsəm/', vi: 'cồng kềnh, rườm rà', ex: 'The old registration process was cumbersome.', exVi: 'Quy trình đăng ký cũ rất rườm rà.' },
        { w: 'intuitive', pos: 'adj', ipa: '/ɪnˈtjuːɪtɪv/', vi: 'dễ dùng theo trực giác', ex: 'The menu is intuitive, so you do not need a manual.', exVi: 'Menu dễ dùng theo trực giác nên không cần sách hướng dẫn.', more: 'Gần nghĩa **user-friendly**.' },
        { w: 'daunting', pos: 'adj', ipa: '/ˈdɔːntɪŋ/', vi: 'làm nản, đáng ngại', ex: 'Learning to code can seem daunting at first.', exVi: 'Học lập trình lúc đầu có vẻ đáng ngại.', more: '**a daunting task** · gần nghĩa **intimidating**.' },
        { w: 'prohibitive', pos: 'adj', ipa: '/prəˈhɪbətɪv/', vi: '(giá) quá cao, không kham nổi', ex: 'The cost of private tutoring is prohibitive for many families.', exVi: 'Chi phí học thêm riêng quá cao với nhiều gia đình.', more: 'Hay đi với **cost / price**. Gốc **prohibit** (cấm).' },
      ],
    },
    {
      t: 'quiz',
      id: 't2d6-tu-vung-dich',
      title: 'Dịch câu công nghệ (5 câu)',
      kind: 'translate',
      grammar: 'Cụm: rely heavily on · have access to · keep up with · be addicted to · replace … with … · Ø + N nói chung (Technology, AI).',
      items: [
        { q: 'Nhiều người trẻ nghiện điện thoại thông minh.', hint: 'Many young people, are addicted to, their smartphones / smartphones', answers: ['Many young people are addicted to their smartphones.', 'Many young people are addicted to smartphones.', 'A lot of young people are addicted to their smartphones.', 'Many young people are addicted to their phones.'] },
        { q: 'Không phải ai cũng được tiếp cận internet.', hint: 'Not everyone, has access to, the internet', answers: ['Not everyone has access to the internet.', 'Not everybody has access to the internet.', 'Not everyone has access to the Internet.'] },
        { q: 'Trí tuệ nhân tạo đang thay đổi cách chúng ta làm việc.', hint: 'Artificial intelligence (Ø), is changing, the way we work / how we work', answers: ['Artificial intelligence is changing the way we work.', 'Artificial intelligence is changing how we work.', 'AI is changing the way we work.', 'AI is changing how we work.'] },
        { q: 'Các doanh nghiệp phụ thuộc nhiều vào công nghệ.', hint: 'Businesses, rely heavily on, technology', answers: ['Businesses rely heavily on technology.', 'Companies rely heavily on technology.', 'Businesses depend heavily on technology.', 'Companies depend heavily on technology.'] },
        { q: 'Ông bà tôi khó theo kịp công nghệ mới.', hint: 'My grandparents, find it hard / difficult to keep up with, new technology', answers: ['My grandparents find it hard to keep up with new technology.', 'My grandparents find it difficult to keep up with new technology.', 'It is hard for my grandparents to keep up with new technology.', 'It is difficult for my grandparents to keep up with new technology.', "It's hard for my grandparents to keep up with new technology.", "It's difficult for my grandparents to keep up with new technology.", 'My grandparents have difficulty keeping up with new technology.'] },
      ],
    },

    { t: 'h', text: '4. Thêm: trọng âm từ công nghệ' },
    {
      t: 'p',
      text: 'Từ nhiều âm tiết luôn có **một âm tiết nhấn** (đọc to hơn, dài hơn, cao hơn); các âm tiết khác đọc nhẹ, thường thành /ə/. Đọc sai trọng âm là giám khảo **nghe không ra từ** dù bạn phát âm từng âm đúng. Hôm nay nhận ra trọng âm của từ chủ đề; quy tắc theo hậu tố học ở **Ngày 11 và 13**.',
    },
    {
      t: 'table',
      head: ['Mẫu', 'Từ', 'Ghi chú'],
      rows: [
        ['Nhấn **trước -tion / -sion / -ic / -ical / -logy**', 'inno**VA**tion · auto**MA**tion · tech**NO**logy → techno**LO**gical · elec**TRO**nic', 'Âm tiết **ngay trước** hậu tố mang trọng âm.'],
        ['Nhấn **âm tiết 1**', '**DI**gital · **GAD**get · **AL**gorithm · **SOFT**ware · **IN**ternet', 'Phần lớn danh từ / tính từ hai – ba âm tiết.'],
        ['Nhấn **âm tiết 2**', 'de**VICE** · in**STALL** · ad**DIC**ted · re**PLACE**', 'Nhiều động từ hai âm tiết (install, replace) và một số danh từ (device).'],
      ],
    },
    {
      t: 'phatam',
      id: 't2d6-phat-am',
      title: 'Luyện phát âm — trọng âm từ công nghệ',
      note: 'Bấm “Nghe mẫu”, rồi “Đọc & chấm”. Đọc âm tiết viết HOA ở dòng gợi ý to và dài hơn; các âm tiết còn lại nhẹ, nhanh. technology có 4 âm tiết: tek-NO-lə-dʒi.',
      items: [
        { text: 'technology, technological', ipa: 'teknɒlədʒi teknəlɒdʒɪkl', vi: 'tech-NO-lo-gy · tech-no-LO-gi-cal (trọng âm dời)' },
        { text: 'innovation, automation, connection', ipa: 'ɪnəveɪʃn ɔːtəmeɪʃn kənekʃn', vi: 'inno-VA-tion · auto-MA-tion · con-NEC-tion' },
        { text: 'digital, gadget, algorithm', ipa: 'dɪdʒɪtl ɡædʒɪt ælɡərɪðəm', vi: 'DI-gi-tal · GAD-get · AL-go-rithm' },
        { text: 'device, install, addicted', ipa: 'dɪvaɪs ɪnstɔːl ədɪktɪd', vi: 'de-VICE · in-STALL · ad-DIC-ted' },
        { text: 'Artificial intelligence is changing education.', ipa: 'ɑːtɪfɪʃl ɪntelɪdʒəns ɪz tʃeɪndʒɪŋ edʒukeɪʃn', vi: 'arti-FI-cial in-TEL-li-gence · edu-CA-tion' },
        { text: 'Most teenagers rely heavily on their devices.', ipa: 'məʊst tiːneɪdʒəz rɪlaɪ hevɪli ɒn ðeə dɪvaɪsɪz', vi: 'TEEN-agers · re-LY · HEA-vi-ly · de-VI-ces' },
        { text: 'The new app is very user-friendly.', ipa: 'ðə njuː æp ɪz veri juːzə frendli', vi: 'U-ser-FRIEND-ly' },
        { text: 'Automation will replace some human workers.', ipa: 'ɔːtəmeɪʃn wɪl rɪpleɪs sʌm hjuːmən wɜːkəz', vi: 'auto-MA-tion · re-PLACE · HU-man' },
      ],
    },
  ],
};

/* ─────────────────────────── Bài 2 · Reading ─────────────────────────── */

const T2D6_READING: Lesson = {
  id: 't2d6-doc',
  kind: 'reading',
  title: 'Reading: True / False / Not Given 2 — 5 bẫy cơ bản',
  goal: 'Nhận ra và tránh 5 bẫy cơ bản của TFNG (từ trùng khác nghĩa · từ chỉ mức độ · so sánh không có trong bài · thêm lý do / chi tiết · trái nghĩa / phủ định), làm đúng ≥ 9/12 câu với bài đọc ~400 từ về robot chăm sóc người già.',
  minutes: 55,
  blocks: [
    {
      t: 'recap',
      title: 'Bài này đẩy band nào, tiêu chí nào',
      items: [
        'Đẩy **Reading** lên band 5: TFNG có trong **gần như mọi đề** (thường 5–7 câu), và là dạng người Việt mất điểm nhiều nhất — chủ yếu vì nhầm **FALSE** với **NOT GIVEN**.',
        'Ôn **vòng 2** của Tập 1 Ngày 12 (sơ đồ 2 câu hỏi). Hôm nay thêm **5 bẫy cơ bản** — mỗi bẫy một dấu hiệu để nhận ra.',
        'Sơ đồ quyết định: ==Bài có nói về ý này không? Không → NOT GIVEN · Có → giống câu hỏi → TRUE · ngược câu hỏi → FALSE==.',
        'Câu hỏi đi **theo thứ tự bài**; đáp án dựa **chỉ vào bài**, không dựa kiến thức của bạn.',
        'Bài đọc tự soạn: **Can Robots Care?** (công nghệ + xã hội, ~400 từ, 12 câu).',
      ],
    },

    { t: 'h', text: '1. Nhắc lại: TRUE · FALSE · NOT GIVEN' },
    {
      t: 'sodo',
      kind: 'flow',
      title: 'Hai câu hỏi cho mỗi nhận định',
      steps: [
        { label: '① Bài có nói về **đúng ý** này không?', sub: 'Không (chỉ có từ giống, hoặc thiếu một phần quan trọng) → **NOT GIVEN**.' },
        { label: '② Có — thông tin trong bài **giống** hay **ngược**?', sub: 'Giống (paraphrase) → **TRUE** · Ngược (trái nghĩa, sai số, sai mức độ) → **FALSE**.' },
      ],
      caption: 'FALSE = bài nói ĐIỀU NGƯỢC LẠI. NOT GIVEN = bài KHÔNG NÓI. "Tôi không tìm thấy" chưa chắc là NOT GIVEN — có thể bạn đọc sót.',
    },

    { t: 'h', text: '2. Năm bẫy cơ bản' },
    {
      t: 'table',
      head: ['Bẫy', 'Trông như thế nào', 'Ví dụ (bài ↔ câu hỏi)', 'Đáp án hay gặp'],
      rows: [
        ['① **Từ trùng, khác ý**', 'Câu hỏi dùng **đúng từ** trong bài nhưng ghép thành ý **khác**.', 'Bài: "robots will become **cheaper** over time" ↔ "Robots are **cheaper** than human workers."', 'NOT GIVEN (hoặc FALSE)'],
        ['② **Từ chỉ mức độ / tần suất**', 'all, every, only, always, never, most ↔ some, a few, sometimes, one in ten', 'Bài: "**only about one in ten** homes" ↔ "**All** care homes use robots."', 'FALSE'],
        ['③ **So sánh không có trong bài**', 'more than, the largest, the first, better than… — bài nói từng thứ nhưng **không so sánh**', 'Bài: "used in **around thirty countries**" ↔ "used in **more countries than any other** robot."', 'NOT GIVEN'],
        ['④ **Thêm lý do / chi tiết**', 'Câu hỏi thêm **ai làm, because, in order to, originally, mainly** mà bài không nói', 'Bài: "a soft robot shaped like a baby seal" ↔ "The seal robot was **developed by a Japanese university**."', 'NOT GIVEN'],
        ['⑤ **Trái nghĩa / phủ định**', 'Bài dùng từ **ngược** (fewer ↔ more, unwilling ↔ eager) hoặc không có "not" mà câu hỏi có', 'Bài: "**fewer** young people are training" ↔ "The number… has **increased**."', 'FALSE'],
      ],
    },
    {
      t: 'note',
      title: 'Mẹo nhận bẫy nhanh',
      items: [
        'Khoanh **mọi từ chỉ mức độ** trong câu hỏi (all, only, always, most, never) — đối chiếu với từ trong bài. Khác mức độ → thường FALSE.',
        'Câu hỏi có **so sánh** (more, -er than, -est, the first) → tìm xem bài có **so sánh đúng hai thứ đó** không. Không → NOT GIVEN.',
        'Câu hỏi có **lý do / mục đích** (because, to, in order to, originally) → bài có nói lý do đó không? Không → NOT GIVEN.',
        '**Đừng dùng hiểu biết thật**: dù bạn biết robot hải cẩu có thật, chỉ trả lời theo bài.',
      ],
    },
    {
      t: 'mcq',
      id: 't2d6-doc-bay',
      title: 'Khởi động — nhận ra bẫy (5 câu)',
      items: [
        { q: 'Bài: "Most students in the survey said they used a laptop every day." · Câu hỏi: "All students in the survey used a laptop every day."', options: ['TRUE', 'FALSE', 'NOT GIVEN'], correct: 1, why: 'Bẫy ② mức độ: **most** ≠ **all** — bài nói "đa số", câu hỏi nói "tất cả" → **FALSE**.' },
        { q: 'Bài: "The app was launched in 2019 and now has two million users." · Câu hỏi: "The app was launched to help elderly people."', options: ['TRUE', 'FALSE', 'NOT GIVEN'], correct: 2, why: 'Bẫy ④ thêm mục đích: bài không nói app ra đời **để làm gì** → **NOT GIVEN**.' },
        { q: 'Bài: "Interest in coding courses has declined since 2020." · Câu hỏi: "Fewer people are interested in coding courses than in 2020."', options: ['TRUE', 'FALSE', 'NOT GIVEN'], correct: 0, why: '**declined** ≈ fewer people are interested → ý **giống** (paraphrase) → **TRUE**. Không phải bẫy — đây là cách đề diễn đạt lại.' },
        { q: 'Bài: "Both Tokyo and Seoul have tested driverless buses." · Câu hỏi: "Tokyo tested driverless buses before Seoul did."', options: ['TRUE', 'FALSE', 'NOT GIVEN'], correct: 2, why: 'Bẫy ③ so sánh thứ tự: bài không nói **ai trước** → **NOT GIVEN**.' },
        { q: 'Bài: "Few parents were willing to buy smartwatches for their children." · Câu hỏi: "Most parents were keen to buy smartwatches for their children."', options: ['TRUE', 'FALSE', 'NOT GIVEN'], correct: 1, why: 'Bẫy ⑤ trái nghĩa: **few… willing** ↔ **most… keen** → ngược → **FALSE**.' },
      ],
    },
    {
      t: 'rule',
      formula: 'all / only / always ≠ some / most → FALSE · more than / the first (bài không so sánh) → NG · because / originally (bài không nói lý do) → NG · fewer ↔ increased → FALSE',
      vi: 'Trước khi chọn, khoanh từ mức độ, từ so sánh, từ lý do trong câu hỏi.',
    },

    { t: 'h', text: '3. Bài đọc — Can Robots Care?' },
    {
      t: 'canh',
      anh: ['robot', 'old-woman', 'hospital', 'health-worker'],
      caption: 'Bài kiểu **Passage 1–2** về robot trong các viện dưỡng lão ở Nhật Bản: vì sao cần, robot làm được gì, vì sao nhiều nơi bỏ dùng, và tranh luận về "chăm sóc".',
    },
    {
      t: 'passage',
      title: 'Can Robots Care?',
      intro: 'You should spend about 20 minutes on Questions 1–12, which are based on the reading passage below.',
      paras: [
        { label: 'A', text: 'Japan has one of the oldest populations in the world: almost three in ten people are over sixty-five. At the same time, fewer young people are training to become care workers, and the government expects a shortage of more than half a million care staff by 2040. For more than a decade, it has looked to technology to fill the gap.' },
        { label: 'B', text: 'Since 2015, the government has spent large sums developing robots for care homes. Some of these machines lift elderly people out of bed, a task that causes back injuries for many human workers. Others remind residents to take their medicine, or lead group exercise classes. The best known is a soft robot shaped like a baby seal, which responds to touch and sound and is designed to calm people with dementia.' },
        { label: 'C', text: 'However, a national survey in 2019 found that only about one in ten care homes in Japan had introduced any kind of robot. A later study of homes that had tried them discovered that many machines were stored in cupboards after only a short period of use. Staff said the lifting robots took too long to set up, and that it was often quicker to call a colleague for help.' },
        { label: 'D', text: 'The study also found that robots sometimes created more work rather than less. Staff had to clean and charge the machines, fix minor faults and explain them to residents, some of whom were frightened by them. In one home, workers reported that the exercise robot needed a human helper standing beside it throughout every class.' },
        { label: 'E', text: 'Supporters argue that these problems are typical of any new technology and will disappear as robots become cheaper and simpler. They point to the seal robot, which has been used in around thirty countries and which some studies say reduces the need for calming medication. Families of residents, too, are often positive, particularly when robots allow their relatives to keep in touch by video.' },
        { label: 'F', text: 'Critics, though, worry about something deeper than technical faults. Care, they argue, is not only about lifting, feeding and reminding; it is about human contact. A resident who spends an afternoon talking to a robot may feel less lonely, but he or she has not been listened to by another person. For this reason, several care homes now use robots only for physical tasks, and leave conversation and comfort to human staff.' },
      ],
    },
    {
      t: 'p',
      text: '**Questions 1–12.** Do the following statements agree with the information given in the passage? Choose **TRUE** if the statement agrees with the information, **FALSE** if the statement contradicts the information, **NOT GIVEN** if there is no information on this.',
    },
    {
      t: 'mcq',
      id: 't2d6-doc-tfng',
      title: 'Questions 1–12 — True / False / Not Given',
      items: [
        { q: '1. More than a quarter of Japan’s population is aged over sixty-five.', options: ['TRUE', 'FALSE', 'NOT GIVEN'], correct: 0, why: 'A: "**almost three in ten** people are over sixty-five" ≈ 28–29 % > 25 % (a quarter) → **TRUE**. Đề đổi phân số — phải tự tính.' },
        { q: '2. The number of young people training as care workers is rising.', options: ['TRUE', 'FALSE', 'NOT GIVEN'], correct: 1, why: 'A: "**fewer** young people are training" ↔ rising → **FALSE** (bẫy ⑤ trái nghĩa).' },
        { q: '3. Lifting residents out of bed can be harmful to care workers.', options: ['TRUE', 'FALSE', 'NOT GIVEN'], correct: 0, why: 'B: "a task that **causes back injuries** for many human workers" → harmful → **TRUE**.' },
        { q: '4. The seal robot was developed by a Japanese university.', options: ['TRUE', 'FALSE', 'NOT GIVEN'], correct: 2, why: 'B tả robot hải cẩu **trông thế nào, làm gì** (responds to touch and sound, calms people with dementia) nhưng **không nói ai chế tạo** → **NOT GIVEN** (bẫy ④ thêm chi tiết). Đừng dùng hiểu biết ngoài bài.' },
        { q: '5. Every care home in Japan has tried at least one type of robot.', options: ['TRUE', 'FALSE', 'NOT GIVEN'], correct: 1, why: 'C: "**only about one in ten** care homes… had introduced any kind of robot" ↔ every → **FALSE** (bẫy ② mức độ).' },
        { q: '6. In the homes that were studied, it was rare for a robot to be put away and left unused.', options: ['TRUE', 'FALSE', 'NOT GIVEN'], correct: 1, why: 'C: "**many** machines were **stored in cupboards** after only a short period of use" ↔ rare → **FALSE** (bẫy ② mức độ: many ↔ rare).' },
        { q: '7. According to staff, asking a colleague for help was frequently faster than using a lifting robot.', options: ['TRUE', 'FALSE', 'NOT GIVEN'], correct: 0, why: 'C: "it was **often quicker to call a colleague** for help" → **TRUE**. often = frequently · quicker = faster (paraphrase).' },
        { q: '8. Some residents were scared of the robots.', options: ['TRUE', 'FALSE', 'NOT GIVEN'], correct: 0, why: 'D: "residents, **some of whom were frightened** by them" → scared = frightened → **TRUE**.' },
        { q: '9. Residents preferred the exercise robot to human instructors.', options: ['TRUE', 'FALSE', 'NOT GIVEN'], correct: 2, why: 'D chỉ nói robot thể dục **cần người đứng cạnh** — không nói người già **thích** robot hơn hay không → **NOT GIVEN** (bẫy ③ so sánh).' },
        { q: '10. Robots are already cheaper to use than human care workers.', options: ['TRUE', 'FALSE', 'NOT GIVEN'], correct: 2, why: 'E: robots "will become **cheaper** and simpler" — từ **cheaper** trùng nhưng bài **không so sánh** với chi phí nhân công → **NOT GIVEN** (bẫy ① từ trùng).' },
        { q: '11. Families of residents generally dislike the use of robots.', options: ['TRUE', 'FALSE', 'NOT GIVEN'], correct: 1, why: 'E: "Families of residents, too, are **often positive**" ↔ dislike → **FALSE**.' },
        { q: '12. Several care homes have decided to stop using robots completely.', options: ['TRUE', 'FALSE', 'NOT GIVEN'], correct: 1, why: 'F: "several care homes now use robots **only for physical tasks**" — vẫn dùng robot, chỉ giới hạn loại việc ↔ stop using robots **completely** → **FALSE** (bẫy ② mức độ).' },
      ],
    },
    {
      t: 'note',
      title: 'Nhìn lại 12 câu',
      items: [
        'Phân bố: **TRUE** 1, 3, 7, 8 · **FALSE** 2, 5, 6, 11, 12 · **NOT GIVEN** 4, 9, 10. Đề thật cũng thường có đủ cả ba loại.',
        'Ba câu NOT GIVEN đúng ba bẫy: **④ thêm chi tiết** (câu 4 "developed by a Japanese university"), **③ so sánh** (câu 9 "preferred… to"), **① từ trùng** (câu 10 "cheaper").',
        'Câu 1 là kiểu **đổi con số / phân số**: almost three in ten ≈ 30 % > a quarter (25 %). Đề hay đổi % ↔ phân số ↔ "one in ten".',
      ],
    },
    {
      t: 'vocab',
      items: [
        { w: 'shortage', pos: 'n', ipa: '/ˈʃɔːtɪdʒ/', vi: 'sự thiếu hụt', ex: 'There is a shortage of nurses in rural areas.', exVi: 'Vùng nông thôn thiếu y tá.', more: '**a shortage of** + N. Tính từ: **short of** (thiếu).' },
        { w: 'care home', pos: 'n', ipa: '/ˈkeə həʊm/', vi: 'viện dưỡng lão', ex: 'My great-grandmother lives in a care home.', exVi: 'Cụ tôi sống ở viện dưỡng lão.', more: 'Gần nghĩa: **nursing home** (Mỹ hay dùng). **care worker** = nhân viên chăm sóc.' },
        { w: 'resident', pos: 'n', ipa: '/ˈrezɪdənt/', vi: 'người cư trú (trong viện, toà nhà, khu vực)', ex: 'The residents enjoy the weekly music session.', exVi: 'Người ở viện thích buổi âm nhạc hằng tuần.', more: 'Đã gặp ở Ngày 1 (local residents).' },
        { w: 'dementia', pos: 'n', ipa: '/dɪˈmenʃə/', vi: 'chứng sa sút trí tuệ', ex: 'People with dementia often forget recent events.', exVi: 'Người bị sa sút trí tuệ hay quên chuyện mới xảy ra.' },
        { w: 'fault', pos: 'n', ipa: '/fɔːlt/', vi: 'lỗi, trục trặc (máy)', ex: 'The engineer fixed a minor fault in the system.', exVi: 'Kỹ sư sửa một trục trặc nhỏ của hệ thống.', more: '**a technical fault** · **It’s my fault** = lỗi của tôi.' },
        { w: 'lonely', pos: 'adj', ipa: '/ˈləʊnli/', vi: 'cô đơn', ex: 'Video calls make older people feel less lonely.', exVi: 'Gọi video giúp người già bớt cô đơn.', more: 'Tính từ đuôi -ly (Ngày 4). Danh từ: **loneliness**.' },
      ],
    },
  ],
};

/* ─────────────────────────── Bài 3 · Writing ─────────────────────────── */

const T2D6_WRITING: Lesson = {
  id: 't2d6-viet',
  kind: 'writing',
  title: 'Writing Task 2: Discussion essay trọn bài + dàn ý 5 phút + chia 20/40 phút',
  goal: 'Viết trọn một bài Discussion ("Discuss both views and give your own opinion") ≥ 250 từ: lập dàn ý trong 5 phút, trình bày công bằng cả hai quan điểm bằng P-E-E, nêu rõ ý kiến riêng ở mở bài và kết bài, và chia đúng 60 phút cho Task 1 + Task 2.',
  minutes: 75,
  blocks: [
    {
      t: 'recap',
      title: 'Bài này đẩy band nào, tiêu chí nào',
      items: [
        'Đẩy **Task Response** lên band 5: đề Discussion có **3 phần** phải trả lời (quan điểm 1, quan điểm 2, **ý kiến của bạn**). Quên ý kiến riêng → TR **khó vượt band 5**; bàn lệch một bên → TR bị trừ.',
        'Ôn **vòng 2** của Tập 1 Ngày 14 (bài luận thảo luận hai mặt). Hôm nay viết **trọn bài** với P-E-E (Ngày 2).',
        '**Dàn ý 5 phút** (W18): gạch đề → chọn ý kiến → 2 lý do / quan điểm → 1 ví dụ / lý do → câu thesis.',
        '**Chia 60 phút** (X04): Task 2 **40 phút** (5 dàn ý + 30 viết + 5 soát), Task 1 **20 phút**. Task 2 chiếm **2/3 điểm** Writing.',
        'Bài mẫu khoảng band 6.0–6.5 (ước tính) về **điện thoại trong trường học** (nối từ vựng công nghệ), rồi bạn tự viết một bài cho AI chấm.',
      ],
    },

    { t: 'h', text: '1. Nhận ra đề Discussion' },
    {
      t: 'table',
      head: ['Dạng đề Task 2', 'Câu lệnh', 'Phải làm', 'Học ở'],
      rows: [
        ['Opinion', 'To what extent do you agree or disagree?', 'Một quan điểm, 2 lý do', 'Ngày 2'],
        ['**Discussion**', '**Discuss both these views and give your own opinion.**', '**Bàn cả hai quan điểm + ý kiến riêng**', '**Hôm nay**'],
        ['Advantages / disadvantages', 'Do the advantages outweigh the disadvantages?', 'Lợi – hại + kết luận bên nào nặng hơn', 'Ngày 10'],
        ['Problem / solution', 'What are the problems… and what solutions…?', 'Vấn đề + giải pháp', 'Ngày 14'],
        ['Two-part question', 'Why…? What…?', 'Trả lời đủ hai câu hỏi', 'Ngày 18'],
      ],
    },
    {
      t: 'note',
      title: 'Người Việt hay sai với đề Discussion',
      items: [
        '**Không nêu ý kiến riêng** — chỉ tả hai quan điểm rồi kết "Both views have merits". Đề yêu cầu **give your own opinion**.',
        '**Ý kiến xuất hiện muộn** — chỉ ở kết bài. An toàn nhất: nêu trong **thesis** (cuối mở bài) và nhắc lại ở kết bài.',
        '**Viết lệch**: thân bài 1 năm câu, thân bài 2 hai câu. Hai quan điểm phải được bàn **gần cân bằng** (mỗi đoạn ~90 từ).',
        '**Viết "I agree"** — đề Discussion không hỏi agree / disagree. Dùng **I believe / In my view, … is more convincing**.',
      ],
    },

    { t: 'h', text: '2. Khung 4 đoạn' },
    {
      t: 'sodo',
      kind: 'flow',
      title: 'Discussion essay — 4 đoạn, 260–290 từ',
      steps: [
        { label: '**Mở bài** (~50 từ)', sub: 'Bối cảnh · "While some people argue that A, others believe that B." · **Thesis**: In my view, …' },
        { label: '**Thân bài 1** — quan điểm bạn KHÔNG chọn (~90 từ)', sub: 'On the one hand, there are good reasons why… · P → E → E.' },
        { label: '**Thân bài 2** — quan điểm bạn CHỌN (~90 từ)', sub: 'On the other hand, … · I believe this view is more convincing because… · P → E → E.' },
        { label: '**Kết bài** (~35 từ)', sub: 'In conclusion, although…, I believe… — nhắc ý kiến bằng lời khác, không ý mới.' },
      ],
      caption: 'Để quan điểm mình chọn ở THÂN BÀI 2 — người đọc kết thúc phần thân bài bằng lập luận mạnh nhất của bạn, nối thẳng sang kết bài.',
    },
    {
      t: 'table',
      caption: 'Câu khung dùng được ngay',
      head: ['Vị trí', 'Câu khung'],
      rows: [
        ['Giới thiệu hai quan điểm', 'While some people argue that…, others believe that… · Opinions differ on whether…'],
        ['Thesis', 'In my view, … · Personally, I believe that… · I would argue that…'],
        ['Mở thân bài 1', 'On the one hand, there are good reasons why some people believe… · Supporters of… argue that…'],
        ['Mở thân bài 2', 'On the other hand, … · However, I find the opposite view more convincing. · Those who disagree point out that…'],
        ['Kết bài', 'In conclusion, although… , I believe that… · To sum up, while both views have some merit, …'],
      ],
    },
    {
      t: 'rule',
      formula: 'While some argue that A, others believe that B. In my view, … → TB1 (A, P-E-E) → TB2 (B — ý mình, P-E-E) → In conclusion, although A…, I believe B…',
      vi: 'Ba phần bắt buộc: quan điểm A, quan điểm B, ý kiến của bạn (ở thesis + kết bài).',
    },

    { t: 'h', text: '3. Dàn ý trong 5 phút' },
    {
      t: 'sodo',
      kind: 'flow',
      title: 'Lập dàn ý — 5 phút, chỉ từ khoá',
      steps: [
        { label: '1′ — **Gạch đề**', sub: 'Chủ đề · quan điểm A · quan điểm B · câu lệnh (discuss + opinion).' },
        { label: '30″ — **Chọn ý kiến**', sub: 'Bên nào bạn có nhiều ý + ví dụ hơn? Chọn bên đó, không cần là "thật lòng".' },
        { label: '2′ — **2 lý do cho mỗi bên**', sub: 'Mỗi lý do 3–5 từ khoá.' },
        { label: '1′ — **1 ví dụ cụ thể** cho mỗi đoạn', sub: 'Nơi chốn · năm · con số · trải nghiệm bản thân.' },
        { label: '30″ — **Viết nháp thesis**', sub: 'In my view, … — câu này quyết định cả bài.' },
      ],
      caption: '5 phút dàn ý không phải "mất giờ": nó cứu bạn khỏi viết lạc đề và hết ý giữa chừng — hai lỗi kéo TR xuống band 4.',
    },
    {
      t: 'table',
      caption: 'Dàn ý mẫu cho đề ở mục 4 (đúng 5 phút)',
      head: ['Đoạn', 'Từ khoá'],
      rows: [
        ['Đề', 'phones at school · A: useful tool · B: ban completely · discuss + my opinion'],
        ['Ý kiến', 'allow — but ONLY planned lesson use'],
        ['TB1 (ban)', 'distraction — check SNS every few min → can’t concentrate · bullying — photos shared in seconds · Ex: my school banned 2022 → talk more at break'],
        ['TB2 (allow)', 'instant info, dictionaries, apps · Ex: record speaking, listen to pronunciation · learn self-control → if banned, never learn'],
        ['Kết', 'distraction real, but ban too far → allow for planned activities, switch off rest of day'],
      ],
    },

    { t: 'h', text: '4. Bài mẫu — khoảng band 6.0–6.5 (ước tính)' },
    {
      t: 'p',
      text: '**Đề:** Some people believe that students should be allowed to use smartphones at school, while others think smartphones should be banned completely. **Discuss both these views and give your own opinion.** Write at least 250 words.',
    },
    {
      t: 'examples',
      items: [
        { en: "[Introduction] Smartphones have become a normal part of teenagers' lives, and schools are now divided over whether students should be allowed to use them during the school day. While some people argue that phones are a useful learning tool, others believe they should be banned completely. In my view, phones should be allowed in schools, but only in lessons where teachers have planned to use them.", vi: '[Mở bài] Điện thoại thông minh đã thành một phần bình thường trong đời sống thiếu niên, và các trường đang chia rẽ về việc có nên cho học sinh dùng trong giờ học. Trong khi một số người cho rằng điện thoại là công cụ học tập hữu ích, người khác tin rằng nên cấm hoàn toàn. Theo tôi, nên cho phép điện thoại ở trường, nhưng chỉ trong những tiết giáo viên đã lên kế hoạch sử dụng.' },
        { en: '[Body 1] On the one hand, there are good reasons why some people want to ban phones. The main argument is that smartphones distract students from their lessons. Even when a phone is silent, many teenagers check messages and social media every few minutes, which means they cannot concentrate on what the teacher is saying. In addition, phones can make bullying worse, because unkind photos and messages can be shared in seconds. For example, after my secondary school banned phones in 2022, teachers noticed that students talked to each other much more at break time.', vi: '[Thân bài 1] Một mặt, có lý do chính đáng để nhiều người muốn cấm điện thoại. Lập luận chính là điện thoại làm học sinh xao nhãng. Ngay cả khi để im lặng, nhiều thiếu niên vẫn kiểm tra tin nhắn và mạng xã hội vài phút một lần, nghĩa là các em không tập trung được vào lời giáo viên. Ngoài ra, điện thoại có thể làm bắt nạt tệ hơn, vì ảnh và tin nhắn ác ý có thể lan đi trong vài giây. Ví dụ, sau khi trường cấp hai của tôi cấm điện thoại năm 2022, giáo viên để ý thấy học sinh nói chuyện với nhau nhiều hơn hẳn giờ ra chơi.' },
        { en: '[Body 2] On the other hand, I believe phones can be valuable when they are used properly. Firstly, they give students instant access to information, online dictionaries and educational apps. In a language class, for instance, students can record themselves speaking and then listen to their own pronunciation, which is impossible with a textbook. Secondly, learning to use technology responsibly is an important skill in itself. If schools simply ban phones, young people never learn how to control their screen time, and they may struggle even more when they go to university.', vi: '[Thân bài 2] Mặt khác, tôi tin điện thoại có thể rất giá trị khi được dùng đúng cách. Thứ nhất, chúng cho học sinh tiếp cận tức thì thông tin, từ điển trực tuyến và ứng dụng học tập. Ví dụ trong giờ ngoại ngữ, học sinh có thể ghi âm mình nói rồi nghe lại phát âm — điều sách giáo khoa không làm được. Thứ hai, học cách dùng công nghệ có trách nhiệm tự nó đã là một kỹ năng quan trọng. Nếu trường chỉ đơn giản cấm, người trẻ sẽ không bao giờ học được cách kiểm soát thời gian dùng màn hình, và có thể còn chật vật hơn khi lên đại học.' },
        { en: '[Conclusion] In conclusion, although smartphones can be a serious distraction, I believe a complete ban goes too far. Schools should allow phones for planned learning activities and ask students to switch them off for the rest of the day.', vi: '[Kết bài] Tóm lại, dù điện thoại có thể gây xao nhãng nghiêm trọng, tôi cho rằng cấm hoàn toàn là quá mức. Trường nên cho dùng điện thoại cho các hoạt động học đã lên kế hoạch và yêu cầu học sinh tắt máy trong thời gian còn lại.' },
      ],
    },
    {
      t: 'table',
      caption: 'Vì sao bài mẫu (286 từ, đã đếm) được khoảng band 6.0–6.5 (ước tính)',
      head: ['Tiêu chí', 'Bài mẫu làm được', 'Để lên band 7 cần'],
      rows: [
        ['**Task Response**', 'Đủ **3 phần**: lý do cấm (TB1), lý do cho dùng (TB2), ý kiến riêng **rõ** ở thesis và kết bài ("allowed… but only in lessons…"). Hai thân bài gần cân bằng.', 'Ý kiến có **mức độ** tinh hơn và ví dụ ở TB2 cụ thể hơn (một trường, một con số).'],
        ['**Coherence & Cohesion**', 'On the one hand / On the other hand · The main argument · In addition · Firstly / Secondly · for instance; referencing: **them, they, this**. Mỗi đoạn một ý trung tâm.', 'Từ nối ít "công thức" hơn; nối ý bằng referencing nhiều hơn.'],
        ['**Lexical Resource**', 'Từ Ngày 6: **distract, instant access, educational apps, screen time, use technology responsibly**; collocation: **a serious distraction, goes too far, make bullying worse**.', 'Thêm vài từ ít gặp chính xác (e.g. "a blanket ban", "digital literacy").'],
        ['**Grammatical Range**', 'Câu phức đa dạng: **While…, others…** · **which means…** · **because…** · **If schools simply ban…** · **after my school banned…**; HTHT đúng (**have become**).', 'Thêm bị động, mệnh đề quan hệ không xác định; giảm câu bắt đầu bằng "S + V".'],
      ],
    },
    {
      t: 'mcq',
      id: 't2d6-viet-chon',
      title: 'Kiểm tra — đề và cấu trúc Discussion (4 câu)',
      items: [
        { q: 'Đề nào là đề Discussion?', options: ['Some people think university should be free. To what extent do you agree?', 'Some people think university should be free, while others think students should pay. Discuss both views and give your own opinion.', 'What are the advantages and disadvantages of free university?'], correct: 1, why: 'Có hai quan điểm + **Discuss both views and give your own opinion** → Discussion.' },
        { q: 'Trong bài Discussion, ý kiến riêng nên xuất hiện ở đâu?', options: ['Chỉ ở thân bài 2', 'Chỉ ở kết bài', 'Ở thesis (mở bài) và nhắc lại ở kết bài'], correct: 2, why: 'Nêu sớm (thesis) để người đọc theo dõi, nhắc lại ở kết bài để khép bài — an toàn nhất cho TR.' },
        { q: 'Câu kết bài nào tốt nhất?', options: ['In conclusion, although phones can distract students, I believe a total ban goes too far, and they should be allowed for planned activities.', 'In conclusion, both views have advantages and disadvantages.', 'In conclusion, I agree with this statement.'], correct: 0, why: 'A nhắc cả hai mặt (although…) + ý kiến rõ. B không có ý kiến; C dùng "agree" — đề Discussion không hỏi đồng ý.' },
        { q: 'Bạn còn 10 phút cuối giờ thi Writing mà chưa viết Task 1. Nên làm gì?', options: ['Viết thật nhanh Task 1 ~150 từ: mở bài, overview, hai thân bài ngắn', 'Bỏ Task 1, sửa Task 2 thêm cho hay', 'Viết Task 1 50 từ thật kỹ'], correct: 0, why: 'Bỏ trống hay viết dưới 150 từ đều bị trừ nặng. Overview là phần quan trọng nhất — luôn có. Lần sau: chia giờ 20/40 ngay từ đầu.' },
      ],
    },

    { t: 'h', text: '5. Chia 60 phút cho Task 1 + Task 2' },
    {
      t: 'table',
      head: ['Thứ tự', 'Task 2 trước (khuyên dùng)', 'Task 1 trước'],
      rows: [
        ['Phút 0–40', '**Task 2**: 5 dàn ý · 30 viết · 5 soát', 'Task 1: 3 đọc hình · 14 viết · 3 soát (phút 0–20)'],
        ['Phút 40–60', '**Task 1**: 3 đọc hình · 14 viết · 3 soát', 'Task 2: 5 · 30 · 5 (phút 20–60)'],
        ['Ưu điểm', 'Task 2 (2/3 điểm) được làm khi đầu óc còn tươi; không bao giờ thiếu giờ cho phần nặng nhất.', 'Khởi động nhẹ; hợp với người viết Task 1 nhanh.'],
        ['Rủi ro', 'Nếu Task 2 lố giờ, Task 1 bị ép — phải **dừng Task 2 đúng phút 40**.', 'Task 1 hay bị viết quá dài, ăn vào giờ Task 2.'],
      ],
    },
    {
      t: 'note',
      title: 'Mẹo phòng thi (bản giấy và bản máy)',
      items: [
        '**Đếm từ**: bản máy hiện số từ ở góc màn hình. Bản giấy: đếm số từ của **một dòng** (thường 10–12) × số dòng — không đếm từng chữ.',
        '**Không xoá bừa** trên bản giấy: gạch một đường ngang qua chữ sai là đủ; tẩy xoá nhiều làm mất thời gian và khó đọc.',
        '**Viết đủ, không viết quá**: Task 2 nhắm 260–290 từ, Task 1 160–190 từ. Viết 400 từ không được thêm điểm, chỉ thêm lỗi.',
        'Đeo **đồng hồ** (bản giấy) hoặc nhìn đồng hồ trên màn hình (bản máy) ở **phút 5, 35, 40, 57**.',
      ],
    },
    {
      t: 'rule',
      formula: 'Task 2: 5′ dàn ý → 30′ viết → 5′ soát · Task 1: 3′ → 14′ → 3′ · Tổng 60′',
      vi: 'Làm Task 2 trước và dừng đúng phút 40 là chiến thuật an toàn nhất cho band 5.',
    },
    {
      t: 'quiz',
      id: 't2d6-viet-dich',
      title: 'Dịch câu khung Discussion (4 câu)',
      kind: 'translate',
      grammar: 'While some people argue that…, others believe that… · In my view, … · On the one hand, there are good reasons why… · In conclusion, although…, I believe…',
      items: [
        { q: 'Trong khi một số người cho rằng AI sẽ tạo ra việc làm, những người khác tin rằng nó sẽ gây thất nghiệp.', hint: 'While some people argue that AI will create jobs, others believe that it will cause unemployment', answers: ['While some people argue that AI will create jobs, others believe that it will cause unemployment.', 'While some people argue that AI will create jobs, others believe it will cause unemployment.', 'While some people argue that artificial intelligence will create jobs, others believe that it will cause unemployment.', 'While some people argue that AI will create jobs, others believe that it will lead to unemployment.', 'While some people think that AI will create jobs, others believe that it will cause unemployment.', 'While some people argue that AI will create jobs, others think that it will cause unemployment.'] },
        { q: 'Theo tôi, trường học nên dạy học sinh dùng công nghệ có trách nhiệm.', hint: 'In my view, schools should teach students to use technology responsibly', answers: ['In my view, schools should teach students to use technology responsibly.', 'In my view, schools should teach students how to use technology responsibly.', 'In my opinion, schools should teach students to use technology responsibly.', 'In my opinion, schools should teach students how to use technology responsibly.', 'Personally, I believe that schools should teach students to use technology responsibly.'] },
        { q: 'Một mặt, có những lý do chính đáng để cấm điện thoại.', hint: 'On the one hand, there are good reasons, to ban phones / why phones should be banned', answers: ['On the one hand, there are good reasons to ban phones.', 'On the one hand, there are good reasons why phones should be banned.', 'On the one hand, there are good reasons for banning phones.', 'On the one hand, there are good reasons to ban mobile phones.', 'On the one hand, there are good reasons to ban smartphones.'] },
        { q: 'Tóm lại, dù cả hai quan điểm đều có lý, tôi tin rằng lợi ích lớn hơn.', hint: 'In conclusion, although both views have some merit, I believe that the benefits are greater', answers: ['In conclusion, although both views have some merit, I believe that the benefits are greater.', 'In conclusion, although both views have some merit, I believe the benefits are greater.', 'In conclusion, although both views are reasonable, I believe that the benefits are greater.', 'In conclusion, although both views have some merit, I believe that the benefits outweigh the drawbacks.', 'In conclusion, although both views make sense, I believe that the benefits are greater.'] },
      ],
    },

    { t: 'h', text: '6. Viết bài — AI chấm 4 tiêu chí (40 phút)' },
    {
      t: 'essay',
      id: 't2d6-viet-bai',
      task: 'Task 2',
      prompt: 'Some people believe that robots and artificial intelligence will create more jobs than they destroy, while others think they will lead to widespread unemployment. Discuss both these views and give your own opinion. Write at least 250 words.',
      minWords: 250,
      tips: [
        '**5 phút đầu**: dàn ý theo bảng ở mục 3 — chọn ý kiến, 2 lý do mỗi bên, 1 ví dụ mỗi đoạn.',
        'Thesis rõ ở cuối mở bài: **In my view, …** — TB1 bàn quan điểm bạn không chọn, TB2 quan điểm bạn chọn.',
        'Từ Ngày 6: **automation, replace human workers, artificial intelligence, keep up with, cutting-edge, retraining**; Ngày 2: **raise awareness, play a key role in**.',
        'Mỗi thân bài **P-E-E** với ví dụ cụ thể (một ngành, một nơi, một con số).',
        'Kết bài: **In conclusion, although…, I believe…** — không ý mới. Dừng ở phút 40.',
      ],
    },
  ],
};

/* ─────────────────────────── Bài tập ─────────────────────────── */

const T2D6_HOMEWORK: Lesson = {
  id: 't2d6-bai-tap',
  kind: 'homework',
  title: 'Bài tập Ngày 6',
  goal: 'Tự kiểm tra Ngày 6 bằng 34 câu có đáp án: 8 câu từ công nghệ, 6 câu điền cụm từ, 4 câu đoán nghĩa, 6 câu TFNG, 6 câu dịch, 4 câu về đề Discussion và chia giờ.',
  minutes: 40,
  blocks: [
    {
      t: 'recap',
      title: 'Bài tập hôm nay (34 câu)',
      items: [
        '**Phần I** — Từ công nghệ (8 câu trắc nghiệm) · **Phần II** — Cụm từ (6 câu điền).',
        '**Phần III** — Đoán nghĩa từ ngữ cảnh (4 câu).',
        '**Phần IV** — TFNG trên đoạn đọc ngắn (6 câu).',
        '**Phần V** — Dịch (6 câu) · **Phần VI** — Discussion & chia giờ (4 câu).',
      ],
    },
    {
      t: 'sodo',
      kind: 'mindmap',
      title: 'Ngày 6 trong một hình',
      center: '**Ngày 6**',
      branches: [
        { label: 'Từ vựng', items: ['device · innovation · automation · AI', 'keep up with · rely heavily on · have access to', 'Đoán nghĩa: định nghĩa · đồng nghĩa · but · such as · cấu tạo từ'] },
        { label: 'Đọc: TFNG', items: ['Bài có nói? → NG', 'Giống → T · ngược → F', '5 bẫy: từ trùng · mức độ · so sánh · thêm lý do · trái nghĩa'] },
        { label: 'Viết: Discussion', items: ['A · B · ý kiến riêng', 'TB1 bên không chọn · TB2 bên chọn', 'Dàn ý 5′ · Task 2 40′ · Task 1 20′'] },
      ],
    },

    { t: 'h', text: 'Phần I — Từ công nghệ (8 câu)' },
    {
      t: 'mcq',
      id: 't2d6-bt-tu',
      title: 'Phần I — Chọn từ đúng (8 câu)',
      items: [
        { q: 'Factories are using more ___ to reduce costs.', options: ['privacy', 'automation', 'gadget'], correct: 1, why: '**automation** = tự động hoá — giảm chi phí nhà máy.' },
        { q: 'This phone has a ___ camera that can take photos in the dark.', options: ['cutting-edge', 'obsolete', 'addicted'], correct: 0, why: '**cutting-edge** = tiên tiến nhất.' },
        { q: 'Some apps collect personal data and ___ users’ privacy.', options: ['upgrade', 'install', 'invade'], correct: 2, why: '**invade sb’s privacy** = xâm phạm quyền riêng tư.' },
        { q: 'Her funny video ___ and got ten million views in a day.', options: ['kept up', 'switched off', 'went viral'], correct: 2, why: '**go viral** = lan truyền mạnh trên mạng.' },
        { q: 'The ___ between rich and poor families means some children cannot study online.', options: ['digital divide', 'algorithm', 'breakthrough'], correct: 0, why: '**digital divide** = khoảng cách số.' },
        { q: 'You must ___ the software before you can use it.', options: ['invade', 'install', 'rely'], correct: 1, why: '**install software** = cài phần mềm.' },
        { q: 'Smartwatches and fitness bands are examples of ___ technology.', options: ['wearable', 'virtual', 'obsolete'], correct: 0, why: '**wearable technology** = công nghệ đeo trên người.' },
        { q: 'Many companies are developing ___ products to stay ahead of competitors.', options: ['innovate', 'innovation', 'innovative'], correct: 2, why: 'Trước danh từ **products** → tính từ **innovative**.' },
      ],
    },

    { t: 'h', text: 'Phần II — Cụm từ (6 câu)' },
    {
      t: 'quiz',
      id: 't2d6-bt-cum',
      title: 'Phần II — Điền một từ để hoàn thành cụm (6 câu)',
      kind: 'fill',
      items: [
        { q: 'It is hard to keep ___ with all the new apps.', answers: ['up'] },
        { q: 'Modern farms rely heavily ___ machines.', answers: ['on'] },
        { q: 'All students should have access ___ a computer.', answers: ['to'] },
        { q: 'I always switch ___ my phone during exams.', answers: ['off'] },
        { q: 'Video calls help grandparents stay ___ with their grandchildren. (giữ liên lạc)', answers: ['connected', 'in touch'] },
        { q: 'Many young people are addicted ___ online games.', answers: ['to'] },
      ],
    },

    { t: 'h', text: 'Phần III — Đoán nghĩa từ ngữ cảnh (4 câu)' },
    {
      t: 'mcq',
      id: 't2d6-bt-doan',
      title: 'Phần III — Đoán nghĩa từ in đậm (4 câu)',
      items: [
        { q: 'The new system is **seamless**; users move from phone to laptop without any interruption. → seamless:', options: ['liền mạch, không gián đoạn', 'đắt tiền', 'rắc rối'], correct: 0, why: 'Giải thích sau dấu chấm phẩy: "without any interruption" → liền mạch.' },
        { q: 'Unlike **frugal** shoppers, who buy only what they need, impulse buyers spend freely. → frugal:', options: ['hoang phí', 'tiết kiệm', 'vội vàng'], correct: 1, why: 'Đối lập với "spend freely" + định nghĩa "buy only what they need" → tiết kiệm.' },
        { q: 'Some apps are **malicious** — they steal passwords or damage your phone. → malicious:', options: ['miễn phí', 'phổ biến', 'độc hại'], correct: 2, why: 'Định nghĩa sau gạch ngang: steal passwords, damage your phone → độc hại.' },
        { q: '**Renewable** sources, such as wind and solar power, will never run out. → renewable:', options: ['tái tạo được', 'đắt đỏ', 'nguy hiểm'], correct: 0, why: 'Ví dụ (wind, solar) + "never run out" + cấu tạo re- (lại) + new + -able → tái tạo được (đã học Ngày 2).' },
      ],
    },

    { t: 'h', text: 'Phần IV — TFNG (6 câu)' },
    {
      t: 'passage',
      title: 'Paper Books in a Digital Age',
      paras: [
        { label: 'A', text: 'When e-readers first became popular around 2010, many experts predicted that printed books would soon disappear. Yet more than a decade later, industry figures suggest that printed books still make up roughly three quarters of book sales in both the United States and Britain.' },
        { label: 'B', text: 'Surveys suggest that young adults are among the strongest supporters of paper books. Many say they spend so much time looking at screens for work and study that they want a break when they read for pleasure. Some also enjoy collecting books and displaying them at home.' },
        { label: 'C', text: 'E-books have not disappeared, however. They remain popular with people who travel often, and with older readers, who can make the text larger. Publishers now usually release a book in both formats on the same day.' },
      ],
    },
    {
      t: 'mcq',
      id: 't2d6-bt-tfng',
      title: 'Phần IV — True / False / Not Given (6 câu)',
      items: [
        { q: '1. Around 2010, some experts believed printed books had no future.', options: ['TRUE', 'FALSE', 'NOT GIVEN'], correct: 0, why: 'A: "many experts predicted that printed books would soon disappear" → TRUE.' },
        { q: '2. E-books now make up most book sales in Britain.', options: ['TRUE', 'FALSE', 'NOT GIVEN'], correct: 1, why: 'A: printed books = **three quarters** → e-books chỉ khoảng 1/4 → "most" sai → FALSE.' },
        { q: '3. Printed books sell better in the United States than in Britain.', options: ['TRUE', 'FALSE', 'NOT GIVEN'], correct: 2, why: 'A nói "roughly three quarters… **in both**" — không so sánh hai nước → NOT GIVEN (bẫy so sánh).' },
        { q: '4. Some young adults choose paper books to reduce their screen time.', options: ['TRUE', 'FALSE', 'NOT GIVEN'], correct: 0, why: 'B: "they spend so much time looking at screens… they want a break when they read" → TRUE.' },
        { q: '5. E-books usually cost less than printed books.', options: ['TRUE', 'FALSE', 'NOT GIVEN'], correct: 2, why: 'Cả bài **không có chữ nào về giá** sách in hay sách điện tử (đoạn C chỉ nói ai dùng e-book và vì sao: travel often, make the text larger) → NOT GIVEN. Đừng dùng hiểu biết ngoài bài.' },
        { q: '6. Publishers usually release the e-book version several months after the paper version.', options: ['TRUE', 'FALSE', 'NOT GIVEN'], correct: 1, why: 'C: "release a book in both formats **on the same day**" ↔ several months after → FALSE.' },
      ],
    },

    { t: 'h', text: 'Phần V — Dịch (6 câu)' },
    {
      t: 'quiz',
      id: 't2d6-bt-dich',
      title: 'Phần V — Dịch (6 câu)',
      kind: 'translate',
      grammar: 'Từ / cụm công nghệ · khung Discussion · HTHT cho xu hướng gần đây (Ngày 5) · Ø + N chung (Ngày 1).',
      items: [
        { q: 'Công nghệ đã làm cuộc sống dễ dàng hơn.', hint: 'Technology (Ø), has made life easier', answers: ['Technology has made life easier.', 'Technology has made our lives easier.', 'Technology has made our life easier.', 'Technology has made life much easier.'] },
        { q: 'Robot có thể thay thế người lao động trong nhà máy.', hint: 'Robots, can / may, replace human workers, in factories', answers: ['Robots can replace human workers in factories.', 'Robots may replace human workers in factories.', 'Robots could replace human workers in factories.', 'Robots can replace workers in factories.', 'Robots might replace human workers in factories.'] },
        { q: 'Trẻ em dành quá nhiều thời gian trước màn hình.', hint: 'Children, spend, too much time, on screens / in front of screens', answers: ['Children spend too much time on screens.', 'Children spend too much time in front of screens.', 'Children spend too much time looking at screens.', 'Children spend too much screen time.', 'Kids spend too much time on screens.'] },
        { q: 'Một mặt, điện thoại giúp học sinh tìm thông tin nhanh chóng.', hint: 'On the one hand, phones help students, find information quickly', answers: ['On the one hand, phones help students find information quickly.', 'On the one hand, phones help students to find information quickly.', 'On the one hand, smartphones help students find information quickly.', 'On the one hand, mobile phones help students find information quickly.', 'On the one hand, phones help students find information fast.'] },
        { q: 'Theo tôi, quan điểm thứ hai thuyết phục hơn.', hint: 'In my view, the second view, is more convincing', answers: ['In my view, the second view is more convincing.', 'In my opinion, the second view is more convincing.', 'In my view, the second opinion is more convincing.', 'In my opinion, the second opinion is more convincing.', 'I believe the second view is more convincing.'] },
        { q: 'Những năm gần đây, thương mại điện tử đã tăng trưởng nhanh.', hint: 'In recent years, e-commerce (Ø), has grown rapidly', answers: ['In recent years, e-commerce has grown rapidly.', 'In recent years e-commerce has grown rapidly.', 'E-commerce has grown rapidly in recent years.', 'In recent years, e-commerce has grown quickly.', 'In recent years, online shopping has grown rapidly.'] },
      ],
    },

    { t: 'h', text: 'Phần VI — Discussion & chia giờ (4 câu)' },
    {
      t: 'mcq',
      id: 't2d6-bt-viet',
      title: 'Phần VI — Writing (4 câu)',
      items: [
        { q: 'Bài Discussion nào sẽ bị trừ TR nặng nhất?', options: ['Bàn hai quan điểm, ý kiến riêng ở thesis và kết bài', 'Bàn hai quan điểm nhưng không nêu ý kiến riêng', 'Bàn hai quan điểm, thân bài 2 dài hơn thân bài 1 khoảng 10 từ'], correct: 1, why: 'Đề yêu cầu **give your own opinion** — bỏ phần này là thiếu một phần đề.' },
        { q: 'Trong 5 phút dàn ý, việc nào nên làm TRƯỚC?', options: ['Viết câu mở bài thật hay', 'Gạch đề và chọn ý kiến', 'Học thuộc từ mới'], correct: 1, why: 'Gạch đề (A, B, câu lệnh) → chọn ý kiến → ý + ví dụ → thesis.' },
        { q: 'Theo cách chia giờ khuyên dùng, phút thứ 40 bạn nên:', options: ['bắt đầu soát Task 2', 'đang viết thân bài 1 Task 2', 'chuyển sang Task 1'], correct: 2, why: 'Task 2 trước: 0–40 phút (5 + 30 + 5), phút 40 chuyển sang Task 1 (20 phút).' },
        { q: 'Câu thesis nào phù hợp với đề Discussion?', options: ['In my view, online learning works best when it is combined with face-to-face classes.', 'I totally agree with this statement.', 'This essay will discuss many things about online learning.'], correct: 0, why: 'A nêu ý kiến **rõ ràng, có mức độ**. B dùng "agree" (đề không hỏi); C không có ý kiến.' },
      ],
    },
  ],
};

/* ───────────────────── Kiểm tra chặng 1 (Ngày 1–6) ───────────────────── */

const T2D6_KT_SCRIPT_1: { who: string; voice: 'uk-nam' | 'us-nu'; text: string }[] = [
  { who: 'Librarian', voice: 'uk-nam', text: 'Hello, Westbrook Library. How can I help you?' },
  { who: 'Sophie', voice: 'us-nu', text: "Hi, I've just moved here and I'd like to join the library, please." },
  { who: 'Librarian', voice: 'uk-nam', text: "Great. I'll fill in the form for you. What's your surname?" },
  { who: 'Sophie', voice: 'us-nu', text: "It's Delgado. D, E, L, G, A, D, O." },
  { who: 'Librarian', voice: 'uk-nam', text: 'And your address?' },
  { who: 'Sophie', voice: 'us-nu', text: "Flat four, eighteen Linden Avenue. That's L, I, N, D, E, N." },
  { who: 'Librarian', voice: 'uk-nam', text: 'Thank you. And your date of birth?' },
  { who: 'Sophie', voice: 'us-nu', text: "The thirtieth of March… sorry, no, the thirteenth. The thirteenth of March, nineteen ninety-eight." },
  { who: 'Librarian', voice: 'uk-nam', text: 'And a phone number?' },
  { who: 'Sophie', voice: 'us-nu', text: "Sure. It's oh seven eight five six, two one four, three double nine." },
  { who: 'Librarian', voice: 'uk-nam', text: "Now, membership for adults is twelve pounds a year, but are you a student?" },
  { who: 'Sophie', voice: 'us-nu', text: "Yes, I'm doing a master's at the university." },
  { who: 'Librarian', voice: 'uk-nam', text: "Then it's half price, so six pounds." },
  { who: 'Sophie', voice: 'us-nu', text: "Great. Also, do you have any clubs? I saw a poster about a film club." },
  { who: 'Librarian', voice: 'uk-nam', text: "We do, but the film club has stopped for the winter. Our book club still meets every Thursday evening, though." },
  { who: 'Sophie', voice: 'us-nu', text: "Then I'd like to join the book club, please." },
];

const T2D6_KT_SCRIPT_2: string[] = [
  "Good afternoon, everyone. Here is some information about our free and low-cost technology help sessions at Westbrook Library.",
  "First, our phone and tablet help desk is open every Tuesday morning. It's completely free. Please bring your charger, as many devices run out of battery during the session.",
  "Our computer basics course for beginners used to run on Wednesdays, but it has moved to Thursday afternoons. It costs three pounds a session, which pays for the printed handouts.",
  "Finally, there's a talk on staying safe online this Saturday. It's free, but places are limited, so you need to book by phone. Unfortunately, our online booking system isn't working at the moment.",
];

const T2D6_REVIEW: Lesson = {
  id: 't2d6-kiem-tra',
  kind: 'review',
  title: 'Kiểm tra chặng 1 (Ngày 1–6)',
  goal: 'Tự đo mức nắm chắc kiến thức và kỹ năng của Ngày 1–6 Tập 2 (mạo từ, giới từ, hiện tại hoàn thành; AWL sublist 1, môi trường, sức khoẻ, công nghệ, tiền tố – hậu tố; Listening Part 1 form · số · bảng · chép chính tả; Reading summary · notes · TFNG; Writing thân bài Opinion P-E-E, Discussion, Task 1 line graph; đoán nghĩa từ ngữ cảnh; Speaking Part 1 + Part 2; phát âm), biết chính xác phần nào cần ôn trước khi sang Ngày 7.',
  minutes: 145,
  blocks: [
    {
      t: 'recap',
      title: 'Bài kiểm tra này đo gì',
      items: [
        '**8 phần**, khoảng **145 phút** (chia hai buổi được: phần 1–5 ~68′ · phần 6–8 ~77′): Ngữ pháp · Từ vựng · Dịch · Nghe · Đọc · Viết · Nói · Phát âm — toàn bộ là kiến thức **Ngày 1–6**, không có gì mới.',
        '**Đạt** = từ **70 %** trở lên ở **từng phần**. Đầu mỗi phần ghi ngưỡng đạt và **Ngày cần ôn** nếu trượt.',
        'Mọi câu đều **mới** so với bài học (cùng kiến thức, khác ngữ liệu) — nhớ đáp án cũ không giúp được.',
        'Từ vựng có thêm 4 câu **đoán nghĩa từ ngữ cảnh** (Ngày 6). Nghe: 2 bài (Part 1 điền phiếu · bảng) + 2 câu chép chính tả + 2 mục **email / mã bưu điện** (Ngày 3), mỗi bài nghe **tối đa 2 lần**. Đọc: một bài ~270 từ, 13 câu, **20 phút**. Viết: **một thân bài Opinion P-E-E** (10′) + một bài Task 2 Discussion (40′) + một bài Task 1 line graph (20′).',
        'Đây là mốc **giữa chặng band 4.0 → 4.5**: đạt cả 8 phần nghĩa là bạn đang đi đúng nhịp để chạm band 5.0 cuối Tập 2.',
      ],
    },
    {
      t: 'sodo',
      kind: 'mindmap',
      title: 'Chặng 1 (Ngày 1–6) — những gì sẽ bị kiểm',
      center: 'Ngày 1–6',
      branches: [
        { label: 'Ngữ pháp', items: ['N1 mạo từ a / an / the / Ø, địa danh', 'N3 giới từ thời gian · nơi chốn · chuyển động · phụ thuộc', 'N5 hiện tại hoàn thành vs quá khứ đơn'], anh: 'memo' },
        { label: 'Từ vựng', items: ['N2 AWL 1–30 + môi trường', 'N4 AWL 31–60 + sức khoẻ + tiền tố / hậu tố', 'N6 công nghệ + đoán nghĩa'], anh: 'books' },
        { label: 'Nghe', items: ['N1 Part 1 form + notes', 'N3 số · ngày · giá · email', 'N5 dictation + table'], anh: 'headphone' },
        { label: 'Đọc', items: ['N2 summary (từ trong bài)', 'N4 note completion', 'N6 TFNG — 5 bẫy'], anh: 'notebook' },
        { label: 'Viết', items: ['N2 thân bài Opinion P-E-E', 'N4 Task 1 line graph', 'N6 Discussion + dàn ý 5′'], anh: 'pencil' },
        { label: 'Nói · Phát âm', items: ['N1 Part 1 Yes/No (A-R-E)', 'N3 Part 2 Describe a person', 'N5 Wh- (D-D-F) + filler', '/p b t d k ɡ/ · /ʃ/ · /θ ð/ · /tʃ dʒ/ · /z ʒ ŋ h j/ · trọng âm'], anh: 'microphone' },
      ],
      caption: 'Mỗi nhánh là một phần của bài kiểm tra. Nhánh nào trượt thì ôn đúng Ngày ghi trên nhánh đó.',
    },
    {
      t: 'note',
      title: 'Cách làm bài',
      items: [
        '**Gập sách, gập vở**: không mở lại bài học, không tra từ điển, không hỏi Gia sư AI trong lúc làm.',
        'Thời gian gợi ý (cộng **145′**): Ngữ pháp 12′ · Từ vựng 12′ · Dịch 6′ · Nghe 18′ · Đọc 20′ · Viết 70′ (thân bài Opinion 10′ + Task 2 40′ + Task 1 20′) · Nói 5′ · Phát âm 2′. Có thể chia **hai buổi**.',
        'Phần **Dịch**: cố **không bấm 💡 Gợi ý**. Bấm thì tự trừ câu đó khi tính điểm.',
        'Phần **Nghe**: đọc câu hỏi trước, mỗi bài nghe **tối đa 2 lần**, chưa mở lời thoại cho tới khi trả lời xong.',
        'Làm xong một phần thì **ghi điểm ra giấy** rồi mới sang phần sau. Cuối bài đối chiếu với bảng dưới đây.',
      ],
    },
    {
      t: 'table',
      caption: 'Cách tính điểm — ĐẠT = từ 70 % trở lên ở TỪNG phần',
      head: ['Phần', 'Số câu', 'Đạt khi', 'Chưa đạt thì ôn lại'],
      rows: [
        ['1. Ngữ pháp', '18', '≥ 13/18', 'Ngày 1 · Ngữ pháp mục 1–5 (mạo từ, địa danh) — Ngày 3 · Ngữ pháp mục 1–4 (giới từ) — Ngày 5 · Ngữ pháp mục 1–5 (HTHT vs quá khứ đơn)'],
        ['2. Từ vựng', '10 + 6 + 4', '≥ 7/10, ≥ 5/6 và ≥ 3/4', 'Ngày 2 · Từ vựng mục 1–4 — Ngày 4 · Từ vựng mục 1–5 (tiền tố / hậu tố mục 5) — Ngày 6 · Từ vựng mục 1–3 (đoán nghĩa từ ngữ cảnh: mục 3)'],
        ['3. Dịch Việt → Anh', '6', '≥ 5 câu đúng', 'Các bài dịch 💡 trong bài Ngữ pháp Ngày 1, 3, 5 và phần Dịch của Bài tập Ngày 2, 4, 6'],
        ['4. Nghe', '6 + 4 + 2 + 2', '≥ 10/14 (cộng bốn khối)', 'Ngày 1 · Nghe mục 1–3 (Part 1, bẫy sửa lời) — Ngày 3 · Nghe mục 1 (số, email, mã bưu điện) — Ngày 5 · Nghe mục 1–2 (dictation, table)'],
        ['5. Đọc', '4 + 4 + 5', '≥ 10/13', 'Ngày 2 · Đọc mục 1 (summary) — Ngày 4 · Đọc mục 1 (notes) — Ngày 6 · Đọc mục 1–2 (TFNG, 5 bẫy)'],
        ['6. Viết', '1 đoạn + 2 bài', 'AI chấm ≥ band 4.5 mỗi bài; thân bài Opinion 90–110 từ có đủ P – E – E và bám thesis cho sẵn; Task 2 ≥ 250 từ, có đủ A + B + ý kiến riêng; Task 1 ≥ 150 từ, có overview 2 câu không số, số liệu khớp hình', 'Ngày 2 · Viết mục 2–4 (P-E-E, bài Opinion) — Ngày 6 · Viết mục 2–5 (Discussion, dàn ý, chia giờ) — Ngày 4 · Viết mục 2–4 (overview, ngôn ngữ xu hướng)'],
        ['7. Nói', '4 câu Part 1 + 1 cue card', 'AI chấm ≥ band 4.5; Part 1 mỗi câu 2–3 câu; Part 2 nói ≥ 1 phút 30', 'Ngày 1 · Nói mục 1 (A-R-E) — Ngày 5 · Nói mục 1–3 (D-D-F, filler) — Ngày 3 · Nói mục 1–3 (Part 2)'],
        ['8. Phát âm', '8 dòng', '≥ 70 điểm ở ít nhất 6/8 dòng', 'Ngày 1 (/p b t d k ɡ/) — Ngày 2 (/ʃ/) — Ngày 3 (/θ ð/) — Ngày 4 (/ʃ tʃ dʒ/) — Ngày 5 (/z ʒ ŋ h j/) — Ngày 6 (trọng âm)'],
      ],
    },

    /** ───────────── 1. Ngữ pháp ───────────── **/
    { t: 'h', text: 'Phần 1 — Ngữ pháp (18 câu · đạt ≥ 13 · trượt thì ôn Ngày 1, 3, 5)' },
    {
      t: 'mcq',
      id: 't2d6-kt-ngu-phap',
      title: 'Phần 1 — Ngữ pháp (18 câu)',
      items: [
        { q: 'My cousin wants to become ___ architect.', options: ['a', 'an', 'the'], correct: 1, why: 'Nghề, số ít; **architect** bắt đầu bằng nguyên âm /ɑː/ → **an**. (Ngày 1, mục 1–2)' },
        { q: '___ unemployment is a serious problem in many rural areas.', options: ['The', 'An', 'Ø (không mạo từ)'], correct: 2, why: 'Thất nghiệp **nói chung** (không đếm được) → Ø. (Ngày 1, mục 4)' },
        { q: 'We sailed down ___ Red River to the coast.', options: ['the', 'Ø (không mạo từ)', 'a'], correct: 0, why: 'Tên **sông** → **the**. (Ngày 1, mục 5)' },
        { q: 'This is ___ most beautiful beach I have ever seen.', options: ['a', 'the', 'Ø (không mạo từ)'], correct: 1, why: '**So sánh nhất** → the. (Ngày 1, mục 3)' },
        { q: 'She has been a teacher at ___ University of Da Nang since 2018.', options: ['Ø (không mạo từ)', 'a', 'the'], correct: 2, why: 'Tên có "**of**" → **the** University of… (Ngày 1, mục 5)' },
        { q: 'The festival takes place ___ 15 April every year.', options: ['in', 'at', 'on'], correct: 2, why: 'Ngày tháng **cụ thể** → **on** 15 April. (in April — chỉ có tháng; at + giờ.) (Ngày 3, mục 1)' },
        { q: 'Please return the books ___ next Monday.', options: ['until', 'by', 'during'], correct: 1, why: '**by** = hạn chót. (Ngày 3, mục 1)' },
        { q: 'Our office is ___ the fifth floor.', options: ['in', 'at', 'on'], correct: 2, why: 'Tầng → **on**. (Ngày 3, mục 2)' },
        { q: 'Walk ___ the bridge and turn right.', options: ['between', 'across', 'into'], correct: 1, why: 'Băng qua cầu → **across**. (Ngày 3, mục 3)' },
        { q: 'Many young people are interested ___ working abroad.', options: ['on', 'in', 'at'], correct: 1, why: '**interested in** + V-ing. (Ngày 3, mục 4)' },
        { q: 'There was a sharp rise ___ the number of electric cars.', options: ['in', 'of', 'by'], correct: 0, why: '**a rise in** + cái gì tăng. (Ngày 3, mục 4)' },
        { q: 'I ___ in this city since I was a child.', options: ['have lived', 'lived', 'live'], correct: 0, why: '**since I was a child** + vẫn sống → HTHT. (Ngày 5, mục 2–3)' },
        { q: 'We ___ the museum two days ago.', options: ['visited', 'have visited', 'have been visiting'], correct: 0, why: '**two days ago** → quá khứ đơn. (Ngày 5, mục 5)' },
        { q: 'Have you ___ tried Hue beef noodle soup?', options: ['already ever', 'yet', 'ever'], correct: 2, why: 'Hỏi trải nghiệm → **Have you ever + V3?** (Ngày 5, mục 4)' },
        { q: 'She hasn’t replied to my message ___.', options: ['yet', 'already', 'just'], correct: 0, why: 'Phủ định, cuối câu → **yet**. (Ngày 5, mục 4)' },
        { q: 'They have been friends ___ fifteen years.', options: ['since', 'from', 'for'], correct: 2, why: 'Khoảng thời gian → **for**. (Ngày 5, mục 3)' },
        { q: 'Over the last decade, the cost of living ___ considerably.', options: ['rose', 'rises', 'has risen'], correct: 2, why: '**Over the last decade** (kéo tới nay) → HTHT: has **risen**. (Ngày 5, mục 5–6)' },
        { q: 'When ___ you first visit Ho Chi Minh City?', options: ['did', 'have', 'has'], correct: 0, why: '**When** hỏi mốc → quá khứ đơn. (Ngày 5, mục 5)' },
      ],
    },

    /** ───────────── 2. Từ vựng ───────────── **/
    { t: 'h', text: 'Phần 2 — Từ vựng (10 + 6 + 4 câu · đạt ≥ 7/10, ≥ 5/6 và ≥ 3/4 · trượt thì ôn Ngày 2, 4, 6)' },
    {
      t: 'p',
      text: '**2a**: điền **một từ** đúng dạng (nghĩa tiếng Việt trong ngoặc). **2b**: chọn từ / cụm đúng.',
    },
    {
      t: 'quiz',
      id: 't2d6-kt-tu-vung',
      title: 'Phần 2a — Điền từ (10 câu)',
      kind: 'fill',
      items: [
        { q: 'Burning fossil fuels produces greenhouse gas ___. (khí thải — số nhiều)', answers: ['emissions'], hint: 'Ngày 2 · môi trường' },
        { q: 'We should switch to ___ energy such as wind and solar power. (tái tạo được)', answers: ['renewable'], hint: 'Ngày 2 · môi trường' },
        { q: 'The report begins with an ___ of last year’s sales figures. (sự phân tích)', answers: ['analysis'], hint: 'Ngày 2 · AWL' },
        { q: 'There is strong ___ that exercise improves mood. (bằng chứng)', answers: ['evidence'], hint: 'Ngày 2 · AWL (evident)' },
        { q: 'Sugary drinks are one cause of ___ among teenagers. (béo phì)', answers: ['obesity'], hint: 'Ngày 4 · sức khoẻ' },
        { q: 'Milk is an important ___ of calcium for children. (nguồn)', answers: ['source'], hint: 'Ngày 4 · AWL' },
        { q: 'Eating too much salt is ___ to your health. (có hại — harm + hậu tố)', answers: ['harmful'], hint: 'Ngày 4 · hậu tố' },
        { q: 'Parking on the pavement is ___ in this city. (bất hợp pháp — tiền tố + legal)', answers: ['illegal'], hint: 'Ngày 4 · tiền tố' },
        { q: 'Video tapes are now almost ___. (lỗi thời)', answers: ['obsolete'], hint: 'Ngày 6 · công nghệ' },
        { q: '___ is replacing many jobs in factories. (sự tự động hoá)', answers: ['Automation'], hint: 'Ngày 6 · công nghệ' },
      ],
    },
    {
      t: 'mcq',
      id: 't2d6-kt-cum',
      title: 'Phần 2b — Cụm từ (6 câu)',
      items: [
        { q: 'The charity uses short films to ___ awareness of water shortages.', options: ['rise', 'raise', 'arise'], correct: 1, why: '**raise awareness** (Ngày 2).' },
        { q: 'Some scientists warn that the world could ___ oil within a century.', options: ['run out of', 'cut down', 'throw away'], correct: 0, why: '**run out of** + N = cạn kiệt (Ngày 2).' },
        { q: 'My grandfather still tries to ___ regular exercise, even at eighty.', options: ['make', 'do with', 'take'], correct: 2, why: '**take regular exercise** (Ngày 4).' },
        { q: 'Heavy smokers are ___ lung disease.', options: ['at risk of', 'in danger to', 'on risk for'], correct: 0, why: '**be at risk of** (Ngày 4).' },
        { q: 'Small shops find it difficult to ___ changes in online payment.', options: ['keep up with', 'go viral', 'switch off'], correct: 0, why: '**keep up with** = theo kịp (Ngày 6).' },
        { q: 'Thanks to the new library, villagers now ___ free computers.', options: ['rely heavily', 'have access to', 'invade'], correct: 1, why: '**have access to** (Ngày 6).' },
      ],
    },

    {
      t: 'p',
      text: '**2c**: đoán nghĩa từ **in đậm** — bạn **chưa học** những từ này; dùng manh mối ngữ cảnh (định nghĩa · đồng nghĩa · đối lập · ví dụ · cấu tạo từ — Ngày 6 mục 3).',
    },
    {
      t: 'mcq',
      id: 't2d6-kt-doan-nghia',
      title: 'Phần 2c — Đoán nghĩa từ ngữ cảnh (4 câu)',
      items: [
        { q: 'After the long flight, I felt **lethargic** — I had no energy and just wanted to lie on the sofa. → lethargic:', options: ['vui vẻ, hào hứng', 'uể oải, thiếu sức', 'đói bụng'], correct: 1, why: 'Manh mối **định nghĩa** sau gạch ngang: "no energy… just wanted to lie on the sofa" → uể oải.' },
        { q: 'Unlike the busy roads in the city, traffic in the village is **sparse**: you may see only one car an hour. → sparse:', options: ['đông đúc', 'nguy hiểm', 'thưa thớt'], correct: 2, why: 'Manh mối **đối lập** (Unlike the busy roads) + giải thích "only one car an hour" → thưa thớt.' },
        { q: '**Perishable** foods, such as milk, fish and fresh fruit, must be kept in a fridge. → perishable:', options: ['dễ hỏng', 'đắt tiền', 'nhập khẩu'], correct: 0, why: 'Manh mối **ví dụ** (milk, fish, fresh fruit) + "must be kept in a fridge" → dễ hỏng.' },
        { q: 'The bus service here is **unreliable**; you never know whether it will come on time. → unreliable:', options: ['rẻ tiền', 'đông khách', 'không đáng tin cậy'], correct: 2, why: '**Cấu tạo từ**: un- (không) + rely (tin cậy) + -able; giải thích sau dấu chấm phẩy "never know whether it will come on time".' },
      ],
    },

    /** ───────────── 3. Dịch ───────────── **/
    { t: 'h', text: 'Phần 3 — Dịch Việt → Anh (6 câu · đạt ≥ 5 · trượt thì ôn bài dịch 💡 Ngày 1–6)' },
    {
      t: 'quiz',
      id: 't2d6-kt-dich',
      title: 'Phần 3 — Dịch (6 câu)',
      kind: 'translate',
      grammar: 'a / an + nghề · Ø + N chung · the + so sánh nhất / of · giới từ thời gian – nơi chốn – phụ thuộc · have / has + V3 + for / since · quá khứ đơn + ago',
      items: [
        { q: 'Anh trai tôi là kỹ sư ở một nhà máy lớn.', hint: 'My brother is an engineer, at / in a big factory', answers: ['My brother is an engineer at a big factory.', 'My brother is an engineer in a big factory.', 'My older brother is an engineer at a big factory.', 'My brother is an engineer at a large factory.', 'My brother works as an engineer at a big factory.', 'My elder brother is an engineer at a big factory.'] },
        { q: 'Ô nhiễm không khí ảnh hưởng đến sức khoẻ của trẻ em.', hint: 'Air pollution (Ø), affects / has an effect on, children’s health', answers: ["Air pollution affects children's health.", 'Air pollution affects the health of children.', "Air pollution has an effect on children's health.", "Air pollution has an impact on children's health.", "Air pollution harms children's health."] },
        { q: 'Chị tôi đã làm việc ở ngân hàng này từ năm 2021.', hint: 'My sister, has worked, at / for this bank, since 2021', answers: ['My sister has worked at this bank since 2021.', 'My sister has worked for this bank since 2021.', 'My sister has worked in this bank since 2021.', 'My sister has been working at this bank since 2021.', 'My sister has been working for this bank since 2021.', 'My sister has been working in this bank since 2021.', 'My older sister has worked at this bank since 2021.', 'My elder sister has worked at this bank since 2021.', 'My older sister has worked for this bank since 2021.', 'My elder sister has worked for this bank since 2021.', "My sister's worked at this bank since 2021."] },
        { q: 'Chúng tôi chuyển đến Hà Nội ba năm trước.', hint: 'moved to Hanoi, three years ago', answers: ['We moved to Hanoi three years ago.', 'We moved to Ha Noi three years ago.', 'Three years ago we moved to Hanoi.', 'Three years ago, we moved to Hanoi.'] },
        { q: 'Số lượng người dùng internet tăng thêm 20%.', hint: 'The number of internet users, rose / increased, by 20%', answers: ['The number of internet users rose by 20%.', 'The number of internet users increased by 20%.', 'The number of internet users rose by 20 per cent.', 'The number of internet users increased by 20 per cent.', 'The number of internet users grew by 20%.', 'The number of Internet users rose by 20%.', 'The number of internet users went up by 20%.', 'The number of internet users rose by 20 percent.', 'The number of internet users increased by 20 percent.'] },
        { q: 'Đây là thành phố đông dân nhất ở Việt Nam.', hint: 'This is the most populated / largest city, in Vietnam', answers: ['This is the most populated city in Vietnam.', 'This is the most populous city in Vietnam.', 'This is the largest city in Vietnam.', 'This is the biggest city in Vietnam.', 'This is the most crowded city in Vietnam.', "This is Vietnam's most populated city.", "This is Vietnam's most populous city."] },
      ],
    },

    /** ───────────── 4. Nghe ───────────── **/
    { t: 'h', text: 'Phần 4 — Nghe (14 câu · đạt ≥ 10 · trượt thì ôn Ngày 1, 3, 5)' },
    { t: 'h', text: 'Recording 1 — Part 1 · Questions 1–6' },
    {
      t: 'canh',
      anh: ['telephone-receiver', 'books', 'woman-student'],
      caption: '**Sophie** (giọng Mỹ) vừa chuyển đến, gọi điện đăng ký thẻ thư viện **Westbrook Library**. Thủ thư (giọng Anh) điền phiếu.',
    },
    {
      t: 'table',
      caption: 'Westbrook Library — Membership form (ONE WORD AND/OR A NUMBER)',
      head: ['Mục', 'Thông tin'],
      rows: [
        ['Surname', '(1) ______'],
        ['Address', 'Flat 4, 18 (2) ______ Avenue'],
        ['Date of birth', '(3) ______ March 1998'],
        ['Phone', '(4) ______'],
        ['Membership fee', '£ (5) ______ per year'],
        ['Wants to join the', '(6) ______ club'],
      ],
    },
    {
      t: 'listen',
      id: 't2d6-kt-nghe-1',
      title: 'Joining a library',
      dan: { so: 'Checkpoint 1, Recording 1', boiCanh: 'a telephone conversation between a librarian and a woman who wants to join the library.', cau: [1, 6] },
      note: 'Hai giọng: Anh (nam) — Mỹ (nữ). Khoảng 1 phút 45. Nghe tối đa 2 lần.',
      lines: T2D6_KT_SCRIPT_1,
    },
    {
      t: 'quiz',
      id: 't2d6-kt-nghe-form',
      title: 'Questions 1–6 — ONE WORD AND/OR A NUMBER',
      kind: 'fill',
      items: [
        { q: '1. Surname: ___', answers: ['Delgado'] },
        { q: '2. Address: Flat 4, 18 ___ Avenue', answers: ['Linden'] },
        { q: '3. Date of birth: ___ March 1998', answers: ['13', '13th', 'thirteenth'] },
        { q: '4. Phone: ___', answers: ['07856214399', '07856 214399', '07856 214 399'] },
        { q: '5. Membership fee: £ ___ per year', answers: ['6', 'six', '6.00'] },
        { q: '6. Wants to join the ___ club', answers: ['book'] },
      ],
    },
    { t: 'h', text: 'Recording 2 — Table · Questions 7–10' },
    {
      t: 'table',
      caption: 'Technology help at Westbrook Library (ONE WORD AND/OR A NUMBER)',
      head: ['Session', 'Day', 'Cost', 'Notes'],
      rows: [
        ['Phone & tablet help', 'Tuesday', 'free', 'bring your (7) ______'],
        ['Computer basics', '(8) ______', '£ (9) ______ per session', 'pays for printed handouts'],
        ['Staying safe online (talk)', 'Saturday', 'free', 'book by (10) ______'],
      ],
    },
    {
      t: 'listen',
      id: 't2d6-kt-nghe-2',
      title: 'Technology help sessions',
      dan: { so: 'Checkpoint 1, Recording 2', boiCanh: 'an announcement about technology help sessions at a library.', cau: [7, 10] },
      note: 'Một giọng Mỹ (nam), khoảng 1 phút. Có một ngày bị đổi và một cách đặt chỗ không dùng được.',
      lines: T2D6_KT_SCRIPT_2.map((text) => ({ who: 'Library assistant', voice: 'us-nam' as const, text })),
    },
    {
      t: 'quiz',
      id: 't2d6-kt-nghe-bang',
      title: 'Questions 7–10 — ONE WORD AND/OR A NUMBER',
      kind: 'fill',
      items: [
        { q: '7. Phone & tablet help — bring your ___', answers: ['charger'] },
        { q: '8. Computer basics — Day: ___', answers: ['Thursday', 'Thursdays'] },
        { q: '9. Computer basics — £ ___ per session', answers: ['3', 'three', '3.00'] },
        { q: '10. Staying safe online — book by ___', answers: ['phone', 'telephone'] },
      ],
    },
    { t: 'h', text: 'Chép chính tả · Questions 11–12' },
    {
      t: 'dictation',
      id: 't2d6-kt-chep',
      title: 'Questions 11–12 — nghe và chép cả câu',
      items: [
        { label: '11.', spell: 'Have you ever been to the new library in the city centre?', answer: 'Have you ever been to the new library in the city centre?', alt: ['Have you ever been to the new library in the city center?'] },
        { label: '12.', spell: 'The number of people who shop online has risen sharply since 2020.', answer: 'The number of people who shop online has risen sharply since 2020.' },
      ],
    },
    { t: 'h', text: 'Email và mã bưu điện · Questions 13–14' },
    {
      t: 'dictation',
      id: 't2d6-kt-nghe-ma',
      title: 'Questions 13–14 — nghe và ghi đúng (không dấu cách thừa; hoa / thường đều được chấm)',
      items: [
        { label: '13. Email', spell: 'You can write to me at k dot nguyen underscore ninety-one at webmail dot com.', answer: 'k.nguyen_91@webmail.com' },
        { label: '14. Mã bưu điện (hai cụm ký tự, một dấu cách ở giữa)', spell: 'The postcode is M, double four, five, R, T.', answer: 'M44 5RT', alt: ['M445RT'] },
      ],
    },
    {
      t: 'note',
      title: 'Giải thích phần Nghe',
      items: [
        '**1 Delgado** — đánh vần D-E-L-G-A-D-O. **2 Linden** — L-I-N-D-E-N; số 18 đã in sẵn.',
        '**3 13** — "The **thirtieth**… **sorry, no**, the **thirteenth**" → sửa lời, lấy số sau (Ngày 1 mục 2, Ngày 3 mục 1: -teen / -ty).',
        '**4 07856214399** — "three **double nine**" = 399. **5 6** — £12 là giá người lớn; sinh viên "**half price**, so six pounds".',
        '**6 book** — film club "**has stopped** for the winter" → bẫy; "book club still meets" → Sophie chọn **book**.',
        '**7 charger** · **8 Thursday** — "used to run on **Wednesdays**, but it has moved to **Thursday**" · **9 3** — "three pounds a session" · **10 phone** — "book **by phone**… our online booking system isn’t working".',
        '**13 k.nguyen_91@webmail.com** — dot = **.** · underscore = **_** · at = **@** (Ngày 3 mục 1). **14 M44 5RT** — "double four" = **44** (mã Anh: phần đầu M44, phần sau 5RT).',
        '**11–12** — soát: **Have** you **ever been** · **the** new library · **the** city centre · **The number of** people **who** shop online **has risen** sharply **since** 2020.',
      ],
    },

    /** ───────────── 5. Đọc ───────────── **/
    { t: 'h', text: 'Phần 5 — Đọc (13 câu · 20 phút · đạt ≥ 10 · trượt thì ôn Ngày 2, 4, 6)' },
    {
      t: 'passage',
      title: 'Smarter Ways to Deal with Waste',
      intro: 'You should spend about 20 minutes on Questions 1–13, which are based on the reading passage below.',
      paras: [
        { label: 'A', text: 'Every day, the average city resident throws away about a kilogram of rubbish. In the past, most of this waste was collected on fixed days, whether the bins were full or not. As a result, lorries often drove around half-empty, burning fuel and adding to traffic, while in busy areas bins overflowed long before the next collection.' },
        { label: 'B', text: 'Some years ago, one city in northern Spain began testing "smart bins". Each bin contains a small sensor that measures how full it is and sends this information to the council every hour. Collection routes are then planned by software, so lorries only visit bins that need emptying. Within two years, the city reported that the distance driven by its lorries had fallen by 30 per cent.' },
        { label: 'C', text: 'The sensors cost about 80 euros each, and their batteries last for around ten years. However, the system depends on a reliable mobile network, and in narrow streets with old stone buildings the signal is sometimes too weak. In these areas, workers still check the bins by eye.' },
        { label: 'D', text: 'Other cities have focused on changing people’s behaviour rather than improving collection. In Taipei, residents must buy special blue bags for general rubbish, while recycling is collected free of charge. Since the policy was introduced in 2000, the amount of general rubbish thrown away by households has fallen by about half.' },
        { label: 'E', text: 'Experts say that technology and policy work best together. Smart bins can show which neighbourhoods produce the most waste, and councils can then target information campaigns at those areas. But they warn that no system will succeed unless residents understand why it matters.' },
      ],
    },
    {
      t: 'p',
      text: '**Questions 1–4.** Complete the summary below. Choose **ONE WORD ONLY** from the passage for each answer.',
    },
    {
      t: 'examples',
      items: [
        { en: 'In the past, bins were emptied on (1) ______ days. Lorries were often half-empty, wasting (2) ______. In one Spanish city, each smart bin has a (3) ______ that reports how full it is, and within two years the (4) ______ travelled by lorries dropped by 30%.', vi: 'Summary — đoạn A–B.' },
      ],
    },
    {
      t: 'quiz',
      id: 't2d6-kt-doc-tom-tat',
      title: 'Questions 1–4 — ONE WORD ONLY',
      kind: 'fill',
      items: [
        { q: '(1) bins were emptied on ___ days', answers: ['fixed'] },
        { q: '(2) Lorries were often half-empty, wasting ___', answers: ['fuel'] },
        { q: '(3) each smart bin has a ___', answers: ['sensor'] },
        { q: '(4) the ___ travelled by lorries dropped by 30%', answers: ['distance'] },
      ],
    },
    {
      t: 'p',
      text: '**Questions 5–8.** Complete the notes below. Choose **NO MORE THAN TWO WORDS AND/OR A NUMBER** from the passage for each answer.',
    },
    {
      t: 'table',
      caption: 'Smart bins and other solutions — notes',
      head: ['Mục', 'Ghi chú'],
      rows: [
        ['Sensors', '• cost: about (5) ______ euros each · • battery life: around (6) ______'],
        ['Problem', '• weak signal in (7) ______ with old stone buildings'],
        ['Taipei', '• residents buy special (8) ______ for general rubbish'],
      ],
    },
    {
      t: 'quiz',
      id: 't2d6-kt-doc-ghi-chu',
      title: 'Questions 5–8 — NO MORE THAN TWO WORDS AND/OR A NUMBER',
      kind: 'fill',
      items: [
        { q: '(5) cost: about ___ euros each', answers: ['80'] },
        { q: '(6) battery life: around ___', answers: ['ten years', '10 years'] },
        { q: '(7) weak signal in ___ with old stone buildings', answers: ['narrow streets'] },
        { q: '(8) residents buy special ___ for general rubbish', answers: ['blue bags'] },
      ],
    },
    {
      t: 'p',
      text: '**Questions 9–13.** Do the following statements agree with the information given in the passage? Choose **TRUE**, **FALSE** or **NOT GIVEN**.',
    },
    {
      t: 'mcq',
      id: 't2d6-kt-doc-tfng',
      title: 'Questions 9–13 — True / False / Not Given',
      items: [
        { q: '9. The Spanish city’s smart bins send information to the council every hour.', options: ['TRUE', 'FALSE', 'NOT GIVEN'], correct: 0, why: 'B: "sends this information to the council **every hour**" → TRUE.' },
        { q: '10. The smart bins work well in every part of the Spanish city.', options: ['TRUE', 'FALSE', 'NOT GIVEN'], correct: 1, why: 'C: in narrow streets "the signal is sometimes **too weak**", workers check by eye → **every part** sai → FALSE (bẫy mức độ).' },
        { q: '11. In Taipei, people do not pay for recycling to be collected.', options: ['TRUE', 'FALSE', 'NOT GIVEN'], correct: 0, why: 'D: "recycling is collected **free of charge**" → TRUE.' },
        { q: '12. Many other Asian cities have copied Taipei’s policy.', options: ['TRUE', 'FALSE', 'NOT GIVEN'], correct: 2, why: 'Bài không nói thành phố khác có bắt chước hay không → NOT GIVEN (bẫy thêm chi tiết).' },
        { q: '13. Experts believe technology alone can solve the waste problem.', options: ['TRUE', 'FALSE', 'NOT GIVEN'], correct: 1, why: 'E: "technology and policy work best **together**… no system will succeed unless residents understand" ↔ technology **alone** → FALSE.' },
      ],
    },
    {
      t: 'note',
      title: 'Nhìn lại phần Đọc',
      items: [
        '**Summary 1–4** gói trong đoạn A–B; chép **nguyên văn** (fixed, fuel, sensor, distance) — không viết ~~fixing~~, ~~sensors~~.',
        '**Notes 5–8**: (6) và (7), (8) là đáp án **hai từ** (ten years · narrow streets · blue bags); (5) đã có "euros" sau chỗ trống → chỉ ghi **80**.',
        '**TFNG 9–13**: câu 10 và 13 là bẫy **mức độ** (every / alone); câu 12 là bẫy **thêm chi tiết** — bài không nói.',
      ],
    },

    /** ───────────── 6. Viết ───────────── **/
    { t: 'h', text: 'Phần 6 — Viết (1 đoạn + 2 bài · 70 phút · đạt khi AI chấm ≥ band 4.5 mỗi bài và đủ cấu trúc · trượt thì ôn Ngày 2, 4, 6)' },
    {
      t: 'p',
      text: '**Bài 6a (10 phút)** — thân bài Opinion: đề và mở bài cho sẵn, bạn viết **một** thân bài P-E-E (Ngày 2). **Bài 6b–6c** làm như thi thật: **Task 2 trước (40 phút)**, rồi **Task 1 (20 phút)**. Task 2 là đề **Discussion** (Ngày 6) — dùng thân bài **P-E-E** (Ngày 2). Task 1 là **line graph** (Ngày 4) — overview 2 câu không số.',
    },
    {
      t: 'essay',
      id: 't2d6-kt-viet-opinion',
      task: 'Task 2',
      prompt: 'Bài 6a — Opinion, chỉ viết MỘT thân bài (90–110 từ). ĐỀ: Some people think that private cars should be banned from city centres. To what extent do you agree or disagree? — MỞ BÀI CHO SẴN (không viết lại): "In many cities, streets in the centre are filled with cars for most of the day. Some people argue that private cars should not be allowed in these areas at all. I largely agree with this view, mainly because a ban would make the air cleaner and city centres safer for people on foot." — YÊU CẦU: viết thân bài 1 về lý do "cleaner air" theo P-E-E.',
      minWords: 90,
      tips: [
        '**P**: câu chủ đề bám đúng thesis — The main reason is that / Firstly, + **cars produce exhaust fumes**… (không viết lại cả thesis).',
        '**E (giải thích)**: This means that… / As a result, … — vì sao bỏ ô tô thì không khí sạch hơn.',
        '**E (ví dụ)**: For example, … — một thành phố / một con số / một sự việc cụ thể (có thể là giả định rõ ràng).',
        'Từ Ngày 2: **exhaust fumes, emissions, air pollution, switch to public transport**; Ø + N nói chung (**Air pollution**, **Cars**).',
      ],
    },
    {
      t: 'essay',
      id: 't2d6-kt-viet-task2',
      task: 'Task 2',
      prompt: 'Some people think that the best way to improve public health is to build more sports facilities. Others, however, believe that this would have little effect and that other measures are needed. Discuss both these views and give your own opinion. Write at least 250 words.',
      minWords: 250,
      tips: [
        '5 phút dàn ý: quan điểm A (thêm sân thể thao) · quan điểm B (biện pháp khác: thuế đường, giáo dục dinh dưỡng, giờ thể dục ở trường) · ý kiến của bạn.',
        'Thesis rõ ở cuối mở bài (**In my view, …**); TB1 = bên bạn không chọn, TB2 = bên bạn chọn; mỗi thân bài **P-E-E**.',
        'Từ Ngày 4: **sedentary lifestyle, obesity, take regular exercise, be at risk of, balanced diet, processed food**; Ngày 2–4 AWL: **significant, evidence, policy, major, factor**.',
        'Soát mạo từ (Ngày 1): **Obesity / Exercise / Public health** (Ø, nói chung) · **the government**.',
      ],
    },
    {
      t: 'figure',
      fig: {
        kind: 'line',
        title: 'Average number of hours per week spent online by three age groups in one country, 2005–2025',
        note: 'Số liệu tự đặt cho bài kiểm tra.',
        unit: 'hours per week',
        categories: ['2005', '2010', '2015', '2020', '2025'],
        series: [
          { name: '16–24', values: [10, 18, 27, 35, 34] },
          { name: '25–54', values: [6, 10, 16, 24, 28] },
          { name: '55+', values: [2, 3, 5, 12, 18] },
        ],
      },
    },
    {
      t: 'essay',
      id: 't2d6-kt-viet-task1',
      task: 'Task 1',
      prompt: 'The line graph above shows the average number of hours per week that people in three age groups spent online in one country between 2005 and 2025. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words. (Data — 16–24: 2005 10, 2010 18, 2015 27, 2020 35, 2025 34 · 25–54: 6, 10, 16, 24, 28 · 55+: 2, 3, 5, 12, 18)',
      minWords: 150,
      tips: [
        'Mở bài: shows → **illustrates**; the average number of hours → **how many hours on average**; between 2005 and 2025 → **over a twenty-year period**.',
        'Overview 2 câu: cả ba nhóm **đều tăng**; nhóm **16–24 luôn cao nhất**, nhưng nhóm **55+ tăng nhanh nhất từ 2015**.',
        'Gom nhóm: Body 1 = **16–24 + 25–54** (tăng mạnh; 16–24 đạt đỉnh 35 năm 2020 rồi giảm nhẹ) · Body 2 = **55+** (gần như phẳng đến 2015, rồi tăng gấp hơn ba lần).',
        'Quá khứ đơn + **rose to / by, peaked at, dipped slightly to**; ít nhất 2 phép so sánh. Soát từng con số.',
      ],
    },

    /** ───────────── 7. Nói ───────────── **/
    { t: 'h', text: 'Phần 7 — Nói (4 câu Part 1 + 1 cue card · đạt khi AI chấm ≥ band 4.5 và Part 2 ≥ 1 phút 30 · trượt thì ôn Ngày 1, 3, 5)' },
    {
      t: 'p',
      text: 'Part 1: trộn câu **Yes/No** (A-R-E, Ngày 1) và **Wh-** (D-D-F, Ngày 5) — mỗi câu 2–3 câu, tối đa một filler. Part 2: **1 phút ghi chú** (4 ô từ khoá) rồi nói **1 phút 30 – 2 phút** (Ngày 3).',
    },
    {
      t: 'speak',
      id: 't2d6-kt-noi-p1',
      part: '1',
      questions: [
        'Do you work or are you a student?',
        'What do you like most about your hometown?',
        'How long have you lived in your current home?',
        'Do you think you spend too much time on your phone?',
      ],
    },
    {
      t: 'speak',
      id: 't2d6-kt-noi-p2',
      part: '2',
      questions: [
        'Describe an older person you know well. You should say: who this person is; how you know him or her; what you usually do together; and explain why this person is important to you.',
      ],
    },

    /** ───────────── 8. Phát âm ───────────── **/
    { t: 'h', text: 'Phần 8 — Phát âm (8 dòng · đạt ≥ 70 điểm ở 6/8 dòng · trượt thì ôn mục phát âm Ngày 1–6)' },
    {
      t: 'phatam',
      id: 't2d6-kt-phat-am',
      title: 'Phần 8 — Phát âm (8 dòng)',
      note: 'Bấm “Nghe mẫu” một lần, rồi “Đọc & chấm”. Ghi điểm từng dòng — đạt khi ít nhất 6/8 dòng từ 70 điểm. Mỗi dòng nhắm một âm của chặng.',
      items: [
        { text: 'park, bark, write, ride', ipa: 'pɑːk bɑːk raɪt raɪd', vi: 'N1 · /p/ bật hơi ≠ /b/ · /t/ ≠ /d/ cuối' },
        { text: 'I work part-time near the bus stop.', ipa: 'aɪ wɜːk pɑːt taɪm nɪə ðə bʌs stɒp', vi: 'N1 · âm cuối /k t p/' },
        { text: 'Pollution is a serious environmental issue.', ipa: 'pəluːʃn ɪz ə sɪəriəs ɪnvaɪrənmentl ɪʃuː', vi: 'N2 · /ʃ/ trong pollution, issue' },
        { text: 'I think three of my teachers helped me.', ipa: 'aɪ θɪŋk θriː əv maɪ tiːtʃəz helpt mi', vi: 'N3 · /θ/ trong think, three' },
        { text: 'Children should eat fresh vegetables.', ipa: 'tʃɪldrən ʃʊd iːt freʃ vedʒtəblz', vi: 'N4 · /tʃ/ · /ʃ/ · /dʒ/' },
        { text: 'I usually read in the evening.', ipa: 'aɪ juːʒuəli riːd ɪn ði iːvnɪŋ', vi: 'N5 · /j ʒ/ trong usually · /ŋ/ cuối' },
        { text: 'Young people have used the app for years.', ipa: 'jʌŋ piːpl həv juːzd ði æp fə jɪəz', vi: 'N5 · /j/ trong young, used, years · /h/' },
        { text: 'Technology and innovation are changing education.', ipa: 'teknɒlədʒi ənd ɪnəveɪʃn ə tʃeɪndʒɪŋ edʒukeɪʃn', vi: 'N6 · tech-NO-lo-gy · inno-VA-tion · edu-CA-tion' },
      ],
    },

    /** ───────────── Tổng kết ───────────── **/
    {
      t: 'recap',
      title: 'Xong bài kiểm tra — bước tiếp theo',
      items: [
        '**Đạt cả 8 phần** (mỗi phần ≥ 70 %) → sang **Ngày 7** (tương lai will / be going to; Listening Part 2 bản đồ — giọng Mỹ; Part 2 Describe a place). Bạn đã xong một phần tư Tập 2!',
        'Chưa đạt **Ngữ pháp / Dịch** → ôn **Ngày 1** (mạo từ: mục 3–5, nhất là **Ø khi nói chung** mục 4), **Ngày 3** (giới từ: mục 1–4, nhất là **by / until** và **in / by / to** trong Task 1), **Ngày 5** (HTHT vs quá khứ đơn: mục 5); làm lại các bài dịch 💡 sai.',
        'Chưa đạt **Từ vựng** → mở lại bài từ vựng **Ngày 2, 4, 6**, dùng nút "Che nghĩa / Che từ"; bảng **tiền tố / hậu tố** Ngày 4 mục 5; sai phần 2c thì làm lại **đoán nghĩa từ ngữ cảnh** Ngày 6 mục 3; ôn bộ Flashcards "Từ của khoá — Tập 2".',
        'Chưa đạt **Nghe** → làm lại **Ngày 1** (Part 1: bẫy sửa lời), **Ngày 3** (số, email, mã bưu điện, -teen / -ty), **Ngày 5** (dictation 4 lượt, table). Chưa đạt **Đọc** → **Ngày 2** (summary), **Ngày 4** (notes — dùng tiêu đề), **Ngày 6** (TFNG — 5 bẫy).',
        'Chưa đạt **Viết** → **Ngày 2** (bài 6a sai: thân bài Opinion P-E-E, so bài band 5 với bài band 6.0–6.5), **Ngày 4** (overview 2 câu, soát số), **Ngày 6** (Discussion: ý kiến riêng, dàn ý 5′, chia giờ). Chưa đạt **Nói / Phát âm** → **Ngày 1** (A-R-E), **Ngày 3** (Part 2: 4 ô ghi chú), **Ngày 5** (D-D-F, filler) và mục phát âm từng ngày. Ôn xong thì **làm lại đúng phần đó**.',
      ],
    },
  ],
};

export const NGAY_6: Lesson[] = [T2D6_VOCAB, T2D6_READING, T2D6_WRITING, T2D6_HOMEWORK, T2D6_REVIEW];
