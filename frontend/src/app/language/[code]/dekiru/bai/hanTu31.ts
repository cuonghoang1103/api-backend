/**
 * Chữ Hán MỚI của Bài 31 (推理 — tiếp sau sách, cấp N3) cho thẻ chữ Hán — cùng định dạng hanTu.ts.
 * 20 chữ: 推 測 現 解 能 性 恐 隠 罪 容 像 細 詳 深 過 在 印 象 鍵 袋 (N3 theo các bảng tham khảo phổ biến; 推・測・隠・袋
 * có bảng xếp N2, 鍵 N2–N1 — thêm vào bảng thường dụng năm 2010; JLPT không công bố danh sách chữ chính thức) — bảng
 * `b31-han-tu` trong bai31.ts. Không trùng hanTu.ts, hanTu16–29.ts, hanLop.ts (đã kiểm 09/11/2026).
 * Cách nhớ: theo cấu tạo chữ (phần chỉ nghĩa + phần gợi âm của chữ hình thanh ghi rõ); với 能・隠・印 ghi "theo cách giải
 * thích phổ biến" vì nguồn gốc chữ cổ có nhiều thuyết; mẹo của 詳 ghi rõ là "mẹo". Từ đi chung ưu tiên từ dùng trong bai31.ts.
 * On / Kun theo bảng thường dụng (常用): 能 容 像 象 chỉ có âm On; 性 có On セイ・ショウ; 在 có Kun あ・る (hầu như không dùng).
 * Tệp chỉ có `import type` — tải chậm như hanTu.ts.
 */
import type { HanTu } from '@/components/sach-hoc/kanji';

export const HAN_TU_31: Record<string, HanTu> = {
  '推': {
    hv: 'SUY', nghia: 'đẩy; suy ra; tiến cử', en: 'push / infer',
    on: ['スイ'], kun: ['お・す'],
    nho: 'Bên trái 扌 (tay), bên phải 隹 (chim đuôi ngắn — gợi âm スイ): dùng tay ĐẨY tới → đẩy lý lẽ đi từng bước tới kết luận = SUY luận → 推理. ⚠ Khác 進 (tiến — 辶 + 隹) và 唯 (duy — 口 + 隹).',
    tu: [
      { w: '{推理|すいり}', ro: 'suiri', vi: 'suy luận' },
      { w: '{推測|すいそく}', ro: 'suisoku', vi: 'phỏng đoán' },
      { w: '{推理小説|すいりしょうせつ}', ro: 'suiri shousetsu', vi: 'truyện trinh thám' },
      { w: '{推薦|すいせん}', ro: 'suisen', vi: 'tiến cử, giới thiệu (N2)' },
    ],
  },
  '測': {
    hv: 'TRẮC', nghia: 'đo; ước đoán', en: 'measure / estimate',
    on: ['ソク'], kun: ['はか・る'],
    nho: 'Bên trái 氵 (nước), bên phải 則 (quy tắc — gợi âm ソク; 規則): thả dây xuống ĐO độ sâu của nước theo quy tắc → 測る, rồi "đo đoán" → 推測, 予測. ⚠ Khác 側 (trắc — bên cạnh: 亻 + 則).',
    tu: [
      { w: '{推測|すいそく}', ro: 'suisoku', vi: 'phỏng đoán' },
      { w: '{予測|よそく}', ro: 'yosoku', vi: 'dự đoán (N2)' },
      { w: '{測|はか}る', ro: 'hakaru', vi: 'đo (N2)' },
      { w: '{観測|かんそく}', ro: 'kansoku', vi: 'quan trắc (N1)' },
    ],
  },
  '現': {
    hv: 'HIỆN', nghia: 'hiện ra; hiện tại, thực tế', en: 'appear / present',
    on: ['ゲン'], kun: ['あらわ・れる', 'あらわ・す'],
    nho: 'Bên trái 王 (vốn là 玉 — viên ngọc), bên phải 見 (nhìn): viên ngọc mài xong, ánh sáng HIỆN ra cho người nhìn → 現れる; cái đang hiện ra trước mắt = 現在 (hiện tại). ⚠ Khác 規 (規則 — 夫 + 見).',
    tu: [
      { w: '{現場|げんば}', ro: 'genba', vi: 'hiện trường' },
      { w: '{現在|げんざい}', ro: 'genzai', vi: 'hiện tại' },
      { w: '{現金|げんきん}', ro: 'genkin', vi: 'tiền mặt' },
      { w: '{表現|ひょうげん}', ro: 'hyougen', vi: 'biểu hiện, cách diễn đạt (N3)' },
      { w: '{現|あらわ}れる', ro: 'arawareru', vi: 'xuất hiện (N3)' },
    ],
  },
  '解': {
    hv: 'GIẢI', nghia: 'cởi, gỡ; giải, hiểu', en: 'untie / solve',
    on: ['カイ', 'ゲ'], kun: ['と・く', 'と・かす', 'と・ける'],
    nho: 'Trái 角 (cái sừng), phải trên 刀 (dao), phải dưới 牛 (con bò): dùng dao xẻ sừng con bò → mổ xẻ, tách ra, GIẢI gỡ → 解く, 解決; mổ xẻ ra mới hiểu → 理解. Âm ゲ chỉ gặp trong vài từ (解熱剤 — thuốc hạ sốt).',
    tu: [
      { w: '{解決|かいけつ}', ro: 'kaiketsu', vi: 'giải quyết' },
      { w: '{理解|りかい}', ro: 'rikai', vi: 'hiểu, lý giải' },
      { w: '{誤解|ごかい}', ro: 'gokai', vi: 'hiểu lầm' },
      { w: '{解|と}く', ro: 'toku', vi: 'giải (bài, câu đố)' },
      { w: '{解答|かいとう}', ro: 'kaitou', vi: 'lời giải, đáp án (N3)' },
    ],
  },
  '能': {
    hv: 'NĂNG', nghia: 'tài năng; có thể', en: 'ability',
    on: ['ノウ'], kun: [],
    nho: 'Theo cách giải thích phổ biến, chữ cổ vẽ con GẤU (ム là đầu, 月 là thân, hai 匕 là chân): gấu khoẻ, làm được nhiều việc → có NĂNG lực → 能力, 可能. Thêm 灬 (lửa) ở dưới → 熊 (くま — con gấu).',
    tu: [
      { w: '{可能性|かのうせい}', ro: 'kanousei', vi: 'khả năng (xảy ra)' },
      { w: '{能力|のうりょく}', ro: 'nouryoku', vi: 'năng lực (N3)' },
      { w: '{可能|かのう}', ro: 'kanou', vi: 'có thể (thực hiện được)' },
      { w: '{機能|きのう}', ro: 'kinou', vi: 'chức năng (N2)' },
    ],
  },
  '性': {
    hv: 'TÍNH', nghia: 'tính chất, bản tính; giới tính', en: 'nature / gender',
    on: ['セイ', 'ショウ'], kun: [],
    nho: 'Bên trái 忄 (tấm lòng), bên phải 生 (sinh — gợi âm セイ): cái lòng người ta sinh ra đã có = bản TÍNH → 性格; nghĩa mở rộng "tính chất" → 可能性, "giới" → 女性・男性. ⚠ Khác 姓 (tính — họ: 女 + 生).',
    tu: [
      { w: '{可能性|かのうせい}', ro: 'kanousei', vi: 'khả năng (xảy ra)' },
      { w: '{性格|せいかく}', ro: 'seikaku', vi: 'tính cách' },
      { w: '{女性|じょせい}', ro: 'josei', vi: 'nữ giới, phụ nữ' },
      { w: '{男性|だんせい}', ro: 'dansei', vi: 'nam giới' },
      { w: '{相性|あいしょう}', ro: 'aishou', vi: 'sự hợp nhau (N2)' },
    ],
  },
  '恐': {
    hv: 'KHỦNG', nghia: 'sợ hãi', en: 'fear',
    on: ['キョウ'], kun: ['おそ・れる', 'おそ・ろしい'],
    nho: 'Trên là 巩 (hai tay ôm chặt — gợi âm キョウ), dưới 心 (tim): ôm chặt ngực, tim run vì SỢ → 恐ろしい. Mẹo: 恐らく (có lẽ) vốn là "e rằng" — người nói sợ điều mình đoán sẽ xảy ra.',
    tu: [
      { w: '{恐|おそ}ろしい', ro: 'osoroshii', vi: 'đáng sợ' },
      { w: '{恐|おそ}らく', ro: 'osoraku', vi: 'e rằng, có lẽ' },
      { w: '{恐|おそ}れる', ro: 'osoreru', vi: 'sợ (N2)' },
      { w: '{恐怖|きょうふ}', ro: 'kyoufu', vi: 'nỗi sợ hãi (N1)' },
    ],
  },
  '隠': {
    hv: 'ẨN', nghia: 'che giấu, ẩn nấp', en: 'hide',
    on: ['イン'], kun: ['かく・す', 'かく・れる'],
    nho: 'Theo cách giải thích phổ biến: bên trái 阝 (gò đất), bên phải 爫 (bàn tay) + ヨ + 心 (lòng): nấp sau gò đất, tay che, lòng thấp thỏm → ẨN, giấu → 隠す, 隠れる. ⚠ Khác 穏 (ổn — 穏やか): 禾 thay cho 阝.',
    tu: [
      { w: '{隠|かく}す', ro: 'kakusu', vi: 'giấu, che giấu' },
      { w: '{隠|かく}れる', ro: 'kakureru', vi: 'nấp, trốn; bị che khuất' },
      { w: '{隠|かく}れんぼ', ro: 'kakurenbo', vi: 'trò trốn tìm' },
      { w: '{隠居|いんきょ}', ro: 'inkyo', vi: 'về ở ẩn (N1)' },
    ],
  },
  '罪': {
    hv: 'TỘI', nghia: 'tội, tội lỗi', en: 'crime / sin',
    on: ['ザイ'], kun: ['つみ'],
    nho: 'Trên 罒 (cái lưới), dưới 非 (điều sai trái — 非常口): kẻ làm điều sai trái bị lưới pháp luật bắt → TỘI → 罪, 犯罪. Cùng 罒 trên đầu: 罰 (phạt), 置 (置く).',
    tu: [
      { w: '{犯罪|はんざい}', ro: 'hanzai', vi: 'tội phạm (hành vi phạm tội)' },
      { w: '{罪|つみ}', ro: 'tsumi', vi: 'tội' },
      { w: '{無罪|むざい}', ro: 'muzai', vi: 'vô tội (N1)' },
      { w: '{謝罪|しゃざい}', ro: 'shazai', vi: 'tạ lỗi, xin lỗi chính thức (N1)' },
    ],
  },
  '容': {
    hv: 'DUNG', nghia: 'chứa đựng; dáng vẻ', en: 'contain / appearance',
    on: ['ヨウ'], kun: [],
    nho: 'Trên 宀 (mái nhà), dưới 谷 (thung lũng): mái nhà rộng như thung lũng, CHỨA được nhiều thứ → DUNG nạp → 内容 (cái chứa bên trong = nội dung). ⚠ Khác 客 (khách — 宀 + 各).',
    tu: [
      { w: '{内容|ないよう}', ro: 'naiyou', vi: 'nội dung (N3)' },
      { w: '{容疑者|ようぎしゃ}', ro: 'yougisha', vi: 'nghi phạm' },
      { w: '{美容院|びよういん}', ro: 'biyouin', vi: 'tiệm làm tóc (N3)' },
      { w: '{容器|ようき}', ro: 'youki', vi: 'đồ đựng (N2)' },
    ],
  },
  '像': {
    hv: 'TƯỢNG', nghia: 'hình ảnh, hình dáng; pho tượng', en: 'image / statue',
    on: ['ゾウ'], kun: [],
    nho: 'Bên trái 亻 (người), bên phải 象 (con voi — gợi âm ゾウ): người xưa chưa thấy voi thật, chỉ nhìn xương voi rồi HÌNH DUNG ra con voi → HÌNH TƯỢNG, hình ảnh → 想像 (tưởng tượng), 画像. Câu chuyện này là nguồn gốc của từ 想像.',
    tu: [
      { w: '{想像|そうぞう}', ro: 'souzou', vi: 'tưởng tượng' },
      { w: '{画像|がぞう}', ro: 'gazou', vi: 'hình ảnh (N3)' },
      { w: '{映像|えいぞう}', ro: 'eizou', vi: 'hình ảnh động, thước phim (N2)' },
      { w: '{銅像|どうぞう}', ro: 'douzou', vi: 'tượng đồng (N1)' },
    ],
  },
  '細': {
    hv: 'TẾ', nghia: 'nhỏ, mảnh; tỉ mỉ', en: 'thin / fine / detailed',
    on: ['サイ'], kun: ['ほそ・い', 'ほそ・る', 'こま・か', 'こま・かい'],
    nho: 'Bên trái 糸 (sợi chỉ), bên phải 田 (ở đây vốn là 囟 — cái thóp đầu em bé, chỉ sự nhỏ): sợi chỉ MẢNH → TẾ (nhỏ) → 細い (mảnh, hẹp), 細かい (nhỏ, vụn, tỉ mỉ). ⚠ Một chữ, hai kun khác nghĩa — đọc theo đuôi kana.',
    tu: [
      { w: '{細|こま}かい', ro: 'komakai', vi: 'nhỏ, vụn; tỉ mỉ' },
      { w: '{細|ほそ}い', ro: 'hosoi', vi: 'mảnh, hẹp, gầy' },
      { w: '{細長|ほそなが}い', ro: 'hosonagai', vi: 'dài và mảnh' },
      { w: '{詳細|しょうさい}', ro: 'shousai', vi: 'chi tiết (N2)' },
    ],
  },
  '詳': {
    hv: 'TƯỜNG', nghia: 'tường tận, kỹ càng', en: 'detailed',
    on: ['ショウ'], kun: ['くわ・しい'],
    nho: 'Bên trái 言 (lời nói), bên phải 羊 (con cừu — gợi âm ショウ): mẹo — lời giải thích kỹ như lông cừu, từng sợi một → TƯỜNG tận → 詳しい. ⚠ Khác 洋 (dương — 氵 + 羊: 洋服).',
    tu: [
      { w: '{詳|くわ}しい', ro: 'kuwashii', vi: 'chi tiết, tường tận; thông thạo' },
      { w: '{詳|くわ}しく', ro: 'kuwashiku', vi: 'một cách chi tiết' },
      { w: '{詳細|しょうさい}', ro: 'shousai', vi: 'chi tiết (N2)' },
    ],
  },
  '深': {
    hv: 'THÂM', nghia: 'sâu', en: 'deep',
    on: ['シン'], kun: ['ふか・い', 'ふか・まる', 'ふか・める'],
    nho: 'Bên trái 氵 (nước), bên phải 罙 (cái hang sâu, có người thò tay vào): nước trong hang thì SÂU → 深い. ⚠ Cùng phần phải với 探 (探す): tay (扌) mò vào hang = tìm; nước (氵) trong hang = sâu.',
    tu: [
      { w: '{深|ふか}い', ro: 'fukai', vi: 'sâu' },
      { w: '{深夜|しんや}', ro: "shin'ya", vi: 'đêm khuya' },
      { w: '{深刻|しんこく}', ro: 'shinkoku', vi: 'nghiêm trọng (N2)' },
      { w: '{興味深|きょうみぶか}い', ro: 'kyoumibukai', vi: 'rất thú vị (N2)' },
    ],
  },
  '過': {
    hv: 'QUÁ', nghia: 'đi qua; vượt quá; lỗi lầm', en: 'pass / exceed / error',
    on: ['カ'], kun: ['す・ぎる', 'す・ごす', 'あやま・つ', 'あやま・ち'],
    nho: 'Bên ngoài 辶 (bước đi), bên trong 咼 (gợi âm カ): bước ĐI QUA → 過ぎる (qua; quá mức), 過去 (cái đã đi qua = quá khứ), 過ごす (trải qua thời gian). ⚠ Khác 週 (毎週 — 辶 + 周).',
    tu: [
      { w: '{過去|かこ}', ro: 'kako', vi: 'quá khứ' },
      { w: '{過|す}ぎる', ro: 'sugiru', vi: 'qua; quá (mức)' },
      { w: '{過|す}ごす', ro: 'sugosu', vi: 'trải qua (thời gian) (N3)' },
      { w: '{通過|つうか}', ro: 'tsuuka', vi: 'đi qua, thông qua (N2)' },
    ],
  },
  '在': {
    hv: 'TẠI', nghia: 'có mặt, ở', en: 'exist / be at',
    on: ['ザイ'], kun: ['あ・る'],
    nho: 'Phần trên trái 才 (mầm cây vừa nhú — gợi âm ザイ, viết lệch) + 土 (đất): mầm cây đứng trên đất = có mặt, TỒN TẠI → 現在, 存在. ⚠ Khác 存 (tồn — dưới là 子) và 有 (hữu — 有名).',
    tu: [
      { w: '{現在|げんざい}', ro: 'genzai', vi: 'hiện tại' },
      { w: '{存在|そんざい}', ro: 'sonzai', vi: 'tồn tại, sự hiện diện (N2)' },
      { w: '{滞在|たいざい}', ro: 'taizai', vi: 'lưu trú (N3)' },
      { w: '{在留|ざいりゅう}カード', ro: 'zairyuu kaado', vi: 'thẻ cư trú' },
    ],
  },
  '印': {
    hv: 'ẤN', nghia: 'dấu, con dấu; in', en: 'mark / seal / print',
    on: ['イン'], kun: ['しるし'],
    nho: 'Theo cách giải thích phổ biến: bên trái là một bàn tay, bên phải 卩 (người quỳ): tay ẤN người quỳ xuống → ấn, đóng DẤU → 印 (dấu), 目印; hình ảnh "ấn" vào lòng = 印象 (ấn tượng). 6 nét.',
    tu: [
      { w: '{印象|いんしょう}', ro: 'inshou', vi: 'ấn tượng' },
      { w: '{目印|めじるし}', ro: 'mejirushi', vi: 'dấu nhận biết, mốc' },
      { w: '{印|しるし}', ro: 'shirushi', vi: 'dấu, ký hiệu' },
      { w: '{印刷|いんさつ}', ro: 'insatsu', vi: 'in ấn (N3)' },
    ],
  },
  '象': {
    hv: 'TƯỢNG', nghia: 'con voi; hình tượng, hình dáng', en: 'elephant / phenomenon',
    on: ['ショウ', 'ゾウ'], kun: [],
    nho: 'Chữ tượng hình CON VOI: phần trên là cái đầu có vòi, dưới là thân và chân → 象 (ぞう — con voi); nghĩa mở rộng "hình tượng, hình dáng" → 印象, 現象 (đọc ショウ). Thêm 亻 → 像 (hình ảnh).',
    tu: [
      { w: '{印象|いんしょう}', ro: 'inshou', vi: 'ấn tượng' },
      { w: '{象|ぞう}', ro: 'zou', vi: 'con voi' },
      { w: '{対象|たいしょう}', ro: 'taishou', vi: 'đối tượng (N2)' },
      { w: '{現象|げんしょう}', ro: 'genshou', vi: 'hiện tượng (N2)' },
    ],
  },
  '鍵': {
    hv: 'KIỆN', nghia: 'chìa khoá', en: 'key',
    on: ['ケン'], kun: ['かぎ'],
    nho: 'Bên trái 金 (kim loại), bên phải 建 (xây dựng — gợi âm ケン): thanh kim loại "dựng" then cài cửa → chìa KHOÁ → 鍵. ⚠ Khác 健 (健康 — 亻 + 建), cùng âm ケン. 17 nét — chỉ cần đọc được.',
    tu: [
      { w: '{鍵|かぎ}', ro: 'kagi', vi: 'chìa khoá; ổ khoá' },
      { w: '{鍵|かぎ}をかける', ro: 'kagi o kakeru', vi: 'khoá cửa' },
      { w: '{合|あ}い{鍵|かぎ}', ro: 'aikagi', vi: 'chìa khoá dự phòng (N2)' },
      { w: '{鍵盤|けんばん}', ro: 'kenban', vi: 'bàn phím đàn (N1)' },
    ],
  },
  '袋': {
    hv: 'ĐẠI', nghia: 'túi, bao', en: 'bag / sack',
    on: ['タイ'], kun: ['ふくろ'],
    nho: 'Trên 代 (thay thế — gợi âm タイ), dưới 衣 (áo, vải): miếng vải may lại để đựng THAY cho tay → cái TÚI → 袋, 手袋. ⚠ Khác 貸 (貸す — 代 + 貝 tiền). Đứng sau chữ khác đọc ぶくろ.',
    tu: [
      { w: '{袋|ふくろ}', ro: 'fukuro', vi: 'túi, bao' },
      { w: '{紙袋|かみぶくろ}', ro: 'kamibukuro', vi: 'túi giấy' },
      { w: '{手袋|てぶくろ}', ro: 'tebukuro', vi: 'găng tay' },
      { w: '{寝袋|ねぶくろ}', ro: 'nebukuro', vi: 'túi ngủ' },
    ],
  },
};
