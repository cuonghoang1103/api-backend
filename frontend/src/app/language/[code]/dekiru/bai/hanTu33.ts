/**
 * Chữ Hán MỚI của Bài 33 (調査 — tiếp sau sách, cấp N3) cho thẻ chữ Hán — cùng định dạng hanTu.ts.
 * 20 chữ: 統 均 率 倍 億 順 占 等 各 基 沿 識 規 向 共 収 支 積 傾 択 (N3 là chính theo các bảng tham khảo phổ biến; 統・均・率・占・基
 * có bảng xếp N2; 沿・傾・択 N2 — JLPT không công bố danh sách chữ chính thức) — bảng `b33-han-tu` trong bai33.ts. Không trùng
 * hanTu.ts, hanTu16–32.ts, hanLop.ts (đã kiểm 09/11/2026; 数 資 求 望 của cùng chủ đề đã có ở hanTu30.ts nên không đưa vào đây).
 * Cách nhớ: theo cấu tạo chữ (phần chỉ nghĩa + phần gợi âm của chữ hình thanh ghi rõ); với 率 ghi theo Thuyết Văn, với 等 ghi "theo
 * cách giải thích phổ biến", mẹo của 倍 ghi rõ là "mẹo". Từ đi chung ưu tiên từ dùng trong bai33.ts.
 * On / Kun theo bảng thường dụng (常用): 均 倍 億 順 識 規 択 chỉ có âm On; 各 có Kun おのおの (hiếm); 統 có Kun す・べる (hiếm).
 * Tệp chỉ có `import type` — tải chậm như hanTu.ts.
 */
import type { HanTu } from '@/components/sach-hoc/kanji';

export const HAN_TU_33: Record<string, HanTu> = {
  '統': {
    hv: 'THỐNG', nghia: 'gom về một mối; dòng dõi', en: 'unite / govern / lineage',
    on: ['トウ'], kun: ['す・べる'],
    nho: 'Bên trái 糸 (sợi chỉ), bên phải 充 (đầy đủ — gợi âm): gom các sợi chỉ về một mối cho đủ → THỐNG nhất, tổng hợp → 統計 (gom số liệu lại mà tính); sợi chỉ nối các đời → 伝統 (truyền thống). ⚠ Khác 充 đứng riêng (充電) và 銃 (súng — 金 + 充).',
    tu: [
      { w: '{統計|とうけい}', ro: 'toukei', vi: 'thống kê' },
      { w: '{伝統|でんとう}', ro: 'dentou', vi: 'truyền thống (N3)' },
      { w: '{統一|とういつ}', ro: 'touitsu', vi: 'thống nhất (N2)' },
      { w: '{大統領|だいとうりょう}', ro: 'daitouryou', vi: 'tổng thống (N2)' },
    ],
  },
  '均': {
    hv: 'QUÂN', nghia: 'đều, bằng nhau', en: 'level / equal / average',
    on: ['キン'], kun: [],
    nho: 'Bên trái 土 (đất), bên phải 匀 (đều — gợi âm キン): san đất cho phẳng, đều khắp → QUÂN (đều) → 平均 (bằng + đều = trung bình). ⚠ Khác 約 (糸 + 勺 — chỉ một chấm bên trong): 均 có 土 và hai nét nhỏ.',
    tu: [
      { w: '{平均|へいきん}', ro: 'heikin', vi: 'trung bình' },
      { w: '{平均点|へいきんてん}', ro: 'heikinten', vi: 'điểm trung bình' },
      { w: '{均等|きんとう}', ro: 'kintou', vi: 'đều nhau, ngang nhau (N1)' },
      { w: '{均一|きんいつ}', ro: 'kin\'itsu', vi: 'đồng đều, đồng giá (N1)' },
    ],
  },
  '率': {
    hv: 'SUẤT', nghia: 'tỉ lệ; dẫn dắt; thẳng thắn', en: 'rate / ratio / lead',
    on: ['リツ', 'ソツ'], kun: ['ひき・いる'],
    nho: 'Theo sách Thuyết Văn, chữ cổ vẽ tấm lưới bắt chim (giữa là sợi tơ 玄, hai bên là các chấm, dưới là cán 十): kéo lưới đi = dẫn dắt (率いる); số chim mắc lưới trên tổng số = TỈ LỆ → 比率, 確率, ～率. Âm ソツ chỉ trong vài từ: 率直 (thẳng thắn), 引率 (dẫn đoàn).',
    tu: [
      { w: '{確率|かくりつ}', ro: 'kakuritsu', vi: 'xác suất (N2)' },
      { w: '{比率|ひりつ}', ro: 'hiritsu', vi: 'tỉ lệ (N2)' },
      { w: '{合格率|ごうかくりつ}', ro: 'goukakuritsu', vi: 'tỉ lệ đỗ' },
      { w: '{回収率|かいしゅうりつ}', ro: 'kaishuuritsu', vi: 'tỉ lệ thu phiếu về' },
      { w: '{率直|そっちょく}', ro: 'sotchoku', vi: 'thẳng thắn (N2)' },
    ],
  },
  '倍': {
    hv: 'BỘI', nghia: 'gấp (lần)', en: 'double / times',
    on: ['バイ'], kun: [],
    nho: 'Bên trái 亻 (người), bên phải 咅 (gợi âm バイ — cũng có trong 部 ブ). Mẹo: người (亻) đứng (立) cạnh cái miệng (口) nói gì cũng phóng đại GẤP BỘI. ⚠ Khác 部 (bộ — 咅 + 阝 bên phải) và 培 (bồi — 土 + 咅, N1).',
    tu: [
      { w: '{二倍|にばい}', ro: 'nibai', vi: 'gấp đôi' },
      { w: '{三倍|さんばい}', ro: 'sanbai', vi: 'gấp ba' },
      { w: '{倍率|ばいりつ}', ro: 'bairitsu', vi: 'tỉ lệ chọi (N2)' },
      { w: '{倍|ばい}', ro: 'bai', vi: 'gấp đôi (đứng riêng)' },
    ],
  },
  '億': {
    hv: 'ỨC', nghia: 'trăm triệu (10⁸)', en: 'hundred million',
    on: ['オク'], kun: [],
    nho: 'Bên trái 亻 (người), bên phải 意 (ý — gợi âm オク): con số lớn đến mức người ta chỉ hình dung được trong ý nghĩ → ỨC (trăm triệu). ⚠ Khác 憶 (記憶 — 忄 + 意, Bài 32): cùng âm オク — người (亻) đếm tiền = 億; lòng (忄) ghi nhớ = 憶.',
    tu: [
      { w: '{一億|いちおく}', ro: 'ichioku', vi: 'một trăm triệu' },
      { w: '{十億|じゅうおく}', ro: 'juuoku', vi: 'một tỉ' },
      { w: '{一億円|いちおくえん}', ro: 'ichiokuen', vi: 'một trăm triệu yên' },
      { w: '{億万長者|おくまんちょうじゃ}', ro: 'okumanchouja', vi: 'tỉ phú (N1)' },
    ],
  },
  '順': {
    hv: 'THUẬN', nghia: 'thứ tự; thuận theo', en: 'order / sequence / obey',
    on: ['ジュン'], kun: [],
    nho: 'Bên trái 川 (dòng sông), bên phải 頁 (cái đầu): đầu cúi xuôi theo dòng sông → THUẬN theo, theo THỨ TỰ → 順番, 順位, 手順. ⚠ Khác 頭 (豆 + 頁) và 顔 (彦 + 頁): cùng 頁 bên phải.',
    tu: [
      { w: '{順番|じゅんばん}', ro: 'junban', vi: 'thứ tự lượt' },
      { w: '{順位|じゅんい}', ro: "jun'i", vi: 'thứ hạng' },
      { w: '{手順|てじゅん}', ro: 'tejun', vi: 'trình tự, các bước (N2)' },
      { w: '{順調|じゅんちょう}', ro: 'junchou', vi: 'thuận lợi, suôn sẻ (N3)' },
    ],
  },
  '占': {
    hv: 'CHIẾM / CHIÊM', nghia: 'chiếm; bói', en: 'occupy / divine',
    on: ['セン'], kun: ['し・める', 'うらな・う'],
    nho: 'Trên là 卜 (vết nứt trên mai rùa khi bói), dưới là 口 (miệng): đọc vết nứt rồi nói ra lời đoán = BÓI (占う); thầy bói giữ chỗ của thần → CHIẾM (占める). ⚠ 占 nằm trong 店 (广 + 占 — cửa hàng) và 点 (占 + 灬 — điểm).',
    tu: [
      { w: '{占|し}める', ro: 'shimeru', vi: 'chiếm (tỉ lệ)' },
      { w: '{占|うらな}い', ro: 'uranai', vi: 'bói toán' },
      { w: '{占|うらな}う', ro: 'uranau', vi: 'bói' },
      { w: '{独占|どくせん}', ro: 'dokusen', vi: 'độc chiếm (N1)' },
    ],
  },
  '等': {
    hv: 'ĐẲNG', nghia: 'bằng nhau; hạng, bậc; v.v.', en: 'equal / class / etc.',
    on: ['トウ'], kun: ['ひと・しい'],
    nho: 'Trên là ⺮ (tre), dưới là 寺 (gợi âm). Theo cách giải thích phổ biến: xưa các thẻ tre (giấy viết bằng tre) được xếp cho bằng nhau, ngay hàng → ĐẲNG (bằng nhau: 等しい, 平等), hạng (一等). ⚠ Khác 待 (彳 + 寺 — đợi) và 特 (牛 + 寺 — đặc biệt).',
    tu: [
      { w: '{平等|びょうどう}', ro: 'byoudou', vi: 'bình đẳng' },
      { w: '{等|ひと}しい', ro: 'hitoshii', vi: 'bằng nhau (N2)' },
      { w: '{一等|いっとう}', ro: 'ittou', vi: 'hạng nhất' },
      { w: '{高等学校|こうとうがっこう}', ro: 'koutou gakkou', vi: 'trường cấp ba' },
    ],
  },
  '各': {
    hv: 'CÁC', nghia: 'mỗi, các', en: 'each / every',
    on: ['カク'], kun: ['おのおの'],
    nho: 'Trên là 夂 (bàn chân bước tới), dưới là 口 (cửa nhà): bàn chân bước tới từng cửa nhà một → MỖI, CÁC → 各国, 各地. ⚠ Khác 名 (夕 + 口 — tên); 各 nằm trong 格 (性格) và 客 (khách).',
    tu: [
      { w: '{各国|かっこく}', ro: 'kakkoku', vi: 'các nước' },
      { w: '{各地|かくち}', ro: 'kakuchi', vi: 'các nơi' },
      { w: '{各自|かくじ}', ro: 'kakuji', vi: 'mỗi người tự (N2)' },
      { w: '{各駅停車|かくえきていしゃ}', ro: 'kakueki teisha', vi: 'tàu dừng ở mọi ga' },
    ],
  },
  '基': {
    hv: 'CƠ', nghia: 'nền móng, gốc', en: 'foundation / base',
    on: ['キ'], kun: ['もと', 'もとい'],
    nho: 'Trên là 其 (cái kệ — gợi âm キ), dưới là 土 (đất): cái kệ đặt vững trên đất = NỀN MÓNG, GỐC → 基本, 基準, 基づく (bám vào gốc). ⚠ Khác 期 (期限 — 其 + 月, Bài 26): cùng 其, cùng âm キ.',
    tu: [
      { w: '{基本|きほん}', ro: 'kihon', vi: 'cơ bản' },
      { w: '{基準|きじゅん}', ro: 'kijun', vi: 'tiêu chuẩn' },
      { w: '{基|もと}づく', ro: 'motozuku', vi: 'dựa trên, căn cứ vào' },
      { w: '{基礎|きそ}', ro: 'kiso', vi: 'nền tảng (N2)' },
    ],
  },
  '沿': {
    hv: 'DUYÊN', nghia: 'men theo, dọc theo', en: 'run alongside / follow',
    on: ['エン'], kun: ['そ・う'],
    nho: 'Bên trái 氵 (nước), bên phải 㕣 (gợi âm エン): đi men theo bờ nước → DUYÊN (men theo) → 沿う, 川沿い. ⚠ Khác 船 (thuyền — 舟 + 㕣): cùng phần phải — thuyền (舟) chạy men bờ nước (沿).',
    tu: [
      { w: '{沿|そ}う', ro: 'sou', vi: 'men theo; đáp ứng' },
      { w: '{川沿|かわぞ}い', ro: 'kawazoi', vi: 'ven sông' },
      { w: '{線路沿|せんろぞ}い', ro: 'senrozoi', vi: 'dọc đường ray' },
      { w: '{沿線|えんせん}', ro: 'ensen', vi: 'dọc tuyến tàu (N1)' },
    ],
  },
  '識': {
    hv: 'THỨC', nghia: 'biết, nhận biết', en: 'know / discriminate',
    on: ['シキ'], kun: [],
    nho: 'Bên trái 言 (lời), bên phải 戠 (gợi âm — cũng có trong 職 ショク): nghe lời mà phân biệt, ghi nhận → BIẾT → 知識, 意識, 常識. ⚠ Khác 職 (耳 + 戠 — chức, Bài 24) và 織 (糸 + 戠 — dệt): lời = biết · tai = chức · sợi = dệt.',
    tu: [
      { w: '{知識|ちしき}', ro: 'chishiki', vi: 'kiến thức' },
      { w: '{意識|いしき}', ro: 'ishiki', vi: 'ý thức' },
      { w: '{常識|じょうしき}', ro: 'joushiki', vi: 'hiểu biết chung (Bài 32)' },
      { w: '{認識|にんしき}', ro: 'ninshiki', vi: 'nhận thức (N2)' },
    ],
  },
  '規': {
    hv: 'QUY', nghia: 'khuôn phép, quy tắc', en: 'standard / rule',
    on: ['キ'], kun: [],
    nho: 'Bên trái 夫 (người đàn ông trưởng thành), bên phải 見 (nhìn): người lớn nhìn vào khuôn mà làm = QUY tắc, khuôn phép → 規則, 規模. ⚠ Khác 現 (王 + 見 — hiện, Bài 31) và 親 (亲 + 見 — thân).',
    tu: [
      { w: '{規則|きそく}', ro: 'kisoku', vi: 'quy tắc (Bài 18)' },
      { w: '{規模|きぼ}', ro: 'kibo', vi: 'quy mô (N2)' },
      { w: '{正規|せいき}', ro: 'seiki', vi: 'chính quy (N1)' },
    ],
  },
  '向': {
    hv: 'HƯỚNG', nghia: 'hướng về', en: 'face / direction',
    on: ['コウ'], kun: ['む・く', 'む・ける', 'む・かう', 'む・こう'],
    nho: 'Chữ tượng hình: ngôi nhà (冂) có ô cửa sổ (口) quay về một phía, nét phẩy trên đầu chỉ hướng → HƯỚNG → 向く, 方向. ⚠ Khác 同 (giống — không có nét phẩy trên, trong có 一 + 口).',
    tu: [
      { w: '{方向|ほうこう}', ro: 'houkou', vi: 'phương hướng' },
      { w: '{傾向|けいこう}', ro: 'keikou', vi: 'xu hướng' },
      { w: '{向|む}かう', ro: 'mukau', vi: 'đi về phía' },
      { w: '{向|む}こう', ro: 'mukou', vi: 'phía bên kia' },
      { w: '～{向|む}け', ro: '~muke', vi: 'dành cho (đối tượng)' },
    ],
  },
  '共': {
    hv: 'CỘNG', nghia: 'cùng nhau, chung', en: 'together / both',
    on: ['キョウ'], kun: ['とも'],
    nho: 'Chữ tượng hình: hai bàn tay (nét dưới) cùng nâng một vật (phần trên) → CÙNG NHAU → 共に, 共通. ⚠ Khác 供 (亻 + 共 — 子供, Bài 23) và 異 (田 + 共 — khác: 異なる).',
    tu: [
      { w: '{共|とも}に', ro: 'tomo ni', vi: 'cùng nhau; cùng với' },
      { w: '{共通|きょうつう}', ro: 'kyoutsuu', vi: 'chung, giống nhau' },
      { w: '{共同|きょうどう}', ro: 'kyoudou', vi: 'chung sức, cùng làm (N3)' },
      { w: '{公共|こうきょう}', ro: 'koukyou', vi: 'công cộng (N2)' },
    ],
  },
  '収': {
    hv: 'THU', nghia: 'thu vào, gom lại', en: 'collect / obtain',
    on: ['シュウ'], kun: ['おさ・める', 'おさ・まる'],
    nho: 'Bên trái 丩 (sợi dây quấn — gợi âm シュウ), bên phải 又 (bàn tay): tay cuộn dây thu lại → THU (vào, về) → 収入, 回収. Chỉ 4 nét. ⚠ Khác 双 (又 + 又 — đôi: 双子).',
    tu: [
      { w: '{収入|しゅうにゅう}', ro: 'shuunyuu', vi: 'thu nhập' },
      { w: '{回収|かいしゅう}', ro: 'kaishuu', vi: 'thu về, thu hồi' },
      { w: '{収|おさ}める', ro: 'osameru', vi: 'thu, cất, đạt được (N2)' },
      { w: '{吸収|きゅうしゅう}', ro: 'kyuushuu', vi: 'hấp thụ (N2)' },
    ],
  },
  '支': {
    hv: 'CHI', nghia: 'chống đỡ; nhánh; chi (tiền)', en: 'support / branch / pay out',
    on: ['シ'], kun: ['ささ・える'],
    nho: 'Trên là 十 (một cành cây), dưới là 又 (bàn tay): tay cầm cành cây làm cột CHỐNG ĐỠ → 支える; cành tách ra từ thân → nhánh (支店); tiền "tách" ra khỏi túi → CHI (支出). ⚠ Khác 技 (扌 + 支 — kỹ thuật, Bài 32) và 枝 (木 + 支 — cành, N2).',
    tu: [
      { w: '{支出|ししゅつ}', ro: 'shishutsu', vi: 'chi tiêu' },
      { w: '{支|ささ}える', ro: 'sasaeru', vi: 'chống đỡ, hỗ trợ (Bài 27)' },
      { w: '{支店|してん}', ro: 'shiten', vi: 'chi nhánh (N3)' },
      { w: '{支払|しはら}う', ro: 'shiharau', vi: 'thanh toán (N3)' },
    ],
  },
  '積': {
    hv: 'TÍCH', nghia: 'chất đống, tích luỹ; diện tích', en: 'pile up / accumulate / area',
    on: ['セキ'], kun: ['つ・む', 'つ・もる'],
    nho: 'Bên trái 禾 (cây lúa), bên phải 責 (trách — gợi âm セキ; 責任 Bài 28): bó lúa gặt về CHẤT thành đống → 積む, 雪が積もる; chất dần → TÍCH luỹ, diện tích (面積). ⚠ Khác 績 (糸 + 責 — 成績, Bài 21): ba chữ 積・績・責 cùng âm セキ.',
    tu: [
      { w: '{積極的|せっきょくてき}', ro: 'sekkyokuteki', vi: 'tích cực (Bài 28)' },
      { w: '{面積|めんせき}', ro: 'menseki', vi: 'diện tích (N3)' },
      { w: '{積|つ}もる', ro: 'tsumoru', vi: 'chồng chất, (tuyết) phủ dày (N3)' },
      { w: '{積|つ}む', ro: 'tsumu', vi: 'chất lên, xếp lên (N3)' },
    ],
  },
  '傾': {
    hv: 'KHUYNH', nghia: 'nghiêng; khuynh hướng', en: 'lean / incline / tendency',
    on: ['ケイ'], kun: ['かたむ・く', 'かたむ・ける'],
    nho: 'Bên trái 亻 (người), bên phải 頃 (ころ — Bài 23: 匕 người ngả + 頁 cái đầu): người có đầu ngả sang một bên → NGHIÊNG → 傾く; nghiêng về một phía → khuynh hướng → 傾向. ⚠ Khác 頃 đứng riêng (子どもの頃).',
    tu: [
      { w: '{傾向|けいこう}', ro: 'keikou', vi: 'xu hướng (Bài 28)' },
      { w: '{傾|かたむ}く', ro: 'katamuku', vi: 'nghiêng (N2)' },
      { w: '{傾|かたむ}ける', ro: 'katamukeru', vi: 'làm nghiêng; dồn (sức) vào (N2)' },
    ],
  },
  '択': {
    hv: 'TRẠCH', nghia: 'chọn lựa', en: 'choose / select',
    on: ['タク'], kun: [],
    nho: 'Bên trái 扌 (tay), bên phải 尺 (thước — phần gợi âm, dạng giản của 睪): tay nhặt ra từng cái để CHỌN → 選択, 選択肢. ⚠ Khác 訳 (言 + 尺 — dịch, Bài 22) và 駅 (馬 + 尺 — ga): ba chữ cùng phần 尺 bên phải. ⚠ 選択 (lựa chọn) cùng âm với 洗濯 (giặt giũ).',
    tu: [
      { w: '{選択|せんたく}', ro: 'sentaku', vi: 'sự lựa chọn (N2)' },
      { w: '{選択肢|せんたくし}', ro: 'sentakushi', vi: 'các phương án lựa chọn' },
      { w: '{採択|さいたく}', ro: 'saitaku', vi: 'thông qua, chọn dùng (N1)' },
    ],
  },
};
