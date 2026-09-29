/**
 * Chữ Hán CỦA LỚP — soạn tay, theo slide/bảng của cô (xem ../SOAN-BAI.md mục "Chữ Hán của lớp").
 *
 * Mỗi chữ: Hán Việt · On (katakana) · Kun (hiragana, `・` tách gốc–đuôi đúng như cô
 * viết: み・ます) · nghĩa · cách nhớ bằng hình · 2–5 từ đi chung (`bang: true` = cô
 * chép trên bảng). Số nét lấy tự động từ KanjiVG, "Bài N" của từ lấy tự động từ
 * chỉ mục (kanjiIndex.ts) — không soạn tay.
 *
 * Tệp này TẢI CHẬM (chỉ khi mở thẻ chữ Hán / bài "Chữ Hán của lớp"), không nằm
 * trong gói của trang. Danh sách chữ từng bài: hanLop.ts.
 */
import type { HanTu } from '@/components/sach-hoc/kanji';

export const HAN_TU: Record<string, HanTu> = {
  /* ── Bài 1 — dự kiến ── */
  '日': {
    hv: 'NHẬT', nghia: 'mặt trời; ngày', en: 'sun / day',
    on: ['ニチ', 'ジツ'], kun: ['ひ', 'か'],
    nho: 'Hình mặt trời vẽ thành ô vuông, nét ngang ở giữa là tia sáng: mặt trời mọc rồi lặn là một NGÀY. {日本|にほん} = gốc (本) của mặt trời — nước Mặt Trời mọc.',
    tu: [
      { w: '{日本|にほん}', ro: 'nihon', vi: 'Nhật Bản' },
      { w: '{毎日|まいにち}', ro: 'mainichi', vi: 'mỗi ngày' },
      { w: '{誕生日|たんじょうび}', ro: 'tanjoubi', vi: 'ngày sinh nhật' },
      { w: '{日曜日|にちようび}', ro: 'nichiyoubi', vi: 'Chủ nhật' },
      { w: '{一日|ついたち}', ro: 'tsuitachi', vi: 'ngày mồng 1 (đọc đặc biệt ついたち; "một ngày" thì đọc いちにち)' },
    ],
  },
  '本': {
    hv: 'BẢN', nghia: 'gốc, cội nguồn; sách', en: 'origin / book',
    on: ['ホン'], kun: ['もと'],
    nho: 'Chữ 木 (cái cây) thêm một vạch ngắn ở dưới chân, chỉ vào GỐC cây. Sách là gốc của hiểu biết nên 本 cũng là "quyển sách".',
    tu: [
      { w: '{日本|にほん}', ro: 'nihon', vi: 'Nhật Bản' },
      { w: '{本|ほん}', ro: 'hon', vi: 'sách' },
      { w: '{本屋|ほんや}', ro: 'hon-ya', vi: 'hiệu sách' },
      { w: '{日本語|にほんご}', ro: 'nihongo', vi: 'tiếng Nhật' },
    ],
  },
  '人': {
    hv: 'NHÂN', nghia: 'người', en: 'person',
    on: ['ジン', 'ニン'], kun: ['ひと'],
    nho: 'Hai nét như hai chân một NGƯỜI đang đứng nhìn nghiêng. Sau tên nước đọc じん: ベトナム{人|じん} = người Việt Nam.',
    tu: [
      { w: '{人|ひと}', ro: 'hito', vi: 'người' },
      { w: '{日本人|にほんじん}', ro: 'nihonjin', vi: 'người Nhật' },
      { w: '{一人|ひとり}', ro: 'hitori', vi: 'một người (đọc đặc biệt ひとり)' },
      { w: '{何人|なんにん}', ro: 'nannin', vi: 'mấy người' },
    ],
  },
  '名': {
    hv: 'DANH', nghia: 'tên', en: 'name',
    on: ['メイ', 'ミョウ'], kun: ['な'],
    nho: 'Trên là 夕 (buổi tối), dưới là 口 (miệng): tối trời không thấy mặt nhau, phải mở miệng gọi TÊN.',
    tu: [
      { w: '{名前|なまえ}', ro: 'namae', vi: 'tên' },
      { w: 'お{名前|なまえ}', ro: 'onamae', vi: 'tên (của người khác, lịch sự)' },
      { w: '{有名|ゆうめい}', ro: 'yuumei', vi: 'nổi tiếng' },
    ],
  },
  '前': {
    hv: 'TIỀN', nghia: 'phía trước; trước (thời gian)', en: 'front / before',
    on: ['ゼン'], kun: ['まえ'],
    nho: 'Bên dưới có con dao (刂) và thân thuyền (月); hai nét trên là mũi thuyền: con thuyền rẽ nước tiến lên PHÍA TRƯỚC.',
    tu: [
      { w: '{名前|なまえ}', ro: 'namae', vi: 'tên' },
      { w: '{前|まえ}', ro: 'mae', vi: 'phía trước; trước' },
      { w: '{午前|ごぜん}', ro: 'gozen', vi: 'buổi sáng, a.m.' },
      { w: '{駅前|えきまえ}', ro: 'ekimae', vi: 'trước nhà ga' },
    ],
  },
  '国': {
    hv: 'QUỐC', nghia: 'nước, quốc gia', en: 'country',
    on: ['コク'], kun: ['くに'],
    nho: 'Khung vuông 囗 là biên giới bao quanh, bên trong là 玉 (ngọc, báu vật): vùng đất có biên giới giữ của báu là một ĐẤT NƯỚC.',
    tu: [
      { w: 'お{国|くに}', ro: 'okuni', vi: 'đất nước (của bạn, lịch sự)' },
      { w: '{中国|ちゅうごく}', ro: 'chuugoku', vi: 'Trung Quốc' },
      { w: '{韓国|かんこく}', ro: 'kankoku', vi: 'Hàn Quốc' },
      { w: '{外国|がいこく}', ro: 'gaikoku', vi: 'nước ngoài' },
    ],
  },
  '学': {
    hv: 'HỌC', nghia: 'học', en: 'study / learning',
    on: ['ガク'], kun: ['まな・びます'],
    nho: 'Dưới mái nhà (冖) có đứa trẻ (子), trên mái ba nét như ánh sáng kiến thức rọi xuống: trẻ ngồi trong nhà HỌC.',
    tu: [
      { w: '{学生|がくせい}', ro: 'gakusei', vi: 'học sinh, sinh viên' },
      { w: '{大学|だいがく}', ro: 'daigaku', vi: 'trường đại học' },
      { w: '{学校|がっこう}', ro: 'gakkou', vi: 'trường học' },
      { w: '{留学生|りゅうがくせい}', ro: 'ryuugakusei', vi: 'du học sinh' },
    ],
  },
  '生': {
    hv: 'SINH', nghia: 'sống; sinh ra', en: 'life / birth',
    on: ['セイ', 'ショウ'], kun: ['い・きます', 'う・まれます'],
    nho: 'Một mầm cây nhú lên khỏi mặt đất (土) với chiếc lá nghiêng bên trái: mầm SỐNG vừa SINH ra.',
    tu: [
      { w: '{学生|がくせい}', ro: 'gakusei', vi: 'học sinh, sinh viên' },
      { w: '{先生|せんせい}', ro: 'sensei', vi: 'thầy / cô giáo' },
      { w: '{誕生日|たんじょうび}', ro: 'tanjoubi', vi: 'sinh nhật' },
      { w: '{留学生|りゅうがくせい}', ro: 'ryuugakusei', vi: 'du học sinh' },
    ],
  },
  '語': {
    hv: 'NGỮ', nghia: 'lời nói, ngôn ngữ', en: 'language / word',
    on: ['ゴ'], kun: ['かた・ります'],
    nho: 'Bên trái 言 (lời nói), bên phải 吾 (ta, tôi): lời TA nói ra là NGÔN NGỮ. Tên nước + 語 = tiếng nước đó.',
    tu: [
      { w: '{日本語|にほんご}', ro: 'nihongo', vi: 'tiếng Nhật' },
      { w: '{英語|えいご}', ro: 'eigo', vi: 'tiếng Anh' },
      { w: 'ベトナム{語|ご}', ro: 'betonamugo', vi: 'tiếng Việt' },
      { w: '{日本語学校|にほんごがっこう}', ro: 'nihongo gakkou', vi: 'trường tiếng Nhật' },
    ],
  },
  '何': {
    hv: 'HÀ', nghia: 'cái gì, gì', en: 'what',
    on: ['カ'], kun: ['なに', 'なん'],
    nho: 'Một người (亻) đứng cạnh chữ 可 (miệng 口 dưới mái móc) như đang há miệng hỏi: "CÁI GÌ vậy?".',
    tu: [
      { w: '{何|なん}ですか', ro: 'nan desu ka', vi: 'là gì vậy?' },
      { w: '{何歳|なんさい}', ro: 'nansai', vi: 'bao nhiêu tuổi' },
      { w: '{何時|なんじ}', ro: 'nanji', vi: 'mấy giờ' },
      { w: '{何|なに}も', ro: 'nani mo', vi: '(không) gì cả' },
    ],
  },
  '私': {
    hv: 'TƯ', nghia: 'tôi; riêng tư', en: 'I / private',
    on: ['シ'], kun: ['わたし'],
    nho: 'Bên trái 禾 (cây lúa), bên phải ム (khuỷu tay ôm vào mình): ôm bó lúa của RIÊNG mình → "TÔI".',
    tu: [
      { w: '{私|わたし}', ro: 'watashi', vi: 'tôi' },
      { w: '{私|わたし}たち', ro: 'watashitachi', vi: 'chúng tôi' },
      { w: '{私|わたし}の{国|くに}', ro: 'watashi no kuni', vi: 'nước tôi' },
    ],
  },
  '会': {
    hv: 'HỘI', nghia: 'gặp; hội họp', en: 'meet / meeting',
    on: ['カイ'], kun: ['あ・います'],
    nho: 'Trên là mái nhà (𠆢), dưới là 云 (mây, lời nói): mọi người tụ dưới một mái nhà để GẶP nhau, HỌP bàn.',
    tu: [
      { w: '{会社|かいしゃ}', ro: 'kaisha', vi: 'công ty' },
      { w: '{会社員|かいしゃいん}', ro: 'kaishain', vi: 'nhân viên công ty' },
      { w: '{会|あ}います', ro: 'aimasu', vi: 'gặp' },
      { w: '{飲|の}み{会|かい}', ro: 'nomikai', vi: 'buổi nhậu, tiệc uống' },
    ],
  },

  /* ── Bài 2 — dự kiến ── */
  '一': {
    hv: 'NHẤT', nghia: 'một', en: 'one',
    on: ['イチ'], kun: ['ひと・つ'],
    nho: 'Một que tính nằm ngang = MỘT.',
    tu: [
      { w: '{一|ひと}つ', ro: 'hitotsu', vi: 'một cái' },
      { w: '{一人|ひとり}', ro: 'hitori', vi: 'một người (đọc đặc biệt ひとり)' },
      { w: '{一万円|いちまんえん}', ro: 'ichiman-en', vi: 'mười nghìn yên (phải có 一: いちまん)' },
      { w: '{一日|ついたち}', ro: 'tsuitachi', vi: 'mồng 1 (đọc đặc biệt; "một ngày" = いちにち)' },
    ],
  },
  '二': {
    hv: 'NHỊ', nghia: 'hai', en: 'two',
    on: ['ニ'], kun: ['ふた・つ'],
    nho: 'Hai que tính nằm ngang = HAI (nét dưới dài hơn).',
    tu: [
      { w: '{二|ふた}つ', ro: 'futatsu', vi: 'hai cái' },
      { w: '{二人|ふたり}', ro: 'futari', vi: 'hai người (đọc đặc biệt ふたり)' },
      { w: '{二十歳|はたち}', ro: 'hatachi', vi: '20 tuổi (đọc đặc biệt はたち)' },
      { w: '{二日|ふつか}', ro: 'futsuka', vi: 'ngày mồng 2; hai ngày' },
    ],
  },
  '三': {
    hv: 'TAM', nghia: 'ba', en: 'three',
    on: ['サン'], kun: ['みっ・つ'],
    nho: 'Ba que tính nằm ngang = BA (nét giữa ngắn nhất).',
    tu: [
      { w: '{三|みっ}つ', ro: 'mittsu', vi: 'ba cái' },
      { w: '{三百|さんびゃく}', ro: 'sanbyaku', vi: '300 (ひゃく → びゃく)' },
      { w: '{三千|さんぜん}', ro: 'sanzen', vi: '3.000 (せん → ぜん)' },
      { w: '{三日|みっか}', ro: 'mikka', vi: 'ngày mồng 3; ba ngày' },
    ],
  },
  '四': {
    hv: 'TỨ', nghia: 'bốn', en: 'four',
    on: ['シ'], kun: ['よん', 'よっ・つ'],
    nho: 'Một khung cửa sổ vuông (囗) có hai chân rèm bên trong: cửa sổ có BỐN cạnh.',
    tu: [
      { w: '{四|よっ}つ', ro: 'yottsu', vi: 'bốn cái' },
      { w: '{四時|よじ}', ro: 'yoji', vi: '4 giờ (KHÔNG đọc よんじ, しじ)' },
      { w: '{四百|よんひゃく}', ro: 'yonhyaku', vi: '400' },
      { w: '{四日|よっか}', ro: 'yokka', vi: 'ngày mồng 4; bốn ngày' },
    ],
  },
  '五': {
    hv: 'NGŨ', nghia: 'năm (số 5)', en: 'five',
    on: ['ゴ'], kun: ['いつ・つ'],
    nho: 'Hai nét ngang trời–đất, ở giữa là một chữ "cái ghế" hai chân: đếm trên bàn tay, ngón thứ NĂM là hết một bàn.',
    tu: [
      { w: '{五|いつ}つ', ro: 'itsutsu', vi: 'năm cái' },
      { w: '{五百円|ごひゃくえん}', ro: 'gohyaku-en', vi: '500 yên' },
      { w: '{五日|いつか}', ro: 'itsuka', vi: 'ngày mồng 5; năm ngày' },
    ],
  },
  '六': {
    hv: 'LỤC', nghia: 'sáu', en: 'six',
    on: ['ロク'], kun: ['むっ・つ'],
    nho: 'Một người đội mũ (亠) dạng hai chân (八) đứng vững: nhìn như con số SÁU đang đứng.',
    tu: [
      { w: '{六|むっ}つ', ro: 'muttsu', vi: 'sáu cái' },
      { w: '{六百|ろっぴゃく}', ro: 'roppyaku', vi: '600 (ろく+ひゃく → ろっぴゃく)' },
      { w: '{六日|むいか}', ro: 'muika', vi: 'ngày mồng 6; sáu ngày' },
    ],
  },
  '七': {
    hv: 'THẤT', nghia: 'bảy', en: 'seven',
    on: ['シチ'], kun: ['なな', 'なな・つ'],
    nho: 'Giống số 7 lộn ngược: một nét ngang bị nét móc chặt ngang, đuôi cong lên như chữ số BẢY.',
    tu: [
      { w: '{七|なな}つ', ro: 'nanatsu', vi: 'bảy cái' },
      { w: '{七時|しちじ}', ro: 'shichiji', vi: '7 giờ' },
      { w: '{七百|ななひゃく}', ro: 'nanahyaku', vi: '700' },
      { w: '{七日|なのか}', ro: 'nanoka', vi: 'ngày mồng 7; bảy ngày' },
    ],
  },
  '八': {
    hv: 'BÁT', nghia: 'tám', en: 'eight',
    on: ['ハチ'], kun: ['やっ・つ'],
    nho: 'Hai nét tách ra hai bên như ngọn núi xoè chân — nhìn như số 8 bị chẻ đôi: TÁM.',
    tu: [
      { w: '{八|やっ}つ', ro: 'yattsu', vi: 'tám cái' },
      { w: '{八百|はっぴゃく}', ro: 'happyaku', vi: '800 (はち+ひゃく → はっぴゃく)' },
      { w: '{八千|はっせん}', ro: 'hassen', vi: '8.000' },
      { w: '{八日|ようか}', ro: 'youka', vi: 'ngày mồng 8; tám ngày' },
    ],
  },
  '九': {
    hv: 'CỬU', nghia: 'chín', en: 'nine',
    on: ['キュウ', 'ク'], kun: ['ここの・つ'],
    nho: 'Một cánh tay co lại (丿) và nét móc cong như số 9 viết nghiêng: CHÍN.',
    tu: [
      { w: '{九|ここの}つ', ro: 'kokonotsu', vi: 'chín cái' },
      { w: '{九時|くじ}', ro: 'kuji', vi: '9 giờ (KHÔNG đọc きゅうじ)' },
      { w: '{九百|きゅうひゃく}', ro: 'kyuuhyaku', vi: '900' },
      { w: '{九日|ここのか}', ro: 'kokonoka', vi: 'ngày mồng 9; chín ngày' },
    ],
  },
  '十': {
    hv: 'THẬP', nghia: 'mười', en: 'ten',
    on: ['ジュウ'], kun: ['とお'],
    nho: 'Dấu cộng: một ngang một dọc, đủ MƯỜI ngón tay đan chéo nhau.',
    tu: [
      { w: '{十|とお}', ro: 'too', vi: 'mười cái' },
      { w: '{十円|じゅうえん}', ro: 'juu-en', vi: '10 yên' },
      { w: '{十日|とおか}', ro: 'tooka', vi: 'ngày mồng 10; mười ngày' },
      { w: '{二十歳|はたち}', ro: 'hatachi', vi: '20 tuổi (đọc đặc biệt はたち)' },
    ],
  },
  '百': {
    hv: 'BÁCH', nghia: 'một trăm', en: 'hundred',
    on: ['ヒャク'], kun: [],
    nho: 'Nét 一 (một) đặt trên chữ 白 (trắng): "một" bó tiền trắng = MỘT TRĂM.',
    tu: [
      { w: '{百円|ひゃくえん}', ro: 'hyaku-en', vi: '100 yên' },
      { w: '{三百|さんびゃく}', ro: 'sanbyaku', vi: '300 (biến âm びゃく)' },
      { w: '{六百|ろっぴゃく}', ro: 'roppyaku', vi: '600 (biến âm ぴゃく)' },
      { w: '{八百|はっぴゃく}', ro: 'happyaku', vi: '800 (biến âm ぴゃく)' },
    ],
  },
  '千': {
    hv: 'THIÊN', nghia: 'một nghìn', en: 'thousand',
    on: ['セン'], kun: ['ち'],
    nho: 'Chữ 十 (mười) có thêm nét phẩy như chiếc mũ nghiêng bên trên: mười lần một trăm = một NGHÌN.',
    tu: [
      { w: '{千円|せんえん}', ro: 'sen-en', vi: '1.000 yên' },
      { w: '{三千|さんぜん}', ro: 'sanzen', vi: '3.000 (biến âm ぜん)' },
      { w: '{八千|はっせん}', ro: 'hassen', vi: '8.000' },
    ],
  },
  '万': {
    hv: 'VẠN', nghia: 'mười nghìn, vạn', en: 'ten thousand',
    on: ['マン', 'バン'], kun: [],
    nho: 'Nét ngang trên cùng với móc cong như chiếc lưỡi câu kéo cả VẠN con cá. Người Nhật đếm tiền theo vạn: 1万 = 10.000.',
    tu: [
      { w: '{一万円|いちまんえん}', ro: 'ichiman-en', vi: '10.000 yên' },
      { w: '{十万|じゅうまん}', ro: 'juuman', vi: '100.000 (mười vạn)' },
      { w: '{百万|ひゃくまん}', ro: 'hyakuman', vi: '1.000.000 (một triệu)' },
    ],
  },
  '円': {
    hv: 'VIÊN', nghia: 'yên (tiền Nhật); tròn', en: 'yen / circle',
    on: ['エン'], kun: ['まる・い'],
    nho: 'Khung như khung cửa có vạch bên trong — nhìn như một đồng xu có lỗ: đồng YÊN.',
    tu: [
      { w: '{円|えん}', ro: 'en', vi: 'yên (tiền Nhật)' },
      { w: '{百円|ひゃくえん}', ro: 'hyaku-en', vi: '100 yên' },
      { w: '{千円|せんえん}', ro: 'sen-en', vi: '1.000 yên' },
      { w: '100{円|えん}ショップ', ro: 'hyaku-en shoppu', vi: 'cửa hàng đồng giá 100 yên' },
    ],
  },

  /* ── Bài 3 — dự kiến ── */
  '時': {
    hv: 'THỜI', nghia: 'thời gian; giờ', en: 'time / o\'clock',
    on: ['ジ'], kun: ['とき'],
    nho: 'Bên trái 日 (mặt trời), bên phải 寺 (ngôi chùa): chùa đánh chuông báo GIỜ theo mặt trời.',
    tu: [
      { w: '～{時|じ}', ro: '~ji', vi: '~ giờ' },
      { w: '{何時|なんじ}', ro: 'nanji', vi: 'mấy giờ' },
      { w: '{時間|じかん}', ro: 'jikan', vi: 'thời gian; ~ tiếng' },
      { w: '{時計|とけい}', ro: 'tokei', vi: 'đồng hồ (đọc đặc biệt とけい)' },
    ],
  },
  '分': {
    hv: 'PHÂN', nghia: 'phút; chia ra', en: 'minute / divide',
    on: ['フン', 'ブン'], kun: ['わ・かります'],
    nho: 'Trên là 八 (tách đôi), dưới là 刀 (con dao): dùng dao CHIA ra — một giờ chia nhỏ thành PHÚT; chia rõ ràng thì HIỂU (分かります).',
    tu: [
      { w: '～{分|ふん}', ro: '~fun / ~pun', vi: '~ phút (1,3,4,6,8,10 đọc ぷん)' },
      { w: '{十分|じゅっぷん}', ro: 'juppun', vi: '10 phút' },
      { w: '{半分|はんぶん}', ro: 'hanbun', vi: 'một nửa' },
      { w: '{分|わ}かります', ro: 'wakarimasu', vi: 'hiểu' },
    ],
  },
  '半': {
    hv: 'BÁN', nghia: 'một nửa, rưỡi', en: 'half',
    on: ['ハン'], kun: ['なか・ば'],
    nho: 'Hai nét chấm trên và một nét dọc chẻ thẳng xuống chính giữa: chia đôi thành hai NỬA.',
    tu: [
      { w: '～{時半|じはん}', ro: '~ji han', vi: '~ giờ rưỡi' },
      { w: '{半分|はんぶん}', ro: 'hanbun', vi: 'một nửa' },
      { w: '～{時間半|じかんはん}', ro: '~jikan han', vi: '~ tiếng rưỡi' },
    ],
  },
  '今': {
    hv: 'KIM', nghia: 'bây giờ, nay', en: 'now',
    on: ['コン'], kun: ['いま'],
    nho: 'Mái nhà (𠆢) che trên một mũi tên nhỏ chỉ xuống: "ngay dưới mái này, BÂY GIỜ".',
    tu: [
      { w: '{今|いま}', ro: 'ima', vi: 'bây giờ' },
      { w: '{今日|きょう}', ro: 'kyou', vi: 'hôm nay (đọc đặc biệt きょう)' },
      { w: '{今週|こんしゅう}', ro: 'konshuu', vi: 'tuần này' },
      { w: '{今晩|こんばん}', ro: 'konban', vi: 'tối nay' },
    ],
  },
  '月': {
    hv: 'NGUYỆT', nghia: 'mặt trăng; tháng', en: 'moon / month',
    on: ['ゲツ', 'ガツ'], kun: ['つき'],
    nho: 'Hình vầng trăng khuyết đứng thẳng, có hai vệt mây ngang: mặt TRĂNG tròn khuyết một lần là một THÁNG.',
    tu: [
      { w: '{月曜日|げつようび}', ro: 'getsuyoubi', vi: 'thứ Hai' },
      { w: '～{月|がつ}', ro: '~gatsu', vi: 'tháng ~ (5{月|がつ} = tháng 5)' },
      { w: '{今月|こんげつ}', ro: 'kongetsu', vi: 'tháng này' },
      { w: '{月|つき}', ro: 'tsuki', vi: 'mặt trăng' },
    ],
  },
  '火': {
    hv: 'HOẢ', nghia: 'lửa', en: 'fire',
    on: ['カ'], kun: ['ひ'],
    nho: 'Một ngọn LỬA bùng lên ở giữa, hai đốm lửa bắn ra hai bên.',
    tu: [
      { w: '{火曜日|かようび}', ro: 'kayoubi', vi: 'thứ Ba' },
      { w: '{花火|はなび}', ro: 'hanabi', vi: 'pháo hoa (hoa lửa)' },
      { w: '{火|ひ}', ro: 'hi', vi: 'lửa' },
    ],
  },
  '水': {
    hv: 'THUỶ', nghia: 'nước', en: 'water',
    on: ['スイ'], kun: ['みず'],
    nho: 'Nét móc ở giữa là dòng chảy chính, các nét hai bên là tia NƯỚC bắn ra.',
    tu: [
      { w: '{水|みず}', ro: 'mizu', vi: 'nước' },
      { w: '{水曜日|すいようび}', ro: 'suiyoubi', vi: 'thứ Tư' },
      { w: '{水泳|すいえい}', ro: 'suiei', vi: 'bơi lội' },
    ],
  },
  '木': {
    hv: 'MỘC', nghia: 'cây, gỗ', en: 'tree / wood',
    on: ['モク', 'ボク'], kun: ['き'],
    nho: 'Hình một CÂY: nét ngang là cành, nét dọc là thân, hai nét xiên dưới là rễ.',
    tu: [
      { w: '{木曜日|もくようび}', ro: 'mokuyoubi', vi: 'thứ Năm' },
      { w: '{木|き}', ro: 'ki', vi: 'cây' },
    ],
  },
  '金': {
    hv: 'KIM', nghia: 'vàng, kim loại; tiền', en: 'gold / money',
    on: ['キン'], kun: ['かね'],
    nho: 'Dưới mái nhà (𠆢) là đất (土) có hai hạt lấp lánh: VÀNG vùi trong đất — vàng là TIỀN.',
    tu: [
      { w: '{金曜日|きんようび}', ro: 'kin\'youbi', vi: 'thứ Sáu' },
      { w: 'お{金|かね}', ro: 'okane', vi: 'tiền' },
    ],
  },
  '土': {
    hv: 'THỔ', nghia: 'đất', en: 'earth / soil',
    on: ['ド'], kun: ['つち'],
    nho: 'Một mầm cây (十) mọc lên từ mặt ĐẤT (nét ngang dài phía dưới). Đừng nhầm với 士 (nét trên dài hơn).',
    tu: [
      { w: '{土曜日|どようび}', ro: 'doyoubi', vi: 'thứ Bảy' },
      { w: '{土|つち}', ro: 'tsuchi', vi: 'đất' },
    ],
  },
  '曜': {
    hv: 'DIỆU', nghia: 'ngày trong tuần', en: 'weekday',
    on: ['ヨウ'], kun: [],
    nho: 'Bên trái 日 (mặt trời), bên phải hai cánh chim (羽) trên con chim (隹): mặt trời lướt qua như chim bay, mỗi lượt là một NGÀY TRONG TUẦN. Chữ nhiều nét — chỉ cần nhận mặt.',
    tu: [
      { w: '～{曜日|ようび}', ro: '~youbi', vi: 'thứ ~' },
      { w: '{何曜日|なんようび}', ro: 'nan\'youbi', vi: 'thứ mấy' },
      { w: '{日曜日|にちようび}', ro: 'nichiyoubi', vi: 'Chủ nhật' },
    ],
  },
  '朝': {
    hv: 'TRIÊU', nghia: 'buổi sáng', en: 'morning',
    on: ['チョウ'], kun: ['あさ'],
    nho: 'Bên trái: mặt trời (日) mọc giữa đám cỏ (十 trên và dưới); bên phải: mặt trăng (月) còn chưa lặn — trời vừa BUỔI SÁNG.',
    tu: [
      { w: '{朝|あさ}', ro: 'asa', vi: 'buổi sáng' },
      { w: '{毎朝|まいあさ}', ro: 'maiasa', vi: 'mỗi sáng' },
      { w: '{朝|あさ}ご{飯|はん}', ro: 'asagohan', vi: 'bữa sáng' },
      { w: '{今朝|けさ}', ro: 'kesa', vi: 'sáng nay (đọc đặc biệt けさ)' },
    ],
  },

  /* ── Bài 4 — dự kiến ── */
  '山': {
    hv: 'SƠN', nghia: 'núi', en: 'mountain',
    on: ['サン'], kun: ['やま'],
    nho: 'Ba đỉnh NÚI, đỉnh giữa cao nhất.',
    tu: [
      { w: '{山|やま}', ro: 'yama', vi: 'núi' },
      { w: '{富士山|ふじさん}', ro: 'fujisan', vi: 'núi Phú Sĩ' },
      { w: '{火山|かざん}', ro: 'kazan', vi: 'núi lửa' },
    ],
  },
  '川': {
    hv: 'XUYÊN', nghia: 'sông', en: 'river',
    on: ['セン'], kun: ['かわ'],
    nho: 'Ba dòng nước chảy song song từ trên xuống: dòng SÔNG.',
    tu: [
      { w: '{川|かわ}', ro: 'kawa', vi: 'sông' },
      { w: '{小川|おがわ}', ro: 'ogawa', vi: 'con suối, sông nhỏ' },
      { w: '{山|やま}と{川|かわ}', ro: 'yama to kawa', vi: 'núi và sông' },
    ],
  },
  '町': {
    hv: 'ĐINH', nghia: 'thị trấn, khu phố', en: 'town',
    on: ['チョウ'], kun: ['まち'],
    nho: 'Bên trái 田 (ruộng), bên phải 丁 (cái đinh, con đường thẳng): ruộng đồng có đường cắm mốc ngay ngắn thành THỊ TRẤN.',
    tu: [
      { w: '{町|まち}', ro: 'machi', vi: 'thị trấn, thành phố' },
      { w: '{私|わたし}の{町|まち}', ro: 'watashi no machi', vi: 'thành phố của tôi' },
      { w: '{下町|したまち}', ro: 'shitamachi', vi: 'khu phố cổ bình dân' },
    ],
  },
  '駅': {
    hv: 'DỊCH', nghia: 'nhà ga', en: 'station',
    on: ['エキ'], kun: [],
    nho: 'Bên trái 馬 (con ngựa): ngày xưa trạm đổi NGỰA là "ga"; nay 駅 là NHÀ GA tàu điện.',
    tu: [
      { w: '{駅|えき}', ro: 'eki', vi: 'nhà ga' },
      { w: '{駅前|えきまえ}', ro: 'ekimae', vi: 'trước nhà ga' },
      { w: '{東京駅|とうきょうえき}', ro: 'toukyou eki', vi: 'ga Tokyo' },
    ],
  },
  '東': {
    hv: 'ĐÔNG', nghia: 'phía đông', en: 'east',
    on: ['トウ'], kun: ['ひがし'],
    nho: 'Mặt trời (日) mọc lên sau thân cây (木): hướng mặt trời mọc là phía ĐÔNG.',
    tu: [
      { w: '{東|ひがし}', ro: 'higashi', vi: 'phía đông' },
      { w: '{東京|とうきょう}', ro: 'toukyou', vi: 'Tokyo (kinh đô phía đông)' },
      { w: '{東北|とうほく}', ro: 'touhoku', vi: 'vùng Đông Bắc (Nhật)' },
    ],
  },
  '西': {
    hv: 'TÂY', nghia: 'phía tây', en: 'west',
    on: ['セイ', 'サイ'], kun: ['にし'],
    nho: 'Hình tổ chim có mái che: chiều tối, mặt trời lặn phía TÂY là lúc chim về tổ.',
    tu: [
      { w: '{西|にし}', ro: 'nishi', vi: 'phía tây' },
      { w: '{関西|かんさい}', ro: 'kansai', vi: 'vùng Kansai (Osaka, Kyoto)' },
      { w: '{西口|にしぐち}', ro: 'nishiguchi', vi: 'cửa tây (nhà ga)' },
    ],
  },
  '南': {
    hv: 'NAM', nghia: 'phía nam', en: 'south',
    on: ['ナン'], kun: ['みなみ'],
    nho: 'Hình căn lều (冂) có mái 十 ở trên, bên trong là những mầm cây non (丷, 干) mọc lên: phía NAM ấm áp cây cối mọc um tùm.',
    tu: [
      { w: '{南|みなみ}', ro: 'minami', vi: 'phía nam' },
      { w: '{東南|とうなん}アジア', ro: 'tounan ajia', vi: 'Đông Nam Á' },
    ],
  },
  '北': {
    hv: 'BẮC', nghia: 'phía bắc', en: 'north',
    on: ['ホク'], kun: ['きた'],
    nho: 'Hai người ngồi QUAY LƯNG vào nhau: quay lưng về phía mặt trời, trước mặt là phía BẮC lạnh giá.',
    tu: [
      { w: '{北|きた}', ro: 'kita', vi: 'phía bắc' },
      { w: '{東北|とうほく}', ro: 'touhoku', vi: 'vùng Đông Bắc' },
      { w: '{北海道|ほっかいどう}', ro: 'hokkaidou', vi: 'Hokkaido' },
    ],
  },
  '大': {
    hv: 'ĐẠI', nghia: 'to, lớn', en: 'big',
    on: ['ダイ', 'タイ'], kun: ['おお・きい'],
    nho: 'Một người (人) dang rộng hai tay (一) hết cỡ: "TO thế này này!".',
    tu: [
      { w: '{大|おお}きい', ro: 'ookii', vi: 'to, lớn' },
      { w: '{大学|だいがく}', ro: 'daigaku', vi: 'trường đại học' },
      { w: '{大変|たいへん}', ro: 'taihen', vi: 'vất vả' },
    ],
  },
  '小': {
    hv: 'TIỂU', nghia: 'nhỏ', en: 'small',
    on: ['ショウ'], kun: ['ちい・さい'],
    nho: 'Một nét dọc ở giữa, hai hạt nhỏ hai bên: vật bị chia thành mảnh NHỎ.',
    tu: [
      { w: '{小|ちい}さい', ro: 'chiisai', vi: 'nhỏ' },
      { w: '{小学校|しょうがっこう}', ro: 'shougakkou', vi: 'trường tiểu học' },
      { w: '{小川|おがわ}', ro: 'ogawa', vi: 'con suối nhỏ' },
    ],
  },
  '高': {
    hv: 'CAO', nghia: 'cao; đắt', en: 'tall / expensive',
    on: ['コウ'], kun: ['たか・い'],
    nho: 'Hình một toà tháp nhiều tầng: mái nhọn trên cùng, cửa sổ (口) và cổng (冋) bên dưới — toà nhà CAO.',
    tu: [
      { w: '{高|たか}い', ro: 'takai', vi: 'cao; đắt' },
      { w: '{高校|こうこう}', ro: 'koukou', vi: 'trường cấp 3' },
      { w: '{富士山|ふじさん}は{高|たか}いです', ro: 'fujisan wa takai desu', vi: 'núi Phú Sĩ cao' },
    ],
  },
  '新': {
    hv: 'TÂN', nghia: 'mới', en: 'new',
    on: ['シン'], kun: ['あたら・しい'],
    nho: 'Bên trái 立 (đứng) + 木 (cây), bên phải 斤 (cái rìu): chặt cây đang đứng lấy gỗ MỚI.',
    tu: [
      { w: '{新|あたら}しい', ro: 'atarashii', vi: 'mới' },
      { w: '{新聞|しんぶん}', ro: 'shinbun', vi: 'báo (tin mới)' },
      { w: '{新幹線|しんかんせん}', ro: 'shinkansen', vi: 'tàu cao tốc Shinkansen' },
    ],
  },
  /* ── Bài 5 — đúng 12 chữ trên slide của cô ─────────────────────────── */
  '先': {
    hv: 'TIÊN', nghia: 'trước, đi trước', en: 'previous / ahead',
    on: ['セン'], kun: ['さき'],
    nho: 'Phía trên là một bàn chân (⺧) bước ra, phía dưới là đôi chân người (儿): chân bước lên TRƯỚC người khác → "trước". Người đi trước mình là {先生|せんせい} (thầy cô).',
    tu: [
      { w: '{先週|せんしゅう}', ro: 'senshuu', vi: 'tuần trước' },
      { w: '{先月|せんげつ}', ro: 'sengetsu', vi: 'tháng trước' },
      { w: '{先生|せんせい}', ro: 'sensei', vi: 'thầy / cô giáo' },
      { w: '{先|さき}', ro: 'saki', vi: 'phía trước; trước (お{先|さき}に = xin phép đi trước)' },
    ],
  },
  '週': {
    hv: 'CHU', nghia: 'tuần', en: 'week',
    on: ['シュウ'], kun: [],
    nho: 'Bộ 辶 (con đường, đi) + 周 (vòng quanh): đi hết MỘT VÒNG bảy ngày → một tuần.',
    tu: [
      { w: '{週末|しゅうまつ}', ro: 'shuumatsu', vi: 'cuối tuần' },
      { w: '{先週|せんしゅう}', ro: 'senshuu', vi: 'tuần trước' },
      { w: '{今週|こんしゅう}', ro: 'konshuu', vi: 'tuần này' },
      { w: '{来週|らいしゅう}', ro: 'raishuu', vi: 'tuần sau' },
      { w: '{毎週|まいしゅう}', ro: 'maishuu', vi: 'hằng tuần' },
    ],
  },
  '毎': {
    hv: 'MỖI', nghia: 'mỗi, hằng (ngày, tuần…)', en: 'every',
    on: ['マイ'], kun: [],
    nho: 'Trên là chiếc nón (𠂉), dưới là chữ 母 (mẹ): MỖI sáng mẹ đội nón ra chợ — ngày nào cũng thế.',
    tu: [
      { w: '{毎日|まいにち}', ro: 'mainichi', vi: 'mỗi ngày' },
      { w: '{毎朝|まいあさ}', ro: 'maiasa', vi: 'mỗi sáng' },
      { w: '{毎晩|まいばん}', ro: 'maiban', vi: 'mỗi tối' },
      { w: '{毎週|まいしゅう}', ro: 'maishuu', vi: 'hằng tuần' },
      { w: '{毎年|まいとし}', ro: 'maitoshi', vi: 'hằng năm (cũng đọc まいねん)' },
    ],
  },
  '午': {
    hv: 'NGỌ', nghia: 'giờ Ngọ, giữa trưa', en: 'noon',
    on: ['ゴ'], kun: [],
    nho: 'Giống chữ 牛 (con bò) nhưng KHÔNG lòi đầu lên: giữa trưa nắng gắt, bóng cây cột đứng thẳng, không nhô ra chút nào. Mốc giữa trưa chia ngày làm {午前|ごぜん} (trước trưa) và {午後|ごご} (sau trưa).',
    tu: [
      { w: '{午前|ごぜん}', ro: 'gozen', vi: 'buổi sáng, a.m. (trước 12 giờ trưa)' },
      { w: '{午後|ごご}', ro: 'gogo', vi: 'buổi chiều, p.m.', bang: true },
    ],
  },
  '後': {
    hv: 'HẬU', nghia: 'sau, phía sau', en: 'back / after',
    on: ['ゴ', 'コウ'], kun: ['あと', 'うし・ろ'],
    nho: 'Bên trái 彳 là người đang bước đi; bên phải là sợi chỉ nhỏ (幺) và bàn chân lê chậm (夂): người đi chậm, bị kéo lại ở PHÍA SAU.',
    tu: [
      { w: '{後|うし}ろ', ro: 'ushiro', vi: 'phía sau (vị trí)', bang: true },
      { w: '{午後|ごご}', ro: 'gogo', vi: 'buổi chiều', bang: true },
      { w: '{後|あと}で', ro: 'ato de', vi: 'lát nữa, sau đó' },
      { w: '{休|やす}みの{後|あと}で', ro: 'yasumi no ato de', vi: 'sau kỳ nghỉ (tên phần 2 của Bài 5)' },
    ],
  },
  '見': {
    hv: 'KIẾN', nghia: 'nhìn, xem', en: 'see / look',
    on: ['ケン'], kun: ['み・ます'],
    nho: 'Con mắt to (目) mọc thêm đôi chân (儿): mắt đi khắp nơi để NHÌN.',
    tu: [
      { w: '{見|み}ます', ro: 'mimasu', vi: 'xem, nhìn', bang: true },
      { w: '{見学|けんがく}', ro: 'kengaku', vi: 'tham quan học tập', bang: true },
      { w: '{花見|はなみ}', ro: 'hanami', vi: 'ngắm hoa (anh đào)' },
      { w: '{見|み}せます', ro: 'misemasu', vi: 'cho xem' },
    ],
  },
  '食': {
    hv: 'THỰC', nghia: 'ăn, đồ ăn', en: 'eat / food',
    on: ['ショク'], kun: ['た・べます'],
    nho: 'Mái nhà (人) che bên trên một bát cơm ngon (良): dưới mái nhà có đồ ĂN.',
    tu: [
      { w: '{食|た}べます', ro: 'tabemasu', vi: 'ăn', bang: true },
      { w: '{食事|しょくじ}', ro: 'shokuji', vi: 'bữa ăn; dùng bữa', bang: true },
      { w: '{食|た}べ{物|もの}', ro: 'tabemono', vi: 'đồ ăn' },
      { w: '{食堂|しょくどう}', ro: 'shokudou', vi: 'nhà ăn, căng tin' },
    ],
  },
  '飲': {
    hv: 'ẨM', nghia: 'uống', en: 'drink',
    on: ['イン'], kun: ['の・みます'],
    nho: 'Bên trái là 食 (ăn) thu nhỏ, bên phải là 欠 (người há miệng thật to): há miệng để UỐNG.',
    tu: [
      { w: '{飲|の}みます', ro: 'nomimasu', vi: 'uống', bang: true },
      { w: '{飲食|いんしょく}', ro: 'inshoku', vi: 'ăn uống (飲食店 = quán ăn uống)', bang: true },
      { w: '{飲|の}み{物|もの}', ro: 'nomimono', vi: 'đồ uống' },
      { w: '{飲|の}み{会|かい}', ro: 'nomikai', vi: 'buổi nhậu, tiệc uống' },
    ],
  },
  '買': {
    hv: 'MÃI', nghia: 'mua', en: 'buy',
    on: ['バイ'], kun: ['か・います'],
    nho: 'Trên là cái lưới (罒), dưới là vỏ sò (貝) — thời xưa vỏ sò là TIỀN: cầm lưới đựng tiền đi MUA. Đừng nhầm với 貝 (sò) đứng một mình.',
    tu: [
      { w: '{買|か}います', ro: 'kaimasu', vi: 'mua', bang: true },
      { w: '{買|か}い{物|もの}', ro: 'kaimono', vi: 'việc mua sắm (買い物します = đi mua sắm)' },
      { w: '{売買|ばいばい}', ro: 'baibai', vi: 'mua bán' },
    ],
  },
  '物': {
    hv: 'VẬT', nghia: 'đồ vật, thứ', en: 'thing',
    on: ['ブツ', 'モツ'], kun: ['もの'],
    nho: 'Bên trái là 牛 (con bò) — tài sản quý nhất nhà nông; bên phải 勿 là những lá cờ phấp phới: con bò và mọi ĐỒ VẬT trong nhà.',
    tu: [
      { w: '{物|もの}', ro: 'mono', vi: 'đồ, vật' },
      { w: '{買|か}い{物|もの}', ro: 'kaimono', vi: 'mua sắm' },
      { w: '{飲|の}み{物|もの}', ro: 'nomimono', vi: 'đồ uống' },
      { w: '{荷物|にもつ}', ro: 'nimotsu', vi: 'hành lý, đồ đạc' },
      { w: '{動物|どうぶつ}', ro: 'doubutsu', vi: 'động vật' },
    ],
  },
  '行': {
    hv: 'HÀNH', nghia: 'đi; dòng, hàng', en: 'go',
    on: ['コウ', 'ギョウ'], kun: ['い・きます'],
    nho: 'Nhìn như một NGÃ TƯ ĐƯỜNG nhìn từ trên cao: 彳 (bước chân trái) + 亍 (bước chân phải) → bước đi trên đường.',
    tu: [
      { w: '{行|い}きます', ro: 'ikimasu', vi: 'đi' },
      { w: '{銀行|ぎんこう}', ro: 'ginkou', vi: 'ngân hàng' },
      { w: '{旅行|りょこう}', ro: 'ryokou', vi: 'du lịch' },
      { w: '{飛行機|ひこうき}', ro: 'hikouki', vi: 'máy bay' },
    ],
  },
  '休': {
    hv: 'HƯU', nghia: 'nghỉ ngơi', en: 'rest',
    on: ['キュウ'], kun: ['やす・みます'],
    nho: 'Một người (亻) dựa lưng vào gốc cây (木): NGHỈ NGƠI.',
    tu: [
      { w: '{休|やす}みます', ro: 'yasumimasu', vi: 'nghỉ' },
      { w: '{休|やす}み', ro: 'yasumi', vi: 'kỳ nghỉ, ngày nghỉ' },
      { w: '{休|やす}みの{日|ひ}', ro: 'yasumi no hi', vi: 'ngày nghỉ (tên Bài 5)' },
      { w: '{昼休|ひるやす}み', ro: 'hiruyasumi', vi: 'nghỉ trưa' },
      { w: '{休日|きゅうじつ}', ro: 'kyuujitsu', vi: 'ngày nghỉ (trang trọng)' },
    ],
  },
  /* ── Bài 6 — dự kiến ── */
  '手': {
    hv: 'THỦ', nghia: 'tay', en: 'hand',
    on: ['シュ'], kun: ['て'],
    nho: 'Hình bàn tay xoè: các nét ngang là ngón tay, nét sổ móc bên dưới là cổ tay.',
    tu: [
      { w: '{手|て}', ro: 'te', vi: 'tay' },
      { w: '{歌手|かしゅ}', ro: 'kashu', vi: 'ca sĩ (người dùng tay nghề hát)' },
      { w: '{上手|じょうず}', ro: 'jouzu', vi: 'giỏi (đọc đặc biệt じょうず)' },
      { w: '{下手|へた}', ro: 'heta', vi: 'kém, dở (đọc đặc biệt へた)' },
      { w: '{手紙|てがみ}', ro: 'tegami', vi: 'lá thư' },
    ],
  },
  '歌': {
    hv: 'CA', nghia: 'bài hát, hát', en: 'song / sing',
    on: ['カ'], kun: ['うた', 'うた・います'],
    nho: 'Bên trái là hai chữ 可 chồng lên nhau (ngân nga lặp đi lặp lại), bên phải là 欠 (người há miệng): há miệng ngân nga → HÁT.',
    tu: [
      { w: '{歌|うた}', ro: 'uta', vi: 'bài hát' },
      { w: '{歌|うた}います', ro: 'utaimasu', vi: 'hát' },
      { w: '{歌手|かしゅ}', ro: 'kashu', vi: 'ca sĩ' },
    ],
  },
  '近': {
    hv: 'CẬN', nghia: 'gần', en: 'near',
    on: ['キン'], kun: ['ちか・い'],
    nho: 'Bộ 辶 (con đường) + 斤 (cái rìu): quãng đường ngắn chỉ bằng một nhát rìu → GẦN.',
    tu: [
      { w: '{近|ちか}い', ro: 'chikai', vi: 'gần' },
      { w: '{近|ちか}く', ro: 'chikaku', vi: 'chỗ gần, gần đây' },
      { w: '{最近|さいきん}', ro: 'saikin', vi: 'gần đây, dạo này' },
    ],
  },
  '遠': {
    hv: 'VIỄN', nghia: 'xa', en: 'far',
    on: ['エン'], kun: ['とお・い'],
    nho: 'Bộ 辶 (con đường) + 袁 (tà áo dài lê thê): con đường dài như tà áo kéo lê → XA. Cặp với 近 (gần).',
    tu: [
      { w: '{遠|とお}い', ro: 'tooi', vi: 'xa' },
      { w: '{遠足|えんそく}', ro: 'ensoku', vi: 'chuyến dã ngoại (đi bộ xa)' },
    ],
  },
  '早': {
    hv: 'TẢO', nghia: 'sớm, nhanh', en: 'early',
    on: ['ソウ'], kun: ['はや・い'],
    nho: 'Mặt trời (日) vừa nhô lên trên ngọn cây (十): trời còn SỚM.',
    tu: [
      { w: '{早|はや}い', ro: 'hayai', vi: 'sớm; nhanh' },
      { w: '{早|はや}く', ro: 'hayaku', vi: 'sớm, nhanh lên (早く帰ります = về sớm)' },
      { w: '{早|はや}{起|お}き', ro: 'hayaoki', vi: 'việc dậy sớm' },
    ],
  },
  '広': {
    hv: 'QUẢNG', nghia: 'rộng', en: 'wide',
    on: ['コウ'], kun: ['ひろ・い'],
    nho: 'Bộ 广 (mái nhà mở một bên, không có tường) + ム: dưới mái nhà không vách thì thấy RỘNG thênh thang.',
    tu: [
      { w: '{広|ひろ}い', ro: 'hiroi', vi: 'rộng' },
      { w: '{広場|ひろば}', ro: 'hiroba', vi: 'quảng trường' },
      { w: '{広島|ひろしま}', ro: 'Hiroshima', vi: 'Hiroshima (tên tỉnh)' },
    ],
  },
  '全': {
    hv: 'TOÀN', nghia: 'toàn bộ, tất cả', en: 'all / whole',
    on: ['ゼン'], kun: ['まった・く'],
    nho: 'Mái che 人 úp lên viên ngọc 王: ngọc được che kỹ nên còn NGUYÊN VẸN, đủ TOÀN BỘ.',
    tu: [
      { w: '{全部|ぜんぶ}', ro: 'zenbu', vi: 'tất cả, toàn bộ' },
      { w: '{全然|ぜんぜん}', ro: 'zenzen', vi: 'hoàn toàn (không) — đi với phủ định' },
      { w: '{全国|ぜんこく}', ro: 'zenkoku', vi: 'toàn quốc' },
    ],
  },
  '部': {
    hv: 'BỘ', nghia: 'phần, bộ phận', en: 'part / section',
    on: ['ブ'], kun: [],
    nho: 'Bên phải là bộ 阝 (vùng đất, thôn ấp): chia vùng đất thành từng PHẦN, từng BỘ phận.',
    tu: [
      { w: '{全部|ぜんぶ}', ro: 'zenbu', vi: 'tất cả, toàn bộ' },
      { w: '{部屋|へや}', ro: 'heya', vi: 'căn phòng (đọc đặc biệt へや)' },
      { w: '{部長|ぶちょう}', ro: 'buchou', vi: 'trưởng phòng' },
    ],
  },
  '約': {
    hv: 'ƯỚC', nghia: 'hẹn ước; khoảng', en: 'promise / approx.',
    on: ['ヤク'], kun: [],
    nho: 'Bộ 糸 (sợi chỉ) + 勺 (cái muôi): thắt một nút chỉ để nhớ lời HẸN ƯỚC.',
    tu: [
      { w: '{約束|やくそく}', ro: 'yakusoku', vi: 'cuộc hẹn; lời hứa' },
      { w: '{予約|よやく}', ro: 'yoyaku', vi: 'đặt trước (vé, bàn…)' },
      { w: '{約|やく}', ro: 'yaku', vi: 'khoảng (約1時間 = khoảng 1 tiếng)' },
    ],
  },
  '束': {
    hv: 'THÚC', nghia: 'bó, buộc', en: 'bundle',
    on: ['ソク'], kun: ['たば'],
    nho: 'Chữ 木 (cây) bị một vòng dây 口 buộc ngang giữa: BÓ củi. Lời hẹn {約束|やくそく} là lời đã được "buộc" chặt.',
    tu: [
      { w: '{約束|やくそく}', ro: 'yakusoku', vi: 'cuộc hẹn; lời hứa' },
      { w: '{花束|はなたば}', ro: 'hanataba', vi: 'bó hoa' },
    ],
  },
  '遊': {
    hv: 'DU', nghia: 'chơi, đi chơi', en: 'play',
    on: ['ユウ'], kun: ['あそ・びます'],
    nho: 'Bộ 辶 (đi) + 方 (lá cờ) + 子 (đứa trẻ): đứa trẻ cầm cờ chạy khắp nơi → đi CHƠI.',
    tu: [
      { w: '{遊|あそ}びます', ro: 'asobimasu', vi: 'chơi, đi chơi' },
      { w: '{遊|あそ}びに{行|い}きます', ro: 'asobi ni ikimasu', vi: 'đi chơi' },
      { w: '{遊園地|ゆうえんち}', ro: 'yuuenchi', vi: 'công viên giải trí' },
    ],
  },
  '野': {
    hv: 'DÃ', nghia: 'cánh đồng, hoang dã', en: 'field',
    on: ['ヤ'], kun: ['の'],
    nho: 'Bên trái 里 (làng, ruộng: 田 + 土): vùng đất trống ngoài làng → CÁNH ĐỒNG. Rau {野菜|やさい} là "rau ngoài đồng".',
    tu: [
      { w: '{野菜|やさい}', ro: 'yasai', vi: 'rau' },
      { w: '{野球|やきゅう}', ro: 'yakyuu', vi: 'bóng chày (bóng chơi ngoài đồng)' },
      { w: '{長野|ながの}', ro: 'Nagano', vi: 'Nagano (tên tỉnh)' },
    ],
  },

  /* ── Bài 7 — dự kiến ── */
  '上': {
    hv: 'THƯỢNG', nghia: 'trên', en: 'up / above',
    on: ['ジョウ'], kun: ['うえ', 'あ・げます'],
    nho: 'Một đường ngang làm mặt đất, nét sổ nhô LÊN TRÊN mặt đất → trên. Ngược với 下.',
    tu: [
      { w: '{上|うえ}', ro: 'ue', vi: 'trên, bên trên' },
      { w: '{上手|じょうず}', ro: 'jouzu', vi: 'giỏi (đọc đặc biệt)' },
      { w: '{以上|いじょう}', ro: 'ijou', vi: 'trở lên' },
      { w: '{上着|うわぎ}', ro: 'uwagi', vi: 'áo khoác (上 đọc うわ)' },
    ],
  },
  '下': {
    hv: 'HẠ', nghia: 'dưới', en: 'down / below',
    on: ['カ', 'ゲ'], kun: ['した', 'お・ります'],
    nho: 'Đường ngang là mặt đất, nét sổ cắm XUỐNG DƯỚI mặt đất → dưới. Ngược với 上.',
    tu: [
      { w: '{下|した}', ro: 'shita', vi: 'dưới, phía dưới' },
      { w: '{地下鉄|ちかてつ}', ro: 'chikatetsu', vi: 'tàu điện ngầm' },
      { w: '{靴下|くつした}', ro: 'kutsushita', vi: 'tất, vớ' },
      { w: '{下手|へた}', ro: 'heta', vi: 'kém, dở (đọc đặc biệt)' },
    ],
  },
  '中': {
    hv: 'TRUNG', nghia: 'giữa, bên trong', en: 'middle / inside',
    on: ['チュウ', 'ジュウ'], kun: ['なか'],
    nho: 'Một mũi tên xuyên đúng CHÍNH GIỮA cái hộp 口 → giữa, bên trong.',
    tu: [
      { w: '{中|なか}', ro: 'naka', vi: 'trong, bên trong' },
      { w: '{中国|ちゅうごく}', ro: 'Chuugoku', vi: 'Trung Quốc' },
      { w: '{真|ま}ん{中|なか}', ro: 'mannaka', vi: 'chính giữa' },
      { w: '{一年中|いちねんじゅう}', ro: 'ichinenjuu', vi: 'suốt một năm (中 đọc じゅう = suốt)' },
    ],
  },
  '外': {
    hv: 'NGOẠI', nghia: 'bên ngoài', en: 'outside',
    on: ['ガイ'], kun: ['そと'],
    nho: '夕 (buổi tối) + 卜 (que bói): người xưa bói vào buổi tối phải ra NGOÀI trời xem sao.',
    tu: [
      { w: '{外|そと}', ro: 'soto', vi: 'bên ngoài' },
      { w: '{外国|がいこく}', ro: 'gaikoku', vi: 'nước ngoài' },
      { w: '{外国人|がいこくじん}', ro: 'gaikokujin', vi: 'người nước ngoài' },
    ],
  },
  '横': {
    hv: 'HOÀNH', nghia: 'bên cạnh, chiều ngang', en: 'side',
    on: ['オウ'], kun: ['よこ'],
    nho: 'Bộ 木 (gỗ) + 黄 (màu vàng): thanh gỗ vàng đặt NẰM NGANG ngay BÊN CẠNH.',
    tu: [
      { w: '{横|よこ}', ro: 'yoko', vi: 'bên cạnh; chiều ngang' },
      { w: '{横|よこ}になります', ro: 'yoko ni narimasu', vi: 'nằm xuống' },
      { w: '{横浜|よこはま}', ro: 'Yokohama', vi: 'Yokohama (thành phố)' },
    ],
  },
  '出': {
    hv: 'XUẤT', nghia: 'ra, đưa ra', en: 'exit / go out',
    on: ['シュツ'], kun: ['で・ます', 'だ・します'],
    nho: 'Hình mầm cây mọc hai tầng, vươn RA khỏi cái hố 凵 → ra.',
    tu: [
      { w: '{出口|でぐち}', ro: 'deguchi', vi: 'lối ra' },
      { w: '{出|だ}します', ro: 'dashimasu', vi: 'lấy ra; nộp' },
      { w: '{出|で}かけます', ro: 'dekakemasu', vi: 'ra ngoài, đi ra ngoài' },
      { w: '{思|おも}い{出|で}', ro: 'omoide', vi: 'kỷ niệm' },
    ],
  },
  '入': {
    hv: 'NHẬP', nghia: 'vào, cho vào', en: 'enter',
    on: ['ニュウ'], kun: ['はい・ります', 'い・れます'],
    nho: 'Người cúi đầu chui VÀO lều. Khác 人 (người): ở 入 nét phải dài và nằm trên, nét trái ngắn.',
    tu: [
      { w: '{入|はい}ります', ro: 'hairimasu', vi: 'vào' },
      { w: '{入|い}れます', ro: 'iremasu', vi: 'cho vào, bỏ vào' },
      { w: '{入|い}り{口|ぐち}', ro: 'iriguchi', vi: 'lối vào (くち → ぐち)' },
      { w: '{入学|にゅうがく}', ro: 'nyuugaku', vi: 'nhập học' },
    ],
  },
  '開': {
    hv: 'KHAI', nghia: 'mở', en: 'open',
    on: ['カイ'], kun: ['あ・けます', 'あ・きます'],
    nho: 'Bộ 門 (cánh cổng) + 开 (hai tay đẩy then cài): đẩy then ra → MỞ cổng.',
    tu: [
      { w: '{開|あ}けます', ro: 'akemasu', vi: 'mở (cửa, hộp…) — tha động từ' },
      { w: '{開|あ}きます', ro: 'akimasu', vi: '(cửa) mở ra — tự động từ' },
    ],
  },
  '閉': {
    hv: 'BẾ', nghia: 'đóng', en: 'close',
    on: ['ヘイ'], kun: ['し・めます', 'し・まります'],
    nho: 'Bộ 門 (cánh cổng) + 才 (thanh then chắn ngang): cài then → ĐÓNG cửa. Cặp với 開.',
    tu: [
      { w: '{閉|し}めます', ro: 'shimemasu', vi: 'đóng (cửa…) — tha động từ' },
      { w: '{閉|し}まります', ro: 'shimarimasu', vi: '(cửa, cửa hàng) đóng — tự động từ' },
    ],
  },
  '使': {
    hv: 'SỨ, SỬ', nghia: 'dùng, sử dụng', en: 'use',
    on: ['シ'], kun: ['つか・います'],
    nho: 'Bộ 亻 (người) + 吏 (viên quan): người được quan SAI khiến, đem ra DÙNG việc.',
    tu: [
      { w: '{使|つか}います', ro: 'tsukaimasu', vi: 'dùng, sử dụng' },
      { w: '{大使館|たいしかん}', ro: 'taishikan', vi: 'đại sứ quán' },
    ],
  },
  '貸': {
    hv: 'THẢI', nghia: 'cho mượn, cho thuê', en: 'lend',
    on: ['タイ'], kun: ['か・します'],
    nho: '代 (thay thế) đặt trên 貝 (vỏ sò = tiền): đưa tiền/đồ cho người khác dùng thay → CHO MƯỢN. Khác 借 (か・ります = mượn).',
    tu: [
      { w: '{貸|か}します', ro: 'kashimasu', vi: 'cho mượn' },
      { w: '{貸|か}してください', ro: 'kashite kudasai', vi: 'hãy cho tôi mượn' },
    ],
  },
  '置': {
    hv: 'TRÍ', nghia: 'đặt, để', en: 'put / place',
    on: ['チ'], kun: ['お・きます'],
    nho: '罒 (tấm lưới) + 直 (thẳng): trải tấm lưới cho thẳng rồi ĐẶT đồ lên.',
    tu: [
      { w: '{置|お}きます', ro: 'okimasu', vi: 'đặt, để' },
      { w: '{置|お}いてください', ro: 'oite kudasai', vi: 'hãy để (ở đó)' },
    ],
  },

  /* ── Bài 8 — dự kiến ── */
  '父': {
    hv: 'PHỤ', nghia: 'bố, cha', en: 'father',
    on: ['フ'], kun: ['ちち'],
    nho: 'Hai bàn tay cầm hai cây gậy bắt chéo (乂): người CHA nghiêm khắc cầm roi dạy con.',
    tu: [
      { w: '{父|ちち}', ro: 'chichi', vi: 'bố (của mình)' },
      { w: 'お{父|とう}さん', ro: 'otousan', vi: 'bố (của người khác) — đọc đặc biệt とう' },
      { w: '{祖父|そふ}', ro: 'sofu', vi: 'ông (của mình)' },
    ],
  },
  '母': {
    hv: 'MẪU', nghia: 'mẹ', en: 'mother',
    on: ['ボ'], kun: ['はは'],
    nho: 'Hình người phụ nữ, hai chấm bên trong là bầu sữa nuôi con → MẸ. (Chữ 毎 "mỗi" của Bài 5 có 母 bên dưới.)',
    tu: [
      { w: '{母|はは}', ro: 'haha', vi: 'mẹ (của mình)' },
      { w: 'お{母|かあ}さん', ro: 'okaasan', vi: 'mẹ (của người khác) — đọc đặc biệt かあ' },
      { w: '{祖母|そぼ}', ro: 'sobo', vi: 'bà (của mình)' },
    ],
  },
  '兄': {
    hv: 'HUYNH', nghia: 'anh trai', en: 'older brother',
    on: ['キョウ', 'ケイ'], kun: ['あに'],
    nho: '口 (cái miệng) trên 儿 (đôi chân): người lớn đứng nói to, dặn dò các em → ANH.',
    tu: [
      { w: '{兄|あに}', ro: 'ani', vi: 'anh trai (của mình)' },
      { w: 'お{兄|にい}さん', ro: 'oniisan', vi: 'anh trai (của người khác) — đọc đặc biệt にい' },
      { w: '{兄弟|きょうだい}', ro: 'kyoudai', vi: 'anh chị em' },
    ],
  },
  '弟': {
    hv: 'ĐỆ', nghia: 'em trai', en: 'younger brother',
    on: ['ダイ', 'テイ'], kun: ['おとうと'],
    nho: 'Sợi dây (弓) quấn quanh cây cọc theo thứ tự từ trên xuống: thứ bậc sau → EM TRAI.',
    tu: [
      { w: '{弟|おとうと}', ro: 'otouto', vi: 'em trai (của mình)' },
      { w: '{弟|おとうと}さん', ro: 'otoutosan', vi: 'em trai (của người khác)' },
      { w: '{兄弟|きょうだい}', ro: 'kyoudai', vi: 'anh chị em' },
    ],
  },
  '姉': {
    hv: 'TỶ', nghia: 'chị gái', en: 'older sister',
    on: ['シ'], kun: ['あね'],
    nho: 'Bộ 女 (phụ nữ) + 市 (chợ): cô gái đã lớn, được giao đi chợ → CHỊ.',
    tu: [
      { w: '{姉|あね}', ro: 'ane', vi: 'chị gái (của mình)' },
      { w: 'お{姉|ねえ}さん', ro: 'oneesan', vi: 'chị gái (của người khác) — đọc đặc biệt ねえ' },
      { w: '{姉妹|しまい}', ro: 'shimai', vi: 'chị em gái' },
    ],
  },
  '妹': {
    hv: 'MUỘI', nghia: 'em gái', en: 'younger sister',
    on: ['マイ'], kun: ['いもうと'],
    nho: 'Bộ 女 (phụ nữ) + 未 (chưa): cô gái CHƯA lớn → EM GÁI.',
    tu: [
      { w: '{妹|いもうと}', ro: 'imouto', vi: 'em gái (của mình)' },
      { w: '{妹|いもうと}さん', ro: 'imoutosan', vi: 'em gái (của người khác)' },
      { w: '{姉妹|しまい}', ro: 'shimai', vi: 'chị em gái' },
    ],
  },
  '子': {
    hv: 'TỬ', nghia: 'con, đứa trẻ', en: 'child',
    on: ['シ', 'ス'], kun: ['こ'],
    nho: 'Hình em bé quấn tã: đầu tròn ở trên, hai tay dang ngang, thân bó lại bên dưới.',
    tu: [
      { w: '{子|こ}ども', ro: 'kodomo', vi: 'con cái; trẻ con' },
      { w: 'お{子|こ}さん', ro: 'okosan', vi: 'con (của người khác)' },
      { w: '{息子|むすこ}', ro: 'musuko', vi: 'con trai (của mình)' },
      { w: '{帽子|ぼうし}', ro: 'boushi', vi: 'mũ, nón' },
      { w: 'お{菓子|かし}', ro: 'okashi', vi: 'bánh kẹo' },
    ],
  },
  '目': {
    hv: 'MỤC', nghia: 'mắt; thứ (~つ目)', en: 'eye',
    on: ['モク'], kun: ['め'],
    nho: 'Hình con MẮT dựng đứng: khung ngoài là mí mắt, hai nét ngang bên trong là con ngươi.',
    tu: [
      { w: '{目|め}', ro: 'me', vi: 'mắt' },
      { w: '{一|ひと}つ{目|め}', ro: 'hitotsume', vi: 'thứ nhất (～つ目 = thứ ~)' },
      { w: '{目薬|めぐすり}', ro: 'megusuri', vi: 'thuốc nhỏ mắt' },
    ],
  },
  '口': {
    hv: 'KHẨU', nghia: 'miệng; cửa', en: 'mouth',
    on: ['コウ'], kun: ['くち'],
    nho: 'Hình cái MIỆNG há vuông. Miệng của toà nhà là cửa: {出口|でぐち}, {入|い}り{口|ぐち}.',
    tu: [
      { w: '{口|くち}', ro: 'kuchi', vi: 'miệng' },
      { w: '{出口|でぐち}', ro: 'deguchi', vi: 'lối ra (くち → ぐち)' },
      { w: '{入|い}り{口|ぐち}', ro: 'iriguchi', vi: 'lối vào' },
      { w: '{人口|じんこう}', ro: 'jinkou', vi: 'dân số (số "miệng ăn")' },
    ],
  },
  '耳': {
    hv: 'NHĨ', nghia: 'tai', en: 'ear',
    on: ['ジ'], kun: ['みみ'],
    nho: 'Hình cái TAI: khung ngoài là vành tai, các nét ngang bên trong là nếp tai. Gặp lại trong 聞 (nghe) = tai áp vào cổng.',
    tu: [
      { w: '{耳|みみ}', ro: 'mimi', vi: 'tai' },
      { w: '{耳|みみ}が{痛|いた}いです', ro: 'mimi ga itai desu', vi: 'tôi bị đau tai' },
    ],
  },
  '足': {
    hv: 'TÚC', nghia: 'chân; đủ', en: 'foot / leg',
    on: ['ソク'], kun: ['あし', 'た・ります'],
    nho: '口 phía trên là đầu gối, phía dưới là cẳng chân và bàn chân bước ra → CHÂN.',
    tu: [
      { w: '{足|あし}', ro: 'ashi', vi: 'chân, bàn chân' },
      { w: '{遠足|えんそく}', ro: 'ensoku', vi: 'chuyến dã ngoại' },
      { w: '{一足|いっそく}', ro: 'issoku', vi: 'một đôi (giày, tất)' },
    ],
  },
  '長': {
    hv: 'TRƯỜNG, TRƯỞNG', nghia: 'dài; người đứng đầu', en: 'long / chief',
    on: ['チョウ'], kun: ['なが・い'],
    nho: 'Hình ông già tóc DÀI bay phất phơ, chống gậy: tóc dài → dài; người cao tuổi → TRƯỞNG.',
    tu: [
      { w: '{長|なが}い', ro: 'nagai', vi: 'dài' },
      { w: '{店長|てんちょう}', ro: 'tenchou', vi: 'cửa hàng trưởng' },
      { w: '{社長|しゃちょう}', ro: 'shachou', vi: 'giám đốc công ty' },
      { w: '{部長|ぶちょう}', ro: 'buchou', vi: 'trưởng phòng' },
    ],
  },

  /* ── Bài 9 — dự kiến ── */
  '読': {
    hv: 'ĐỘC', nghia: 'đọc', en: 'read',
    on: ['ドク'], kun: ['よ・みます'],
    nho: 'Bộ 言 (lời nói) + 売 (bán): người bán hàng rao to bằng lời → ĐỌC to lên.',
    tu: [
      { w: '{読|よ}みます', ro: 'yomimasu', vi: 'đọc' },
      { w: '{読書|どくしょ}', ro: 'dokusho', vi: 'đọc sách' },
    ],
  },
  '書': {
    hv: 'THƯ', nghia: 'viết; sách', en: 'write',
    on: ['ショ'], kun: ['か・きます'],
    nho: 'Phía trên là 聿 (bàn tay cầm bút lông), phía dưới là 日 (tờ giấy): cầm bút VIẾT.',
    tu: [
      { w: '{書|か}きます', ro: 'kakimasu', vi: 'viết' },
      { w: '{辞書|じしょ}', ro: 'jisho', vi: 'từ điển' },
      { w: '{図書館|としょかん}', ro: 'toshokan', vi: 'thư viện' },
      { w: '{書道|しょどう}', ro: 'shodou', vi: 'thư pháp' },
    ],
  },
  '聞': {
    hv: 'VĂN', nghia: 'nghe; hỏi', en: 'hear / ask',
    on: ['ブン'], kun: ['き・きます'],
    nho: 'Cái tai (耳) áp vào cánh cổng (門) để NGHE lén.',
    tu: [
      { w: '{聞|き}きます', ro: 'kikimasu', vi: 'nghe; hỏi' },
      { w: '{新聞|しんぶん}', ro: 'shinbun', vi: 'báo (tin mới nghe được)' },
      { w: '{聞|き}こえます', ro: 'kikoemasu', vi: 'nghe thấy được' },
    ],
  },
  '話': {
    hv: 'THOẠI', nghia: 'nói chuyện; câu chuyện', en: 'talk',
    on: ['ワ'], kun: ['はな・します', 'はなし'],
    nho: 'Bộ 言 (lời) + 舌 (cái lưỡi): lưỡi uốn ra lời → NÓI CHUYỆN.',
    tu: [
      { w: '{話|はな}します', ro: 'hanashimasu', vi: 'nói chuyện' },
      { w: '{電話|でんわ}', ro: 'denwa', vi: 'điện thoại' },
      { w: '{会話|かいわ}', ro: 'kaiwa', vi: 'hội thoại' },
      { w: '{話|はなし}', ro: 'hanashi', vi: 'câu chuyện' },
    ],
  },
  '言': {
    hv: 'NGÔN', nghia: 'nói, lời nói', en: 'say',
    on: ['ゲン', 'ゴン'], kun: ['い・います'],
    nho: 'Những nét ngang là lời nói bay ra từ cái miệng 口 bên dưới → NÓI. Là bộ thủ trong 読, 話, 語.',
    tu: [
      { w: '{言|い}います', ro: 'iimasu', vi: 'nói (nói ra: tên, ý kiến…)' },
      { w: '{言葉|ことば}', ro: 'kotoba', vi: 'từ ngữ, lời nói' },
    ],
  },
  '泳': {
    hv: 'VỊNH', nghia: 'bơi', en: 'swim',
    on: ['エイ'], kun: ['およ・ぎます'],
    nho: 'Bộ 氵 (nước) + 永 (dài mãi): người sải tay thật DÀI trong nước → BƠI.',
    tu: [
      { w: '{泳|およ}ぎます', ro: 'oyogimasu', vi: 'bơi' },
      { w: '{水泳|すいえい}', ro: 'suiei', vi: 'bơi lội (môn thể thao)' },
    ],
  },
  '乗': {
    hv: 'THỪA', nghia: 'lên, đi (xe, tàu)', en: 'ride',
    on: ['ジョウ'], kun: ['の・ります'],
    nho: 'Hình một người đứng trèo lên ngọn cây (木): trèo LÊN → lên xe, lên tàu.',
    tu: [
      { w: '{乗|の}ります', ro: 'norimasu', vi: 'lên, đi (xe, tàu) — N に乗ります' },
      { w: '{乗|の}り{物|もの}', ro: 'norimono', vi: 'phương tiện, trò chơi có ngồi lên' },
    ],
  },
  '習': {
    hv: 'TẬP', nghia: 'học, luyện tập', en: 'learn',
    on: ['シュウ'], kun: ['なら・います'],
    nho: '羽 (đôi cánh) trên 白: chim non vỗ cánh TẬP bay hết lần này đến lần khác → học tập.',
    tu: [
      { w: '{習|なら}います', ro: 'naraimasu', vi: 'học (có người dạy)' },
      { w: '{練習|れんしゅう}', ro: 'renshuu', vi: 'luyện tập' },
      { w: '{習慣|しゅうかん}', ro: 'shuukan', vi: 'phong tục; thói quen' },
    ],
  },
  '運': {
    hv: 'VẬN', nghia: 'chở, vận chuyển; vận may', en: 'carry / luck',
    on: ['ウン'], kun: ['はこ・びます'],
    nho: 'Bộ 辶 (đi) + 軍 (quân lính, xe quân): đoàn xe quân đi chở hàng → VẬN chuyển.',
    tu: [
      { w: '{運転|うんてん}', ro: 'unten', vi: 'lái (xe) (運転します)' },
      { w: '{運動|うんどう}', ro: 'undou', vi: 'vận động, tập thể dục' },
    ],
  },
  '転': {
    hv: 'CHUYỂN', nghia: 'lăn, chuyển', en: 'roll / turn',
    on: ['テン'], kun: ['ころ・びます'],
    nho: 'Bộ 車 (xe) + 云: bánh xe quay tròn, lăn đi → CHUYỂN động.',
    tu: [
      { w: '{運転|うんてん}', ro: 'unten', vi: 'lái (xe)' },
      { w: '{自転車|じてんしゃ}', ro: 'jitensha', vi: 'xe đạp (xe tự lăn)' },
    ],
  },
  '集': {
    hv: 'TẬP', nghia: 'tụ tập, thu thập', en: 'gather',
    on: ['シュウ'], kun: ['あつ・めます', 'あつ・まります'],
    nho: '隹 (con chim) đậu trên 木 (cái cây): chim TỤ TẬP về trên cây.',
    tu: [
      { w: '{集|あつ}めます', ro: 'atsumemasu', vi: 'sưu tầm, thu thập' },
      { w: '{集|あつ}まります', ro: 'atsumarimasu', vi: 'tập trung, tụ tập' },
      { w: '{集合|しゅうごう}', ro: 'shuugou', vi: 'tập hợp' },
    ],
  },
  '描': {
    hv: 'MIÊU', nghia: 'vẽ (tranh), miêu tả', en: 'draw',
    on: ['ビョウ'], kun: ['か・きます'],
    nho: 'Bộ 扌 (tay) + 苗 (mầm lúa: 艹 + 田): bàn tay VẼ lại mầm cây trên ruộng. Cùng đọc かきます với 書 (viết) nhưng là vẽ.',
    tu: [
      { w: '{描|か}きます', ro: 'kakimasu', vi: 'vẽ (tranh)' },
      { w: '{絵|え}を{描|か}きます', ro: 'e o kakimasu', vi: 'vẽ tranh' },
    ],
  },

  /* ── Bài 10 — dự kiến ── */
  '右': {
    hv: 'HỮU', nghia: 'bên phải', en: 'right',
    on: ['ウ', 'ユウ'], kun: ['みぎ'],
    nho: 'Bàn tay (ナ) đưa đồ ăn lên miệng (口): tay cầm đũa là tay PHẢI. Khác 左: tay + 工.',
    tu: [
      { w: '{右|みぎ}', ro: 'migi', vi: 'bên phải' },
      { w: '{右|みぎ}に{曲|ま}がります', ro: 'migi ni magarimasu', vi: 'rẽ phải' },
      { w: '{左右|さゆう}', ro: 'sayuu', vi: 'trái phải, hai bên' },
    ],
  },
  '左': {
    hv: 'TẢ', nghia: 'bên trái', en: 'left',
    on: ['サ'], kun: ['ひだり'],
    nho: 'Bàn tay (ナ) giữ cây thước thợ (工): tay giữ thước để tay kia làm là tay TRÁI.',
    tu: [
      { w: '{左|ひだり}', ro: 'hidari', vi: 'bên trái' },
      { w: '{左|ひだり}に{曲|ま}がります', ro: 'hidari ni magarimasu', vi: 'rẽ trái' },
      { w: '{左右|さゆう}', ro: 'sayuu', vi: 'trái phải' },
    ],
  },
  '立': {
    hv: 'LẬP', nghia: 'đứng', en: 'stand',
    on: ['リツ'], kun: ['た・ちます'],
    nho: 'Hình một người dang tay dang chân ĐỨNG trên mặt đất (nét ngang dưới cùng).',
    tu: [
      { w: '{立|た}ちます', ro: 'tachimasu', vi: 'đứng, đứng lên' },
      { w: '{立|た}ってください', ro: 'tatte kudasai', vi: 'hãy đứng lên' },
      { w: '{国立|こくりつ}', ro: 'kokuritsu', vi: 'quốc lập, của nhà nước' },
    ],
  },
  '座': {
    hv: 'TOẠ', nghia: 'ngồi; chỗ ngồi', en: 'sit',
    on: ['ザ'], kun: ['すわ・ります'],
    nho: 'Dưới mái nhà (广) có hai người (人 人) NGỒI trên nền đất (土).',
    tu: [
      { w: '{座|すわ}ります', ro: 'suwarimasu', vi: 'ngồi (chỗ + に)' },
      { w: '{座|すわ}ってください', ro: 'suwatte kudasai', vi: 'mời ngồi' },
      { w: '{銀座|ぎんざ}', ro: 'Ginza', vi: 'Ginza (khu phố ở Tokyo)' },
    ],
  },
  '歩': {
    hv: 'BỘ', nghia: 'đi bộ, bước', en: 'walk',
    on: ['ホ', 'ポ'], kun: ['ある・きます'],
    nho: 'Trên là 止 (bàn chân), dưới là bàn chân kia bước theo: hai bàn chân lần lượt → ĐI BỘ.',
    tu: [
      { w: '{歩|ある}きます', ro: 'arukimasu', vi: 'đi bộ' },
      { w: '{歩|ある}いて', ro: 'aruite', vi: 'đi bộ (歩いて5分 = đi bộ 5 phút)' },
      { w: '{散歩|さんぽ}', ro: 'sanpo', vi: 'đi dạo (歩 đọc ぽ)' },
    ],
  },
  '待': {
    hv: 'ĐÃI', nghia: 'chờ, đợi', en: 'wait',
    on: ['タイ'], kun: ['ま・ちます'],
    nho: 'Bộ 彳 (bước đi) + 寺 (ngôi chùa): đi đến cổng chùa đứng CHỜ.',
    tu: [
      { w: '{待|ま}ちます', ro: 'machimasu', vi: 'chờ, đợi' },
      { w: '{待|ま}ってください', ro: 'matte kudasai', vi: 'xin hãy đợi' },
      { w: '{待合室|まちあいしつ}', ro: 'machiaishitsu', vi: 'phòng chờ' },
    ],
  },
  '持': {
    hv: 'TRÌ', nghia: 'cầm, mang', en: 'hold',
    on: ['ジ'], kun: ['も・ちます'],
    nho: 'Bộ 扌 (bàn tay) + 寺: bàn tay nắm giữ chặt → CẦM, MANG.',
    tu: [
      { w: '{持|も}ちます', ro: 'mochimasu', vi: 'cầm, mang' },
      { w: '{持|も}って{行|い}きます', ro: 'motte ikimasu', vi: 'mang đi' },
      { w: '{持|も}って{帰|かえ}ります', ro: 'motte kaerimasu', vi: 'mang về' },
      { w: '{気持|きも}ち', ro: 'kimochi', vi: 'cảm giác, tâm trạng' },
    ],
  },
  '帰': {
    hv: 'QUY', nghia: 'về, trở về', en: 'return',
    on: ['キ'], kun: ['かえ・ります'],
    nho: 'Bên phải là 帚 (cây chổi): người cầm chổi quét nhà — ai cũng phải TRỞ VỀ nhà.',
    tu: [
      { w: '{帰|かえ}ります', ro: 'kaerimasu', vi: 'về (nhà, nước)' },
      { w: '{持|も}って{帰|かえ}ります', ro: 'motte kaerimasu', vi: 'mang về' },
      { w: '{帰国|きこく}', ro: 'kikoku', vi: 'về nước' },
    ],
  },
  '道': {
    hv: 'ĐẠO', nghia: 'con đường; đạo', en: 'road / way',
    on: ['ドウ'], kun: ['みち'],
    nho: 'Bộ 辶 (đi) + 首 (cái đầu): cái đầu đi trước dẫn lối → CON ĐƯỜNG.',
    tu: [
      { w: '{道|みち}', ro: 'michi', vi: 'con đường' },
      { w: '{書道|しょどう}', ro: 'shodou', vi: 'thư pháp (đạo viết chữ)' },
      { w: '{北海道|ほっかいどう}', ro: 'Hokkaidou', vi: 'Hokkaido' },
    ],
  },
  '橋': {
    hv: 'KIỀU', nghia: 'cây cầu', en: 'bridge',
    on: ['キョウ'], kun: ['はし'],
    nho: 'Bộ 木 (gỗ) + 喬 (cao vút): thanh gỗ bắc CAO qua sông → CÂY CẦU.',
    tu: [
      { w: '{橋|はし}', ro: 'hashi', vi: 'cây cầu (khác はし = đũa)' },
      { w: '{歩道橋|ほどうきょう}', ro: 'hodoukyou', vi: 'cầu đi bộ (歩 + 道 + 橋)' },
    ],
  },
  '危': {
    hv: 'NGUY', nghia: 'nguy hiểm', en: 'danger',
    on: ['キ'], kun: ['あぶ・ない'],
    nho: 'Một người (⺈) đứng trên mép vách đá (厂), bên dưới có người quỳ co ro (㔾) → NGUY HIỂM.',
    tu: [
      { w: '{危|あぶ}ない', ro: 'abunai', vi: 'nguy hiểm' },
      { w: '{危険|きけん}', ro: 'kiken', vi: 'nguy hiểm (trang trọng, trên biển báo)' },
    ],
  },
  '曲': {
    hv: 'KHÚC', nghia: 'cong, rẽ; bản nhạc', en: 'bend / tune',
    on: ['キョク'], kun: ['ま・がります'],
    nho: 'Hình cái rổ tre đan có nan uốn CONG → cong, rẽ; giai điệu uốn lượn → bản nhạc.',
    tu: [
      { w: '{曲|ま}がります', ro: 'magarimasu', vi: 'rẽ, quẹo (chỗ rẽ + を)' },
      { w: '{曲|きょく}', ro: 'kyoku', vi: 'bản nhạc, ca khúc' },
    ],
  },
  /* ── Bài 11 — dự kiến ── */
  '起': {
    hv: 'KHỞI', nghia: 'dậy, thức dậy; nổi lên', en: 'wake up / rise',
    on: ['キ'], kun: ['お・きます'],
    nho: 'Bên trái là 走 (chạy), bên phải là 己 (bản thân): tự mình bật DẬY rồi chạy đi.',
    tu: [
      { w: '{起|お}きます', ro: 'okimasu', vi: 'thức dậy' },
      { w: '{早|はや}く{起|お}きます', ro: 'hayaku okimasu', vi: 'dậy sớm' },
      { w: '{起|お}こします', ro: 'okoshimasu', vi: 'đánh thức' },
    ],
  },
  '寝': {
    hv: 'TẨM', nghia: 'ngủ, nằm ngủ', en: 'sleep',
    on: ['シン'], kun: ['ね・ます'],
    nho: 'Dưới mái nhà (宀), bên trái là chiếc giường dựng đứng (丬): vào nhà, lên giường NGỦ.',
    tu: [
      { w: '{寝|ね}ます', ro: 'nemasu', vi: 'ngủ, đi ngủ' },
      { w: '{寝|ね}る{前|まえ}に', ro: 'neru mae ni', vi: 'trước khi ngủ' },
      { w: '{寝坊|ねぼう}します', ro: 'nebou shimasu', vi: 'ngủ quên, dậy muộn' },
    ],
  },
  '働': {
    hv: 'ĐỘNG', nghia: 'làm việc, lao động', en: 'work',
    on: ['ドウ'], kun: ['はたら・きます'],
    nho: 'Người (亻) + 動 (chuyển động): con người chuyển động không ngừng = LÀM VIỆC. Chữ do người Nhật tự tạo.',
    tu: [
      { w: '{働|はたら}きます', ro: 'hatarakimasu', vi: 'làm việc' },
      { w: '{会社|かいしゃ}で{働|はたら}いています', ro: 'kaisha de hataraite imasu', vi: 'đang làm việc ở công ty' },
      { w: '{労働|ろうどう}', ro: 'roudou', vi: 'lao động' },
    ],
  },
  '始': {
    hv: 'THỦY', nghia: 'bắt đầu', en: 'begin',
    on: ['シ'], kun: ['はじ・めます', 'はじ・まります'],
    nho: 'Bên trái 女 (người mẹ), bên phải 台 (cái bệ): mọi sự sống BẮT ĐẦU từ người mẹ.',
    tu: [
      { w: '{始|はじ}めます', ro: 'hajimemasu', vi: 'bắt đầu (làm gì — Nを始めます)' },
      { w: '{始|はじ}まります', ro: 'hajimarimasu', vi: '(cái gì) bắt đầu — Nが始まります' },
      { w: '{開始|かいし}', ro: 'kaishi', vi: 'sự bắt đầu, khai mạc' },
    ],
  },
  '終': {
    hv: 'CHUNG', nghia: 'kết thúc, cuối', en: 'end',
    on: ['シュウ'], kun: ['お・わります'],
    nho: 'Bên trái 糸 (sợi chỉ), bên phải 冬 (mùa đông — cuối năm): cuối cuộn chỉ, cuối năm → KẾT THÚC.',
    tu: [
      { w: '{終|お}わります', ro: 'owarimasu', vi: 'kết thúc, xong' },
      { w: '{授業|じゅぎょう}が{終|お}わります', ro: 'jugyou ga owarimasu', vi: 'giờ học kết thúc' },
      { w: '{最終|さいしゅう}', ro: 'saishuu', vi: 'cuối cùng (chuyến cuối, ngày cuối)' },
    ],
  },
  '住': {
    hv: 'TRÚ', nghia: 'sống, cư trú', en: 'live / reside',
    on: ['ジュウ'], kun: ['す・みます'],
    nho: 'Người (亻) + 主 (chủ): người làm CHỦ một chỗ = sống ở đó.',
    tu: [
      { w: '{住|す}みます', ro: 'sumimasu', vi: 'sống, ở (住んでいます = đang sống)' },
      { w: '{住所|じゅうしょ}', ro: 'juusho', vi: 'địa chỉ' },
      { w: 'ハノイに{住|す}んでいます', ro: 'Hanoi ni sunde imasu', vi: 'đang sống ở Hà Nội' },
    ],
  },
  '通': {
    hv: 'THÔNG', nghia: 'đi qua; đi lại đều đặn; thông suốt', en: 'pass / commute',
    on: ['ツウ'], kun: ['かよ・います', 'とお・ります'],
    nho: 'Bộ 辶 (con đường) + 甬 (cái ống thông): con đường đi xuyên SUỐT, qua lại hằng ngày.',
    tu: [
      { w: '{通|かよ}います', ro: 'kayoimasu', vi: 'đi lại đều đặn, theo học (学校に通います)' },
      { w: '{交通|こうつう}', ro: 'koutsuu', vi: 'giao thông' },
      { w: '{通|とお}ります', ro: 'toorimasu', vi: 'đi qua' },
    ],
  },
  '活': {
    hv: 'HOẠT', nghia: 'sống, hoạt động', en: 'lively / activity',
    on: ['カツ'], kun: [],
    nho: 'Bộ 氵 (nước) + 舌 (cái lưỡi): lưỡi còn ướt nước là còn SỐNG, còn sinh hoạt.',
    tu: [
      { w: '{生活|せいかつ}', ro: 'seikatsu', vi: 'cuộc sống, sinh hoạt' },
      { w: '{活動|かつどう}', ro: 'katsudou', vi: 'hoạt động' },
      { w: '{日本|にほん}の{生活|せいかつ}', ro: 'Nihon no seikatsu', vi: 'cuộc sống ở Nhật' },
    ],
  },
  '初': {
    hv: 'SƠ', nghia: 'đầu tiên, lần đầu', en: 'first',
    on: ['ショ'], kun: ['はじ・め', 'はじ・めて'],
    nho: 'Bên trái 衤 (áo), bên phải 刀 (con dao): muốn may áo, nhát dao cắt vải là bước ĐẦU TIÊN.',
    tu: [
      { w: '{初|はじ}めて', ro: 'hajimete', vi: 'lần đầu tiên' },
      { w: '{初|はじ}め', ro: 'hajime', vi: 'lúc đầu, ban đầu' },
      { w: '{初|はじ}めまして', ro: 'hajimemashite', vi: 'rất vui được gặp (lần đầu gặp)' },
      { w: '{最初|さいしょ}', ro: 'saisho', vi: 'đầu tiên, trước hết' },
    ],
  },
  '忘': {
    hv: 'VONG', nghia: 'quên', en: 'forget',
    on: ['ボウ'], kun: ['わす・れます'],
    nho: 'Trên là 亡 (mất đi), dưới là 心 (trái tim): điều gì MẤT khỏi lòng là QUÊN.',
    tu: [
      { w: '{忘|わす}れます', ro: 'wasuremasu', vi: 'quên' },
      { w: '{忘|わす}れ{物|もの}', ro: 'wasuremono', vi: 'đồ bỏ quên' },
      { w: '{宿題|しゅくだい}を{忘|わす}れました', ro: 'shukudai o wasuremashita', vi: 'quên bài tập về nhà' },
    ],
  },
  '慣': {
    hv: 'QUÁN', nghia: 'quen', en: 'get used to',
    on: ['カン'], kun: ['な・れます'],
    nho: 'Bên trái 忄 (trái tim), bên phải 貫 (xuyên suốt): lòng trải qua mãi một việc thì QUEN.',
    tu: [
      { w: '{慣|な}れます', ro: 'naremasu', vi: 'quen (Nに慣れます)' },
      { w: '{習慣|しゅうかん}', ro: 'shuukan', vi: 'phong tục, thói quen' },
      { w: '{生活|せいかつ}に{慣|な}れました', ro: 'seikatsu ni naremashita', vi: 'đã quen với cuộc sống' },
    ],
  },
  '卒': {
    hv: 'TỐT', nghia: 'tốt nghiệp, kết thúc (khoá học)', en: 'graduate',
    on: ['ソツ'], kun: [],
    nho: 'Trên là chiếc mũ (亠), giữa hai người (人人), dưới là 十: những người đội mũ đứng thành hàng — hết khoá, ra trường.',
    tu: [
      { w: '{卒業|そつぎょう}', ro: 'sotsugyou', vi: 'tốt nghiệp' },
      { w: '{卒業|そつぎょう}します', ro: 'sotsugyou shimasu', vi: 'tốt nghiệp (大学を卒業します)' },
      { w: '{卒業式|そつぎょうしき}', ro: 'sotsugyoushiki', vi: 'lễ tốt nghiệp' },
    ],
  },

  /* ── Bài 12 — dự kiến ── */
  '病': {
    hv: 'BỆNH', nghia: 'bệnh, ốm', en: 'sick',
    on: ['ビョウ'], kun: ['やまい'],
    nho: 'Bộ 疒 là người nằm trên giường bệnh (nét chấm và nét phẩy như giọt mồ hôi) — mọi chữ về BỆNH đều có bộ này.',
    tu: [
      { w: '{病気|びょうき}', ro: 'byouki', vi: 'bệnh, ốm' },
      { w: '{病院|びょういん}', ro: 'byouin', vi: 'bệnh viện' },
    ],
  },
  '院': {
    hv: 'VIỆN', nghia: 'viện, toà nhà lớn', en: 'institution',
    on: ['イン'], kun: [],
    nho: 'Bên trái 阝 (gò đất), bên phải 完 (hoàn chỉnh): toà nhà lớn xây xong trên gò = VIỆN.',
    tu: [
      { w: '{病院|びょういん}', ro: 'byouin', vi: 'bệnh viện' },
      { w: '{入院|にゅういん}します', ro: 'nyuuin shimasu', vi: 'nhập viện' },
      { w: '{大学院|だいがくいん}', ro: 'daigakuin', vi: 'cao học, sau đại học' },
    ],
  },
  '医': {
    hv: 'Y', nghia: 'y, chữa bệnh', en: 'medicine / doctor',
    on: ['イ'], kun: [],
    nho: 'Cái hộp (匚) đựng mũi tên (矢): mũi tên đã được nhổ ra, cất đi — việc của thầY thuốc.',
    tu: [
      { w: '{医者|いしゃ}', ro: 'isha', vi: 'bác sĩ' },
      { w: '{歯医者|はいしゃ}', ro: 'haisha', vi: 'nha sĩ' },
      { w: '{医学|いがく}', ro: 'igaku', vi: 'y học' },
    ],
  },
  '者': {
    hv: 'GIẢ', nghia: 'người (làm việc gì)', en: 'person',
    on: ['シャ'], kun: ['もの'],
    nho: 'Ghép sau một chữ chỉ việc để thành "NGƯỜI làm việc đó": 医 (chữa bệnh) + 者 = {医者|いしゃ} bác sĩ.',
    tu: [
      { w: '{医者|いしゃ}', ro: 'isha', vi: 'bác sĩ' },
      { w: '{歯医者|はいしゃ}', ro: 'haisha', vi: 'nha sĩ' },
      { w: '{学者|がくしゃ}', ro: 'gakusha', vi: 'học giả' },
    ],
  },
  '体': {
    hv: 'THỂ', nghia: 'cơ thể, thân thể', en: 'body',
    on: ['タイ'], kun: ['からだ'],
    nho: 'Người (亻) + 本 (gốc, rễ): cái GỐC của con người là thân thể.',
    tu: [
      { w: '{体|からだ}', ro: 'karada', vi: 'cơ thể' },
      { w: '{体|からだ}にいい', ro: 'karada ni ii', vi: 'tốt cho sức khoẻ' },
      { w: '{体育館|たいいくかん}', ro: 'taiikukan', vi: 'nhà thi đấu thể thao' },
    ],
  },
  '頭': {
    hv: 'ĐẦU', nghia: 'đầu', en: 'head',
    on: ['トウ', 'ズ'], kun: ['あたま'],
    nho: 'Bên trái 豆 (cái bát có chân), bên phải 頁 (cái đầu người): cái đầu tròn đặt trên cổ như bát trên chân — ĐẦU.',
    tu: [
      { w: '{頭|あたま}', ro: 'atama', vi: 'đầu' },
      { w: '{頭|あたま}が{痛|いた}い', ro: 'atama ga itai', vi: 'đau đầu' },
      { w: '{頭|あたま}がいい', ro: 'atama ga ii', vi: 'thông minh' },
      { w: '{頭痛|ずつう}', ro: 'zutsuu', vi: 'chứng đau đầu' },
    ],
  },
  '薬': {
    hv: 'DƯỢC', nghia: 'thuốc', en: 'medicine',
    on: ['ヤク'], kun: ['くすり'],
    nho: 'Bộ 艹 (cỏ) + 楽 (vui): loại cỏ làm người bệnh VUI khoẻ trở lại = THUỐC.',
    tu: [
      { w: '{薬|くすり}', ro: 'kusuri', vi: 'thuốc (薬を飲みます = uống thuốc)' },
      { w: '{薬局|やっきょく}', ro: 'yakkyoku', vi: 'hiệu thuốc' },
      { w: '{薬剤師|やくざいし}', ro: 'yakuzaishi', vi: 'dược sĩ' },
    ],
  },
  '熱': {
    hv: 'NHIỆT', nghia: 'nóng; sốt', en: 'heat / fever',
    on: ['ネツ'], kun: ['あつ・い'],
    nho: 'Bốn chấm 灬 ở dưới là ngọn LỬA: cái gì đặt trên lửa thì NÓNG.',
    tu: [
      { w: '{熱|ねつ}', ro: 'netsu', vi: 'cơn sốt (熱があります = bị sốt)' },
      { w: '{熱|あつ}い', ro: 'atsui', vi: 'nóng (đồ vật: 熱いお茶)' },
      { w: '{熱心|ねっしん}', ro: 'nesshin', vi: 'nhiệt tình, chăm chỉ' },
    ],
  },
  '痛': {
    hv: 'THỐNG', nghia: 'đau', en: 'painful',
    on: ['ツウ'], kun: ['いた・い'],
    nho: 'Bộ bệnh 疒 + 甬 (cái ống): bệnh chạy suốt trong người như qua ống → ĐAU.',
    tu: [
      { w: '{痛|いた}い', ro: 'itai', vi: 'đau' },
      { w: '{頭|あたま}が{痛|いた}いです', ro: 'atama ga itai desu', vi: 'tôi đau đầu' },
      { w: '{頭痛|ずつう}', ro: 'zutsuu', vi: 'chứng đau đầu' },
    ],
  },
  '歯': {
    hv: 'XỈ', nghia: 'răng', en: 'tooth',
    on: ['シ'], kun: ['は'],
    nho: 'Trong khuôn miệng (凵) có những chiếc răng (米) xếp hàng, phía trên là 止: RĂNG giữ đồ ăn lại.',
    tu: [
      { w: '{歯|は}', ro: 'ha', vi: 'răng' },
      { w: '{歯医者|はいしゃ}', ro: 'haisha', vi: 'nha sĩ' },
      { w: '{歯|は}を{磨|みが}きます', ro: 'ha o migakimasu', vi: 'đánh răng' },
    ],
  },
  '悪': {
    hv: 'ÁC', nghia: 'xấu, tệ', en: 'bad',
    on: ['アク'], kun: ['わる・い'],
    nho: 'Trên là 亜 (méo, kém), dưới là 心 (trái tim): lòng dạ méo mó = XẤU.',
    tu: [
      { w: '{悪|わる}い', ro: 'warui', vi: 'xấu, tệ' },
      { w: '{気持|きも}ちが{悪|わる}い', ro: 'kimochi ga warui', vi: 'buồn nôn, khó chịu' },
      { w: '{調子|ちょうし}が{悪|わる}い', ro: 'choushi ga warui', vi: 'không được khoẻ, trục trặc' },
    ],
  },
  '治': {
    hv: 'TRỊ', nghia: 'chữa, khỏi bệnh; cai trị', en: 'cure / govern',
    on: ['チ', 'ジ'], kun: ['なお・ります', 'なお・します'],
    nho: 'Bộ 氵 (nước) + 台 (cái bệ): đắp bệ ngăn nước lũ (trị thuỷ) — dẹp yên cái xấu, CHỮA khỏi bệnh.',
    tu: [
      { w: '{治|なお}ります', ro: 'naorimasu', vi: '(bệnh) khỏi' },
      { w: '{治|なお}します', ro: 'naoshimasu', vi: 'chữa (bệnh)' },
      { w: '{政治|せいじ}', ro: 'seiji', vi: 'chính trị' },
    ],
  },

  /* ── Bài 13 — dự kiến ── */
  '男': {
    hv: 'NAM', nghia: 'đàn ông, con trai', en: 'man',
    on: ['ダン'], kun: ['おとこ'],
    nho: 'Trên là 田 (ruộng), dưới là 力 (sức): người dùng SỨC làm RUỘNG = đàn ông.',
    tu: [
      { w: '{男|おとこ}の{人|ひと}', ro: 'otoko no hito', vi: 'người đàn ông' },
      { w: '{男|おとこ}の{子|こ}', ro: 'otoko no ko', vi: 'bé trai' },
      { w: '{男性|だんせい}', ro: 'dansei', vi: 'nam giới' },
    ],
  },
  '女': {
    hv: 'NỮ', nghia: 'phụ nữ, con gái', en: 'woman',
    on: ['ジョ'], kun: ['おんな'],
    nho: 'Hình người PHỤ NỮ ngồi quỳ, hai tay đan trước ngực.',
    tu: [
      { w: '{女|おんな}の{人|ひと}', ro: 'onna no hito', vi: 'người phụ nữ' },
      { w: '{女|おんな}の{子|こ}', ro: 'onna no ko', vi: 'bé gái' },
      { w: '{女性|じょせい}', ro: 'josei', vi: 'nữ giới' },
      { w: '{彼女|かのじょ}', ro: 'kanojo', vi: 'cô ấy; bạn gái' },
    ],
  },
  '赤': {
    hv: 'XÍCH', nghia: 'đỏ', en: 'red',
    on: ['セキ'], kun: ['あか・い'],
    nho: 'Trên là 土 (đất), dưới là lửa bùng lên: đất bị lửa nung thành màu ĐỎ.',
    tu: [
      { w: '{赤|あか}い', ro: 'akai', vi: 'đỏ' },
      { w: '{赤|あか}', ro: 'aka', vi: 'màu đỏ' },
      { w: '{赤|あか}ちゃん', ro: 'akachan', vi: 'em bé (da đỏ hỏn)' },
    ],
  },
  '青': {
    hv: 'THANH', nghia: 'xanh (lam, lá)', en: 'blue',
    on: ['セイ'], kun: ['あお・い'],
    nho: 'Trên là 生 (cây non mọc lên), dưới là 月: màu của mầm cây non = XANH.',
    tu: [
      { w: '{青|あお}い', ro: 'aoi', vi: 'xanh' },
      { w: '{青|あお}', ro: 'ao', vi: 'màu xanh' },
      { w: '{青空|あおぞら}', ro: 'aozora', vi: 'bầu trời xanh' },
    ],
  },
  '黄': {
    hv: 'HOÀNG', nghia: 'vàng (màu)', en: 'yellow',
    on: ['コウ', 'オウ'], kun: ['き'],
    nho: 'Ở giữa là 田 (cánh đồng): mùa gặt, cánh đồng lúa chín VÀNG.',
    tu: [
      { w: '{黄色|きいろ}い', ro: 'kiiroi', vi: 'vàng (tính từ — chú ý có 色)' },
      { w: '{黄色|きいろ}', ro: 'kiiro', vi: 'màu vàng' },
    ],
  },
  '色': {
    hv: 'SẮC', nghia: 'màu sắc', en: 'color',
    on: ['ショク', 'シキ'], kun: ['いろ'],
    nho: 'Hình một người cúi (⺈) trên một người đang quỳ (巴): mặt đổi SẮC vì ngượng.',
    tu: [
      { w: '{色|いろ}', ro: 'iro', vi: 'màu' },
      { w: '{黄色|きいろ}', ro: 'kiiro', vi: 'màu vàng' },
      { w: '{茶色|ちゃいろ}', ro: 'chairo', vi: 'màu nâu' },
      { w: '{景色|けしき}', ro: 'keshiki', vi: 'phong cảnh (đọc しき)' },
    ],
  },
  '若': {
    hv: 'NHƯỢC', nghia: 'trẻ', en: 'young',
    on: ['ジャク'], kun: ['わか・い'],
    nho: 'Trên là 艹 (cỏ), dưới là 右 (tay phải): tay hái những mầm cỏ non — TRẺ.',
    tu: [
      { w: '{若|わか}い', ro: 'wakai', vi: 'trẻ' },
      { w: '{若|わか}い{人|ひと}', ro: 'wakai hito', vi: 'người trẻ, giới trẻ' },
      { w: '{若者|わかもの}', ro: 'wakamono', vi: 'thanh niên' },
    ],
  },
  '売': {
    hv: 'MẠI', nghia: 'bán', en: 'sell',
    on: ['バイ'], kun: ['う・ります'],
    nho: 'Người (士) mang hàng ra đặt dưới mái che để BÁN. Đi cặp với 買 (mua): {売買|ばいばい} = mua bán.',
    tu: [
      { w: '{売|う}ります', ro: 'urimasu', vi: 'bán' },
      { w: '{売|う}り{場|ば}', ro: 'uriba', vi: 'quầy bán hàng' },
      { w: '{売店|ばいてん}', ro: 'baiten', vi: 'quầy bán hàng nhỏ, ki-ốt' },
    ],
  },
  '知': {
    hv: 'TRI', nghia: 'biết', en: 'know',
    on: ['チ'], kun: ['し・ります'],
    nho: 'Bên trái 矢 (mũi tên), bên phải 口 (miệng): nói trúng như tên bắn — là người BIẾT.',
    tu: [
      { w: '{知|し}ります', ro: 'shirimasu', vi: 'biết (知っています = đang biết)' },
      { w: '{知|し}っています', ro: 'shitte imasu', vi: 'biết' },
      { w: '{知|し}りません', ro: 'shirimasen', vi: 'không biết (không nói 知っていません)' },
    ],
  },
  '場': {
    hv: 'TRƯỜNG', nghia: 'nơi, chỗ', en: 'place',
    on: ['ジョウ'], kun: ['ば'],
    nho: 'Bên trái 土 (đất), bên phải 昜 (mặt trời toả nắng): bãi đất có nắng — NƠI mọi người tụ lại.',
    tu: [
      { w: '{場所|ばしょ}', ro: 'basho', vi: 'địa điểm, chỗ' },
      { w: '{会場|かいじょう}', ro: 'kaijou', vi: 'hội trường, nơi tổ chức' },
      { w: '{売|う}り{場|ば}', ro: 'uriba', vi: 'quầy bán hàng' },
      { w: '{入場料|にゅうじょうりょう}', ro: 'nyuujouryou', vi: 'phí vào cửa' },
    ],
  },
  '所': {
    hv: 'SỞ', nghia: 'chỗ, nơi', en: 'place',
    on: ['ショ'], kun: ['ところ'],
    nho: 'Bên trái 戸 (cánh cửa), bên phải 斤 (cái rìu): nơi có cửa và rìu chặt củi = CHỖ ở.',
    tu: [
      { w: '{場所|ばしょ}', ro: 'basho', vi: 'địa điểm' },
      { w: '{住所|じゅうしょ}', ro: 'juusho', vi: 'địa chỉ' },
      { w: '{台所|だいどころ}', ro: 'daidokoro', vi: 'nhà bếp (đọc どころ)' },
      { w: '{所|ところ}', ro: 'tokoro', vi: 'nơi, chỗ' },
    ],
  },
  '品': {
    hv: 'PHẨM', nghia: 'hàng hoá, phẩm vật', en: 'goods',
    on: ['ヒン'], kun: ['しな'],
    nho: 'Ba cái 口 chồng lên nhau như những kiện HÀNG xếp chồng trong kho.',
    tu: [
      { w: '{電気製品|でんきせいひん}', ro: 'denki seihin', vi: 'đồ điện' },
      { w: '{品物|しなもの}', ro: 'shinamono', vi: 'hàng hoá' },
      { w: '{作品|さくひん}', ro: 'sakuhin', vi: 'tác phẩm' },
    ],
  },

  /* ── Bài 14 — dự kiến ── */
  '田': {
    hv: 'ĐIỀN', nghia: 'ruộng lúa', en: 'rice field',
    on: ['デン'], kun: ['た', 'だ'],
    nho: 'Hình thửa RUỘNG chia bốn ô bằng bờ.',
    tu: [
      { w: '{田舎|いなか}', ro: 'inaka', vi: 'nông thôn, quê (đọc đặc biệt いなか)' },
      { w: '{田中|たなか}さん', ro: 'Tanaka-san', vi: 'anh/chị Tanaka' },
      { w: '{山田|やまだ}さん', ro: 'Yamada-san', vi: 'anh/chị Yamada (た → だ)' },
    ],
  },
  '空': {
    hv: 'KHÔNG', nghia: 'bầu trời; trống rỗng', en: 'sky / empty',
    on: ['クウ'], kun: ['そら', 'あ・きます'],
    nho: 'Trên là 穴 (cái hang), dưới là 工: nhìn từ miệng hang lên thấy khoảng TRỐNG — bầu TRỜI.',
    tu: [
      { w: '{空気|くうき}', ro: 'kuuki', vi: 'không khí' },
      { w: '{空|そら}', ro: 'sora', vi: 'bầu trời' },
      { w: '{空港|くうこう}', ro: 'kuukou', vi: 'sân bay' },
      { w: '{青空|あおぞら}', ro: 'aozora', vi: 'trời xanh' },
    ],
  },
  '字': {
    hv: 'TỰ', nghia: 'chữ', en: 'character / letter',
    on: ['ジ'], kun: [],
    nho: 'Dưới mái nhà (宀) có đứa trẻ (子) ngồi học CHỮ.',
    tu: [
      { w: '{字|じ}', ro: 'ji', vi: 'chữ (字がきれいです = chữ đẹp)' },
      { w: '{漢字|かんじ}', ro: 'kanji', vi: 'chữ Hán' },
      { w: '{文字|もじ}', ro: 'moji', vi: 'chữ viết, ký tự' },
    ],
  },
  '思': {
    hv: 'TƯ', nghia: 'nghĩ', en: 'think',
    on: ['シ'], kun: ['おも・います'],
    nho: 'Trên là 田 (như bộ não nhìn từ trên xuống), dưới là 心 (tim): đầu và lòng cùng làm việc = NGHĨ.',
    tu: [
      { w: '{思|おも}います', ro: 'omoimasu', vi: 'nghĩ (～と思います)' },
      { w: '{私|わたし}もそう{思|おも}います', ro: 'watashi mo sou omoimasu', vi: 'tôi cũng nghĩ vậy' },
      { w: '{思|おも}い{出|で}', ro: 'omoide', vi: 'kỷ niệm' },
    ],
  },
  '便': {
    hv: 'TIỆN', nghia: 'tiện; thư, chuyến (bưu điện, máy bay)', en: 'convenient',
    on: ['ベン', 'ビン'], kun: ['たよ・り'],
    nho: 'Người (亻) + 更 (sửa đổi): người sửa cách làm cho TIỆN hơn.',
    tu: [
      { w: '{便利|べんり}', ro: 'benri', vi: 'tiện lợi' },
      { w: '{不便|ふべん}', ro: 'fuben', vi: 'bất tiện' },
      { w: '{郵便局|ゆうびんきょく}', ro: 'yuubinkyoku', vi: 'bưu điện (đọc びん)' },
    ],
  },
  '利': {
    hv: 'LỢI', nghia: 'lợi, có ích; sắc', en: 'profit / useful',
    on: ['リ'], kun: [],
    nho: 'Bên trái 禾 (cây lúa), bên phải 刂 (con dao): dao sắc gặt lúa — có LỢI.',
    tu: [
      { w: '{便利|べんり}', ro: 'benri', vi: 'tiện lợi' },
      { w: '{利用|りよう}します', ro: 'riyou shimasu', vi: 'sử dụng, tận dụng' },
    ],
  },
  '不': {
    hv: 'BẤT', nghia: 'không (phủ định)', en: 'not / un-',
    on: ['フ', 'ブ'], kun: [],
    nho: 'Hình con chim bay vút lên trời (一 là bầu trời) mà KHÔNG quay lại. Đứng trước một chữ để phủ định: 不 + 便 = bất tiện.',
    tu: [
      { w: '{不便|ふべん}', ro: 'fuben', vi: 'bất tiện' },
      { w: '{不安|ふあん}', ro: 'fuan', vi: 'bất an, lo lắng' },
    ],
  },
  '同': {
    hv: 'ĐỒNG', nghia: 'giống, cùng', en: 'same',
    on: ['ドウ'], kun: ['おな・じ'],
    nho: 'Dưới một mái che (冂) có một (一) cái miệng (口): mọi người nói CÙNG một câu.',
    tu: [
      { w: '{同|おな}じ', ro: 'onaji', vi: 'giống nhau, cùng (同じN — không có の)' },
      { w: '{同|おな}じクラス', ro: 'onaji kurasu', vi: 'cùng lớp' },
      { w: '{同時|どうじ}に', ro: 'douji ni', vi: 'cùng lúc' },
    ],
  },
  '笑': {
    hv: 'TIẾU', nghia: 'cười', en: 'laugh',
    on: ['ショウ'], kun: ['わら・います'],
    nho: 'Trên là 竹 (tre), dưới là 夭 (người nghiêng đầu): như lá tre rung rinh, người ngả nghiêng CƯỜI.',
    tu: [
      { w: '{笑|わら}います', ro: 'waraimasu', vi: 'cười' },
      { w: '{笑顔|えがお}', ro: 'egao', vi: 'khuôn mặt tươi cười' },
    ],
  },
  '経': {
    hv: 'KINH', nghia: 'trải qua; kinh tế', en: 'pass through',
    on: ['ケイ'], kun: [],
    nho: 'Bên trái 糸 (sợi chỉ): sợi dọc trên khung cửi, chỉ đi suốt từ đầu tới cuối — TRẢI QUA.',
    tu: [
      { w: '{経験|けいけん}', ro: 'keiken', vi: 'kinh nghiệm, trải nghiệm' },
      { w: '{経済|けいざい}', ro: 'keizai', vi: 'kinh tế' },
    ],
  },
  '験': {
    hv: 'NGHIỆM', nghia: 'thử, kiểm nghiệm', en: 'test',
    on: ['ケン'], kun: [],
    nho: 'Bên trái 馬 (con ngựa): người xưa xem xét kỹ ngựa trước khi mua — THỬ NGHIỆM.',
    tu: [
      { w: '{経験|けいけん}します', ro: 'keiken shimasu', vi: 'trải nghiệm' },
      { w: '{試験|しけん}', ro: 'shiken', vi: 'kỳ thi' },
    ],
  },
  '化': {
    hv: 'HOÁ', nghia: 'biến đổi, hoá', en: 'change',
    on: ['カ', 'ケ'], kun: ['ば・けます'],
    nho: 'Bên trái người đứng (亻), bên phải người lộn ngược (匕): đứng rồi lộn ngược — BIẾN HOÁ.',
    tu: [
      { w: '{化粧|けしょう}します', ro: 'keshou shimasu', vi: 'trang điểm (đọc け)' },
      { w: '{文化|ぶんか}', ro: 'bunka', vi: 'văn hoá' },
      { w: '{変化|へんか}', ro: 'henka', vi: 'sự thay đổi' },
    ],
  },

  /* ── Bài 15 — dự kiến ── */
  '天': {
    hv: 'THIÊN', nghia: 'trời', en: 'heaven / sky',
    on: ['テン'], kun: ['あめ'],
    nho: 'Người dang tay (大) và một nét ngang trên đầu: thứ ở trên đầu người là TRỜI.',
    tu: [
      { w: '{天気|てんき}', ro: 'tenki', vi: 'thời tiết' },
      { w: '{天気予報|てんきよほう}', ro: 'tenki yohou', vi: 'dự báo thời tiết' },
      { w: '{天|てん}ぷら', ro: 'tenpura', vi: 'món tempura' },
    ],
  },
  '気': {
    hv: 'KHÍ', nghia: 'khí, hơi; tinh thần', en: 'spirit / air',
    on: ['キ', 'ケ'], kun: [],
    nho: 'Hơi nước (气) bốc lên từ nồi gạo (メ): KHÍ, hơi — thứ vô hình mà có thật.',
    tu: [
      { w: '{天気|てんき}', ro: 'tenki', vi: 'thời tiết' },
      { w: '{元気|げんき}', ro: 'genki', vi: 'khoẻ mạnh' },
      { w: '{空気|くうき}', ro: 'kuuki', vi: 'không khí' },
      { w: '{人気|にんき}', ro: 'ninki', vi: 'được yêu thích' },
      { w: '{気持|きも}ち', ro: 'kimochi', vi: 'cảm giác, tâm trạng' },
    ],
  },
  '晴': {
    hv: 'TÌNH', nghia: 'trời nắng, quang đãng', en: 'clear up',
    on: ['セイ'], kun: ['は・れます'],
    nho: 'Bên trái 日 (mặt trời), bên phải 青 (xanh): mặt trời trên nền trời xanh = trời QUANG.',
    tu: [
      { w: '{晴|は}れます', ro: 'haremasu', vi: 'trời nắng, quang' },
      { w: '{晴|は}れ', ro: 'hare', vi: 'trời nắng' },
      { w: '{明日|あした}は{晴|は}れるでしょう', ro: 'ashita wa hareru deshou', vi: 'ngày mai chắc trời nắng' },
    ],
  },
  '雨': {
    hv: 'VŨ', nghia: 'mưa', en: 'rain',
    on: ['ウ'], kun: ['あめ'],
    nho: 'Nét ngang trên là bầu trời, khung 冂 là đám mây, bốn chấm là giọt MƯA rơi xuống.',
    tu: [
      { w: '{雨|あめ}', ro: 'ame', vi: 'mưa' },
      { w: '{雨|あめ}が{降|ふ}ります', ro: 'ame ga furimasu', vi: 'trời mưa' },
      { w: '{大雨|おおあめ}', ro: 'ooame', vi: 'mưa to' },
    ],
  },
  '曇': {
    hv: 'ĐÀM', nghia: 'trời nhiều mây, âm u', en: 'cloudy',
    on: ['ドン'], kun: ['くも・ります'],
    nho: 'Trên là 日 (mặt trời), dưới là 雲 (mây): mặt trời bị MÂY che.',
    tu: [
      { w: '{曇|くも}り', ro: 'kumori', vi: 'trời nhiều mây' },
      { w: '{曇|くも}ります', ro: 'kumorimasu', vi: 'trời kéo mây' },
    ],
  },
  '降': {
    hv: 'GIÁNG', nghia: 'rơi (mưa, tuyết); xuống (xe)', en: 'fall / get off',
    on: ['コウ'], kun: ['ふ・ります', 'お・ります'],
    nho: 'Bên trái 阝 (gò đất), bên phải là hai bàn chân bước xuống: đi XUỐNG dốc — mưa RƠI xuống, người XUỐNG xe.',
    tu: [
      { w: '{雨|あめ}が{降|ふ}ります', ro: 'ame ga furimasu', vi: 'mưa rơi, trời mưa' },
      { w: '{降|お}ります', ro: 'orimasu', vi: 'xuống (xe, tàu) — Nを降ります' },
    ],
  },
  '台': {
    hv: 'ĐÀI', nghia: 'bệ, đài; (đếm) xe, máy', en: 'stand / platform',
    on: ['ダイ', 'タイ'], kun: [],
    nho: 'Cái miệng (口) đặt trên một chỗ cao (ム): BỆ cao để đứng nói.',
    tu: [
      { w: '{台風|たいふう}', ro: 'taifuu', vi: 'bão (đọc たい)' },
      { w: '{台所|だいどころ}', ro: 'daidokoro', vi: 'nhà bếp' },
      { w: '{一台|いちだい}', ro: 'ichidai', vi: 'một chiếc (xe, máy)' },
    ],
  },
  '震': {
    hv: 'CHẤN', nghia: 'rung, chấn động', en: 'quake',
    on: ['シン'], kun: ['ふる・えます'],
    nho: 'Trên là 雨 (mưa), dưới là 辰 (sấm): mưa giông sấm sét làm mặt đất RUNG.',
    tu: [
      { w: '{地震|じしん}', ro: 'jishin', vi: 'động đất' },
      { w: '{震|ふる}えます', ro: 'furuemasu', vi: 'run, rung' },
    ],
  },
  '事': {
    hv: 'SỰ', nghia: 'việc, sự việc', en: 'thing / matter',
    on: ['ジ'], kun: ['こと'],
    nho: 'Hình bàn tay cầm cây bút ghi chép: ghi lại công VIỆC.',
    tu: [
      { w: '{事故|じこ}', ro: 'jiko', vi: 'tai nạn, sự cố' },
      { w: '{仕事|しごと}', ro: 'shigoto', vi: 'công việc' },
      { w: '{食事|しょくじ}', ro: 'shokuji', vi: 'bữa ăn' },
      { w: '{用事|ようじ}', ro: 'youji', vi: 'việc bận' },
      { w: 'お{大事|だいじ}に', ro: 'odaiji ni', vi: 'chúc mau khoẻ' },
    ],
  },
  '故': {
    hv: 'CỐ', nghia: 'sự cố; cũ', en: 'accident / old',
    on: ['コ'], kun: [],
    nho: 'Bên trái 古 (cũ), bên phải 攵 (đánh, gõ): đồ cũ bị va đập — xảy ra SỰ CỐ.',
    tu: [
      { w: '{事故|じこ}', ro: 'jiko', vi: 'tai nạn' },
      { w: '{故障|こしょう}', ro: 'koshou', vi: 'hỏng hóc' },
    ],
  },
  '急': {
    hv: 'CẤP', nghia: 'gấp, vội', en: 'hurry',
    on: ['キュウ'], kun: ['いそ・ぎます'],
    nho: 'Trên là người (⺈), giữa là bàn tay (ヨ), dưới là 心 (tim): tim như bị tay túm kéo đi — VỘI.',
    tu: [
      { w: '{急|いそ}ぎます', ro: 'isogimasu', vi: 'vội, khẩn trương' },
      { w: '{急|きゅう}に', ro: 'kyuu ni', vi: 'đột nhiên' },
      { w: '{急行|きゅうこう}', ro: 'kyuukou', vi: 'tàu nhanh' },
    ],
  },
  '心': {
    hv: 'TÂM', nghia: 'tim, lòng', en: 'heart',
    on: ['シン'], kun: ['こころ'],
    nho: 'Hình TRÁI TIM với ba giọt máu. Đứng dưới chữ khác thì chữ đó liên quan đến lòng: 思 (nghĩ), 忘 (quên), 急 (vội).',
    tu: [
      { w: '{心配|しんぱい}', ro: 'shinpai', vi: 'lo lắng' },
      { w: '{心|こころ}', ro: 'kokoro', vi: 'trái tim, tấm lòng' },
      { w: '{安心|あんしん}', ro: 'anshin', vi: 'yên tâm' },
    ],
  },
};
