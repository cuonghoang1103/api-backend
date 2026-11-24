/**
 * Đề 10 — Listening, TẬP 5 · NGÀY 16 (docs/ielts-lo-trinh-0-8.md mục 4.2 · "tốc độ thật"). TỰ SOẠN 24/11/2026.
 * Mức band 7.5 — khó hơn Đề 8 một bậc: lời thoại viết cho tốc độ ~180 từ/phút (mục 4.2: Đề 10–12), câu nói đời thường dày rút gọn
 * và thành ngữ ("scratch the bike", "paying for air", "what's the damage", "what cracked it"), tỉ lệ bẫy cao: hầu như MỌI câu có một
 * hoặc hai phương án được nói ra rồi bị bác, nhiều chỗ đáp án phải TÍNH hoặc SUY (12 tháng + 2 tháng đi chơi = 14; giảm 20% chứ
 * không phải 10% và hai mức không cộng dồn), Part 2 nối 6 toà nhà với 8 quy định (mỗi toà nhắc thêm một quy định KHÔNG áp dụng),
 * Part 3 ba người nói lật ý nhau, Part 4 bài giảng ~1.000 từ không nghỉ, có ba chỗ "người ta hay nói… nhưng không phải".
 * Bối cảnh (mục 4.2 không chỉ định, chỉ ghi "tốc độ thật"): thuê kho tự quản · tập huấn tình nguyện viên Ngày hội di sản · hai sinh
 * viên bàn dự án lịch sử truyền miệng với giảng viên · bài giảng âm học phòng hoà nhạc.
 * GIỌNG (7 giọng, trộn 6 vùng): Part 1 nhân viên Mỹ (`us-nam`) + khách Úc (`au-nu`) · Part 2 giọng Ireland (`ie-nu`) · Part 3 sinh
 * viên Anh (`uk-nam`) + sinh viên Canada (`ca-nu`) + giảng viên New Zealand (`nz-nam`) · Part 4 giọng Anh (`uk-nu`).
 *   Part 1: Form + Table (T5 N1 "Part 1 tốc độ thật, giọng trộn"; bẫy số đổi T5 N15) · Part 2: MCQ + Matching (T5 N4) ·
 *   Part 3: MCQ + chọn TWO + Flow-chart (T5 N4, N12 "Part 3 bẫy") · Part 4: Note + Summary (T5 N5, N12 "Part 4 Summary band 8").
 * Bẫy chính: bike → kayak; 31st / 30th → 29th; twelve → fourteen; 50 / 100 → 75; £120 / £108 → £96; key / swipe card → code;
 * email → certificate; food, plants (đã in) / cleaning products → paint; trolleys (đã in) / boxes → van; thêm toà nhà / hàng dài →
 * ngày dành cho trường học; buổi họp ở toà thị chính (đã bỏ) / đi lấy áo → khoá học trực tuyến; cơm hộp (năm ngoái) / bữa tối Chủ
 * nhật → phiếu ăn; sách hướng dẫn / gọi điều phối → thẻ ghi câu hỏi; chụp ảnh (được) → tầng trên đóng; gửi túi (bỏ ý định) → cấm
 * flash; an toàn bậc thang → giới hạn 8 người; đếm người / trẻ em → giờ cố định; chạm tay (được) → bọc giày; lịch biểu (không có)
 * → trẻ phải có người lớn; ông của Leila / toà nhà sắp phá → kho lưu trữ không có lời kể; báo địa phương / mạng xã hội / ngại ghi
 * âm → một người quen; chất lượng âm / lạc đề → bám bảng câu hỏi; sửa ngày / bỏ đi → phân tích; bỏ hết tên / chỉ tên gọi → để từng
 * người chọn; ảnh / bản đồ / phim → trích đoạn ghi âm + dòng thời gian; questions → topics; photograph → object; transcript →
 * summary; architect / musician → physics; shape → volume; ceiling → walls; "too reverberant" → hear / bass.
 * DỮ KIỆN âm học — kiến thức phổ thông, soạn theo trí nhớ, CHƯA mở nguồn đối chiếu trong phiên này: Wallace Sabine (Harvard, 1895,
 * phòng giảng của bảo tàng nghệ thuật Fogg, vang khoảng 5,5 giây; ống đàn organ + đồng hồ bấm giây; đệm ghế mượn của nhà hát
 * Sanders); thời gian vang phụ thuộc thể tích + lượng vật liệu hút âm; Boston Symphony Hall mở 1900; Musikverein Vienna 1870,
 * Concertgebouw Amsterdam 1888; Harold Marshall (New Zealand, cuối thập niên 1960) — phản xạ bên; Philharmonic Hall New York mở
 * 1962, tư vấn đã khảo sát hơn 50 phòng, bị tăng số ghế vào phút chót, nhạc công không nghe được nhau + thiếu âm trầm, phá ruột
 * xây lại 1976, mở lại lần nữa 2022; Philharmonie Berlin (Hans Scharoun) mở 1963, bố cục "vườn nho". Con số "khoảng 30 mét" là
 * số ước lượng thường được nhắc — bài nói có "about". Lockwood Self Storage, Heritage Open Weekend, nhà máy giày Harland's, Mrs
 * Okoro, Dr Whitaker và mọi nhân vật Part 1–3 đều HƯ CẤU.
 * Mỗi đáp án có `ev` = chuỗi NGUYÊN VĂN trong lời thoại + giải thích tiếng Việt (nêu bẫy, trỏ bài ôn).
 */
import type { DeNghe } from './types';

export const NGHE_DE10: DeNghe = {
  id: 'nghe-de10',
  kyNang: 'nghe',
  ten: 'Listening — Đề 10 (Tập 5 · Ngày 16)',
  boDe: 'Đề 10',
  capDo: 'Band 7.5',
  moTa: 'Renting a self-storage unit (US + AU) · Briefing for heritage weekend volunteers (Irish speaker) · Two students and a tutor discuss an oral history project · Lecture on the acoustics of concert halls',
  phut: 30,
  phan: [
    /* ════════════════ PART 1 — thuê kho tự quản ════════════════ */
    {
      so: 1,
      tieuDe: 'Lockwood Self Storage — enquiry',
      dan: 'Part 1. You will hear a woman telephoning a self-storage company to ask about renting a unit. First, you have some time to look at questions 1 to 10.',
      boiCanh: 'Priya (giọng Úc) sắp ra nước ngoài làm việc, gọi công ty cho thuê kho tự quản Lockwood Self Storage; nhân viên Marcus nói giọng Mỹ, nói nhanh và dùng nhiều cách nói đời thường ("scratch the bike" = bỏ chiếc xe đạp khỏi danh sách, "paying for air" = trả tiền cho chỗ trống, "what\'s the damage?" = hết bao nhiêu tiền). Giọng Úc: "day" nghe gần "die", "eight" gần "ite". Chú ý: món đồ bị BỎ khỏi danh sách và món phải thêm; ngày bị đổi; số tháng phải CỘNG; ba cỡ kho; ba mức giá — hai mức giảm không cộng dồn. Bảng: cách vào kho, giấy tờ bảo hiểm, thứ bị cấm, thứ được dùng miễn phí.',
      docTruoc: 30,
      loi: [
        { ai: 'Marcus', giong: 'us-nam', s: `Lockwood Self Storage, Marcus speaking. What can I do for you?` },
        { ai: 'Priya', giong: 'au-nu', s: `Hi Marcus. I'm heading overseas for work later this year and I need somewhere to leave pretty much everything I own. I've never rented storage before, so you'll have to walk me through it.` },
        { ai: 'Marcus', giong: 'us-nam', s: `No problem at all, that's most of our customers. Let me open a quote. Can I grab your name?` },
        { ai: 'Priya', giong: 'au-nu', s: `Priya Tindall. That's T, I, N, D, A, double L.` },
        { ai: 'Marcus', giong: 'us-nam', s: `T, I, N, D, A, L, L. Got it. And what are we storing, Priya? Just give me a rough idea.` },
        { ai: 'Priya', giong: 'au-nu', s: `It's the contents of a one-bedroom flat, basically. A bed, a sofa, a desk, maybe twenty-five boxes. I was going to put my bike in as well, but my brother's offered to look after that, so scratch the bike. What he can't take is my kayak. It's four metres long and it lives in the hallway at the moment.` },
        { ai: 'Marcus', giong: 'us-nam', s: `A kayak. Okay, that changes things a little, because of the length. I'll come back to that. When do you need to move in?` },
        { ai: 'Priya', giong: 'au-nu', s: `My lease ends on Monday the thirty-first of August, so I was thinking the day before, the thirtieth.` },
        { ai: 'Marcus', giong: 'us-nam', s: `The thirtieth's a Sunday, and the office is closed Sundays. You can get into a unit you already have, but we can't sign anyone up. Could you do the Saturday?` },
        { ai: 'Priya', giong: 'au-nu', s: `The twenty-ninth? Yeah, that'd work. Actually it's better, it gives me a day to clean the flat. Put down the twenty-ninth.` },
        { ai: 'Marcus', giong: 'us-nam', s: `Saturday the twenty-ninth of August. And how long for?` },
        { ai: 'Priya', giong: 'au-nu', s: `Well, the job's a twelve-month contract. But I'm planning to travel for a couple of months when it finishes, so I wouldn't be back for the stuff until, what, fourteen months from now.` },
        { ai: 'Marcus', giong: 'us-nam', s: `So I'll put fourteen rather than twelve. That actually helps you on price, I'll explain in a second. Now, size. For a one-bedroom flat we'd normally say fifty square feet, and honestly your furniture would fit in that. The trouble is the kayak. Our fifty-foot units are only three metres deep, so it wouldn't go in, not even on the diagonal. The next size up is seventy-five, and those are four and a half metres deep.` },
        { ai: 'Priya', giong: 'au-nu', s: `What about going bigger still, to be safe? A hundred?` },
        { ai: 'Marcus', giong: 'us-nam', s: `You could, but you'd be paying for air. Seventy-five is what I'd recommend.` },
        { ai: 'Priya', giong: 'au-nu', s: `Seventy-five it is. So what's the damage?` },
        { ai: 'Marcus', giong: 'us-nam', s: `The standard rate on a seventy-five is a hundred and twenty pounds a month. If you book online you get ten per cent off, so that's a hundred and eight. But that's for short stays. Anyone who commits to twelve months or more gets twenty per cent off instead, for the whole stay, which brings it down to ninety-six pounds a month.` },
        { ai: 'Priya', giong: 'au-nu', s: `Ninety-six. And the two discounts don't add together, I suppose.` },
        { ai: 'Marcus', giong: 'us-nam', s: `Afraid not. It's one or the other.` },
        { ai: 'Priya', giong: 'au-nu', s: `Worth asking. Okay, how do I actually get in and out? Do you give me a key?` },
        { ai: 'Marcus', giong: 'us-nam', s: `There are no keys to the building. We used to issue swipe cards, but people kept losing them, so now every customer sets their own six-digit code and types it in at the gate and again at the lift. You're in any day from six in the morning till eleven at night. The only key involved is the one for the padlock on your own unit, and you bring or buy that yourself.` },
        { ai: 'Priya', giong: 'au-nu', s: `Fine. And insurance? Is that included?` },
        { ai: 'Marcus', giong: 'us-nam', s: `It isn't included, but it is compulsory. We sell cover at the desk, or, if your home contents policy already covers goods in storage, and a lot of them do, we'll accept that. We just need to see a certificate from your insurer. An email saying you're covered isn't enough, I'm afraid. It has to be the certificate.` },
        { ai: 'Priya', giong: 'au-nu', s: `I'll ring them. Is there anything I'm not allowed to put in there?` },
        { ai: 'Marcus', giong: 'us-nam', s: `The obvious ones: no food, and nothing alive, so no plants. And nothing that burns easily.` },
        { ai: 'Priya', giong: 'au-nu', s: `Hmm. I've got half a dozen tins of paint left over from decorating. Would they count?` },
        { ai: 'Marcus', giong: 'us-nam', s: `They would. Paint's the thing people most often get caught out by. Cleaning products are fine as long as the lids are on, but paint can't come in, sorry.` },
        { ai: 'Priya', giong: 'au-nu', s: `I'll give it to the neighbours, then. Last question. I don't have a car. Do you rent out vans?` },
        { ai: 'Marcus', giong: 'us-nam', s: `Better than that. New customers get our van free for up to three hours on the day they move in. You just put back the fuel you use. Trolleys are free too, but then they're free for everybody, all the time. Boxes we do charge for.` },
        { ai: 'Priya', giong: 'au-nu', s: `A free van. That settles it. Can I pay the first month now?` },
        { ai: 'Marcus', giong: 'us-nam', s: `Sure. Let me take you through to the payment page.` },
      ],
      nhom: [
        {
          id: 'n1-form', tu: 1, den: 6, dang: 'form',
          huongDan: 'Complete the form below.\nWrite **ONE WORD AND/OR A NUMBER** for each answer.',
          gioiHan: { tu: 1, so: true },
          tieuDe: 'Lockwood Self Storage — Quotation',
          dong: [
            'Customer: Priya [[1]]',
            'Items: contents of a one-bedroom flat and a [[2]]',
            'Move-in date: Saturday [[3]] August',
            'Length of stay: [[4]] months',
            'Recommended unit: [[5]] square feet',
            'Monthly charge after discount: £[[6]]',
          ],
        },
        {
          id: 'n1-table', tu: 7, den: 10, dang: 'table',
          huongDan: 'Complete the table below.\nWrite **ONE WORD ONLY** for each answer.',
          gioiHan: { tu: 1 },
          tieuDe: 'Lockwood Self Storage — conditions',
          bang: {
            dau: ['', 'Details'],
            hang: [
              ['Access', '6 a.m.–11 p.m. every day; customers get in using their own [[7]]'],
              ['Insurance', 'compulsory; the customer\'s own policy is accepted if a [[8]] is shown'],
              ['Items not allowed', 'food, plants and [[9]]'],
              ['Free of charge', 'trolleys (at all times); a [[10]] on the moving-in day (new customers only)'],
            ],
          },
        },
      ],
    },

    /* ════════════════ PART 2 — tập huấn tình nguyện viên Ngày hội di sản ════════════════ */
    {
      so: 2,
      tieuDe: 'Heritage Open Weekend — volunteer briefing',
      dan: 'Part 2. You will hear the volunteer coordinator of a heritage event giving a talk to new and returning volunteers. First, you have some time to look at questions 11 to 20.',
      boiCanh: 'Aoife (giọng Ireland), điều phối tình nguyện viên của Heritage Open Weekend — dịp các toà nhà cổ trong thị trấn mở cửa miễn phí — phổ biến cho tình nguyện viên: vì sao năm nay kéo dài ba ngày, việc phải làm trước ca đầu, bữa trưa, cách xử lý câu hỏi khó; rồi điểm MỘT điều riêng phải nhớ ở từng toà trong sáu toà nhà. Giọng Ireland: "th" gần /t/ ("three" nghe gần "tree", "thirty" gần "tirty"), "r" sau nguyên âm đọc rõ. Chú ý: ở mỗi câu trắc nghiệm có hai ý bị bác trước; ở mỗi toà nhà cô nhắc thêm một quy định KHÔNG áp dụng (được chụp ảnh, không cần đếm người, được chạm tay…).',
      docTruoc: 40,
      loi: [
        { ai: 'Aoife', giong: 'ie-nu', s: `Good evening, everyone, and thank you for coming out on such a wet night. My name's Aoife, I coordinate the volunteers for the Heritage Open Weekend, and for the next few minutes I'm going to run through how it all works, because quite a lot has changed since last year.` },
        { ai: 'Aoife', giong: 'ie-nu', s: `The first change you'll have spotted on your rota: the Weekend now starts on a Friday, so it's three days rather than two. I've heard a couple of theories about why. One is that we've taken on more buildings. We haven't. With the Corn Exchange closed for repairs, we're actually one down, at eleven. The other theory is that it's to spread out the crowds after the queues last September, and I can see why people think so, but we've dealt with the queues separately, by introducing timed tickets. No, the Friday exists because our main sponsor asked us to set a day aside for schools. So on Friday every building is closed to the general public, and you'll have classes of ten- and eleven-year-olds instead, which, believe me, is a rather different experience.` },
        { ai: 'Aoife', giong: 'ie-nu', s: `Now, training. Those of you who've done this before will remember the briefing afternoon at the town hall. We've dropped that. Half of you couldn't get the time off work, and the half who came said it was too long. Instead, there's a forty-minute course on our website, covering fire safety and how to welcome visitors with disabilities, and it has to be finished before your first shift. The system tells me who's done it, so please don't leave it till the Thursday night. Your lanyard and your green volunteer jacket you don't need to fetch from anywhere. They'll be waiting for you at your building on the morning.` },
        { ai: 'Aoife', giong: 'ie-nu', s: `Lunch. Last year we delivered a packed lunch to every building, and a depressing amount of it went in the bin. So this year each of you gets a voucher, worth eight euros, which you can spend in any of the nine cafés around the market square. They're listed on the back. There is a hot meal as well, but that's the thank-you supper at the town hall on Sunday evening, once the doors have closed, so don't go looking for it at midday.` },
        { ai: 'Aoife', giong: 'ie-nu', s: `And one more general point. Visitors will ask you things you can't answer. When was this window put in? Who paid for the roof? Please don't guess, and please don't read aloud from the printed guide, because frankly it only has the basics and they'll have read it already. I also don't want you phoning me. My phone is for emergencies: a fall, a lost child. What we've got instead are question cards. You write down the question and the visitor's email address, drop the card in the box, and one of the university's historians will send them a proper answer the following week. People loved that when we trialled it.` },
        { ai: 'Aoife', giong: 'ie-nu', s: `Right, the buildings. I can't cover all eleven tonight, but six of them have something particular that you need to keep in your head, so pens ready.` },
        { ai: 'Aoife', giong: 'ie-nu', s: `The Old Customs House first. Everyone wants a picture from the big window over the harbour, and that's fine, let them snap away. What you do have to watch is the staircase. The top storey is still full of scaffolding, so the rope across the stairs on the first-floor landing stays where it is, and nobody, however nicely they ask, goes above it.` },
        { ai: 'Aoife', giong: 'ie-nu', s: `Merchants' Hall. The glory of the place is the painted ceiling, which dates from the sixteen-twenties, and strong light is slowly destroying the colours. So people may take photographs, but not with a flash, and on a phone that usually means showing them how to switch it off. We did think about making people hand in their bags there as well, but there's simply nowhere to keep them, so that idea's gone.` },
        { ai: 'Aoife', giong: 'ie-nu', s: `The Ice House, in the grounds of the old hospital. It's an underground chamber where ice was stored before refrigeration, and it's tiny. The steps down are well lit and there's a handrail, so safety isn't my worry. Space is. Eight visitors is the absolute limit, and one of you stands at the top with a counter, clicking people in and clicking them out.` },
        { ai: 'Aoife', giong: 'ie-nu', s: `St Brendan's Bell Tower. A hundred and twelve steps, I'm sorry to say. There's actually plenty of room on the viewing platform, so I'm not asking you to count heads, and children are welcome provided they can manage the climb. But we can't have people meeting each other on that narrow stair, so parties go up on the hour and on the half hour, with a guide, and at no other time. If someone arrives at five past, they wait.` },
        { ai: 'Aoife', giong: 'ie-nu', s: `The Weavers' Cottage. Unusually, almost everything in it is a modern copy, so visitors can sit on the chairs, open the cupboards, even have a go on the loom. Hands are not the problem. Feet are. The floorboards upstairs have just been conserved at enormous expense, and everyone who goes in, including you, pulls on a pair of the blue covers from the basket by the door, over their shoes.` },
        { ai: 'Aoife', giong: 'ie-nu', s: `And lastly the Printing Works on Quay Street, where the old presses will be running all day. There's no timetable there. The printers just keep going and people drift in and out. But these are heavy machines with moving parts at about the height of a small child's head. So anyone under twelve has to have a grown-up beside them the whole time. If you see a child on their own, stop what you're doing and find the parent.` },
        { ai: 'Aoife', giong: 'ie-nu', s: `That's the essentials. Your building captain will fill in the rest on the morning. Now, who has questions?` },
      ],
      nhom: [
        {
          id: 'n2-mcq', tu: 11, den: 14, dang: 'mcq',
          huongDan: 'Choose the correct letter, **A, B** or **C**.',
          cau: [
            { n: 11, s: 'Why does the event last three days this year?', chon: [{ k: 'A', t: 'More buildings are taking part.' }, { k: 'B', t: 'Too many people came at the same time last year.' }, { k: 'C', t: 'One day has been reserved for a particular group.' }] },
            { n: 12, s: 'What must all volunteers do before their first shift?', chon: [{ k: 'A', t: 'complete some training online' }, { k: 'B', t: 'attend a meeting at the town hall' }, { k: 'C', t: 'collect their jacket and lanyard' }] },
            { n: 13, s: 'What arrangement has been made for the volunteers\' lunch?', chon: [{ k: 'A', t: 'Food will be brought to each building.' }, { k: 'B', t: 'They can eat at a choice of local businesses.' }, { k: 'C', t: 'A meal will be served at the town hall.' }] },
            { n: 14, s: 'What should volunteers do if they cannot answer a visitor\'s question?', chon: [{ k: 'A', t: 'look for the answer in the printed guide' }, { k: 'B', t: 'telephone the coordinator' }, { k: 'C', t: 'make a note of it for an expert' }] },
          ],
        },
        {
          id: 'n2-match', tu: 15, den: 20, dang: 'match-feature',
          huongDan: 'What must volunteers remember about each of the following buildings?\nChoose **SIX** answers from the box and write the correct letter, **A–H**, next to Questions 15–20.',
          hop: {
            tieuDe: 'Rules',
            ds: [
              { k: 'A', t: 'Flash photography is not allowed.' },
              { k: 'B', t: 'Only a small number of people may be inside at once.' },
              { k: 'C', t: 'Bags must be left at the entrance.' },
              { k: 'D', t: 'One level of the building is closed to visitors.' },
              { k: 'E', t: 'Visitors have to put on shoe covers.' },
              { k: 'F', t: 'Children must stay with an adult.' },
              { k: 'G', t: 'Visitors may only go in at set times.' },
              { k: 'H', t: 'Visitors must not touch the exhibits.' },
            ],
          },
          cau: [
            { n: 15, s: 'The Old Customs House' },
            { n: 16, s: 'Merchants\' Hall' },
            { n: 17, s: 'The Ice House' },
            { n: 18, s: 'St Brendan\'s Bell Tower' },
            { n: 19, s: 'The Weavers\' Cottage' },
            { n: 20, s: 'The Printing Works' },
          ],
        },
      ],
    },

    /* ════════════════ PART 3 — dự án lịch sử truyền miệng (ba người nói) ════════════════ */
    {
      so: 3,
      tieuDe: 'An oral history project',
      dan: 'Part 3. You will hear two history students, Tom and Leila, discussing their oral history project with their tutor, Dr Whitaker. First, you have some time to look at questions 21 to 30.',
      boiCanh: 'Tom (giọng Anh) và Leila (giọng Canada), sinh viên ngành sử, gặp giảng viên Dr Whitaker (nam, giọng New Zealand) khi đã phỏng vấn được 6 trên 12 cựu công nhân của nhà máy giày Harland\'s (đã đóng cửa) cho dự án lịch sử truyền miệng. Chú ý: lý do THẬT chọn nhà máy này, cách tìm được người kể, lỗi THẬT ở hai buổi đầu (hai sinh viên bất đồng), cách xử lý ký ức sai về cuộc đình công, chuyện nêu tên; hai thứ sẽ có trong bài thuyết trình 15 phút; rồi quy trình cho sáu buổi còn lại — ở mỗi bước một phương án được nêu rồi bị thay. Giọng New Zealand: /e/ nghe gần /i/ ("ten" gần "tin", "left" gần "lift"), /ɪ/ gần /ə/ ("list" gần "lust").',
      docTruoc: 40,
      loi: [
        { ai: 'Dr Whitaker', giong: 'nz-nam', s: `Come in, you two. Tom, Leila, grab a seat. So, the oral history project. You're about halfway through the interviews, is that right?` },
        { ai: 'Leila', giong: 'ca-nu', s: `Six done, six to go. And we've got the presentation in three weeks, so we wanted to check we're on the right track.` },
        { ai: 'Dr Whitaker', giong: 'nz-nam', s: `Good. Start by reminding me why Harland's. There must be a dozen closed factories in this town you could have picked.` },
        { ai: 'Tom', giong: 'uk-nam', s: `There are. And I should say, it's not the family connection, although Leila's got one.` },
        { ai: 'Leila', giong: 'ca-nu', s: `My grandfather worked there, yeah, but I only found that out after we'd chosen it. And it's not that the building's under threat either. It was turned into flats years ago, so there's nothing left to save.` },
        { ai: 'Tom', giong: 'uk-nam', s: `What decided it was a visit to the county archive. They've got the company's accounts, hundreds of photographs, even the wage books. But there's not one recording, not one written memoir, by anybody who actually stood on the factory floor. The workers' own version just isn't there.` },
        { ai: 'Dr Whitaker', giong: 'nz-nam', s: `Which is exactly the gap oral history exists to fill. And how did you find people? That's usually the hard part.` },
        { ai: 'Leila', giong: 'ca-nu', s: `It was, and not in the way we expected. We put a notice in the local paper, and we thought that'd bring in dozens. We got two replies. Then we tried a social media group for the town, and plenty of people answered, but they were mostly the children of workers, far too young to remember the place.` },
        { ai: 'Tom', giong: 'uk-nam', s: `We'd also assumed people would be nervous about being recorded. They weren't, at all. In the end, what cracked it was Mrs Okoro. She runs a lunch club for former Harland's staff. Leila rang her once, and she turned up the following week with a list of fourteen names. Ten of our twelve came from that one phone call.` },
        { ai: 'Dr Whitaker', giong: 'nz-nam', s: `That's very common, actually. One well-connected person is worth any number of adverts. Now, I listened to your first two recordings. What did you make of them?` },
        { ai: 'Tom', giong: 'uk-nam', s: `Honestly, I was a bit frustrated. The sound's fine, we'd tested the recorder to death beforehand. But they kept going off the subject. We'd ask about the machines and get ten minutes on the works football team.` },
        { ai: 'Leila', giong: 'ca-nu', s: `I'm not sure that's the real issue, though, Tom. When I listened back, the football story was the best thing on the tape. The problem was us. Every time someone wandered, we dragged them back to question seven.` },
        { ai: 'Dr Whitaker', giong: 'nz-nam', s: `I'm with Leila. You had eighteen questions and you were determined to get through all eighteen. You could hear the paper rustling. An interview isn't a questionnaire read aloud. Let them lead.` },
        { ai: 'Tom', giong: 'uk-nam', s: `Okay. Point taken.` },
        { ai: 'Leila', giong: 'ca-nu', s: `There's something else we wanted to ask. Nearly everyone talks about the strike in seventy-nine, and they all describe it as going on right through the winter. Months. But the newspapers say it lasted three weeks.` },
        { ai: 'Tom', giong: 'uk-nam', s: `So do we go through the transcripts and put in the correct dates? Or just leave the strike out, since we can't trust what they say?` },
        { ai: 'Dr Whitaker', giong: 'nz-nam', s: `Neither. By all means check the papers, as you've done. But you don't correct a memory, and you certainly don't throw it away. Ask yourselves why three weeks has become a whole winter in people's minds. What did those weeks mean to them? That's not an error to be cleaned up. It's evidence, and I'd give it a section of its own.` },
        { ai: 'Leila', giong: 'ca-nu', s: `That's a much more interesting way to look at it.` },
        { ai: 'Dr Whitaker', giong: 'nz-nam', s: `Now, names. Have you thought about that?` },
        { ai: 'Leila', giong: 'ca-nu', s: `We have, and we disagree. I'd take every name out. It's the safest thing.` },
        { ai: 'Tom', giong: 'uk-nam', s: `And I'd say first names only. It keeps it human.` },
        { ai: 'Dr Whitaker', giong: 'nz-nam', s: `In a town this size, a first name and a job title would identify anyone in thirty seconds, Tom. And Leila, some of these people are proud of what they did. They want to be on the record, surname and all. So it isn't your decision to make. Put the options on the consent form, full name, a made-up name, or nothing, and have each person tick the one they're comfortable with.` },
        { ai: 'Tom', giong: 'uk-nam', s: `Fair enough. Can we talk about the presentation itself? We've got fifteen minutes.` },
        { ai: 'Dr Whitaker', giong: 'nz-nam', s: `Which is nothing. What were you planning to put in it?` },
        { ai: 'Leila', giong: 'ca-nu', s: `Extracts from the recordings, definitely. Thirty seconds each, three or four of them.` },
        { ai: 'Dr Whitaker', giong: 'nz-nam', s: `Yes. The voices are the whole point. Keep those.` },
        { ai: 'Tom', giong: 'uk-nam', s: `Some of the interviewees lent us their own photographs, and we'd like to show a few.` },
        { ai: 'Dr Whitaker', giong: 'nz-nam', s: `I'd be careful. Most of those were taken by the company's photographer, and nobody seems to know who owns the rights now. Until you do, leave them out.` },
        { ai: 'Leila', giong: 'ca-nu', s: `I've started drawing a map showing the streets where the workers lived. Nearly all of them were within half a mile of the gates.` },
        { ai: 'Dr Whitaker', giong: 'nz-nam', s: `It's a lovely idea, and it belongs in the written report. In a quarter of an hour, though, it's a luxury. What the audience can't do without is some sense of the dates: when the place opened, when it was at its biggest, when it shut. One slide, a simple timeline. Put that in.` },
        { ai: 'Tom', giong: 'uk-nam', s: `And I filmed the building as it is today, but it's pretty shaky.` },
        { ai: 'Dr Whitaker', giong: 'nz-nam', s: `Then you've answered your own question.` },
        { ai: 'Leila', giong: 'ca-nu', s: `So, for the six interviews we've still got. What should we change?` },
        { ai: 'Dr Whitaker', giong: 'nz-nam', s: `Let's build a procedure. First, contact. I gather you've been sending people the questions beforehand.` },
        { ai: 'Tom', giong: 'uk-nam', s: `We thought it was polite.` },
        { ai: 'Dr Whitaker', giong: 'nz-nam', s: `It's polite, and it gives you rehearsed answers. Send them a list of topics instead. Four or five headings, no more, so they know the ground you'll cover without preparing a speech.` },
        { ai: 'Leila', giong: 'ca-nu', s: `Topics, not questions. And how should we open? Tom suggested showing them one of the archive photographs.` },
        { ai: 'Dr Whitaker', giong: 'nz-nam', s: `That can work, but you've only a handful of photographs and they're all of the managers. I'd ask each person to bring an object from their working life. A tool, a badge, a pay packet. Begin by getting them to tell you about it, and you'll find the first twenty minutes look after themselves.` },
        { ai: 'Tom', giong: 'uk-nam', s: `I like that. Then we record as before. And afterwards? Writing out a full transcript took me six hours for one interview.` },
        { ai: 'Dr Whitaker', giong: 'nz-nam', s: `Don't. Not for all of them. Within a day, while it's fresh, write a summary, a page at most, with the times of the passages you might quote. Transcribe only those passages. Then post the summary to the interviewee so that they can tell you if you've got anything wrong.` },
        { ai: 'Leila', giong: 'ca-nu', s: `That's so much more manageable. Thank you.` },
      ],
      nhom: [
        {
          id: 'n3-mcq', tu: 21, den: 25, dang: 'mcq',
          huongDan: 'Choose the correct letter, **A, B** or **C**.',
          cau: [
            { n: 21, s: 'Why did Tom and Leila choose Harland\'s factory for their project?', chon: [{ k: 'A', t: 'A member of Leila\'s family had been employed there.' }, { k: 'B', t: 'No accounts by its workers had been preserved.' }, { k: 'C', t: 'The building was about to disappear.' }] },
            { n: 22, s: 'What do the students say about finding people to interview?', chon: [{ k: 'A', t: 'Nearly all of them were reached through one individual.' }, { k: 'B', t: 'Many of them were unwilling to be recorded.' }, { k: 'C', t: 'A newspaper notice produced a good response.' }] },
            { n: 23, s: 'What do Leila and Dr Whitaker think went wrong in the first interviews?', chon: [{ k: 'A', t: 'The quality of the recordings was poor.' }, { k: 'B', t: 'The interviewees talked about irrelevant matters.' }, { k: 'C', t: 'The students kept too closely to what they had prepared.' }] },
            { n: 24, s: 'What does Dr Whitaker say about the interviewees\' memories of the strike?', chon: [{ k: 'A', t: 'They deserve to be studied in their own right.' }, { k: 'B', t: 'They should be corrected in the transcripts.' }, { k: 'C', t: 'They are too unreliable to be included.' }] },
            { n: 25, s: 'How will the question of the interviewees\' names be settled?', chon: [{ k: 'A', t: 'Only first names will be used.' }, { k: 'B', t: 'Each interviewee will make the choice.' }, { k: 'C', t: 'All names will be removed.' }] },
          ],
        },
        {
          id: 'n3-mcq2', tu: 26, den: 27, dang: 'mcq2',
          huongDan: 'Choose **TWO** letters, **A–E**.',
          nhieu: {
            ns: [26, 27],
            s: 'Which TWO things will the students include in their presentation?',
            chon: [
              { k: 'A', t: 'parts of the recorded interviews' },
              { k: 'B', t: 'photographs belonging to the interviewees' },
              { k: 'C', t: 'a map of where the workers lived' },
              { k: 'D', t: 'an outline of the main dates in the factory\'s history' },
              { k: 'E', t: 'a film of the building as it is now' },
            ],
          },
        },
        {
          id: 'n3-flow', tu: 28, den: 30, dang: 'flow',
          huongDan: 'Complete the flow-chart below.\nWrite **ONE WORD ONLY** for each answer.',
          gioiHan: { tu: 1 },
          tieuDe: 'Procedure for the remaining interviews',
          dong: [
            '→ Before the interview, send the interviewee a list of [[28]].',
            '→ Open the interview by asking about an [[29]] that the interviewee has brought.',
            '→ Record the interview.',
            '→ Within one day, write a [[30]] of the interview and note the passages worth quoting.',
            '→ Send it to the interviewee to be checked.',
          ],
        },
      ],
    },

    /* ════════════════ PART 4 — bài giảng: âm học phòng hoà nhạc ════════════════ */
    {
      so: 4,
      tieuDe: 'Lecture — The acoustics of concert halls',
      dan: 'Part 4. You will hear part of a lecture in an architecture course about the acoustics of concert halls. First, you have some time to look at questions 31 to 40.',
      boiCanh: 'Một giảng viên kiến trúc người Anh giảng về âm học phòng hoà nhạc: thí nghiệm của Wallace Sabine và công thức thời gian vang, vì sao các phòng "hộp giày" (Vienna, Amsterdam, Boston) nghe hay, thất bại của Philharmonic Hall ở New York (1962) và lời giải kiểu "vườn nho" của Berlin (1963). Bài giảng dài khoảng 1.000 từ, tốc độ thật, không ai hỏi lại. Bám tiêu đề nhỏ của ghi chú; ba chỗ có "điều người ta tưởng — nhưng không phải" (ông KHÔNG phải kiến trúc sư; hình dạng phòng KHÔNG ảnh hưởng; phòng New York KHÔNG phải quá vang). Từ khó: reverberation (độ vang), absorb (hút âm), stalls (khu ghế tầng trệt), terrace (bậc thềm).',
      docTruoc: 45,
      loi: [
        { ai: 'Lecturer', giong: 'uk-nu', s: `Good afternoon. In the last session we dealt with how sound travels in the open air. Today we go indoors, and I want to take one building type, the concert hall, and use it to tell the story of how architectural acoustics became a science, and of what happens when that science is ignored, or overruled.` },
        { ai: 'Lecturer', giong: 'uk-nu', s: `Until the very end of the nineteenth century, nobody could predict how a room would sound before it was built. Architects copied halls that had happened to work and hoped for the best. The person who changed that was Wallace Sabine. He wasn't an architect, and he had no musical training to speak of. He was a young lecturer in physics at Harvard, and in 1895 the university handed him an embarrassing problem. It had just opened a new lecture room in its art museum, and the room was useless: a speaker's words hung in the air for so long that each one ran into the next.` },
        { ai: 'Lecturer', giong: 'uk-nu', s: `Sabine attacked the problem by measurement. Working at night, when the streets were quiet, he sounded a single organ pipe, stopped it, and timed with a stopwatch how long the note remained audible. In the empty room it was about five and a half seconds. Then he began changing the room. Night after night, he and his assistants carried in cushions borrowed from the seats of a nearby theatre, laid them out a few metres at a time, and measured again. The more cushions there were, the faster the sound died.` },
        { ai: 'Lecturer', giong: 'uk-nu', s: `After a very large number of measurements, he had a formula. The time a sound takes to fade away, the reverberation time as we now call it, depends on two things only: the volume of the room, and the total amount of absorbing material inside it. A bigger room rings for longer; more soft surfaces shorten the ring. What he had expected to matter, and what, to his surprise, made hardly any difference to that figure, was the room's shape.` },
        { ai: 'Lecturer', giong: 'uk-nu', s: `The formula was put to work almost immediately. Sabine advised on Boston's new Symphony Hall, which opened in 1900, and which is usually described as the first auditorium to be designed around a calculated reverberation time, just under two seconds with an audience in place. It is still ranked among the finest halls in the world.` },
        { ai: 'Lecturer', giong: 'uk-nu', s: `But notice something. Boston's outline was borrowed from older European halls that had been built with no science at all, and that musicians already loved. The best-known survivors of that family are the Musikverein in Vienna, from 1870, and the Concertgebouw in Amsterdam, from 1888. All of these are what we call shoebox halls. They are long, they are high and, above all, they are narrow. For decades nobody could say why that mattered, since Sabine's formula takes no account of proportions. The explanation came only in the late 1960s, largely from the work of a New Zealander, Harold Marshall. In a narrow room, sound bounces off the side walls and reaches you a fraction of a second after the sound that comes straight from the stage. Because it arrives from the left and the right, your two ears receive slightly different signals, and the brain reads that difference as spaciousness, the feeling of being wrapped in the music. A reflection from the ceiling doesn't do the same job. It comes from above, it reaches both ears identically, and it adds loudness but no sense of space. So reverberation time, it turned out, was necessary but not sufficient.` },
        { ai: 'Lecturer', giong: 'uk-nu', s: `That lesson was learned the hard way in New York. Philharmonic Hall, the first building of the Lincoln Center, opened in 1962, and its acoustic consultants had studied more than fifty halls around the world before recommending a fairly traditional design. Late in the day, however, under pressure to make the building pay, the committee insisted on more seats. The plans were enlarged, the balconies were reshaped, and the consultants' proportions went out of the window. The opening night was a disaster. People often say that the hall was simply too reverberant. It wasn't. The complaints were more specific. On the platform, the musicians found that they couldn't hear each other, which makes playing together close to impossible. In the stalls, listeners heard plenty of violins and trumpets, but the sound had no bass; the cellos and double basses seemed to be playing in another room. Panels were moved, the ceiling was altered, and in 1976 the entire interior was torn out and rebuilt. It was rebuilt yet again, incidentally, and reopened in 2022.` },
        { ai: 'Lecturer', giong: 'uk-nu', s: `One year after New York's opening night, Berlin produced a very different answer. The architect of the Philharmonie, Hans Scharoun, wanted to do away with the division between performers at one end and listeners at the other. He put the orchestra near the middle and arranged the audience around it on irregular terraces, rising in blocks on every side, like the slopes of a valley planted with vines. The name stuck: it's known as the vineyard layout. Its critics predicted that a hall so wide could never work. But the terraces solved the problem that their width created. Each block has a low wall at the front, and those walls supply the early side reflections that the distant outer walls can't. Nobody sits more than about thirty metres from the conductor.` },
        { ai: 'Lecturer', giong: 'uk-nu', s: `Most large halls built since have followed either Vienna or Berlin, and designers now test their ideas in computer simulations and in scale models before a single brick is laid. Next time, we'll look at how those models are made, and at how far we should trust them.` },
      ],
      nhom: [
        {
          id: 'n4-note', tu: 31, den: 36, dang: 'note',
          huongDan: 'Complete the notes below.\nWrite **ONE WORD ONLY** for each answer.',
          gioiHan: { tu: 1 },
          tieuDe: 'The acoustics of concert halls',
          dong: [
            '## Sabine\'s experiments (from 1895)',
            '• Sabine taught [[31]] at Harvard',
            '• he produced a note with an organ [[32]] and timed how long it lasted',
            '• he changed the room by bringing in [[33]] from a theatre',
            '• result: reverberation time depends on the room\'s [[34]] and on how much absorbing material it contains',
            '## \'Shoebox\' halls (Vienna, Amsterdam, Boston)',
            '• long, high and [[35]]',
            '• sound reflected from the side [[36]] arrives just after the direct sound, creating a feeling of space',
          ],
        },
        {
          id: 'n4-summary', tu: 37, den: 40, dang: 'summary',
          huongDan: 'Complete the summary below.\nWrite **ONE WORD ONLY** for each answer.',
          gioiHan: { tu: 1 },
          tieuDe: 'Two halls of the 1960s',
          dong: [
            'Philharmonic Hall in New York opened in 1962. Shortly before it was built, the planners demanded a larger number of [[37]], and the original proportions were lost. As a result, the players on the platform were unable to [[38]] one another, and for the audience the music lacked [[39]]. In Berlin, a year later, the audience was placed on terraces all round the orchestra, an arrangement that has become known as the [[40]] layout; the low walls in front of the terraces provide the reflections that such a wide hall would otherwise lack.',
          ],
        },
      ],
    },
  ],

  dapAn: {
    /* ── Part 1 ── */
    1: { a: ['Tindall'], vi: `"Priya Tindall. That's T, I, N, D, A, double L." — Marcus đọc lại từng chữ ⇒ **Tindall**. Chỗ hay sai: "double L" cuối tên (viết thiếu một chữ L là mất điểm). Giọng Úc: tên chữ "A" /æɪ/ nghe gần "I" — đối chiếu với lần Marcus (giọng Mỹ) đọc lại. 📘 Ôn Part 1 tốc độ thật, giọng trộn: Tập 5 Ngày 1.`, ev: `Priya Tindall. That's T, I, N, D, A, double L.` },
    2: { a: ['kayak'], vi: `"I was going to put my bike in as well, but my brother's offered to look after that, so scratch the bike. What he can't take is my kayak." ⇒ **kayak**. Bẫy "bike": món đồ nói TRƯỚC nhưng đã bị gạch ("scratch" = bỏ đi). Chính tả: k-a-y-a-k (đọc xuôi ngược như nhau).`, ev: `What he can't take is my kayak.` },
    3: { a: ['29', '29th', 'twenty-ninth'], vi: `Ba ngày: 31 (hết hợp đồng thuê nhà, thứ Hai) → 30 (ý định đầu, nhưng là Chủ nhật — văn phòng đóng, không ký hợp đồng mới được) → "Put down the twenty-ninth" ⇒ **29**. Phiếu in "Saturday ___ August" — dùng thứ trong tuần để tự kiểm. 📘 Ôn bẫy số đổi: Tập 5 Ngày 15.`, ev: `Put down the twenty-ninth.` },
    4: { a: ['14', 'fourteen'], vi: `Hợp đồng làm việc 12 tháng + đi du lịch "a couple of months" ⇒ "fourteen months from now"; Marcus chốt "So I'll put fourteen rather than twelve" ⇒ **14**. Bẫy "twelve": con số đầu tiên và được nhắc lại ba lần (twelve-month contract, rather than twelve, twelve months or more).`, ev: `So I'll put fourteen rather than twelve.` },
    5: { a: ['75', 'seventy-five'], vi: `Ba cỡ: 50 (đủ cho đồ đạc nhưng sâu có 3 m — chiếc kayak 4 m không vào) → 75 (sâu 4,5 m) → 100 (Priya hỏi, Marcus bác: "you'd be paying for air") ⇒ "Seventy-five is what I'd recommend" ⇒ **75**. Phiếu hỏi cỡ được KHUYÊN, không phải cỡ "thông thường cho căn hộ một phòng ngủ".`, ev: `Seventy-five is what I'd recommend.` },
    6: { a: ['96', 'ninety-six'], vi: `Ba mức giá: £120 (giá chuẩn) → £108 (giảm 10% khi đặt trên mạng — chỉ cho thuê ngắn) → thuê từ 12 tháng trở lên giảm 20% "which brings it down to ninety-six pounds a month" ⇒ **96**. Priya thuê 14 tháng nên hưởng mức 20%; hai mức giảm KHÔNG cộng ("It's one or the other") — ai tự tính 30% ra £84 là sai.`, ev: `which brings it down to ninety-six pounds a month` },
    7: { a: ['code'], vi: `Priya hỏi có đưa chìa khoá không — "There are no keys to the building. We used to issue swipe cards… so now every customer sets their own six-digit code" ⇒ **code**. Bẫy "key" (chỉ dùng cho ổ khoá của ô kho riêng, khách tự mua) và "cards" (đã bỏ). Bảng viết "their own ___" = "their own six-digit code".`, ev: `so now every customer sets their own six-digit code and types it in at the gate and again at the lift` },
    8: { a: ['certificate'], vi: `"We just need to see a certificate from your insurer. An email saying you're covered isn't enough… It has to be the certificate." ⇒ **certificate**. Bẫy "email": bị bác ngay sau. "is shown" = "need to see". Chính tả: c-e-r-t-i-f-i-c-a-t-e.`, ev: `We just need to see a certificate from your insurer.` },
    9: { a: ['paint'], vi: `"no food… no plants" đã in sẵn trong bảng; "nothing that burns easily" là mô tả chung, chưa phải một từ điền được; Priya hỏi về mấy hộp sơn — "paint can't come in". ⇒ **paint**. Bẫy "cleaning products": được phép nếu đậy nắp (và hai từ, vượt giới hạn).`, ev: `Cleaning products are fine as long as the lids are on, but paint can't come in, sorry.` },
    10: { a: ['van'], vi: `Priya hỏi thuê xe — "New customers get our van free for up to three hours on the day they move in." ⇒ **van**. Bẫy "trolleys": cũng miễn phí nhưng cho MỌI khách, mọi lúc (đã in sẵn trong bảng); "boxes": phải trả tiền.`, ev: `New customers get our van free for up to three hours on the day they move in.` },

    /* ── Part 2 ── */
    11: { a: ['C'], vi: `Hai "giả thuyết" bị bác: thêm toà nhà — "We haven't… we're actually one down" (loại A); giãn đám đông sau cảnh xếp hàng năm ngoái — "we've dealt with the queues separately, by introducing timed tickets" (loại B). "the Friday exists because our main sponsor asked us to set a day aside for schools" ⇒ **C** ("a particular group" = học sinh các trường). Paraphrase mức 4: phương án không có chữ "school". 📘 Ôn Part 2 tốc độ thật: Tập 5 Ngày 4.`, ev: `the Friday exists because our main sponsor asked us to set a day aside for schools` },
    12: { a: ['A'], vi: `Buổi họp ở toà thị chính: "We've dropped that" (loại B); áo và dây đeo "you don't need to fetch from anywhere" (loại C); "there's a forty-minute course on our website… and it has to be finished before your first shift" ⇒ **A**.`, ev: `it has to be finished before your first shift` },
    13: { a: ['B'], vi: `Cơm hộp đưa tới từng toà là chuyện NĂM NGOÁI, bỏ vì lãng phí (loại A); bữa nóng ở toà thị chính là tiệc cảm ơn tối Chủ nhật, không phải bữa trưa (loại C); "each of you gets a voucher… which you can spend in any of the nine cafés around the market square" ⇒ **B** ("a choice of local businesses" = chín quán cà phê).`, ev: `which you can spend in any of the nine cafés around the market square` },
    14: { a: ['C'], vi: `"please don't read aloud from the printed guide" (loại A); "I also don't want you phoning me. My phone is for emergencies" (loại B); thẻ ghi câu hỏi: "You write down the question and the visitor's email address… one of the university's historians will send them a proper answer" ⇒ **C** ("an expert" = nhà sử học của trường đại học).`, ev: `You write down the question and the visitor's email address, drop the card in the box` },
    15: { a: ['D'], vi: `Old Customs House: chụp ảnh thì "that's fine, let them snap away" (loại A); "The top storey is still full of scaffolding… nobody… goes above it" ⇒ **D** (một tầng đóng cửa với khách). "storey" = "level". 📘 Ôn Matching khi nghe: Tập 5 Ngày 4; bẫy phủ định: Ngày 15.`, ev: `The top storey is still full of scaffolding` },
    16: { a: ['A'], vi: `Merchants' Hall: trần vẽ thập niên 1620, ánh sáng mạnh làm hỏng màu — "people may take photographs, but not with a flash" ⇒ **A**. Bẫy C (gửi túi): "We did think about… but… that idea's gone".`, ev: `So people may take photographs, but not with a flash` },
    17: { a: ['B'], vi: `Ice House: "safety isn't my worry. Space is. Eight visitors is the absolute limit" ⇒ **B** (chỉ một số ít người vào cùng lúc). Bậc thang đủ sáng, có tay vịn — không phải vấn đề an toàn.`, ev: `Eight visitors is the absolute limit` },
    18: { a: ['G'], vi: `Bell Tower: "I'm not asking you to count heads" (loại B) và "children are welcome" (loại F); "parties go up on the hour and on the half hour, with a guide, and at no other time" ⇒ **G** (chỉ vào theo giờ định sẵn). Câu khó nhất của nhóm: hai phương án bị bác trước khi đáp án xuất hiện.`, ev: `so parties go up on the hour and on the half hour, with a guide, and at no other time` },
    19: { a: ['E'], vi: `Weavers' Cottage: đồ đạc là bản sao nên được ngồi, mở tủ, thử khung dệt — "Hands are not the problem" (loại H). "Feet are… everyone who goes in… pulls on a pair of the blue covers… over their shoes" ⇒ **E**. Phải suy "blue covers… over their shoes" = "shoe covers".`, ev: `pulls on a pair of the blue covers from the basket by the door, over their shoes` },
    20: { a: ['F'], vi: `Printing Works: "There's no timetable there" (loại G); máy nặng, bộ phận chuyển động ngang đầu trẻ nhỏ — "anyone under twelve has to have a grown-up beside them the whole time" ⇒ **F**. "a grown-up" = "an adult".`, ev: `So anyone under twelve has to have a grown-up beside them the whole time.` },

    /* ── Part 3 ── */
    21: { a: ['B'], vi: `Tom bác trước: "it's not the family connection" (loại A — ông của Leila làm ở đó nhưng cô biết SAU khi chọn); Leila bác: toà nhà đã thành căn hộ từ lâu, "nothing left to save" (loại C). "What decided it was a visit to the county archive… there's not one recording, not one written memoir, by anybody who actually stood on the factory floor" ⇒ **B**. Câu chẻ "What decided it was…" báo lý do THẬT. 📘 Ôn Part 3 bẫy: Tập 5 Ngày 12.`, ev: `But there's not one recording, not one written memoir, by anybody who actually stood on the factory floor.` },
    22: { a: ['A'], vi: `Báo địa phương: "We got two replies" (loại C); tưởng người ta ngại ghi âm — "They weren't, at all" (loại B); "what cracked it was Mrs Okoro… Ten of our twelve came from that one phone call" ⇒ **A**. "what cracked it" = thứ giải quyết được vấn đề.`, ev: `Ten of our twelve came from that one phone call.` },
    23: { a: ['C'], vi: `Câu hỏi về ý của LEILA và DR WHITAKER, không phải Tom. Âm thanh "fine" (loại A). Tom cho là người kể lạc đề (B) — Leila phản đối: "I'm not sure that's the real issue… The problem was us. Every time someone wandered, we dragged them back to question seven"; thầy: "I'm with Leila… An interview isn't a questionnaire read aloud" ⇒ **C**. Bẫy B là ý của Tom — đúng nội dung, sai người.`, ev: `Every time someone wandered, we dragged them back to question seven.` },
    24: { a: ['A'], vi: `Tom nêu hai cách: sửa ngày trong bản chép (B) hoặc bỏ cuộc đình công (C) — "Neither… you don't correct a memory, and you certainly don't throw it away… It's evidence, and I'd give it a section of its own" ⇒ **A** (đáng được nghiên cứu như một đề tài riêng). "in their own right" = "a section of its own".`, ev: `It's evidence, and I'd give it a section of its own.` },
    25: { a: ['B'], vi: `Leila: bỏ hết tên (C); Tom: chỉ tên gọi (A) — thầy bác cả hai (thị trấn nhỏ, tên gọi + chức việc là lộ; có người MUỐN được nêu tên): "it isn't your decision to make… have each person tick the one they're comfortable with" ⇒ **B**.`, ev: `have each person tick the one they're comfortable with` },
    26: { a: ['A', 'D'], vi: `(A) trích đoạn ghi âm: "The voices are the whole point. Keep those." Bị gạt: ảnh của người kể — chưa rõ bản quyền, "leave them out" (B); bản đồ — "it belongs in the written report… it's a luxury" (C); phim quay toà nhà — rung, "you've answered your own question" (E) ⇒ **A, D** (thứ tự nào cũng được). 📘 Ôn chọn TWO: Tập 4 Ngày 4.`, ev: `The voices are the whole point. Keep those.` },
    27: { a: ['A', 'D'], vi: `Đáp án thứ hai của cặp 26–27: (D) "What the audience can't do without is some sense of the dates… One slide, a simple timeline. Put that in." — "an outline of the main dates" = "a simple timeline". Chú ý ý này KHÔNG do sinh viên đề xuất mà do thầy thêm vào ngay sau khi gạt bản đồ ⇒ **A, D**.`, ev: `One slide, a simple timeline. Put that in.` },
    28: { a: ['topics'], vi: `Hai sinh viên vẫn gửi trước CÂU HỎI — "It's polite, and it gives you rehearsed answers. Send them a list of topics instead." ⇒ **topics**; Leila nhắc lại "Topics, not questions". Bẫy "questions" (việc đang làm, bị thay) và "headings" (cách thầy tả các chủ đề — bốn năm "headings" — nhưng thứ được gửi là "a list of topics"). 📘 Ôn Flow-chart khi nghe: Tập 3 Ngày 17; bẫy đổi ý: Tập 5 Ngày 12.`, ev: `Send them a list of topics instead.` },
    29: { a: ['object'], vi: `Tom gợi ý cho xem một tấm ảnh trong kho lưu trữ — thầy: ảnh ít và toàn chụp quản lý; "I'd ask each person to bring an object from their working life" ⇒ **object**. Lưu đồ viết "an ___" — mạo từ "an" loại luôn "photograph". Ba ví dụ "A tool, a badge, a pay packet" là minh hoạ, không phải đáp án.`, ev: `I'd ask each person to bring an object from their working life.` },
    30: { a: ['summary'], vi: `Chép đầy đủ (transcript) mất 6 giờ một buổi — "Don't. Not for all of them. Within a day… write a summary, a page at most, with the times of the passages you might quote." ⇒ **summary**. Bẫy "transcript": việc Tom ĐÃ làm, bị bác. "Within one day" = "Within a day"; bước cuối của lưu đồ "Send it to the interviewee" = "post the summary to the interviewee".`, ev: `Within a day, while it's fresh, write a summary, a page at most, with the times of the passages you might quote.` },

    /* ── Part 4 ── */
    31: { a: ['physics'], vi: `"He wasn't an architect, and he had no musical training to speak of. He was a young lecturer in physics at Harvard" ⇒ **physics**. Hai thứ bị bác (kiến trúc, âm nhạc) đứng TRƯỚC đáp án — kiểu "not… nor… but" của Part 4. 📘 Ôn Part 4 bài giảng chuyên sâu: Tập 5 Ngày 5.`, ev: `He was a young lecturer in physics at Harvard` },
    32: { a: ['pipe'], vi: `"he sounded a single organ pipe, stopped it, and timed with a stopwatch how long the note remained audible" ⇒ **pipe**. Ghi chú đã có "organ" nên chỉ điền một từ. Bẫy "stopwatch": dụng cụ ĐO, không phải thứ phát ra nốt nhạc.`, ev: `he sounded a single organ pipe, stopped it, and timed with a stopwatch how long the note remained audible` },
    33: { a: ['cushions'], vi: `"he and his assistants carried in cushions borrowed from the seats of a nearby theatre" ⇒ **cushions** (đệm ghế; giữ số nhiều). "bringing in… from a theatre" = "carried in… borrowed from… a nearby theatre". Bẫy "seats": đệm lấy TỪ ghế, không phải mang ghế vào.`, ev: `carried in cushions borrowed from the seats of a nearby theatre` },
    34: { a: ['volume'], vi: `"depends on two things only: the volume of the room, and the total amount of absorbing material inside it" ⇒ **volume** (thể tích — không phải âm lượng). Bẫy "shape": điều ông TƯỞNG quan trọng nhưng "made hardly any difference" — nói SAU đáp án để gài người điền muộn.`, ev: `depends on two things only: the volume of the room, and the total amount of absorbing material inside it` },
    35: { a: ['narrow'], vi: `"They are long, they are high and, above all, they are narrow." ⇒ **narrow**. Ghi chú đã in "long, high and ___"; "above all" báo đây là đặc điểm quan trọng nhất — phần sau của bài giải thích vì sao.`, ev: `They are long, they are high and, above all, they are narrow.` },
    36: { a: ['walls'], vi: `"In a narrow room, sound bounces off the side walls and reaches you a fraction of a second after the sound that comes straight from the stage" ⇒ **walls**. Bẫy "ceiling": phản xạ từ trần "doesn't do the same job" — tới hai tai giống nhau, thêm độ to nhưng không thêm cảm giác không gian. "the direct sound" = "the sound that comes straight from the stage".`, ev: `sound bounces off the side walls and reaches you a fraction of a second after the sound that comes straight from the stage` },
    37: { a: ['seats'], vi: `"under pressure to make the building pay, the committee insisted on more seats" ⇒ **seats**. "demanded a larger number of" = "insisted on more"; "the planners" = "the committee". Bẫy "balconies": bị SỬA hình dạng, không phải thứ được yêu cầu thêm. 📘 Ôn Part 4 Summary band 8: Tập 5 Ngày 12.`, ev: `the committee insisted on more seats` },
    38: { a: ['hear'], vi: `Bẫy lớn: "People often say that the hall was simply too reverberant. It wasn't." Lời phàn nàn thật: "the musicians found that they couldn't hear each other" ⇒ **hear** (động từ nguyên mẫu sau "unable to"). "one another" = "each other"; "players on the platform" = "On the platform, the musicians".`, ev: `the musicians found that they couldn't hear each other` },
    39: { a: ['bass'], vi: `"listeners heard plenty of violins and trumpets, but the sound had no bass" ⇒ **bass** (âm trầm). "the music lacked ___" = "the sound had no bass". Chính tả: b-a-s-s (đọc /beɪs/, không viết "base"). Bẫy "violins / trumpets": thứ nghe RÕ.`, ev: `but the sound had no bass` },
    40: { a: ['vineyard'], vi: `"like the slopes of a valley planted with vines. The name stuck: it's known as the vineyard layout." ⇒ **vineyard** (vườn nho — một từ, không tách "vine yard"). Bẫy "vines": hình ảnh so sánh, còn TÊN gọi là "vineyard"; "terraces" đã in trong bản tóm tắt.`, ev: `it's known as the vineyard layout` },
  },
};
