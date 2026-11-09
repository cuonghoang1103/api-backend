/**
 * Chữ Hán MỚI của Bài 27 (ニュース — tiếp sau sách, cấp N3) cho thẻ chữ Hán — cùng định dạng hanTu.ts.
 * 20 chữ: 原 因 影 響 政 民 件 状 候 速 路 価 値 法 種 類 告 和 戦 争 (N3 theo các bảng tham khảo phổ biến; 影・響・価 có
 * bảng xếp N2 — JLPT không công bố danh sách chữ chính thức) — bảng `b27-han-tu` trong bai27.ts.
 * Cách nhớ: theo cấu tạo chữ (phần chỉ nghĩa + phần gợi âm của chữ hình thanh ghi rõ); với 民・告・状 ghi "theo cách giải
 * thích phổ biến" vì nguồn gốc chữ cổ có nhiều thuyết. Từ đi chung ưu tiên từ dùng trong bai27.ts.
 * On / Kun theo bảng thường dụng (常用): 件 状 法 chỉ có âm On; 政 có Kun まつりごと, 候 có Kun そうろう (văn cổ).
 * Tệp chỉ có `import type` — tải chậm như hanTu.ts.
 */
import type { HanTu } from '@/components/sach-hoc/kanji';

export const HAN_TU_27: Record<string, HanTu> = {
  '原': {
    hv: 'NGUYÊN', nghia: 'nguồn gốc, ban đầu; cánh đồng', en: 'origin / field',
    on: ['ゲン'], kun: ['はら'],
    nho: 'Bên ngoài 厂 (vách đá), bên trong 泉 (dòng suối — viết gọn thành 白 + 小): nước suối chảy ra từ chân vách đá = NGUỒN → gốc, nguyên → 原因. Thêm 氵 → 源 (nguồn); thêm 頁 → 願 (nguyện — お願い).',
    tu: [
      { w: '{原因|げんいん}', ro: "gen'in", vi: 'nguyên nhân' },
      { w: '{高原|こうげん}', ro: 'kougen', vi: 'cao nguyên' },
      { w: '{野原|のはら}', ro: 'nohara', vi: 'cánh đồng, bãi cỏ' },
      { w: '{原料|げんりょう}', ro: 'genryou', vi: 'nguyên liệu (N2)' },
    ],
  },
  '因': {
    hv: 'NHÂN', nghia: 'nguyên do, bởi vì', en: 'cause',
    on: ['イン'], kun: ['よ・る'],
    nho: 'Bên ngoài 囗 (cái chiếu), bên trong 大 (người dang tay): người NẰM DỰA trên chiếu = dựa vào → nguyên DO → 原因. ⚠ Khác 困 (困る — trong khung là 木) và 固 (cố — trong khung là 古).',
    tu: [
      { w: '{原因|げんいん}', ro: "gen'in", vi: 'nguyên nhân' },
      { w: '{要因|よういん}', ro: "youin", vi: 'yếu tố chính, nguyên nhân chủ yếu (N1)' },
      { w: '{因|よ}る', ro: 'yoru', vi: 'do, bởi (N1 — thường viết よる)' },
    ],
  },
  '影': {
    hv: 'ẢNH', nghia: 'bóng; hình bóng', en: 'shadow / influence',
    on: ['エイ'], kun: ['かげ'],
    nho: 'Bên trái 景 (cảnh — ánh nắng, phần gợi âm), bên phải 彡 (ba nét — tia sáng): ánh nắng chiếu xuống tạo ra BÓNG → 影 (かげ). Mẹo: 影響 = "bóng" + "tiếng vang" — thứ lan ra xung quanh từ một vật = ẢNH HƯỞNG. Khác 景 (景色) — không có 彡.',
    tu: [
      { w: '{影響|えいきょう}', ro: 'eikyou', vi: 'ảnh hưởng' },
      { w: '{影|かげ}', ro: 'kage', vi: 'cái bóng' },
      { w: '{木|き}の{影|かげ}', ro: 'ki no kage', vi: 'bóng cây' },
      { w: '{撮影|さつえい}', ro: 'satsuei', vi: 'quay phim, chụp ảnh (N2)' },
    ],
  },
  '響': {
    hv: 'HƯỞNG', nghia: 'vang, vọng lại', en: 'echo / resound',
    on: ['キョウ'], kun: ['ひび・く'],
    nho: 'Trên 郷 (làng quê — gợi âm キョウ), dưới 音 (âm thanh): tiếng VANG khắp làng → 響く. Cùng âm キョウ với 郷 (hương — 故郷).',
    tu: [
      { w: '{影響|えいきょう}', ro: 'eikyou', vi: 'ảnh hưởng' },
      { w: '{響|ひび}く', ro: 'hibiku', vi: 'vang lên, vọng lại (N2)' },
      { w: '{反響|はんきょう}', ro: 'hankyou', vi: 'tiếng vang, phản hồi của dư luận (N1)' },
    ],
  },
  '政': {
    hv: 'CHÍNH', nghia: 'việc nước, chính trị', en: 'politics / government',
    on: ['セイ', 'ショウ'], kun: ['まつりごと'],
    nho: 'Bên trái 正 (ngay thẳng — gợi âm セイ), bên phải 攵 (tay cầm roi): dùng quyền làm cho mọi việc NGAY NGẮN = cai trị, CHÍNH trị → 政治, 政府. Cùng 攵: 故 (事故), 敗 (失敗).',
    tu: [
      { w: '{政治|せいじ}', ro: 'seiji', vi: 'chính trị' },
      { w: '{政府|せいふ}', ro: 'seifu', vi: 'chính phủ' },
      { w: '{政治家|せいじか}', ro: 'seijika', vi: 'chính trị gia' },
      { w: '{行政|ぎょうせい}', ro: 'gyousei', vi: 'hành chính (N1)' },
    ],
  },
  '民': {
    hv: 'DÂN', nghia: 'người dân', en: 'people / citizens',
    on: ['ミン'], kun: ['たみ'],
    nho: 'Theo cách giải thích phổ biến, chữ cổ vẽ con mắt bị một mũi nhọn đâm — người bị cai trị → DÂN thường. Viết 5 nét, nét cuối là nét móc cong lên phải. ⚠ Khác 氏 (thị — họ, 4 nét, không có khung phía trên).',
    tu: [
      { w: '{国民|こくみん}', ro: 'kokumin', vi: 'người dân (một nước)' },
      { w: '{市民|しみん}', ro: 'shimin', vi: 'người dân thành phố' },
      { w: '{住民|じゅうみん}', ro: 'juumin', vi: 'cư dân' },
      { w: '{民族|みんぞく}', ro: 'minzoku', vi: 'dân tộc (N2)' },
    ],
  },
  '件': {
    hv: 'KIỆN', nghia: 'vụ việc; điều khoản', en: 'matter / case',
    on: ['ケン'], kun: [],
    nho: 'Bên trái 亻 (người), bên phải 牛 (con bò): người xưa đếm tài sản theo TỪNG CON BÒ → từng MÓN, từng VỤ → 事件, ～件 (メールが3件 — 3 email).',
    tu: [
      { w: '{事件|じけん}', ro: 'jiken', vi: 'vụ án, vụ việc' },
      { w: '{条件|じょうけん}', ro: 'jouken', vi: 'điều kiện (N3)' },
      { w: '{用件|ようけん}', ro: 'youken', vi: 'việc cần nói (N2)' },
      { w: '～{件|けん}', ro: '~ken', vi: '(đếm) vụ, việc, email' },
    ],
  },
  '状': {
    hv: 'TRẠNG', nghia: 'hình trạng, tình trạng; tờ thư, giấy', en: 'condition / letter',
    on: ['ジョウ'], kun: [],
    nho: 'Bên trái 丬 (tấm ván — gợi âm ジョウ), bên phải 犬 (con chó): theo cách giải thích phổ biến, chữ chỉ HÌNH DẠNG con chó → hình trạng, tình TRẠNG → 状態; về sau còn nghĩa tờ giấy viết rõ sự tình → 招待状 (thiệp mời).',
    tu: [
      { w: '{状況|じょうきょう}', ro: 'joukyou', vi: 'tình hình' },
      { w: '{状態|じょうたい}', ro: 'joutai', vi: 'trạng thái (N3)' },
      { w: '{招待状|しょうたいじょう}', ro: 'shoutaijou', vi: 'thiệp mời' },
      { w: '{年賀状|ねんがじょう}', ro: 'nengajou', vi: 'thiệp chúc Tết' },
    ],
  },
  '候': {
    hv: 'HẬU', nghia: 'thời tiết, khí hậu; chờ đợi', en: 'climate / wait',
    on: ['コウ'], kun: ['そうろう'],
    nho: 'Bên trái 亻 (người) + một nét sổ ngắn, bên phải phần gợi âm コウ (người cầm cung đứng canh): người ĐỨNG TRÔNG CHỪNG, chờ đợi → nhìn trời chờ thời tiết → khí HẬU → 天候, 気候. ⚠ Quên nét sổ ngắn là thành 侯 (hầu tước).',
    tu: [
      { w: '{天候|てんこう}', ro: 'tenkou', vi: 'thời tiết (trong một khoảng)' },
      { w: '{気候|きこう}', ro: 'kikou', vi: 'khí hậu' },
      { w: '{候補|こうほ}', ro: 'kouho', vi: 'ứng cử viên, phương án được đề cử (N2)' },
    ],
  },
  '速': {
    hv: 'TỐC', nghia: 'nhanh (tốc độ)', en: 'fast / speed',
    on: ['ソク'], kun: ['はや・い', 'はや・める', 'すみ・やか'],
    nho: 'Bên trái-dưới 辶 (bước đi), bên trong 束 (bó — gợi âm ソク; 約束): bó gọn hành trang rồi đi cho NHANH → 速い, 速度. ⚠ 速い = nhanh về tốc độ (tàu, chạy, nói) ≠ 早い = sớm về thời điểm (dậy sớm). Khác 連 (辶 + 車).',
    tu: [
      { w: '{速|はや}い', ro: 'hayai', vi: 'nhanh (tốc độ)' },
      { w: '{速度|そくど}', ro: 'sokudo', vi: 'tốc độ' },
      { w: '{速報|そくほう}', ro: 'sokuhou', vi: 'tin nhanh' },
      { w: '{高速道路|こうそくどうろ}', ro: 'kousoku douro', vi: 'đường cao tốc' },
      { w: '{早速|さっそく}', ro: 'sassoku', vi: 'ngay lập tức (N3)' },
    ],
  },
  '路': {
    hv: 'LỘ', nghia: 'con đường', en: 'road / path',
    on: ['ロ'], kun: ['じ'],
    nho: 'Bên trái ⻊ (chân), bên phải 各 (mỗi — gợi âm ロ): con ĐƯỜNG mà mỗi người đi bằng đôi chân → 道路, 線路. Cùng 各: 落 (落ちる), 絡 (連絡).',
    tu: [
      { w: '{道路|どうろ}', ro: 'douro', vi: 'đường xe chạy' },
      { w: '{線路|せんろ}', ro: 'senro', vi: 'đường ray' },
      { w: '{通路|つうろ}', ro: 'tsuuro', vi: 'lối đi' },
      { w: '{家路|いえじ}', ro: 'ieji', vi: 'đường về nhà (N1)' },
    ],
  },
  '価': {
    hv: 'GIÁ', nghia: 'giá cả, giá trị', en: 'price / value',
    on: ['カ'], kun: ['あたい'],
    nho: 'Bên trái 亻 (người), bên phải 覀 (phần trên của 賈 — người buôn bán): người buôn định GIÁ cho món hàng → 物価, 価格.',
    tu: [
      { w: '{物価|ぶっか}', ro: 'bukka', vi: 'vật giá' },
      { w: '{価格|かかく}', ro: 'kakaku', vi: 'giá (N2)' },
      { w: '{価値|かち}', ro: 'kachi', vi: 'giá trị (N2)' },
      { w: '{定価|ていか}', ro: 'teika', vi: 'giá niêm yết (N2)' },
    ],
  },
  '値': {
    hv: 'TRỊ', nghia: 'giá; trị số', en: 'price / value',
    on: ['チ'], kun: ['ね', 'あたい'],
    nho: 'Bên trái 亻 (người), bên phải 直 (thẳng, đúng — gợi âm チ; 直す): cái giá NGAY THẲNG, đúng với món hàng → 値段, 価値. ⚠ Khác 植 (thực — 木 + 直: 植物).',
    tu: [
      { w: '{値段|ねだん}', ro: 'nedan', vi: 'giá (một món)' },
      { w: '{値上|ねあ}がり', ro: 'neagari', vi: '(giá) tăng' },
      { w: '{値上|ねあ}げ', ro: 'neage', vi: 'tăng giá (người bán làm)' },
      { w: '{価値|かち}', ro: 'kachi', vi: 'giá trị (N2)' },
    ],
  },
  '法': {
    hv: 'PHÁP', nghia: 'phép tắc, luật; cách làm', en: 'law / method',
    on: ['ホウ', 'ハッ', 'ホッ'], kun: [],
    nho: 'Bên trái 氵 (nước), bên phải 去 (đi — 過去): nước luôn CHẢY XUỐNG chỗ thấp — quy luật không đổi = PHÉP, LUẬT → 法律, 方法. ⚠ 文法 đọc ぶんぽう (ん + ほ → ぽ).',
    tu: [
      { w: '{方法|ほうほう}', ro: 'houhou', vi: 'phương pháp, cách' },
      { w: '{法律|ほうりつ}', ro: 'houritsu', vi: 'pháp luật' },
      { w: '{文法|ぶんぽう}', ro: 'bunpou', vi: 'ngữ pháp' },
      { w: '{法学部|ほうがくぶ}', ro: 'hougakubu', vi: 'khoa Luật' },
    ],
  },
  '種': {
    hv: 'CHỦNG', nghia: 'loại; hạt giống', en: 'kind / seed',
    on: ['シュ'], kun: ['たね'],
    nho: 'Bên trái 禾 (cây lúa), bên phải 重 (nặng — 重い): hạt lúa NẶNG, CHẮC được giữ làm GIỐNG → 種 (たね), rồi "giống, loại" → 種類. Khác 動 (動く — 重 + 力).',
    tu: [
      { w: '{種類|しゅるい}', ro: 'shurui', vi: 'loại, chủng loại' },
      { w: '{種|たね}', ro: 'tane', vi: 'hạt giống' },
      { w: '{一種|いっしゅ}', ro: 'isshu', vi: 'một loại (N2)' },
      { w: '{人種|じんしゅ}', ro: 'jinshu', vi: 'chủng tộc (N1)' },
    ],
  },
  '類': {
    hv: 'LOẠI', nghia: 'loại, giống nhau', en: 'kind / sort',
    on: ['ルイ'], kun: ['たぐ・い'],
    nho: 'Bên trái 米 (gạo) + 大 (trong chữ cổ là 犬 — con chó), bên phải 頁 (cái đầu): những con vật, hạt gạo TRÔNG GIỐNG NHAU gom thành một LOẠI → 種類, 書類. ⚠ Phần dưới bên trái là 大 (không có dấu chấm như 犬).',
    tu: [
      { w: '{種類|しゅるい}', ro: 'shurui', vi: 'loại, chủng loại' },
      { w: '{書類|しょるい}', ro: 'shorui', vi: 'giấy tờ, hồ sơ' },
      { w: '{人類|じんるい}', ro: 'jinrui', vi: 'nhân loại (N2)' },
      { w: '{親類|しんるい}', ro: 'shinrui', vi: 'họ hàng (N2)' },
    ],
  },
  '告': {
    hv: 'CÁO', nghia: 'báo, nói cho biết', en: 'announce / inform',
    on: ['コク'], kun: ['つ・げる'],
    nho: 'Trên là 牛 (con bò — viết gọn), dưới là 口 (miệng): theo cách giải thích phổ biến, người xưa dâng bò rồi KHẤN BÁO với thần → báo, nói cho biết → 報告, 広告.',
    tu: [
      { w: '{報告|ほうこく}', ro: 'houkoku', vi: 'báo cáo' },
      { w: '{広告|こうこく}', ro: 'koukoku', vi: 'quảng cáo (N3)' },
      { w: '{警告|けいこく}', ro: 'keikoku', vi: 'cảnh cáo (N2)' },
      { w: '{告|つ}げる', ro: 'tsugeru', vi: 'báo, nói cho biết (N2)' },
    ],
  },
  '和': {
    hv: 'HOÀ', nghia: 'hoà thuận, yên ổn; (kiểu) Nhật Bản', en: 'harmony / Japanese style',
    on: ['ワ', 'オ'], kun: ['やわ・らぐ', 'なご・む'],
    nho: 'Bên trái 禾 (lúa — gợi âm), bên phải 口 (miệng): lúa đủ cho MỌI MIỆNG ăn → yên ổn, HOÀ thuận → 平和; nghĩa "kiểu Nhật" → 和食, 和室. ⚠ Khác 利 (禾 + 刂 — 便利) và 私 (禾 + 厶).',
    tu: [
      { w: '{平和|へいわ}', ro: 'heiwa', vi: 'hoà bình' },
      { w: '{和食|わしょく}', ro: 'washoku', vi: 'món ăn Nhật' },
      { w: '{和室|わしつ}', ro: 'washitsu', vi: 'phòng kiểu Nhật' },
      { w: '{令和|れいわ}', ro: 'reiwa', vi: 'niên hiệu Reiwa (từ 2019)' },
    ],
  },
  '戦': {
    hv: 'CHIẾN', nghia: 'đánh nhau, chiến tranh', en: 'war / fight',
    on: ['セン'], kun: ['たたか・う', 'いくさ'],
    nho: 'Bên trái 単 (cái khiên — gợi âm セン; 簡単), bên phải 戈 (cây qua — vũ khí): khiên + giáo = CHIẾN đấu → 戦争, 戦う.',
    tu: [
      { w: '{戦争|せんそう}', ro: 'sensou', vi: 'chiến tranh' },
      { w: '{戦|たたか}う', ro: 'tatakau', vi: 'chiến đấu (N3)' },
      { w: '{挑戦|ちょうせん}', ro: 'chousen', vi: 'thử thách, thử sức' },
      { w: '{作戦|さくせん}', ro: 'sakusen', vi: 'kế sách, chiến thuật (N2)' },
    ],
  },
  '争': {
    hv: 'TRANH', nghia: 'tranh giành', en: 'compete / dispute',
    on: ['ソウ'], kun: ['あらそ・う'],
    nho: 'Phía trên ⺈ và dạng ヨ là HAI BÀN TAY, nét sổ móc 亅 là một cây gậy: hai tay GIÀNH GIẬT một cây gậy = TRANH → 戦争, 競争. ⚠ Khác 事 (sự — 事件): 事 có 口 ở trên.',
    tu: [
      { w: '{戦争|せんそう}', ro: 'sensou', vi: 'chiến tranh' },
      { w: '{競争|きょうそう}', ro: 'kyousou', vi: 'cạnh tranh (N3)' },
      { w: '{争|あらそ}う', ro: 'arasou', vi: 'tranh nhau, giành nhau (N2)' },
      { w: '{言|い}い{争|あらそ}う', ro: 'iiarasou', vi: 'cãi nhau' },
    ],
  },
};
