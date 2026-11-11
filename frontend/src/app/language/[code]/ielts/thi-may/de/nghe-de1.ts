/**
 * Đề 1 — Listening, THI CUỐI TẬP 1 (docs/ielts-lo-trinh-0-8.md mục 4.2 · Ngày 15). TỰ SOẠN 12/11/2026.
 * Mức band 3.5–4.5: đúng format thật (4 Part × 10 câu, nghe MỘT lần) nhưng câu ngắn, từ vựng A2–B1, nói chậm (~130 từ/phút),
 * đáp án được NHẮC LẠI ở lượt lời kế tiếp như Part 1 thật. Bối cảnh theo mục 4.2: đăng ký thư viện · thông báo xe buýt ·
 * hai sinh viên chọn đề tài · bài giảng về giấc ngủ. Chỉ dùng dạng Tập 1 ĐÃ DẠY:
 *   Part 1: Form + Note completion (N7, N15) · Part 2: MCQ + Plan labelling (N9) · Part 3: MCQ + Matching + Note (N11) ·
 *   Part 4: Note + Summary completion (N13).
 * Bẫy kiểu đề thật (mức nhẹ): đánh vần C/K; giá cũ 2 → mới 3; trẻ em 4 quyển / người lớn 8; DVD 1 tuần / sách 3 tuần;
 * lớp Spanish đã hết → computer; 15 phút kỳ trước → 10 phút; table → chart; lights → seats; warm → cool.
 * Giọng: uk-nam, uk-nu, us-nu, us-nam (đủ 4). `ev` = chuỗi NGUYÊN VĂN trong một lượt lời.
 */
import type { DeNghe } from './types';

export const NGHE_DE1: DeNghe = {
  id: 'nghe-de1',
  kyNang: 'nghe',
  ten: 'Listening — Đề 1 (thi cuối Tập 1)',
  boDe: 'Đề 1',
  capDo: 'Band 3.5 → 4.5',
  moTa: 'Joining a public library · Changes to city bus services & new bus station plan · Two students choose a presentation topic · Lecture on sleep',
  phut: 30,
  phan: [
    /* ════════════════ PART 1 — đăng ký thẻ thư viện ════════════════ */
    {
      so: 1,
      tieuDe: 'Westbrook Library — joining the library',
      dan: 'Part 1. You will hear a woman talking to a librarian about joining a public library. First, you have some time to look at questions 1 to 10.',
      boiCanh: 'Sara mới chuyển đến và muốn làm thẻ thư viện. Chú ý: đánh vần họ và tên đường, số điện thoại, nghề nghiệp (không còn là sinh viên), giấy tờ chứng minh địa chỉ, phí làm lại thẻ (giá cũ / giá mới), số sách người lớn / trẻ em, thời hạn sách / DVD, ngày mở cửa muộn, lớp học miễn phí.',
      docTruoc: 30,
      loi: [
        { ai: 'Librarian', giong: 'uk-nam', s: 'Good afternoon. Welcome to Westbrook Library. How can I help you?' },
        { ai: 'Sara', giong: 'uk-nu', s: 'Hello. I\'ve just moved to this area and I\'d like to join the library. Can I do that today?' },
        { ai: 'Librarian', giong: 'uk-nam', s: 'Of course. It only takes a few minutes. I just need to fill in a form with you. Can I have your name, please?' },
        { ai: 'Sara', giong: 'uk-nu', s: 'Yes, it\'s Sara Marlow.' },
        { ai: 'Librarian', giong: 'uk-nam', s: 'Could you spell your surname for me?' },
        { ai: 'Sara', giong: 'uk-nu', s: 'Sure. It\'s M, A, R, L, O, W.' },
        { ai: 'Librarian', giong: 'uk-nam', s: 'M, A, R, L, O, W. Thank you. And what\'s your address, Sara?' },
        { ai: 'Sara', giong: 'uk-nu', s: 'It\'s 27 Canal Street.' },
        { ai: 'Librarian', giong: 'uk-nam', s: 'Is that K, A, N…?' },
        { ai: 'Sara', giong: 'uk-nu', s: 'No, it starts with a C. C, A, N, A, L. Canal Street. It\'s near the station.' },
        { ai: 'Librarian', giong: 'uk-nam', s: 'Oh yes, I know it. 27 Canal Street. And can I have a phone number?' },
        { ai: 'Sara', giong: 'uk-nu', s: 'My mobile number is 07700 900 462.' },
        { ai: 'Librarian', giong: 'uk-nam', s: '07700 900 462. Good. Now, are you a student? We have a special card for students.' },
        { ai: 'Sara', giong: 'uk-nu', s: 'Not any more. I finished university last year. I\'m a nurse now, at the city hospital.' },
        { ai: 'Librarian', giong: 'uk-nam', s: 'A nurse. Lovely. Now, I need to see something with your address on it. Have you got a letter from your bank, for example?' },
        { ai: 'Sara', giong: 'uk-nu', s: 'I haven\'t got a bank letter with me, I\'m afraid. But I\'ve got a phone bill here. Is that all right?' },
        { ai: 'Librarian', giong: 'uk-nam', s: 'Yes, a phone bill is fine. Thank you. Now, joining the library is free. You only pay if you lose your card and need a new one. That used to be two pounds, but now it\'s three pounds.' },
        { ai: 'Sara', giong: 'uk-nu', s: 'Three pounds. OK. I\'ll try not to lose it! How many books can I take home?' },
        { ai: 'Librarian', giong: 'uk-nam', s: 'With an adult card, you can borrow eight books at one time. Children can only take four.' },
        { ai: 'Sara', giong: 'uk-nu', s: 'Eight is plenty for me. And how long can I keep them?' },
        { ai: 'Librarian', giong: 'uk-nam', s: 'You can keep books for three weeks. But be careful with films. DVDs are only for one week.' },
        { ai: 'Sara', giong: 'uk-nu', s: 'Three weeks for books. Right. What time do you close? I usually finish work at six.' },
        { ai: 'Librarian', giong: 'uk-nam', s: 'On most days we close at half past five, I\'m afraid. But on Thursday we stay open late, until eight in the evening.' },
        { ai: 'Sara', giong: 'uk-nu', s: 'Oh, good. So Thursday is the best day for me. Are you open at the weekend?' },
        { ai: 'Librarian', giong: 'uk-nam', s: 'We\'re open on Saturday morning, until one o\'clock. We\'re closed on Sunday.' },
        { ai: 'Sara', giong: 'uk-nu', s: 'OK. One last question. Do you have any classes here? My friend told me about a Spanish class.' },
        { ai: 'Librarian', giong: 'uk-nam', s: 'We did have a Spanish class, but it finished last month. At the moment, there is a free computer class for members. It\'s on Monday mornings at ten o\'clock.' },
        { ai: 'Sara', giong: 'uk-nu', s: 'A computer class. My mother would love that. I\'ll tell her about it.' },
        { ai: 'Librarian', giong: 'uk-nam', s: 'Please do. Right, here is your card, Sara. Welcome to Westbrook Library.' },
        { ai: 'Sara', giong: 'uk-nu', s: 'Thank you very much.' },
      ],
      nhom: [
        {
          id: 'n1-form', tu: 1, den: 6, dang: 'form',
          huongDan: 'Complete the form below.\nWrite **ONE WORD AND/OR A NUMBER** for each answer.',
          gioiHan: { tu: 1, so: true },
          tieuDe: 'Westbrook Library — New Member Form',
          dong: [
            'First name: Sara',
            'Surname: [[1]]',
            'Address: 27 [[2]] Street',
            'Mobile phone: [[3]]',
            'Job: [[4]]',
            'Proof of address shown: a phone [[5]]',
            'Cost of a new card if the card is lost: £[[6]]',
          ],
        },
        {
          id: 'n1-note', tu: 7, den: 10, dang: 'note',
          huongDan: 'Complete the notes below.\nWrite **ONE WORD AND/OR A NUMBER** for each answer.',
          gioiHan: { tu: 1, so: true },
          tieuDe: 'Using the library',
          dong: [
            '• adults can borrow [[7]] books at one time',
            '• books can be kept for [[8]] weeks',
            '• the library stays open until 8 p.m. on [[9]]',
            '• free [[10]] class for members: Monday mornings, 10 a.m.',
          ],
        },
      ],
    },

    /* ════════════════ PART 2 — thông báo thay đổi xe buýt ════════════════ */
    {
      so: 2,
      tieuDe: 'Riverton City Buses — changes to services',
      dan: 'Part 2. You will hear a woman from a bus company talking to local people about changes to bus services and about a new bus station. First, you have some time to look at questions 11 to 20.',
      boiCanh: 'Karen Wells (công ty xe buýt Riverton) thông báo các thay đổi từ tháng Sáu rồi tả sơ đồ bến xe mới. Chú ý: lý do thật (không phải để tiết kiệm tiền), điều gì MỚI ở tuyến số 7, ba mức giá vé, nhóm nào được miễn phí LẦN ĐẦU, nơi lấy lịch chạy bản giấy; phần sơ đồ: bạn đi vào từ cổng chính ở Station Road (phía dưới sơ đồ).',
      docTruoc: 40,
      loi: [
        { ai: 'Karen', giong: 'us-nu', s: 'Good evening, everyone, and thank you for coming. My name is Karen Wells, and I work for Riverton City Buses. I\'m here to tell you about some changes to our bus services. They all begin on Monday the third of June.' },
        { ai: 'Karen', giong: 'us-nu', s: 'Let me start with the biggest change. As you may know, we are moving to a new bus station on Station Road. Some people think we are doing this to save money. That isn\'t true. The new building is actually costing us a lot. The real reason is that the old station on Market Street is too small. It was built for ten bus routes, and today we have eighteen.' },
        { ai: 'Karen', giong: 'us-nu', s: 'Now, a few words about the number 7 bus, because many of you use it. It will still run every fifteen minutes, and the first bus will still leave at six in the morning. What is new is that the number 7 will stop at the City Hospital. Patients and visitors have asked for this for years.' },
        { ai: 'Karen', giong: 'us-nu', s: 'Next, tickets. At the moment, a single ticket costs one pound eighty. From June, if you pay the driver, a single ticket will cost two pounds. But if you buy your ticket with our phone app, you will pay only one pound fifty. So the app is the cheapest way to travel.' },
        { ai: 'Karen', giong: 'us-nu', s: 'There is good news for families, too. People over sixty-five already travel free every day, and that is not changing. Students will continue to pay half price. The new offer is for children. From June, children under twelve will travel free at weekends when they are with an adult.' },
        { ai: 'Karen', giong: 'us-nu', s: 'Finally, timetables. The new timetable is on our website now. If you would like a paper copy, please don\'t go to the old bus station, because the office there has already closed. From next week, you can pick up a timetable at the public library. People often ask at the tourist office, but they don\'t have them.' },
        { ai: 'Karen', giong: 'us-nu', s: 'Now, let me describe the new bus station, so that you can find your way around. Please look at the plan. You come in through the main entrance from Station Road. The information desk is straight in front of you, in the middle of the hall.' },
        { ai: 'Karen', giong: 'us-nu', s: 'The ticket office is very easy to find. It\'s immediately on your right as you come in. On your left, opposite the ticket office, there will be a small newspaper shop, but that won\'t open until the autumn.' },
        { ai: 'Karen', giong: 'us-nu', s: 'If you are hungry, walk past the information desk towards the bus stops. The café is in the far left corner of the hall, right next to the bus stops. In the other corner, on the far right, there is an office for our drivers. That is not open to the public.' },
        { ai: 'Karen', giong: 'us-nu', s: 'The waiting room is on the right-hand side of the hall, about halfway between the entrance and the bus stops. It has seats for sixty people, and it is heated in winter. The toilets are directly opposite the waiting room, on the left-hand side of the hall.' },
        { ai: 'Karen', giong: 'us-nu', s: 'One more thing. Many of you come by bike. The bicycle park is outside the building. When you stand on Station Road and look at the main entrance, it is on your left. Taxis wait on the other side, to the right of the entrance. Thank you for listening. Are there any questions?' },
      ],
      nhom: [
        {
          id: 'n2-mcq', tu: 11, den: 15, dang: 'mcq',
          huongDan: 'Choose the correct letter, **A, B** or **C**.',
          cau: [
            { n: 11, s: 'Why is the bus company moving to a new bus station?', chon: [{ k: 'A', t: 'to save money' }, { k: 'B', t: 'because the old station is too small' }, { k: 'C', t: 'because the old station is in bad condition' }] },
            { n: 12, s: 'What is new about the number 7 bus?', chon: [{ k: 'A', t: 'It will stop at the hospital.' }, { k: 'B', t: 'It will run more often.' }, { k: 'C', t: 'It will start earlier in the morning.' }] },
            { n: 13, s: 'From June, how much will a single ticket cost if passengers pay the driver?', chon: [{ k: 'A', t: '£1.50' }, { k: 'B', t: '£1.80' }, { k: 'C', t: '£2.00' }] },
            { n: 14, s: 'Who will be able to travel free at weekends for the first time?', chon: [{ k: 'A', t: 'children under twelve' }, { k: 'B', t: 'students' }, { k: 'C', t: 'people over sixty-five' }] },
            { n: 15, s: 'From next week, where can people get a paper timetable?', chon: [{ k: 'A', t: 'at the old bus station' }, { k: 'B', t: 'at the tourist office' }, { k: 'C', t: 'at the public library' }] },
          ],
        },
        {
          id: 'n2-map', tu: 16, den: 20, dang: 'map',
          huongDan: 'Label the plan below.\nWrite the correct letter, **A–G**, next to Questions 16–20.',
          tieuDe: 'Riverton Bus Station — plan',
          hop: { ds: 'ABCDEFG'.split('').map((k) => ({ k, t: k })) },
          cau: [
            { n: 16, s: 'Ticket office' },
            { n: 17, s: 'Café' },
            { n: 18, s: 'Waiting room' },
            { n: 19, s: 'Toilets' },
            { n: 20, s: 'Bicycle park' },
          ],
          hinh: {
            w: 560, h: 430,
            chuThich: 'Plan of the new bus station (not to scale). You enter from Station Road, at the bottom of the plan.',
            ve: [
              // Sảnh chính
              { t: 'rect', x: 110, y: 30, w: 340, h: 300, nen: '#f7f7f2', bo: 2 },
              // Dãy điểm đỗ xe buýt ở phía trong cùng (trên sơ đồ)
              { t: 'rect', x: 120, y: 38, w: 320, h: 40, nen: '#e4ddd0', nhan: 'BUS STOPS 1–8' },
              // Quầy thông tin giữa sảnh
              { t: 'rect', x: 225, y: 185, w: 110, h: 44, nen: '#dbe7f3', nhan: 'Information desk' },
              // Cổng chính (khoảng hở ở tường dưới) + mũi tên đi vào
              { t: 'rect', x: 250, y: 322, w: 60, h: 14, nen: '#f7f7f2', bo: 0 },
              { t: 'line', d: [[280, 385], [280, 340]], mui: true },
              { t: 'text', x: 280, y: 316, s: 'main entrance', co: 11, giua: true, nghieng: true },
              // Đường Station Road
              { t: 'rect', x: 20, y: 390, w: 520, h: 30, nen: '#e6e6e6', bo: 0 },
              { t: 'text', x: 280, y: 410, s: 'STATION ROAD', co: 12, dam: true, giua: true },
              // Bãi taxi bên phải cổng (ngoài toà nhà)
              { t: 'rect', x: 465, y: 290, w: 75, h: 40, nen: '#f3ead0', nhan: 'Taxis' },
              // Chữ cái
              { t: 'chu', k: 'A', x: 190, y: 295 },
              { t: 'chu', k: 'B', x: 370, y: 295 },
              { t: 'chu', k: 'C', x: 140, y: 205 },
              { t: 'chu', k: 'D', x: 420, y: 205 },
              { t: 'chu', k: 'E', x: 140, y: 105 },
              { t: 'chu', k: 'F', x: 420, y: 105 },
              { t: 'chu', k: 'G', x: 60, y: 310 },
            ],
          },
        },
      ],
    },

    /* ════════════════ PART 3 — hai sinh viên chọn đề tài ════════════════ */
    {
      so: 3,
      tieuDe: 'Choosing a topic for a presentation',
      dan: 'Part 3. You will hear two students, Maya and Ben, choosing a topic for a presentation on their City Life course. First, you have some time to look at questions 21 to 30.',
      boiCanh: 'Maya và Ben chọn đề tài thuyết trình cho môn "City Life" của Dr Hall. Chú ý: thời lượng kỳ NÀY (không phải kỳ trước), lý do bỏ từng đề tài, ngày hẹn cuối cùng (sau khi một người từ chối), ai nhận việc gì (một người đề nghị, người kia nhận), và kế hoạch 3 phần của bài nói (table → chart, lights → seats).',
      docTruoc: 40,
      loi: [
        { ai: 'Ben', giong: 'us-nam', s: 'Hi, Maya. Have you got a minute? We need to choose a topic for our presentation for Dr Hall.' },
        { ai: 'Maya', giong: 'uk-nu', s: 'Yes, good idea. The course is called City Life, so the topic has to be about a problem or a place in our city.' },
        { ai: 'Ben', giong: 'us-nam', s: 'Right. How long does the presentation have to be? I thought it was fifteen minutes.' },
        { ai: 'Maya', giong: 'uk-nu', s: 'No, fifteen minutes was last term. This time we only have ten minutes, and then the class can ask questions.' },
        { ai: 'Ben', giong: 'us-nam', s: 'Ten minutes. OK, that isn\'t long. So, what about traffic? There is a lot of information about it online.' },
        { ai: 'Maya', giong: 'uk-nu', s: 'That\'s true, and it isn\'t a difficult topic. But I talked to some people in our class yesterday, and four other pairs are already doing traffic. Dr Hall will be bored.' },
        { ai: 'Ben', giong: 'us-nam', s: 'You\'re right. We need something different.' },
        { ai: 'Maya', giong: 'uk-nu', s: 'What about recycling? I think it\'s really interesting.' },
        { ai: 'Ben', giong: 'us-nam', s: 'It is interesting, but I did a big project on recycling at secondary school. I don\'t want to do the same thing again.' },
        { ai: 'Maya', giong: 'uk-nu', s: 'Fair enough. Well, how about parks? We could talk about Victoria Park. Who uses it, and how can we make it better?' },
        { ai: 'Ben', giong: 'us-nam', s: 'I like that. Nobody else is doing parks. Let\'s go there together and look around. Are you free on Friday afternoon?' },
        { ai: 'Maya', giong: 'uk-nu', s: 'No, sorry. I have a class until five on Friday. What about Saturday morning?' },
        { ai: 'Ben', giong: 'us-nam', s: 'Saturday morning is fine. I can\'t do Sunday anyway, because I work in a café.' },
        { ai: 'Maya', giong: 'uk-nu', s: 'Great. So, who is doing what? First, we need some photos of the park.' },
        { ai: 'Ben', giong: 'us-nam', s: 'I\'ll take the photos. My phone has a really good camera.' },
        { ai: 'Maya', giong: 'uk-nu', s: 'Good, because mine is terrible. We should also ask people some questions. Why do they come to the park? How often? We need a questionnaire.' },
        { ai: 'Ben', giong: 'us-nam', s: 'I can write it if you like.' },
        { ai: 'Maya', giong: 'uk-nu', s: 'Actually, I\'d like to write the questionnaire. I made one for my psychology course last year, so I know how to do it.' },
        { ai: 'Ben', giong: 'us-nam', s: 'OK, the questionnaire is yours. What about the slides?' },
        { ai: 'Maya', giong: 'uk-nu', s: 'Let\'s make the slides together. We can meet in the library on Monday.' },
        { ai: 'Ben', giong: 'us-nam', s: 'Perfect. Now, let\'s plan the talk. How should we start?' },
        { ai: 'Maya', giong: 'uk-nu', s: 'I think we should begin with a short history of the park. It opened in 1890, you know. Just one minute, with an old photo.' },
        { ai: 'Ben', giong: 'us-nam', s: 'Nice. Then the main part is our results. Why do people visit the park? Shall we put the numbers in a table?' },
        { ai: 'Maya', giong: 'uk-nu', s: 'A table is a bit boring, and it\'s hard to read from the back of the room. Let\'s use a chart. Everyone can understand a chart quickly.' },
        { ai: 'Ben', giong: 'us-nam', s: 'OK, a chart. And at the end, we should give one idea for improving the park. I was going to say more lights, because it\'s dark in the evening.' },
        { ai: 'Maya', giong: 'uk-nu', s: 'Lights are a good idea, but I think seats are more important. There are only six in the whole park, and old people have nowhere to sit.' },
        { ai: 'Ben', giong: 'us-nam', s: 'That\'s a good point. Let\'s say the park needs more seats, then.' },
        { ai: 'Maya', giong: 'uk-nu', s: 'Great. I\'ll write the plan tonight and send it to you.' },
      ],
      nhom: [
        {
          id: 'n3-mcq', tu: 21, den: 24, dang: 'mcq',
          huongDan: 'Choose the correct letter, **A, B** or **C**.',
          cau: [
            { n: 21, s: 'How long must the presentation be this term?', chon: [{ k: 'A', t: 'five minutes' }, { k: 'B', t: 'ten minutes' }, { k: 'C', t: 'fifteen minutes' }] },
            { n: 22, s: 'Why do Maya and Ben decide not to talk about traffic?', chon: [{ k: 'A', t: 'It is too difficult.' }, { k: 'B', t: 'There is not enough information.' }, { k: 'C', t: 'Too many other students have chosen it.' }] },
            { n: 23, s: 'What does Ben say about recycling?', chon: [{ k: 'A', t: 'He has studied it before.' }, { k: 'B', t: 'It is not interesting.' }, { k: 'C', t: 'It is not connected with city life.' }] },
            { n: 24, s: 'When will Maya and Ben visit the park?', chon: [{ k: 'A', t: 'on Friday afternoon' }, { k: 'B', t: 'on Saturday morning' }, { k: 'C', t: 'on Sunday morning' }] },
          ],
        },
        {
          id: 'n3-match', tu: 25, den: 27, dang: 'match-feature',
          huongDan: 'Who will do each of the following tasks?\nWrite the correct letter, **A, B** or **C**, next to Questions 25–27.',
          hop: { tieuDe: 'People', ds: [{ k: 'A', t: 'Maya' }, { k: 'B', t: 'Ben' }, { k: 'C', t: 'both Maya and Ben' }] },
          cau: [
            { n: 25, s: 'take photographs of the park' },
            { n: 26, s: 'write the questionnaire' },
            { n: 27, s: 'make the slides' },
          ],
        },
        {
          id: 'n3-note', tu: 28, den: 30, dang: 'note',
          huongDan: 'Complete the notes below.\nWrite **ONE WORD ONLY** for each answer.',
          gioiHan: { tu: 1 },
          tieuDe: 'Plan for the presentation on Victoria Park',
          dong: [
            '• Start: a short [[28]] of the park, with an old photo',
            '• Main part: why people visit the park — results shown in a [[29]]',
            '• End: one idea for improving the park — it needs more [[30]]',
          ],
        },
      ],
    },

    /* ════════════════ PART 4 — bài giảng về giấc ngủ ════════════════ */
    {
      so: 4,
      tieuDe: 'Lecture — why we sleep',
      dan: 'Part 4. You will hear part of a lecture about sleep. First, you have some time to look at questions 31 to 40.',
      boiCanh: 'Bài giảng nhập môn về giấc ngủ: ngủ bao nhiêu là đủ, một chu kỳ ngủ, hai giai đoạn quan trọng, hậu quả của thiếu ngủ và 4 lời khuyên. Chú ý các con số đi liền nhau (a third / thirty / ninety; seven–nine / ten / sixteen) và cặp trái nghĩa warm ↔ cool, coffee ↔ milk.',
      docTruoc: 45,
      loi: [
        { ai: 'Lecturer', giong: 'uk-nam', s: 'Good morning, everyone. In today\'s talk, I want to look at something that we all do every night, but that most of us know very little about: sleep.' },
        { ai: 'Lecturer', giong: 'uk-nam', s: 'Let\'s begin with a simple fact. An average person spends about a third of their life asleep. So if you live to the age of ninety, you will sleep for about thirty years. That sounds like a waste of time. But, as we will see, it isn\'t.' },
        { ai: 'Lecturer', giong: 'uk-nam', s: 'How much sleep do we need? For most adults, the answer is between seven and nine hours a night. Teenagers need more than adults, up to ten hours, because their bodies and brains are still growing. And a new baby may sleep for sixteen hours a day.' },
        { ai: 'Lecturer', giong: 'uk-nam', s: 'Now, sleep is not the same all through the night. We sleep in cycles, and each cycle lasts about ninety minutes. In a normal night, you go through four or five of these cycles. Each cycle has several stages. I will describe the two most important ones.' },
        { ai: 'Lecturer', giong: 'uk-nam', s: 'The first is deep sleep. In deep sleep, your breathing is slow, and it is very difficult to wake you. This is the time when the body repairs its muscles after the work of the day. That is why sports players need plenty of sleep.' },
        { ai: 'Lecturer', giong: 'uk-nam', s: 'The second stage is dream sleep. Scientists call it REM sleep. In this stage, your body does not move, but your eyes move quickly under your eyelids. The brain is very busy. It goes through the information from the day, and it stores new memories. So, if you study in the evening and then sleep well, you will remember more the next day.' },
        { ai: 'Lecturer', giong: 'uk-nam', s: 'What happens when we do not get enough sleep? First, it becomes hard to concentrate, and we make more mistakes at work or at school. Our health suffers, too. Studies show that people who sleep for less than six hours a night catch more colds than people who sleep well.' },
        { ai: 'Lecturer', giong: 'uk-nam', s: 'And there is a serious danger on the roads. Tired drivers react slowly, and they cause thousands of accidents every year.' },
        { ai: 'Lecturer', giong: 'uk-nam', s: 'So, how can we sleep better? Here is some simple advice. First, go to bed at the same time every night, even at weekends. Your body likes a routine.' },
        { ai: 'Lecturer', giong: 'uk-nam', s: 'Second, be careful about what you drink. Do not drink coffee after lunch, because caffeine stays in the body for many hours. A cup of warm milk in the evening is fine.' },
        { ai: 'Lecturer', giong: 'uk-nam', s: 'Third, think about your bedroom. It should be dark and quiet. Many people think that a warm bedroom helps you to sleep. In fact, the opposite is true. The room should be cool. About eighteen degrees is best.' },
        { ai: 'Lecturer', giong: 'uk-nam', s: 'And finally, switch off your phone at least half an hour before bed. Next week, we will look at dreams, and at what they can tell us. Thank you.' },
      ],
      nhom: [
        {
          id: 'n4-note', tu: 31, den: 36, dang: 'note',
          huongDan: 'Complete the notes below.\nWrite **ONE WORD AND/OR A NUMBER** for each answer.',
          gioiHan: { tu: 1, so: true },
          tieuDe: 'Sleep: the basics',
          dong: [
            '## How much do we sleep?',
            '• an average person is asleep for about a [[31]] of their life',
            '• adults need 7–9 hours a night; teenagers need up to [[32]] hours',
            '## The sleep cycle',
            '• one cycle lasts about [[33]] minutes',
            '• deep sleep: the body repairs its [[34]]',
            '• dream sleep (REM): the [[35]] move quickly',
            '• in dream sleep, the brain stores new [[36]]',
          ],
        },
        {
          id: 'n4-summary', tu: 37, den: 40, dang: 'summary',
          huongDan: 'Complete the summary below.\nWrite **ONE WORD ONLY** for each answer.',
          gioiHan: { tu: 1 },
          tieuDe: 'Too little sleep — and how to sleep better',
          dong: [
            'People who sleep too little cannot concentrate well. They also catch more [[37]] than other people, and tired drivers cause many [[38]] on the roads. To sleep better, people should go to bed at the same time every night and should not drink [[39]] after lunch, because the caffeine in it stays in the body for hours. The bedroom should be dark, quiet and [[40]].',
          ],
        },
      ],
    },
  ],

  dapAn: {
    /* ── Part 1 ── */
    1: { a: ['Marlow'], vi: `Sara đánh vần họ: "M, A, R, L, O, W", thủ thư nhắc lại đúng từng chữ ⇒ **Marlow**. Tên riêng phải đúng từng chữ cái; chú ý cặp dễ lẫn A /eɪ/ – R /ɑː/ và O – W. 📘 Ôn nghe đánh vần + Form Completion: Ngày 7 và Ngày 15.`, ev: 'Sure. It\'s M, A, R, L, O, W.' },
    2: { a: ['Canal'], vi: `Thủ thư đoán "K, A, N…?" — Sara sửa: "it starts with a C. C, A, N, A, L. Canal Street" ⇒ **Canal**. Bẫy đánh vần kiểu thật: người hỏi nói SAI chữ đầu để bạn phải nghe phần sửa.`, ev: 'No, it starts with a C. C, A, N, A, L. Canal Street. It\'s near the station.' },
    3: { a: ['07700 900 462', '07700900462'], vi: `"My mobile number is 07700 900 462" — thủ thư đọc lại y nguyên ⇒ **07700 900 462**. Số 0 trong số điện thoại thường đọc là "oh"; ghi đủ 11 chữ số. Cả dãy tính là MỘT số nên hợp lệ với "ONE WORD AND/OR A NUMBER".`, ev: 'My mobile number is 07700 900 462.' },
    4: { a: ['nurse'], vi: `Thủ thư hỏi "are you a student?" — Sara: "Not any more… I'm a nurse now" ⇒ **nurse**. Bẫy: "student" được nhắc TRƯỚC nhưng bị phủ định ("Not any more").`, ev: 'Not any more. I finished university last year. I\'m a nurse now, at the city hospital.' },
    5: { a: ['bill'], vi: `"I haven't got a bank letter with me… But I've got a phone bill here." — thủ thư: "a phone bill is fine" ⇒ **bill**. Bẫy: "letter" (thư ngân hàng) là thứ Sara KHÔNG mang theo.`, ev: 'I haven\'t got a bank letter with me, I\'m afraid. But I\'ve got a phone bill here. Is that all right?' },
    6: { a: ['3', 'three'], vi: `"That used to be two pounds, but now it's three pounds." ⇒ **3**. Bẫy giá cũ / giá mới: "used to be" = trước đây; đáp án là con số đi sau "but now". (Làm thẻ lần đầu thì miễn phí.)`, ev: 'That used to be two pounds, but now it\'s three pounds.' },
    7: { a: ['8', 'eight'], vi: `"With an adult card, you can borrow eight books at one time. Children can only take four." ⇒ **8**. Ghi chú hỏi về NGƯỜI LỚN ("adults") — số 4 là của trẻ em.`, ev: 'With an adult card, you can borrow eight books at one time.' },
    8: { a: ['3', 'three'], vi: `"You can keep books for three weeks… DVDs are only for one week." ⇒ **3**. Ghi chú hỏi về SÁCH — "one week" là của DVD.`, ev: 'You can keep books for three weeks.' },
    9: { a: ['Thursday', 'Thursdays'], vi: `"on Thursday we stay open late, until eight in the evening" ⇒ **Thursday**. Các ngày khác đóng cửa lúc 5:30; thứ Bảy chỉ mở đến 1 giờ; Chủ nhật đóng. Tên thứ viết hoa chữ đầu; chính tả: Th-u-r-s-day.`, ev: 'But on Thursday we stay open late, until eight in the evening.' },
    10: { a: ['computer'], vi: `"We did have a Spanish class, but it finished last month. At the moment, there is a free computer class for members." ⇒ **computer**. Bẫy: "Spanish" là lớp ĐÃ KẾT THÚC ("did have… but it finished").`, ev: 'At the moment, there is a free computer class for members.' },

    /* ── Part 2 ── */
    11: { a: ['B'], vi: `"Some people think we are doing this to save money. That isn't true… The real reason is that the old station on Market Street is too small." ⇒ **B**. A bị bác thẳng ("That isn't true"); C (xuống cấp) không được nhắc. Cụm tín hiệu cần bắt: "The real reason is…". 📘 Ôn MCQ + Map ở Part 2: Ngày 9.`, ev: 'The real reason is that the old station on Market Street is too small.' },
    12: { a: ['A'], vi: `"It will still run every fifteen minutes, and the first bus will still leave at six… What is new is that the number 7 will stop at the City Hospital." ⇒ **A**. "still" = vẫn như cũ ⇒ loại B (tần suất) và C (giờ chuyến đầu).`, ev: 'What is new is that the number 7 will stop at the City Hospital.' },
    13: { a: ['C'], vi: `Ba mức giá: £1.80 là giá HIỆN TẠI; £2 là giá từ tháng Sáu nếu trả cho TÀI XẾ; £1.50 là giá mua qua ỨNG DỤNG. Câu hỏi hỏi "pay the driver" ⇒ **C (£2.00)**.`, ev: 'From June, if you pay the driver, a single ticket will cost two pounds.' },
    14: { a: ['A'], vi: `Người trên 65 "already travel free… that is not changing" (không phải lần đầu); sinh viên "continue to pay half price"; "The new offer is for children… children under twelve will travel free at weekends" ⇒ **A**. Từ khoá của câu hỏi là "for the first time".`, ev: 'From June, children under twelve will travel free at weekends when they are with an adult.' },
    15: { a: ['C'], vi: `"please don't go to the old bus station, because the office there has already closed. From next week, you can pick up a timetable at the public library. People often ask at the tourist office, but they don't have them." ⇒ **C**. A và B đều được nhắc rồi bị loại.`, ev: 'From next week, you can pick up a timetable at the public library.' },
    16: { a: ['B'], vi: `"The ticket office… It's immediately on your right as you come in." — vào từ cổng chính (phía dưới sơ đồ), bên PHẢI ngay sau cửa ⇒ **B**. A (bên trái, đối diện) sẽ là quầy báo, mùa thu mới mở.`, ev: 'It\'s immediately on your right as you come in.' },
    17: { a: ['E'], vi: `"walk past the information desk towards the bus stops. The café is in the far left corner of the hall, right next to the bus stops." — góc XA bên TRÁI, sát dãy điểm đỗ ⇒ **E**. Góc xa bên phải (F) là phòng của tài xế.`, ev: 'The café is in the far left corner of the hall, right next to the bus stops.' },
    18: { a: ['D'], vi: `"The waiting room is on the right-hand side of the hall, about halfway between the entrance and the bus stops." — bên phải, ở GIỮA chiều dài sảnh ⇒ **D**. (B cũng bên phải nhưng sát cửa — đó là quầy vé.)`, ev: 'The waiting room is on the right-hand side of the hall, about halfway between the entrance and the bus stops.' },
    19: { a: ['C'], vi: `"The toilets are directly opposite the waiting room, on the left-hand side of the hall." — đối diện phòng chờ (D), bên trái ⇒ **C**.`, ev: 'The toilets are directly opposite the waiting room, on the left-hand side of the hall.' },
    20: { a: ['G'], vi: `"The bicycle park is outside the building. When you stand on Station Road and look at the main entrance, it is on your left." — NGOÀI toà nhà, bên trái cổng ⇒ **G**. Bên phải cổng là chỗ taxi (đã ghi sẵn trên sơ đồ).`, ev: 'When you stand on Station Road and look at the main entrance, it is on your left.' },

    /* ── Part 3 ── */
    21: { a: ['B'], vi: `Ben: "I thought it was fifteen minutes." — Maya: "No, fifteen minutes was last term. This time we only have ten minutes" ⇒ **B**. Bẫy "last term / this time": con số nghe trước là của kỳ trước. 📘 Ôn Part 3 (MCQ, Matching): Ngày 11.`, ev: 'This time we only have ten minutes, and then the class can ask questions.' },
    22: { a: ['C'], vi: `Maya: "it isn't a difficult topic" (loại A); Ben: "There is a lot of information" (loại B); "four other pairs are already doing traffic. Dr Hall will be bored." ⇒ **C**.`, ev: 'But I talked to some people in our class yesterday, and four other pairs are already doing traffic.' },
    23: { a: ['A'], vi: `Ben: "It is interesting (loại B), but I did a big project on recycling at secondary school. I don't want to do the same thing again." — "has studied it before" = "did a big project… at secondary school" ⇒ **A**.`, ev: 'It is interesting, but I did a big project on recycling at secondary school.' },
    24: { a: ['B'], vi: `Ben đề nghị chiều thứ Sáu — Maya bận ("I have a class until five on Friday") và đề nghị sáng thứ Bảy — Ben: "Saturday morning is fine. I can't do Sunday anyway" ⇒ **B**. Đáp án là phương án cả HAI cùng đồng ý, không phải phương án được nhắc đầu tiên.`, ev: 'Saturday morning is fine. I can\'t do Sunday anyway, because I work in a café.' },
    25: { a: ['B'], vi: `Ben: "I'll take the photos. My phone has a really good camera." — Maya: "Good, because mine is terrible." ⇒ **B (Ben)**.`, ev: 'I\'ll take the photos. My phone has a really good camera.' },
    26: { a: ['A'], vi: `Ben đề nghị "I can write it if you like" — nhưng Maya: "Actually, I'd like to write the questionnaire. I made one… last year" và Ben đồng ý "the questionnaire is yours" ⇒ **A (Maya)**. Bẫy: người ĐỀ NGHỊ không phải người LÀM; "Actually" báo đổi hướng.`, ev: 'Actually, I\'d like to write the questionnaire.' },
    27: { a: ['C'], vi: `Maya: "Let's make the slides together. We can meet in the library on Monday." — "together" ⇒ **C (cả hai)**.`, ev: 'Let\'s make the slides together.' },
    28: { a: ['history'], vi: `"I think we should begin with a short history of the park." — "Start" = "begin with" ⇒ **history**.`, ev: 'I think we should begin with a short history of the park.' },
    29: { a: ['chart'], vi: `Ben hỏi "Shall we put the numbers in a table?" — Maya: "A table is a bit boring… Let's use a chart." — Ben: "OK, a chart." ⇒ **chart**. Bẫy: "table" bị bác.`, ev: 'Let\'s use a chart.' },
    30: { a: ['seats'], vi: `Ben định nói "more lights", Maya: "I think seats are more important", Ben đồng ý: "Let's say the park needs more seats, then." ⇒ **seats**. Bẫy: "lights" được nêu trước rồi bị thay.`, ev: 'Let\'s say the park needs more seats, then.' },

    /* ── Part 4 ── */
    31: { a: ['third'], vi: `"An average person spends about a third of their life asleep." ⇒ **third** (một phần ba). Bẫy số: "thirty years" và "ninety" ở câu sau là ví dụ minh hoạ, không điền vào "a ___ of their life". 📘 Ôn Part 4 (Note & Summary): Ngày 13.`, ev: 'An average person spends about a third of their life asleep.' },
    32: { a: ['10', 'ten'], vi: `"Teenagers need more than adults, up to ten hours" ⇒ **10**. "seven and nine" là của người lớn (đã in sẵn trong ghi chú); "sixteen" là của trẻ sơ sinh.`, ev: 'Teenagers need more than adults, up to ten hours, because their bodies and brains are still growing.' },
    33: { a: ['90', 'ninety'], vi: `"each cycle lasts about ninety minutes" ⇒ **90**. Phân biệt ninety /ˈnaɪnti/ (90) với nineteen /ˌnaɪnˈtiːn/ (19): số chục nhấn âm ĐẦU. "four or five" là số chu kỳ mỗi đêm.`, ev: 'We sleep in cycles, and each cycle lasts about ninety minutes.' },
    34: { a: ['muscles'], vi: `"This is the time when the body repairs its muscles after the work of the day." ⇒ **muscles** (chính tả: m-u-s-c-l-e-s, chữ c câm).`, ev: 'This is the time when the body repairs its muscles after the work of the day.' },
    35: { a: ['eyes'], vi: `"your body does not move, but your eyes move quickly under your eyelids" ⇒ **eyes**. Bẫy: "body" KHÔNG cử động; "eyelids" (mí mắt) là nơi mắt chuyển động bên dưới.`, ev: 'your body does not move, but your eyes move quickly under your eyelids' },
    36: { a: ['memories'], vi: `"It goes through the information from the day, and it stores new memories." ⇒ **memories** (số nhiều: memory → memories). "information" là thứ não XEM LẠI, không phải thứ được "stores new ___".`, ev: 'It goes through the information from the day, and it stores new memories.' },
    37: { a: ['colds'], vi: `"people who sleep for less than six hours a night catch more colds than people who sleep well" ⇒ **colds** (bệnh cảm; "catch a cold"). Bẫy: "mistakes" đi với "make more mistakes", không đi với "catch".`, ev: 'catch more colds than people who sleep well' },
    38: { a: ['accidents'], vi: `"Tired drivers react slowly, and they cause thousands of accidents every year." — "many" = "thousands of" ⇒ **accidents**.`, ev: 'Tired drivers react slowly, and they cause thousands of accidents every year.' },
    39: { a: ['coffee'], vi: `"Do not drink coffee after lunch, because caffeine stays in the body for many hours. A cup of warm milk in the evening is fine." ⇒ **coffee**. "milk" là thứ ĐƯỢC uống. Tóm tắt đã có sẵn "because the caffeine in it…" nên ô trống chỉ có thể là ĐỒ UỐNG chứa caffeine — viết "caffeine" vào ô là sai (thành "drink caffeine… because the caffeine in it").`, ev: 'Do not drink coffee after lunch, because caffeine stays in the body for many hours.' },
    40: { a: ['cool'], vi: `"Many people think that a warm bedroom helps you to sleep. In fact, the opposite is true. The room should be cool." ⇒ **cool**. Bẫy: "warm" là điều NHIỀU NGƯỜI TƯỞNG — "In fact, the opposite is true" báo đáp án đảo ngược.`, ev: 'The room should be cool.' },
  },
};
