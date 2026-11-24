/**
 * Mục TRA CÔNG THỨC của IELTS Tập 4 — chặng 5 (Ngày 25–30). Soạn cùng `ngay/ngay25..30.ts`.
 * `tracuu.ts` ghép mảng này vào `TRA_CONG_THUC_T4.blocks` — tệp tách riêng để các phiên soạn chặng khác không giẫm lên nhau.
 *
 * Mỗi mục: `h` "(Ngày N · mục M)" + `patterns` / `table` + `rule`, chép gọn từ bài ngày đó.
 */
import type { Block } from '@/components/sach-hoc/types';

export const TRA_CONG_THUC_CHANG5: Block[] = [
  /* ───────── Ngày 25 ───────── */
  { t: 'h', text: '(Ngày 25 · mục 1–2) Gỡ câu dài Passage 3 — ba bước, tìm động từ chính' },
  {
    t: 'patterns',
    rows: [
      { formula: '① động từ chính → ② ngoặc phần phụ → ③ trục thời gian + “ai làm?”', vi: 'làm với câu dài hơn hai dòng chứa thông tin cần cho câu hỏi', examples: [{ en: 'The theory, which had been dismissed by most specialists when it was first put forward, was to become the framework on which nearly all later research was based.', vi: 'Khung: The theory was to become the framework. Thứ tự thật: put forward → dismissed → become the framework.' }] },
      { formula: 'N + V3 + by / in / at … = N (which was) + V3', vi: 'V3 sau danh từ là phần phụ; động từ chính nằm sau', examples: [{ en: 'The method developed in the 1950s proved unreliable.', vi: 'Phương pháp (được xây dựng vào thập niên 1950) hoá ra không đáng tin.' }] },
    ],
  },
  { t: 'rule', formula: 'Động từ chính = động từ ĐÃ CHIA THÌ, có chủ ngữ riêng, không đứng sau which / that / when / once', vi: 'V-ing trần, to V, V3 trần không bao giờ là động từ chính.' },

  { t: 'h', text: '(Ngày 25 · mục 3) had + V3 khi đọc — thứ tự kể khác thứ tự xảy ra' },
  {
    t: 'table',
    head: ['Tín hiệu', 'Hiểu là', 'Ví dụ'],
    rows: [
      ['by the time + V2, S + had + V3', 'đến mốc đó việc đã xong', 'By the time the findings were published, the team had already abandoned the theory.'],
      ['had + V3 + until / before', 'tình trạng cũ, sau đó ĐỔI', 'The disease had been considered incurable until the 1940s.'],
      ['had hoped / intended / been expected to', 'thực tế khác kế hoạch', 'The project had been expected to take ten years.'],
    ],
  },
  { t: 'rule', formula: 'S + V2 (mốc kể) … S + had + V3 (trước mốc)', vi: 'Thấy had + V3 ⇒ kéo sự việc về bên trái trục thời gian, bất kể nó đứng đâu trong câu.' },

  { t: 'h', text: '(Ngày 25 · mục 4) Tương lai nhìn từ quá khứ — đã xảy ra hay không?' },
  {
    t: 'table',
    head: ['Cấu trúc', 'Xảy ra?', 'Ví dụ'],
    rows: [
      ['was / were to + V', 'CÓ', 'The young clerk was to become the company\'s chairman.'],
      ['would (later) + V', 'CÓ', 'The technique would later be adopted across Europe.'],
      ['was going to + V', 'thường KHÔNG', 'The city was going to build a second line, but funds ran out.'],
      ['was to have + V3', 'KHÔNG', 'The bridge was to have opened in 1998.'],
      ['would have + V3', 'KHÔNG (giả định)', 'Without the grant, the study would have been abandoned.'],
    ],
  },
  { t: 'rule', formula: 'was to + V / would later + V = đã xảy ra  ·  was to have + V3 / would have + V3 = đã KHÔNG xảy ra', vi: 'Có “have + V3” sau was to / would ⇒ đảo ngược kết cục.' },

  { t: 'h', text: '(Ngày 25 · mục 5) to have + V3 · having + V3 — trước động từ đứng trước nó' },
  {
    t: 'patterns',
    rows: [
      { formula: 'S + is / was + said / thought / believed / known / estimated + to have (been) + V3', vi: 'việc xảy ra trước lúc người ta nói / nghĩ', examples: [{ en: 'The custom is said to have begun in the 1600s.', vi: 'Người ta nói phong tục này bắt đầu từ thế kỷ 17.' }, { en: 'Several million slips are estimated to have been sent in by volunteer readers.', vi: 'Ước tính có vài triệu phiếu do bạn đọc tình nguyện gửi tới.' }] },
      { formula: 'Having (been) + V3, S + V', vi: 'sau khi đã (bị / được) …', examples: [{ en: 'Having been rejected by three publishers, the novel became a bestseller.', vi: 'Sau khi bị ba nhà xuất bản từ chối, cuốn tiểu thuyết thành sách bán chạy.' }] },
    ],
  },
  { t: 'rule', formula: 'to have + V3 / having + V3 = TRƯỚC động từ chia thì  ·  to V / V-ing = cùng lúc', vi: 'Động từ không chia thì vẫn báo thời gian bằng have + V3.' },

  { t: 'h', text: '(Ngày 25 · mục 6–7) Chuỗi bị động — ai nghĩ, ai làm' },
  {
    t: 'table',
    head: ['Dạng', 'Nghĩa', 'Ví dụ'],
    rows: [
      ['It has long been assumed / was once believed that…', 'quan điểm cũ, số đông — không phải tác giả', 'It had long been assumed that the paintings were the work of a single artist.'],
      ['It cannot be denied / must be acknowledged that…', 'chính tác giả (nhượng bộ)', 'It cannot be denied that the scheme was costly.'],
      ['is / was being + V3', 'đang được / bị …', 'While the data were being analysed, a second outbreak was reported.'],
      ['to be + V3', 'sẽ / cần được …', 'The remaining samples were ordered to be destroyed.'],
      ['should / could / might have been + V3', 'lẽ ra phải · lẽ ra có thể · có thể đã (chưa chắc)', 'The drug should have been tested more thoroughly.'],
      ['be denied / given / refused + N', 'bị động của động từ hai tân ngữ', 'Villagers were denied access to the forest.'],
    ],
  },
  { t: 'rule', formula: 'N + V3 (believed · thought) + to have been + V3 + was / were + V3 + to be + V3', vi: 'BE đã chia thì duy nhất là động từ chính; being · to be · to have been thuộc phần phụ. Bị động không có by ⇒ không biết ai làm.' },

  { t: 'h', text: '(Ngày 25 · Đọc) Summary completion ở Passage 3 — hai kiểu' },
  {
    t: 'table',
    head: ['Kiểu', 'Quy trình', 'Lỗi mất điểm'],
    rows: [
      ['Từ trong bài', 'giới hạn từ → đọc trọn summary → đoán loại từ + loại nghĩa → định vị đầu – cuối → câu CÙNG Ý → chép nguyên chữ → đọc lại', 'đổi dạng từ · quá số từ · lấy con số thực tế thay cho kế hoạch'],
      ['Hộp từ (toàn danh từ trừu tượng)', 'đoán ý bằng tiếng Việt → khoanh nhóm gần nghĩa → tìm lời của BÀI → chọn từ đổi loại / khái quát đúng ý', 'chọn từ “nghe hợp lý” mà bài không nói · lấy ý của đoạn khác'],
    ],
  },
  { t: 'rule', formula: 'left out ⇒ absence · believed to be authoritative ⇒ trust · given official approval ⇒ endorsement · can be revised ⇒ revision', vi: 'Paraphrase mức 3–4: động từ / cả mệnh đề trong bài ⇒ một danh từ trong summary.' },
  /* ───────── Ngày 26 ───────── */
  // ───────── Ngày 26 ─────────
  { t: 'h', text: '(Ngày 26 · Từ vựng mục 5) Sáu cặp dễ nhầm — thực phẩm & truyền thông' },
  {
    t: 'table',
    head: ['Cặp', 'Khác nhau', 'Câu đúng'],
    rows: [
      ['food safety · food security', 'safety = không gây hại; security = đủ ăn, mua được', 'Drought threatens food security; an outbreak is a food safety issue.'],
      ['advertising · advert(isement)', 'advertising không đếm được; advert đếm được', 'Advertising is everywhere. / Adverts are everywhere.'],
      ['news', 'không đếm được, động từ số ít', 'a piece of news · The news is depressing.'],
      ['the media', 'động từ số ít hoặc nhiều — giữ một cách suốt bài', 'The media have / has a responsibility to…'],
      ['processed · ultra-processed', 'qua chế biến · chế biến sâu nhiều thành phần công nghiệp', 'Frozen peas are processed but not ultra-processed.'],
      ['biased · prejudiced · partial', 'nghiêng một phía · định kiến với nhóm người · thiên vị / một phần', 'a biased report · prejudiced against migrants · a partial solution'],
    ],
  },
  { t: 'rule', formula: 'much advertising / many adverts · a piece of news + is · food security (đủ ăn) ≠ food safety (không hại)', vi: 'Ba lỗi danh từ đếm được / không đếm được hay gặp nhất ở hai chủ đề này.' },

  { t: 'h', text: '(Ngày 26 · Viết mục 2 – 3) Cover letter 5 đoạn — mỗi yêu cầu một bằng chứng' },
  {
    t: 'table',
    head: ['Đoạn', 'Việc', 'Câu khung'],
    rows: [
      ['① Mở', 'Vị trí + nơi thấy tin + câu giá trị', 'I am writing to apply for the [position] advertised on [nơi]. As a [bạn là ai] who has [điểm khớp nhất], I believe I could …'],
      ['② – ③ Bằng chứng', 'Yêu cầu → việc → kết quả có số', 'The role calls for [yêu cầu]. Last [time], I led / wrote / replaced …, after which [số liệu] fell from … to …'],
      ['④ Vì sao công ty này', 'Một chi tiết riêng của công ty', 'I am particularly drawn to [công ty] because [chi tiết riêng].'],
      ['⑤ Kết', 'Gửi kèm · mời trao đổi · lịch rảnh', 'I have attached my CV … I would welcome the opportunity to discuss … I am available for an interview …'],
    ],
  },
  { t: 'rule', formula: 'The role calls for + N. · Last [time], I + V2 (hành động) …, which / after which + kết quả có số.', vi: 'Thay mọi “I am hard-working / I have good communication skills” bằng việc + kết quả đo được.' },

  { t: 'h', text: '(Ngày 26 · Viết mục 4) Email có xung đột — lịch sự mà không yếu' },
  {
    t: 'patterns',
    rows: [
      { formula: 'I appreciate that + S + V. However, I would be grateful if you could + V … by + mốc.', vi: 'Ghi nhận rồi mới đề nghị có hạn.', examples: [{ en: 'I appreciate that the start of term is a busy time. However, I would be grateful if you could confirm a payment date by 25 November.', vi: 'Tôi hiểu đầu học kỳ bận. Tuy nhiên, tôi rất biết ơn nếu anh xác nhận ngày thanh toán trước 25/11.' }] },
      { formula: 'Should + S + (not) + V …, I will (need to) + V …', vi: 'Đảo ngữ điều kiện — nêu bước tiếp theo, không đe doạ.', examples: [{ en: 'Should I not hear from you by then, I will need to refer the matter to the accounts department.', vi: 'Nếu tới lúc đó tôi chưa nhận được hồi âm, tôi sẽ cần chuyển việc này cho phòng kế toán.' }] },
      { formula: 'Having + V3 …, S + V …', vi: 'Mệnh đề phân từ hoàn thành — câu từ chối trang trọng.', examples: [{ en: 'Having given it careful consideration, I have decided to decline the offer.', vi: 'Sau khi cân nhắc kỹ, tôi quyết định từ chối lời mời.' }] },
    ],
  },
  {
    t: 'table',
    head: ['Tình huống', 'Câu mở', 'Câu then chốt'],
    rows: [
      ['Nhắc lần 2', 'I am writing to follow up on my email of [ngày] regarding …', 'I would be grateful if you could confirm when … by …'],
      ['Phàn nàn', 'I wish to draw your attention to …', 'Although I appreciate that …, I was disappointed to find that … I would therefore ask that you …'],
      ['Từ chối', 'Thank you for offering me …', 'Having given it careful consideration, I have decided to decline …, as …'],
      ['Xin gia hạn', 'I am writing to request a short extension to the deadline for …', 'owing to … I appreciate that this may cause inconvenience, and I would be happy to …'],
    ],
  },
  { t: 'rule', formula: 'Ghi nhận (I appreciate that…) → Sự việc (ngày, số, tài liệu) → Đề nghị + hạn (I would be grateful if… by…) → Bước tiếp (Should I not…, I will need to…)', vi: 'Bốn nhịp của email khó: lịch sự ở nhịp 1, cứng rắn ở nhịp 3 – 4.' },

  { t: 'h', text: '(Ngày 26 · Viết mục 3 · 9) Chào – ký và lỗi cố định của thư trang trọng' },
  {
    t: 'table',
    head: ['Muốn viết', 'Đúng', 'Sai hay gặp'],
    rows: [
      ['Chào người biết tên', 'Dear Ms Owens, (danh xưng + họ)', '~~Dear Ms Rachel Owens,~~'],
      ['Ký khi biết tên', 'Yours sincerely, · Kind regards,', '~~Yours faithfully,~~'],
      ['Chào / ký khi không biết tên', 'Dear Sir or Madam, … Yours faithfully, · Dear Hiring Manager,', '—'],
      ['Mong hồi âm', 'I look forward to hearing from you.', '~~look forward to hear~~ · ~~Please kindly reply me.~~'],
      ['Câu lý do viết', 'I am writing to …', '~~I am writing this letter to…~~ · ~~I write to…~~'],
    ],
  },
  { t: 'rule', formula: 'Dear + Ms/Mr + họ → I am writing to … → (mỗi đoạn một việc) → I would welcome / be grateful … → Yours sincerely', vi: 'Một văn phong từ câu chào tới chữ ký; không viết tắt.' },

  { t: 'h', text: '(Ngày 26 · Nói mục 2) Part 2 đề trừu tượng — NEO → NỀN → CẢNH → CÂN' },
  {
    t: 'table',
    head: ['Bước', 'Thời gian', 'Câu mở'],
    rows: [
      ['① NEO — gọi tên cụ thể', '≈ 15″', 'I\'d like to talk about what\'s often called… · In a nutshell, … · It was very simple: ‘…’'],
      ['② NỀN — vì sao có nó', '≈ 25″', 'To understand why it was such a big deal, you have to know… · For decades, … was just normal.'],
      ['③ CẢNH — một lần, có câu thoại', '≈ 45″', 'What made it real for me was… · …glanced at my screen and said, ‘…’'],
      ['④ CÂN — hai chiều', '≈ 35″', 'I wouldn\'t say it\'s perfect. · On paper…, but in practice… · That said, … · On balance, …, mainly because …'],
    ],
  },
  { t: 'rule', formula: 'NEO (tên cụ thể) → NỀN (vì sao có) → CẢNH (một lần, có câu thoại) → CÂN (On paper… in practice… · On balance…, mainly because…)', vi: 'Dùng cho mọi thẻ “ý”: a law, a rule, a piece of advice, a decision, a goal, a skill.' },

  { t: 'h', text: '(Ngày 26 · Nói mục 7) Part 3 “laws or education?” — nói rõ KHI NÀO' },
  { t: 'rule', formula: 'It depends on + tiêu chí. → When + trường hợp 1, I\'d argue… → Where … go wrong is … → So, in short: A for…, B for…', vi: 'Không dừng ở “both are important”.' },

  { t: 'h', text: '(Ngày 26 · Nói mục 8) Tốc độ tự nhiên' },
  { t: 'rule', formula: 'Từ mang nghĩa: đủ dài, rõ phụ âm cuối · Từ chức năng: /tə/ /əv/ /ən/ /kən/ /fə/ · Ngắt ở ranh giới ý · ≈ 130 – 170 từ / phút', vi: 'Nhanh mà rõ = nén phần không mang nghĩa, không nén phần mang nghĩa.' },
  /* ───────── Ngày 27 ───────── */
  { t: 'h', text: '(Ngày 27 · mục 2) Mandative subjunctive — giả định sau yêu cầu, đề xuất, sự cần thiết' },
  {
    t: 'patterns',
    rows: [
      { formula: 'It is + essential / vital / crucial / imperative / necessary + that + S + V (nguyên mẫu)', vi: 'tính từ chỉ sự cần thiết — câu giải pháp Task 2', examples: [{ en: 'It is essential that every child be taught how to assess online sources.', vi: 'Điều thiết yếu là mọi đứa trẻ phải được dạy cách đánh giá nguồn tin trên mạng.' }] },
      { formula: 'S + demand / insist / recommend / suggest / propose / require / urge + that + S + V (nguyên mẫu)', vi: 'động từ chính ở thì nào, V sau that vẫn nguyên mẫu', examples: [{ en: 'The report recommends that each school appoint a full-time counsellor.', vi: 'Bản báo cáo khuyến nghị mỗi trường bổ nhiệm một chuyên viên tư vấn toàn thời gian.' }] },
      { formula: 'the + recommendation / proposal / requirement / insistence + that + S + V (nguyên mẫu)', vi: 'danh từ cùng họ cũng kéo theo giả định', examples: [{ en: 'The proposal that drivers pay to enter the city centre met strong opposition.', vi: 'Đề xuất buộc tài xế trả phí vào trung tâm vấp phải phản đối mạnh.' }] },
      { formula: '… that + S + not + V  ·  … that + S + be + V3', vi: 'phủ định không mượn do; bị động be + V3', examples: [{ en: 'The law requires that all personal data be stored securely.', vi: 'Luật yêu cầu mọi dữ liệu cá nhân phải được lưu trữ an toàn.' }] },
    ],
  },
  { t: 'note', title: '⚠️ Hay sai', items: ['~~that he is informed~~ → that he ==be== informed.', '~~suggested me to change~~ → suggested ==that I change== / suggested ==changing==.', 'suggest / insist nêu SỰ THẬT thì chia thì thường: The data suggest that prices **are** rising.'] },
  { t: 'rule', formula: 'It is essential / S + recommend + that + S + (not) + V nguyên mẫu / be + V3', vi: 'Nguyên mẫu cho mọi ngôi, mọi thì; không chắc thì dùng should + V.' },

  { t: 'h', text: '(Ngày 27 · mục 3) Quá khứ không thật & cụm giả định cố định' },
  {
    t: 'table',
    head: ['Cấu trúc', 'Nghĩa', 'Ví dụ'],
    rows: [
      ['It is (high / about) time + S + V2', 'đã đến lúc (lẽ ra phải làm rồi)', 'It is high time governments treated loneliness as a public health issue.'],
      ['S + would rather + S khác + V2', 'muốn người khác làm gì', 'Most parents would rather their children spent less time on screens.'],
      ['as if / as though + S + were / V2', 'như thể (không đúng sự thật)', 'Some firms behave as if natural resources were unlimited.'],
      ['Be that as it may, …', 'dù thế đi nữa', 'The scheme is expensive. Be that as it may, doing nothing would cost more.'],
      ['if need be · as it were · suffice it to say · so be it · come what may', 'cụm cố định — không đổi dạng', 'Classes could, if need be, be held online.'],
    ],
  },
  { t: 'rule', formula: 'It is high time + S + V2  ·  would rather + S + V2  ·  as if + S + were', vi: 'Dạng quá khứ = điều không thật ở hiện tại; be → were cho mọi ngôi.' },

  { t: 'h', text: '(Ngày 27 · mục 4) lest · as do / as did · so too' },
  {
    t: 'patterns',
    rows: [
      { formula: '…, lest + S + (should) + V nguyên mẫu', vi: 'kẻo — không thêm not', examples: [{ en: 'Historic buildings must be recorded in detail lest they be lost for ever.', vi: 'Các công trình lịch sử phải được ghi chép chi tiết kẻo mất đi vĩnh viễn.' }] },
      { formula: 'S + V…, as + do / does / did / is / have / will + S (danh từ)', vi: 'cũng như… vậy — trợ động từ khớp thì vế trước', examples: [{ en: 'Car ownership rose sharply, as did the number of road accidents.', vi: 'Sở hữu ô tô tăng mạnh, số vụ tai nạn cũng vậy.' }] },
      { formula: '…, and so too + trợ động từ + S', vi: 'và… cũng thế (trang trọng)', examples: [{ en: 'Working patterns have changed, and so too have people\'s expectations of employers.', vi: 'Cách làm việc đã đổi, và kỳ vọng với chủ doanh nghiệp cũng thế.' }] },
    ],
  },
  { t: 'rule', formula: '…, as + trợ động từ + S  ·  …, and so too + trợ động từ + S  ·  …, lest + S + V', vi: 'Chủ ngữ là danh từ thì đảo, là đại từ thì không (as they did).' },

  { t: 'h', text: '(Ngày 27 · mục 5) Fronting — đưa một thành phần lên đầu câu' },
  {
    t: 'table',
    head: ['Kiểu', 'Khung', 'Ví dụ', 'Đảo?'],
    rows: [
      ['1 · bổ ngữ lên đầu', 'adj / V3 / cụm so sánh + be + S dài', 'Equally important is the question of who will pay. · Gone are the days when a degree guaranteed a job.', 'có'],
      ['2 · nơi chốn / nghĩa bóng', 'cụm nơi chốn + lie / stand / be / come + S', 'At the heart of the debate lies a simple question.', 'có (không mượn do)'],
      ['3 · So / Such', 'So + adj + be + S + that…', 'So complex is the tax system that few people understand it.', 'có'],
      ['4 · nhượng bộ', 'adj + as / though + S + V, … · Much as… · Try as S might', 'Important as exam results are, they do not measure creativity.', 'không'],
      ['5 · tân ngữ lên đầu', 'O / C + S + V', 'Some of these claims I find convincing; others I do not.', 'không'],
    ],
  },
  { t: 'note', title: '⚠️ Ba lỗi khi đảo', items: ['Hoà hợp với chủ ngữ đứng SAU: Among the causes ==are== low pay and long hours.', 'Không mượn do sau cụm nơi chốn: ~~does lie~~ → ==lies==.', 'Chủ ngữ phải dài, mang thông tin mới; mỗi bài 1–2 câu, ở câu chuyển ý.'] },
  { t: 'rule', formula: 'adj / nơi chốn + V + S (dài, thông tin mới)  ·  adj + as + S + V, S + V', vi: 'Cái đã biết lên đầu, cái mới ở cuối; động từ hợp với chủ ngữ đứng sau nó.' },

  { t: 'h', text: '(Ngày 27 · Bài 3) Tự chấm Speaking — bốn con số' },
  { t: 'rule', formula: 'lần im > 2 giây · từ ít gặp dùng đúng · kiểu câu phức · từ người nghe phải đoán', vi: 'FC · LR · GRA · P — con số nào xấu nhất thì luyện tiêu chí đó trước.' },
  /* ───────── Ngày 28 ───────── */
  { t: 'h', text: '(Ngày 28 · Bài 1 mục 3) Họ từ AWL 7–10 — trọng âm dịch chuyển' },
  {
    t: 'table',
    head: ['Từ gốc (nhấn)', 'Họ từ (nhấn mới)', 'Quy luật'],
    rows: [
      ['**HI**erarchy', 'hie**RAR**chical', '-ical: nhấn ngay trước hậu tố'],
      ['ideo**LO**gy', 'ideo**LO**gical', '-ical'],
      ['**CON**troversy', 'contro**VER**sial', '-ial'],
      ['in**FER**', '**IN**ference', '-ence: lùi về đầu'],
      ['am**BIG**uous', 'ambi**GU**ity', '-ity'],
      ['an**TI**cipate · **SIM**ulate', 'antici**PA**tion · simu**LA**tion', '-ation'],
    ],
  },
  { t: 'note', title: '⚠️ Lỗi hay gặp với AWL 7–10', items: ['~~comprises of~~ → comprises / consists of', 'infer (người đọc suy ra) ≠ imply (dữ liệu ngụ ý)', '~~albeit it was slow~~ → albeit slowly', '~~Notwithstanding of~~ → Notwithstanding the cost', 'whereby = by which (cơ chế), không thay where (nơi chốn)', '~~a controversy issue~~ → a controversial issue'] },
  { t: 'rule', formula: 'nhận ra nghĩa → đúng họ từ + trọng âm → đặt vào cụm', vi: 'Một từ AWL chỉ “thuộc” khi đặt được nó vào một cụm đúng trong câu của mình.' },

  { t: 'h', text: '(Ngày 28 · Bài 2 mục 2–5) Two-part question band 7 — khung câu' },
  {
    t: 'patterns',
    rows: [
      { formula: 'This essay argues that the trend is driven mainly by X and Y, and that while it benefits A, its consequences for B are more troubling.', vi: 'thesis hai vế — trả lời hai câu hỏi, hai đối tượng', examples: [{ en: 'This essay argues that the shift is driven mainly by cost, and that while it suits employers, its consequences for workers are more mixed.', vi: 'Sự chuyển dịch chủ yếu do chi phí; có lợi cho chủ, hệ quả với người lao động lẫn lộn hơn.' }] },
      { formula: 'The most powerful cause is X. · Y plays a part as well. · Z completes the picture.', vi: 'xếp hạng nguyên nhân thay cho Firstly / Secondly', examples: [{ en: 'The most powerful cause is financial. Education plays a part as well.', vi: 'Nguyên nhân mạnh nhất là tài chính. Giáo dục cũng góp phần.' }] },
      { formula: 'For individuals, the effects are largely positive. · For society, the picture is less encouraging.', vi: 'câu chủ đề gọi tên từng đối tượng của đề', examples: [{ en: 'For employers, the benefits are obvious. For employees, the picture is more complicated.', vi: 'Với chủ, lợi ích rõ. Với người làm, bức tranh phức tạp hơn.' }] },
      { formula: 'On balance, X is a sensible response for A, but unless…, B will bear an increasingly high cost.', vi: 'kết bài có điều kiện — không ý mới', examples: [{ en: 'On balance, remote study suits mature learners, but unless schools provide devices, poorer students will bear the cost.', vi: 'Học từ xa hợp người học lớn tuổi, nhưng nếu trường không cấp thiết bị, học sinh nghèo chịu thiệt.' }] },
    ],
  },
  { t: 'rule', formula: 'MB: thesis 2 vế → TB1: câu hỏi 1 → TB2–3: mỗi đối tượng / câu hỏi 2 một khổ → KB: 2 câu trả lời + điều kiện', vi: 'Đề có mấy phần thì câu chủ đề gọi tên đủ mấy phần.' },

  { t: 'h', text: '(Ngày 28 · Bài 2 mục 6) Quản lý 60 phút Writing' },
  {
    t: 'table',
    head: ['Phút', 'Việc'],
    rows: [
      ['0–3 · 3–15 · 15–18', 'Task 1: đọc hình + overview · viết ≈ 170–190 từ · soát'],
      ['18–23 · 23–53 · 53–58', 'Task 2: đếm vế + dàn ý · viết ≈ 290–330 từ · soát'],
      ['58–60', 'dự phòng; bản máy: kiểm số từ'],
    ],
  },
  { t: 'rule', formula: 'Writing = (Task 1 + 2 × Task 2) ÷ 3', vi: 'Task 2 không bao giờ được thiếu giờ, thiếu kết bài hay dưới 250 từ.' },

  { t: 'h', text: '(Ngày 28 · Bài 2 mục 7) 12 lỗi giữ bài ở band 6.5' },
  {
    t: 'table',
    head: ['#', 'Lỗi', 'Sửa'],
    rows: [
      ['1 · 2 · 3', 'câu > 30 từ · danh hoá quá đà · chủ ngữ dài thiếu động từ chính', 'tách câu · đổi về động từ · thêm động từ chính'],
      ['4 · 5 · 6', 'And / But / So mở câu · câu học thuộc · chép đề', 'However, … · vào thẳng đề · paraphrase'],
      ['7 · 8 · 9', 'thiếu vế / đối tượng · lập trường lơ lửng · ý mới ở kết bài', 'câu chủ đề gọi tên đủ · largely… but… · kết bài chỉ tóm'],
      ['10 · 11 · 12', 'khoe từ hiếm sai cụm · từ nối mỗi câu · lỗi nhỏ lặp (five millions, a master degree)', 'từ chắc cụm · nối bằng ý + quy chiếu · five million, a master\'s degree'],
    ],
  },

  { t: 'h', text: '(Ngày 28 · Bài 3) Năm câu báo hiệu bẫy Listening Part 3–4' },
  { t: 'rule', formula: 'Everyone assumes… But · Hang on… · I wouldn\'t / I\'m with… · You\'ll read… but in fact… · The obvious… The real…', vi: 'Ý đầu tiên ≠ đáp án — ghi khi người chốt nói xong.' },
  /* ───────── Ngày 29 ───────── */
  { t: 'h', text: '(Ngày 29 · mục 2–6) Bảng 20 điểm ngữ pháp C1 của Tập 4 — khuôn và ngày học' },
  {
    t: 'table',
    head: ['#', 'Điểm · Ngày', 'Khuôn'],
    rows: [
      ['1', 'Cụm danh từ phức + mạo từ · N1', 'the + (adv) adj + N + [bổ nghĩa sau] + V chia theo N chính'],
      ['2', 'Danh từ không đếm được · N1', 'Ø / much / little / a great deal of + N + V(s/es)'],
      ['3', 'HTHT cho xu hướng; thì dẫn nghiên cứu · N3', 'has / have + V3 + since / over the past… · A 2019 study found · Research has shown'],
      ['4', 'Quá khứ hoàn thành · N3', 'By + mốc quá khứ, S + had + V3'],
      ['5', 'Mệnh đề phân từ · N5', 'V-ing / V3 / Having V3 …, S + V · S + V, V-ing (kết quả)'],
      ['6', 'Chủ ngữ treo; with + N + V-ing · N5', 'chủ ngữ vế chính = người làm việc trong phân từ · S + V, with + N + V-ing / V3'],
      ['7', 'Câu chẻ; do nhấn mạnh · N7', 'It is / was + X + that… · What + S + V + is… · S + do / does / did + V'],
      ['8', 'Đảo ngữ · N7 · N19', 'Not only / Rarely / Only when… + trợ động từ + S + V · Had / Were / Should + S…'],
      ['9', 'So sánh chính xác · N9', 'exceed N by + số · twice / three times that of N · S1 + V, as did S2'],
      ['10', 'Dự báo nhiều lớp · N9', 'is projected / expected to + V · By + năm, S + will have + V3'],
      ['11', 'Mệnh đề danh ngữ · N11', 'the fact / claim + that + S + V · giới từ + whether / wh- + S + V'],
      ['12', 'Khuôn động từ · N11', 'recommend that + S + V nguyên mẫu · prevent O from V-ing · contribute to + V-ing'],
      ['13', 'Rào đón · N13', 'may / might + V · tend to / appear to + V · It is likely that… · to some extent'],
      ['14', 'Vô nhân xưng; động từ tường thuật · N13 · N17', 'It is + V3 + that… = S + is + V3 + to V / to have V3 · X argues / concedes that…'],
      ['15', 'Referencing · substitution · ellipsis · N13', 'This / Such + danh từ tóm ý · that of / those of · one(s) · do so'],
      ['16', 'Từ nối đúng liều; nhân quả tinh · N15', 'S + V, thereby + V-ing · , which in turn + V · stem from / be attributed to'],
      ['17', 'Causative · N17', 'enable / allow / force + O + to V · make / let / have + O + V · be made to V'],
      ['18', 'Điều kiện hỗn hợp; từ thay if · N19', 'If + had V3, would + V (now) · provided that + hiện tại · but for + N'],
      ['19', 'Danh hoá mức 2 · register · dấu câu · N21', 'The introduction of + N + led to + a sharp reduction in + N · ; nối hai câu đủ'],
      ['20', 'Giả định cách · trang trọng · fronting · N27', 'It is essential that + S + V nguyên mẫu · Were it not for + N · Of particular concern is + N'],
    ],
  },
  { t: 'rule', formula: 'Band 7 = 4–6 kiểu câu phức KHÁC nhau + phần lớn câu không lỗi', vi: 'Đảo ngữ, câu chẻ, giả định cách: mỗi loại 0–1 lần một bài; nhóm A (danh từ, thì) soát ở MỌI câu.' },

  { t: 'h', text: '(Ngày 29 · Đọc mục 3–4) Thứ tự passage, ngân sách giờ và luật 90 giây' },
  {
    t: 'table',
    head: ['Luật', 'Nội dung'],
    rows: [
      ['Mặc định', 'Không passage nào có quá 5 câu 🔴 ⇒ làm 1 → 2 → 3'],
      ['Đẩy lùi', 'Passage có ≥ 6 câu 🔴 ⇒ làm sau cùng'],
      ['Kéo lên', 'Passage 3 toàn dạng 🟢 / 🟡, chủ đề quen ⇒ làm thứ hai'],
      ['Ngân sách', '2 phút lướt · 16 (dễ nhất với bạn) · 19 · 22 (khó nhất) · 1 phút dự trữ = 60 — chính là nhịp 17 – 20 – 23 của Ngày 27, mỗi passage nhường 1 phút cho lượt lướt + dự trữ'],
      ['Luật 90 giây', 'Quá 90 giây chưa chốt ⇒ chọn đáp án nghiêng về nhất, ⚑ đánh dấu, đi tiếp; không để trống'],
    ],
  },
  { t: 'rule', formula: 'Hồ sơ dạng câu (🟢 🟡 🔴) → 2 phút lướt → thứ tự → 16 – 19 – 22 + luật 90 giây', vi: 'Độ khó của đề tính cho số đông; độ khó của BẠN tính theo dạng câu.' },
  /* ───────── Ngày 30 ───────── */
  { t: 'h', text: '(Ngày 30 · Từ vựng mục 1–3) Câu trả lời Part 1 band 7 — và hai lối thoát khi gặp chủ đề lạ' },
  {
    t: 'patterns',
    rows: [
      { formula: 'Trả lời thẳng + 1 chi tiết thật + 1 từ ít gặp đúng collocation (+ tối đa 1 idiom)', vi: 'Part 1, 2–3 câu, 20–30 giây', examples: [{ en: 'Honestly, it depends. A light drizzle I quite enjoy, but torrential downpours are not my cup of tea.', vi: 'Thật ra là tuỳ. Mưa phùn thì tôi thích, nhưng mưa như trút thì không phải gu của tôi.' }] },
      { formula: "I don't know much about X, but I do notice… (lối 1 — nói rộng sang chủ đề liền kề)", vi: 'không có ý về chủ đề: gắn vào trải nghiệm thật', examples: [{ en: "I'm not really into birds, but I do hear them chirping outside my flat every morning.", vi: 'Tôi không mê chim lắm, nhưng sáng nào cũng nghe chúng ríu rít ngoài nhà.' }] },
      { formula: "To be honest, it's not something I've given much thought to, but… (lối 2 — nói thật rồi chuyển)", vi: 'sau câu thú nhận phải có ít nhất một câu nội dung', examples: [{ en: "To be honest, I have two left feet, but I love watching people dance at weddings.", vi: 'Thú thật tôi nhảy rất vụng, nhưng tôi thích xem người khác nhảy ở đám cưới.' }] },
    ],
  },
  { t: 'rule', formula: 'Idiom: 0–1 mỗi câu trả lời · đúng nguyên dạng · không câu sáo · không dùng trong Task 2', vi: 'Task 2 đổi sang diễn đạt trang trọng: a double-edged sword → has both benefits and drawbacks.' },

  { t: 'h', text: '(Ngày 30 · Viết mục 1–3) Sáu mã lỗi và quy trình viết lại 4 bản' },
  {
    t: 'table',
    head: ['Mã', 'Soát gì (= lượt soát Ngày 21)'],
    rows: [
      ['V', 'thì · S–V hoà hợp · bị động đủ be + V3'],
      ['N', 'mạo từ · số nhiều · không đếm được · giới từ sau danh từ'],
      ['C', 'comma splice · câu lê thê · câu cụt'],
      ['P', 'song song · từ loại (-ed / -ing) · collocation · chủ ngữ treo'],
      ['L', 'từ nối đúng liều · this / it chỉ rõ · register · rào đón'],
      ['T', 'đủ vế đề · lập trường giữ suốt bài · ví dụ cụ thể · chính tả'],
    ],
  },
  { t: 'rule', formula: 'Bản 1 đánh mã → Bản 2 sửa ý → Bản 3 sửa câu → Bản 4 soát 6 lượt + đếm (≤ 3 lỗi)', vi: 'Sửa ý trước sửa câu; Task 1: chủ ngữ là con số (X’s figure / the proportion), không phải tên nơi chốn.' },

  { t: 'h', text: '(Ngày 30 · Nói mục 1–2) Xin nhắc lại câu hỏi đúng luật + kho 5 câu chuyện' },
  {
    t: 'table',
    head: ['Part', 'Được phép', 'Câu dùng'],
    rows: [
      ['1', 'giám khảo chỉ nhắc lại', "Sorry, could you say that again, please?"],
      ['2', 'không giải thích thẻ đề', 'đọc kỹ cả 4 dòng; ghi 4 dòng trong 1 phút'],
      ['3', 'được diễn đạt lại / giải thích', "Do you mean… or…? · Could you rephrase that? · Sorry, I'm not sure what you mean by “…”."],
    ],
  },
  {
    t: 'patterns',
    rows: [
      { formula: 'Thẻ đề → chọn chuyện trong kho (người · nơi · đồ vật · sự kiện · quyết định) → đổi GÓC theo dòng cuối → ghi 4 dòng', vi: '4 dòng: ai / ở đâu / khi nào · khoảnh khắc chính · 3 từ đắt · nhìn lại', examples: [{ en: 'In hindsight, the demo crashing was the best thing that could have happened to our team.', vi: 'Nhìn lại thì việc bản demo sập là điều tốt nhất có thể xảy ra với nhóm chúng tôi.' }] },
      { formula: "That's an interesting question — I haven't really thought about it before. · Off the top of my head, I'd say…", vi: 'câu mua giờ: đọc liền, âm yếu từ chức năng, nhấn một từ', examples: [{ en: "Off the top of my head, I'd say it depends on the person.", vi: 'Nghĩ nhanh thì tôi cho là tuỳ người.' }] },
    ],
  },
  { t: 'rule', formula: 'Không học thuộc câu: ôn Ý + TỪ, nói thành tiếng, nghe lại', vi: 'Một buổi luyện với giám khảo AI ⇒ đúng hai việc sửa: tiêu chí thấp nhất + lỗi lặp nhiều nhất.' },
];
