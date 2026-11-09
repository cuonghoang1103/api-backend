/**
 * Chữ Hán MỚI của Bài 23 (子どもの頃 — tiếp sau sách, N4) cho thẻ chữ Hán — cùng định dạng hanTu.ts.
 * 15 chữ: 頃 幼 供 命 令 許 可 飼 拾 投 逃 片 厳 虫 反 (N3 theo các bảng tham khảo phổ biến; 虫 có bảng xếp N4, 厳・飼 có
 * bảng xếp N2 — JLPT không công bố danh sách chữ chính thức) — bảng `b23-han-tu` trong bai23.ts.
 * Cách nhớ: theo cấu tạo chữ khi chắc chắn; chữ hình thanh thì ghi rõ phần nào gợi nghĩa / gợi âm; chữ mà mẹo nhìn hình
 * không phải gốc chữ (頃, 厳, 可) thì nói rõ là mẹo. Từ đi chung ưu tiên từ dùng trong bai23.ts.
 * On / Kun theo bảng thường dụng (常用): 頃 chỉ có âm Kun ころ (ケイ ngoài bảng); 令 可 chỉ có On.
 * Tệp chỉ có `import type` — tải chậm như hanTu.ts.
 */
import type { HanTu } from '@/components/sach-hoc/kanji';

export const HAN_TU_23: Record<string, HanTu> = {
  '頃': {
    hv: 'KHOẢNH', nghia: 'khoảng (thời gian), thuở, hồi', en: 'time / about',
    on: [], kun: ['ころ'],
    nho: 'Bên trái 匕 (người ngả nghiêng), bên phải 頁 (cái đầu): gốc chữ là "đầu nghiêng", về sau mượn để chỉ KHOẢNG THỜI GIAN. Mẹo nhìn (không phải gốc chữ): cái đầu nghiêng ngả nhớ lại THUỞ xưa → 子どもの頃. Sau số giờ đọc ごろ: 3時頃 (さんじごろ). Âm On ケイ nằm ngoài bảng thường dụng.',
    tu: [
      { w: '{子|こ}どもの{頃|ころ}', ro: 'kodomo no koro', vi: 'hồi nhỏ, thời thơ ấu' },
      { w: '{小|ちい}さい{頃|ころ}', ro: 'chiisai koro', vi: 'hồi còn bé' },
      { w: '{若|わか}い{頃|ころ}', ro: 'wakai koro', vi: 'thời trẻ' },
      { w: '3{時頃|じごろ}', ro: 'sanji goro', vi: 'khoảng 3 giờ' },
      { w: '{日頃|ひごろ}', ro: 'higoro', vi: 'thường ngày (N2)' },
    ],
  },
  '幼': {
    hv: 'ẤU', nghia: 'nhỏ, thơ ấu, non nớt', en: 'infancy / young',
    on: ['ヨウ'], kun: ['おさな・い'],
    nho: 'Bên trái 幺 (sợi tơ mảnh — nhỏ bé), bên phải 力 (sức): sức còn NHỎ YẾU = ẤU (thơ) → 幼い, 幼稚園. Khác 幻 (ảo — không có 力).',
    tu: [
      { w: '{幼|おさな}い', ro: 'osanai', vi: 'còn nhỏ, non nớt' },
      { w: '{幼稚園|ようちえん}', ro: 'youchien', vi: 'trường mẫu giáo' },
      { w: '{幼|おさな}なじみ', ro: 'osananajimi', vi: 'bạn thuở nhỏ (N2)' },
      { w: '{幼児|ようじ}', ro: 'youji', vi: 'trẻ nhỏ (N2)' },
    ],
  },
  '供': {
    hv: 'CUNG', nghia: 'dâng, cung cấp; đi theo hầu', en: 'offer / attend',
    on: ['キョウ', 'ク'], kun: ['そな・える', 'とも'],
    nho: 'Bên trái 亻 (người), bên phải 共 (gợi âm キョウ; vốn vẽ hai tay cùng nâng một vật): người nâng đồ DÂNG lên = CUNG (cấp) → 提供. Âm とも = người đi theo hầu (お供). Trong 子供 (こども) chữ này chỉ là mượn âm — khoá này hay viết 子ども, gặp 子供 thì đọc như nhau.',
    tu: [
      { w: '{子供|こども}', ro: 'kodomo', vi: 'trẻ con (= 子ども)' },
      { w: 'お{供|とも}', ro: 'otomo', vi: 'sự đi theo, người đi cùng (N2)' },
      { w: '{提供|ていきょう}', ro: 'teikyou', vi: 'cung cấp, tài trợ (N2)' },
    ],
  },
  '命': {
    hv: 'MỆNH', nghia: 'mệnh lệnh; sinh mệnh, mạng sống', en: 'command / life',
    on: ['メイ', 'ミョウ'], kun: ['いのち'],
    nho: 'Bên trái 口 (miệng), bên phải 令 (lệnh — chữ mới cùng bài): miệng BAN LỆNH = MỆNH (lệnh); điều trời "ra lệnh" cho mỗi người là SINH MỆNH → いのち. Học cặp 命令 (mệnh lệnh) một lần là nhớ cả 命 lẫn 令.',
    tu: [
      { w: '{命令|めいれい}', ro: 'meirei', vi: 'mệnh lệnh, ra lệnh' },
      { w: '{命|いのち}', ro: 'inochi', vi: 'mạng sống, sinh mạng (N3)' },
      { w: '{一生懸命|いっしょうけんめい}', ro: 'isshoukenmei', vi: 'hết sức, chăm chỉ (đã học)' },
      { w: '{生命|せいめい}', ro: 'seimei', vi: 'sinh mệnh (N2)' },
    ],
  },
  '令': {
    hv: 'LỆNH', nghia: 'lệnh, ra lệnh', en: 'order',
    on: ['レイ'], kun: [],
    nho: 'Trên là 亼 (mái che — nơi người trên ngồi), dưới là 卩 (người quỳ): người QUỲ dưới mái nhà NGHE LỆNH = LỆNH. Thêm 口 bên trái thành 命. Khác 今 (bây giờ — dưới là nét gập, không phải 卩).',
    tu: [
      { w: '{命令|めいれい}', ro: 'meirei', vi: 'mệnh lệnh' },
      { w: '{命令形|めいれいけい}', ro: 'meireikei', vi: 'thể mệnh lệnh (ngữ pháp Bài 23)' },
      { w: '{令和|れいわ}', ro: 'reiwa', vi: 'niên hiệu Reiwa (từ 2019)' },
    ],
  },
  '許': {
    hv: 'HỨA', nghia: 'cho phép, tha thứ', en: 'permit / forgive',
    on: ['キョ'], kun: ['ゆる・す'],
    nho: 'Bên trái 言 (lời nói), bên phải 午 (gợi âm キョ): LỜI nói đồng ý = cho phép, tha cho → 許す (Bài 19), 許可. Khác 話 (nói — phải là 舌) và 計 (tính — phải là 十).',
    tu: [
      { w: '{許|ゆる}す', ro: 'yurusu', vi: 'tha thứ; cho phép (Bài 19)' },
      { w: '{許可|きょか}', ro: 'kyoka', vi: 'sự cho phép, giấy phép' },
      { w: '{免許|めんきょ}', ro: 'menkyo', vi: 'giấy phép (lái xe) (N3)' },
    ],
  },
  '可': {
    hv: 'KHẢ', nghia: 'có thể, được', en: 'possible / can',
    on: ['カ'], kun: [],
    nho: 'Một cách giải thích gốc chữ: 口 (miệng) + 丁 (vẽ hơi thở bật ra): tiếng "ĐƯỢC!" thốt ra khi đồng ý = KHẢ (có thể, được phép) → 可能, 許可. Mẹo nhìn (không phải gốc chữ): cái miệng 口 nằm trong khung 丁 nói "được". Thêm 氵 bên trái là 河 (sông), thêm 亻 bên trái là 何 (gì — đã học).',
    tu: [
      { w: '{許可|きょか}', ro: 'kyoka', vi: 'sự cho phép' },
      { w: '{可能|かのう}', ro: 'kanou', vi: 'có thể, khả năng (N3)' },
      { w: '{可能形|かのうけい}', ro: 'kanoukei', vi: 'thể khả năng (Bài 16)' },
    ],
  },
  '飼': {
    hv: 'TỰ', nghia: 'nuôi (con vật)', en: 'raise (animals)',
    on: ['シ'], kun: ['か・う'],
    nho: 'Bên trái 飠 (bộ thực — ăn), bên phải 司 (gợi âm シ; trông coi): cho ĂN và TRÔNG COI con vật = NUÔI → 飼う. ⚠ 飼う (nuôi) và 買う (mua — Bài 5) cùng đọc かう: 犬を飼う (nuôi chó) ≠ 犬を買う (mua chó).',
    tu: [
      { w: '{飼|か}う', ro: 'kau', vi: 'nuôi (thú cưng, gia súc)' },
      { w: '{飼|か}い{主|ぬし}', ro: 'kainushi', vi: 'chủ nuôi (N2)' },
      { w: '{犬|いぬ}を{飼|か}う', ro: 'inu o kau', vi: 'nuôi chó' },
    ],
  },
  '拾': {
    hv: 'THẬP', nghia: 'nhặt, lượm', en: 'pick up',
    on: ['シュウ', 'ジュウ'], kun: ['ひろ・う'],
    nho: 'Bên trái 扌 (tay), bên phải 合 (hợp lại, gom lại — vừa gợi nghĩa vừa gợi âm): dùng TAY GOM lên = NHẶT → 拾う (Bài 19). Đối nghĩa: 捨てる (vứt — trái cũng là 扌). Trên tiền giấy kiểu cũ, 拾 còn là cách viết "trang trọng" của số 十.',
    tu: [
      { w: '{拾|ひろ}う', ro: 'hirou', vi: 'nhặt (Bài 19)' },
      { w: 'ごみ{拾|ひろ}い', ro: 'gomi hiroi', vi: 'việc nhặt rác' },
      { w: '{拾|ひろ}った{財布|さいふ}', ro: 'hirotta saifu', vi: 'cái ví nhặt được' },
    ],
  },
  '投': {
    hv: 'ĐẦU', nghia: 'ném, quăng; bỏ vào', en: 'throw',
    on: ['トウ'], kun: ['な・げる'],
    nho: 'Bên trái 扌 (tay), bên phải 殳 (bàn tay cầm gậy — động tác vung): TAY VUNG ra = NÉM → 投げる. 投票 = "ném" lá phiếu vào thùng. Cùng phải 殳 với 役 (役に立つ).',
    tu: [
      { w: '{投|な}げる', ro: 'nageru', vi: 'ném' },
      { w: '{投手|とうしゅ}', ro: 'toushu', vi: 'cầu thủ ném bóng (bóng chày) (N2)' },
      { w: '{投票|とうひょう}', ro: 'touhyou', vi: 'bỏ phiếu (N2)' },
    ],
  },
  '逃': {
    hv: 'ĐÀO', nghia: 'trốn, chạy trốn', en: 'escape',
    on: ['トウ'], kun: ['に・げる', 'に・がす', 'のが・す', 'のが・れる'],
    nho: 'Bộ 辶 (bước đi) + 兆 (gợi âm; vốn vẽ vết nứt toác ra hai bên): bỏ ĐI tản ra hai phía = CHẠY TRỐN → 逃げる (tự: mình chạy trốn), 逃がす (tha: thả cho chạy). Cặp tự ↔ tha như 増える ↔ 増やす (Bài 21).',
    tu: [
      { w: '{逃|に}げる', ro: 'nigeru', vi: 'chạy trốn, bỏ chạy' },
      { w: '{逃|に}がす', ro: 'nigasu', vi: 'thả ra; để xổng (N3)' },
      { w: '{見逃|みのが}す', ro: 'minogasu', vi: 'bỏ lỡ; bỏ qua (N2)' },
    ],
  },
  '片': {
    hv: 'PHIẾN', nghia: 'mảnh; một nửa, một phía', en: 'one side / piece',
    on: ['ヘン'], kun: ['かた'],
    nho: 'Chữ tượng hình: nửa bên phải của khúc gỗ 木 bị BỔ ĐÔI — còn một MẢNH, MỘT PHÍA = PHIẾN → 片道 (đường một chiều), 片手 (một tay). 片付ける = dọn cho gọn từng phía.',
    tu: [
      { w: '{片付|かたづ}ける', ro: 'katazukeru', vi: 'dọn dẹp, cất gọn (Bài 16)' },
      { w: '{片道|かたみち}', ro: 'katamichi', vi: 'một chiều (vé) (N3)' },
      { w: '{片手|かたて}', ro: 'katate', vi: 'một tay' },
    ],
  },
  '厳': {
    hv: 'NGHIÊM', nghia: 'nghiêm khắc, khắt khe', en: 'strict / severe',
    on: ['ゲン', 'ゴン'], kun: ['きび・しい', 'おごそ・か'],
    nho: 'Chữ cũ 嚴: 吅 (hai cái miệng) + 厂 (vách đá) + 敢 (dám). Mẹo nhìn (không phải gốc chữ): dưới VÁCH ĐÁ dựng đứng, hai cái miệng quát không khoan nhượng = NGHIÊM KHẮC → 厳しい. Chữ nhiều nét (17) — chỉ cần đọc được.',
    tu: [
      { w: '{厳|きび}しい', ro: 'kibishii', vi: 'nghiêm khắc, khắt khe' },
      { w: '{厳|きび}しく{育|そだ}てる', ro: 'kibishiku sodateru', vi: 'nuôi dạy nghiêm khắc' },
      { w: '{厳重|げんじゅう}', ro: 'genjuu', vi: 'nghiêm ngặt (N1)' },
    ],
  },
  '虫': {
    hv: 'TRÙNG', nghia: 'sâu bọ, côn trùng', en: 'insect / bug',
    on: ['チュウ'], kun: ['むし'],
    nho: 'Chữ tượng hình: vẽ một con RẮN / con sâu ngóc đầu (phần trên là cái đầu, nét dưới là thân và đuôi) = TRÙNG. Là bộ thủ của nhiều chữ chỉ con vật nhỏ.',
    tu: [
      { w: '{虫|むし}', ro: 'mushi', vi: 'sâu bọ, côn trùng' },
      { w: '{虫歯|むしば}', ro: 'mushiba', vi: 'răng sâu (N3)' },
      { w: '{弱虫|よわむし}', ro: 'yowamushi', vi: 'đồ nhát gan' },
      { w: '{昆虫|こんちゅう}', ro: 'konchuu', vi: 'côn trùng (N2)' },
    ],
  },
  '反': {
    hv: 'PHẢN', nghia: 'ngược lại, chống lại; quay lại', en: 'anti / reverse',
    on: ['ハン', 'ホン', 'タン'], kun: ['そ・る', 'そ・らす'],
    nho: 'Trên-trái là 厂 (vách đá), trong là 又 (bàn tay): bàn tay LẬT NGƯỢC vật trên vách = PHẢN (ngược lại) → 反対 (phản đối), 反省 (tự xét lại việc mình làm sai). Có trong 坂 (dốc), 板 (tấm ván), 返 (trả lại — Bài 18).',
    tu: [
      { w: '{反対|はんたい}', ro: 'hantai', vi: 'phản đối; ngược lại' },
      { w: '{反省|はんせい}', ro: 'hansei', vi: 'tự kiểm điểm, hối lỗi' },
      { w: '{違反|いはん}', ro: 'ihan', vi: 'vi phạm (N2)' },
    ],
  },
};
