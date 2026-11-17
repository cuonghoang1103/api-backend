/**
 * Đề 5 — Listening, THI CUỐI TẬP 3 (docs/ielts-lo-trinh-0-8.md mục 4.2 · sau Tập 3 Ngày 30). TỰ SOẠN 18/11/2026.
 * Mức band 6.0 — khó hơn Đề 4 một bậc: ~150–160 từ/phút (lượt lời dài, gần như không câu đệm), từ vựng B2, hầu hết đáp án đứng
 * SAU hai phương án bị bác bỏ, paraphrase mức 3–4 (đổi cấu trúc, ý phải suy ra — vd. "split the recordings three ways" = share
 * it equally); Part 3 có BA người nói ngang hàng (không có thầy dẫn dắt), Part 4 giọng New Zealand.
 * Bối cảnh theo mục 4.2: bảo hiểm · trung tâm cộng đồng · nhóm nghiên cứu 3 người · bài giảng "nông nghiệp đô thị" (giọng NZ).
 *   Part 1: Form + Short answer (T3 N1, N16, N28; giọng AU + UK) · Part 2: MCQ + Plan (T3 N4, N12) ·
 *   Part 3: MCQ + Matching + chọn TWO, 3 người nói (T3 N8, N17, N20) · Part 4: Note + Flow-chart (T3 N13, N17, N24).
 * Bẫy chính: first floor → second; ba người → hai; laptop (của công ty) → guitar; £9,000 → £8,500; 1/9, 28/8 → 29/8; £9 / £25
 * → £14; photos → receipt; 48 giờ → 10 ngày làm việc; mái dột / mở rộng → hệ thống sưởi; hội đồng / siêu thị → người dân; công
 * ty ngoài / món nóng → giờ mở cửa; người già / cha mẹ → thiếu niên; phiếu giấy / điện thoại → website; phòng cạnh quán cà phê
 * (cũ) → phòng sau lễ tân; kho (khoá) ↔ phòng máy tính; Hannah làm ở tiệm / cô hướng dẫn gợi ý → thiếu nghiên cứu về lứa tuổi;
 * ít người trả lời / câu khó hiểu → quá dài; từng người / video → nhóm nhỏ; cỡ mẫu / lỗi thời → không trung thực; nhờ cô / thuê
 * công ty → tự làm; đặt phòng / email cô / đọc bài báo → viết lại bảng hỏi + làm poster; 20 triệu → 40%; packaging → transport;
 * energy → water.
 * Dữ kiện nông nghiệp đô thị là kiến thức phổ biến (victory gardens ở Mỹ: khoảng 20 triệu vườn năm 1944, ước tính ~40% rau TƯƠI tiêu thụ ở Mỹ — đã soát 18/11, thêm chữ "fresh" cho đúng con số hay được trích;
 * Cuba đầu thập niên 1990 mất nguồn dầu + phân bón nhập khẩu; vườn cộng đồng trên các lô đất trống ở Christchurch sau động đất
 * 2010–2011; thuỷ canh tuần hoàn có thể dùng ít nước hơn tới ~90%; đất đô thị nhiễm chì từ sơn và xăng; aquaponics: cá → ammonia
 * → vi khuẩn → nitrat → rễ cây) — soạn theo trí nhớ, CHƯA đối chiếu lại nguồn trong phiên này. Hãng Northgate Insurance, trung
 * tâm Eastfield, Dr Osei và mọi nhân vật đều HƯ CẤU.
 * Mỗi đáp án có `ev` = chuỗi NGUYÊN VĂN trong lời thoại + giải thích tiếng Việt (nêu bẫy, trỏ bài ôn).
 */
import type { DeNghe } from './types';

export const NGHE_DE5: DeNghe = {
  id: 'nghe-de5',
  kyNang: 'nghe',
  ten: 'Listening — Đề 5 (thi cuối Tập 3)',
  boDe: 'Đề 5',
  capDo: 'Band 6.0',
  moTa: 'Contents insurance enquiry (AU + UK) · Community centre talk & plan · Three students plan a research project · Lecture on urban agriculture (New Zealand speaker)',
  phut: 30,
  phan: [
    /* ════════════════ PART 1 — hỏi mua bảo hiểm đồ đạc ════════════════ */
    {
      so: 1,
      tieuDe: 'Northgate Insurance — telephone enquiry',
      dan: 'Part 1. You will hear a man telephoning an insurance company to ask about insurance for the things in his flat. First, you have some time to look at questions 1 to 10.',
      boiCanh: 'Daniel (giọng Anh) gọi hãng Northgate Insurance hỏi mua bảo hiểm đồ đạc (contents insurance) cho căn hộ thuê; nhân viên Mia nói giọng Úc. Chú ý: căn hộ ở TẦNG mấy (first / second), HIỆN có mấy người ở, món đồ anh thật sự lo, tổng giá trị SAU khi trừ đồ của bạn cùng nhà, ngày bảo hiểm BẮT ĐẦU; phần câu hỏi ngắn: phí của gói anh CHỌN, giấy tờ phải gửi, thời gian trả tiền bồi thường.',
      docTruoc: 30,
      loi: [
        { ai: 'Mia', giong: 'au-nu', s: `Good morning, Northgate Insurance, Mia speaking. How can I help?` },
        { ai: 'Daniel', giong: 'uk-nam', s: `Hi. I'd like to get a price for contents insurance, please. I'm renting a flat, and the policy I have at the moment is about to run out.` },
        { ai: 'Mia', giong: 'au-nu', s: `No worries. I'll just take a few details first. Could I have your full name?` },
        { ai: 'Daniel', giong: 'uk-nam', s: `It's Daniel Whitlock. That's W, H, I, T, L, O, C, K.` },
        { ai: 'Mia', giong: 'au-nu', s: `W, H, I, T, L, O, C, K. Thanks, Daniel. And the address of the property?` },
        { ai: 'Daniel', giong: 'uk-nam', s: `Flat 3, 48 Mill Lane, Leeds.` },
        { ai: 'Mia', giong: 'au-nu', s: `Is that a ground-floor flat? I have to ask, because it affects the price.` },
        { ai: 'Daniel', giong: 'uk-nam', s: `No. The ground floor is a bakery. I always want to say that we're on the first floor, but there's another flat directly above the shop, and ours is above that. So it's the second floor.` },
        { ai: 'Mia', giong: 'au-nu', s: `Second floor. That actually helps you. And do you live there on your own?` },
        { ai: 'Daniel', giong: 'uk-nam', s: `There were three of us until the spring, but one of my flatmates moved out to live with his girlfriend, so now there are just two of us.` },
        { ai: 'Mia', giong: 'au-nu', s: `OK. What about security? Is there a burglar alarm?` },
        { ai: 'Daniel', giong: 'uk-nam', s: `No, there's no alarm, I'm afraid. The landlord keeps promising us one. But there is a camera above the main entrance, on the street. The bakery had it put in last year.` },
        { ai: 'Mia', giong: 'au-nu', s: `That counts. I'll make a note of it. Now, is there anything particularly valuable that you want to cover? For most people of your age, it's a laptop.` },
        { ai: 'Daniel', giong: 'uk-nam', s: `My laptop actually belongs to the company I work for, so they insure it. The thing I'm worried about is my guitar. It was made by hand, and it cost me £1,400.` },
        { ai: 'Mia', giong: 'au-nu', s: `Right, I'll list that separately. And have you worked out what everything in the flat is worth altogether?` },
        { ai: 'Daniel', giong: 'uk-nam', s: `I did it last night. It came to £9,000, but then I realised that I'd counted the television, and that's my flatmate's. Without it, the total is £8,500.` },
        { ai: 'Mia', giong: 'au-nu', s: `Fine. And when would you like the cover to begin? The first of September?` },
        { ai: 'Daniel', giong: 'uk-nam', s: `A bit earlier, please. My present policy ends on the twenty-eighth of August, so the new one needs to start on the twenty-ninth.` },
        { ai: 'Mia', giong: 'au-nu', s: `Got it. Now, we have two policies that would suit you. Our Standard policy is £9 a month. It covers theft, fire and water damage, but only while your things are inside the flat.` },
        { ai: 'Daniel', giong: 'uk-nam', s: `Only inside? I take the guitar out most weekends. I play in a band.` },
        { ai: 'Mia', giong: 'au-nu', s: `Then you'd want our Plus policy. That covers your belongings anywhere in the country, and it's £14 a month.` },
        { ai: 'Daniel', giong: 'uk-nam', s: `Hmm. Is there a fee for setting it up as well? The last company charged me £25.` },
        { ai: 'Mia', giong: 'au-nu', s: `We don't charge anything for that. The monthly payment is all you'd pay.` },
        { ai: 'Daniel', giong: 'uk-nam', s: `Then I'll go for Plus.` },
        { ai: 'Mia', giong: 'au-nu', s: `Good. One more thing about the guitar. For any single item worth over a thousand pounds, we need proof of its value before the policy starts.` },
        { ai: 'Daniel', giong: 'uk-nam', s: `I've got photos of it on my phone. Can I email you those?` },
        { ai: 'Mia', giong: 'au-nu', s: `Photos are useful if it's ever stolen, but they don't show what it cost. What we need from you is the receipt. A scan of it is fine.` },
        { ai: 'Daniel', giong: 'uk-nam', s: `I think I've still got it somewhere. And if I ever have to make a claim, how long does it take? Your advert says forty-eight hours.` },
        { ai: 'Mia', giong: 'au-nu', s: `Forty-eight hours is how quickly we promise to contact you. Most claims are actually paid within ten working days. A complicated one can take up to a month.` },
        { ai: 'Daniel', giong: 'uk-nam', s: `That's fair enough. Let's go ahead, then.` },
        { ai: 'Mia', giong: 'au-nu', s: `Lovely. I'll email the documents to you this afternoon.` },
      ],
      nhom: [
        {
          id: 'n1-form', tu: 1, den: 7, dang: 'form',
          huongDan: 'Complete the form below.\nWrite **ONE WORD AND/OR A NUMBER** for each answer.',
          gioiHan: { tu: 1, so: true },
          tieuDe: 'Northgate Insurance — Enquiry Form',
          dong: [
            'Type of insurance: contents (rented flat)',
            'Customer\'s name: Daniel [[1]]',
            'Address: Flat 3, 48 Mill Lane, Leeds',
            'Position of flat: on the [[2]] floor (above a bakery)',
            'Number of people living in the flat: [[3]]',
            'Security: no alarm, but there is a [[4]] over the street entrance',
            'Most valuable item: a [[5]] (cost £1,400)',
            'Total value of contents: £[[6]]',
            'Cover to begin on: [[7]] August',
          ],
        },
        {
          id: 'n1-short', tu: 8, den: 10, dang: 'short',
          huongDan: 'Answer the questions below.\nWrite **NO MORE THAN TWO WORDS AND/OR A NUMBER** for each answer.',
          gioiHan: { tu: 2, so: true },
          dong: [
            'How much will Daniel pay each month for the policy he chooses? £[[8]]',
            'What must Daniel send to the company to prove the value of his most valuable item? [[9]]',
            'Within how many working days are most claims paid? [[10]]',
          ],
        },
      ],
    },

    /* ════════════════ PART 2 — trung tâm cộng đồng Eastfield (sơ đồ tầng trệt) ════════════════ */
    {
      so: 2,
      tieuDe: 'Eastfield Community Centre',
      dan: 'Part 2. You will hear the manager of a community centre talking to local people at an open evening. First, you have some time to look at questions 11 to 20.',
      boiCanh: 'Fiona, quản lý trung tâm cộng đồng Eastfield, nói với người dân trong buổi mở cửa: trung tâm vừa sửa xong có gì đổi, rồi chỉ các phòng trên sơ đồ. Chú ý: lý do THẬT phải đóng cửa, ai góp PHẦN LỚN tiền, điều ĐÃ ĐỔI ở quán cà phê, nhóm người trung tâm muốn thu hút NHẤT, cách đặt phòng HIỆN NAY; phần sơ đồ: bắt đầu ở cửa chính (phía dưới), lễ tân bên phải, quán cà phê bên trái, hành lang chạy thẳng tới hội trường.',
      docTruoc: 40,
      loi: [
        { ai: 'Fiona', giong: 'uk-nu', s: `Good evening, everyone, and welcome to the open evening at Eastfield Community Centre. I'm Fiona, the centre manager. For those of you who haven't been inside since we reopened, I'll explain what has changed, and then I'll show you where everything is on the plan.` },
        { ai: 'Fiona', giong: 'uk-nu', s: `As you know, we were closed for six months last year. A lot of people assume that was because of the roof. It's true that the roof of the main hall used to leak, but that was repaired several years ago. And although we would love to have more space, an extension was never something we could afford. No, what forced us to close was the heating system. It was forty years old, it failed its safety inspection, and the whole thing had to be taken out and replaced.` },
        { ai: 'Fiona', giong: 'uk-nu', s: `People also ask me who paid for it all. The city council gave us a grant, and we're grateful, but it covered only about a tenth of the cost. A supermarket chain offered a much larger sum, on condition that its name went on the front of the building, and our committee turned that down. So the great majority of the money was raised by local residents, through sponsored walks, cake sales and hundreds of small donations.` },
        { ai: 'Fiona', giong: 'uk-nu', s: `Now, the café. It's still staffed entirely by our volunteers. We did talk to a catering company about taking it over, but nothing came of that. And I'm afraid the menu hasn't grown: it's still soup, sandwiches and cakes, because we have no licence to cook hot meals. What is different is the opening hours. The café used to shut at four, and it now stays open until nine, so people coming to evening classes can get something to eat.` },
        { ai: 'Fiona', giong: 'uk-nu', s: `Who uses the centre? Our club for the over-sixties is so popular that there's a waiting list, and the parent-and-toddler mornings are always busy. The people we hardly ever see are teenagers. So this year, they are the group we most want to bring in, and that's why we've set up a homework club and a music room, which I'll show you in a moment.` },
        { ai: 'Fiona', giong: 'uk-nu', s: `One last practical point: booking a room. Please don't look for the paper forms at reception, because we've got rid of them. And I know many of you are used to ringing the office, but the phone is only answered in the mornings, and we can no longer take bookings that way. Everything now goes through the booking page on our website. It takes about two minutes.` },
        { ai: 'Fiona', giong: 'uk-nu', s: `Right, let's look at the plan. We're standing at the main entrance, at the bottom. Reception is just inside, on your right, and the café is opposite it, on your left. The corridor in front of you runs straight up to the main hall.` },
        { ai: 'Fiona', giong: 'uk-nu', s: `The art studio used to be next to the café, but the painters complained about the smell of soup. So we've moved it across the corridor. It's now the room immediately after reception, on the right-hand side.` },
        { ai: 'Fiona', giong: 'uk-nu', s: `The room that the artists left, next door to the café, has become the children's playroom. Parents can sit in the café and still hear what's going on.` },
        { ai: 'Fiona', giong: 'uk-nu', s: `Carry on up the corridor. The computer room is the last door on the left, just before you reach the hall. Don't confuse it with the room facing it, on the right. That's only a store room, and it's kept locked.` },
        { ai: 'Fiona', giong: 'uk-nu', s: `At the top of the corridor, you'll see the doors of the main hall straight ahead of you. Don't go in. Turn left instead, and walk to the end. The music room is in the corner of the building, beside the hall. We put it there to keep the noise as far away from reception as possible.` },
        { ai: 'Fiona', giong: 'uk-nu', s: `Finally, the bicycle workshop, which our volunteers run on Saturday mornings. That isn't inside the building at all. From the hall doors, turn right, go past the kitchen and out through the side door. The workshop is the wooden hut in the garden.` },
        { ai: 'Fiona', giong: 'uk-nu', s: `So, please have a good look around, and do ask me if you have any questions.` },
      ],
      nhom: [
        {
          id: 'n2-mcq', tu: 11, den: 15, dang: 'mcq',
          huongDan: 'Choose the correct letter, **A, B** or **C**.',
          cau: [
            { n: 11, s: 'Why did the centre have to close for six months?', chon: [{ k: 'A', t: 'The roof needed to be repaired.' }, { k: 'B', t: 'The heating had to be replaced.' }, { k: 'C', t: 'The building was being made larger.' }] },
            { n: 12, s: 'Where did most of the money for the work come from?', chon: [{ k: 'A', t: 'the city council' }, { k: 'B', t: 'a supermarket company' }, { k: 'C', t: 'people who live in the area' }] },
            { n: 13, s: 'What has changed at the café?', chon: [{ k: 'A', t: 'It stays open later than before.' }, { k: 'B', t: 'It now serves hot meals.' }, { k: 'C', t: 'It is run by an outside company.' }] },
            { n: 14, s: 'Which group does the centre most want to attract this year?', chon: [{ k: 'A', t: 'retired people' }, { k: 'B', t: 'parents with small children' }, { k: 'C', t: 'teenagers' }] },
            { n: 15, s: 'How should people book a room now?', chon: [{ k: 'A', t: 'by telephoning the office' }, { k: 'B', t: 'by using the website' }, { k: 'C', t: 'by filling in a form at reception' }] },
          ],
        },
        {
          id: 'n2-map', tu: 16, den: 20, dang: 'map',
          huongDan: 'Label the plan below.\nWrite the correct letter, **A–G**, next to Questions 16–20.',
          tieuDe: 'Eastfield Community Centre — ground floor',
          hop: { ds: 'ABCDEFG'.split('').map((k) => ({ k, t: k })) },
          cau: [
            { n: 16, s: 'Art studio' },
            { n: 17, s: 'Children\'s playroom' },
            { n: 18, s: 'Computer room' },
            { n: 19, s: 'Music room' },
            { n: 20, s: 'Bicycle workshop' },
          ],
          hinh: {
            w: 560, h: 440,
            chuThich: 'Plan of the ground floor (not to scale). You start at the main entrance, at the bottom.',
            ve: [
              // Hàng trên: phòng góc trái, hội trường, bếp (góc phải)
              { t: 'rect', x: 50, y: 40, w: 100, h: 120 },
              { t: 'rect', x: 150, y: 40, w: 250, h: 120, nen: '#dbe7f3', nhan: 'Main hall' },
              { t: 'rect', x: 400, y: 40, w: 100, h: 120 },
              // Hành lang ngang (trước cửa hội trường) + cửa hông
              { t: 'rect', x: 50, y: 160, w: 450, h: 30, nen: '#f6f3ea', bo: 0 },
              { t: 'text', x: 458, y: 180, s: 'side door', co: 10, giua: true, nghieng: true },
              // Hành lang dọc
              { t: 'rect', x: 250, y: 190, w: 50, h: 210, nen: '#f6f3ea', bo: 0 },
              { t: 'text', x: 275, y: 300, s: 'Corridor', co: 10, giua: true, nghieng: true },
              // Dãy trái
              { t: 'rect', x: 50, y: 190, w: 200, h: 70 },
              { t: 'rect', x: 50, y: 260, w: 200, h: 70 },
              { t: 'rect', x: 50, y: 330, w: 200, h: 70, nen: '#f3e7d3', nhan: 'Café' },
              // Dãy phải
              { t: 'rect', x: 300, y: 190, w: 200, h: 70 },
              { t: 'rect', x: 300, y: 260, w: 200, h: 70 },
              { t: 'rect', x: 300, y: 330, w: 200, h: 70, nen: '#dbe7f3', nhan: 'Reception' },
              // Vườn + nhà gỗ ngoài toà nhà
              { t: 'line', d: [[500, 175], [532, 175], [532, 210]], dut: true },
              { t: 'rect', x: 508, y: 210, w: 48, h: 56, nen: '#e3ecd6' },
              { t: 'text', x: 532, y: 284, s: 'Garden', co: 10, giua: true, nghieng: true },
              // Cửa chính
              { t: 'line', d: [[275, 436], [275, 404]], mui: true },
              { t: 'text', x: 340, y: 426, s: 'Main entrance', co: 11, giua: true },
              // Chữ cái
              { t: 'chu', k: 'A', x: 100, y: 100 },
              { t: 'chu', k: 'B', x: 150, y: 225 },
              { t: 'chu', k: 'C', x: 400, y: 225 },
              { t: 'chu', k: 'D', x: 150, y: 295 },
              { t: 'chu', k: 'E', x: 400, y: 295 },
              { t: 'chu', k: 'F', x: 532, y: 238 },
              { t: 'chu', k: 'G', x: 450, y: 108 },
            ],
          },
        },
      ],
    },

    /* ════════════════ PART 3 — ba sinh viên lên kế hoạch một đề tài nghiên cứu ════════════════ */
    {
      so: 3,
      tieuDe: 'Planning a group research project',
      dan: 'Part 3. You will hear three students, Eleanor, Marcus and Hannah, planning a research project about why students buy second-hand clothes. First, you have some time to look at questions 21 to 30.',
      boiCanh: 'Ba sinh viên ngang hàng — Eleanor (nữ, giọng Anh), Marcus (nam, giọng Úc), Hannah (nữ, giọng Mỹ) — bàn đề tài nghiên cứu "vì sao sinh viên mua quần áo cũ". Không có thầy cô dẫn dắt: phải tự theo ai đề xuất, ai bác, ai chốt. Chú ý: lý do THẬT chọn đề tài, vấn đề của bản hỏi thử, cách phỏng vấn được CHỐT, điều Marcus lo; rồi quyết định cho TỪNG phần việc và hai việc sẽ làm trước thứ Sáu.',
      docTruoc: 40,
      loi: [
        { ai: 'Eleanor', giong: 'uk-nu', s: `Right, are we all here? Let's get our research project organised. Marcus, you missed the first meeting, so shall we explain how we ended up with second-hand clothes as a topic?` },
        { ai: 'Marcus', giong: 'au-nam', s: `Please. I assumed it was Hannah's idea, since she works in that charity shop on the high street.` },
        { ai: 'Hannah', giong: 'us-nu', s: `I do volunteer there, but that isn't the reason. And it wasn't Dr Osei's suggestion, either. She wanted us to look at fast fashion in general, and we had to persuade her. No, what decided it was the reading. Nearly all the existing studies are about shoppers over thirty. Hardly anybody has asked people of our age why they buy used clothes, so there's a real gap.` },
        { ai: 'Marcus', giong: 'au-nam', s: `OK, that's a good argument. And how did the trial run of the questionnaire go?` },
        { ai: 'Eleanor', giong: 'uk-nu', s: `Mixed. Getting people to do it wasn't a problem. We had forty responses in two days, which is more than we needed. And nobody seemed confused by the wording of the questions. The trouble was the length. People told us that it took nearly twenty minutes, and several of them gave up halfway through. We'll have to cut it down.` },
        { ai: 'Marcus', giong: 'au-nam', s: `Fine. Then there are the interviews. I'd assumed we would talk to people one at a time.` },
        { ai: 'Hannah', giong: 'us-nu', s: `That's thirty separate appointments, Marcus. We simply don't have the weeks.` },
        { ai: 'Marcus', giong: 'au-nam', s: `Video calls, then? They're quicker to arrange.` },
        { ai: 'Eleanor', giong: 'uk-nu', s: `I don't think people open up on a screen. What about seeing them four or five at a time? People love talking about clothes, and one person's story reminds another of theirs.` },
        { ai: 'Hannah', giong: 'us-nu', s: `And six sessions would cover everybody. I like it.` },
        { ai: 'Marcus', giong: 'au-nam', s: `All right, groups it is. There's one thing that bothers me about the results, though.` },
        { ai: 'Hannah', giong: 'us-nu', s: `The size of the sample? Two hundred questionnaires is plenty for a project like this.` },
        { ai: 'Marcus', giong: 'au-nam', s: `No, I'm happy with the numbers. And fashion doesn't change so fast that the data will be out of date by the summer. What worries me is honesty. Everyone likes to sound green. People will tell us they buy second-hand to protect the planet, when really it's to save money.` },
        { ai: 'Eleanor', giong: 'uk-nu', s: `Then we should ask what they actually bought last month, not just what they believe. Now, let's divide up the work. First, the literature review.` },
        { ai: 'Hannah', giong: 'us-nu', s: `That's the part I was dreading. It's a huge amount of reading.` },
        { ai: 'Eleanor', giong: 'uk-nu', s: `Actually, I wrote about clothing and waste for a module last year, and Dr Osei says there's no rule against using that material again. Half the review exists already. We'd only need to bring it up to date.` },
        { ai: 'Marcus', giong: 'au-nam', s: `Brilliant. What about analysing the questionnaires? I've never used the statistics program.` },
        { ai: 'Hannah', giong: 'us-nu', s: `Me neither. Could we ask Dr Osei to go through the figures with us?` },
        { ai: 'Eleanor', giong: 'uk-nu', s: `She'd say that's our job. But the library runs a free workshop on the program every Wednesday. If the three of us go next week, we'll be able to do the analysis ourselves afterwards.` },
        { ai: 'Marcus', giong: 'au-nam', s: `Good idea. I'll sign us up. Then there's typing up the interview recordings. That takes hours.` },
        { ai: 'Hannah', giong: 'us-nu', s: `My roommate paid a company to do hers.` },
        { ai: 'Marcus', giong: 'au-nam', s: `With what money? We have no budget at all. I think the only fair way is to split the recordings three ways, so that each of us types up two sessions.` },
        { ai: 'Eleanor', giong: 'uk-nu', s: `Agreed. And the presentation at the end?` },
        { ai: 'Hannah', giong: 'us-nu', s: `I'd rather not design slides. I'm hopeless at it.` },
        { ai: 'Eleanor', giong: 'uk-nu', s: `I actually enjoy that kind of thing. Leave the whole presentation to me, and you two can concentrate on the written report.` },
        { ai: 'Marcus', giong: 'au-nam', s: `Deal. So, what needs to happen before we meet again on Friday?` },
        { ai: 'Eleanor', giong: 'uk-nu', s: `The questionnaire has to be shortened. Hannah and I can rewrite it tonight.` },
        { ai: 'Hannah', giong: 'us-nu', s: `Sure. Should we book a room for the group sessions as well?` },
        { ai: 'Marcus', giong: 'au-nam', s: `We can't, not until we know the dates. And there's no point emailing Dr Osei about them, because she's away until the twentieth.` },
        { ai: 'Eleanor', giong: 'uk-nu', s: `True. What we do need is volunteers. Marcus, could you design a poster asking people to take part?` },
        { ai: 'Marcus', giong: 'au-nam', s: `Yes, I'll do that, and I'll send it to you both for comments.` },
        { ai: 'Hannah', giong: 'us-nu', s: `Great. Oh, and the article Dr Osei recommended? I've had a look at it, and it's about clothing factories, so I don't think any of us needs to read it.` },
        { ai: 'Eleanor', giong: 'uk-nu', s: `That saves some time. See you on Friday, then.` },
      ],
      nhom: [
        {
          id: 'n3-mcq', tu: 21, den: 24, dang: 'mcq',
          huongDan: 'Choose the correct letter, **A, B** or **C**.',
          cau: [
            { n: 21, s: 'Why did the students choose second-hand clothes as their topic?', chon: [{ k: 'A', t: 'There is little research on people of their age.' }, { k: 'B', t: 'One of them works in a second-hand shop.' }, { k: 'C', t: 'Their supervisor proposed it.' }] },
            { n: 22, s: 'What problem did the students find when they tried out their questionnaire?', chon: [{ k: 'A', t: 'Too few people answered it.' }, { k: 'B', t: 'Some of the questions were unclear.' }, { k: 'C', t: 'It took too long to complete.' }] },
            { n: 23, s: 'How do the students decide to carry out their interviews?', chon: [{ k: 'A', t: 'in small groups' }, { k: 'B', t: 'with one person at a time' }, { k: 'C', t: 'by video call' }] },
            { n: 24, s: 'What is Marcus\'s main concern about the results?', chon: [{ k: 'A', t: 'The sample will be too small.' }, { k: 'B', t: 'People may not give honest answers.' }, { k: 'C', t: 'The information will soon be out of date.' }] },
          ],
        },
        {
          id: 'n3-match', tu: 25, den: 28, dang: 'match-feature',
          huongDan: 'What do the students decide about each of the following tasks?\nChoose **FOUR** answers from the box and write the correct letter, **A–F**, next to Questions 25–28.',
          hop: {
            tieuDe: 'Decisions',
            ds: [
              { k: 'A', t: 'use work that has already been done' },
              { k: 'B', t: 'give it to one member of the group' },
              { k: 'C', t: 'ask their supervisor to help' },
              { k: 'D', t: 'attend a training session first' },
              { k: 'E', t: 'pay someone else to do it' },
              { k: 'F', t: 'share it equally' },
            ],
          },
          cau: [
            { n: 25, s: 'the literature review' },
            { n: 26, s: 'the analysis of the questionnaires' },
            { n: 27, s: 'typing up the interviews' },
            { n: 28, s: 'the presentation' },
          ],
        },
        {
          id: 'n3-mcq2', tu: 29, den: 30, dang: 'mcq2',
          huongDan: 'Choose **TWO** letters, **A–E**.',
          nhieu: {
            ns: [29, 30],
            s: 'Which TWO things will be done before the students\' next meeting?',
            chon: [
              { k: 'A', t: 'rewriting the questionnaire' },
              { k: 'B', t: 'booking a room' },
              { k: 'C', t: 'designing a poster' },
              { k: 'D', t: 'emailing the supervisor' },
              { k: 'E', t: 'reading an article' },
            ],
          },
        },
      ],
    },

    /* ════════════════ PART 4 — bài giảng: nông nghiệp đô thị (giọng New Zealand) ════════════════ */
    {
      so: 4,
      tieuDe: 'Lecture — Urban agriculture',
      dan: 'Part 4. You will hear part of a lecture about growing food in cities. First, you have some time to look at questions 31 to 40.',
      boiCanh: 'Một giảng viên người New Zealand giảng về nông nghiệp đô thị: lịch sử (vườn thời chiến, Cuba, Christchurch), lợi ích, khó khăn, rồi mô tả chi tiết MỘT hệ thống nuôi cá kết hợp trồng rau (aquaponics). Giọng NZ: nguyên âm /e/ nghe gần /ɪ/ ("ten" gần như "tin"), /ɪ/ nghe gần /ə/ ("fish" gần như "fush"). Bài giảng không ai hỏi lại — bám các tiêu đề nhỏ của ghi chú. Chú ý bẫy: 20 triệu / 40 phần trăm, packaging / transport, energy / water.',
      docTruoc: 45,
      loi: [
        { ai: 'Lecturer', giong: 'nz-nam', s: `Good morning, everyone. In today's lecture I want to look at urban agriculture, which simply means producing food inside towns and cities. It's often presented as a brand-new idea. As we'll see, it is nothing of the kind.` },
        { ai: 'Lecturer', giong: 'nz-nam', s: `Let's start with a little history. During the Second World War, governments encouraged ordinary families to grow vegetables wherever they could: in back gardens, in parks, even on the roofs of apartment buildings. In the United States, these were called victory gardens. By 1944 there were about twenty million of them, and it's estimated that they produced around 40 per cent of the fresh vegetables eaten in the country.` },
        { ai: 'Lecturer', giong: 'nz-nam', s: `A more recent example is Cuba. At the beginning of the 1990s, the country suddenly lost its imports of oil and chemical fertiliser. Tractors stood still, and the shops emptied. People responded by planting crops on every empty piece of land in Havana, and many of those city gardens are still producing food today.` },
        { ai: 'Lecturer', giong: 'nz-nam', s: `Closer to home, some of you will remember what happened in Christchurch after the earthquakes of 2010 and 2011. Where buildings had been cleared away, volunteers created gardens on some of the empty sites. So, again and again, city farming has been a response to a crisis.` },
        { ai: 'Lecturer', giong: 'nz-nam', s: `What's different now is that people are choosing to do it. So what are the benefits? The most obvious one is freshness. A lettuce that is grown on a city rooftop can be on sale the same afternoon. You'll still find it wrapped in plastic, so I can't claim that packaging is reduced. But far less transport is required, and that means less fuel is burned.` },
        { ai: 'Lecturer', giong: 'nz-nam', s: `The second benefit surprises people. Many modern city farms are indoors, and the plants grow without soil, in a liquid that contains the minerals they need. You might assume that the big saving here is energy. It isn't, and I'll come back to that. The saving is water. Because every drop is collected and used again, these systems can need up to ninety per cent less water than a field producing the same crop.` },
        { ai: 'Lecturer', giong: 'nz-nam', s: `There are social benefits as well. Community gardens bring together neighbours who would otherwise never speak to each other. Organisers often report that the people who gain most are older residents who live alone. For them, the garden is less about vegetables than about company, and it seems to reduce loneliness.` },
        { ai: 'Lecturer', giong: 'nz-nam', s: `Now for the problems. The first is energy. A plant grown indoors gets no sunshine, so the farm has to supply light, and electricity is usually one of its biggest costs. That is why indoor farms concentrate on salad leaves and herbs, which grow quickly and sell for a good price. Nobody is going to feed a city with wheat or rice that was grown under lamps.` },
        { ai: 'Lecturer', giong: 'nz-nam', s: `The second problem concerns outdoor gardens. City soil is not always clean. Near busy roads and old houses, it may contain lead, which was once added to both paint and petrol. The usual solution is to grow food in boxes that have been filled with fresh soil brought in from outside.` },
        { ai: 'Lecturer', giong: 'nz-nam', s: `I'd like to finish with one system in a little more detail, because it shows how clever these farms can be. It's called aquaponics, and it combines fish farming with growing vegetables. It starts with a large tank of fish. As the fish eat, they produce waste, and the waste turns into a chemical called ammonia, which would poison them if it stayed in the tank.` },
        { ai: 'Lecturer', giong: 'nz-nam', s: `So the water is pumped out of the tank and through a filter. It isn't really a filter in the normal sense. Living on the filter are bacteria, and they convert the ammonia into nitrates. Nitrates are exactly what plants need in order to grow.` },
        { ai: 'Lecturer', giong: 'nz-nam', s: `From there, the water flows into long trays where the vegetables are growing. There is no soil. The plants take up the nitrates through their roots, and in doing so they clean the water.` },
        { ai: 'Lecturer', giong: 'nz-nam', s: `The trays are built slightly higher than the fish tank. That means no second pump is needed: the clean water simply runs back down to the fish by gravity, and the cycle begins again.` },
        { ai: 'Lecturer', giong: 'nz-nam', s: `The result is two products, fish and vegetables, from one system. And apart from the electricity for the pump, the only thing the farmer has to add each day is food for the fish. Next week, we'll ask whether farms like this can ever make a profit.` },
      ],
      nhom: [
        {
          id: 'n4-note', tu: 31, den: 36, dang: 'note',
          huongDan: 'Complete the notes below.\nWrite **ONE WORD AND/OR A NUMBER** for each answer.',
          gioiHan: { tu: 1, so: true },
          tieuDe: 'Urban agriculture',
          dong: [
            '## A long history',
            '• Second World War: \'victory gardens\' in the USA grew about [[31]]% of the nation\'s fresh vegetables',
            '• Cuba, early 1990s: city gardens appeared after the country lost its supplies of [[32]] and fertiliser',
            '• Christchurch: gardens were created on empty sites after the earthquakes',
            '## Benefits',
            '• food is fresher, and less [[33]] is required',
            '• indoor farms without soil: up to 90% less [[34]] than a field',
            '• community gardens seem to reduce [[35]], especially for old people who live alone',
            '## Problems',
            '• indoor farms: the high cost of electricity for lighting',
            '• outdoor gardens: city soil may contain [[36]] (once used in paint and petrol)',
          ],
        },
        {
          id: 'n4-flow', tu: 37, den: 40, dang: 'flow',
          huongDan: 'Complete the flow-chart below.\nWrite **ONE WORD ONLY** for each answer.',
          gioiHan: { tu: 1 },
          tieuDe: 'How an aquaponic system works',
          dong: [
            '→ fish are kept in a large tank; their waste becomes ammonia',
            '→ the water is pumped through a filter, where [[37]] change the ammonia into nitrates',
            '→ in the growing trays, the plants take in the nitrates through their [[38]]',
            '→ the clean water goes back to the fish tank by [[39]]',
            '→ apart from electricity, the only thing added each day is [[40]] for the fish',
          ],
        },
      ],
    },
  ],

  dapAn: {
    /* ── Part 1 ── */
    1: { a: ['Whitlock'], vi: `"It's Daniel Whitlock. That's W, H, I, T, L, O, C, K." — Mia đọc lại đúng từng chữ ⇒ **Whitlock**. Chú ý W "double-u", H /eɪtʃ/, và cụm cuối C-K. Giọng Úc của Mia đọc "A" hơi giống /aɪ/ — nhưng ở đây người đánh vần là Daniel (giọng Anh). 📘 Ôn Form completion + giọng trộn: Tập 3 Ngày 1, Ngày 16.`, ev: `It's Daniel Whitlock. That's W, H, I, T, L, O, C, K.` },
    2: { a: ['second', '2nd'], vi: `Mia hỏi "ground-floor flat?" — Daniel: tầng trệt là tiệm bánh; "I always want to say that we're on the first floor, but there's another flat directly above the shop, and ours is above that. So it's the second floor." ⇒ **second**. Bẫy hai lớp: "ground" bị phủ định, "first" là điều anh HAY nói nhầm. (Anh–Anh: ground → first → second.)`, ev: `So it's the second floor.` },
    3: { a: ['2', 'two'], vi: `"There were three of us until the spring, but one of my flatmates moved out…, so now there are just two of us." ⇒ **2**. Bẫy quá khứ / hiện tại: "three" là TRƯỚC mùa xuân; phiếu hỏi số người đang ở. 📘 Ôn bẫy đổi ý: Tập 3 Ngày 9.`, ev: `There were three of us until the spring, but one of my flatmates moved out to live with his girlfriend, so now there are just two of us.` },
    4: { a: ['camera'], vi: `"No, there's no alarm, I'm afraid… But there is a camera above the main entrance, on the street." — phiếu: "no alarm, but there is a ___ over the street entrance" ⇒ **camera**. "over" = "above"; "alarm" đã in sẵn ở vế phủ định.`, ev: `But there is a camera above the main entrance, on the street.` },
    5: { a: ['guitar'], vi: `Mia đoán "it's a laptop" — Daniel: laptop là của công ty, công ty tự bảo hiểm; "The thing I'm worried about is my guitar… it cost me £1,400." ⇒ **guitar**. Con số £1,400 in sẵn trên phiếu giúp xác nhận đúng món. Chính tả: g-u-i-t-a-r.`, ev: `The thing I'm worried about is my guitar.` },
    6: { a: ['8,500', '8500'], vi: `"It came to £9,000, but then I realised that I'd counted the television, and that's my flatmate's. Without it, the total is £8,500." ⇒ **8,500**. Bẫy tự sửa: £9,000 là con số ĐẦU, tính nhầm cả ti-vi của bạn cùng nhà. 📘 Ôn số liệu khi nghe: Tập 3 Ngày 5.`, ev: `Without it, the total is £8,500.` },
    7: { a: ['29', '29th', 'twenty-ninth'], vi: `Mia gợi ý 1/9 — "A bit earlier, please. My present policy ends on the twenty-eighth of August, so the new one needs to start on the twenty-ninth." ⇒ **29**. Ba ngày được nhắc: 1/9 (gợi ý, bị bác), 28/8 (hợp đồng CŨ hết), 29/8 (hợp đồng MỚI bắt đầu) — phiếu hỏi ngày BẮT ĐẦU.`, ev: `My present policy ends on the twenty-eighth of August, so the new one needs to start on the twenty-ninth.` },
    8: { a: ['14'], vi: `Gói Standard £9 chỉ bảo hiểm đồ TRONG nhà; Daniel mang guitar đi diễn nên chọn Plus: "it's £14 a month" — và không có phí thiết lập ("We don't charge anything for that"; £25 là phí của hãng CŨ) ⇒ **14**. Câu hỏi hỏi gói anh CHỌN: phải nghe tới "Then I'll go for Plus". 📘 Ôn Short answer khi nghe: Tập 3 Ngày 28.`, ev: `That covers your belongings anywhere in the country, and it's £14 a month.` },
    9: { a: ['receipt', 'the receipt', 'a receipt'], vi: `Daniel đề nghị gửi ảnh — Mia: "Photos are useful if it's ever stolen, but they don't show what it cost. What we need from you is the receipt." ⇒ **receipt** (hoá đơn; chữ "p" câm — /rɪˈsiːt/). "prove the value" = "proof of its value"; "photos" bị bác vì không cho biết GIÁ.`, ev: `What we need from you is the receipt.` },
    10: { a: ['10', 'ten', '10 days', 'ten days'], vi: `Quảng cáo ghi 48 giờ — Mia: "Forty-eight hours is how quickly we promise to contact you. Most claims are actually paid within ten working days. A complicated one can take up to a month." ⇒ **10**. Ba mốc thời gian, ba việc khác nhau: 48 giờ = liên hệ lại; 10 ngày = PHẦN LỚN hồ sơ được trả; một tháng = ca phức tạp.`, ev: `Most claims are actually paid within ten working days.` },

    /* ── Part 2 ── */
    11: { a: ['B'], vi: `"A lot of people assume that was because of the roof… that was repaired several years ago. And although we would love to have more space, an extension was never something we could afford. No, what forced us to close was the heating system… the whole thing had to be taken out and replaced." ⇒ **B**. A là điều người ta TƯỞNG (mái đã sửa từ lâu); C là mong muốn không đủ tiền làm. 📘 Ôn MCQ Part 2: Tập 3 Ngày 4.`, ev: `No, what forced us to close was the heating system.` },
    12: { a: ['C'], vi: `Hội đồng thành phố chỉ góp "about a tenth"; chuỗi siêu thị đề nghị khoản lớn nhưng bị từ chối ("our committee turned that down"); "the great majority of the money was raised by local residents" — "people who live in the area" = "local residents" ⇒ **C**. Bẫy B: khoản "much larger sum" KHÔNG bao giờ được nhận.`, ev: `So the great majority of the money was raised by local residents, through sponsored walks, cake sales and hundreds of small donations.` },
    13: { a: ['A'], vi: `Vẫn do tình nguyện viên phục vụ (loại C — bàn với công ty nhưng "nothing came of that"); vẫn không có món nóng (loại B); "What is different is the opening hours. The café used to shut at four, and it now stays open until nine" ⇒ **A**. "What is different is…" báo đáp án sau hai ý KHÔNG đổi.`, ev: `The café used to shut at four, and it now stays open until nine, so people coming to evening classes can get something to eat.` },
    14: { a: ['C'], vi: `Câu lạc bộ người trên 60 đã kín chỗ, buổi cho cha mẹ và trẻ nhỏ luôn đông; "The people we hardly ever see are teenagers. So this year, they are the group we most want to bring in" ⇒ **C**. Phải hiểu "they" = teenagers ở câu trước (tham chiếu qua hai câu). A và B là nhóm ĐÃ đến nhiều.`, ev: `So this year, they are the group we most want to bring in, and that's why we've set up a homework club and a music room, which I'll show you in a moment.` },
    15: { a: ['B'], vi: `Phiếu giấy ở lễ tân đã bỏ ("we've got rid of them" — loại C); điện thoại chỉ trực buổi sáng và "we can no longer take bookings that way" (loại A); "Everything now goes through the booking page on our website." ⇒ **B**.`, ev: `Everything now goes through the booking page on our website.` },
    16: { a: ['E'], vi: `"The art studio used to be next to the café… So we've moved it across the corridor. It's now the room immediately after reception, on the right-hand side." ⇒ **E** (bên phải hành lang, ngay sau lễ tân). Bẫy: D là vị trí CŨ (cạnh quán cà phê). 📘 Ôn Map / plan labelling: Tập 3 Ngày 4 + 12.`, ev: `It's now the room immediately after reception, on the right-hand side.` },
    17: { a: ['D'], vi: `"The room that the artists left, next door to the café, has become the children's playroom." ⇒ **D** (bên trái, sát quán cà phê). Phải nhớ thông tin câu trước: phòng mà hoạ sĩ BỎ LẠI chính là phòng cạnh quán cà phê.`, ev: `The room that the artists left, next door to the café, has become the children's playroom.` },
    18: { a: ['B'], vi: `"Carry on up the corridor. The computer room is the last door on the left, just before you reach the hall." ⇒ **B**. Bẫy C: phòng đối diện, bên PHẢI, chỉ là kho và luôn khoá ("Don't confuse it with the room facing it").`, ev: `The computer room is the last door on the left, just before you reach the hall.` },
    19: { a: ['A'], vi: `Tới cửa hội trường, đừng vào: "Turn left instead, and walk to the end. The music room is in the corner of the building, beside the hall." ⇒ **A** (góc trên bên trái, cạnh hội trường). Bẫy G: cũng cạnh hội trường nhưng ở phía bên PHẢI, khu bếp.`, ev: `The music room is in the corner of the building, beside the hall.` },
    20: { a: ['F'], vi: `"That isn't inside the building at all. From the hall doors, turn right, go past the kitchen and out through the side door. The workshop is the wooden hut in the garden." ⇒ **F** — chữ duy nhất nằm NGOÀI toà nhà. G nằm ở khu bếp mà bạn chỉ đi NGANG QUA.`, ev: `The workshop is the wooden hut in the garden.` },

    /* ── Part 3 ── */
    21: { a: ['A'], vi: `Marcus đoán vì Hannah làm ở tiệm đồ cũ — Hannah: "that isn't the reason. And it wasn't Dr Osei's suggestion, either… Nearly all the existing studies are about shoppers over thirty. Hardly anybody has asked people of our age… so there's a real gap." — "little research on people of their age" ⇒ **A**. B và C đều bị chính Hannah bác trước khi nêu lý do thật. 📘 Ôn Part 3 ba người nói: Tập 3 Ngày 8.`, ev: `Hardly anybody has asked people of our age why they buy used clothes, so there's a real gap.` },
    22: { a: ['C'], vi: `"Getting people to do it wasn't a problem (loại A)… nobody seemed confused by the wording of the questions (loại B). The trouble was the length. People told us that it took nearly twenty minutes" — "took too long to complete" ⇒ **C**. "length" ở đây là thời gian làm, hiểu nhờ câu ngay sau.`, ev: `The trouble was the length.` },
    23: { a: ['A'], vi: `Từng người một (Marcus) → Hannah: 30 cuộc hẹn, không đủ thời gian; video call (Marcus) → Eleanor: người ta không cởi mở qua màn hình; "What about seeing them four or five at a time?" — Hannah: "I like it." — Marcus: "All right, groups it is." ⇒ **A**. Phải nghe tới câu CHỐT của cả ba.`, ev: `All right, groups it is.` },
    24: { a: ['B'], vi: `Hannah đoán cỡ mẫu — Marcus: "No, I'm happy with the numbers (loại A). And fashion doesn't change so fast that the data will be out of date by the summer (loại C). What worries me is honesty… People will tell us they buy second-hand to protect the planet, when really it's to save money." ⇒ **B**.`, ev: `What worries me is honesty.` },
    25: { a: ['A'], vi: `Phần tổng quan tài liệu: Eleanor đã viết về quần áo và rác thải cho một môn năm ngoái, cô hướng dẫn cho dùng lại: "Half the review exists already. We'd only need to bring it up to date." — "use work that has already been done" ⇒ **A**. 📘 Ôn Matching khi nghe: Tập 3 Ngày 20.`, ev: `Half the review exists already.` },
    26: { a: ['D'], vi: `Phân tích bảng hỏi: Hannah đề nghị nhờ Dr Osei (bẫy C) — Eleanor: "She'd say that's our job. But the library runs a free workshop on the program every Wednesday. If the three of us go next week, we'll be able to do the analysis ourselves afterwards." — "attend a training session first" = đi workshop trước rồi tự làm ⇒ **D**.`, ev: `If the three of us go next week, we'll be able to do the analysis ourselves afterwards.` },
    27: { a: ['F'], vi: `Gõ lại băng phỏng vấn: bạn cùng phòng Hannah thuê công ty (bẫy E) — Marcus: không có ngân sách; "the only fair way is to split the recordings three ways, so that each of us types up two sessions" — "share it equally" ⇒ **F**. Paraphrase mức 4: không có chữ "share" hay "equally" trong lời thoại.`, ev: `I think the only fair way is to split the recordings three ways, so that each of us types up two sessions.` },
    28: { a: ['B'], vi: `Bài thuyết trình: Hannah không muốn làm slide; Eleanor: "Leave the whole presentation to me, and you two can concentrate on the written report." — giao cho MỘT người ⇒ **B**.`, ev: `Leave the whole presentation to me, and you two can concentrate on the written report.` },
    29: { a: ['A', 'C'], vi: `Hai việc sẽ làm trước thứ Sáu: (A) "The questionnaire has to be shortened. Hannah and I can rewrite it tonight." và (C) Marcus làm poster tuyển người: "Yes, I'll do that". Ba việc còn lại bị gạt: đặt phòng (chưa biết ngày), email Dr Osei (cô đi vắng tới ngày 20), đọc bài báo (không liên quan) ⇒ **A, C** (thứ tự nào cũng được). 📘 Ôn chọn TWO khi nghe: Tập 3 Ngày 17.`, ev: `Hannah and I can rewrite it tonight.` },
    30: { a: ['A', 'C'], vi: `Đáp án thứ hai của cặp 29–30: (C) "Marcus, could you design a poster asking people to take part?" — "Yes, I'll do that, and I'll send it to you both for comments." Bẫy B, D, E đều được NÊU RA dưới dạng câu hỏi rồi bị bác ("We can't…", "there's no point…", "I don't think any of us needs to read it") ⇒ **A, C**.`, ev: `Marcus, could you design a poster asking people to take part?` },

    /* ── Part 4 ── */
    31: { a: ['40', 'forty'], vi: `"By 1944 there were about twenty million of them, and it's estimated that they produced around 40 per cent of the fresh vegetables eaten in the country." ⇒ **40**. Bẫy: "twenty million" là SỐ VƯỜN; ghi chú có ký hiệu % sau ô trống ⇒ cần tỉ lệ. Giọng NZ: "per cent" nghe gần "puh-sint" (/e/ bị nâng gần /ɪ/). 📘 Ôn Note completion Part 4: Tập 3 Ngày 13; giọng NZ: Ngày 12, 20, 24.`, ev: `By 1944 there were about twenty million of them, and it's estimated that they produced around 40 per cent of the fresh vegetables eaten in the country.` },
    32: { a: ['oil'], vi: `"At the beginning of the 1990s, the country suddenly lost its imports of oil and chemical fertiliser." — "lost its supplies of" = "lost its imports of" ⇒ **oil**. Ghi chú đã có "fertiliser" ⇒ ô trống là thứ còn lại trong cặp.`, ev: `At the beginning of the 1990s, the country suddenly lost its imports of oil and chemical fertiliser.` },
    33: { a: ['transport'], vi: `"You'll still find it wrapped in plastic, so I can't claim that packaging is reduced. But far less transport is required, and that means less fuel is burned." ⇒ **transport**. Bẫy: "packaging" bị chính giảng viên loại ("I can't claim…"); "fuel" là HỆ QUẢ, nhưng ghi chú dùng đúng khuôn "less ___ is required".`, ev: `But far less transport is required, and that means less fuel is burned.` },
    34: { a: ['water'], vi: `"You might assume that the big saving here is energy. It isn't, and I'll come back to that. The saving is water… these systems can need up to ninety per cent less water than a field producing the same crop." ⇒ **water**. Bẫy "You might assume… It isn't": "energy" là điều ta TƯỞNG — thật ra điện lại là vấn đề lớn nhất (phần Problems).`, ev: `Because every drop is collected and used again, these systems can need up to ninety per cent less water than a field producing the same crop.` },
    35: { a: ['loneliness'], vi: `"the people who gain most are older residents who live alone. For them, the garden is less about vegetables than about company, and it seems to reduce loneliness." ⇒ **loneliness** (chính tả: lone-li-ness, giữ chữ "e"). Không điền "alone" (tính từ) — sau "reduce" cần danh từ.`, ev: `For them, the garden is less about vegetables than about company, and it seems to reduce loneliness.` },
    36: { a: ['lead'], vi: `"Near busy roads and old houses, it may contain lead, which was once added to both paint and petrol." ⇒ **lead** (chì — đọc /led/, khác động từ "lead" /liːd/). "once used in" = "was once added to".`, ev: `Near busy roads and old houses, it may contain lead, which was once added to both paint and petrol.` },
    37: { a: ['bacteria'], vi: `"Living on the filter are bacteria, and they convert the ammonia into nitrates." — "change… into" = "convert… into" ⇒ **bacteria** (đã là số nhiều; số ít: bacterium). Câu đảo ngữ "Living on the filter are…" khiến đáp án đứng SAU động từ. 📘 Ôn Flow-chart khi nghe: Tập 3 Ngày 17.`, ev: `Living on the filter are bacteria, and they convert the ammonia into nitrates.` },
    38: { a: ['roots'], vi: `"The plants take up the nitrates through their roots, and in doing so they clean the water." — "take in" = "take up" ⇒ **roots** (số nhiều).`, ev: `The plants take up the nitrates through their roots, and in doing so they clean the water.` },
    39: { a: ['gravity'], vi: `"That means no second pump is needed: the clean water simply runs back down to the fish by gravity" ⇒ **gravity** (trọng lực). Bẫy: "pump" — máy bơm chỉ dùng ở chiều ĐI; chiều về thì không cần.`, ev: `That means no second pump is needed: the clean water simply runs back down to the fish by gravity, and the cycle begins again.` },
    40: { a: ['food'], vi: `"apart from the electricity for the pump, the only thing the farmer has to add each day is food for the fish" ⇒ **food**. Lưu đồ giữ nguyên khuôn "the only thing… is ___ for the fish".`, ev: `And apart from the electricity for the pump, the only thing the farmer has to add each day is food for the fish.` },
  },
};
