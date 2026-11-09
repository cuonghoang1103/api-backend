/**
 * Chữ Hán MỚI của Bài 38 (読解 N3 — tiếp sau sách, cấp N3) cho thẻ chữ Hán — cùng định dạng hanTu.ts.
 * 22 chữ: 筆 掲 載 募 抽 臨 営 条 額 慮 環 境 策 効 量 源 逆 批 及 府 易 造 (N3–N2 theo các bảng tham khảo phổ biến;
 * 抽・慮 nhiều bảng xếp N1 nhưng các từ 抽選・遠慮・配慮 là từ N3–N2 rất hay gặp ở thông báo — JLPT không công bố danh sách
 * chữ chính thức) — bảng `b38-han-tu` trong bai38.ts.
 * Cách nhớ: theo cấu tạo chữ (phần chỉ nghĩa + phần gợi âm của chữ hình thanh ghi rõ). Từ đi chung ưu tiên từ dùng trong
 * bai38.ts và từ đã học ở bài trước (募集・応募・条件 Bài 16, 営業 Bài 21, 遠慮 Bài 24, 環境・政府 Bài 27, 逆に Bài 28,
 * 普及 Bài 32, 電源 Bài 34).
 * On / Kun theo bảng thường dụng (常用): 抽 慮 環 策 批 府 条 chỉ có âm On; 境 có On キョウ・ケイ (境内 — đọc ケイ); 易 có On
 * エキ (đổi — 貿易) và イ (dễ — 容易); 逆 có Kun さか・さか(らう); 及 có Kun およ(ぶ)・およ(び)・およ(ぼす).
 * Tệp chỉ có `import type` — tải chậm như hanTu.ts.
 */
import type { HanTu } from '@/components/sach-hoc/kanji';

export const HAN_TU_38: Record<string, HanTu> = {
  '筆': {
    hv: 'BÚT', nghia: 'cây bút; viết', en: 'brush / writing',
    on: ['ヒツ'], kun: ['ふで'],
    nho: 'Trên ⺮ (tre), dưới 聿 (bàn tay cầm cây bút): CÂY BÚT LÀM BẰNG ỐNG TRE = BÚT → 筆, 筆者 (người cầm bút — tác giả). Chú ý biến âm: 鉛筆 (えんぴつ), 筆者 (ひっしゃ).',
    tu: [
      { w: '{筆者|ひっしゃ}', ro: 'hissha', vi: 'người viết, tác giả (câu hỏi đề đọc)' },
      { w: '{鉛筆|えんぴつ}', ro: 'enpitsu', vi: 'bút chì' },
      { w: '{筆記試験|ひっきしけん}', ro: 'hikki shiken', vi: 'thi viết' },
      { w: '{筆|ふで}', ro: 'fude', vi: 'bút lông' },
    ],
  },
  '掲': {
    hv: 'YẾT', nghia: 'treo lên, nêu lên', en: 'put up / post',
    on: ['ケイ'], kun: ['かか・げる'],
    nho: 'Bên trái 扌 (tay), bên phải 曷: GIƠ TAY TREO LÊN CAO cho mọi người cùng thấy = YẾT → 掲示板 (bảng treo thông báo), 掲載 (đăng lên).',
    tu: [
      { w: '{掲示板|けいじばん}', ro: 'keijiban', vi: 'bảng tin' },
      { w: '{掲載|けいさい}', ro: 'keisai', vi: 'đăng (báo, web)' },
      { w: '{目標|もくひょう}を{掲|かか}げる', ro: 'mokuhyou o kakageru', vi: 'nêu mục tiêu (N2)' },
    ],
  },
  '載': {
    hv: 'TẢI', nghia: 'chở; đăng lên', en: 'load / publish',
    on: ['サイ'], kun: ['の・る', 'の・せる'],
    nho: 'Phần 𢦏 (gợi âm サイ) bọc lấy 車 (xe): CHẤT HÀNG LÊN XE = TẢI → 載せる; "chất" bài lên báo → 掲載. Cùng phần gợi âm với 栽 (盆栽 — 木) và 裁 (裁判 — 衣): cả ba đều đọc サイ.',
    tu: [
      { w: '{掲載|けいさい}', ro: 'keisai', vi: 'đăng tải' },
      { w: '{記載|きさい}', ro: 'kisai', vi: 'ghi trong văn bản (N2)' },
      { w: '{新聞|しんぶん}に{載|の}る', ro: 'shinbun ni noru', vi: 'lên báo' },
      { w: '{載|の}せる', ro: 'noseru', vi: 'đặt lên, đăng lên' },
    ],
  },
  '募': {
    hv: 'MỘ', nghia: 'chiêu mộ, quyên góp', en: 'recruit / collect',
    on: ['ボ'], kun: ['つの・る'],
    nho: 'Trên 莫 (gợi âm ボ), dưới 力 (sức): KÊU GỌI SỨC NGƯỜI = MỘ → 募集, 応募. Khác 暮 (く・らす — dưới là 日), 墓 (はか — dưới là 土), 幕 (まく — dưới là 巾): cùng 莫, khác chân.',
    tu: [
      { w: '{募集|ぼしゅう}', ro: 'boshuu', vi: 'tuyển, chiêu mộ (Bài 16)' },
      { w: '{応募|おうぼ}', ro: 'oubo', vi: 'ứng tuyển, đăng ký dự (Bài 16)' },
      { w: '{募金|ぼきん}', ro: 'bokin', vi: 'quyên góp tiền' },
      { w: '{募|つの}る', ro: 'tsunoru', vi: 'kêu gọi, chiêu mộ (N1)' },
    ],
  },
  '抽': {
    hv: 'TRỪU', nghia: 'rút ra', en: 'draw out / extract',
    on: ['チュウ'], kun: [],
    nho: 'Bên trái 扌 (tay), bên phải 由 (gợi âm チュウ): THÒ TAY RÚT RA = TRỪU → 抽選 (rút thăm). Cùng 由 với 油 (石油) và 笛 (ふえ).',
    tu: [
      { w: '{抽選|ちゅうせん}', ro: 'chuusen', vi: 'bốc thăm, quay số' },
      { w: '{抽象的|ちゅうしょうてき}', ro: 'chuushouteki', vi: 'trừu tượng (N2)' },
    ],
  },
  '臨': {
    hv: 'LÂM', nghia: 'đến gần, đối mặt; tạm thời, bất thường', en: 'face / temporary',
    on: ['リン'], kun: ['のぞ・む'],
    nho: 'Bên trái 臣 (con mắt nhìn xuống), bên phải 人 trên 品 (nhiều đồ vật): NGƯỜI CÚI XUỐNG NHÌN TẬN NƠI = LÂM (đến gần, đối mặt) → 臨む; việc phải đến tận nơi xử lý ngoài lịch → 臨時.',
    tu: [
      { w: '{臨時|りんじ}', ro: 'rinji', vi: 'đột xuất, lâm thời' },
      { w: '{臨時休業|りんじきゅうぎょう}', ro: 'rinji kyuugyou', vi: 'nghỉ kinh doanh đột xuất' },
      { w: '{試合|しあい}に{臨|のぞ}む', ro: 'shiai ni nozomu', vi: 'bước vào trận đấu (N1)' },
    ],
  },
  '営': {
    hv: 'DOANH', nghia: 'kinh doanh, điều hành', en: 'manage / run a business',
    on: ['エイ'], kun: ['いとな・む'],
    nho: 'Trên ⺍ + 冖 (ánh lửa trên mái nhà), dưới 呂 (dãy phòng nối nhau): DÃY NHÀ SÁNG ĐÈN — doanh trại, nơi làm ăn = DOANH → 営業, 経営.',
    tu: [
      { w: '{営業|えいぎょう}', ro: 'eigyou', vi: 'kinh doanh, mở cửa (Bài 21)' },
      { w: '{営業時間|えいぎょうじかん}', ro: 'eigyou jikan', vi: 'giờ mở cửa' },
      { w: '{経営|けいえい}', ro: 'keiei', vi: 'kinh doanh, quản lý (N2)' },
      { w: '{店|みせ}を{営|いとな}む', ro: 'mise o itonamu', vi: 'mở / điều hành cửa hàng' },
    ],
  },
  '条': {
    hv: 'ĐIỀU', nghia: 'điều, khoản', en: 'article / clause',
    on: ['ジョウ'], kun: [],
    nho: 'Trên 夂, dưới 木 (cây): CÀNH CÂY DÀI — mỗi điều khoản là một "cành" = ĐIỀU → 条件, 条約, 第一条.',
    tu: [
      { w: '{条件|じょうけん}', ro: 'jouken', vi: 'điều kiện (Bài 16)' },
      { w: '{条約|じょうやく}', ro: 'jouyaku', vi: 'hiệp ước' },
      { w: '{第一条|だいいちじょう}', ro: 'dai ichi jou', vi: 'điều 1 (luật, quy định)' },
    ],
  },
  '額': {
    hv: 'NGẠCH', nghia: 'số tiền; khung; trán', en: 'amount / frame / forehead',
    on: ['ガク'], kun: ['ひたい'],
    nho: 'Bên trái 客 (gợi âm), bên phải 頁 (cái đầu): PHẦN NHÔ RA TRÊN ĐẦU = trán (額) → tấm biển treo cao như trán nhà → khung (額) → con số ghi trên biển = số tiền (金額). Cùng 頁 với 顔 (かお), 頭.',
    tu: [
      { w: '{金額|きんがく}', ro: 'kingaku', vi: 'số tiền' },
      { w: '{半額|はんがく}', ro: 'hangaku', vi: 'nửa giá' },
      { w: '{全額|ぜんがく}', ro: 'zengaku', vi: 'toàn bộ số tiền' },
      { w: '{額|ひたい}', ro: 'hitai', vi: 'trán' },
    ],
  },
  '慮': {
    hv: 'LỰ', nghia: 'lo nghĩ, cân nhắc', en: 'consider / concern',
    on: ['リョ'], kun: [],
    nho: 'Trên 虍 (vằn hổ), dưới 思 (nghĩ): NGHĨ NGỢI NHƯ ĐỨNG TRƯỚC CON HỔ — lo xa, cân nhắc = LỰ → 遠慮 (lo nghĩ xa → ngại ngần), 配慮 (chia sự lo nghĩ cho người khác). Đọc リョ ngắn, không phải リョウ.',
    tu: [
      { w: '{遠慮|えんりょ}', ro: 'enryo', vi: 'ngại, khách sáo (Bài 24)' },
      { w: 'ご{遠慮|えんりょ}ください', ro: 'goenryo kudasai', vi: 'xin đừng… (thông báo)' },
      { w: '{配慮|はいりょ}', ro: 'hairyo', vi: 'quan tâm, chú ý cho người khác (N2)' },
      { w: '{考慮|こうりょ}', ro: 'kouryo', vi: 'cân nhắc, xem xét (N2)' },
    ],
  },
  '環': {
    hv: 'HOÀN', nghia: 'vòng; bao quanh', en: 'ring / surround',
    on: ['カン'], kun: [],
    nho: 'Bên trái 王 (ngọc), bên phải 睘 (gợi âm カン): VIÊN NGỌC HÌNH VÒNG = HOÀN → bao quanh → 環境 (vòng + ranh giới = những gì bao quanh ta).',
    tu: [
      { w: '{環境|かんきょう}', ro: 'kankyou', vi: 'môi trường (Bài 27)' },
      { w: '{環境問題|かんきょうもんだい}', ro: 'kankyou mondai', vi: 'vấn đề môi trường' },
      { w: '{循環|じゅんかん}', ro: 'junkan', vi: 'tuần hoàn (N1)' },
    ],
  },
  '境': {
    hv: 'CẢNH', nghia: 'ranh giới', en: 'boundary',
    on: ['キョウ', 'ケイ'], kun: ['さかい'],
    nho: 'Bên trái 土 (đất), bên phải 竟 (kết thúc — gợi âm キョウ): NƠI ĐẤT KẾT THÚC = ranh giới → 境, 国境. Khác 鏡 (かがみ — gương): 金 + 竟, cùng đọc キョウ.',
    tu: [
      { w: '{環境|かんきょう}', ro: 'kankyou', vi: 'môi trường' },
      { w: '{国境|こっきょう}', ro: 'kokkyou', vi: 'biên giới' },
      { w: '{境|さかい}', ro: 'sakai', vi: 'ranh giới' },
      { w: '{境内|けいだい}', ro: 'keidai', vi: 'khuôn viên đền chùa (đọc ケイ)' },
    ],
  },
  '策': {
    hv: 'SÁCH', nghia: 'kế sách, biện pháp', en: 'plan / measure',
    on: ['サク'], kun: [],
    nho: 'Trên ⺮ (tre), dưới 朿 (cái gai): ROI TRE CÓ GAI để thúc ngựa — công cụ đạt mục đích = SÁCH (kế sách) → 対策, 政策.',
    tu: [
      { w: '{対策|たいさく}', ro: 'taisaku', vi: 'biện pháp đối phó' },
      { w: '{政策|せいさく}', ro: 'seisaku', vi: 'chính sách' },
      { w: '{解決策|かいけつさく}', ro: 'kaiketsusaku', vi: 'cách giải quyết' },
    ],
  },
  '効': {
    hv: 'HIỆU', nghia: 'hiệu nghiệm, có tác dụng', en: 'effect / be effective',
    on: ['コウ'], kun: ['き・く'],
    nho: 'Bên trái 交 (giao — gợi âm コウ), bên phải 力 (sức): SỨC TÁC ĐỘNG QUA LẠI = HIỆU → 効果, 効く. Cùng 交 với 校 (学校) và 郊 (郊外): đều đọc コウ.',
    tu: [
      { w: '{効果|こうか}', ro: 'kouka', vi: 'hiệu quả' },
      { w: '{有効|ゆうこう}', ro: 'yuukou', vi: 'có hiệu lực' },
      { w: '{薬|くすり}が{効|き}く', ro: 'kusuri ga kiku', vi: 'thuốc có tác dụng' },
      { w: '{効率|こうりつ}', ro: 'kouritsu', vi: 'hiệu suất (N2)' },
    ],
  },
  '量': {
    hv: 'LƯỢNG', nghia: 'lượng; đo', en: 'quantity / measure',
    on: ['リョウ'], kun: ['はか・る'],
    nho: '日 + 一 + 里: hình CÁI ĐẤU ĐONG ĐẶT TRÊN MẶT ĐẤT — đo lường = LƯỢNG → 量, 大量. Khác 重 (おも・い): không có 日 ở trên.',
    tu: [
      { w: '{量|りょう}', ro: 'ryou', vi: 'lượng' },
      { w: '{大量|たいりょう}', ro: 'tairyou', vi: 'số lượng lớn' },
      { w: '{分量|ぶんりょう}', ro: 'bunryou', vi: 'liều lượng, phân lượng' },
      { w: '{量|はか}る', ro: 'hakaru', vi: 'đo, cân (N2)' },
    ],
  },
  '源': {
    hv: 'NGUYÊN', nghia: 'nguồn', en: 'source',
    on: ['ゲン'], kun: ['みなもと'],
    nho: 'Bên trái 氵 (nước), bên phải 原 (đồng bằng, gốc — gợi âm ゲン): CHỖ NƯỚC BẮT ĐẦU = NGUYÊN (nguồn) → 資源, 電源. 原 (原因) không có 氵 — cùng đọc ゲン.',
    tu: [
      { w: '{資源|しげん}', ro: 'shigen', vi: 'tài nguyên' },
      { w: '{電源|でんげん}', ro: 'dengen', vi: 'nguồn điện (Bài 34)' },
      { w: '{起源|きげん}', ro: 'kigen', vi: 'nguồn gốc (N2)' },
      { w: '{源|みなもと}', ro: 'minamoto', vi: 'nguồn (N1)' },
    ],
  },
  '逆': {
    hv: 'NGHỊCH', nghia: 'ngược', en: 'reverse / opposite',
    on: ['ギャク'], kun: ['さか', 'さか・らう'],
    nho: 'Bộ 辶 (đi) bao lấy 屰 (hình người lộn ngược đầu): ĐI NGƯỢC CHIỀU = NGHỊCH → 逆に, 逆らう.',
    tu: [
      { w: '{逆|ぎゃく}に', ro: 'gyaku ni', vi: 'ngược lại (Bài 28)' },
      { w: '{逆効果|ぎゃくこうか}', ro: 'gyakukouka', vi: 'phản tác dụng' },
      { w: '{逆|さか}らう', ro: 'sakarau', vi: 'chống lại, cãi lời (N2)' },
      { w: '{逆|さか}さま', ro: 'sakasama', vi: 'lộn ngược' },
    ],
  },
  '批': {
    hv: 'PHÊ', nghia: 'phê bình', en: 'criticize',
    on: ['ヒ'], kun: [],
    nho: 'Bên trái 扌 (tay), bên phải 比 (so sánh — gợi âm ヒ): CẦM LÊN SO SÁNH, CHỈ RA HAY DỞ = PHÊ → 批判. 比 (比べる — Bài 28) không có 扌 — cùng đọc ヒ.',
    tu: [
      { w: '{批判|ひはん}', ro: 'hihan', vi: 'phê phán, chỉ trích (N2)' },
      { w: '{批判的|ひはんてき}', ro: 'hihanteki', vi: 'mang tính phê phán' },
      { w: '{批評|ひひょう}', ro: 'hihyou', vi: 'phê bình, bình luận (N1)' },
    ],
  },
  '及': {
    hv: 'CẬP', nghia: 'đạt tới, lan tới; và', en: 'reach / and',
    on: ['キュウ'], kun: ['およ・ぶ', 'およ・び', 'およ・ぼす'],
    nho: 'Hình BÀN TAY (又) CHẠM VÀO NGƯỜI (人) TỪ PHÍA SAU — đuổi kịp, với tới = CẬP → 及ぶ (lan tới), 普及 (lan khắp), 及び (và — "kéo thêm tới").',
    tu: [
      { w: '{普及|ふきゅう}', ro: 'fukyuu', vi: 'phổ biến, lan rộng (Bài 32)' },
      { w: '{及|およ}び', ro: 'oyobi', vi: 'và (văn bản)' },
      { w: '{影響|えいきょう}を{及|およ}ぼす', ro: 'eikyou o oyobosu', vi: 'gây ảnh hưởng (N2)' },
      { w: '{及|およ}ぶ', ro: 'oyobu', vi: 'lan tới, đạt tới' },
    ],
  },
  '府': {
    hv: 'PHỦ', nghia: 'phủ, cơ quan; phủ (đơn vị hành chính)', en: 'government office / prefecture',
    on: ['フ'], kun: [],
    nho: 'Bộ 广 (mái nhà lớn) che 付 (gợi âm フ — chữ 付 Bài 34): TOÀ NHÀ LỚN NƠI GIAO NHẬN GIẤY TỜ = PHỦ (cơ quan) → 政府; 京都府・大阪府. 付 (受付) không có 广 — cùng đọc フ.',
    tu: [
      { w: '{政府|せいふ}', ro: 'seifu', vi: 'chính phủ (Bài 27)' },
      { w: '{京都府|きょうとふ}', ro: 'Kyouto-fu', vi: 'phủ Kyoto' },
      { w: '{大阪府|おおさかふ}', ro: 'Oosaka-fu', vi: 'phủ Osaka' },
      { w: '{都道府県|とどうふけん}', ro: 'todoufuken', vi: 'các tỉnh thành của Nhật' },
    ],
  },
  '易': {
    hv: 'DỊ, DỊCH', nghia: 'dễ; trao đổi', en: 'easy / exchange',
    on: ['エキ', 'イ'], kun: ['やさ・しい'],
    nho: '日 + 勿: vốn là hình CON TẮC KÈ hay đổi màu → ĐỔI = DỊCH (貿易 — trao đổi hàng hoá, đọc エキ) → đổi được thì DỄ = DỊ (容易, 易しい — đọc イ／やさしい). ⚠ 易しい (dễ) ≠ 優しい (hiền).',
    tu: [
      { w: '{易|やさ}しい', ro: 'yasashii', vi: 'dễ' },
      { w: '{容易|ようい}', ro: 'youi', vi: 'dễ dàng (N2)' },
      { w: '{貿易|ぼうえき}', ro: 'boueki', vi: 'thương mại, ngoại thương' },
      { w: '{安易|あんい}', ro: 'an\'i', vi: 'dễ dãi (N1)' },
    ],
  },
  '造': {
    hv: 'TẠO', nghia: 'làm ra, chế tạo', en: 'make / build',
    on: ['ゾウ'], kun: ['つく・る'],
    nho: 'Bộ 辶 (đi) + 告 (báo — 報告): ĐI TỚI BÁO "ĐÃ LÀM XONG" = TẠO → 製造, 造る. ⚠ 造る (làm thứ lớn: tàu, nhà, rượu) ≠ 作る (làm nói chung).',
    tu: [
      { w: '{製造|せいぞう}', ro: 'seizou', vi: 'sản xuất, chế tạo (N2)' },
      { w: '{木造|もくぞう}', ro: 'mokuzou', vi: 'làm bằng gỗ' },
      { w: '{構造|こうぞう}', ro: 'kouzou', vi: 'cấu tạo (N2)' },
      { w: '{船|ふね}を{造|つく}る', ro: 'fune o tsukuru', vi: 'đóng tàu' },
    ],
  },
};
