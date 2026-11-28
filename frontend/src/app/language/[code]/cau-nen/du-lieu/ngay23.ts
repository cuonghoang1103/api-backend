import type { NgayCauNen } from '../kieu';

const BEC = 'S + V … because + S + V (vì) · because of + N';
const SO = 'S + V …, so + S + V (nên)';
const BUT = 'S + V …, but + S + V (nhưng)';
const WHEN = 'When + S + V, S + V · S + V + when + S + V (khi)';
const IF = 'If + S + V (hiện tại), S + will + V (nếu … thì sẽ)';
const IFI = 'If + S + V, (please) + V / let\'s + V (nếu … thì hãy)';
const BA = 'before / after + S + V (trước / sau khi)';

export const NGAY_23: NgayCauNen = {
  n: 23,
  ten: 'Nối câu: because / so / but / when / if',
  mucTieu: 'Ghép hai ý thành một câu dài, có lý do, kết quả, đối lập, thời điểm và điều kiện: If it rains, I\'ll stay home. I was tired, so I went to bed early.',
  bai: {
    y: [
      '**because** (vì) đứng trước **lý do** · **so** (nên) đứng trước **kết quả**. Tiếng Việt nói "**vì** … **nên** …", tiếng Anh chỉ dùng **MỘT** trong hai: ~~Because I was tired, so I slept~~.',
      '**but** (nhưng) nối hai ý trái nhau: I want to go, **but** I\'m busy. Trước so / but thường có dấu phẩy.',
      '**when** (khi) và **before / after** (trước / sau khi) nối thời điểm — đứng đầu câu thì có dấu phẩy: **When** I have free time, I read.',
      '**if** (nếu) — điều kiện có thể xảy ra: **If + hiện tại đơn, will + V**: If it **rains**, I**\'ll** stay home. KHÔNG nói ~~If it will rain~~.',
      'Vế "if" / "when" cho ra sau cũng được, khi đó **bỏ dấu phẩy**: I\'ll stay home if it rains.',
    ],
    khung: [
      { mau: BEC, vi: 'vì' },
      { mau: SO, vi: 'nên' },
      { mau: BUT, vi: 'nhưng' },
      { mau: WHEN, vi: 'khi' },
      { mau: BA, vi: 'trước khi / sau khi' },
      { mau: IF, vi: 'nếu … thì sẽ …' },
      { mau: IFI, vi: 'nếu … thì hãy / thì mình …' },
    ],
    soSanh: [
      { vi: 'Vì mệt nên tôi đi ngủ sớm.', tungChu: 'Because I tired, so I go to bed early.', en: 'I was tired, so I went to bed early.', viSao: 'Chỉ dùng because HOẶC so, không dùng cả hai; thiếu was; chuyện đã qua ⇒ went.' },
      { vi: 'Nếu trời mưa, tôi sẽ ở nhà.', tungChu: 'If it will rain, I will stay home.', en: 'If it rains, I\'ll stay home.', viSao: 'Vế if dùng hiện tại đơn (rains), will chỉ ở vế kết quả.' },
      { vi: 'Tôi đi học muộn vì kẹt xe.', tungChu: 'I late school because traffic.', en: 'I was late for school because of the traffic.', viSao: 'because + câu, because OF + danh từ; muộn = be late for.' },
    ],
    viDu: [
      { en: 'If it rains, I\'ll stay home.', vi: 'Nếu trời mưa, tôi sẽ ở nhà.' },
      { en: 'I was tired, so I went to bed early.', vi: 'Tôi mệt nên đi ngủ sớm.' },
      { en: 'I want to go, but I\'m busy.', vi: 'Tôi muốn đi nhưng tôi bận.' },
      { en: 'Let me know when you\'re done.', vi: 'Khi nào xong thì báo mình nhé.' },
    ],
    meo: ['Nói chuyện với người nước ngoài, câu dài không làm bạn giỏi hơn — nhưng **câu có lý do** (because…) làm bạn nghe thuyết phục hơn. Tập thói quen: nói gì cũng thêm một vế because.'],
  },
  nguPhap: [
    { t: 'h', text: '1. Năm từ nối cơ bản' },
    {
      t: 'table', head: ['Từ nối', 'Nghĩa', 'Đứng trước', 'Ví dụ'],
      rows: [
        ['**because**', 'vì', 'lý do', 'I\'m staying home **because** I\'m sick.'],
        ['**so**', 'nên', 'kết quả', 'It\'s cold, **so** put on your jacket.'],
        ['**but**', 'nhưng', 'ý trái ngược', 'He\'s smart, **but** a little lazy.'],
        ['**when**', 'khi', 'thời điểm', '**When** I have free time, I read.'],
        ['**if**', 'nếu', 'điều kiện', '**If** you need help, just call me.'],
        ['**before / after**', 'trước / sau khi', 'thời điểm', 'Wash your hands **before** you eat.'],
      ],
    },
    {
      t: 'sodo', kind: 'compare', title: 'because hay so — cùng một chuyện, hai cách nói',
      cols: [
        { title: '**because** + lý do', anh: 'thinking-face', items: ['I went to bed early **because** I was tired.'] },
        { title: '**so** + kết quả', anh: 'bed', items: ['I was tired, **so** I went to bed early.'] },
      ],
    },
    { t: 'h', text: '2. Câu điều kiện "nếu … thì sẽ …"' },
    {
      t: 'sodo', kind: 'flow', title: 'If + hiện tại → will',
      steps: [
        { label: 'If + hiện tại đơn', sub: 'If it rains,' },
        { label: 'dấu phẩy', sub: ',' },
        { label: 'will + V', sub: 'I\'ll stay home.' },
      ],
    },
    {
      t: 'table', head: ['Loại', 'Công thức', 'Ví dụ'],
      rows: [
        ['Sự thật, luôn đúng', 'If + hiện tại, **hiện tại**', 'If you heat water to 100 degrees, it **boils**.'],
        ['Có thể xảy ra', 'If + hiện tại, **will + V**', 'If you study hard, you**\'ll pass**.'],
        ['Khuyên / nhờ', 'If + hiện tại, **V / let\'s + V**', 'If you find a bug, **let me know**.'],
      ],
    },
    { t: 'note', title: 'Lỗi người Việt hay mắc', items: ['~~Because I was tired, so I slept~~ → bỏ một trong hai: because HOẶC so', '~~Although it\'s cheap, but…~~ → bỏ but', '~~If it will rain~~ → If it **rains**', '~~When I will get home~~ → When I **get** home', '~~because the traffic~~ → because **of** the traffic'] },
  ],
  tuVung: [
    { w: 'rain', loai: 'v/n', vi: 'mưa', anh: 'cloud-with-rain', ex: 'It often rains in July.', exVi: 'Tháng Bảy hay mưa.' },
    { w: 'jacket', loai: 'n', vi: 'áo khoác', anh: 'coat', ex: 'Take your jacket.', exVi: 'Mang áo khoác theo.' },
    { w: 'lazy', loai: 'adj', vi: 'lười', anh: 'sloth', ex: 'I feel lazy on Sundays.', exVi: 'Chủ nhật tôi thấy lười.' },
    { w: 'hungry', loai: 'adj', vi: 'đói', anh: 'face-savoring-food', ex: 'Are you hungry?', exVi: 'Bạn đói chưa?' },
    { w: 'boil', loai: 'v', vi: 'sôi; đun sôi', anh: 'teapot', ex: 'Boil the water first.', exVi: 'Đun sôi nước trước.' },
    { w: 'graduate', loai: 'v', vi: 'tốt nghiệp', anh: 'graduation-cap', ex: 'She graduated last year.', exVi: 'Cô ấy tốt nghiệp năm ngoái.' },
    { w: 'foreign', loai: 'adj', vi: 'nước ngoài', anh: 'globe-showing-asia-australia', ex: 'He works for a foreign company.', exVi: 'Anh ấy làm cho công ty nước ngoài.' },
    { w: 'flood', loai: 'v/n', vi: 'ngập, lũ', anh: 'water-wave', ex: 'The street is flooded.', exVi: 'Đường bị ngập.' },
    { w: 'miss', loai: 'v', vi: 'lỡ (xe, buổi); nhớ (ai)', anh: 'bus-stop', ex: 'Hurry, or you\'ll miss the bus.', exVi: 'Nhanh lên kẻo lỡ xe buýt.' },
    { w: 'release', loai: 'v/n', vi: 'phát hành (phần mềm)', anh: 'rocket', ex: 'We release a new version every month.', exVi: 'Mỗi tháng chúng tôi phát hành một bản mới.' },
    { w: 'delete', loai: 'v', vi: 'xoá', anh: 'wastebasket', ex: 'Don\'t delete this folder.', exVi: 'Đừng xoá thư mục này.' },
    { w: 'heat', loai: 'v/n', vi: 'làm nóng; hơi nóng', anh: 'fire', ex: 'Heat the pan first.', exVi: 'Làm nóng chảo trước.' },
    { w: 'free time', loai: 'n', vi: 'thời gian rảnh', anh: 'video-game', ex: 'What do you do in your free time?', exVi: 'Lúc rảnh bạn làm gì?' },
    { w: 'beginning', loai: 'n', vi: 'phần đầu, lúc bắt đầu', anh: 'play-button', ex: 'I missed the beginning of the class.', exVi: 'Tôi lỡ phần đầu buổi học.' },
    { w: 'pick up', loai: 'phr', vi: 'nghe máy (điện thoại)', anh: 'telephone', ex: 'She didn\'t pick up.', exVi: 'Cô ấy không nghe máy.' },
    { w: 'jog', loai: 'v', vi: 'chạy bộ', anh: 'running-shoe', ex: 'I jog in the park.', exVi: 'Tôi chạy bộ trong công viên.' },
  ],
  hoiThoai: {
    tieuDe: 'Rủ đi chơi cuối tuần',
    luot: [
      { vai: 'A', ten: 'Quân', en: 'If you\'re free on Saturday, let\'s go to Vung Tau.', vi: 'Nếu thứ Bảy rảnh thì mình đi Vũng Tàu nhé.' },
      { vai: 'B', ten: 'Mai', en: 'I want to go, but I have a test on Monday.', vi: 'Mình muốn đi lắm, nhưng thứ Hai mình có bài kiểm tra.' },
      { vai: 'A', ten: 'Quân', en: 'We\'ll come back early, so you can study on Sunday.', vi: 'Mình về sớm, nên Chủ nhật cậu vẫn học được.' },
      { vai: 'B', ten: 'Mai', en: 'What if it rains?', vi: 'Lỡ trời mưa thì sao?' },
      { vai: 'A', ten: 'Quân', en: 'If it rains, we\'ll go to a cafe instead.', vi: 'Nếu mưa thì mình vào quán cà phê.' },
      { vai: 'B', ten: 'Mai', en: 'Okay! I\'ll finish my homework before we leave.', vi: 'Được! Mình sẽ làm xong bài tập trước khi đi.' },
      { vai: 'A', ten: 'Quân', en: 'Great. Text me when you\'re ready.', vi: 'Tuyệt. Chuẩn bị xong thì nhắn mình nhé.' },
    ],
  },
  viet: {
    y: [
      'Viết đoạn văn bằng câu NỐI thay vì nhiều câu ngắn rời rạc: ~~I was tired. I went to bed.~~ → I was tired, **so** I went to bed.',
      'Dấu phẩy: đặt **trước so / but**; đặt **sau** vế If / When / Before / After khi vế đó đứng đầu câu.',
      'Mỗi câu chỉ một từ nối chính — đừng chồng because + so, although + but.',
      'Soát thì: vế **if / when** nói về tương lai vẫn dùng **hiện tại đơn**.',
    ],
    chinhTa: ['~~becouse~~ / ~~beacause~~ → **because**', '~~untill~~ → **until**', '~~befor~~ → **before**', '~~If it will~~ → **If it** + hiện tại đơn'],
    de: 'Viết **5 câu** về kế hoạch học tập của bạn tuần này, mỗi câu dùng một từ nối khác nhau: because, so, but, when, if.',
    mau: [
      { en: 'I\'m studying hard because I have two exams next week.', vi: 'Tôi đang học chăm vì tuần sau có hai bài thi.' },
      { en: 'I go to the library after class, so I can focus.', vi: 'Tôi lên thư viện sau giờ học để tập trung được.' },
      { en: 'I want to play games, but I don\'t have time.', vi: 'Tôi muốn chơi game nhưng không có thời gian.' },
      { en: 'When I feel sleepy, I drink a cup of coffee.', vi: 'Khi buồn ngủ, tôi uống một cốc cà phê.' },
      { en: 'If I finish early on Friday, I\'ll go out with my friends.', vi: 'Nếu thứ Sáu xong sớm, tôi sẽ đi chơi với bạn.' },
    ],
  },
  cau: [
    { id: 'cn23-01', vi: 'Nếu trời mưa, tôi sẽ ở nhà.', en: 'If it rains, I\'ll stay home.', alt: ['If it rains, I\'ll stay at home.', 'I\'ll stay home if it rains.'], khung: IF, loi: '~~If it will rain~~' },
    { id: 'cn23-02', vi: 'Tôi đi học muộn vì kẹt xe.', en: 'I was late for school because of the traffic.', alt: ['I was late for school because there was a lot of traffic.', 'I was late for class because of the traffic.', 'I was late for school because of traffic.'], khung: BEC, goi: 'because of + danh từ' },
    { id: 'cn23-03', vi: 'Tôi mệt nên đi ngủ sớm.', en: 'I was tired, so I went to bed early.', alt: ['I was tired, so I went to sleep early.', 'I went to bed early because I was tired.'], khung: SO, loi: '~~Because I was tired, so…~~' },
    { id: 'cn23-04', vi: 'Tôi muốn đi nhưng tôi bận.', en: 'I want to go, but I\'m busy.', alt: ['I\'d like to go, but I\'m busy.'], khung: BUT },
    { id: 'cn23-05', vi: 'Lúc rảnh tôi hay đọc sách.', en: 'When I have free time, I usually read books.', alt: ['When I\'m free, I usually read.', 'I usually read books when I have free time.', 'When I have free time, I usually read.'], khung: WHEN },
    { id: 'cn23-06', vi: 'Nếu cần giúp thì cứ gọi mình.', en: 'If you need help, just call me.', alt: ['If you need any help, just call me.', 'Call me if you need help.', 'If you need help, call me.'], khung: IFI },
    { id: 'cn23-07', vi: 'Nếu chăm học, bạn sẽ đậu.', en: 'If you study hard, you\'ll pass.', alt: ['You\'ll pass if you study hard.', 'If you study hard, you\'ll pass the exam.'], khung: IF },
    { id: 'cn23-08', vi: 'Hôm nay tôi ở nhà vì bị ốm.', en: 'I\'m staying home today because I\'m sick.', alt: ['I\'m staying at home today because I\'m sick.', 'I\'m at home today because I\'m sick.'], khung: BEC },
    { id: 'cn23-09', vi: 'Về đến nhà thì gọi cho mẹ nhé.', en: 'Call Mom when you get home.', alt: ['Call your mom when you get home.', 'When you get home, call Mom.', 'When you get home, call your mom.'], khung: WHEN },
    { id: 'cn23-10', vi: 'Nếu đun nước tới 100 độ, nước sẽ sôi.', en: 'If you heat water to 100 degrees, it boils.', alt: ['Water boils if you heat it to 100 degrees.', 'If you heat water to 100 degrees, it will boil.'], khung: 'If + hiện tại, hiện tại (sự thật luôn đúng)' },
    { id: 'cn23-11', vi: 'Tôi thích cà phê nhưng không uống buổi tối.', en: 'I like coffee, but I don\'t drink it at night.', alt: ['I like coffee, but I don\'t drink it in the evening.'], khung: BUT },
    { id: 'cn23-12', vi: 'Đói quá nên mình gọi pizza.', en: 'I was really hungry, so I ordered a pizza.', alt: ['I was very hungry, so I ordered a pizza.', 'I was really hungry, so I ordered pizza.'], khung: SO },
    { id: 'cn23-13', vi: 'Code chạy được thì đừng động vào.', en: 'If the code works, don\'t touch it.', alt: ['If it works, don\'t touch it.', 'Don\'t touch the code if it works.'], khung: IFI },
    { id: 'cn23-14', vi: 'Không hiểu thì cứ hỏi nhé.', en: 'If you don\'t understand, just ask.', alt: ['If you don\'t understand, ask me.', 'Just ask if you don\'t understand.'], khung: IFI },
    { id: 'cn23-15', vi: 'Tôi bắt đầu học tiếng Anh khi lên mười.', en: 'I started learning English when I was ten.', alt: ['I started studying English when I was ten.', 'I began learning English when I was ten.'], khung: WHEN },
    { id: 'cn23-16', vi: 'Rửa tay trước khi ăn.', en: 'Wash your hands before you eat.', alt: ['Wash your hands before eating.', 'Wash your hands before meals.'], khung: BA },
    { id: 'cn23-17', vi: 'Sau khi tốt nghiệp, tôi muốn làm lập trình viên.', en: 'After I graduate, I want to be a programmer.', alt: ['After graduating, I want to be a programmer.', 'After I graduate, I want to become a developer.', 'After I graduate, I want to work as a developer.', 'After I graduate, I want to be a developer.'], khung: BA, loi: '~~After I will graduate~~' },
    { id: 'cn23-18', vi: 'Anh ấy giỏi nhưng hơi lười.', en: 'He\'s smart, but a little lazy.', alt: ['He\'s smart but a bit lazy.', 'He\'s smart, but he\'s a little lazy.'], khung: BUT },
    { id: 'cn23-19', vi: 'Hôm nay Chủ nhật nên cửa hàng đóng cửa.', en: 'It\'s Sunday, so the store is closed.', alt: ['The store is closed because it\'s Sunday.', 'It\'s Sunday, so the shop is closed.'], khung: SO },
    { id: 'cn23-20', vi: 'Tôi học tiếng Anh vì muốn làm cho công ty nước ngoài.', en: 'I\'m learning English because I want to work for a foreign company.', alt: ['I study English because I want to work for a foreign company.', 'I\'m learning English because I want to work at a foreign company.'], khung: BEC },
    { id: 'cn23-21', vi: 'Mai rảnh thì mình đi xem phim nhé.', en: 'If you\'re free tomorrow, let\'s go to the movies.', alt: ['If you\'re free tomorrow, let\'s see a movie.', 'Let\'s go to the movies tomorrow if you\'re free.', 'If you\'re free tomorrow, let\'s watch a movie.'], khung: IFI },
    { id: 'cn23-22', vi: 'Đến muộn là bạn sẽ lỡ phần đầu.', en: 'If you\'re late, you\'ll miss the beginning.', alt: ['If you come late, you\'ll miss the beginning.', 'You\'ll miss the beginning if you\'re late.'], khung: IF },
    { id: 'cn23-23', vi: 'Tôi gọi nhưng không ai nghe máy.', en: 'I called, but no one answered.', alt: ['I called, but nobody answered.', 'I called, but nobody picked up.', 'I called, but no one picked up.'], khung: BUT },
    { id: 'cn23-24', vi: 'Trời lạnh, mặc áo khoác vào đi.', en: 'It\'s cold, so put on your jacket.', alt: ['It\'s cold, so wear a jacket.', 'It\'s cold, so put your jacket on.'], khung: SO },
    { id: 'cn23-25', vi: 'Khi nào xong thì báo mình nhé.', en: 'Let me know when you\'re done.', alt: ['Tell me when you\'re done.', 'Let me know when you finish.', 'Let me know when you\'re finished.'], khung: WHEN },
    { id: 'cn23-26', vi: 'Nếu không có gì thay đổi, thứ Sáu mình sẽ release.', en: 'If nothing changes, we\'ll release on Friday.', alt: ['If nothing changes, we\'ll release it on Friday.', 'We\'ll release on Friday if nothing changes.'], khung: IF },
    { id: 'cn23-27', vi: 'Tôi tắt laptop vì nó nóng quá.', en: 'I turned off my laptop because it was too hot.', alt: ['I shut down my laptop because it was too hot.', 'I turned my laptop off because it was too hot.'], khung: BEC },
    { id: 'cn23-28', vi: 'Bạn dùng máy mình cũng được, nhưng đừng xoá file nào nhé.', en: 'You can use my computer, but don\'t delete any files.', alt: ['You can use my laptop, but don\'t delete any files.'], khung: BUT },
    { id: 'cn23-29', vi: 'Làm xong việc này tôi sẽ đi ngủ.', en: 'I\'ll go to bed after I finish this.', alt: ['I\'ll go to sleep after I finish this.', 'I\'ll go to bed after I finish this work.', 'After I finish this, I\'ll go to bed.'], khung: BA },
    { id: 'cn23-30', vi: 'Nếu lỡ xe buýt, tôi sẽ đi Grab.', en: 'If I miss the bus, I\'ll take a Grab.', alt: ['If I miss the bus, I\'ll get a Grab.', 'I\'ll take a Grab if I miss the bus.'], khung: IF },
    { id: 'cn23-31', vi: 'Cứ mưa là đường lại ngập.', en: 'Every time it rains, the streets flood.', alt: ['Whenever it rains, the streets flood.', 'When it rains, the streets get flooded.', 'Every time it rains, the streets get flooded.'], khung: 'Every time / Whenever + S + V, S + V (cứ … là …)' },
    { id: 'cn23-32', vi: 'Bài dễ nên tôi làm xong nhanh.', en: 'The exercise was easy, so I finished it quickly.', alt: ['The exercise was easy, so I finished quickly.', 'It was easy, so I finished it quickly.'], khung: SO },
    { id: 'cn23-33', vi: 'Tôi không thích chạy bộ nhưng sáng nào cũng chạy.', en: 'I don\'t like running, but I still run every morning.', alt: ['I don\'t like jogging, but I still jog every morning.'], khung: BUT, goi: 'vẫn = still' },
    { id: 'cn23-34', vi: 'Nếu thấy lỗi thì báo mình nhé.', en: 'If you find a bug, please tell me.', alt: ['If you find a bug, let me know.', 'Let me know if you find a bug.', 'If you see a bug, please let me know.'], khung: IFI },
  ],
};
