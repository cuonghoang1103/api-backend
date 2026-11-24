/**
 * Đề 11 — Academic Writing, Tập 5 · Ngày 24 (docs/ielts-lo-trinh-0-8.md mục 4.2). TỰ SOẠN 24/11/2026.
 * Task 1: PROCESS HAI GIAI ĐOẠN (Tập 5 N12 "quy trình 2 giai đoạn"; bị động + rút gọn N7) — chai nhựa cũ thành áo khoác nỉ (fleece):
 * giai đoạn 1 ở nhà máy tái chế (`figure`, 5 bước), giai đoạn 2 ở nhà máy dệt (`figure2`, 6 bước). FigureView đánh số "BƯỚC 1…" lại
 * từ đầu ở mỗi hình ⇒ người viết phải tự nối hai giai đoạn (viên nhựa — pellets — là mắt xích).
 * Task 2: DISCUSSION "Discuss both these views and give your own opinion" (Tập 5 N10 "Discussion band 8 — đánh giá hai góc & lập
 * trường tinh"; cleft / concession vừa đủ N13; register N15), chủ đề: bảo tàng có nên trả cổ vật về nước gốc.
 * Sơ đồ TỰ DỰNG cho bài thi thử; các con số (270°C, khoảng 25 chai một áo) là số minh hoạ, không phải tiêu chuẩn của nhà máy nào.
 * KHÔNG trùng đề: process dầu ô-liu (Đề 5), bấc (cork — passage Tập 4 N21) đã dùng; Discussion về mục đích đại học (Đề 6), dạy nấu
 * ăn (Đề 2), tài trợ nghệ thuật / nghiên cứu khoa học (Tập 3–4) đã dùng.
 * Người làm Đề 11 nhắm band 8.0 ⇒ bài mẫu ở mức band 8.0–8.5. Để nhãn band TRUNG THỰC và để người học tập SOI, mỗi bài CỐ Ý GIỮ 2
 * lỗi nhỏ (giới từ, hoà hợp chủ – vị, mạo từ) — mục "🔎 Soi lỗi" trong `phanTich` chỉ rõ + cách sửa. KHÔNG phải lỗi soạn thảo: sửa
 * câu thì phải sửa luôn phần phân tích và test (`thiMayCham.test.ts` kiểm bốn chuỗi lỗi này có thật trong bài).
 */
import type { DeViet } from './types';

export const VIET_DE11: DeViet = {
  id: 'viet-de11',
  kyNang: 'viet',
  ten: 'Academic Writing — Đề 11 (Tập 5 · Ngày 24)',
  boDe: 'Đề 11',
  capDo: 'Band 8.0',
  moTa: 'Task 1: how used plastic bottles are made into fleece jackets (process diagram in two stages) · Task 2: should museums return historical objects to their countries of origin? (discuss both views)',
  phut: 60,
  task: [
    {
      so: 1,
      phut: 20,
      minTu: 150,
      de: 'The diagrams below show the two stages by which used plastic bottles are made into fleece jackets.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.\n\nWrite at least 150 words.',
      figure: {
        kind: 'process',
        title: 'Stage 1 — at the recycling plant',
        note: 'Sơ đồ tự dựng cho bài thi thử; 270°C là số minh hoạ, không phải tiêu chuẩn của nhà máy nào.',
        steps: [
          { label: 'Collection', note: 'used bottles collected from recycling bins; delivered in bales' },
          { label: 'Sorting', note: 'sorted by colour (clear / coloured); caps and labels removed' },
          { label: 'Washing', note: 'washed in hot water' },
          { label: 'Shredding', note: 'cut into small flakes' },
          { label: 'Melting', note: 'flakes dried, melted at 270°C and formed into pellets' },
        ],
      },
      figure2: {
        kind: 'process',
        title: 'Stage 2 — at the textile mill',
        note: 'Sơ đồ tự dựng cho bài thi thử; "khoảng 25 chai cho một áo" là số minh hoạ.',
        steps: [
          { label: 'Extrusion', note: 'pellets melted again; forced through tiny holes to form long threads' },
          { label: 'Cutting', note: 'threads stretched, then cut into short fibres' },
          { label: 'Spinning', note: 'fibres spun into yarn' },
          { label: 'Knitting', note: 'yarn knitted into fabric' },
          { label: 'Brushing', note: 'fabric brushed to raise a soft surface; dyed' },
          { label: 'Sewing', note: 'fabric cut and sewn into jackets (about 25 bottles per jacket)' },
        ],
      },
      moTaSo: 'Process diagram in TWO stages (two separate diagrams), eleven steps in a fixed linear order: how used plastic bottles are made into fleece jackets. STAGE 1, at the recycling plant, five steps: (1) Collection: used bottles collected from recycling bins and delivered in bales. (2) Sorting: sorted by colour (clear / coloured); caps and labels removed. (3) Washing: washed in hot water. (4) Shredding: cut into small flakes. (5) Melting: flakes dried, melted at 270°C and formed into pellets. STAGE 2, at the textile mill, six steps: (1) Extrusion: pellets melted again and forced through tiny holes to form long threads. (2) Cutting: threads stretched, then cut into short fibres. (3) Spinning: fibres spun into yarn. (4) Knitting: yarn knitted into fabric. (5) Brushing: fabric brushed to raise a soft surface; dyed. (6) Sewing: fabric cut and sewn into jackets (about 25 bottles per jacket). Main features for the overview: two stages in two places (recycling plant, then textile mill), eleven steps in all (five + six); the first stage turns bottles into plastic pellets, which are the raw material of the second stage, where they become fibre, yarn, fabric and finally garments; the plastic is melted twice. Every step should be mentioned in the correct order; the only figures are 270°C and about 25 bottles per jacket. The diagrams do not show how the pellets travel between the two sites, and give no information about cost, time or environmental benefit: no opinion or explanation from outside the diagrams.',
      goiY: [
        'Process HAI giai đoạn (Tập 5 Ngày 12): mở bài phải nói rõ có HAI sơ đồ / HAI nơi — "The diagrams illustrate how… , a process which takes place in two locations". Đổi từ: "used plastic bottles" → "discarded / waste bottles", "are made into" → "are converted / turned into".',
        'Overview (BẮT BUỘC, không chi tiết): tổng số bước (5 + 6 = 11), mỗi giai đoạn cho ra CÁI GÌ (chai → viên nhựa; viên nhựa → sợi → vải → áo) và MẮT XÍCH nối hai giai đoạn (pellets). Band 8 khác band 7 ở chỗ overview nói được LOGIC của quy trình, không chỉ đếm bước.',
        'Thân bài = hai đoạn theo hai sơ đồ. Câu mở thân 2 phải NỐI: "These pellets then pass to a textile mill, where…". Sơ đồ đánh số lại từ 1 ở giai đoạn hai — đừng viết "step 1" hai lần; dùng "the first / final step of this stage".',
        'Bị động + rút gọn (Tập 5 Ngày 7) thay cho chuỗi "then… then…": "having been collected…, the bottles arrive in bales"; "before being shredded into flakes"; "After being stretched, the threads are cut…"; mệnh đề quan hệ nối hai bước: "short fibres, which are spun into yarn".',
        'Sơ đồ ghi cụm danh từ ("Brushing: fabric brushed to raise a soft surface") — bạn phải viết thành câu đủ chủ – vị và có thể giải thích NGAY TỪ SƠ ĐỒ ("a treatment that raises the soft surface"), nhưng KHÔNG thêm kiến thức ngoài (tái chế tốt cho môi trường, polyester là gì…).',
        'Dùng đủ hai con số: "at 270°C", "roughly 25 bottles are needed for each jacket". Chú ý hoà hợp chủ – vị với chủ ngữ số nhiều và giới từ cố định "according TO", "sorted BY colour", "formed INTO pellets".',
        '20 phút: 3′ đếm bước, khoanh mắt xích pellets, chọn động từ bị động cho từng bước · 14′ viết (≈ 190–210 từ là đủ; dài hơn thường thêm lỗi chứ không thêm điểm) · 3′ soát: thì hiện tại đơn xuyên suốt, không sót bước nào, không có ý kiến riêng.',
      ],
      mau: {
        band: 'Band 8.0–8.5 (đích của Đề 11 — cố ý giữ 2 lỗi nhỏ để bạn tập soi)',
        s: 'The diagrams illustrate how discarded plastic bottles are converted into fleece jackets, a process which takes place in two locations: a recycling plant and a textile mill.\n\nOverall, there are eleven steps, five in the first stage and six in the second. The bottles are first reduced to plastic pellets, which then serve as the raw material from which fibre, yarn, fabric and, finally, garments are produced.\n\nAt the recycling plant, used bottles, having been collected from recycling bins, arrive in bales. They are sorted according their colour into clear and coloured plastic, and their caps and labels are removed. The bottles are then washed in hot water before being shredded into small flakes. In the final step of this stage, the flakes are dried and melted at 270°C, and the molten plastic is formed into pellets.\n\nThese pellets then pass to a textile mill, where they are melted once more and forced through tiny holes so that long threads emerge. After being stretched, the threads are cut into short fibres, which are spun into yarn. The yarn is knitted into fabric, and this is brushed, a treatment that raises the soft surface characteristic of fleece, and dyed. Finally, the fabric is cut and sewn into jackets; roughly 25 bottles is needed for each one.',
        phanTich: [
          '**Task Achievement (8.5)**: mở bài nói rõ hai nơi; overview hai câu nêu tổng số bước (5 + 6), sản phẩm của từng giai đoạn và vai trò của viên nhựa ("serve as the raw material from which…") — đúng "clear overview of main stages" ở mức cao nhất. Đủ cả 11 bước, đúng thứ tự, đủ hai con số (270°C, 25 chai), không thêm kiến thức ngoài sơ đồ, không ý kiến. Chi tiết "threads emerge", "the soft surface characteristic of fleece" là DIỄN GIẢI từ chữ trên sơ đồ, không phải bịa.',
          '**Coherence & Cohesion (8.5)**: 4 đoạn theo đúng hai sơ đồ; câu mở thân 2 nối hai giai đoạn bằng tham chiếu "These pellets then pass to…". Trình tự được dẫn bằng CẤU TRÚC chứ không bằng chuỗi "then": phân từ hoàn thành ("having been collected"), "before being shredded", "After being stretched", mệnh đề quan hệ ("which are spun into yarn"), "In the final step of this stage", "once more", "Finally". Tham chiếu: "They", "this stage", "this", "each one".',
          '**Lexical Resource (8)**: động từ quy trình chính xác và đa dạng: "converted into", "reduced to", "shredded", "formed into", "forced through", "emerge", "spun", "knitted", "brushed", "sewn"; cụm danh từ đúng chỗ: "the molten plastic", "the raw material", "a treatment that raises the soft surface characteristic of fleece". Không lặp "make / made". Còn một lỗi giới từ cố định (xem Soi lỗi).',
          '**Grammar (8)**: bị động hiện tại đơn xuyên suốt; phân từ hoàn thành bị động chen giữa chủ ngữ và động từ ("used bottles, having been collected…, arrive in bales"); "before being + V3", "After being + V3"; mệnh đề quan hệ không xác định; mệnh đề mục đích – kết quả "so that long threads emerge"; đồng vị ngữ giải thích ("a treatment that…"). Đa số câu không lỗi — còn một lỗi hoà hợp chủ – vị (xem dưới).',
          '🔎 **Soi lỗi — 2 chỗ CỐ Ý giữ lại (hãy tự tìm trước khi đọc tiếp)**: (1) ✗ "sorted **according their** colour" → "sorted **according to** their colour" (hoặc gọn hơn: "sorted **by** colour") — "according" luôn đi với "to"; (2) ✗ "roughly 25 bottles **is** needed" → "roughly 25 bottles **are** needed" — chủ ngữ số nhiều; lỗi SVA hay lọt ở câu cuối khi sắp hết giờ (chuỗi lỗi 7 → 8: Tập 5 Ngày 17, Ngày 23).',
          '**Vì sao chưa phải band 9**: ngoài hai lỗi trên, bài có thể nêu thêm một nhận xét khái quát mà sơ đồ cho phép: nhựa được nấu chảy HAI lần ("the plastic is melted twice, once to produce pellets and again to produce thread"), và giai đoạn một chỉ đổi HÌNH DẠNG vật liệu còn giai đoạn hai mới tạo sản phẩm.',
          '**Lỗi band 7 cần tránh**: overview chỉ đếm bước ("There are eleven steps in total."); chép cụm danh từ của sơ đồ thành câu thiếu động từ ("Then washing in hot water."); "then… then… after that… then" suốt bài; đánh số "step 1… step 5, step 1…" như sơ đồ; thêm ý kiến ("this is good for the environment"); thì quá khứ; bỏ sót bước Brushing hoặc con số 25 chai.',
        ],
      },
    },
    {
      so: 2,
      phut: 40,
      minTu: 250,
      de: 'Some people believe that museums should return important historical objects to the countries from which they were originally taken. Others argue that such objects should remain in the major museums where they are now, so that as many people as possible can see them.\n\nDiscuss both these views and give your own opinion.\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.\n\nWrite at least 250 words.',
      moTaSo: 'Discussion essay ("Discuss both these views and give your own opinion") about whether museums should return important historical objects to their countries of origin or keep them in the major museums where they are now so that as many people as possible can see them. Expected at band 8: BOTH views are presented fairly and developed (not a straw man), the writer\'s own position is clear from the introduction and consistent to the conclusion, and the essay EVALUATES the two views (explains why one is stronger, or under what conditions) rather than listing arguments; ideas are extended through claim, explanation and a relevant example or analogy; any real examples must not include invented facts or figures. Possible arguments for return: objects were often taken under colonial rule or military occupation without real consent; the right to decide belongs to the community that made them; objects regain meaning in their original setting; countries of origin now often have suitable museums; national identity and education. Possible arguments for keeping them: far larger numbers of visitors and free access in some major museums; expertise and conditions for conservation; a "universal" collection lets visitors compare civilisations; risk of damage, instability or loss; many objects were acquired legally; the difficulty of deciding who the rightful owner is today. A nuanced position (return in most cases, case by case, with loans, copies and shared exhibitions) is fully acceptable. Penalise: discussing only one view, no opinion or an opinion that appears only in the last sentence, an opinion that changes, sweeping generalisations ("all museums stole everything"), invented statistics, memorised phrases, drifting into whether museums should charge for entry, fewer than 250 words.',
      goiY: [
        'Dạng Discussion band 8 (Tập 5 Ngày 10): đề đòi BA việc — quan điểm 1, quan điểm 2, ý kiến của bạn. Nêu lập trường ngay mở bài, có MỨC ĐỘ ("in most instances", "case by case") — lập trường tinh chứ không "hoàn toàn đồng ý".',
        'Trình bày quan điểm bạn KHÔNG theo một cách công bằng và mạnh nhất có thể ("point, with some justice, to…") rồi mới phản biện. Band 7 dựng "người rơm"; band 8 thừa nhận điểm đúng rồi chỉ ra nó trả lời SAI câu hỏi hoặc không còn đủ mạnh.',
        'Bố cục 4 đoạn: Mở bài (viết lại đề + lập trường) → Thân 1: quan điểm giữ lại (lượng khách, bảo quản, "bảo tàng toàn cầu") → Thân 2: quan điểm trả về + vì sao NẶNG HƠN (quyền quyết định, hoàn cảnh bị lấy đi, phản bác lý do thực tiễn) → Kết bài: nhắc lập trường + điều kiện.',
        'Ví dụ: KHÔNG bịa số liệu hay tên hiện vật bạn không chắc. Dùng ví dụ loại ("objects removed under colonial rule"), phép so sánh ("like declining to return a borrowed book…") hoặc trường hợp bạn thật sự biết. Một phép so sánh sắc giá trị hơn một con số bịa.',
        'Từ vựng chủ đề: return / hand back / repatriate, country of origin, acquire, contested objects, colonial rule, conservation, fragile material, a universal collection, heritage, lend / long-term loan, rightful owner, case by case.',
        'Cấu trúc band 8 dùng VỪA ĐỦ (Tập 5 Ngày 13): một câu chẻ ("The issue is not where…, but who…"), một nhượng bộ ("While I accept that…", "These are serious points, but…"), hedging ("in most instances", "seem to me", "increasingly feasible"). Hai, ba chỗ là đủ — nhồi thêm thành khoe.',
        '40 phút: 5′ dàn ý (lập trường + 2 ý mỗi bên + 1 phép so sánh) · 30′ viết (≈ 290–330 từ) · 5′ soát theo bảng tự soát 6 lượt (Tập 5 Ngày 23): mạo từ với danh từ trừu tượng (humanity, heritage), giới từ sau tính từ (responsible FOR), hoà hợp chủ – vị, dấu phẩy.',
      ],
      mau: {
        band: 'Band 8.0–8.5 (đích của Đề 11 — cố ý giữ 2 lỗi nhỏ để bạn tập soi)',
        s: 'Whether museums should hand back historical objects acquired from other countries is a question that has moved from the margins of the art world to the centre of public debate. While I accept that large international museums perform a valuable service, I believe that the case for return is, in most instances, the stronger one.\n\nThose who favour keeping such objects where they are point, with some justice, to access and care. A handful of museums in a few major cities receive millions of visitors a year, far more than most institutions elsewhere could hope to attract, and they have the conservation staff and controlled conditions that fragile material requires. It is also argued that a great collection allows the visitor to compare the achievements of many civilisations under one roof, and so to see the humanity as a single story rather than a set of separate national ones.\n\nThese are serious points, but they seem to me to answer the wrong question. The issue is not where an object can be seen by the greatest number, but who has the right to decide. Many of the pieces in dispute were removed in circumstances, such as military occupation or colonial rule, in which the people who made them had no real power to refuse. To reply that they are now well looked after is rather like declining to return a borrowed book on the grounds that one has kept it dry. Moreover, the practical objections are weaker than they once were: several countries making claims have built modern museums of their own, and what cannot travel safely can be lent, copied or shared through long-term exchange. An object displayed in the place it was made for also regains a meaning that no label can supply.\n\nIn conclusion, although the great museums are right to stress access and conservation, I would argue that they are no longer the only institutions responsible of the world\'s heritage, and that returning contested objects, case by case and by agreement, is both fairer and increasingly feasible.',
        phanTich: [
          '**Task Response (8.5)**: đủ ba việc của đề. Lập trường có mức độ nêu ngay mở bài ("the case for return is, in most instances, the stronger one") và giữ tới kết bài ("case by case and by agreement"). Quan điểm đối lập được trình bày ở dạng MẠNH nhất (lượng khách, bảo quản, bộ sưu tập toàn cầu) và được thừa nhận ("with some justice", "These are serious points"). Thân 2 không chỉ nêu ý ngược lại mà ĐÁNH GIÁ: chỉ ra phe kia trả lời sai câu hỏi (ai có quyền quyết định), rồi gỡ từng lý do thực tiễn. Không có số liệu bịa; ví dụ là loại hoàn cảnh + một phép so sánh.',
          '**Coherence & Cohesion (8.5)**: 4 đoạn, mỗi đoạn một chức năng; câu chủ đề dẫn hướng lập luận ("Those who favour keeping… point… to access and care"; "These are serious points, but they seem to me to answer the wrong question"). Liên kết bằng tham chiếu nhiều hơn từ nối: "such objects", "they", "These… points", "the pieces in dispute", "the practical objections", "contested objects". Từ nối thưa: "While", "also", "Moreover", "In conclusion" — đúng mô tả band 8 "cohesion attracts no attention".',
          '**Lexical Resource (8.5)**: "hand back", "acquired", "moved from the margins… to the centre of public debate", "with some justice", "controlled conditions that fragile material requires", "under one roof", "the pieces in dispute", "military occupation or colonial rule", "no real power to refuse", "on the grounds that", "long-term exchange", "regains a meaning that no label can supply", "contested objects", "increasingly feasible". Từ ít gặp dùng đúng sắc thái, không khoe. Còn một lỗi mạo từ (xem Soi lỗi).',
          '**Grammar (8)**: mệnh đề danh ngữ làm chủ ngữ ("Whether museums should… is a question that…"); nhượng bộ ("While I accept that…", "although…"); cấu trúc đối lập nhấn "not where…, but who…" (Tập 5 Ngày 13); mệnh đề quan hệ có giới từ ("circumstances… in which the people who made them had…"); chủ ngữ là động từ nguyên mẫu + so sánh ("To reply that… is rather like declining to…"); mệnh đề quan hệ tự do ("what cannot travel safely can be lent, copied or shared"). Đa số câu không lỗi — còn một lỗi giới từ sau tính từ (xem dưới).',
          '🔎 **Soi lỗi — 2 chỗ CỐ Ý giữ lại (hãy tự tìm trước khi đọc tiếp)**: (1) ✗ "to see **the humanity** as a single story" → "to see **humanity** as a single story" ("humanity" = nhân loại là danh từ trừu tượng không đếm được, KHÔNG có "the"; so sánh "the heritage of humanity"); (2) ✗ "responsible **of** the world\'s heritage" → "responsible **for** the world\'s heritage" (responsible FOR; người Việt hay chuyển "chịu trách nhiệm VỀ / CỦA" thành "of"). Cả hai thuộc chuỗi lỗi 7 → 8 (Tập 5 Ngày 3, Ngày 17).',
          '**Vì sao chưa phải band 9**: (1) hai lỗi trên; (2) thân 2 có thể thừa nhận một giới hạn của chính lập trường mình (hiện vật mua bán hợp pháp, hoặc trường hợp không xác định được chủ nhân ngày nay) để chữ "in most instances" ở mở bài có nội dung cụ thể; (3) kết bài có thể nêu một hàm ý (bảo tàng lớn đổi vai trò từ chủ sở hữu sang đối tác trao đổi).',
          '**Lỗi band 7 cần tránh**: thân 1 chỉ có hai câu cho quan điểm mình không theo; ý kiến riêng chỉ xuất hiện ở câu cuối; khái quát quá đà ("all these objects were stolen"); bịa số ("90% of visitors…"); mở mọi câu bằng "Firstly / Secondly / Furthermore"; kết bài "both views have advantages and disadvantages"; lạc sang chuyện bảo tàng có nên miễn phí vé.',
        ],
      },
    },
  ],
};
