import type { NgayCauNen } from '../kieu';

const IMP = 'V + (…) · Please + V. (mệnh lệnh, chỉ dẫn)';
const DONT = 'Don\'t + V. (đừng)';
const LETS = 'Let\'s + V. · Let\'s not + V. (mình cùng …)';
const COULD = 'Could you / Can you + V …, please? (nhờ)';
const WOULD = 'Would you like + N / to V? (mời)';
const ID = 'I\'d like + N / to V. (tôi muốn — lịch sự)';
const MIND = 'Would you mind + V-ing? (phiền bạn …)';

export const NGAY_21: NgayCauNen = {
  n: 21,
  ten: 'Mệnh lệnh & lời đề nghị lịch sự',
  mucTieu: 'Ra chỉ dẫn, nhờ vả, mời mọc và từ chối khéo: Have a seat. Could you close the door, please? Would you like something to drink? I\'d like to book a room.',
  bai: {
    y: [
      '**Câu mệnh lệnh** = động từ đứng đầu, KHÔNG có chủ ngữ: **Come in.** **Turn off your phone.** Phủ định: **Don\'t + V**: Don\'t touch that.',
      'Rủ cùng làm: **Let\'s + V** (Let\'s take a break.) · không làm: **Let\'s not + V**.',
      'Nhờ người khác: càng dài càng lịch sự — **Close the door.** → **Can you** close the door? → **Could you** close the door, **please**? → **Would you mind closing** the door?',
      'Mời: **Would you like** + danh từ / **to** + động từ: Would you like **some tea**? Would you like **to come**? — lịch sự hơn Do you want.',
      'Nói mình muốn gì cho lịch sự: **I\'d like …** (= I would like) thay cho I want: **I\'d like** to book a room.',
    ],
    khung: [
      { mau: IMP, vi: 'hãy … / mời …' },
      { mau: DONT, vi: 'đừng …' },
      { mau: LETS, vi: 'mình cùng … nhé' },
      { mau: COULD, vi: 'bạn … giúp tôi được không?' },
      { mau: WOULD, vi: 'bạn có muốn … không? (mời)' },
      { mau: ID, vi: 'tôi muốn … (lịch sự)' },
      { mau: MIND, vi: 'phiền bạn … được không?' },
    ],
    soSanh: [
      { vi: 'Bạn đóng cửa giúp mình được không?', tungChu: 'You close door help me can not?', en: 'Could you close the door, please?', viSao: 'Nhờ vả = Could you + V …? — "giúp mình" đã nằm trong Could you, không dịch thành help.' },
      { vi: 'Bạn có muốn uống gì không?', tungChu: 'You want drink what not?', en: 'Would you like something to drink?', viSao: 'Mời ⇒ Would you like; "gì đó để uống" = something to drink.' },
      { vi: 'Phiền bạn mở cửa sổ được không?', tungChu: 'Would you mind to open the window?', en: 'Would you mind opening the window?', viSao: 'Sau mind luôn là V-ing.' },
      { vi: 'Đừng chạm vào cái đó.', tungChu: 'You don\'t touch that.', en: 'Don\'t touch that.', viSao: 'Câu mệnh lệnh không có chủ ngữ you.' },
    ],
    viDu: [
      { en: 'Come in, please. Have a seat.', vi: 'Mời vào. Ngồi đi.' },
      { en: 'Could you close the door, please?', vi: 'Bạn đóng cửa giúp mình được không?' },
      { en: 'Would you like something to drink?', vi: 'Bạn có muốn uống gì không?' },
      { en: 'Let\'s take a break.', vi: 'Mình nghỉ một chút nhé.' },
    ],
    meo: [
      'Trả lời **Would you mind …?** mà ĐỒNG Ý thì nói **No, not at all.** (= không phiền gì) — nói "Yes" là "có, tôi thấy phiền".',
      'Từ chối khéo: **Sorry, I can\'t right now.** · **I\'d love to, but …** — đừng chỉ nói "No."',
    ],
  },
  nguPhap: [
    { t: 'h', text: '1. Bậc thang lịch sự' },
    {
      t: 'table', head: ['Mức', 'Câu', 'Dùng khi'],
      rows: [
        ['1 — ra lệnh', '**Close** the door.', 'chỉ dẫn, biển báo, người rất thân'],
        ['2 — thân mật', '**Can you** close the door?', 'bạn bè, đồng nghiệp ngang hàng'],
        ['3 — lịch sự', '**Could you** close the door, **please**?', 'người lạ, thầy cô, sếp, khách hàng'],
        ['4 — rất lịch sự', '**Would you mind closing** the door?', 'nhờ việc làm phiền người ta'],
      ],
    },
    { t: 'h', text: '2. Mời · muốn · rủ' },
    {
      t: 'sodo', kind: 'compare', title: 'Ba kiểu câu hay nhầm',
      cols: [
        { title: '**Would you like …?** — mời', anh: 'hot-beverage', items: ['Would you like **some tea**?', 'Would you like **to come** with us?'] },
        { title: '**I\'d like …** — tôi muốn', anh: 'raising-hands', items: ['I\'d like **an orange juice**.', 'I\'d like **to ask** a question.'] },
        { title: '**Let\'s …** — mình cùng', anh: 'people-hugging', items: ['Let\'s **take** a break.', 'Let\'s **not be** late.'] },
      ],
    },
    {
      t: 'table', head: ['Câu hỏi', 'Đồng ý', 'Từ chối'],
      rows: [
        ['Could you …?', '**Sure.** · **Of course.** · **No problem.**', '**Sorry, I can\'t right now.**'],
        ['Would you like …?', '**Yes, please.** · **I\'d love to.**', '**No, thank you.** · **I\'d love to, but …**'],
        ['Would you mind …?', '**No, not at all.** · **Of course not.**', '**Actually, I\'d rather you didn\'t.**'],
      ],
    },
    { t: 'note', title: 'Lỗi người Việt hay mắc', items: ['~~Would you mind to open~~ → Would you mind **opening**', '~~Would you like drink?~~ → Would you like **to** drink / **something to** drink?', '~~Let\'s to go~~ / ~~Let\'s going~~ → Let\'s **go**', '~~Don\'t to touch~~ → Don\'t **touch**', '~~I want a coffee~~ (nghe trống không với người lạ) → **I\'d like** a coffee, please.'] },
  ],
  tuVung: [
    { w: 'seat', loai: 'n', vi: 'chỗ ngồi', anh: 'seat', ex: 'Is this seat free?', exVi: 'Chỗ này có ai ngồi chưa?' },
    { w: 'umbrella', loai: 'n', vi: 'cái ô, dù', anh: 'umbrella', ex: 'Take an umbrella with you.', exVi: 'Mang theo ô nhé.' },
    { w: 'window', loai: 'n', vi: 'cửa sổ', anh: 'window', ex: 'The window is open.', exVi: 'Cửa sổ đang mở.' },
    { w: 'turn off', loai: 'phr', vi: 'tắt', anh: 'mobile-phone-off', ex: 'Turn off the lights.', exVi: 'Tắt đèn đi.' },
    { w: 'touch', loai: 'v', vi: 'chạm, sờ', anh: 'raised-hand', ex: 'Please don\'t touch the screen.', exVi: 'Vui lòng đừng chạm vào màn hình.' },
    { w: 'careful', loai: 'adj', vi: 'cẩn thận', anh: 'warning', ex: 'Be careful on the stairs.', exVi: 'Đi cầu thang cẩn thận nhé.' },
    { w: 'repeat', loai: 'v', vi: 'nhắc lại', anh: 'repeat-button', ex: 'Repeat after me.', exVi: 'Nhắc lại theo tôi.' },
    { w: 'link', loai: 'n', vi: 'đường link', anh: 'link', ex: 'The link doesn\'t work.', exVi: 'Link không mở được.' },
    { w: 'directions', loai: 'n', vi: 'chỉ đường', anh: 'compass', ex: 'Can I ask for directions?', exVi: 'Cho tôi hỏi đường được không?' },
    { w: 'orange juice', loai: 'n', vi: 'nước cam', anh: 'tangerine', ex: 'I\'d like some orange juice.', exVi: 'Tôi muốn ít nước cam.' },
    { w: 'quiet', loai: 'adj', vi: 'yên lặng', anh: 'shushing-face', ex: 'Please be quiet.', exVi: 'Làm ơn giữ trật tự.' },
    { w: 'break', loai: 'n', vi: 'giờ nghỉ', anh: 'person-in-lotus-position', ex: 'We have a ten-minute break.', exVi: 'Chúng ta nghỉ mười phút.' },
    { w: 'sign', loai: 'v', vi: 'ký tên', anh: 'writing-hand', ex: 'Sign your name here.', exVi: 'Ký tên vào đây.' },
    { w: 'pass', loai: 'v', vi: 'đưa (cho ai)', anh: 'pen', ex: 'Could you pass the salt?', exVi: 'Đưa giúp mình lọ muối.' },
    { w: 'hold on', loai: 'phr', vi: 'chờ máy, đợi chút', anh: 'telephone-receiver', ex: 'Hold on, I\'ll get him.', exVi: 'Chờ chút, để tôi gọi anh ấy.' },
    { w: 'hotel room', loai: 'n', vi: 'phòng khách sạn', anh: 'hotel', ex: 'The hotel room is clean.', exVi: 'Phòng khách sạn sạch sẽ.' },
  ],
  hoiThoai: {
    tieuDe: 'Bạn đến nhà chơi',
    luot: [
      { vai: 'A', ten: 'Lan', en: 'Hi! Come in, please. Have a seat.', vi: 'Chào cậu! Vào đi. Ngồi đi.' },
      { vai: 'B', ten: 'Emma', en: 'Thanks. Your place is really nice.', vi: 'Cảm ơn. Nhà cậu đẹp thật.' },
      { vai: 'A', ten: 'Lan', en: 'Would you like something to drink?', vi: 'Cậu uống gì không?' },
      { vai: 'B', ten: 'Emma', en: 'Yes, please. I\'d like some tea.', vi: 'Có, cho mình xin trà.' },
      { vai: 'A', ten: 'Lan', en: 'Sure. Make yourself at home.', vi: 'Được. Cứ tự nhiên như ở nhà nhé.' },
      { vai: 'B', ten: 'Emma', en: 'Would you mind turning on the fan? It\'s a little hot.', vi: 'Cậu bật quạt giúp mình được không? Hơi nóng.' },
      { vai: 'A', ten: 'Lan', en: 'No, not at all. Let\'s watch a movie after dinner.', vi: 'Được chứ. Ăn tối xong mình xem phim nhé.' },
    ],
  },
  viet: {
    y: [
      'Viết hướng dẫn (công thức nấu ăn, cách cài phần mềm): mỗi bước **một câu mệnh lệnh**, động từ đứng đầu — First, **open** … Then **click** …',
      'Viết tin nhắn nhờ vả: mở bằng **Could you …, please?**, kết bằng **Thanks a lot!**',
      'Câu mệnh lệnh vẫn viết hoa chữ đầu và có dấu chấm (hoặc chấm than nếu nhấn mạnh: Be careful!).',
    ],
    chinhTa: ['~~pleas~~ → **please**', '~~wolud~~ → **would**', '~~could you open the door.~~ → câu hỏi phải có **?**', '~~umbrela~~ → **umbrella**'],
    de: 'Viết **5 bước** hướng dẫn một bạn mới cách pha cà phê phin (hoặc cách nộp bài trên hệ thống của trường), rồi thêm **1 câu nhờ** và **1 câu mời**.',
    mau: [
      { en: 'First, put two spoons of coffee in the filter.', vi: 'Đầu tiên, cho hai thìa cà phê vào phin.' },
      { en: 'Then pour a little hot water and wait for 30 seconds.', vi: 'Sau đó rót một chút nước nóng và đợi 30 giây.' },
      { en: 'Fill the filter with hot water.', vi: 'Đổ đầy nước nóng vào phin.' },
      { en: 'Don\'t stir it until it finishes dripping.', vi: 'Đừng khuấy cho tới khi cà phê nhỏ giọt xong.' },
      { en: 'Would you like some condensed milk with it?', vi: 'Bạn có muốn thêm sữa đặc không?' },
    ],
  },
  cau: [
    { id: 'cn21-01', vi: 'Mời vào.', en: 'Come in, please.', alt: ['Please come in.', 'Come on in.'], khung: IMP },
    { id: 'cn21-02', vi: 'Mời ngồi.', en: 'Have a seat.', alt: ['Please sit down.', 'Take a seat.', 'Please have a seat.'], khung: IMP },
    { id: 'cn21-03', vi: 'Đợi một chút nhé.', en: 'Wait a moment, please.', alt: ['Just a moment, please.', 'Please wait a moment.', 'One moment, please.'], khung: IMP },
    { id: 'cn21-04', vi: 'Đừng quên mang ô.', en: 'Don\'t forget your umbrella.', alt: ['Don\'t forget to bring an umbrella.', 'Don\'t forget to bring your umbrella.'], khung: DONT },
    { id: 'cn21-05', vi: 'Đừng chạm vào cái đó.', en: 'Don\'t touch that.', alt: ['Don\'t touch it.', 'Please don\'t touch that.'], khung: DONT, loi: '~~You don\'t touch~~ — câu mệnh lệnh không có you' },
    { id: 'cn21-06', vi: 'Tắt điện thoại đi.', en: 'Turn off your phone.', alt: ['Turn your phone off.', 'Please turn off your phone.'], khung: IMP },
    { id: 'cn21-07', vi: 'Cẩn thận đấy!', en: 'Be careful!', alt: ['Watch out!'], khung: 'Be + Adj! (mệnh lệnh với be)' },
    { id: 'cn21-08', vi: 'Cứ từ từ, không vội đâu.', en: 'Take your time. There\'s no rush.', alt: ['Take your time.', 'No rush. Take your time.'], khung: IMP },
    { id: 'cn21-09', vi: 'Bạn đóng cửa giúp mình được không?', en: 'Could you close the door, please?', alt: ['Can you close the door, please?', 'Could you shut the door, please?', 'Could you close the door?'], khung: COULD },
    { id: 'cn21-10', vi: 'Bạn chỉ đường giúp tôi được không?', en: 'Could you show me the way?', alt: ['Could you give me directions?', 'Can you show me the way?', 'Could you show me the way, please?'], khung: COULD },
    { id: 'cn21-11', vi: 'Bạn nhắc lại được không ạ?', en: 'Could you repeat that, please?', alt: ['Could you say that again, please?', 'Can you repeat that?', 'Sorry, could you repeat that?', 'Could you repeat that?'], khung: COULD },
    { id: 'cn21-12', vi: 'Bạn gửi mình cái link được không?', en: 'Could you send me the link?', alt: ['Can you send me the link?', 'Could you send me the link, please?'], khung: COULD },
    { id: 'cn21-13', vi: 'Bạn uống chút gì nhé?', en: 'Would you like something to drink?', alt: ['Would you like anything to drink?', 'Can I get you something to drink?'], khung: WOULD },
    { id: 'cn21-14', vi: 'Bạn có muốn đi cùng bọn mình không?', en: 'Would you like to come with us?', alt: ['Do you want to come with us?', 'Would you like to join us?'], khung: WOULD, loi: '~~Would you like come~~ — thiếu to' },
    { id: 'cn21-15', vi: 'Tôi muốn đặt một phòng.', en: 'I\'d like to book a room.', alt: ['I\'d like to reserve a room.', 'I want to book a room.'], khung: ID },
    { id: 'cn21-16', vi: 'Cho tôi một ly nước cam.', en: 'I\'d like an orange juice.', alt: ['I\'d like a glass of orange juice.', 'Can I have an orange juice?', 'I\'d like an orange juice, please.'], khung: ID },
    { id: 'cn21-17', vi: 'Phiền bạn mở cửa sổ được không?', en: 'Would you mind opening the window?', alt: ['Would you mind opening the window, please?'], khung: MIND, loi: '~~Would you mind to open~~ → opening' },
    { id: 'cn21-18', vi: 'Phiền bạn nói nhỏ lại một chút.', en: 'Would you mind keeping it down?', alt: ['Could you be a little quieter?', 'Could you keep it down?', 'Would you mind being quieter?'], khung: MIND },
    { id: 'cn21-19', vi: 'Mình nghỉ một chút nhé.', en: 'Let\'s take a break.', alt: ['Let\'s take a short break.', 'Let\'s have a break.'], khung: LETS },
    { id: 'cn21-20', vi: 'Đừng nói với ai nhé.', en: 'Don\'t tell anyone.', alt: ['Don\'t tell anybody.', 'Please don\'t tell anyone.'], khung: DONT },
    { id: 'cn21-21', vi: 'Mình đừng đến muộn nhé.', en: 'Let\'s not be late.', khung: LETS },
    { id: 'cn21-22', vi: 'Bạn kiểm tra lại giúp mình được không?', en: 'Could you double-check it for me?', alt: ['Can you double-check it for me?', 'Could you check it again for me?', 'Could you double-check this for me?'], khung: COULD },
    { id: 'cn21-23', vi: 'Chúng ta bắt đầu nhé?', en: 'Shall we start?', alt: ['Shall we begin?', 'Should we start?', 'Let\'s get started.'], khung: 'Shall we + V? (mình … nhé?)' },
    { id: 'cn21-24', vi: 'Được chứ, không vấn đề gì.', en: 'Sure, no problem.', alt: ['Of course, no problem.', 'Sure.', 'No problem.'], khung: 'Trả lời đồng ý: Sure / Of course' },
    { id: 'cn21-25', vi: 'Xin lỗi, giờ mình không giúp được.', en: 'Sorry, I can\'t right now.', alt: ['Sorry, I can\'t help right now.', 'I\'m sorry, I can\'t right now.'], khung: 'Từ chối: Sorry, I can\'t + (right now).' },
    { id: 'cn21-26', vi: 'Làm ơn ký vào đây.', en: 'Please sign here.', alt: ['Sign here, please.'], khung: IMP },
    { id: 'cn21-27', vi: 'Bạn nói to hơn một chút được không?', en: 'Could you speak up a little?', alt: ['Could you speak a little louder?', 'Can you speak up a bit?', 'Can you speak a little louder?'], khung: COULD, goi: 'nói to lên = speak up' },
    { id: 'cn21-28', vi: 'Bạn có muốn mình giúp không?', en: 'Would you like me to help?', alt: ['Do you want me to help?', 'Would you like some help?', 'Would you like me to help you?'], khung: 'Would you like me + to V?' },
    { id: 'cn21-29', vi: 'Đi thẳng rồi rẽ trái.', en: 'Go straight and turn left.', alt: ['Go straight, then turn left.', 'Go straight ahead and turn left.'], khung: IMP },
    { id: 'cn21-30', vi: 'Cứ tự nhiên như ở nhà nhé.', en: 'Make yourself at home.', khung: IMP },
    { id: 'cn21-31', vi: 'Bạn đưa mình cái bút được không?', en: 'Can you pass me the pen?', alt: ['Could you pass me the pen?', 'Could you hand me the pen?', 'Can you hand me that pen?'], khung: COULD },
    { id: 'cn21-32', vi: 'Đừng để quên đồ nhé.', en: 'Don\'t leave anything behind.', alt: ['Don\'t forget anything.', 'Don\'t forget your things.'], khung: DONT },
    { id: 'cn21-33', vi: 'Em muốn hỏi một câu ạ.', en: 'I\'d like to ask a question.', alt: ['I\'d like to ask you something.', 'Can I ask a question?', 'May I ask a question?'], khung: ID },
    { id: 'cn21-34', vi: 'Anh chờ máy một chút nhé.', en: 'Please hold on a moment.', alt: ['Hold on a second, please.', 'Please hold.', 'Hold on, please.', 'Hold on a moment, please.'], khung: IMP, goi: 'chờ máy = hold on' },
  ],
};
