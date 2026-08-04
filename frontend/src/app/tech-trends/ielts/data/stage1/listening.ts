/**
 * Phần NGHE chặng 1 — 6 bài tự soạn + danh sách nguồn ngoài đã kiểm.
 *
 * ── Vì sao transcript TỰ VIẾT thay vì nhúng video và hỏi theo video ──
 * Muốn viết câu hỏi bám đúng nội dung một video thì phải biết chắc trong video
 * nói gì ở giây nào. Viết câu hỏi theo trí nhớ hoặc theo tiêu đề video là bịa
 * — người học làm xong đối chiếu sẽ thấy sai. Ngoài ra video lẻ hay bị gỡ,
 * link chết là bài tập chết theo.
 *
 * Nên: bài tập dùng transcript tự viết, trình duyệt đọc bằng speechSynthesis
 * (đã có sẵn `useSpeak`). Đổi lại được ba thứ: đáp án chắc chắn đúng, chỉnh
 * được tốc độ đọc, và người học tự đối chiếu transcript để chép chính tả —
 * bài tập hiệu quả nhất ở chặng này (xem bài 38).
 *
 * ── Nguồn ngoài ──
 * MỌI id dưới đây đã kiểm bằng oembed ngày 05/08/2026 và chỉ giữ lại nội dung
 * nằm trên KÊNH CHÍNH CHỦ (BBC Learning English, TakeIELTS Official của
 * British Council, VOA Learning English). Các playlist tìm được nhưng thuộc
 * kênh đăng lại (@Listen-in, @PodEnglishJourney, @pom-study) đã bị loại: vừa
 * là nội dung đăng lại, vừa dễ bị gỡ.
 *
 * Kiểm lại khi nghi link chết:
 *   curl -s -o /dev/null -w "%{http_code}" \
 *     "https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=<ID>&format=json"
 *   → 200 sống, 404 chết. Playlist thì thay watch?v= bằng playlist?list=.
 */
import type { ListeningExercise, ListeningSource } from '../types';

export const LISTENINGS: ListeningExercise[] = [
  /* ─────────────── BÀI 1 ─────────────── */
  {
    id: 'l1',
    title: 'Joining the City Library',
    titleVi: 'Đăng ký thẻ thư viện',
    kind: 'Form Completion — dạng của Listening Section 1',
    level: 'Dễ · nói chậm',
    context:
      'Bạn sẽ nghe một cuộc nói chuyện giữa nhân viên thư viện và một người đến làm thẻ. Hãy điền vào '
      + 'phiếu đăng ký. Mỗi chỗ trống điền MỘT từ hoặc MỘT số.',
    lines: [
      { who: 'Nhân viên', text: 'Good morning. How can I help you?' },
      { who: 'Khách', text: 'Hello. I would like to join the library, please.' },
      { who: 'Nhân viên', text: 'Of course. Can I take your full name?' },
      { who: 'Khách', text: 'It is Mai Tran. That is T-R-A-N.' },
      { who: 'Nhân viên', text: 'Thank you. And your address?' },
      { who: 'Khách', text: 'I live at forty-two Green Road.' },
      { who: 'Nhân viên', text: 'Forty-two Green Road. Is that a house or a flat?' },
      { who: 'Khách', text: 'It is a flat, on the third floor.' },
      { who: 'Nhân viên', text: 'Lovely. Could I have a phone number as well?' },
      { who: 'Khách', text: 'Yes, it is oh seven double one, three nine five.' },
      { who: 'Nhân viên', text: 'Let me read that back. Oh seven, double one, three nine five.' },
      { who: 'Khách', text: 'That is right.' },
      { who: 'Nhân viên', text: 'And what is your date of birth?' },
      { who: 'Khách', text: 'The fifteenth of March, two thousand and five.' },
      { who: 'Nhân viên', text: 'Thank you. The card costs three pounds, and you can borrow six books at a time.' },
      { who: 'Khách', text: 'Six books. And how long can I keep them?' },
      { who: 'Nhân viên', text: 'Three weeks. After that there is a small charge for each day.' },
      { who: 'Khách', text: 'That is fine. Thank you very much.' },
    ],
    questions: [
      {
        q: 'Family name: ____________',
        answer: 'Tran',
        why: 'Người khách đánh vần rõ: "That is T-R-A-N." Trong đề thật, tên riêng gần như luôn được đánh vần.',
      },
      {
        q: 'Address: ____________ Green Road',
        answer: '42',
        alt: ['forty-two', 'forty two'],
        why: '"I live at forty-two Green Road." Với số nhà, viết bằng chữ số là an toàn và nhanh nhất.',
      },
      {
        q: 'Type of home: ____________',
        answer: 'flat',
        why: '"It is a flat, on the third floor." Bẫy nhỏ: câu hỏi của nhân viên nêu CẢ HAI lựa chọn (house hay flat), phải chờ câu trả lời.',
      },
      {
        q: 'Phone number: ____________',
        answer: '0711395',
        alt: ['07 11 395', '071 1395'],
        why:
          '"oh seven double one, three nine five" → 0-7-1-1-3-9-5. "oh" là số 0, "double one" là hai số 1. '
          + 'Nhân viên đọc lại một lần nữa — đề thật luôn cho cơ hội kiểm tra như vậy.',
      },
      {
        q: 'Date of birth: ____________ March 2005',
        answer: '15',
        alt: ['15th', 'fifteenth'],
        why: '"The fifteenth of March, two thousand and five." Ngày đọc bằng số thứ tự nhưng viết bằng số thường là được.',
      },
      {
        q: 'Cost of card: £____________',
        answer: '3',
        alt: ['three'],
        why: '"The card costs three pounds."',
      },
      {
        q: 'Number of books allowed: ____________',
        answer: '6',
        alt: ['six'],
        why: '"you can borrow six books at a time" — và người khách nhắc lại "Six books", xác nhận lần nữa.',
      },
      {
        q: 'Books can be kept for ____________ weeks.',
        answer: '3',
        alt: ['three'],
        why: '"Three weeks. After that there is a small charge for each day."',
      },
    ],
    listenFor: ['spelling của họ tên', 'oh = số 0', 'double = hai số giống nhau', 'số thứ tự chỉ ngày'],
    tips: [
      'Đọc trước phiếu điền để biết mỗi chỗ trống cần LOẠI thông tin gì (tên? số? ngày?). Làm vậy là bạn đã biết phải chờ nghe cái gì.',
      'Trong đề thật, người nói hay đọc lại số một lần nữa để xác nhận — dùng lần thứ hai để kiểm tra, đừng hoảng nếu lần đầu chưa kịp.',
      'Viết số bằng chữ số (42) nhanh hơn viết chữ (forty-two) và không sai chính tả.',
    ],
  },

  /* ─────────────── BÀI 2 ─────────────── */
  {
    id: 'l2',
    title: 'Booking a Room at a Guest House',
    titleVi: 'Đặt phòng nhà nghỉ',
    kind: 'Form Completion + số tiền, ngày tháng',
    level: 'Dễ · nhiều số',
    context:
      'Một khách gọi điện đặt phòng. Điền vào phiếu đặt phòng. Chú ý kỹ giá tiền và ngày tháng — đây là '
      + 'chỗ hay bị bẫy nhất.',
    lines: [
      { who: 'Lễ tân', text: 'Riverside Guest House, good afternoon.' },
      { who: 'Khách', text: 'Hello. I would like to book a room for two nights, please.' },
      { who: 'Lễ tân', text: 'Certainly. Which nights would that be?' },
      { who: 'Khách', text: 'The fourth and fifth of June.' },
      { who: 'Lễ tân', text: 'The fourth and fifth of June. And is it a single or a double room?' },
      { who: 'Khách', text: 'A double, please. My sister is coming with me.' },
      { who: 'Lễ tân', text: 'We have a double room at fifty pounds a night, or a larger one at sixty-five.' },
      { who: 'Khách', text: 'We will take the smaller one, at fifty.' },
      { who: 'Lễ tân', text: 'That is one hundred pounds in total. Breakfast is included.' },
      { who: 'Khách', text: 'Is there parking?' },
      { who: 'Lễ tân', text: 'Yes, but it costs eight pounds a day. The car park is behind the building.' },
      { who: 'Khách', text: 'We are coming by train, so we will not need it.' },
      { who: 'Lễ tân', text: 'In that case, the station is about fifteen minutes away on foot.' },
      { who: 'Khách', text: 'Perfect. My name is Peter Walsh, W-A-L-S-H.' },
      { who: 'Lễ tân', text: 'Thank you, Mr Walsh. Could you arrive after two o clock?' },
      { who: 'Khách', text: 'Yes, our train arrives at half past three.' },
    ],
    questions: [
      {
        q: 'Number of nights: ____________',
        answer: '2',
        alt: ['two'],
        why: '"I would like to book a room for two nights."',
      },
      {
        q: 'Dates: ____________ and 5 June',
        answer: '4',
        alt: ['4th', 'fourth'],
        why: '"The fourth and fifth of June", được lễ tân nhắc lại.',
      },
      {
        q: 'Type of room: ____________',
        answer: 'double',
        why: '"A double, please." Bẫy: câu hỏi nêu cả single và double, phải chờ câu trả lời của khách.',
      },
      {
        q: 'Price per night: £____________',
        answer: '50',
        alt: ['fifty'],
        why:
          'Lễ tân nêu HAI giá: 50 và 65. Khách chọn "the smaller one, at fifty". Bẫy kinh điển — đề luôn '
          + 'nêu nhiều lựa chọn rồi mới chốt một.',
      },
      {
        q: 'Total cost: £____________',
        answer: '100',
        alt: ['one hundred', 'a hundred'],
        why: '"That is one hundred pounds in total." (50 × 2 đêm).',
      },
      {
        q: 'Cost of parking per day: £____________',
        answer: '8',
        alt: ['eight'],
        why: '"it costs eight pounds a day" — dù khách không dùng, câu hỏi vẫn hỏi được thông tin này.',
      },
      {
        q: 'The station is ____________ minutes away on foot.',
        answer: '15',
        alt: ['fifteen'],
        why:
          '"about fifteen minutes away on foot". Cẩn thận cặp 15/50 — nghe TRỌNG ÂM: fifTEEN nhấn cuối, '
          + 'FIFty nhấn đầu.',
      },
      {
        q: 'Guest’s family name: ____________',
        answer: 'Walsh',
        why: '"My name is Peter Walsh, W-A-L-S-H." Câu hỏi hỏi HỌ nên đáp án là Walsh, không phải Peter.',
      },
    ],
    listenFor: ['fifty vs fifteen', 'giá được nêu hai lần rồi mới chốt', 'in total', 'đánh vần họ'],
    tips: [
      'Khi nghe thấy HAI con số cho cùng một thứ, đáp án luôn là con số được CHỐT sau cùng, không phải con số nghe thấy trước.',
      'Câu hỏi hỏi "family name" thì chỉ viết họ. Viết cả họ và tên có thể bị tính sai vì vượt giới hạn số từ.',
      'Đơn vị (£, minutes) đã có sẵn trong phiếu thì KHÔNG viết lại — viết "50 pounds" vào ô "£____" là thừa.',
    ],
  },

  /* ─────────────── BÀI 3 ─────────────── */
  {
    id: 'l3',
    title: 'Signing Up for a Sports Centre',
    titleVi: 'Đăng ký trung tâm thể thao',
    kind: 'Form + Multiple Choice',
    level: 'Dễ vừa',
    context:
      'Một sinh viên hỏi thông tin về trung tâm thể thao của trường. Vừa điền phiếu vừa chọn đáp án đúng.',
    lines: [
      { who: 'Nhân viên', text: 'Hello, this is the university sports centre.' },
      { who: 'Sinh viên', text: 'Hi. I want to become a member. What do I need to do?' },
      { who: 'Nhân viên', text: 'You just need your student card and a photograph.' },
      { who: 'Sinh viên', text: 'How much does membership cost?' },
      { who: 'Nhân viên', text: 'For students it is twenty pounds a term, or fifty for the whole year.' },
      { who: 'Sinh viên', text: 'The year is better value. What time do you open?' },
      { who: 'Nhân viên', text: 'From seven in the morning until ten at night on weekdays.' },
      { who: 'Sinh viên', text: 'And at the weekend?' },
      { who: 'Nhân viên', text: 'We close earlier, at eight in the evening.' },
      { who: 'Sinh viên', text: 'What can I use with the membership?' },
      { who: 'Nhân viên', text: 'The gym and the swimming pool are both included. Tennis courts cost extra.' },
      { who: 'Sinh viên', text: 'How much extra for tennis?' },
      { who: 'Nhân viên', text: 'Five pounds an hour. You have to book those online, at least one day before.' },
      { who: 'Sinh viên', text: 'Do you have swimming classes?' },
      { who: 'Nhân viên', text: 'Yes, on Tuesday and Thursday evenings, starting at seven thirty.' },
      { who: 'Sinh viên', text: 'Great. I will come in tomorrow morning.' },
    ],
    questions: [
      {
        q: 'To join you must bring a student card and a ____________.',
        answer: 'photograph',
        alt: ['photo'],
        why: '"You just need your student card and a photograph."',
      },
      {
        q: 'Cost for a full year: £____________',
        answer: '50',
        alt: ['fifty'],
        why: '"twenty pounds a term, or fifty for the whole year" — câu hỏi hỏi cả NĂM nên đáp án là 50.',
      },
      {
        q: 'On weekdays the centre closes at ____________ pm.',
        answer: '10',
        alt: ['ten'],
        why: '"until ten at night on weekdays". Cuối tuần đóng lúc 8 — đừng lẫn hai con số này.',
      },
      {
        q: 'At the weekend the centre closes at ____________ pm.',
        answer: '8',
        alt: ['eight'],
        why: '"We close earlier, at eight in the evening."',
      },
      {
        q: 'Which two facilities are included in the membership?',
        answer: 'gym and swimming pool',
        alt: ['gym and pool', 'the gym and the swimming pool', 'swimming pool and gym'],
        why: '"The gym and the swimming pool are both included. Tennis courts cost extra."',
      },
      {
        q: 'Tennis costs £____________ an hour.',
        answer: '5',
        alt: ['five'],
        why: '"Five pounds an hour."',
      },
      {
        q: 'Tennis courts must be booked ____________.',
        answer: 'online',
        why: '"You have to book those online, at least one day before."',
      },
      {
        q: 'Swimming classes are on Tuesday and ____________ evenings.',
        answer: 'Thursday',
        why:
          '"on Tuesday and Thursday evenings". Hai thứ trong tuần nghe khá giống nhau khi nói nhanh — đây là '
          + 'bẫy phổ biến, Tuesday /ˈtjuːzdeɪ/ và Thursday /ˈθɜːzdeɪ/.',
      },
    ],
    listenFor: ['a term vs the whole year', 'weekdays vs weekend', 'included vs cost extra', 'Tuesday vs Thursday'],
    tips: [
      'Bài này có nhiều cặp thông tin đối nhau (ngày thường/cuối tuần, gồm/không gồm). Gạch chân từ phân biệt trong câu hỏi TRƯỚC khi nghe.',
      'Nghe thấy "included" và "extra" là biết đề sắp hỏi cái nào miễn phí, cái nào tính thêm.',
      'Tuesday và Thursday là cặp bị nghe nhầm nhiều nhất — nhớ Thursday bắt đầu bằng âm /θ/ (bài 2 phần Bài học).',
    ],
  },

  /* ─────────────── BÀI 4 ─────────────── */
  {
    id: 'l4',
    title: 'Directions to the Museum',
    titleVi: 'Chỉ đường tới bảo tàng',
    kind: 'Map / Direction — dạng của Listening Section 2',
    level: 'Vừa · nhiều giới từ',
    context:
      'Một du khách hỏi đường. Hãy nghe và trả lời các câu hỏi về vị trí. Ôn lại bộ giới từ ở chủ đề '
      + '"Nơi chốn & chỉ đường" trong tab Từ vựng trước khi nghe.',
    lines: [
      { who: 'Du khách', text: 'Excuse me, could you tell me how to get to the city museum?' },
      { who: 'Người dân', text: 'Of course. Go straight along this street until you reach the traffic lights.' },
      { who: 'Du khách', text: 'Straight to the traffic lights. Then what?' },
      { who: 'Người dân', text: 'Turn left there, into Park Street.' },
      { who: 'Du khách', text: 'Turn left into Park Street.' },
      { who: 'Người dân', text: 'Walk past the post office, which is on your right.' },
      { who: 'Du khách', text: 'Past the post office.' },
      { who: 'Người dân', text: 'The museum is at the end of the street, opposite a small park.' },
      { who: 'Du khách', text: 'Is it far?' },
      { who: 'Người dân', text: 'About ten minutes on foot. There is also a bus, number twelve.' },
      { who: 'Du khách', text: 'Where is the bus stop?' },
      { who: 'Người dân', text: 'Just behind you, next to the bank.' },
      { who: 'Du khách', text: 'And do you know when the museum closes?' },
      { who: 'Người dân', text: 'At five, I think. But it is closed all day on Monday.' },
      { who: 'Du khách', text: 'Thank you so much for your help.' },
    ],
    questions: [
      {
        q: 'First, go straight until you reach the ____________.',
        answer: 'traffic lights',
        alt: ['lights', 'traffic light'],
        why: '"Go straight along this street until you reach the traffic lights."',
      },
      {
        q: 'At the lights, turn ____________.',
        answer: 'left',
        why: '"Turn left there, into Park Street." Người hỏi nhắc lại một lần nữa để xác nhận.',
      },
      {
        q: 'The name of the second street is ____________ Street.',
        answer: 'Park',
        why: '"into Park Street". Tên phố luôn viết hoa — nghe thấy tên riêng là ghi ngay.',
      },
      {
        q: 'The post office is on your ____________.',
        answer: 'right',
        why:
          '"Walk past the post office, which is on your right." Bẫy: bài vừa nói "turn left" ngay trước đó, '
          + 'rất dễ ghi nhầm thành left.',
      },
      {
        q: 'The museum is ____________ a small park.',
        answer: 'opposite',
        why: '"The museum is at the end of the street, opposite a small park." opposite = đối diện.',
      },
      {
        q: 'The walk takes about ____________ minutes.',
        answer: '10',
        alt: ['ten'],
        why: '"About ten minutes on foot."',
      },
      {
        q: 'The bus stop is next to the ____________.',
        answer: 'bank',
        why: '"Just behind you, next to the bank."',
      },
      {
        q: 'The museum is closed all day on ____________.',
        answer: 'Monday',
        why: '"it is closed all day on Monday". Câu hỏi cuối hay là thông tin thêm — đừng buông tai sớm.',
      },
    ],
    listenFor: ['left / right', 'past / opposite / next to / behind', 'tên phố viết hoa', 'ngày đóng cửa'],
    tips: [
      'Với dạng chỉ đường, vẽ nhanh một sơ đồ nháp trong lúc nghe. Ghi chữ thôi thì rất dễ rối.',
      'Bẫy hay gặp nhất: nghe "turn left" rồi mặc định mọi thứ sau đó cũng ở bên trái. Mỗi mốc là một hướng riêng.',
      'Ở đề thật, người nói thường nhắc lại chỉ dẫn quan trọng — dùng lần nhắc lại để kiểm tra chứ đừng bỏ qua.',
      'Câu cuối bài hay có thông tin thêm (giờ đóng cửa, ngày nghỉ). Nghe hết đến câu cuối cùng.',
    ],
  },

  /* ─────────────── BÀI 5 ─────────────── */
  {
    id: 'l5',
    title: 'A Talk About the Student Bus Service',
    titleVi: 'Bài nói về xe buýt cho sinh viên',
    kind: 'Note Completion — một người nói (monologue)',
    level: 'Vừa · một người nói liên tục',
    context:
      'Đây là dạng MỘT người nói liên tục, không có hỏi đáp, nên không ai nhắc lại thông tin cho bạn. '
      + 'Hãy điền vào phần ghi chú.',
    lines: [
      {
        who: 'Người nói',
        text:
          'Good morning everyone, and welcome to the university. I am here to tell you about the student '
          + 'bus service.',
      },
      {
        who: 'Người nói',
        text:
          'There are three routes. Route A goes to the city centre and runs every fifteen minutes. Route B '
          + 'goes to the train station, and Route C goes to the shopping centre on the edge of town.',
      },
      {
        who: 'Người nói',
        text:
          'Buses start at seven in the morning. The last bus leaves the campus at eleven at night, except '
          + 'on Sunday, when the service stops at nine.',
      },
      {
        who: 'Người nói',
        text:
          'A single journey costs one pound twenty for students. However, if you buy a monthly pass, it is '
          + 'twenty-five pounds and you can travel as often as you like.',
      },
      {
        who: 'Người nói',
        text:
          'To get the student price you must show your university card every time. Drivers do not accept '
          + 'cash, so please use a card or the mobile app.',
      },
      {
        who: 'Người nói',
        text:
          'One last thing. During examination weeks in May we run extra buses to the library, which stays '
          + 'open until midnight.',
      },
    ],
    questions: [
      {
        q: 'Number of routes: ____________',
        answer: '3',
        alt: ['three'],
        why: '"There are three routes."',
      },
      {
        q: 'Route A runs every ____________ minutes.',
        answer: '15',
        alt: ['fifteen'],
        why: '"Route A goes to the city centre and runs every fifteen minutes."',
      },
      {
        q: 'Route B goes to the ____________.',
        answer: 'train station',
        alt: ['station'],
        why: '"Route B goes to the train station."',
      },
      {
        q: 'On Sunday the service stops at ____________ pm.',
        answer: '9',
        alt: ['nine'],
        why:
          '"The last bus leaves the campus at eleven at night, except on Sunday, when the service stops at '
          + 'nine." Từ "except" báo hiệu một ngoại lệ — đề rất hay hỏi vào ngoại lệ chứ không hỏi quy tắc chung.',
      },
      {
        q: 'A single journey costs £____________ for students.',
        answer: '1.20',
        alt: ['1.2', '1 pound 20', 'one twenty'],
        why: '"A single journey costs one pound twenty for students."',
      },
      {
        q: 'A monthly pass costs £____________.',
        answer: '25',
        alt: ['twenty-five', 'twenty five'],
        why: '"if you buy a monthly pass, it is twenty-five pounds".',
      },
      {
        q: 'Students must show their university ____________ every time.',
        answer: 'card',
        why: '"you must show your university card every time".',
      },
      {
        q: 'In May, extra buses go to the ____________.',
        answer: 'library',
        why: '"During examination weeks in May we run extra buses to the library."',
      },
    ],
    listenFor: ['except (báo ngoại lệ)', 'however (đảo ý)', 'one pound twenty', 'One last thing (sắp có thông tin cuối)'],
    tips: [
      'Dạng một người nói KHÔNG có ai nhắc lại thông tin — mất câu nào thì bỏ luôn câu đó và bám theo bài, đừng ngồi tiếc.',
      'Các từ báo hiệu phải nghe kỹ: however, but, except, although — chúng gần như luôn đứng ngay trước đáp án.',
      '"One last thing" / "Finally" báo hiệu thông tin cuối cùng sắp tới. Đừng buông tai ở đoạn này.',
      'Giá tiền kiểu "one pound twenty" viết là 1.20 chứ không phải 120.',
    ],
  },

  /* ─────────────── BÀI 6 ─────────────── */
  {
    id: 'l6',
    title: 'Two Students Choose a Topic',
    titleVi: 'Hai sinh viên chọn đề tài',
    kind: 'Multiple Choice — hội thoại có đổi ý',
    level: 'Khó hơn · có đổi ý giữa chừng',
    context:
      'Hai sinh viên bàn về bài tập nhóm. Bài này khó hơn vì họ ĐỔI Ý giữa chừng — đáp án là quyết định '
      + 'cuối cùng, không phải điều nói ra đầu tiên.',
    lines: [
      { who: 'Nam', text: 'So, we need to choose a topic for the group project by Friday.' },
      { who: 'Lan', text: 'I was thinking about recycling. There is a lot of information about it.' },
      { who: 'Nam', text: 'That is true, but almost every group did recycling last year.' },
      { who: 'Lan', text: 'Good point. What about transport in our city?' },
      { who: 'Nam', text: 'I like that better. We could interview students about how they travel to campus.' },
      { who: 'Lan', text: 'Yes. Although interviews take a long time to organise.' },
      { who: 'Nam', text: 'We could use an online questionnaire instead. It is faster and we get more answers.' },
      { who: 'Lan', text: 'Let us do that then. How many people should we ask?' },
      { who: 'Nam', text: 'I would say a hundred, but fifty is probably enough for two weeks.' },
      { who: 'Lan', text: 'Fifty it is. And who writes the introduction?' },
      { who: 'Nam', text: 'I can do the introduction if you do the charts.' },
      { who: 'Lan', text: 'Agreed. Shall we meet again on Wednesday afternoon?' },
      { who: 'Nam', text: 'I have a lecture then. Thursday morning would be better.' },
      { who: 'Lan', text: 'Thursday morning, fine. I will book a room in the library.' },
    ],
    questions: [
      {
        q: 'What topic do they finally choose?',
        answer: 'transport',
        alt: ['transport in our city', 'city transport'],
        why:
          'Lan đề xuất recycling trước, nhưng Nam bác vì năm ngoái nhóm nào cũng làm. Sau đó họ chốt "transport '
          + 'in our city". Đáp án là quyết định CUỐI.',
      },
      {
        q: 'Why do they reject the first topic?',
        answer: 'too many groups did it last year',
        alt: ['every group did it last year', 'it was done last year'],
        why: '"almost every group did recycling last year".',
      },
      {
        q: 'How will they collect information?',
        answer: 'online questionnaire',
        alt: ['questionnaire', 'an online questionnaire'],
        why:
          'Ban đầu định phỏng vấn, nhưng Lan nói phỏng vấn mất thời gian tổ chức, nên Nam đề xuất "an online '
          + 'questionnaire instead" và Lan đồng ý.',
      },
      {
        q: 'How many people will they ask?',
        answer: '50',
        alt: ['fifty'],
        why:
          '"I would say a hundred, but fifty is probably enough" — Lan chốt "Fifty it is." Bẫy: con số 100 '
          + 'được nói TRƯỚC nhưng không phải đáp án.',
      },
      {
        q: 'What will Nam write?',
        answer: 'the introduction',
        alt: ['introduction'],
        why: '"I can do the introduction if you do the charts." Nam làm phần mở đầu, Lan làm biểu đồ.',
      },
      {
        q: 'What will Lan prepare?',
        answer: 'the charts',
        alt: ['charts'],
        why: 'Cùng câu trên: "if you do the charts", và Lan đáp "Agreed."',
      },
      {
        q: 'When will they meet next?',
        answer: 'Thursday morning',
        alt: ['Thursday'],
        why:
          'Lan đề nghị chiều thứ Tư, Nam bận nên đổi sang "Thursday morning would be better", Lan đồng ý. '
          + 'Lại là một lần đổi ý.',
      },
      {
        q: 'Where will they meet?',
        answer: 'library',
        alt: ['in the library', 'a room in the library'],
        why: '"I will book a room in the library."',
      },
    ],
    listenFor: ['but / although / instead (báo sắp đổi ý)', 'Let us do that then', 'would be better', 'Agreed'],
    tips: [
      'Đây là dạng mất điểm nhiều nhất ở Section 3. Quy tắc sống còn: đáp án là quyết định CUỐI CÙNG.',
      'Nghe thấy "but", "although", "actually", "instead", "on second thoughts" là biết thông tin vừa nói sắp bị thay.',
      'Đừng ghi đáp án ngay khi nghe thấy một con số hay một danh từ hợp lý — chờ tới khi có câu chốt kiểu "Let us do that", "Agreed", "Fine".',
      'Ghi nháp CẢ HAI phương án rồi gạch bỏ cái bị loại. An toàn hơn là ghi một cái rồi phải xoá.',
    ],
  },
];

/**
 * Nguồn nghe ngoài — mọi ID đã kiểm oembed 05/08/2026, đều là kênh chính chủ.
 * Nhúng bằng youtube-nocookie để đỡ theo dõi người học (CSP đã cho phép sẵn).
 */
export const LISTENING_SOURCES: ListeningSource[] = [
  {
    name: "Let's Learn English — Bài 1",
    channel: 'VOA Learning English',
    kind: 'video',
    ytId: 'WR9_nsLyaEY',
    level: 'A1 — dễ nhất, hợp người mới hoàn toàn',
    how:
      'Nguồn dễ nhất trong danh sách. Nói rất chậm, có hình minh hoạ. Xem 2 lần: lần đầu không phụ đề, '
      + 'lần sau bật phụ đề rồi nhại theo từng câu.',
  },
  {
    name: "Let's Learn English — Bài 30",
    channel: 'VOA Learning English',
    kind: 'video',
    ytId: 'h1ZEPZIh4to',
    level: 'A1–A2 — cuối bộ, nhanh hơn bài 1',
    how:
      'Dùng để tự đo tiến bộ: nếu bài 1 nghe thoải mái mà bài 30 vẫn theo được thì bạn đã qua mức A1.',
  },
  {
    name: "Let's Learn English — Luyện nói (bài 30)",
    channel: 'VOA Learning English',
    kind: 'video',
    ytId: 'IlBaOlsjyrY',
    level: 'A1–A2 — bài luyện nói',
    how: 'Dạng có khoảng lặng để bạn nói theo. Đừng chỉ nghe — phải NÓI THÀNH TIẾNG vào đúng khoảng lặng đó.',
  },
  {
    name: 'English In A Minute — bộ tổng hợp',
    channel: 'BBC Learning English',
    kind: 'video',
    ytId: 'LppAASWtUZU',
    level: 'A2 — mỗi ý gói trong 1 phút',
    how:
      'Mỗi mẩu chỉ một phút nên hợp lúc bận. Nghe xong mỗi mẩu, tự đặt MỘT câu dùng cụm từ vừa học — không '
      + 'đặt câu thì hôm sau quên sạch.',
  },
  {
    name: 'Box Sets — English In A Minute (playlist)',
    channel: 'BBC Learning English',
    kind: 'playlist',
    ytId: 'PLcetZ6gSk96-b8CXzFfpeF_M4ypAQneSu',
    level: 'A2 — playlist dài, học dần',
    how: 'Playlist chính thức của BBC. Mỗi ngày một video, không cần xem liền mạch.',
  },
  {
    name: '6 Minute English — bộ tổng hợp 1 giờ',
    channel: 'BBC Learning English',
    kind: 'video',
    ytId: 'fcN0BXzK8bg',
    level: 'B1 — hơi khó so với chặng 1',
    how:
      'Ở chặng 1, dùng để nghe THỤ ĐỘNG lấy quen nhịp điệu, chưa cần hiểu hết. Sang chặng 2 mới quay lại '
      + 'nghe chủ động và chép chính tả.',
  },
  {
    name: '6 Minute English (playlist)',
    channel: 'BBC Learning English',
    kind: 'playlist',
    ytId: 'PLcetZ6gSk96-FECmH9l7Vlx5VDigvgZpt',
    level: 'B1 — nguồn chính cho chặng 2',
    how:
      'Playlist gốc, ra bài mới hằng tuần. Ghim sẵn từ bây giờ, dùng làm nguồn nghe chính khi lên chặng 2.',
  },
  {
    name: 'British Council IELTS (playlist chính thức)',
    channel: 'TakeIELTS Official — British Council',
    kind: 'playlist',
    ytId: 'PLrt2nkX3MUeBNAcBAap6B313_tlVRCAxz',
    level: 'Mọi trình độ — hướng dẫn về kỳ thi',
    how:
      'Đây là kênh của chính đơn vị tổ chức thi. Ở chặng 1 chưa cần luyện đề, nhưng NÊN xem các video giải '
      + 'thích cấu trúc bài thi và tiêu chí chấm — biết mình sẽ bị chấm theo cái gì thì học đỡ lan man.',
  },
];
