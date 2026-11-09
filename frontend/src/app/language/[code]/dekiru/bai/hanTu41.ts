/**
 * Chữ Hán MỚI của Bài 41 (就職活動 — tiếp sau sách, bài đầu cấp N2) cho thẻ chữ Hán — cùng định dạng hanTu.ts.
 * 24 chữ: 就 採 志 履 企 契 析 項 挑 魅 秀 柄 極 抱 薦 雇 弊 攻 型 厚 遇 貢 献 獲 (phần lớn N2 theo các bảng tham khảo phổ biến; một số
 * bảng xếp 履 析 魅 遇 貢 献 獲 弊 雇 薦 vào N1 nhưng các từ 履歴書・分析・魅力・待遇・貢献・獲得・弊社・雇用・推薦 là từ N2 rất hay gặp —
 * JLPT không công bố danh sách chữ chính thức) — bảng `b41-han-tu` trong bai41.ts.
 * Không trùng hanTu.ts, hanTu16–39.ts, hanLop.ts và các bảng chữ Hán Bài 1–39 (際 Bài 26, 職 Bài 24, 募 Bài 38, 希・催 Bài 39 đã có thẻ).
 * Cách nhớ: theo cấu tạo chữ (phần chỉ nghĩa + phần gợi âm của chữ hình thanh ghi rõ). Từ đi chung ưu tiên từ dùng trong bai41.ts và
 * từ đã học ở bài trước (就職・履歴書 Bài 16, 専攻 Bài 26, 積極的 Bài 28, 推 Bài 31, 分析・項目 Bài 33, 挑戦・意志 Bài 34, 弊社 Bài 37).
 * On / Kun theo bảng thường dụng (常用): 析 項 魅 弊 遇 chỉ có âm On; 献 có On ケン・コン; 貢 có On コウ・ク và Kun みつ・ぐ; 極 có On
 * キョク・ゴク; 抱 có ba Kun だ・く／いだ・く／かか・える; 型 có On ケイ và Kun かた (trong từ ghép hay đục thành がた).
 * Tệp chỉ có `import type` — tải chậm như hanTu.ts.
 */
import type { HanTu } from '@/components/sach-hoc/kanji';

export const HAN_TU_41: Record<string, HanTu> = {
  '就': {
    hv: 'TỰU', nghia: 'đi tới, nhận (việc, chức vụ)', en: 'take up (a job) / settle in',
    on: ['シュウ', 'ジュ'], kun: ['つ・く', 'つ・ける'],
    nho: 'Bên trái 京 (kinh đô — chỗ cao, nơi người ta tụ về), bên phải 尤 (vượt trội): TỚI CHỖ CAO RỒI Ở LẠI, NHẬN LẤY VỊ TRÍ = TỰU → 就職 (nhận việc), 仕事に就く. ⚠ つく có nhiều chữ: 着く (đến nơi), 付く (dính), 就く (nhận việc, chức). Âm ジュ chỉ còn trong 成就 (thành tựu — N1).',
    tu: [
      { w: '{就職|しゅうしょく}', ro: 'shuushoku', vi: 'tìm được việc, vào làm (Bài 16)' },
      { w: '{就活|しゅうかつ}', ro: 'shuukatsu', vi: 'hoạt động tìm việc' },
      { w: '{仕事|しごと}に{就|つ}く', ro: 'shigoto ni tsuku', vi: 'nhận một công việc' },
      { w: '{成就|じょうじゅ}', ro: 'jouju', vi: 'thành tựu, đạt nguyện (N1)' },
    ],
  },
  '採': {
    hv: 'THẢI', nghia: 'hái, lấy; chọn dùng', en: 'pick / adopt / employ',
    on: ['サイ'], kun: ['と・る'],
    nho: 'Bên trái 扌 (tay), bên phải 采 (サイ — gợi âm; 采 = bàn tay 爫 đặt trên cây 木, hái quả): TAY HÁI, CHỌN LẤY cái tốt = THẢI → 採用 (chọn người dùng — tuyển dụng), 採点 (chấm điểm). ⚠ Giống 菜 (さい — rau: ⺾ + 采): tay hái thì 採, cỏ rau thì 菜 — cùng đọc サイ.',
    tu: [
      { w: '{採用|さいよう}', ro: 'saiyou', vi: 'tuyển dụng; chấp nhận dùng' },
      { w: '{採点|さいてん}', ro: 'saiten', vi: 'chấm điểm' },
      { w: '{山菜|さんさい}を{採|と}る', ro: 'sansai o toru', vi: 'hái rau rừng' },
      { w: '{不採用|ふさいよう}', ro: 'fusaiyou', vi: 'không được tuyển' },
    ],
  },
  '志': {
    hv: 'CHÍ', nghia: 'chí hướng, ý chí', en: 'will / aspiration',
    on: ['シ'], kun: ['こころざ・す', 'こころざし'],
    nho: 'Trên 士 (kẻ sĩ — người có học), dưới 心 (trái tim): TẤM LÒNG CỦA KẺ SĨ HƯỚNG VỀ MỘT CON ĐƯỜNG = CHÍ → 志望 (nguyện vọng), 意志 (ý chí — Bài 34), 志す. Là phần gợi âm của 誌 (し — tạp chí: 言 + 志). ⚠ 士 trên dài, dưới ngắn (khác 土 — đất).',
    tu: [
      { w: '{志望|しぼう}', ro: 'shibou', vi: 'nguyện vọng' },
      { w: '{志望動機|しぼうどうき}', ro: 'shibou douki', vi: 'lý do ứng tuyển' },
      { w: '{意志|いし}', ro: 'ishi', vi: 'ý chí (Bài 34)' },
      { w: '{志|こころざ}す', ro: 'kokorozasu', vi: 'lập chí, hướng tới' },
      { w: '{志|こころざし}', ro: 'kokorozashi', vi: 'chí hướng; tấm lòng' },
    ],
  },
  '履': {
    hv: 'LÝ', nghia: 'đi (giày); những gì đã trải qua', en: 'wear (shoes) / record of the past',
    on: ['リ'], kun: ['は・く'],
    nho: 'Trên-trái 尸 (thân người), bên trong 復 (đi tới đi lui): NGƯỜI ĐI LẠI BẰNG GIÀY = LÝ → 靴を履く; "con đường chân đã đi qua" → 履歴 (lý lịch), 履修 (đăng ký học môn). ⚠ Chứa 復 (ふく — 復習) nhưng đọc リ. Mặc quần, váy, giày, tất = 履く; áo = 着る.',
    tu: [
      { w: '{履歴書|りれきしょ}', ro: 'rirekisho', vi: 'sơ yếu lý lịch (Bài 16)' },
      { w: '{靴|くつ}を{履|は}く', ro: 'kutsu o haku', vi: 'đi giày' },
      { w: '{履修|りしゅう}', ro: 'rishuu', vi: 'đăng ký học môn' },
    ],
  },
  '企': {
    hv: 'XÍ', nghia: 'mưu tính, dự định', en: 'plan / undertake',
    on: ['キ'], kun: ['くわだ・てる'],
    nho: 'Trên 人 (người), dưới 止 (bàn chân): NGƯỜI KIỄNG CHÂN NHÌN RA XA → tính trước, mưu đồ = XÍ → 企業 (doanh nghiệp — "nơi mưu tính việc làm ăn"), 企画 (kế hoạch, dự án). Chữ ít nét, gặp rất nhiều — nên viết được. 企てる (âm mưu — N1, văn viết).',
    tu: [
      { w: '{企業|きぎょう}', ro: 'kigyou', vi: 'doanh nghiệp' },
      { w: '{企画|きかく}', ro: 'kikaku', vi: 'kế hoạch, dự án' },
      { w: '{大企業|だいきぎょう}', ro: 'daikigyou', vi: 'doanh nghiệp lớn' },
      { w: '{企|くわだ}てる', ro: 'kuwadateru', vi: 'mưu tính (N1)' },
    ],
  },
  '契': {
    hv: 'KHẾ', nghia: 'giao ước, khắc ghi', en: 'contract / pledge',
    on: ['ケイ'], kun: ['ちぎ・る'],
    nho: 'Trên 丰 (vạch khắc) + 刀 (con dao), dưới 大: DÙNG DAO KHẮC VẠCH LÀM BẰNG CHỨNG GIAO ƯỚC = KHẾ → 契約 (hợp đồng). "Vạch khắc đánh dấu chỗ bắt đầu" → 契機 (bước khởi đầu — văn viết). ⚠ 契機 đồng âm 景気 (kinh tế — Bài 27). Kun ちぎる (thề nguyền) rất hiếm.',
    tu: [
      { w: '{契約|けいやく}', ro: 'keiyaku', vi: 'hợp đồng' },
      { w: '{契機|けいき}', ro: 'keiki', vi: 'bước khởi đầu (văn viết)' },
      { w: '{契約社員|けいやくしゃいん}', ro: 'keiyaku shain', vi: 'nhân viên hợp đồng' },
      { w: '{契約書|けいやくしょ}', ro: 'keiyakusho', vi: 'bản hợp đồng' },
    ],
  },
  '析': {
    hv: 'TÍCH', nghia: 'tách ra, phân tích', en: 'analyze / split',
    on: ['セキ'], kun: [],
    nho: 'Bên trái 木 (gỗ), bên phải 斤 (cái rìu): DÙNG RÌU BỔ KHÚC GỖ RA TỪNG MẢNH = TÍCH → 分析 (chia ra mà xem xét), 自己分析. ⚠ Ba chữ cùng 斤 dễ nhầm: 析 (木 — phân tích) · 折 (扌 — おる, gãy) · 祈 (礻 — いのる, cầu). Bảng thường dụng chỉ có âm On.',
    tu: [
      { w: '{分析|ぶんせき}', ro: 'bunseki', vi: 'phân tích (Bài 33)' },
      { w: '{自己分析|じこぶんせき}', ro: 'jiko bunseki', vi: 'tự phân tích bản thân' },
      { w: '{解析|かいせき}', ro: 'kaiseki', vi: 'phân tích chi tiết (N1)' },
    ],
  },
  '項': {
    hv: 'HẠNG', nghia: 'điều, mục', en: 'item / clause',
    on: ['コウ'], kun: [],
    nho: 'Bên trái 工 (コウ — gợi âm), bên phải 頁 (cái đầu): nghĩa gốc là GÁY, chỗ nối đầu với thân → "từng khúc, từng mục" = HẠNG → 項目 (mục — Bài 33), 事項 (điều khoản). ⚠ Giống 頂 (ちょう — đỉnh: 丁 + 頁) và 順 (じゅん: 川 + 頁) — nhìn phần bên trái.',
    tu: [
      { w: '{項目|こうもく}', ro: 'koumoku', vi: 'mục, hạng mục (Bài 33)' },
      { w: '{事項|じこう}', ro: 'jikou', vi: 'điều khoản, điều' },
      { w: '{注意事項|ちゅういじこう}', ro: 'chuui jikou', vi: 'điểm cần lưu ý' },
    ],
  },
  '挑': {
    hv: 'KHIÊU', nghia: 'thách thức, khiêu chiến', en: 'challenge',
    on: ['チョウ'], kun: ['いど・む'],
    nho: 'Bên trái 扌 (tay), bên phải 兆 (チョウ — gợi âm; vết nứt trên mai rùa bói): GIƠ TAY KHIÊU CHIẾN = KHIÊU → 挑戦 (Bài 34), 挑む. Họ 兆 nhìn phần bên trái: 挑 (扌 — thách) · 眺 (目 — ながめる, ngắm) · 跳 (足 — とぶ, nhảy) · 桃 (木 — もも, đào) · 逃 (辶 — にげる, chạy trốn).',
    tu: [
      { w: '{挑戦|ちょうせん}', ro: 'chousen', vi: 'thử thách, thử sức (Bài 34)' },
      { w: '{挑|いど}む', ro: 'idomu', vi: 'dấn thân, thách thức' },
      { w: '{記録|きろく}に{挑|いど}む', ro: 'kiroku ni idomu', vi: 'thử phá kỷ lục' },
    ],
  },
  '魅': {
    hv: 'MỊ', nghia: 'mê hoặc, hấp dẫn', en: 'fascinate / charm',
    on: ['ミ'], kun: [],
    nho: 'Bên trái 鬼 (ma quỷ — chữ "鬼" có đuôi kéo dài ôm phần bên phải), bên phải 未 (ミ — gợi âm): SỨC HÚT NHƯ BỊ MA ÁM = MỊ → 魅力 (sức hấp dẫn). Hầu như chỉ gặp trong 魅力・魅力的・魅了 — nhớ cả từ.',
    tu: [
      { w: '{魅力|みりょく}', ro: 'miryoku', vi: 'sức hấp dẫn' },
      { w: '{魅力的|みりょくてき}な', ro: 'miryokuteki na', vi: 'hấp dẫn, quyến rũ' },
      { w: '{魅了|みりょう}する', ro: 'miryou suru', vi: 'mê hoặc, làm say mê (N1)' },
    ],
  },
  '秀': {
    hv: 'TÚ', nghia: 'xuất sắc, ưu tú', en: 'excel / outstanding',
    on: ['シュウ'], kun: ['ひい・でる'],
    nho: 'Trên 禾 (cây lúa), dưới 乃: BÔNG LÚA VƯƠN CAO HƠN CẢ RUỘNG = TÚ (xuất sắc) → 優秀, 秀才. Là phần gợi âm của 透 (とう — xuyên qua: 辶 + 秀) và 誘 (ゆう — rủ: 言 + 秀, Bài 22).',
    tu: [
      { w: '{優秀|ゆうしゅう}', ro: 'yuushuu', vi: 'xuất sắc' },
      { w: '{秀才|しゅうさい}', ro: 'shuusai', vi: 'người học giỏi' },
      { w: '{最優秀賞|さいゆうしゅうしょう}', ro: 'saiyuushuushou', vi: 'giải xuất sắc nhất' },
    ],
  },
  '柄': {
    hv: 'BÍNH', nghia: 'cán, chuôi; hoa văn; dáng vẻ, tính cách', en: 'handle / pattern / character',
    on: ['ヘイ'], kun: ['がら', 'え'],
    nho: 'Bên trái 木 (gỗ), bên phải 丙 (ヘイ — gợi âm): CÁN GỖ ĐỂ CẦM = chuôi (え); từ "cái cầm nắm được" sang "kiểu dáng, hoa văn" (がら) → 人柄 (dáng người = nhân cách), 花柄 (hoa văn hoa). Hầu hết từ hay gặp đọc Kun がら; On ヘイ trong 横柄 (kiêu căng — N1).',
    tu: [
      { w: '{人柄|ひとがら}', ro: 'hitogara', vi: 'nhân cách, tính tình' },
      { w: '{花柄|はながら}', ro: 'hanagara', vi: 'hoa văn hình hoa' },
      { w: '{手柄|てがら}', ro: 'tegara', vi: 'công lao' },
      { w: '{横柄|おうへい}', ro: 'ouhei', vi: 'kiêu căng, hống hách (N1)' },
    ],
  },
  '極': {
    hv: 'CỰC', nghia: 'cực, tột cùng', en: 'extreme / pole',
    on: ['キョク', 'ゴク'], kun: ['きわ・める', 'きわ・まる', 'きわ・み'],
    nho: 'Bên trái 木 (gỗ), bên phải 亟 (gợi âm キョク — "đến tận cùng"): CÂY XÀ CAO NHẤT CỦA NHÀ → chỗ tận cùng = CỰC → 北極, 積極的・消極的 (Bài 28 — "dồn tới cực" / "lùi về cực"). Hai âm On: キョク (phần lớn) · ゴク (極楽 — cực lạc). 極めて (cực kỳ — văn viết).',
    tu: [
      { w: '{積極的|せっきょくてき}', ro: 'sekkyokuteki', vi: 'tích cực (Bài 28)' },
      { w: '{消極的|しょうきょくてき}', ro: 'shoukyokuteki', vi: 'thụ động (Bài 28)' },
      { w: '{北極|ほっきょく}', ro: 'hokkyoku', vi: 'Bắc Cực' },
      { w: '{極|きわ}めて', ro: 'kiwamete', vi: 'cực kỳ (văn viết)' },
    ],
  },
  '抱': {
    hv: 'BÃO', nghia: 'ôm; ấp ủ; gánh vác', en: 'embrace / hold / harbor',
    on: ['ホウ'], kun: ['だ・く', 'いだ・く', 'かか・える'],
    nho: 'Bên trái 扌 (tay), bên phải 包 (ホウ — bao bọc; gợi âm): TAY ÔM BỌC LẤY = BÃO → 抱く (ôm), 抱える (ôm; gánh vấn đề); "ôm ấp trong lòng" → 抱負 (điều ấp ủ khi bắt đầu việc mới: 入社にあたり抱負を述べる). Cùng 包 (ホウ): 包む (Bài 36 包装), 泡 (あわ — bọt). Ba âm Kun: だく (ôm bằng tay) · いだく (ấp ủ — văn viết) · かかえる.',
    tu: [
      { w: '{抱負|ほうふ}', ro: 'houfu', vi: 'hoài bão, dự định khi bắt đầu việc mới' },
      { w: '{抱|かか}える', ro: 'kakaeru', vi: 'ôm; gánh (vấn đề) — N2' },
      { w: '{抱|だ}く', ro: 'daku', vi: 'ôm' },
      { w: '{夢|ゆめ}を{抱|いだ}く', ro: 'yume o idaku', vi: 'ấp ủ ước mơ' },
    ],
  },
  '薦': {
    hv: 'TIẾN', nghia: 'tiến cử, giới thiệu (người, vật tốt)', en: 'recommend',
    on: ['セン'], kun: ['すす・める'],
    nho: 'Trên ⺾ (cỏ), dưới 廌 (con vật thần trong truyền thuyết, ăn cỏ tốt): DÂNG CỎ TỐT LÊN → tiến cử = TIẾN → 推薦 (tiến cử, thư giới thiệu — 推 Bài 31). ⚠ Ba chữ đọc すすめる: 勧める (khuyên, mời) · 進める (tiến hành — Bài 35) · 薦める (giới thiệu người / vật tốt).',
    tu: [
      { w: '{推薦|すいせん}', ro: 'suisen', vi: 'tiến cử, giới thiệu' },
      { w: '{推薦状|すいせんじょう}', ro: 'suisenjou', vi: 'thư giới thiệu' },
      { w: '{薦|すす}める', ro: 'susumeru', vi: 'giới thiệu (người / vật tốt)' },
    ],
  },
  '雇': {
    hv: 'CỐ', nghia: 'thuê (người làm)', en: 'employ / hire',
    on: ['コ'], kun: ['やと・う'],
    nho: 'Trên-trái 戸 (cửa nhà), bên trong 隹 (con chim): CHIM NUÔI TRONG NHÀ LÀM VIỆC CHO CHỦ → thuê người làm = CỐ → 雇う, 雇用. ⚠ Giống 顧 (こ — 顧客, 回顧: 雇 + 頁) — cùng đọc コ. こ ngắn, không phải こう.',
    tu: [
      { w: '{雇用|こよう}', ro: 'koyou', vi: 'việc làm, tuyển dụng (quan hệ lao động)' },
      { w: '{雇|やと}う', ro: 'yatou', vi: 'thuê người làm' },
      { w: '{解雇|かいこ}', ro: 'kaiko', vi: 'sa thải (N1)' },
      { w: '{終身雇用|しゅうしんこよう}', ro: 'shuushin koyou', vi: 'tuyển dụng suốt đời' },
    ],
  },
  '弊': {
    hv: 'TỆ', nghia: 'rách, hư, xấu; (khiêm) của tôi', en: 'worn-out / harm / our (humble)',
    on: ['ヘイ'], kun: [],
    nho: 'Trên 敝 (ヘイ — tấm vải rách tả tơi; gợi âm), dưới 廾 (hai bàn tay): RÁCH NÁT, HƯ = TỆ → 弊害 (tác hại); khiêm nhường "công ty tồi tàn của tôi" → 弊社 (Bài 37). ⚠ Giống 幣 (へい — tiền: 敝 + 巾 vải, 紙幣) — cùng đọc ヘイ; nhìn phần dưới: 廾 = 弊, 巾 = 幣.',
    tu: [
      { w: '{弊社|へいしゃ}', ro: 'heisha', vi: 'công ty chúng tôi (khiêm — Bài 37)' },
      { w: '{弊害|へいがい}', ro: 'heigai', vi: 'tác hại (N1)' },
    ],
  },
  '攻': {
    hv: 'CÔNG', nghia: 'tấn công; dồn sức học (một môn)', en: 'attack / major in',
    on: ['コウ'], kun: ['せ・める'],
    nho: 'Bên trái 工 (コウ — gợi âm), bên phải 攵 (tay cầm gậy đánh): ĐÁNH = CÔNG → 攻撃 (tấn công), 攻める; "dồn sức đánh vào một môn" → 専攻 (chuyên ngành — Bài 26). ⚠ Giống 功 (こう — công lao: 工 + 力, 成功) — cùng đọc コウ. せめる đồng âm 責める (trách — Bài 28).',
    tu: [
      { w: '{専攻|せんこう}', ro: 'senkou', vi: 'chuyên ngành (Bài 26)' },
      { w: '{攻撃|こうげき}', ro: 'kougeki', vi: 'tấn công' },
      { w: '{攻|せ}める', ro: 'semeru', vi: 'tấn công' },
    ],
  },
  '型': {
    hv: 'HÌNH', nghia: 'khuôn, kiểu, mẫu', en: 'mold / type / model',
    on: ['ケイ'], kun: ['かた'],
    nho: 'Trên 刑 (ケイ — gợi âm), dưới 土 (đất): KHUÔN BẰNG ĐẤT SÉT ĐỂ ĐÚC ĐỒ = HÌNH (khuôn mẫu) → 型 (かた — khuôn, kiểu), 大型 (cỡ lớn), ジョブ型採用. Trong từ ghép Kun thường đục thành がた. ⚠ Đồng âm 形 (ケイ・かたち — hình dạng): 型 = khuôn / kiểu cố định (血液型, 新型), 形 = hình dáng nhìn thấy (図形, 人形).',
    tu: [
      { w: '{大型|おおがた}', ro: 'oogata', vi: 'cỡ lớn' },
      { w: '{血液型|けつえきがた}', ro: 'ketsuekigata', vi: 'nhóm máu' },
      { w: 'ジョブ{型|がた}{採用|さいよう}', ro: 'jobu-gata saiyou', vi: 'tuyển dụng theo vị trí' },
      { w: '{典型的|てんけいてき}', ro: 'tenkeiteki', vi: 'điển hình (N2)' },
    ],
  },
  '厚': {
    hv: 'HẬU', nghia: 'dày; hậu hĩnh, chu đáo', en: 'thick / generous',
    on: ['コウ'], kun: ['あつ・い'],
    nho: 'Ngoài 厂 (vách núi), trong 日 + 子 (các lớp chồng lên): VÁCH ĐÁ CHỒNG NHIỀU LỚP = HẬU (dày) → 厚い; "lo cho dày dặn" → 厚生 (chăm lo đời sống — 福利厚生, 厚生労働省). ⚠ あつい có ba chữ: 厚い (dày) · 暑い (nóng trời) · 熱い (nóng vật).',
    tu: [
      { w: '{厚|あつ}い', ro: 'atsui', vi: 'dày' },
      { w: '{福利厚生|ふくりこうせい}', ro: 'fukuri kousei', vi: 'phúc lợi' },
      { w: '{厚生労働省|こうせいろうどうしょう}', ro: 'kousei roudoushou', vi: 'Bộ Y tế – Lao động – Phúc lợi' },
      { w: '{温厚|おんこう}', ro: 'onkou', vi: 'ôn hoà, hiền hậu (N1)' },
    ],
  },
  '遇': {
    hv: 'NGỘ', nghia: 'gặp; đối đãi', en: 'meet / treat',
    on: ['グウ'], kun: [],
    nho: 'Bên trái 辶 (đi), bên phải 禺 (グウ — gợi âm): ĐI RỒI GẶP = NGỘ → 遭遇 (bắt gặp), 境遇 (hoàn cảnh mình "gặp phải"); "cách đối đãi người mình gặp" → 待遇 (đãi ngộ). Cùng 禺 (グウ): 偶 (偶然 — Bài 26: 亻), 隅 (すみ — góc: 阝). Bảng thường dụng chỉ có âm On.',
    tu: [
      { w: '{待遇|たいぐう}', ro: 'taiguu', vi: 'đãi ngộ' },
      { w: '{境遇|きょうぐう}', ro: 'kyouguu', vi: 'hoàn cảnh' },
      { w: '{遭遇|そうぐう}', ro: 'souguu', vi: 'bắt gặp, chạm trán (N1)' },
    ],
  },
  '貢': {
    hv: 'CỐNG', nghia: 'dâng nộp', en: 'tribute / contribute',
    on: ['コウ', 'ク'], kun: ['みつ・ぐ'],
    nho: 'Trên 工 (コウ — gợi âm), dưới 貝 (vỏ sò — tiền, của cải): MANG CỦA CẢI DÂNG LÊN = CỐNG → 貢献 (cống hiến, đóng góp). Âm ク trong 年貢 (thuế ruộng thời xưa). ⚠ Giống 責 (せき — trách nhiệm): trên 工 = 貢, trên 龶 = 責.',
    tu: [
      { w: '{貢献|こうけん}', ro: 'kouken', vi: 'đóng góp, cống hiến' },
      { w: '{社会貢献|しゃかいこうけん}', ro: 'shakai kouken', vi: 'đóng góp cho xã hội' },
      { w: '{年貢|ねんぐ}', ro: 'nengu', vi: 'thuế ruộng (thời xưa)' },
    ],
  },
  '献': {
    hv: 'HIẾN', nghia: 'dâng, hiến', en: 'offer / dedicate',
    on: ['ケン', 'コン'], kun: [],
    nho: 'Bên trái 南, bên phải 犬 (con chó) — chữ cũ 獻 vẽ cái nồi lễ và con chó dâng trong lễ tế: DÂNG LÊN = HIẾN → 貢献, 献血 (hiến máu), 文献 (tài liệu "được dâng lại" cho đời sau). Âm コン trong 献立 (thực đơn bữa ăn) — từ rất hay gặp ở đề đọc.',
    tu: [
      { w: '{貢献|こうけん}', ro: 'kouken', vi: 'đóng góp, cống hiến' },
      { w: '{献立|こんだて}', ro: 'kondate', vi: 'thực đơn bữa ăn' },
      { w: '{文献|ぶんけん}', ro: 'bunken', vi: 'tài liệu nghiên cứu' },
      { w: '{献血|けんけつ}', ro: 'kenketsu', vi: 'hiến máu' },
    ],
  },
  '獲': {
    hv: 'HOẠCH', nghia: 'bắt được, giành được', en: 'catch / obtain',
    on: ['カク'], kun: ['え・る'],
    nho: 'Bên trái 犭 (thú), bên phải 蒦 (カク — gợi âm; tay nắm con chim): BẮT ĐƯỢC THÚ = HOẠCH → 獲物 (con mồi), 獲得 (giành được). Cùng 蒦: 穫 (かく — 収穫, gặt: 禾 lúa) cùng đọc カク; 護 (ご — 看護: 言) cũng có 蒦 nhưng đọc ゴ. Kun える hầu như chỉ gặp trong 獲物.',
    tu: [
      { w: '{獲得|かくとく}', ro: 'kakutoku', vi: 'giành được' },
      { w: '{獲物|えもの}', ro: 'emono', vi: 'con mồi' },
      { w: '{漁獲|ぎょかく}', ro: 'gyokaku', vi: 'đánh bắt (cá)' },
    ],
  },
};
