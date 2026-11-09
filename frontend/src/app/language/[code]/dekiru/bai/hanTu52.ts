/**
 * Chữ Hán MỚI của Bài 52 (レポート — Báo cáo, luận · tiếp sau sách, cấp N2) cho thẻ chữ Hán — cùng định dạng hanTu.ts.
 * 24 chữ: 序 章 構 執 旨 範 括 欄 箇 冒 尾 典 唆 視 堅 潔 該 遍 唱 模 盤 版 倫 刊 — bảng `b52-han-tu` trong bai52.ts.
 * Chủ đề: chữ hay gặp trong レポート・論文・報告書 (序論・文章・構成・執筆・要旨・範囲・総括・空欄・箇条書き・冒頭・末尾・出典・示唆・
 * 視点・簡潔・該当・普遍的・提唱・模範・基盤・出版・倫理・刊行). Các chữ "học thuật" khác đã dạy ở bài trước nên KHÔNG có ở đây:
 * 論 述 考 察 概 仮 証 拠 献 引 用 稿 筆 摘 析 検 討 査 項 示 載 掲 誤 訂 校 傾….
 * Không trùng hanTu.ts, hanTu16–51.ts, hanTu53.ts, hanTuTiep.ts, hanLop.ts và các bảng chữ Hán Bài 1–50 (kiểm 09/11 bằng script — 1.245 chữ đã
 * dạy, gồm cả hanTu51.ts và hanTu53.ts). Theo quyết định của người điều phối: 底 và 是 thuộc Bài 51 (hanTu51) ⇒ bỏ khỏi bài này
 * (徹底・是非 chỉ "ôn: Bài 51"), thay bằng 該 và 盤.
 * Cấp chữ theo các bảng tham khảo phổ biến (JLPT không công bố danh sách chữ chính thức): 章 構 N3; 序 範 尾 典 視 堅 潔 唱 模 盤 版 刊
 * phần lớn bảng xếp N2; 執 旨 括 欄 箇 冒 唆 該 遍 倫 nhiều bảng xếp N1 nhưng TỪ chứa chúng (執筆・要旨・一括・空欄・箇所・冒頭・示唆・
 * 該当・普遍的・倫理) là từ N2 hay gặp trong bài đọc và đề bài.
 * Cách nhớ: theo cấu tạo chữ (phần chỉ nghĩa + phần gợi âm của chữ hình thanh ghi rõ); chỗ nào là MẸO nhớ chứ không phải nguồn gốc
 * chữ thì ghi "mẹo".
 * On / Kun theo bảng thường dụng (常用): 序 章 範 欄 箇 典 視 該 遍 盤 版 倫 刊 chỉ có âm On; 執 có On シツ・シュウ (シュウ trong 執着) + Kun
 * と・る; 模 có On モ・ボ (ボ trong 規模); 旨 có Kun むね (うまい viết 旨い là cách đọc NGOÀI bảng thường dụng); 構 có Kun かま・える／
 * かま・う; 括 có Kun くく・る; 冒 có Kun おか・す; 尾 có Kun お; 唆 có Kun そそのか・す; 堅 có Kun かた・い; 潔 có Kun いさぎよ・い;
 * 唱 có Kun とな・える.
 * Tệp chỉ có `import type` — tải chậm như hanTu.ts.
 */
import type { HanTu } from '@/components/sach-hoc/kanji';

export const HAN_TU_52: Record<string, HanTu> = {
  '序': {
    hv: 'TỰ', nghia: 'thứ tự; phần mở đầu', en: 'order / preface',
    on: ['ジョ'], kun: [],
    nho: 'Bên ngoài 广 (mái nhà), bên trong 予 (trước — phần gợi âm ヨ → ジョ): dưới MÁI NHÀ, đồ đạc được xếp theo thứ tự đã định TỪ TRƯỚC = THỨ TỰ; cái đứng đầu hàng = phần MỞ ĐẦU → 順序 (thứ tự), 序論 (phần mở đầu của bài luận).',
    tu: [
      { w: '{序論|じょろん}', ro: 'joron', vi: 'phần mở đầu (của レポート・論文) (N1 — rất hay gặp)' },
      { w: '{順序|じゅんじょ}', ro: 'junjo', vi: 'thứ tự, trình tự (N2)' },
      { w: '{序盤|じょばん}', ro: 'joban', vi: 'giai đoạn đầu (trận đấu, cuộc thi) (N1)' },
      { w: '{秩序|ちつじょ}', ro: 'chitsujo', vi: 'trật tự (社会の秩序) (N1)' },
    ],
  },
  '章': {
    hv: 'CHƯƠNG', nghia: 'chương; văn chương', en: 'chapter',
    on: ['ショウ'], kun: [],
    nho: 'Theo cách tách phổ biến: phía trên 音 (âm thanh, bản nhạc), phía dưới 十 (mười — trọn, hết): một bản NHẠC được tấu TRỌN từ đầu đến cuối = một CHƯƠNG → 第一章 (chương một), 文章 (văn chương, đoạn văn). Mẹo: 立 + 早 — "ĐỨNG (立) dậy SỚM (早) viết xong một chương".',
    tu: [
      { w: '{文章|ぶんしょう}', ro: 'bunshou', vi: 'bài văn, câu văn, đoạn văn (N3)' },
      { w: '{第一章|だいいっしょう}', ro: 'daiisshou', vi: 'chương một (có âm ngắt っ)' },
      { w: '{章|しょう}', ro: 'shou', vi: 'chương (章を分ける — chia chương) (N2)' },
      { w: '{楽章|がくしょう}', ro: 'gakushou', vi: 'chương nhạc (N1)' },
    ],
  },
  '構': {
    hv: 'CẤU', nghia: 'cấu tạo, kết cấu; dựng thế', en: 'construct / structure',
    on: ['コウ'], kun: ['かま・える', 'かま・う'],
    nho: 'Bên trái 木 (gỗ), bên phải 冓 (hình những thanh gỗ đan ghép vào nhau — phần gợi âm コウ): GỖ ghép thành KHUNG = CẤU trúc → 構成 (bố cục), 構造 (cấu trúc). Từ quen: 結構 (khá; đủ rồi), 構わない (không sao).',
    tu: [
      { w: '{構成|こうせい}', ro: 'kousei', vi: 'bố cục, cấu thành (レポートの構成) (N2)' },
      { w: '{構造|こうぞう}', ro: 'kouzou', vi: 'cấu trúc (N2)' },
      { w: '{結構|けっこう}', ro: 'kekkou', vi: 'khá; đủ rồi (結構です) (N4)' },
      { w: '{構|かま}わない', ro: 'kamawanai', vi: 'không sao, không phiền (N3)' },
      { w: '{構|かま}える', ro: 'kamaeru', vi: 'dựng (nhà, cửa hàng); thủ thế (店を構える) (N1)' },
    ],
  },
  '執': {
    hv: 'CHẤP', nghia: 'cầm, nắm; chấp hành', en: 'grasp / carry out',
    on: ['シツ', 'シュウ'], kun: ['と・る'],
    nho: 'Bên trái 幸 (ở đây là hình cái CÙM tay — không phải "hạnh phúc"), bên phải 丸 (người quỳ chìa tay ra): bàn tay bị CÙM giữ chặt = NẮM GIỮ, không buông → 執筆 (cầm bút viết), 執着 (bám chặt, cố chấp — đọc シュウ). Mẹo: "bị cùm (幸) mà vẫn cầm bút (筆) viết".',
    tu: [
      { w: '{執筆|しっぴつ}', ro: 'shippitsu', vi: 'chấp bút, viết (sách, luận văn) (N1 — hay gặp)' },
      { w: '{執着|しゅうちゃく}', ro: 'shuuchaku', vi: 'bám chặt, quyến luyến (đọc シュウ) (N1)' },
      { w: '{固執|こしつ}', ro: 'koshitsu', vi: 'cố chấp, khăng khăng (N1)' },
      { w: '{筆|ふで}を{執|と}る', ro: 'fude o toru', vi: 'cầm bút (viết) — cách nói văn chương' },
    ],
  },
  '旨': {
    hv: 'CHỈ', nghia: 'ý chính, điều cốt yếu', en: 'gist',
    on: ['シ'], kun: ['むね'],
    nho: 'Phía trên 匕 (cái thìa), phía dưới 日 (vốn là 甘 — vị ngọt trong miệng): THÌA đưa món NGON vào miệng — nghĩa gốc là "ngon"; phần "ngon nhất" của một bài nói = Ý CHÍNH → 要旨 (ý chính tóm tắt), 趣旨 (mục đích, ý chính).',
    tu: [
      { w: '{要旨|ようし}', ro: 'youshi', vi: 'ý chính tóm tắt; bản tóm tắt luận văn (N1 — hay gặp)' },
      { w: '{趣旨|しゅし}', ro: 'shushi', vi: 'mục đích, ý chính (会の趣旨) (N1)' },
      { w: '{論旨|ろんし}', ro: 'ronshi', vi: 'luận điểm chính (N1)' },
      { w: '～{旨|むね}', ro: 'mune', vi: 'nội dung là… (欠席する旨を伝える — báo là sẽ vắng) (N1)' },
    ],
  },
  '範': {
    hv: 'PHẠM', nghia: 'khuôn mẫu; giới hạn', en: 'model / scope',
    on: ['ハン'], kun: [],
    nho: 'Phía trên ⺮ (tre), dưới là 車 (xe) và 㔾 (gợi âm): KHUÔN bằng tre đo đúng cỡ bánh XE = KHUÔN MẪU; khuôn thì có đường VIỀN giới hạn → 模範 (gương mẫu), 範囲 (phạm vi).',
    tu: [
      { w: '{範囲|はんい}', ro: 'han\'i', vi: 'phạm vi (試験の範囲) (N2)' },
      { w: '{模範|もはん}', ro: 'mohan', vi: 'gương mẫu, mẫu mực (N1)' },
      { w: '{規範|きはん}', ro: 'kihan', vi: 'quy phạm, chuẩn mực (N1)' },
      { w: '{広範囲|こうはんい}', ro: 'kouhan\'i', vi: 'phạm vi rộng (N1)' },
    ],
  },
  '括': {
    hv: 'QUÁT', nghia: 'buộc lại, gom lại', en: 'bundle / summarize',
    on: ['カツ'], kun: ['くく・る'],
    nho: 'Bên trái 扌 (tay), bên phải 舌 (thật ra là 𠯑 viết gọn — phần gợi âm カツ, không phải "cái lưỡi"; mẹo: hình miệng túi bị thắt): TAY thắt miệng túi, GOM mọi thứ lại một chỗ = BUỘC, TỔNG QUÁT → 一括 (gộp một lần), 総括 (tổng kết), 括る (buộc).',
    tu: [
      { w: '{一括|いっかつ}', ro: 'ikkatsu', vi: 'gộp một lần (一括払い — trả một lần) (N1)' },
      { w: '{総括|そうかつ}', ro: 'soukatsu', vi: 'tổng kết, tổng quát (N1)' },
      { w: '{括弧|かっこ}', ro: 'kakko', vi: 'dấu ngoặc (「」かぎ括弧) (N2)' },
      { w: '{括|くく}る', ro: 'kukuru', vi: 'buộc, gom lại (N1)' },
    ],
  },
  '欄': {
    hv: 'LAN', nghia: 'lan can; cột, ô (trên giấy)', en: 'column / blank',
    on: ['ラン'], kun: [],
    nho: 'Bên trái 木 (gỗ), bên phải 闌 (cái cửa có thanh chắn — phần gợi âm ラン): thanh GỖ chắn ngang = LAN can; trên trang giấy, đường kẻ chia ô cũng như thanh chắn → 欄 (cột, ô), 空欄 (ô trống), 記入欄 (ô điền).',
    tu: [
      { w: '{空欄|くうらん}', ro: 'kuuran', vi: 'ô trống (đề thi: 空欄に入る言葉) (N2)' },
      { w: '{記入欄|きにゅうらん}', ro: 'kinyuuran', vi: 'ô điền thông tin' },
      { w: '{欄|らん}', ro: 'ran', vi: 'cột, mục (新聞の投書欄) (N2)' },
      { w: '{欄外|らんがい}', ro: 'rangai', vi: 'lề ngoài ô (N1)' },
    ],
  },
  '箇': {
    hv: 'CÁ', nghia: 'cái, chỗ (từ đếm)', en: 'counter for items / places',
    on: ['カ'], kun: [],
    nho: 'Phía trên ⺮ (tre), phía dưới 固 (cứng — phần gợi âm コ → カ): từng THẺ TRE cứng dùng để đếm từng cái một = CÁ (từng cái) → 箇所 (chỗ), 箇条書き (viết gạch đầu dòng từng mục).',
    tu: [
      { w: '{箇所|かしょ}', ro: 'kasho', vi: 'chỗ, điểm (間違っている箇所) (N2)' },
      { w: '{箇条書|かじょうが}き', ro: 'kajougaki', vi: 'viết gạch đầu dòng (N1 — hay gặp)' },
      { w: '{一箇所|いっかしょ}', ro: 'ikkasho', vi: 'một chỗ (có âm ngắt っ)' },
    ],
  },
  '冒': {
    hv: 'MẠO', nghia: 'xông pha, liều; phần đầu', en: 'risk / beginning',
    on: ['ボウ'], kun: ['おか・す'],
    nho: 'Phía trên 冃 (cái mũ trùm), phía dưới 目 (mắt): đội MŨ trùm xuống tận MẮT mà vẫn xông lên = LIỀU, XÔNG PHA → 冒険 (phiêu lưu), 危険を冒す (liều mình). Mũ ở trên ĐẦU → 冒頭 (phần đầu bài, đầu câu chuyện).',
    tu: [
      { w: '{冒頭|ぼうとう}', ro: 'boutou', vi: 'phần đầu (bài viết, cuộc họp) (N1 — hay gặp)' },
      { w: '{冒険|ぼうけん}', ro: 'bouken', vi: 'phiêu lưu, mạo hiểm (N2)' },
      { w: '{危険|きけん}を{冒|おか}す', ro: 'kiken o okasu', vi: 'liều, bất chấp nguy hiểm (N1)' },
    ],
  },
  '尾': {
    hv: 'VĨ', nghia: 'đuôi; phần cuối', en: 'tail / end',
    on: ['ビ'], kun: ['お'],
    nho: 'Phía trên 尸 (phần thân sau, mông), phía dưới 毛 (lông): túm LÔNG mọc ở phía sau THÂN = cái ĐUÔI → 尾 (đuôi), 末尾 (phần cuối), 尾根 (sống núi).',
    tu: [
      { w: '{尾|お}', ro: 'o', vi: 'đuôi (犬が尾を振る) (N2)' },
      { w: '{末尾|まつび}', ro: 'matsubi', vi: 'phần cuối (văn bản, câu) (N1)' },
      { w: '{尾根|おね}', ro: 'one', vi: 'sống núi (N1)' },
      { w: '{首尾|しゅび}よく', ro: 'shubi yoku', vi: 'trót lọt, suôn sẻ (N1)' },
    ],
  },
  '典': {
    hv: 'ĐIỂN', nghia: 'sách quý; khuôn phép', en: 'classic / code',
    on: ['テン'], kun: [],
    nho: 'Phía trên 冊 (bó thẻ tre — quyển sách), phía dưới 丌 (cái bàn, cái giá kê): quyển SÁCH quý được kê trang trọng trên GIÁ = KINH ĐIỂN → 辞典 (từ điển), 古典 (cổ điển), 出典 (nguồn trích dẫn — sách gốc mà câu trích "đi ra").',
    tu: [
      { w: '{出典|しゅってん}', ro: 'shutten', vi: 'nguồn trích dẫn (N1 — hay gặp)' },
      { w: '{辞典|じてん}', ro: 'jiten', vi: 'từ điển (N3)' },
      { w: '{典型的|てんけいてき}', ro: 'tenkeiteki', vi: 'điển hình (N1)' },
      { w: '{古典|こてん}', ro: 'koten', vi: 'cổ điển, sách kinh điển (N2)' },
      { w: '{特典|とくてん}', ro: 'tokuten', vi: 'ưu đãi riêng (会員特典) (N1)' },
    ],
  },
  '唆': {
    hv: 'TOA', nghia: 'xúi, gợi ý', en: 'suggest / instigate',
    on: ['サ'], kun: ['そそのか・す'],
    nho: 'Bên trái 口 (miệng), bên phải 夋 (gợi âm シュン → サ): dùng MIỆNG khéo léo đẩy người khác làm theo = XÚI → 唆す (xúi giục — nghĩa xấu); 示唆 (gợi ý, cho thấy — nghĩa trung tính, rất hay gặp trong báo cáo: データが～を示唆している).',
    tu: [
      { w: '{示唆|しさ}', ro: 'shisa', vi: 'gợi ý, cho thấy (N1 — hay gặp trong bài đọc)' },
      { w: '{唆|そそのか}す', ro: 'sosonokasu', vi: 'xúi giục (N1)' },
    ],
  },
  '視': {
    hv: 'THỊ', nghia: 'nhìn kỹ, coi', en: 'look at / regard',
    on: ['シ'], kun: [],
    nho: 'Bên trái 礻 (vốn là 示 — bày ra, phần gợi âm シ), bên phải 見 (nhìn): NHÌN vào thứ được BÀY ra trước mắt = NHÌN KỸ, coi → 視点 (điểm nhìn), 重視 (coi trọng), 無視 (phớt lờ), 視野 (tầm nhìn).',
    tu: [
      { w: '{視点|してん}', ro: 'shiten', vi: 'điểm nhìn, góc nhìn (N2)' },
      { w: '{重視|じゅうし}', ro: 'juushi', vi: 'coi trọng (N2)' },
      { w: '{無視|むし}', ro: 'mushi', vi: 'phớt lờ, bỏ qua (N3)' },
      { w: '{視野|しや}', ro: 'shiya', vi: 'tầm nhìn (視野が広い) (N2)' },
      { w: '{視聴者|しちょうしゃ}', ro: 'shichousha', vi: 'khán giả (truyền hình) (N2)' },
    ],
  },
  '堅': {
    hv: 'KIÊN', nghia: 'cứng, chắc chắn', en: 'firm / hard',
    on: ['ケン'], kun: ['かた・い'],
    nho: 'Phía trên 臤 (bề tôi 臣 + bàn tay 又 — giữ chắc, phần gợi âm ケン), phía dưới 土 (đất): ĐẤT được nện CHẮC tay = CỨNG, KIÊN cố → 堅い (chắc; cứng nhắc — 文章が堅い: văn cứng), 堅実 (vững vàng), 中堅 (nòng cốt).',
    tu: [
      { w: '{堅|かた}い', ro: 'katai', vi: 'chắc; cứng nhắc (文章が堅い・堅い仕事・口が堅い) (N2)' },
      { w: '{堅実|けんじつ}', ro: 'kenjitsu', vi: 'vững vàng, chắc chắn (N1)' },
      { w: '{中堅|ちゅうけん}', ro: 'chuuken', vi: 'nòng cốt; tầm trung (中堅企業) (N1)' },
    ],
  },
  '潔': {
    hv: 'KHIẾT', nghia: 'trong sạch; gọn gàng', en: 'pure / concise',
    on: ['ケツ'], kun: ['いさぎよ・い'],
    nho: 'Bên trái 氵 (nước), bên phải 絜 (buộc gọn, làm sạch — phần gợi âm ケツ): dùng NƯỚC rửa cho SẠCH, gọn = TRONG SẠCH, GỌN → 清潔 (sạch sẽ), 簡潔 (ngắn gọn — chữ "gọn" của văn viết), 潔い (thẳng thắn, dứt khoát).',
    tu: [
      { w: '{簡潔|かんけつ}', ro: 'kanketsu', vi: 'ngắn gọn, súc tích (N2)' },
      { w: '{清潔|せいけつ}', ro: 'seiketsu', vi: 'sạch sẽ (N3)' },
      { w: '{潔|いさぎよ}い', ro: 'isagiyoi', vi: 'thẳng thắn, dứt khoát (潔く認める) (N1)' },
    ],
  },
  '該': {
    hv: 'CAI', nghia: 'đúng vào, thuộc về (trường hợp đang xét)', en: 'applicable / the said',
    on: ['ガイ'], kun: [],
    nho: 'Bên trái 言 (lời nói), bên phải 亥 (phần gợi âm ガイ — cùng phần với 刻・核): LỜI nói khớp ĐÚNG VÀO trường hợp đang xét = ĐÚNG VÀO, THUỘC VỀ → 該当 (thuộc diện, khớp với điều kiện — rất hay gặp trong đơn từ, thông báo: 該当する項目に〇をつける), 当該 (cái… nói trên).',
    tu: [
      { w: '{該当|がいとう}', ro: 'gaitou', vi: 'thuộc diện, khớp với (điều kiện) (N1 — hay gặp)' },
      { w: '{該当者|がいとうしゃ}', ro: 'gaitousha', vi: 'người thuộc diện' },
      { w: '{当該|とうがい}', ro: 'tougai', vi: '(cái) nói trên, có liên quan (văn bản hành chính) (N1)' },
    ],
  },
  '遍': {
    hv: 'BIẾN', nghia: 'khắp, phổ biến; lượt', en: 'universal / times',
    on: ['ヘン'], kun: [],
    nho: 'Bên trái 辶 (đi), bên phải 扁 (tấm biển dẹt — phần gợi âm ヘン): ĐI khắp mọi nơi, dán biển khắp chốn = KHẮP, PHỔ BIẾN → 普遍 (phổ quát — đúng ở mọi nơi), 普遍的 (mang tính phổ quát), 一遍 (một lượt).',
    tu: [
      { w: '{普遍的|ふへんてき}', ro: 'fuhenteki', vi: 'phổ quát, đúng ở mọi nơi (N1)' },
      { w: '{普遍|ふへん}', ro: 'fuhen', vi: 'tính phổ quát (N1)' },
      { w: '{一遍|いっぺん}', ro: 'ippen', vi: 'một lượt, một lần (văn nói) (N2)' },
    ],
  },
  '唱': {
    hv: 'XƯỚNG', nghia: 'hô to, đề xướng; hát', en: 'chant / advocate',
    on: ['ショウ'], kun: ['とな・える'],
    nho: 'Bên trái 口 (miệng), bên phải 昌 (hai mặt trời — rực rỡ, phần gợi âm ショウ): cất TIẾNG vang rực rỡ = XƯỚNG → 唱える (hô, đề xướng — 異論を唱える: nêu ý kiến phản đối), 提唱 (đề xướng một lý thuyết), 合唱 (đồng ca).',
    tu: [
      { w: '{提唱|ていしょう}', ro: 'teishou', vi: 'đề xướng (lý thuyết, khái niệm) (N1)' },
      { w: '{唱|とな}える', ro: 'tonaeru', vi: 'hô, niệm; nêu lên (異論を唱える) (N1)' },
      { w: '{合唱|がっしょう}', ro: 'gasshou', vi: 'đồng ca (N2)' },
    ],
  },
  '模': {
    hv: 'MÔ', nghia: 'khuôn, mẫu; mô phỏng', en: 'model / imitate',
    on: ['モ', 'ボ'], kun: [],
    nho: 'Bên trái 木 (gỗ), bên phải 莫 (phần gợi âm バク → モ): KHUÔN bằng GỖ để đúc theo = MẪU, MÔ phỏng → 模範 (gương mẫu), 模型 (mô hình), 模様 (hoa văn); 規模 (quy mô) đọc ボ.',
    tu: [
      { w: '{模範|もはん}', ro: 'mohan', vi: 'gương mẫu, mẫu mực (模範解答 — đáp án mẫu) (N1)' },
      { w: '{規模|きぼ}', ro: 'kibo', vi: 'quy mô (đọc ボ — Bài 33) (N2)' },
      { w: '{模型|もけい}', ro: 'mokei', vi: 'mô hình (N2)' },
      { w: '{模様|もよう}', ro: 'moyou', vi: 'hoa văn; tình hình (N2)' },
    ],
  },
  '盤': {
    hv: 'BÀN', nghia: 'cái mâm; nền; bàn cờ', en: 'tray / base / board',
    on: ['バン'], kun: [],
    nho: 'Phía trên 般 (hình con thuyền chở hàng — phần gợi âm ハン → バン), phía dưới 皿 (cái mâm, cái đĩa): cái MÂM lớn, phẳng = BÀN; mặt phẳng làm chỗ dựa cho mọi thứ = NỀN → 基盤 (nền tảng); bàn cờ → 序盤・終盤 (giai đoạn đầu / cuối của ván cờ, trận đấu).',
    tu: [
      { w: '{基盤|きばん}', ro: 'kiban', vi: 'nền tảng, cơ sở (生活の基盤) (N2)' },
      { w: '{序盤|じょばん}', ro: 'joban', vi: 'giai đoạn đầu (trận đấu, cuộc thi) (N1)' },
      { w: '{終盤|しゅうばん}', ro: 'shuuban', vi: 'giai đoạn cuối (N1)' },
      { w: '{地盤|じばん}', ro: 'jiban', vi: 'nền đất; địa bàn (N1)' },
    ],
  },
  '版': {
    hv: 'BẢN', nghia: 'bản in; ấn bản', en: 'printing block / edition',
    on: ['ハン'], kun: [],
    nho: 'Bên trái 片 (mảnh gỗ xẻ), bên phải 反 (phần gợi âm ハン): MẢNH GỖ khắc chữ để IN = BẢN in → 出版 (xuất bản), 改訂版 (bản sửa đổi), 初版 (bản in đầu tiên). Chú ý: 出版 đọc しゅっぱん (ハ → パ sau っ).',
    tu: [
      { w: '{出版|しゅっぱん}', ro: 'shuppan', vi: 'xuất bản (N2)' },
      { w: '{出版社|しゅっぱんしゃ}', ro: 'shuppansha', vi: 'nhà xuất bản (N2)' },
      { w: '{改訂版|かいていばん}', ro: 'kaiteiban', vi: 'bản sửa đổi (đọc バン) (N1)' },
      { w: '{初版|しょはん}', ro: 'shohan', vi: 'bản in lần đầu (N1)' },
    ],
  },
  '倫': {
    hv: 'LUÂN', nghia: 'luân thường, đạo lý giữa người với người', en: 'ethics',
    on: ['リン'], kun: [],
    nho: 'Bên trái 亻 (người), bên phải 侖 (các thẻ tre được xếp theo thứ tự — phần gợi âm リン): trật tự, THỨ BẬC giữa NGƯỜI với người = LUÂN thường → 倫理 (đạo đức, luân lý — 研究倫理: đạo đức nghiên cứu).',
    tu: [
      { w: '{倫理|りんり}', ro: 'rinri', vi: 'luân lý, đạo đức (研究倫理) (N2)' },
      { w: '{倫理的|りんりてき}', ro: 'rinriteki', vi: 'mang tính đạo đức (N1)' },
      { w: '{倫理観|りんりかん}', ro: 'rinrikan', vi: 'quan niệm đạo đức (N1)' },
    ],
  },
  '刊': {
    hv: 'SAN', nghia: 'khắc in; phát hành (sách báo)', en: 'publish',
    on: ['カン'], kun: [],
    nho: 'Bên trái 干 (phần gợi âm カン), bên phải 刂 (con dao): dùng DAO khắc chữ lên bản gỗ để in = SAN (in, phát hành) → 朝刊 (báo sáng), 夕刊 (báo chiều), 週刊誌 (tuần san), 刊行 (phát hành). Tiếng Việt cũng có "tuần san", "đặc san".',
    tu: [
      { w: '{朝刊|ちょうかん}', ro: 'choukan', vi: 'báo buổi sáng (N2)' },
      { w: '{夕刊|ゆうかん}', ro: 'yuukan', vi: 'báo buổi chiều (N2)' },
      { w: '{週刊誌|しゅうかんし}', ro: 'shuukanshi', vi: 'tuần san, tạp chí tuần (N2)' },
      { w: '{刊行|かんこう}', ro: 'kankou', vi: 'phát hành, xuất bản (N1)' },
      { w: '{新刊|しんかん}', ro: 'shinkan', vi: 'sách mới phát hành (N1)' },
    ],
  },
};
