/**
 * Đề 9 — Academic Writing, TẬP 5 · NGÀY 8 (docs/ielts-lo-trinh-0-8.md mục 4.2: map / Problem–solution). TỰ SOẠN 24/11/2026.
 * Task 1: MAP — hai bản đồ một khu cảng năm 1995 và hiện nay (nối T3 N28 "process + map band 6: map ba mốc", ngôn ngữ thay đổi –
 * vị trí; bị động + hiện tại hoàn thành; T5 N7 "bị động + rút gọn trong Task 1"; T5 N18 sẽ học "map band 8 có mốc tương lai") ·
 * Task 2: PROBLEM / SOLUTION (nối T4 N22 "không chỉ nêu giải pháp mà ĐÁNH GIÁ nó có làm được không"; T5 N2 "band 7 vs band 8";
 * T5 N4 "lập luận sâu, ví dụ liên quan, không khái quát"), chủ đề: thiếu thợ lành nghề (thợ điện, thợ nước, thợ xây) vì đa số
 * người trẻ chọn đại học — KHÔNG trùng đề Tập 3 N18 (béo phì, kẹt xe), Tập 4 N22 (cha mẹ làm nhiều giờ), Đề 4 (thanh niên rời
 * nông thôn).
 * Bản đồ TỰ ĐẶT (thị trấn Westhaven hư cấu). `figure` = bản đồ 1995, `figure2` = bản đồ hiện nay (FigureView vẽ hai hình, kind
 * 'map': khối chữ nhật + dải đường; phía BẮC ở trên). `moTaSo` mô tả cả hai bản đồ bằng chữ — gửi kèm cho AI chấm.
 * Người làm Đề 9 nhắm band 7.0–7.5 ⇒ bài mẫu ở mức band 8.0–8.5 = đích của Tập 5. Để người học tập SOI, mỗi bài CỐ Ý GIỮ 2 lỗi nhỏ
 * đúng loại "lỗi dai dẳng" của T5 N3 (mạo từ / giới từ cố định / hoà hợp chủ–vị với danh từ chính ở xa / mẫu động từ) — mục
 * "🔎 Soi lỗi" trong `phanTich` chỉ rõ + cách sửa. KHÔNG phải lỗi soạn thảo: sửa câu thì phải sửa luôn phần phân tích + test.
 */
import type { DeViet } from './types';

const GHI_CHU = 'Bản đồ tự đặt cho bài thi thử (thị trấn hư cấu). Phía bắc ở trên.';

export const VIET_DE9: DeViet = {
  id: 'viet-de9',
  kyNang: 'viet',
  ten: 'Academic Writing — Đề 9 (Tập 5 · Ngày 8)',
  boDe: 'Đề 9',
  capDo: 'Band 7.0 → 7.5',
  moTa: 'Task 1: the harbour area of a town in 1995 and today (two maps) · Task 2: a shortage of skilled manual workers — what problems does it cause, and what could be done?',
  phut: 60,
  task: [
    {
      so: 1,
      phut: 20,
      minTu: 150,
      de: 'The maps below show the harbour area of the town of Westhaven in 1995 and today.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.\n\nWrite at least 150 words.',
      figure: {
        kind: 'map',
        title: 'Westhaven harbour area, 1995',
        note: GHI_CHU,
        map: {
          cols: 14,
          rows: 10,
          paths: [
            { x: 0, y: 5.5, w: 14, h: 0.8, label: 'Harbour Road' },
            { x: 0, y: 8.3, w: 14, h: 1.7, label: 'Sea' },
          ],
          boxes: [
            { x: 0.4, y: 0.5, w: 3.6, h: 4.5, label: 'Housing' },
            { x: 4.6, y: 0.5, w: 3.8, h: 1.8, label: 'Fields' },
            { x: 5.2, y: 3, w: 2.6, h: 2, label: 'Open-air market' },
            { x: 9, y: 0.5, w: 4.6, h: 4.5, label: 'Warehouses' },
            { x: 0.4, y: 6.6, w: 3.6, h: 1.5, label: 'Fishing harbour' },
            { x: 4.4, y: 6.6, w: 3.1, h: 1.5, label: 'Fish market' },
            { x: 7.9, y: 6.6, w: 2.9, h: 1.5, label: 'Car park' },
          ],
        },
      },
      figure2: {
        kind: 'map',
        title: 'Westhaven harbour area, today',
        note: GHI_CHU,
        map: {
          cols: 14,
          rows: 10,
          paths: [
            { x: 0, y: 5.5, w: 14, h: 0.8, label: 'Harbour Road (pedestrians only)' },
            { x: 0, y: 8.3, w: 14, h: 1.7, label: 'Sea' },
          ],
          boxes: [
            { x: 0.4, y: 0.5, w: 3.6, h: 4.5, label: 'Housing' },
            { x: 4.6, y: 0.5, w: 3.8, h: 1.8, label: 'Apartments' },
            { x: 4.6, y: 2.7, w: 3.8, h: 2.4, label: 'Shopping centre' },
            { x: 9, y: 0.5, w: 1.7, h: 2, label: 'Museum' },
            { x: 10.8, y: 0.5, w: 2.9, h: 2, label: 'Multi-storey car park' },
            { x: 9, y: 2.9, w: 4.7, h: 2.1, label: 'Hotel' },
            { x: 0.4, y: 6.6, w: 3.6, h: 1.5, label: 'Marina' },
            { x: 4.4, y: 6.6, w: 3.1, h: 1.5, label: 'Restaurants and cafés' },
            { x: 7.9, y: 6.6, w: 2.9, h: 1.5, label: 'Park and playground' },
            { x: 11.2, y: 6.6, w: 2.4, h: 1.5, label: 'Ferry terminal' },
          ],
        },
      },
      moTaSo: 'TWO MAPS of the harbour area of a fictional town, Westhaven: 1995 and today. North is at the top; the sea is along the southern edge; Harbour Road runs east–west across the middle. MAP 1 (1995): north of Harbour Road, from west to east — Housing (north-west); Fields (north, centre) with an Open-air market south of them, beside the road; Warehouses filling the north-east. South of the road, on the waterfront, from west to east — Fishing harbour; Fish market; Car park; the eastern end of the shore is empty. Harbour Road is open to traffic. MAP 2 (today): Housing unchanged (north-west); Apartments where the fields were; a Shopping centre, larger than the old market, on the site of the Open-air market; in the north-east the warehouses have gone, replaced by a Museum (one former warehouse kept and converted), a Multi-storey car park and a Hotel. South of the road, from west to east — Marina (former fishing harbour); Restaurants and cafés (former fish market); Park and playground (former car park); Ferry terminal (new, at the previously empty eastern end of the shore). Harbour Road is now for pedestrians only. Main features: the area has changed from a working port (fishing, storage) into a leisure and tourism district; only the housing and the line of the road remain; the waterfront is closed to traffic and parking has moved to a multi-storey car park away from the shore; green/open land (fields) has been built on. A good answer has an overview stating the overall change of function and what has stayed the same, organises the detail by AREA (waterfront south of the road / north of the road) or by type of change rather than listing features one by one, uses the present perfect passive and a range of change verbs (converted into, replaced by, made way for, demolished, pedestrianised), locates features precisely (in the north-east, at the eastern end, on the site of), and does not speculate about reasons or invent features/dates not shown.',
      goiY: [
        'Map hai mốc (Tập 3 Ngày 28): mở bài viết lại đề bằng từ của bạn — "The two maps illustrate how the harbour area of Westhaven has changed between 1995 and the present day." Đổi "show" → "illustrate / compare", "today" → "the present day".',
        'Overview (BẮT BUỘC, 2 câu, KHÔNG liệt kê từng công trình): (1) thay đổi về CHỨC NĂNG — từ cảng làm việc (đánh cá, kho bãi) thành khu giải trí – du lịch; (2) cái gì CÒN LẠI (khu nhà ở, tuyến đường) và thay đổi lớn nhất về giao thông (đường ven biển thành phố đi bộ). Band 8 khác band 7 ở chỗ overview nói được "khu này đổi vai trò" chứ không chỉ "có nhiều thay đổi".',
        'Chia thân bài theo KHU, không theo danh sách: Thân 1 = phía nam đường (bờ biển, tây → đông): cảng cá → bến du thuyền; chợ cá → nhà hàng; bãi xe → công viên; bến phà mới; đường thành phố đi bộ. Thân 2 = phía bắc đường: chợ trời → trung tâm mua sắm lớn hơn; ruộng → chung cư; kho → bảo tàng + khách sạn + nhà để xe nhiều tầng.',
        'Thì và thể (Tập 5 Ngày 7): mốc "today" ⇒ hiện tại hoàn thành BỊ ĐỘNG cho thay đổi ("has been converted into", "have been demolished"); quá khứ đơn cho tình trạng năm 1995 ("was occupied by"). Rút gọn cho gọn câu: "the car park, now a public park with a playground", "the warehouses that once filled the north-east".',
        'Động từ thay đổi — mỗi từ một sắc thái: convert / turn A into B (đổi công năng, giữ chỗ) · replace A with B / A make way for B (bỏ cũ, xây mới) · demolish / knock down (phá) · preserve / retain (giữ) · pedestrianise / close to traffic · extend / enlarge. Giới từ cố định: make way **for**, give way **to**, be replaced **by**, be converted **into**.',
        'Vị trí chính xác: "in the north-west", "to the north of the road", "on the waterfront", "at the eastern end of the shore", "on the site of the former market", "from west to east". KHÔNG viết "on the left / at the top" khi bản đồ có hướng bắc.',
        '20 phút: 3′ khoanh cái GIỮ / cái ĐỔI công năng / cái MỚI hẳn + nghĩ một câu về chức năng cả khu · 14′ viết · 3′ soát (mạo từ trước tên công trình, giới từ của động từ thay đổi, thì). KHÔNG giải thích nguyên nhân ("because tourism grew") và không thêm năm tháng không có trên bản đồ.',
      ],
      mau: {
        band: 'Band 8.0–8.5 (đích Tập 5 — cố ý giữ 2 lỗi nhỏ để bạn tập soi)',
        s: 'The two maps illustrate how the harbour area of Westhaven has changed between 1995 and the present day.\n\nOverall, the district has been transformed from a working port, organised around fishing and storage, into one devoted largely to leisure and tourism. While the housing in the north-west and the line of Harbour Road have been retained, almost every other feature has been either replaced or put to a new use, and the waterfront has been closed to traffic.\n\nIn 1995, the southern side of Harbour Road was occupied, from west to east, by a fishing harbour, a fish market and a car park. The harbour has since been converted into a marina, and the fish market has made way for restaurants and cafés. The car park has been turned into a public park with a playground, and a ferry terminal has been built at the eastern end of the shore, which was previously empty. Harbour Road itself is now reserved for pedestrians.\n\nNorth of the road, the most of the changes have involved redevelopment. The open-air market in the centre has been replaced by a considerably larger shopping centre, and the fields behind it have given way for a block of apartments. Of the warehouses that once filled the north-east, one has been preserved as a museum, while the remainder have been demolished to make room for a hotel and a multi-storey car park.',
        phanTich: [
          '**Task Achievement (8.5)**: mở bài viết lại đề; overview hai câu nói được điều band 7 thường thiếu — khu vực đổi CHỨC NĂNG (cảng làm việc → giải trí, du lịch) — cùng với cái còn lại (nhà ở, tuyến đường) và thay đổi giao thông. Thân bài phủ ĐỦ mọi công trình của cả hai bản đồ (7 khối năm 1995, 10 khối hiện nay) mà không thành danh sách, nêu cả chi tiết dễ sót: đầu phía đông của bờ biển trước đây để trống, một kho được giữ lại làm bảo tàng, trung tâm mua sắm LỚN hơn chợ cũ. Không suy đoán nguyên nhân.',
          '**Coherence & Cohesion (8.5)**: 4 đoạn; thân 1 = bờ biển phía nam đường, đi "from west to east"; thân 2 = phía bắc đường — người đọc không cần nhìn bản đồ vẫn hình dung được. Liên kết bằng tham chiếu và trật tự không gian thay cho từ nối máy móc: "The harbour has since been…", "Harbour Road itself", "the fields behind it", "the remainder". Câu mở thân 2 đưa trạng ngữ vị trí lên đầu ("North of the road, …") để báo chuyển khu.',
          '**Lexical Resource (8)**: động từ thay đổi đa dạng và đúng sắc thái: "transformed from… into", "retained", "put to a new use", "converted into", "made way for", "turned into", "reserved for pedestrians", "preserved as", "demolished to make room for". Cụm chính xác: "a working port", "devoted largely to leisure and tourism", "the line of Harbour Road", "considerably larger". Còn một giới từ cố định sai (xem Soi lỗi).',
          '**Grammar (8)**: hiện tại hoàn thành bị động xuyên suốt cho thay đổi, quá khứ đơn bị động cho năm 1995 ("was occupied… by"); nhượng bộ "While… have been retained, almost every other feature has been either replaced or put to a new use"; mệnh đề quan hệ không xác định ", which was previously empty"; cấu trúc đưa bộ phận lên đầu "Of the warehouses that once filled the north-east, one has been…, while the remainder have been…"; phân từ rút gọn "organised around fishing and storage". Đa số câu không lỗi — đúng mô tả band 8; còn một lỗi mạo từ (xem dưới).',
          '🔎 **Soi lỗi — 2 chỗ CỐ Ý giữ lại (hãy tự tìm trước khi đọc tiếp)**: (1) ✗ "**the most of** the changes have involved redevelopment" → "**most of** the changes…" ("most of the + N" KHÔNG có "the" đứng trước; "the most" chỉ dùng cho so sánh nhất: the most important change); (2) ✗ "the fields behind it have **given way for** a block of apartments" → "have **given way to** a block of apartments" (give way **to**; còn make way **for** — hai cụm gần nghĩa, giới từ khác nhau, và bài dùng đúng "made way for" ở đoạn trên nên càng dễ lẫn).',
          '**Muốn giữ chắc band 8.5–9**: (1) một câu nối hai khu bằng ý về giao thông: "Parking, once available on the shore itself, has been moved inland to the new multi-storey building."; (2) một danh hoá gói xu hướng: "The pedestrianisation of Harbour Road has left the entire waterfront free of vehicles."; (3) soát mạo từ và giới từ của MỌI động từ thay đổi trong 2 phút cuối — ở band 8, hai lỗi nhỏ như trên là toàn bộ khoảng cách tới 9.',
          '**Lỗi band 7 cần bỏ**: overview "There were many changes" (không nói đổi theo hướng nào); đi từng công trình theo thứ tự nhìn thấy ("First… Second… Next…"); thì hiện tại đơn cho thay đổi ("the market becomes a shopping centre"); "on the left / on the top" thay cho phương hướng; giải thích lý do ("to attract tourists"); viết "was replaced" cho mọi thay đổi (lặp một động từ).',
        ],
      },
    },
    {
      so: 2,
      phut: 40,
      minTu: 250,
      de: 'In many countries, there is a growing shortage of skilled manual workers, such as electricians, plumbers and builders, because most young people now prefer to go to university.\n\nWhat problems does this cause? What measures could be taken to deal with them?\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.\n\nWrite at least 250 words.',
      moTaSo: 'Problem/solution essay with TWO questions: (1) what problems are caused by a growing shortage of skilled manual workers (electricians, plumbers, builders) resulting from young people preferring university; (2) what measures could deal with them. Expected at band 7.5–8: BOTH questions answered with roughly equal weight; problems developed as a chain of consequences with a concrete illustration, not a list (e.g. households: long waits and high prices for repairs, unqualified workers and unsafe work; economy: housing/infrastructure/energy projects delayed, higher construction costs, dependence on foreign labour; individuals: graduates in jobs that do not need a degree while trades go unfilled); measures that are SPECIFIC (who does what) and clearly matched to the problems/cause (raising the status of vocational education in schools and careers advice, paid apprenticeships co-funded by employers and the state, grants or tax relief for firms that train, routes from trades into higher qualifications, campaigns aimed at parents, recruiting more women and career-changers) and, ideally, EVALUATED for feasibility or speed (which would work fastest, which is most realistic, limits). A clear position on which measure matters most strengthens the conclusion. Penalise: discussing only causes instead of problems (the cause is given in the question), solutions unrelated to the stated problems, vague solutions ("the government should solve this", "people should change their minds"), a list of many undeveloped ideas, turning the essay into "university versus vocational training: which is better?", memorised phrases, fewer than 250 words.',
      goiY: [
        'Đếm vế trước khi viết (Tập 4 Ngày 22): đề hỏi **problems** + **measures**. NGUYÊN NHÂN đã cho sẵn trong đề ("because most young people now prefer to go to university") ⇒ không viết một thân bài về nguyên nhân; chỉ dùng nó để chọn giải pháp TRÚNG gốc.',
        'Bố cục 4 đoạn: Mở bài (viết lại đề + câu định hướng: vấn đề ở hai tầng, giải pháp phải đổi cả vị thế lẫn tiền) → Thân 1: 2 vấn đề, mỗi vấn đề một chuỗi hệ quả + ví dụ (hộ gia đình: chờ lâu, giá cao, thợ không bằng cấp ⇒ nguy hiểm · quốc gia: dự án nhà ở, đường sắt, điện mặt trời chậm vì thiếu người) → Thân 2: 2 giải pháp + ĐÁNH GIÁ → Kết bài: vấn đề chính + giải pháp nào nhanh, giải pháp nào bền.',
        'Giải pháp band 8 = AI làm · LÀM GÌ · VÌ SAO có tác dụng · GIỚI HẠN ở đâu. "The government should encourage young people" là lời khuyên, chưa phải giải pháp. So: "Apprentices could be paid a proper wage while they train, the cost being shared between employers and the state."',
        'Đánh giá tính khả thi (bốn phép thử của Tập 4 Ngày 22: chi phí · thực thi · sự chấp nhận · giới hạn) và XẾP HẠNG hai giải pháp: "Of the two measures, the second is likely to work faster, although it is the first that would make the change last." — một câu như vậy là khác biệt giữa 7 và 8.',
        'Từ vựng chủ đề: skilled tradespeople / the skilled trades, vocational training, an apprenticeship / apprentices, technical education, a consolation prize (giải an ủi), prestige / status / standing, a financial incentive, student debt, unqualified workers, faulty wiring, for want of (vì thiếu), hold back national projects.',
        'Ví dụ LIÊN QUAN, không khái quát (Tập 5 Ngày 4): mái nhà dột chờ thợ mấy tuần; dự án nhà ở chậm "not for want of money, but because there is nobody to carry them out"; so ba năm nợ học phí với ba năm có lương. KHÔNG bịa số liệu, tên nước hay "a recent study shows".',
        '40 phút: 5′ dàn ý (2 vấn đề + 2 giải pháp khớp gốc + câu xếp hạng) · 30′ viết · 5′ soát theo sổ lỗi (Tập 5 Ngày 3: hoà hợp chủ–vị khi danh từ chính ở xa động từ, mẫu động từ "discourage sb FROM doing", mạo từ). Mục tiêu band 8: 0–1 lỗi/bài.',
      ],
      mau: {
        band: 'Band 8.0–8.5 (đích Tập 5 — cố ý giữ 2 lỗi nhỏ để bạn tập soi)',
        s: 'In rich and poor countries alike, a university degree has come to be seen as the only respectable route into adult life, with the result that fewer and fewer school leavers train as electricians, plumbers or builders. The shortage that follows imposes real costs on households and on the wider economy, and I would argue that it can be eased only by changing both the status and the financial terms of vocational training.\n\nThe most immediate problem is felt at home. When skilled tradespeople are scarce, simple repairs become slow and expensive: a family with a leaking roof may wait weeks for a builder and then pay far more than the job is worth. Worse, the gap tends to be filled by unqualified workers, whose faulty wiring or plumbing can be genuinely dangerous. At a national level, a shortage of such workers have consequences that are harder to see but more serious. Governments that have promised new housing, railways or solar farms find that these projects are delayed, not for want of money, but because there is nobody to carry them out.\n\nSince the root of the problem is largely one of prestige, the most effective measure would be to raise the standing of technical education. If schools presented apprenticeships as a first choice rather than a consolation prize, and if careers advisers stopped discouraging able teenagers to consider them, attitudes would begin to shift. Admittedly, attitudes change slowly, which is why this should be combined with a financial incentive. Apprentices could be paid a proper wage while they train, the cost being shared between employers and the state; a young person comparing three years of student debt with three years of earnings might well think again. Of the two measures, the second is likely to work faster, although it is the first that would make the change last.\n\nIn conclusion, the decline of the skilled trades makes everyday life more costly and holds back projects of national importance. Paying apprentices properly would offer the quickest relief, but a lasting solution depends on persuading families that working with one\'s hands is no less worthy than working at a desk.',
        phanTich: [
          '**Task Response (8.5)**: trả lời ĐỦ hai câu hỏi với sức nặng ngang nhau; không sa vào kể nguyên nhân (đề đã cho) mà dùng nguyên nhân để chọn giải pháp ("Since the root of the problem is largely one of prestige…"). Hai vấn đề ở hai tầng (gia đình → quốc gia), mỗi vấn đề là một chuỗi hệ quả có ví dụ cụ thể (mái dột, thợ không bằng cấp; dự án nhà ở, đường sắt, điện mặt trời). Hai giải pháp nói rõ AI làm gì, được nhượng bộ ("Admittedly, attitudes change slowly") và XẾP HẠNG theo tốc độ – độ bền; kết bài nhắc lại đúng thứ hạng đó. Đây là "a fully developed position" của band 8+.',
          '**Coherence & Cohesion (8.5)**: 4 đoạn, mỗi đoạn một việc; mạch đi từ gần đến xa ("at home" → "At a national level") rồi từ gốc đến ngọn (vị thế → tiền). Liên kết chủ yếu bằng tham chiếu và quan hệ logic, gần như không có từ nối đầu câu kiểu danh sách: "The shortage that follows", "Worse, the gap…", "such workers", "these projects", "this should be combined with", "Of the two measures, the second…, the first…". Đúng mô tả band 8: cohesion "attracts no attention".',
          '**Lexical Resource (8.5)**: kết hợp từ chính xác, tự nhiên, nhiều cụm ít gặp dùng đúng chỗ: "the only respectable route into adult life", "school leavers", "imposes real costs on", "skilled tradespeople are scarce", "pay far more than the job is worth", "faulty wiring", "not for want of money", "raise the standing of", "a consolation prize", "a financial incentive", "holds back projects of national importance", "no less worthy than". Không có cụm học thuộc.',
          '**Grammar (8)**: câu phức nhiều tầng mà vẫn rõ (Tập 5 Ngày 5): "with the result that…"; mệnh đề quan hệ không xác định "whose faulty wiring or plumbing can be…"; cấu trúc song song "not for want of money, but because…"; điều kiện loại 2 kép "If schools presented… and if careers advisers stopped…, attitudes would begin to shift"; cấu trúc tuyệt đối "the cost being shared between employers and the state"; phân từ rút gọn "a young person comparing…"; câu chẻ "it is the first that would make the change last"; so sánh "no less worthy than". Còn hai lỗi nhỏ (xem dưới).',
          '🔎 **Soi lỗi — 2 chỗ CỐ Ý giữ lại (hãy tự tìm trước khi đọc tiếp)**: (1) ✗ "a **shortage** of such workers **have** consequences" → "a shortage of such workers **has** consequences" (động từ hoà hợp với danh từ CHÍNH "shortage" — số ít — chứ không với "workers" đứng sát nó; đúng loại lỗi dai dẳng của Tập 5 Ngày 3); (2) ✗ "stopped **discouraging** able teenagers **to consider** them" → "stopped discouraging able teenagers **from considering** them" (discourage / prevent / stop sb **from + V-ing**; chỉ "encourage sb **to + V**" mới đi với to — hai động từ trái nghĩa, hai mẫu khác nhau).',
          '**So với một bài band 7 cùng ý**: bài band 7 thường viết "This causes many problems for society. Firstly, people cannot find workers. Secondly, the economy is affected." rồi "The government should encourage young people to learn a trade." — ý đúng nhưng chưa mở thành chuỗi, giải pháp chưa nói ai làm gì và không được đánh giá. Hãy đặt hai phiên bản cạnh nhau (Tập 5 Ngày 2) và đánh dấu: ví dụ cụ thể · câu nhượng bộ · câu xếp hạng giải pháp.',
          '**Lỗi cần tránh ở đề này**: viết một thân bài về "vì sao người trẻ thích đại học" (đề không hỏi); biến bài thành "đại học hay học nghề tốt hơn"; giải pháp không khớp vấn đề ("build more universities"); bịa thống kê; kết bài thêm ý mới; dưới 250 từ.',
        ],
      },
    },
  ],
};
