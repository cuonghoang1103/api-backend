/**
 * Chữ Hán MỚI của Bài 54 (読解・聴解 N2 — Đọc & nghe N2 · tiếp sau sách, cấp N2) cho thẻ chữ Hán — cùng định dạng hanTu.ts.
 * 24 chữ: 斜 脈 曖 昧 肯 即 衆 訴 捉 枠 抵 抗 衝 媒 紛 剰 漠 淡 奨 律 干 掘 併 潜 — bảng `b54-han-tu` trong bai54.ts.
 * Chủ đề: chữ của ĐỀ THI và VĂN BÌNH LUẬN — 斜め読み・文脈・曖昧・肯定・即座に・聴衆・訴える・捉える・枠組み・抵抗・衝撃・媒体・
 * 紛らわしい・過剰・漠然・淡々と・推奨・一律・若干・掘り下げる・併せて・潜在的.
 * Không trùng hanTu.ts, hanTu16–53.ts, hanTuTiep.ts, hanLop.ts và mọi bảng chữ Hán Bài 1–53 (kiểm 09/11 bằng script — 1.269 chữ đã
 * dạy, gồm Bài 51 = 陶 彫 鑑 奏 鼓 拍 踊 丸 輝 彩 宝 魂 底 殊 是 非 超 愛 孝 犠 牲 叫 祈 稼 繰 · Bài 52 = 序 章 構 執 旨 範 括 欄 箇 冒 尾 典 唆
 * 視 堅 潔 該 遍 唱 模 盤 版 倫 刊 · Bài 53 = 啓 謹 諾 賜 詫 陳 迅 戴 甚 拙 宜 閲 寛 捗 殿 煩 懇 控 仰 氏 裁 赦 憾 賀).
 * Cấp chữ theo các bảng tham khảo phổ biến (JLPT không công bố danh sách chữ chính thức): 律 干 掘 N3 (chữ cơ bản khoá chưa có trong bảng
 * nào — 法律・干す・掘る dạy bù); 斜 脈 肯 即 衆 訴 捉 枠 抵 抗 衝 紛 剰 淡 奨 併 潜 phần lớn bảng xếp N2; 曖 昧 媒 漠 nhiều bảng xếp N1 nhưng TỪ
 * chứa chúng (曖昧・媒体・漠然・砂漠) là từ N2 hay gặp.
 * On / Kun theo bảng thường dụng (常用): 枠 là 国字 (chữ do Nhật tạo) — KHÔNG có âm On, không có âm Hán Việt gốc; ghi "KHUNG" theo nghĩa
 * (xin người điều phối soát lại nếu muốn để trống). 曖・昧・肯・脈・衆・剰・漠・媒・律・抵・抗・衝・奨 chỉ có âm On thường dụng; 即 có Kun cổ
 * すなわ・ち (không dùng — không ghi); 干 có Kun ほ・す và ひ・る; 紛 có 4 Kun まぎ・れる／まぎ・らす／まぎ・らわす／まぎ・らわしい; 潜 có
 * ひそ・む と もぐ・る.
 * Cách nhớ: theo cấu tạo chữ (phần chỉ nghĩa + phần gợi âm của chữ hình thanh ghi rõ). Từ đi chung ưu tiên từ dùng trong bai54.ts.
 * Tệp chỉ có `import type` — tải chậm như hanTu.ts.
 */
import type { HanTu } from '@/components/sach-hoc/kanji';

export const HAN_TU_54: Record<string, HanTu> = {
  '斜': {
    hv: 'TÀ', nghia: 'nghiêng, chéo', en: 'slanting, diagonal',
    on: ['シャ'], kun: ['なな・め'],
    nho: 'Bên trái 余 (phần dư — gợi âm シャ), bên phải 斗 (cái gáo múc): múc phần DƯ ra thì phải NGHIÊNG cái gáo = NGHIÊNG, CHÉO → 斜め (chéo), 斜め読み (đọc lướt — mắt chạy chéo trang).',
    tu: [
      { w: '{斜|なな}め', ro: 'naname', vi: 'chéo, nghiêng (N2)' },
      { w: '{斜|なな}め{読|よ}み', ro: 'nanameyomi', vi: 'đọc lướt' },
      { w: '{斜面|しゃめん}', ro: 'shamen', vi: 'sườn dốc' },
      { w: '{傾斜|けいしゃ}', ro: 'keisha', vi: 'độ nghiêng, độ dốc' },
    ],
  },
  '脈': {
    hv: 'MẠCH', nghia: 'mạch (máu); mạch nối', en: 'vein, pulse, chain',
    on: ['ミャク'], kun: [],
    nho: 'Bên trái 月 (= 肉, thân thể), bên phải hình dòng nước CHIA NHÁNH: dòng chảy chia nhánh trong cơ thể = MẠCH MÁU → nghĩa rộng: mạch nối liền — 文脈 (mạch văn), 人脈 (mạng quan hệ).',
    tu: [
      { w: '{文脈|ぶんみゃく}', ro: 'bunmyaku', vi: 'mạch văn, ngữ cảnh (N2)' },
      { w: '{脈|みゃく}', ro: 'myaku', vi: 'mạch (đập)' },
      { w: '{山脈|さんみゃく}', ro: 'sanmyaku', vi: 'dãy núi' },
      { w: '{人脈|じんみゃく}', ro: 'jinmyaku', vi: 'mạng quan hệ' },
    ],
  },
  '曖': {
    hv: 'ÁI', nghia: 'mờ, không rõ', en: 'dim, unclear',
    on: ['アイ'], kun: [],
    nho: 'Bên trái 日 (mặt trời), bên phải 愛 (gợi âm アイ): mặt trời bị che, ánh sáng MỜ MỜ = KHÔNG RÕ. Gần như chỉ gặp trong một từ: 曖昧 (mập mờ) — học hai chữ 曖 + 昧 cùng nhau.',
    tu: [
      { w: '{曖昧|あいまい}', ro: 'aimai', vi: 'mập mờ, không rõ ràng (N2 — từ đã gặp ở Bài 36)' },
      { w: '{曖昧|あいまい}な{返事|へんじ}', ro: 'aimai na henji', vi: 'câu trả lời nước đôi' },
    ],
  },
  '昧': {
    hv: 'MUỘI', nghia: 'tối, mờ', en: 'dark, obscure',
    on: ['マイ'], kun: [],
    nho: 'Bên trái 日 (mặt trời), bên phải 未 (chưa — gợi âm): mặt trời CHƯA lên = TRỜI CÒN TỐI MỜ → 曖昧 (mập mờ). Đừng nhầm 未 (chưa, nét ngang trên NGẮN) với 末 (cuối, nét ngang trên DÀI).',
    tu: [
      { w: '{曖昧|あいまい}', ro: 'aimai', vi: 'mập mờ (N2)' },
      { w: '{読書三昧|どくしょざんまい}', ro: 'dokusho zanmai', vi: 'đọc sách thoả thích (三昧 = say mê một việc)' },
    ],
  },
  '肯': {
    hv: 'KHẲNG', nghia: 'đồng ý, chấp nhận', en: 'agree, affirm',
    on: ['コウ'], kun: [],
    nho: 'Trên 止 (dừng), dưới 月 (= 肉, thịt): miếng thịt sát xương, chỗ cốt yếu — DỪNG LẠI gật đầu ở chỗ cốt yếu = ĐỒNG Ý, KHẲNG ĐỊNH → 肯定 (khẳng định) ↔ 否定 (phủ định — Bài 28).',
    tu: [
      { w: '{肯定|こうてい}', ro: 'koutei', vi: 'khẳng định, công nhận (N2)' },
      { w: '{肯定的|こうていてき}', ro: 'kouteiteki', vi: 'mang tính khẳng định, tích cực' },
      { w: '{肯定文|こうていぶん}', ro: 'kouteibun', vi: 'câu khẳng định' },
    ],
  },
  '即': {
    hv: 'TỨC', nghia: 'ngay, lập tức; tức là', en: 'immediately, namely',
    on: ['ソク'], kun: [],
    nho: 'Bên trái hình bát cơm đầy, bên phải 卩 (người ngồi quỳ): người ngồi SÁT NGAY cạnh bát cơm, ăn liền = NGAY LẬP TỨC → 即座に (ngay tức khắc), 即時応答 (đáp ngay — tên dạng đề nghe N2).',
    tu: [
      { w: '{即座|そくざ}に', ro: 'sokuza ni', vi: 'ngay tức khắc (N2)' },
      { w: '{即時応答|そくじおうとう}', ro: 'sokuji outou', vi: 'đáp ngay (dạng đề 聴解)' },
      { w: '{即答|そくとう}', ro: 'sokutou', vi: 'trả lời ngay' },
      { w: '{即戦力|そくせんりょく}', ro: 'sokusenryoku', vi: 'người làm được việc ngay (tuyển dụng)' },
    ],
  },
  '衆': {
    hv: 'CHÚNG', nghia: 'đông người, quần chúng', en: 'masses, multitude',
    on: ['シュウ', 'シュ'], kun: [],
    nho: 'Phần trên là con mắt 目 nằm ngang (người trông coi), phần dưới 乑 (ba người đứng cạnh nhau): RẤT NHIỀU NGƯỜI dưới một con mắt = ĐÁM ĐÔNG → 聴衆 (thính giả — người nghe đông), 大衆 (đại chúng).',
    tu: [
      { w: '{聴衆|ちょうしゅう}', ro: 'choushuu', vi: 'thính giả (N2)' },
      { w: '{大衆|たいしゅう}', ro: 'taishuu', vi: 'đại chúng (N2)' },
      { w: '{公衆|こうしゅう}', ro: 'koushuu', vi: 'công chúng (公衆電話 — điện thoại công cộng)' },
      { w: '{民衆|みんしゅう}', ro: 'minshuu', vi: 'dân chúng' },
    ],
  },
  '訴': {
    hv: 'TỐ', nghia: 'kêu, khiếu nại; tố cáo', en: 'appeal, sue',
    on: ['ソ'], kun: ['うった・える'],
    nho: 'Bên trái 言 (lời nói), bên phải 斥 (đẩy ra — gợi âm ソ): ĐẨY LỜI NÓI ra trước mọi người = KÊU, TỐ → 訴える (kêu gọi, trình bày cho người khác hiểu; kiện), 訴訟 (vụ kiện).',
    tu: [
      { w: '{訴|うった}える', ro: 'uttaeru', vi: 'kêu gọi, nêu lên; kiện (N2)' },
      { w: '{痛|いた}みを{訴|うった}える', ro: 'itami o uttaeru', vi: 'kêu đau' },
      { w: '{訴訟|そしょう}', ro: 'soshou', vi: 'vụ kiện (N1)' },
    ],
  },
  '捉': {
    hv: 'TRÓC', nghia: 'nắm bắt, bắt lấy', en: 'grasp, capture',
    on: ['ソク'], kun: ['とら・える'],
    nho: 'Bên trái 扌 (tay), bên phải 足 (chân — gợi âm ソク): dùng TAY tóm lấy CHÂN = BẮT LẤY → nghĩa rộng: NẮM BẮT (ý, đặc điểm) — 捉える (nắm bắt, nhìn nhận), 要点を捉える (nắm ý chính).',
    tu: [
      { w: '{捉|とら}える', ro: 'toraeru', vi: 'nắm bắt, nhìn nhận (N2)' },
      { w: '{要点|ようてん}を{捉|とら}える', ro: 'youten o toraeru', vi: 'nắm được ý chính' },
      { w: '{前向|まえむ}きに{捉|とら}える', ro: 'maemuki ni toraeru', vi: 'nhìn nhận tích cực' },
      { w: '{捕捉|ほそく}', ro: 'hosoku', vi: 'bắt giữ, nắm bắt (N1)' },
    ],
  },
  '枠': {
    hv: 'KHUNG', nghia: 'khung, giới hạn', en: 'frame, limit',
    on: [], kun: ['わく'],
    nho: 'Chữ do người Nhật tạo (国字 — không có âm On, không có âm Hán Việt gốc; "KHUNG" là nghĩa). Bên trái 木 (gỗ), bên phải 卆: những thanh GỖ ghép lại thành KHUNG → 枠 (khung, ô), 枠組み (khuôn khổ — Bài 52), 予算の枠 (giới hạn ngân sách).',
    tu: [
      { w: '{枠|わく}', ro: 'waku', vi: 'khung, ô; giới hạn (N2)' },
      { w: '{枠組|わくぐ}み', ro: 'wakugumi', vi: 'khuôn khổ (Bài 52)' },
      { w: '{予算|よさん}の{枠|わく}', ro: 'yosan no waku', vi: 'giới hạn ngân sách' },
      { w: '{枠内|わくない}', ro: 'wakunai', vi: 'trong khung, trong giới hạn' },
    ],
  },
  '抵': {
    hv: 'ĐỂ', nghia: 'chống lại; chạm tới', en: 'resist, reach',
    on: ['テイ'], kun: [],
    nho: 'Bên trái 扌 (tay), bên phải 氐 (gốc, đáy — gợi âm テイ, giống 低・底): đưa TAY chống từ DƯỚI GỐC lên = CHỐNG LẠI → 抵抗 (chống cự; e ngại). Từ quen 大抵 (たいてい — Bài 11) cũng viết bằng chữ này.',
    tu: [
      { w: '{抵抗|ていこう}', ro: 'teikou', vi: 'chống cự; e ngại (N2)' },
      { w: '{大抵|たいてい}', ro: 'taitei', vi: 'thường thì, phần lớn (đã học bằng kana ở Bài 11)' },
      { w: '{抵抗感|ていこうかん}', ro: 'teikoukan', vi: 'cảm giác e ngại, không thoải mái' },
    ],
  },
  '抗': {
    hv: 'KHÁNG', nghia: 'chống lại', en: 'oppose, resist',
    on: ['コウ'], kun: [],
    nho: 'Bên trái 扌 (tay), bên phải 亢 (cổ vươn cao — gợi âm コウ): ngẩng cao đầu, giơ TAY lên = CHỐNG LẠI → 抵抗 (chống cự), 反抗 (phản kháng), 対抗 (đối kháng), 抗議 (phản đối, kháng nghị).',
    tu: [
      { w: '{抵抗|ていこう}', ro: 'teikou', vi: 'chống cự (N2)' },
      { w: '{反抗|はんこう}', ro: 'hankou', vi: 'phản kháng, chống đối (N2)' },
      { w: '{対抗|たいこう}', ro: 'taikou', vi: 'đối kháng, cạnh tranh' },
      { w: '{抗議|こうぎ}', ro: 'kougi', vi: 'phản đối, kháng nghị (N2)' },
    ],
  },
  '衝': {
    hv: 'XUNG', nghia: 'đâm vào, va chạm', en: 'collide, strike',
    on: ['ショウ'], kun: [],
    nho: '行 (con đường — bị tách đôi hai bên) kẹp 重 (nặng — gợi âm): vật NẶNG lao giữa ĐƯỜNG = VA CHẠM, XUNG ĐỘT → 衝突 (va chạm), 衝撃 (cú sốc), 衝動 (cơn bốc đồng).',
    tu: [
      { w: '{衝撃|しょうげき}', ro: 'shougeki', vi: 'cú sốc, chấn động (N2)' },
      { w: '{衝突|しょうとつ}', ro: 'shoutotsu', vi: 'va chạm, xung đột (N2)' },
      { w: '{衝動|しょうどう}', ro: 'shoudou', vi: 'cơn bốc đồng (衝動買い — mua bốc đồng)' },
    ],
  },
  '媒': {
    hv: 'MÔI', nghia: 'mai mối; trung gian', en: 'go-between, medium',
    on: ['バイ'], kun: [],
    nho: 'Bên trái 女 (phụ nữ), bên phải 某 (người nào đó — gợi âm バイ): người PHỤ NỮ đứng giữa giới thiệu "người nào đó" = BÀ MỐI → nghĩa rộng: TRUNG GIAN — 媒体 (phương tiện truyền thông), 媒介 (làm trung gian).',
    tu: [
      { w: '{媒体|ばいたい}', ro: 'baitai', vi: 'phương tiện truyền thông (N1 — rất hay gặp trong bài báo)' },
      { w: '{媒介|ばいかい}', ro: 'baikai', vi: 'trung gian, làm lây truyền' },
      { w: '{触媒|しょくばい}', ro: 'shokubai', vi: 'chất xúc tác' },
    ],
  },
  '紛': {
    hv: 'PHÂN', nghia: 'rối, lẫn lộn', en: 'tangle, confuse',
    on: ['フン'], kun: ['まぎ・れる', 'まぎ・らす', 'まぎ・らわす', 'まぎ・らわしい'],
    nho: 'Bên trái 糸 (sợi chỉ), bên phải 分 (chia ra — gợi âm フン): sợi chỉ bị CHIA ra nhiều mối, RỐI vào nhau = LẪN LỘN → 紛らわしい (dễ nhầm — lựa chọn "紛らわしい" là bẫy của đề), 紛失 (thất lạc).',
    tu: [
      { w: '{紛|まぎ}らわしい', ro: 'magirawashii', vi: 'dễ gây nhầm lẫn (N1 — hay gặp)' },
      { w: '{紛失|ふんしつ}', ro: 'funshitsu', vi: 'thất lạc (Bài 39)' },
      { w: '{紛争|ふんそう}', ro: 'funsou', vi: 'xung đột, tranh chấp (N2)' },
      { w: '{気|き}が{紛|まぎ}れる', ro: 'ki ga magireru', vi: 'khuây khoả' },
    ],
  },
  '剰': {
    hv: 'THẶNG', nghia: 'thừa', en: 'surplus, excess',
    on: ['ジョウ'], kun: [],
    nho: 'Bên trái 乗 (chồng lên — gợi âm ジョウ), bên phải 刂 (con dao): CHỒNG LÊN quá nhiều phải lấy DAO cắt bớt = THỪA → 過剰 (quá mức), 余剰 (dư thừa).',
    tu: [
      { w: '{過剰|かじょう}', ro: 'kajou', vi: 'quá mức, thái quá (N2)' },
      { w: '{過剰|かじょう}な{反応|はんのう}', ro: 'kajou na hannou', vi: 'phản ứng thái quá' },
      { w: '{余剰|よじょう}', ro: 'yojou', vi: 'dư thừa (N1)' },
    ],
  },
  '漠': {
    hv: 'MẠC', nghia: 'mênh mông; mơ hồ', en: 'vague, desert',
    on: ['バク'], kun: [],
    nho: 'Bên trái 氵 (nước), bên phải 莫 (mặt trời lặn trong đám cỏ — "không có", gợi âm バク): nơi KHÔNG có NƯỚC, rộng mênh mông = SA MẠC → nghĩa rộng: mênh mông, MƠ HỒ — 漠然と (mơ hồ, chung chung).',
    tu: [
      { w: '{漠然|ばくぜん}と', ro: 'bakuzen to', vi: 'mơ hồ, chung chung (N2)' },
      { w: '{砂漠|さばく}', ro: 'sabaku', vi: 'sa mạc (N3)' },
      { w: '{漠然|ばくぜん}とした{不安|ふあん}', ro: 'bakuzen to shita fuan', vi: 'nỗi lo mơ hồ' },
    ],
  },
  '淡': {
    hv: 'ĐẠM', nghia: 'nhạt; thanh đạm', en: 'pale, light',
    on: ['タン'], kun: ['あわ・い'],
    nho: 'Bên trái 氵 (nước), bên phải 炎 (lửa cháy — gợi âm タン): LỬA gặp NƯỚC thì dịu đi = NHẠT → 淡い (nhạt, mờ), 冷淡 (lạnh nhạt), 淡々と (điềm nhiên, đều đều — giọng đọc bản tin).',
    tu: [
      { w: '{淡|あわ}い', ro: 'awai', vi: '(màu) nhạt; (hy vọng) mong manh (N2)' },
      { w: '{冷淡|れいたん}', ro: 'reitan', vi: 'lạnh nhạt (N1)' },
      { w: '{淡々|たんたん}と', ro: 'tantan to', vi: 'điềm nhiên, đều đều' },
      { w: '{淡水|たんすい}', ro: 'tansui', vi: 'nước ngọt (sông, hồ)' },
    ],
  },
  '奨': {
    hv: 'TƯỞNG', nghia: 'khuyến khích', en: 'encourage, recommend',
    on: ['ショウ'], kun: [],
    nho: 'Trên là phần đầu của 将 (tướng — gợi âm ショウ; chữ Bài 16, bỏ 寸), dưới 大 (to): vị TƯỚNG nói TO để cổ vũ quân = KHUYẾN KHÍCH → 奨学金 (học bổng — tiền khuyến học), 推奨 (khuyến nghị), 奨励 (khuyến khích).',
    tu: [
      { w: '{奨学金|しょうがくきん}', ro: 'shougakukin', vi: 'học bổng (Bài 26)' },
      { w: '{推奨|すいしょう}', ro: 'suishou', vi: 'khuyến nghị (N1 — hay gặp trong thông báo)' },
      { w: '{奨励|しょうれい}', ro: 'shourei', vi: 'khuyến khích (N1)' },
    ],
  },
  '律': {
    hv: 'LUẬT', nghia: 'luật; quy tắc; đều', en: 'law, rule, rhythm',
    on: ['リツ', 'リチ'], kun: [],
    nho: 'Bên trái 彳 (bước đi), bên phải 聿 (bàn tay cầm bút): cây BÚT ghi lại cách ĐI đúng = LUẬT LỆ → 法律 (pháp luật), 規律 (kỷ luật), 一律 (đồng loạt — cùng một luật cho tất cả).',
    tu: [
      { w: '{法律|ほうりつ}', ro: 'houritsu', vi: 'pháp luật (N3)' },
      { w: '{規律|きりつ}', ro: 'kiritsu', vi: 'kỷ luật' },
      { w: '{一律|いちりつ}', ro: 'ichiritsu', vi: 'đồng loạt, như nhau (N2)' },
      { w: '{律儀|りちぎ}', ro: 'richigi', vi: 'chỉn chu, giữ đúng lễ nghĩa' },
    ],
  },
  '干': {
    hv: 'CAN', nghia: 'phơi khô; can dự', en: 'dry, interfere',
    on: ['カン'], kun: ['ほ・す', 'ひ・る'],
    nho: 'Hình cây chĩa hai mũi (cái khiên / cây sào): cây SÀO để PHƠI đồ → 干す (phơi — Bài 23 học bằng kana), 若干 (một chút — từ hay gặp trong bài báo, bảng số liệu). Đừng nhầm 干 (nét dọc thẳng, ngang trên ngắn) với 千 (nghìn — nét đầu xiên) và 于.',
    tu: [
      { w: '{干|ほ}す', ro: 'hosu', vi: 'phơi (N3)' },
      { w: '{若干|じゃっかん}', ro: 'jakkan', vi: 'một chút, một ít (N2)' },
      { w: '{物干|ものほ}し', ro: 'monohoshi', vi: 'chỗ / sào phơi đồ' },
      { w: '{干渉|かんしょう}', ro: 'kanshou', vi: 'can thiệp (N1)' },
    ],
  },
  '掘': {
    hv: 'QUẬT', nghia: 'đào', en: 'dig',
    on: ['クツ'], kun: ['ほ・る'],
    nho: 'Bên trái 扌 (tay), bên phải 屈 (cúi gập — gợi âm クツ): CÚI GẬP người dùng TAY = ĐÀO → 掘る (đào), 掘り下げる (đào sâu — phân tích kỹ một vấn đề), 発掘 (khai quật). Khác 彫る (khắc — Bài 51) cùng đọc ほる.',
    tu: [
      { w: '{掘|ほ}る', ro: 'horu', vi: 'đào (N3)' },
      { w: '{掘|ほ}り{下|さ}げる', ro: 'horisageru', vi: 'đào sâu, phân tích kỹ (N1 — hay gặp)' },
      { w: '{発掘|はっくつ}', ro: 'hakkutsu', vi: 'khai quật; phát hiện (tài năng)' },
    ],
  },
  '併': {
    hv: 'TÍNH', nghia: 'gộp, cùng lúc', en: 'combine, together',
    on: ['ヘイ'], kun: ['あわ・せる'],
    nho: 'Bên trái 亻 (người), bên phải 并 (hai người đứng sát nhau — gợi âm ヘイ): NGƯỜI đứng NGANG HÀNG nhau = GỘP, CÙNG LÚC → 併せて (đồng thời, kèm theo — văn thông báo), 合併 (sáp nhập).',
    tu: [
      { w: '{併|あわ}せて', ro: 'awasete', vi: 'đồng thời, kèm theo (N2)' },
      { w: '{合併|がっぺい}', ro: 'gappei', vi: 'sáp nhập (N1)' },
      { w: '{併用|へいよう}', ro: 'heiyou', vi: 'dùng kết hợp' },
    ],
  },
  '潜': {
    hv: 'TIỀM', nghia: 'lặn; ẩn giấu', en: 'dive, lurk',
    on: ['セン'], kun: ['もぐ・る', 'ひそ・む'],
    nho: 'Bên trái 氵 (nước), bên phải 替 (hai người khuất sau mặt trời 日): người CHÌM KHUẤT dưới NƯỚC = LẶN, ẨN → 潜る (lặn), 潜む (ẩn nấp), 潜在的 (tiềm ẩn).',
    tu: [
      { w: '{潜|もぐ}る', ro: 'moguru', vi: 'lặn; chui vào (N2)' },
      { w: '{潜|ひそ}む', ro: 'hisomu', vi: 'ẩn nấp, tiềm ẩn (N1)' },
      { w: '{潜在的|せんざいてき}', ro: 'senzaiteki', vi: 'tiềm ẩn, tiềm năng (N1)' },
    ],
  },
};
