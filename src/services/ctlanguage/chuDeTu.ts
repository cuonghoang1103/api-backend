/**
 * CT Language — TỪ VỰNG THEO CHỦ ĐỀ (Đợt C "trang chủ khám phá", 14/11/2026).
 *
 * Kho soạn tay của web (`lang_vocab_categories`) chia theo CẤP (HSK/JLPT/CEFR) chứ không theo chủ đề đời sống, còn từ
 * điển `ctl_tu` không có trường chủ đề ⇒ bộ chủ đề này là NỘI DUNG TĨNH soạn tay: 14 chủ đề × 12 từ × 3 ngôn ngữ, cùng
 * mã chủ đề cho cả ba (đổi ngôn ngữ vẫn giữ chủ đề). Mỗi từ: [chữ, cách đọc, nghĩa Việt].
 *   · zh: giản thể + pinyin có dấu (máy chủ thay bằng pinyin chuẩn của từ điển nếu tìm thấy mục);
 *   · ja: chữ + hiragana (từ katakana ghi lại chính nó);
 *   · en: cách đọc để trống — máy chủ lấy IPA của từ điển (`ctl_tu.doc`) nếu có.
 * Lúc phục vụ (`khamPha.ts › chuDe`), mỗi từ được gắn `id` mục từ điển THẬT (khớp chữ) để app mở trang từ / lưu sổ;
 * không khớp ⇒ id ÂM ổn định (`idAm`), app tự tra lại theo chữ như thẻ của bộ từ có sẵn.
 */

export type NnChuDe = 'en' | 'ja' | 'zh';
export type TuChuDe = readonly [chu: string, doc: string, nghia: string];

export interface ChuDeTu {
  ma: string;
  ten: string;
  /** Tên SF Symbol cho app. */
  bieuTuong: string;
  tu: Record<NnChuDe, readonly TuChuDe[]>;
}

export const CHU_DE_TU: readonly ChuDeTu[] = [
  {
    ma: 'gia-dinh', ten: 'Gia đình', bieuTuong: 'person.3.fill',
    tu: {
      zh: [['爸爸', 'bàba', 'bố'], ['妈妈', 'māma', 'mẹ'], ['哥哥', 'gēge', 'anh trai'], ['姐姐', 'jiějie', 'chị gái'], ['弟弟', 'dìdi', 'em trai'],
        ['妹妹', 'mèimei', 'em gái'], ['爷爷', 'yéye', 'ông nội'], ['奶奶', 'nǎinai', 'bà nội'], ['儿子', 'érzi', 'con trai'], ['女儿', 'nǚ’ér', 'con gái'],
        ['丈夫', 'zhàngfu', 'chồng'], ['妻子', 'qīzi', 'vợ']],
      ja: [['家族', 'かぞく', 'gia đình'], ['父', 'ちち', 'bố (của mình)'], ['母', 'はは', 'mẹ (của mình)'], ['お父さん', 'おとうさん', 'bố (gọi / của người khác)'],
        ['お母さん', 'おかあさん', 'mẹ (gọi / của người khác)'], ['兄', 'あに', 'anh trai (của mình)'], ['姉', 'あね', 'chị gái (của mình)'], ['弟', 'おとうと', 'em trai'],
        ['妹', 'いもうと', 'em gái'], ['夫', 'おっと', 'chồng'], ['妻', 'つま', 'vợ'], ['子ども', 'こども', 'trẻ con, con cái']],
      en: [['family', '', 'gia đình'], ['parents', '', 'bố mẹ'], ['father', '', 'bố'], ['mother', '', 'mẹ'], ['brother', '', 'anh / em trai'],
        ['sister', '', 'chị / em gái'], ['grandparents', '', 'ông bà'], ['husband', '', 'chồng'], ['wife', '', 'vợ'], ['son', '', 'con trai'],
        ['daughter', '', 'con gái'], ['cousin', '', 'anh chị em họ']],
    },
  },
  {
    ma: 'an-uong', ten: 'Ăn uống', bieuTuong: 'fork.knife',
    tu: {
      zh: [['米饭', 'mǐfàn', 'cơm'], ['面条', 'miàntiáo', 'mì sợi'], ['饺子', 'jiǎozi', 'sủi cảo'], ['鸡蛋', 'jīdàn', 'trứng gà'], ['牛肉', 'niúròu', 'thịt bò'],
        ['蔬菜', 'shūcài', 'rau'], ['水果', 'shuǐguǒ', 'hoa quả'], ['咖啡', 'kāfēi', 'cà phê'], ['菜单', 'càidān', 'thực đơn'], ['好吃', 'hǎochī', 'ngon'],
        ['服务员', 'fúwùyuán', 'nhân viên phục vụ'], ['买单', 'mǎidān', 'tính tiền']],
      ja: [['ご飯', 'ごはん', 'cơm, bữa ăn'], ['朝ご飯', 'あさごはん', 'bữa sáng'], ['水', 'みず', 'nước'], ['お茶', 'おちゃ', 'trà'], ['肉', 'にく', 'thịt'],
        ['魚', 'さかな', 'cá'], ['野菜', 'やさい', 'rau'], ['卵', 'たまご', 'trứng'], ['美味しい', 'おいしい', 'ngon'], ['食べる', 'たべる', 'ăn'],
        ['飲む', 'のむ', 'uống'], ['注文', 'ちゅうもん', 'gọi món, đặt hàng']],
      en: [['breakfast', '', 'bữa sáng'], ['lunch', '', 'bữa trưa'], ['dinner', '', 'bữa tối'], ['rice', '', 'cơm, gạo'], ['noodles', '', 'mì'],
        ['vegetable', '', 'rau'], ['delicious', '', 'ngon'], ['menu', '', 'thực đơn'], ['order', '', 'gọi món'], ['bill', '', 'hoá đơn tính tiền'],
        ['spicy', '', 'cay'], ['dessert', '', 'món tráng miệng']],
    },
  },
  {
    ma: 'mua-sam', ten: 'Mua sắm', bieuTuong: 'bag.fill',
    tu: {
      zh: [['商店', 'shāngdiàn', 'cửa hàng'], ['超市', 'chāoshì', 'siêu thị'], ['便宜', 'piányi', 'rẻ'], ['贵', 'guì', 'đắt'], ['打折', 'dǎzhé', 'giảm giá'],
        ['衣服', 'yīfu', 'quần áo'], ['鞋', 'xié', 'giày'], ['多少钱', 'duōshao qián', 'bao nhiêu tiền'], ['付钱', 'fùqián', 'trả tiền'], ['现金', 'xiànjīn', 'tiền mặt'],
        ['试穿', 'shìchuān', 'mặc thử'], ['颜色', 'yánsè', 'màu sắc']],
      ja: [['店', 'みせ', 'cửa hàng'], ['買う', 'かう', 'mua'], ['高い', 'たかい', 'đắt; cao'], ['安い', 'やすい', 'rẻ'], ['円', 'えん', 'yên (tiền Nhật)'],
        ['服', 'ふく', 'quần áo'], ['靴', 'くつ', 'giày'], ['いくら', 'いくら', 'bao nhiêu tiền'], ['割引', 'わりびき', 'giảm giá'], ['袋', 'ふくろ', 'túi'],
        ['試着', 'しちゃく', 'mặc thử'], ['現金', 'げんきん', 'tiền mặt']],
      en: [['shop', '', 'cửa hàng'], ['supermarket', '', 'siêu thị'], ['cheap', '', 'rẻ'], ['expensive', '', 'đắt'], ['discount', '', 'giảm giá'],
        ['price', '', 'giá'], ['receipt', '', 'biên lai'], ['cash', '', 'tiền mặt'], ['size', '', 'kích cỡ'], ['try on', '', 'mặc thử'],
        ['refund', '', 'hoàn tiền'], ['customer', '', 'khách hàng']],
    },
  },
  {
    ma: 'du-lich', ten: 'Du lịch', bieuTuong: 'airplane',
    tu: {
      zh: [['旅游', 'lǚyóu', 'du lịch'], ['护照', 'hùzhào', 'hộ chiếu'], ['签证', 'qiānzhèng', 'thị thực (visa)'], ['机场', 'jīchǎng', 'sân bay'], ['飞机', 'fēijī', 'máy bay'],
        ['酒店', 'jiǔdiàn', 'khách sạn'], ['行李', 'xíngli', 'hành lý'], ['地图', 'dìtú', 'bản đồ'], ['景点', 'jǐngdiǎn', 'điểm tham quan'], ['门票', 'ménpiào', 'vé vào cửa'],
        ['导游', 'dǎoyóu', 'hướng dẫn viên'], ['拍照', 'pāizhào', 'chụp ảnh']],
      ja: [['旅行', 'りょこう', 'du lịch'], ['空港', 'くうこう', 'sân bay'], ['飛行機', 'ひこうき', 'máy bay'], ['ホテル', 'ホテル', 'khách sạn'], ['予約', 'よやく', 'đặt trước'],
        ['荷物', 'にもつ', 'hành lý'], ['パスポート', 'パスポート', 'hộ chiếu'], ['地図', 'ちず', 'bản đồ'], ['観光', 'かんこう', 'tham quan'], ['写真', 'しゃしん', 'ảnh'],
        ['お土産', 'おみやげ', 'quà lưu niệm'], ['切符', 'きっぷ', 'vé (tàu, xe)']],
      en: [['travel', '', 'du lịch'], ['passport', '', 'hộ chiếu'], ['visa', '', 'thị thực'], ['airport', '', 'sân bay'], ['flight', '', 'chuyến bay'],
        ['hotel', '', 'khách sạn'], ['luggage', '', 'hành lý'], ['reservation', '', 'sự đặt chỗ'], ['sightseeing', '', 'tham quan'], ['souvenir', '', 'quà lưu niệm'],
        ['tourist', '', 'khách du lịch'], ['ticket', '', 'vé']],
    },
  },
  {
    ma: 'giao-thong', ten: 'Giao thông', bieuTuong: 'tram.fill',
    tu: {
      zh: [['地铁', 'dìtiě', 'tàu điện ngầm'], ['公交车', 'gōngjiāochē', 'xe buýt'], ['出租车', 'chūzūchē', 'taxi'], ['火车', 'huǒchē', 'tàu hoả'], ['高铁', 'gāotiě', 'tàu cao tốc'],
        ['自行车', 'zìxíngchē', 'xe đạp'], ['车站', 'chēzhàn', 'bến xe, nhà ga'], ['路口', 'lùkǒu', 'ngã tư, giao lộ'], ['左边', 'zuǒbian', 'bên trái'], ['右边', 'yòubian', 'bên phải'],
        ['堵车', 'dǔchē', 'tắc đường'], ['票', 'piào', 'vé']],
      ja: [['電車', 'でんしゃ', 'tàu điện'], ['駅', 'えき', 'nhà ga'], ['地下鉄', 'ちかてつ', 'tàu điện ngầm'], ['バス', 'バス', 'xe buýt'], ['タクシー', 'タクシー', 'taxi'],
        ['自転車', 'じてんしゃ', 'xe đạp'], ['新幹線', 'しんかんせん', 'tàu Shinkansen'], ['乗る', 'のる', 'lên (xe, tàu)'], ['降りる', 'おりる', 'xuống (xe, tàu)'],
        ['乗り換え', 'のりかえ', 'đổi tàu'], ['右', 'みぎ', 'bên phải'], ['左', 'ひだり', 'bên trái']],
      en: [['bus', '', 'xe buýt'], ['train', '', 'tàu hoả'], ['subway', '', 'tàu điện ngầm'], ['taxi', '', 'taxi'], ['bicycle', '', 'xe đạp'],
        ['station', '', 'nhà ga, bến'], ['traffic jam', '', 'tắc đường'], ['crossroads', '', 'ngã tư'], ['turn left', '', 'rẽ trái'], ['turn right', '', 'rẽ phải'],
        ['driver', '', 'tài xế'], ['fare', '', 'giá vé']],
    },
  },
  {
    ma: 'truong-hoc', ten: 'Trường học', bieuTuong: 'graduationcap.fill',
    tu: {
      zh: [['学校', 'xuéxiào', 'trường học'], ['老师', 'lǎoshī', 'giáo viên'], ['学生', 'xuésheng', 'học sinh'], ['同学', 'tóngxué', 'bạn học'], ['教室', 'jiàoshì', 'phòng học'],
        ['作业', 'zuòyè', 'bài tập'], ['考试', 'kǎoshì', 'thi, kiểm tra'], ['课本', 'kèběn', 'sách giáo khoa'], ['图书馆', 'túshūguǎn', 'thư viện'], ['上课', 'shàngkè', 'vào học'],
        ['下课', 'xiàkè', 'tan học'], ['成绩', 'chéngjì', 'điểm số, thành tích']],
      ja: [['学校', 'がっこう', 'trường học'], ['先生', 'せんせい', 'giáo viên'], ['学生', 'がくせい', 'sinh viên, học sinh'], ['教室', 'きょうしつ', 'phòng học'],
        ['宿題', 'しゅくだい', 'bài tập về nhà'], ['試験', 'しけん', 'kỳ thi'], ['勉強', 'べんきょう', 'việc học'], ['図書館', 'としょかん', 'thư viện'],
        ['授業', 'じゅぎょう', 'giờ học, tiết học'], ['教科書', 'きょうかしょ', 'sách giáo khoa'], ['質問', 'しつもん', 'câu hỏi'], ['答え', 'こたえ', 'câu trả lời']],
      en: [['school', '', 'trường học'], ['teacher', '', 'giáo viên'], ['student', '', 'học sinh'], ['classroom', '', 'lớp học'], ['homework', '', 'bài tập về nhà'],
        ['exam', '', 'kỳ thi'], ['textbook', '', 'sách giáo khoa'], ['library', '', 'thư viện'], ['lesson', '', 'bài học'], ['grade', '', 'điểm số'],
        ['subject', '', 'môn học'], ['classmate', '', 'bạn cùng lớp']],
    },
  },
  {
    ma: 'cong-so', ten: 'Công sở', bieuTuong: 'briefcase.fill',
    tu: {
      zh: [['公司', 'gōngsī', 'công ty'], ['工作', 'gōngzuò', 'công việc; làm việc'], ['同事', 'tóngshì', 'đồng nghiệp'], ['经理', 'jīnglǐ', 'quản lý, giám đốc'], ['会议', 'huìyì', 'cuộc họp'],
        ['加班', 'jiābān', 'tăng ca'], ['工资', 'gōngzī', 'tiền lương'], ['面试', 'miànshì', 'phỏng vấn'], ['办公室', 'bàngōngshì', 'văn phòng'], ['合同', 'hétong', 'hợp đồng'],
        ['请假', 'qǐngjià', 'xin nghỉ phép'], ['出差', 'chūchāi', 'đi công tác']],
      ja: [['会社', 'かいしゃ', 'công ty'], ['仕事', 'しごと', 'công việc'], ['会議', 'かいぎ', 'cuộc họp'], ['上司', 'じょうし', 'cấp trên'], ['同僚', 'どうりょう', 'đồng nghiệp'],
        ['残業', 'ざんぎょう', 'làm thêm giờ'], ['給料', 'きゅうりょう', 'tiền lương'], ['面接', 'めんせつ', 'phỏng vấn'], ['名刺', 'めいし', 'danh thiếp'],
        ['出張', 'しゅっちょう', 'đi công tác'], ['休み', 'やすみ', 'ngày nghỉ'], ['報告', 'ほうこく', 'báo cáo']],
      en: [['company', '', 'công ty'], ['office', '', 'văn phòng'], ['colleague', '', 'đồng nghiệp'], ['manager', '', 'quản lý'], ['meeting', '', 'cuộc họp'],
        ['deadline', '', 'hạn chót'], ['salary', '', 'tiền lương'], ['interview', '', 'phỏng vấn'], ['contract', '', 'hợp đồng'], ['overtime', '', 'làm thêm giờ'],
        ['promotion', '', 'sự thăng chức'], ['report', '', 'báo cáo']],
    },
  },
  {
    ma: 'suc-khoe', ten: 'Sức khoẻ', bieuTuong: 'cross.case.fill',
    tu: {
      zh: [['医院', 'yīyuàn', 'bệnh viện'], ['医生', 'yīshēng', 'bác sĩ'], ['护士', 'hùshi', 'y tá'], ['生病', 'shēngbìng', 'bị ốm'], ['发烧', 'fāshāo', 'sốt'],
        ['感冒', 'gǎnmào', 'cảm cúm'], ['头疼', 'tóuténg', 'đau đầu'], ['药', 'yào', 'thuốc'], ['健康', 'jiànkāng', 'khoẻ mạnh'], ['休息', 'xiūxi', 'nghỉ ngơi'],
        ['咳嗽', 'késou', 'ho'], ['运动', 'yùndòng', 'vận động, thể thao']],
      ja: [['病院', 'びょういん', 'bệnh viện'], ['医者', 'いしゃ', 'bác sĩ'], ['薬', 'くすり', 'thuốc'], ['熱', 'ねつ', 'sốt'], ['風邪', 'かぜ', 'cảm lạnh'],
        ['頭', 'あたま', 'cái đầu'], ['痛い', 'いたい', 'đau'], ['元気', 'げんき', 'khoẻ khoắn'], ['病気', 'びょうき', 'bệnh'], ['怪我', 'けが', 'vết thương'],
        ['休む', 'やすむ', 'nghỉ ngơi'], ['咳', 'せき', 'ho']],
      en: [['hospital', '', 'bệnh viện'], ['doctor', '', 'bác sĩ'], ['nurse', '', 'y tá'], ['medicine', '', 'thuốc'], ['fever', '', 'sốt'],
        ['headache', '', 'đau đầu'], ['cough', '', 'ho'], ['healthy', '', 'khoẻ mạnh'], ['exercise', '', 'tập thể dục'], ['rest', '', 'nghỉ ngơi'],
        ['appointment', '', 'lịch hẹn'], ['pharmacy', '', 'hiệu thuốc']],
    },
  },
  {
    ma: 'nha-cua', ten: 'Nhà cửa', bieuTuong: 'house.fill',
    tu: {
      zh: [['房间', 'fángjiān', 'căn phòng'], ['厨房', 'chúfáng', 'nhà bếp'], ['卧室', 'wòshì', 'phòng ngủ'], ['客厅', 'kètīng', 'phòng khách'], ['洗手间', 'xǐshǒujiān', 'nhà vệ sinh'],
        ['桌子', 'zhuōzi', 'cái bàn'], ['椅子', 'yǐzi', 'cái ghế'], ['床', 'chuáng', 'giường'], ['窗户', 'chuānghu', 'cửa sổ'], ['冰箱', 'bīngxiāng', 'tủ lạnh'],
        ['空调', 'kōngtiáo', 'điều hoà'], ['钥匙', 'yàoshi', 'chìa khoá']],
      ja: [['家', 'いえ', 'ngôi nhà'], ['部屋', 'へや', 'căn phòng'], ['台所', 'だいどころ', 'nhà bếp'], ['トイレ', 'トイレ', 'nhà vệ sinh'], ['お風呂', 'おふろ', 'bồn tắm, phòng tắm'],
        ['机', 'つくえ', 'bàn học, bàn làm việc'], ['椅子', 'いす', 'cái ghế'], ['ベッド', 'ベッド', 'giường'], ['窓', 'まど', 'cửa sổ'], ['ドア', 'ドア', 'cửa ra vào'],
        ['冷蔵庫', 'れいぞうこ', 'tủ lạnh'], ['鍵', 'かぎ', 'chìa khoá']],
      en: [['house', '', 'ngôi nhà'], ['bedroom', '', 'phòng ngủ'], ['kitchen', '', 'nhà bếp'], ['bathroom', '', 'phòng tắm'], ['living room', '', 'phòng khách'],
        ['table', '', 'cái bàn'], ['chair', '', 'cái ghế'], ['bed', '', 'giường'], ['window', '', 'cửa sổ'], ['fridge', '', 'tủ lạnh'],
        ['key', '', 'chìa khoá'], ['neighbor', '', 'hàng xóm']],
    },
  },
  {
    ma: 'thoi-tiet', ten: 'Thời tiết', bieuTuong: 'cloud.sun.fill',
    tu: {
      zh: [['天气', 'tiānqì', 'thời tiết'], ['晴天', 'qíngtiān', 'trời nắng'], ['下雨', 'xiàyǔ', 'mưa'], ['下雪', 'xiàxuě', 'tuyết rơi'], ['刮风', 'guāfēng', 'nổi gió'],
        ['热', 'rè', 'nóng'], ['冷', 'lěng', 'lạnh'], ['温度', 'wēndù', 'nhiệt độ'], ['雨伞', 'yǔsǎn', 'ô, dù'], ['春天', 'chūntiān', 'mùa xuân'],
        ['夏天', 'xiàtiān', 'mùa hè'], ['冬天', 'dōngtiān', 'mùa đông']],
      ja: [['天気', 'てんき', 'thời tiết'], ['晴れ', 'はれ', 'trời nắng'], ['雨', 'あめ', 'mưa'], ['雪', 'ゆき', 'tuyết'], ['風', 'かぜ', 'gió'],
        ['暑い', 'あつい', 'nóng (thời tiết)'], ['寒い', 'さむい', 'lạnh (thời tiết)'], ['傘', 'かさ', 'ô, dù'], ['春', 'はる', 'mùa xuân'], ['夏', 'なつ', 'mùa hè'],
        ['秋', 'あき', 'mùa thu'], ['冬', 'ふゆ', 'mùa đông']],
      en: [['weather', '', 'thời tiết'], ['sunny', '', 'nắng'], ['rainy', '', 'mưa'], ['cloudy', '', 'nhiều mây'], ['windy', '', 'có gió'],
        ['hot', '', 'nóng'], ['cold', '', 'lạnh'], ['temperature', '', 'nhiệt độ'], ['umbrella', '', 'ô, dù'], ['spring', '', 'mùa xuân'],
        ['summer', '', 'mùa hè'], ['winter', '', 'mùa đông']],
    },
  },
  {
    ma: 'cam-xuc', ten: 'Cảm xúc', bieuTuong: 'face.smiling',
    tu: {
      zh: [['高兴', 'gāoxìng', 'vui'], ['难过', 'nánguò', 'buồn'], ['生气', 'shēngqì', 'tức giận'], ['害怕', 'hàipà', 'sợ'], ['紧张', 'jǐnzhāng', 'căng thẳng, hồi hộp'],
        ['担心', 'dānxīn', 'lo lắng'], ['累', 'lèi', 'mệt'], ['喜欢', 'xǐhuan', 'thích'], ['爱', 'ài', 'yêu'], ['满意', 'mǎnyì', 'hài lòng'],
        ['失望', 'shīwàng', 'thất vọng'], ['感动', 'gǎndòng', 'cảm động']],
      ja: [['嬉しい', 'うれしい', 'vui mừng'], ['悲しい', 'かなしい', 'buồn'], ['楽しい', 'たのしい', 'vui vẻ'], ['怖い', 'こわい', 'sợ'], ['怒る', 'おこる', 'tức giận'],
        ['寂しい', 'さびしい', 'cô đơn'], ['疲れる', 'つかれる', 'mệt'], ['好き', 'すき', 'thích'], ['嫌い', 'きらい', 'ghét'], ['心配', 'しんぱい', 'lo lắng'],
        ['恥ずかしい', 'はずかしい', 'xấu hổ, ngại'], ['安心', 'あんしん', 'yên tâm']],
      en: [['happy', '', 'vui'], ['sad', '', 'buồn'], ['angry', '', 'tức giận'], ['afraid', '', 'sợ'], ['nervous', '', 'hồi hộp'],
        ['worried', '', 'lo lắng'], ['tired', '', 'mệt'], ['excited', '', 'háo hức'], ['bored', '', 'chán'], ['proud', '', 'tự hào'],
        ['disappointed', '', 'thất vọng'], ['grateful', '', 'biết ơn']],
    },
  },
  {
    ma: 'thoi-gian', ten: 'Thời gian', bieuTuong: 'clock.fill',
    tu: {
      zh: [['今天', 'jīntiān', 'hôm nay'], ['明天', 'míngtiān', 'ngày mai'], ['昨天', 'zuótiān', 'hôm qua'], ['早上', 'zǎoshang', 'buổi sáng'], ['中午', 'zhōngwǔ', 'buổi trưa'],
        ['晚上', 'wǎnshang', 'buổi tối'], ['星期', 'xīngqī', 'tuần; thứ'], ['小时', 'xiǎoshí', 'tiếng (giờ đồng hồ)'], ['分钟', 'fēnzhōng', 'phút'], ['现在', 'xiànzài', 'bây giờ'],
        ['以前', 'yǐqián', 'trước đây'], ['周末', 'zhōumò', 'cuối tuần']],
      ja: [['今日', 'きょう', 'hôm nay'], ['明日', 'あした', 'ngày mai'], ['昨日', 'きのう', 'hôm qua'], ['朝', 'あさ', 'buổi sáng'], ['昼', 'ひる', 'buổi trưa'],
        ['夜', 'よる', 'buổi tối, ban đêm'], ['今', 'いま', 'bây giờ'], ['毎日', 'まいにち', 'mỗi ngày'], ['週末', 'しゅうまつ', 'cuối tuần'], ['時間', 'じかん', 'thời gian'],
        ['午前', 'ごぜん', 'buổi sáng (SA)'], ['午後', 'ごご', 'buổi chiều (CH)']],
      en: [['today', '', 'hôm nay'], ['tomorrow', '', 'ngày mai'], ['yesterday', '', 'hôm qua'], ['morning', '', 'buổi sáng'], ['afternoon', '', 'buổi chiều'],
        ['evening', '', 'buổi tối'], ['week', '', 'tuần'], ['hour', '', 'giờ'], ['minute', '', 'phút'], ['weekend', '', 'cuối tuần'],
        ['always', '', 'luôn luôn'], ['sometimes', '', 'thỉnh thoảng']],
    },
  },
  {
    ma: 'cong-nghe', ten: 'Công nghệ', bieuTuong: 'laptopcomputer',
    tu: {
      zh: [['手机', 'shǒujī', 'điện thoại di động'], ['电脑', 'diànnǎo', 'máy tính'], ['网络', 'wǎngluò', 'mạng'], ['密码', 'mìmǎ', 'mật khẩu'], ['下载', 'xiàzài', 'tải xuống'],
        ['充电', 'chōngdiàn', 'sạc pin'], ['软件', 'ruǎnjiàn', 'phần mềm'], ['视频', 'shìpín', 'video'], ['上网', 'shàngwǎng', 'lên mạng'], ['账号', 'zhànghào', 'tài khoản'],
        ['消息', 'xiāoxi', 'tin nhắn, tin tức'], ['屏幕', 'píngmù', 'màn hình']],
      ja: [['携帯', 'けいたい', 'điện thoại di động'], ['スマホ', 'スマホ', 'điện thoại thông minh'], ['パソコン', 'パソコン', 'máy tính'], ['メール', 'メール', 'email, tin nhắn'],
        ['パスワード', 'パスワード', 'mật khẩu'], ['アプリ', 'アプリ', 'ứng dụng'], ['充電', 'じゅうでん', 'sạc pin'], ['動画', 'どうが', 'video'], ['検索', 'けんさく', 'tìm kiếm'],
        ['画面', 'がめん', 'màn hình'], ['送る', 'おくる', 'gửi'], ['ネット', 'ネット', 'mạng internet']],
      en: [['phone', '', 'điện thoại'], ['computer', '', 'máy tính'], ['internet', '', 'mạng internet'], ['password', '', 'mật khẩu'], ['download', '', 'tải xuống'],
        ['charge', '', 'sạc (pin)'], ['app', '', 'ứng dụng'], ['message', '', 'tin nhắn'], ['account', '', 'tài khoản'], ['screen', '', 'màn hình'],
        ['search', '', 'tìm kiếm'], ['update', '', 'cập nhật']],
    },
  },
  {
    ma: 'so-thich', ten: 'Sở thích', bieuTuong: 'music.note',
    tu: {
      zh: [['爱好', 'àihào', 'sở thích'], ['音乐', 'yīnyuè', 'âm nhạc'], ['唱歌', 'chànggē', 'hát'], ['跳舞', 'tiàowǔ', 'nhảy múa'], ['画画', 'huàhuà', 'vẽ tranh'],
        ['看书', 'kànshū', 'đọc sách'], ['电影', 'diànyǐng', 'phim'], ['游泳', 'yóuyǒng', 'bơi'], ['跑步', 'pǎobù', 'chạy bộ'], ['足球', 'zúqiú', 'bóng đá'],
        ['旅行', 'lǚxíng', 'đi du lịch'], ['做饭', 'zuòfàn', 'nấu cơm']],
      ja: [['趣味', 'しゅみ', 'sở thích'], ['音楽', 'おんがく', 'âm nhạc'], ['映画', 'えいが', 'phim'], ['歌う', 'うたう', 'hát'], ['読書', 'どくしょ', 'đọc sách'],
        ['料理', 'りょうり', 'nấu ăn; món ăn'], ['絵', 'え', 'tranh'], ['泳ぐ', 'およぐ', 'bơi'], ['走る', 'はしる', 'chạy'], ['サッカー', 'サッカー', 'bóng đá'],
        ['ゲーム', 'ゲーム', 'trò chơi điện tử'], ['釣り', 'つり', 'câu cá']],
      en: [['hobby', '', 'sở thích'], ['music', '', 'âm nhạc'], ['movie', '', 'bộ phim'], ['reading', '', 'đọc sách'], ['cooking', '', 'nấu ăn'],
        ['painting', '', 'vẽ tranh'], ['swimming', '', 'bơi lội'], ['running', '', 'chạy bộ'], ['football', '', 'bóng đá'], ['photography', '', 'nhiếp ảnh'],
        ['dancing', '', 'nhảy múa'], ['gardening', '', 'làm vườn']],
    },
  },
];

/** id ÂM ổn định cho từ không có trong từ điển (băm FNV-1a của "nn:chữ") — app tự tra lại theo chữ khi mở. */
export function idAm(nn: string, chu: string): number {
  let h = 0x811c9dc5;
  for (const c of `${nn}:${chu}`) {
    h ^= c.codePointAt(0)!;
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return -(100_000_000 + (h % 800_000_000));
}
