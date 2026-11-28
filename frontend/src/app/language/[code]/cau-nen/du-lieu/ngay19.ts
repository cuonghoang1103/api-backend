import type { NgayCauNen } from '../kieu';

const SOME = 'S + V + some + N (khẳng định: một ít, vài)';
const ANY = 'Do you have any + N? · S + don\'t + V + any + N';
const MANY = 'many + N số nhiều · much + N không đếm được';
const LOT = 'a lot of / lots of + N (nhiều — cả hai loại)';
const FEW = 'a few + N số nhiều · a little + N không đếm được';
const HOW = 'How many + N số nhiều …? · How much + N không đếm được …?';
const ONE = 'someone / anyone · something / anything · nothing';

export const NGAY_19: NgayCauNen = {
  n: 19,
  ten: 'Lượng từ: some / any / much / many',
  mucTieu: 'Nói "một ít, vài, nhiều, không … nào" đúng loại danh từ: Do you have any questions? I don\'t have much time. There are so many people here.',
  bai: {
    y: [
      'Tiếng Anh chia danh từ làm hai loại: **đếm được** (a question → two questions) và **không đếm được** (water, money, time, homework, information — không có a, không thêm -s).',
      '**some** dùng trong câu **khẳng định** (và lời mời): I need **some** water. **any** dùng trong câu **phủ định và câu hỏi**: I don\'t have **any** cash. Do you have **any** questions?',
      '**many** đi với danh từ đếm được số nhiều, **much** đi với danh từ không đếm được: many people · much time. Câu khẳng định thường dùng **a lot of** cho cả hai: a lot of people, a lot of water.',
      '**a few** (vài) + đếm được · **a little** (một chút) + không đếm được: a few friends · a little milk.',
      'Hỏi số lượng: **How many** + số nhiều (How many students…?) · **How much** + không đếm được (How much time…?).',
    ],
    khung: [
      { mau: SOME, vi: 'một ít / vài (câu khẳng định, lời mời)' },
      { mau: ANY, vi: '… nào không? / không … nào' },
      { mau: MANY, vi: 'nhiều (hay dùng ở câu phủ định, câu hỏi)' },
      { mau: LOT, vi: 'nhiều (câu khẳng định)' },
      { mau: FEW, vi: 'vài / một chút' },
      { mau: HOW, vi: 'bao nhiêu?' },
    ],
    soSanh: [
      { vi: 'Tôi không có nhiều thời gian.', tungChu: 'I don\'t have many time.', en: 'I don\'t have much time.', viSao: 'time không đếm được ⇒ much, không phải many.' },
      { vi: 'Bạn có câu hỏi nào không?', tungChu: 'You have question any?', en: 'Do you have any questions?', viSao: 'Câu hỏi cần Do; any + danh từ số nhiều đứng sau have.' },
      { vi: 'Lớp bạn có bao nhiêu sinh viên?', tungChu: 'Your class have how much student?', en: 'How many students are there in your class?', viSao: 'students đếm được ⇒ How many + số nhiều, đưa lên đầu câu.' },
      { vi: 'Cho tôi vài thông tin.', tungChu: 'Give me some informations.', en: 'Give me some information.', viSao: 'information không đếm được — không bao giờ thêm -s.' },
    ],
    viDu: [
      { en: 'Do you have any questions?', vi: 'Các bạn có câu hỏi nào không?' },
      { en: 'I need some water.', vi: 'Tôi cần một ít nước.' },
      { en: 'I don\'t have much time.', vi: 'Tôi không có nhiều thời gian.' },
      { en: 'There are so many people here.', vi: 'Ở đây đông người quá.' },
    ],
    meo: [
      'Mời ai đó thì dùng **some** dù là câu hỏi: Would you like **some** tea? — vì mình mong họ nói "có".',
      'Những từ người Việt hay thêm -s sai: **information, advice, homework, furniture, luggage, news, money** — đều không đếm được.',
    ],
  },
  nguPhap: [
    { t: 'h', text: '1. Đếm được hay không đếm được?' },
    {
      t: 'sodo', kind: 'compare', title: 'Hai loại danh từ',
      cols: [
        { title: '**Đếm được** — có a/an, có số nhiều', anh: 'egg', items: ['an egg → three **eggs**', 'a question → some **questions**', 'a bug → many **bugs**'] },
        { title: '**Không đếm được** — không a, không -s', anh: 'droplet', items: ['water · milk · rice · sugar', 'money · time · homework', 'information · advice · news'] },
      ],
    },
    { t: 'h', text: '2. Dùng từ nào với loại nào' },
    {
      t: 'table', head: ['Nghĩa', 'Đếm được (số nhiều)', 'Không đếm được'],
      rows: [
        ['nhiều', '**many** people · **a lot of** people', '**much** time · **a lot of** time'],
        ['vài / một chút', '**a few** friends', '**a little** milk'],
        ['một ít (khẳng định)', '**some** eggs', '**some** water'],
        ['… nào (phủ định, hỏi)', '**any** questions', '**any** cash'],
        ['bao nhiêu?', '**How many** students…?', '**How much** coffee…?'],
        ['quá nhiều', '**too many** bugs', '**too much** homework'],
      ],
    },
    { t: 'h', text: '3. some / any / no trong câu' },
    {
      t: 'table', head: ['', 'Đồ vật', 'Người', 'Ví dụ'],
      rows: [
        ['Khẳng định', '**something**', '**someone**', '**Someone** is calling you.'],
        ['Phủ định / hỏi', '**anything**', '**anyone**', 'I don\'t know **anyone** here. · Is **anyone** home?'],
        ['Không có gì / ai', '**nothing**', '**no one**', 'There\'s **nothing** in the box.'],
        ['Mọi', '**everything**', '**everyone**', '**Everyone** knows that. (động từ số ít: knows)'],
      ],
    },
    { t: 'note', title: 'Lỗi người Việt hay mắc', items: ['~~many money~~ / ~~many time~~ → **much** money / **a lot of** time', '~~informations~~ · ~~advices~~ · ~~homeworks~~ → information · advice · homework', '~~How much students~~ → **How many** students', '~~I don\'t have some cash~~ → I don\'t have **any** cash', '~~Everyone know~~ → Everyone **knows**'] },
  ],
  tuVung: [
    { w: 'water', loai: 'n (k.đ)', vi: 'nước', anh: 'droplet', ex: 'Can I have some water?', exVi: 'Cho tôi xin chút nước.' },
    { w: 'rice', loai: 'n (k.đ)', vi: 'gạo, cơm', anh: 'cooked-rice', ex: 'We need to buy rice.', exVi: 'Mình cần mua gạo.' },
    { w: 'sugar', loai: 'n (k.đ)', vi: 'đường', anh: 'ai-sugar', ex: 'No sugar, please.', exVi: 'Cho tôi không đường nhé.' },
    { w: 'salt', loai: 'n (k.đ)', vi: 'muối', anh: 'salt', ex: 'Add a little salt.', exVi: 'Thêm một chút muối.' },
    { w: 'egg', loai: 'n', vi: 'quả trứng', anh: 'egg', ex: 'I had two eggs for breakfast.', exVi: 'Bữa sáng tôi ăn hai quả trứng.' },
    { w: 'bread', loai: 'n (k.đ)', vi: 'bánh mì', anh: 'bread', ex: 'This bread is still warm.', exVi: 'Bánh mì này vẫn còn ấm.' },
    { w: 'fruit', loai: 'n (k.đ)', vi: 'trái cây', anh: 'red-apple', ex: 'I eat fruit every day.', exVi: 'Ngày nào tôi cũng ăn trái cây.' },
    { w: 'cash', loai: 'n (k.đ)', vi: 'tiền mặt', anh: 'dollar-banknote', ex: 'Do you take cash?', exVi: 'Ở đây có nhận tiền mặt không?' },
    { w: 'homework', loai: 'n (k.đ)', vi: 'bài tập về nhà', anh: 'memo', ex: 'I have homework tonight.', exVi: 'Tối nay tôi có bài tập về nhà.' },
    { w: 'information', loai: 'n (k.đ)', vi: 'thông tin', anh: 'information', ex: 'Thanks for the information.', exVi: 'Cảm ơn vì thông tin.' },
    { w: 'advice', loai: 'n (k.đ)', vi: 'lời khuyên', anh: 'speech-balloon', ex: 'Can I ask for some advice?', exVi: 'Cho mình xin vài lời khuyên được không?' },
    { w: 'furniture', loai: 'n (k.đ)', vi: 'đồ nội thất', anh: 'chair', ex: 'The room has no furniture.', exVi: 'Căn phòng không có đồ đạc gì.' },
    { w: 'luggage', loai: 'n (k.đ)', vi: 'hành lý', anh: 'luggage', ex: 'How much luggage do you have?', exVi: 'Bạn có bao nhiêu hành lý?' },
    { w: 'news', loai: 'n (k.đ)', vi: 'tin tức', anh: 'newspaper', ex: 'I have good news!', exVi: 'Mình có tin vui!' },
    { w: 'customer', loai: 'n', vi: 'khách hàng', anh: 'shopping-bags', ex: 'The customer is waiting.', exVi: 'Khách đang đợi.' },
    { w: 'traffic', loai: 'n (k.đ)', vi: 'giao thông, kẹt xe', anh: 'vertical-traffic-light', ex: 'There was a lot of traffic.', exVi: 'Đường rất đông xe.' },
  ],
  hoiThoai: {
    tieuDe: 'Đi chợ cho bữa tối với bạn cùng phòng',
    luot: [
      { vai: 'A', ten: 'Tuấn', en: 'Do we have any eggs?', vi: 'Nhà mình còn trứng không?' },
      { vai: 'B', ten: 'Phong', en: 'We have a few, but not many.', vi: 'Còn vài quả, nhưng không nhiều.' },
      { vai: 'A', ten: 'Tuấn', en: 'How much rice do we have?', vi: 'Còn bao nhiêu gạo?' },
      { vai: 'B', ten: 'Phong', en: 'Not much. Let\'s buy some rice and a little fruit.', vi: 'Không nhiều. Mình mua ít gạo với một chút trái cây đi.' },
      { vai: 'A', ten: 'Tuấn', en: 'Okay. Do you have any cash?', vi: 'Ừ. Cậu có tiền mặt không?' },
      { vai: 'B', ten: 'Phong', en: 'No, I don\'t have any. Can we pay by card?', vi: 'Không, mình chẳng có đồng nào. Trả bằng thẻ được không?' },
      { vai: 'A', ten: 'Tuấn', en: 'Sure. There aren\'t many people at the market now.', vi: 'Được. Giờ chợ không đông lắm đâu.' },
    ],
  },
  viet: {
    y: [
      'Trước khi viết một danh từ, tự hỏi: **đếm được không?** Đếm được ⇒ nhớ a/an hoặc -s; không đếm được ⇒ không a, không -s.',
      'Câu khẳng định dùng **some / a lot of**; câu phủ định và câu hỏi đổi sang **any / much / many**.',
      'Danh sách đi chợ viết theo dạng **some + N** hoặc **số + N số nhiều**: some milk · six eggs.',
    ],
    chinhTa: ['~~informations~~ → **information**', '~~vegetable~~ (khi nói chung) → **vegetables**', '~~luggages~~ → **luggage**', '~~a few time~~ → **a little** time'],
    de: 'Bạn mở tiệc sinh nhật nhỏ ở phòng trọ. Viết **5 câu** về những gì đang có và cần mua (dùng some, any, a few, a little, much/many).',
    mau: [
      { en: 'We have some cups, but we don\'t have any plates.', vi: 'Mình có ít cốc nhưng chưa có cái đĩa nào.' },
      { en: 'There\'s a little juice in the fridge.', vi: 'Trong tủ lạnh còn một ít nước ép.' },
      { en: 'We need a few bags of chips.', vi: 'Mình cần vài gói khoai tây chiên.' },
      { en: 'We don\'t have much time, so let\'s buy a cake.', vi: 'Không có nhiều thời gian nên mua bánh kem luôn.' },
      { en: 'How many friends are coming?', vi: 'Có bao nhiêu bạn sẽ đến?' },
    ],
  },
  cau: [
    { id: 'cn19-01', vi: 'Các bạn có câu hỏi nào không?', en: 'Do you have any questions?', alt: ['Are there any questions?', 'Any questions?', 'Does anyone have any questions?'], khung: ANY },
    { id: 'cn19-02', vi: 'Tôi cần một ít nước.', en: 'I need some water.', alt: ['I need a little water.'], khung: SOME },
    { id: 'cn19-03', vi: 'Tôi không có đồng tiền mặt nào.', en: 'I don\'t have any cash.', alt: ['I have no cash.', 'I don\'t have any cash on me.'], khung: ANY, loi: '~~I don\'t have some cash~~ — phủ định dùng any' },
    { id: 'cn19-04', vi: 'Trong tủ lạnh còn một ít sữa.', en: 'There\'s a little milk left in the fridge.', alt: ['There\'s some milk left in the fridge.', 'There\'s a little milk in the fridge.'], khung: FEW, goi: 'còn lại = left' },
    { id: 'cn19-05', vi: 'Lớp bạn có bao nhiêu sinh viên?', en: 'How many students are there in your class?', alt: ['How many students are in your class?', 'How many students does your class have?'], khung: HOW },
    { id: 'cn19-06', vi: 'Mỗi ngày bạn uống bao nhiêu cà phê?', en: 'How much coffee do you drink a day?', alt: ['How much coffee do you drink every day?', 'How much coffee do you drink each day?'], khung: HOW },
    { id: 'cn19-07', vi: 'Tôi không có nhiều thời gian.', en: 'I don\'t have much time.', alt: ['I don\'t have a lot of time.'], khung: MANY, loi: '~~many time~~ → much time' },
    { id: 'cn19-08', vi: 'Ở đây đông người quá.', en: 'There are so many people here.', alt: ['There are a lot of people here.', 'There are lots of people here.'], khung: MANY },
    { id: 'cn19-09', vi: 'Tôi có vài người bạn ở Hà Nội.', en: 'I have a few friends in Hanoi.', alt: ['I have some friends in Hanoi.'], khung: FEW },
    { id: 'cn19-10', vi: 'Bạn có muốn thêm đường không?', en: 'Do you want some more sugar?', alt: ['Do you want more sugar?', 'Would you like some more sugar?'], khung: 'Lời mời: Do you want / Would you like + some …?' },
    { id: 'cn19-11', vi: 'Có ai ở nhà không?', en: 'Is anyone home?', alt: ['Is anybody home?', 'Is anyone at home?', 'Is anybody at home?'], khung: ONE },
    { id: 'cn19-12', vi: 'Có người đang gọi bạn kìa.', en: 'Someone is calling you.', alt: ['Somebody is calling you.'], khung: ONE },
    { id: 'cn19-13', vi: 'Ở đây tôi không quen ai cả.', en: 'I don\'t know anyone here.', alt: ['I don\'t know anybody here.'], khung: ONE },
    { id: 'cn19-14', vi: 'Sáng nay tôi chưa ăn gì.', en: 'I didn\'t eat anything this morning.', alt: ['I didn\'t have anything this morning.', 'I didn\'t eat anything for breakfast.'], khung: ONE },
    { id: 'cn19-15', vi: 'Code này nhiều lỗi quá.', en: 'This code has a lot of bugs.', alt: ['There are a lot of bugs in this code.', 'This code has so many bugs.', 'This code has lots of bugs.'], khung: LOT },
    { id: 'cn19-16', vi: 'Dự án này không có nhiều tài liệu.', en: 'There isn\'t much documentation for this project.', alt: ['This project doesn\'t have much documentation.', 'This project doesn\'t have a lot of documentation.'], khung: MANY, goi: 'documentation không đếm được ⇒ much' },
    { id: 'cn19-17', vi: 'Bạn có cần giúp gì không?', en: 'Do you need any help?', alt: ['Do you need help?', 'Do you need some help?'], khung: ANY },
    { id: 'cn19-18', vi: 'Em có vài câu hỏi về bài tập.', en: 'I have a few questions about the assignment.', alt: ['I have some questions about the assignment.', 'I have a few questions about the homework.'], khung: FEW },
    { id: 'cn19-19', vi: 'Chúng ta còn bao nhiêu thời gian?', en: 'How much time do we have left?', alt: ['How much time is left?', 'How much time do we have?'], khung: HOW },
    { id: 'cn19-20', vi: 'Bạn đã viết bao nhiêu test case?', en: 'How many test cases did you write?', khung: HOW },
    { id: 'cn19-21', vi: 'Còn mấy lỗi chưa xử lý?', en: 'How many bugs are still open?', alt: ['How many open bugs are there?', 'How many bugs are left?'], khung: HOW },
    { id: 'cn19-22', vi: 'Mỗi ngày tôi uống nhiều nước.', en: 'I drink a lot of water every day.', alt: ['I drink lots of water every day.', 'I drink a lot of water each day.'], khung: LOT },
    { id: 'cn19-23', vi: 'Đừng cho nhiều muối quá.', en: 'Don\'t add too much salt.', alt: ['Don\'t put too much salt in it.', 'Don\'t use too much salt.'], khung: 'too much + N không đếm được (quá nhiều)' },
    { id: 'cn19-24', vi: 'Tôi có quá nhiều bài tập về nhà.', en: 'I have too much homework.', alt: ['I\'ve got too much homework.'], khung: 'too much + N không đếm được (quá nhiều)', loi: '~~too many homeworks~~ → too much homework' },
    { id: 'cn19-25', vi: 'Hôm nay không có nhiều khách.', en: 'There aren\'t many customers today.', alt: ['We don\'t have many customers today.', 'There are not a lot of customers today.'], khung: MANY },
    { id: 'cn19-26', vi: 'Tôi nói được một chút tiếng Nhật.', en: 'I can speak a little Japanese.', alt: ['I speak a little Japanese.'], khung: FEW },
    { id: 'cn19-27', vi: 'Gần đây có nhà hàng nào ngon không?', en: 'Are there any good restaurants near here?', alt: ['Are there any good restaurants around here?', 'Are there any good restaurants nearby?'], khung: ANY },
    { id: 'cn19-28', vi: 'Mình mua ít trái cây nhé.', en: 'Let\'s buy some fruit.', alt: ['Let\'s get some fruit.'], khung: SOME, loi: '~~some fruits~~ (nói chung) → some fruit' },
    { id: 'cn19-29', vi: 'Trong hộp chẳng có gì cả.', en: 'There\'s nothing in the box.', alt: ['There isn\'t anything in the box.'], khung: ONE },
    { id: 'cn19-30', vi: 'Tôi cần thêm vài ngày nữa.', en: 'I need a few more days.', alt: ['I need a couple more days.', 'I need a few more days to finish.'], khung: FEW },
    { id: 'cn19-31', vi: 'Mỗi tuần bạn làm bao nhiêu tiếng?', en: 'How many hours do you work a week?', alt: ['How many hours a week do you work?', 'How many hours do you work per week?'], khung: HOW },
    { id: 'cn19-32', vi: 'Bạn có muốn ăn gì không?', en: 'Do you want something to eat?', alt: ['Would you like something to eat?', 'Do you want anything to eat?'], khung: 'something + to V (lời mời dùng something)' },
    { id: 'cn19-33', vi: 'Ai cũng biết chuyện đó.', en: 'Everyone knows that.', alt: ['Everybody knows that.'], khung: 'Everyone + V-s (động từ số ít)', loi: '~~Everyone know~~ → knows' },
    { id: 'cn19-34', vi: 'Tôi tiêu quá nhiều tiền vào đồ ăn.', en: 'I spend too much money on food.', alt: ['I spend a lot of money on food.'], khung: 'spend + much/a lot of money + on + N' },
  ],
};
