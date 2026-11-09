/**
 * Chữ Hán MỚI của Bài 28 (意見を言う — tiếp sau sách, cấp N3) cho thẻ chữ Hán — cùng định dạng hanTu.ts.
 * 20 chữ: 賛 議 判 断 否 認 疑 得 納 責 任 態 協 述 示 個 的 満 感 比 (N3 theo các bảng tham khảo phổ biến; 否・納 có bảng
 * xếp N2 — JLPT không công bố danh sách chữ chính thức) — bảng `b28-han-tu` trong bai28.ts.
 * Cách nhớ: theo cấu tạo chữ (phần chỉ nghĩa + phần gợi âm của chữ hình thanh ghi rõ). Từ đi chung ưu tiên từ dùng trong
 * bai28.ts và từ đã học ở bài trước (賛成 Bài 23, 会議 Bài 21, 断る Bài 22, 確認 Bài 20, 得意 Bài 16, 任せる Bài 23,
 * 責任・感謝 Bài 27, 満員 Bài 22).
 * On / Kun theo bảng thường dụng (常用): 賛 議 態 協 個 感 chỉ có âm On; 判 có thêm On バン ({評判|ひょうばん}); 納 có nhiều âm On
 * (ノウ・ナッ・ナ・ナン・トウ) — từ hay gặp nhất là {納得|なっとく}, {納豆|なっとう}.
 * Tệp chỉ có `import type` — tải chậm như hanTu.ts.
 */
import type { HanTu } from '@/components/sach-hoc/kanji';

export const HAN_TU_28: Record<string, HanTu> = {
  '賛': {
    hv: 'TÁN', nghia: 'tán thành, ủng hộ; khen', en: 'approve / praise',
    on: ['サン'], kun: [],
    nho: 'Trên là hai chữ 夫 (hai người đàn ông cùng tiến lên), dưới là 貝 (vỏ sò — lễ vật, tiền): hai người cùng mang lễ vật đến ỦNG HỘ = TÁN (thành) → 賛成. Khác 替 (thế — 両替): trên cũng hai 夫 nhưng dưới là 日.',
    tu: [
      { w: '{賛成|さんせい}', ro: 'sansei', vi: 'tán thành' },
      { w: '{賛成|さんせい}の{立場|たちば}', ro: 'sansei no tachiba', vi: 'lập trường tán thành' },
      { w: '{賛否|さんぴ}', ro: 'sanpi', vi: 'tán thành và phản đối (N1)' },
      { w: '{賞賛|しょうさん}', ro: 'shousan', vi: 'khen ngợi (N1)' },
    ],
  },
  '議': {
    hv: 'NGHỊ', nghia: 'bàn bạc, nghị luận', en: 'discuss / deliberate',
    on: ['ギ'], kun: [],
    nho: 'Bên trái 言 (lời nói), bên phải 義 (gợi âm ギ; nghĩa — lẽ phải, Bài 26): dùng lời bàn xem ĐIỀU GÌ LÀ ĐÚNG = NGHỊ → 議論, 会議. Bỏ 言 thì còn 義 (講義).',
    tu: [
      { w: '{議論|ぎろん}', ro: 'giron', vi: 'tranh luận, thảo luận' },
      { w: '{会議|かいぎ}', ro: 'kaigi', vi: 'cuộc họp' },
      { w: '{不思議|ふしぎ}', ro: 'fushigi', vi: 'kỳ lạ, khó hiểu (N3)' },
      { w: '{議員|ぎいん}', ro: 'giin', vi: 'nghị sĩ (N2)' },
    ],
  },
  '判': {
    hv: 'PHÁN', nghia: 'phân định, phán xét', en: 'judge',
    on: ['ハン', 'バン'], kun: [],
    nho: 'Bên trái 半 (nửa — gợi âm ハン), bên phải 刂 (con dao): dùng dao CHIA ĐÔI cho rõ phải – trái = PHÁN (phân định) → 判断. Khác 半 (không có 刂). Trong 評判 đọc biến âm バン.',
    tu: [
      { w: '{判断|はんだん}', ro: 'handan', vi: 'phán đoán' },
      { w: '{評判|ひょうばん}', ro: 'hyouban', vi: 'tiếng tăm, lời đánh giá (N2)' },
      { w: '{批判|ひはん}', ro: 'hihan', vi: 'phê phán (N2)' },
      { w: '{裁判|さいばん}', ro: 'saiban', vi: 'xét xử (N2)' },
    ],
  },
  '断': {
    hv: 'ĐOẠN', nghia: 'cắt đứt; từ chối; quyết đoán', en: 'cut off / refuse / decide',
    on: ['ダン'], kun: ['ことわ・る', 'た・つ'],
    nho: 'Bên trái là dạng giản lược của các bó tơ (trông như 米 trong một khung hở), bên phải 斤 (cái rìu): lấy rìu CHẶT ĐỨT bó tơ = ĐOẠN → 断つ (cắt đứt), 断る ("cắt" lời mời = từ chối), 判断 (cắt cái sai đi để quyết định).',
    tu: [
      { w: '{判断|はんだん}', ro: 'handan', vi: 'phán đoán' },
      { w: '{断|ことわ}る', ro: 'kotowaru', vi: 'từ chối' },
      { w: '{横断歩道|おうだんほどう}', ro: 'oudan hodou', vi: 'vạch qua đường (N3)' },
      { w: '{油断|ゆだん}', ro: 'yudan', vi: 'lơ là, chủ quan (N2)' },
    ],
  },
  '否': {
    hv: 'PHỦ', nghia: 'không; phủ nhận', en: 'no / deny',
    on: ['ヒ'], kun: ['いな'],
    nho: 'Trên 不 (không — gợi âm), dưới 口 (miệng): miệng nói "KHÔNG" = PHỦ (nhận) → 否定. ⚠ 否 đọc ひ, còn 不 đọc ふ (不満).',
    tu: [
      { w: '{否定|ひてい}', ro: 'hitei', vi: 'phủ định, bác bỏ' },
      { w: '{否定的|ひていてき}', ro: 'hiteiteki', vi: 'mang tính phủ định' },
      { w: '{賛否|さんぴ}', ro: 'sanpi', vi: 'tán thành và phản đối (N1)' },
    ],
  },
  '認': {
    hv: 'NHẬN', nghia: 'thừa nhận, công nhận', en: 'recognize / admit',
    on: ['ニン'], kun: ['みと・める'],
    nho: 'Bên trái 言 (lời), bên phải 忍 (nhẫn — gợi âm ニン): nghe lời người khác và NHẪN NHỊN CHẤP NHẬN = NHẬN (thừa nhận) → 認める, 確認.',
    tu: [
      { w: '{認|みと}める', ro: 'mitomeru', vi: 'thừa nhận, công nhận' },
      { w: 'ミスを{認|みと}める', ro: 'misu o mitomeru', vi: 'nhận lỗi' },
      { w: '{確認|かくにん}', ro: 'kakunin', vi: 'xác nhận' },
      { w: '{承認|しょうにん}', ro: 'shounin', vi: 'phê duyệt (N1)' },
    ],
  },
  '疑': {
    hv: 'NGHI', nghia: 'nghi ngờ', en: 'doubt',
    on: ['ギ'], kun: ['うたが・う'],
    nho: 'Bên trái 匕 + 矢 (người ngoảnh lại + mũi tên), bên phải マ + 疋 (cái chân không bước): hình người ĐỨNG NGOÁI LẠI, CHÂN KHÔNG DÁM BƯỚC = do dự, NGHI → 疑う, 疑問. Chữ nhiều nét — học theo từ.',
    tu: [
      { w: '{疑問|ぎもん}', ro: 'gimon', vi: 'thắc mắc, nghi vấn' },
      { w: '{疑|うたが}う', ro: 'utagau', vi: 'nghi ngờ' },
      { w: '{疑問文|ぎもんぶん}', ro: 'gimonbun', vi: 'câu hỏi (ngữ pháp)' },
      { w: '{容疑者|ようぎしゃ}', ro: 'yougisha', vi: 'nghi phạm (N1)' },
    ],
  },
  '得': {
    hv: 'ĐẮC', nghia: 'được, đạt; có lợi', en: 'gain / profit',
    on: ['トク'], kun: ['え・る', 'う・る'],
    nho: 'Bên trái 彳 (bước đi), bên phải 旦 + 寸 (gốc là 貝 "tiền" + 寸 "bàn tay"): đi đường NHẶT ĐƯỢC tiền = ĐẮC (được) → 得をする, 納得 (thu nhận được vào lòng = thấy thoả đáng). Khác 待 (đợi — 彳 + 寺).',
    tu: [
      { w: '{納得|なっとく}', ro: 'nattoku', vi: 'thấy thoả đáng' },
      { w: '{説得|せっとく}', ro: 'settoku', vi: 'thuyết phục' },
      { w: '{得意|とくい}', ro: 'tokui', vi: 'giỏi, sở trường' },
      { w: '{得|とく}をする', ro: 'toku o suru', vi: 'được lợi' },
      { w: '{得|え}る', ro: 'eru', vi: 'đạt được (N2)' },
    ],
  },
  '納': {
    hv: 'NẠP', nghia: 'nộp, thu vào', en: 'pay / store / accept',
    on: ['ノウ', 'ナッ', 'ナ', 'ナン', 'トウ'], kun: ['おさ・める', 'おさ・まる'],
    nho: 'Bên trái 糸 (sợi tơ), bên phải 内 (bên trong — gợi âm ノウ): đem tơ lụa NỘP VÀO kho = NẠP → 納める; nhận vào trong lòng → 納得 (なっとく — 納 đọc ナッ). Cùng 糸: 紙 (giấy), 約 (ước).',
    tu: [
      { w: '{納得|なっとく}', ro: 'nattoku', vi: 'thấy thoả đáng' },
      { w: '{納豆|なっとう}', ro: 'nattou', vi: 'natto (đậu nành lên men)' },
      { w: '{納|おさ}める', ro: 'osameru', vi: 'nộp (thuế, tiền — N2)' },
      { w: '{収納|しゅうのう}', ro: 'shuunou', vi: 'cất trữ, chỗ để đồ (N2)' },
    ],
  },
  '責': {
    hv: 'TRÁCH', nghia: 'trách; trách nhiệm', en: 'blame / responsibility',
    on: ['セキ'], kun: ['せ・める'],
    nho: 'Phần trên (biến thể của 朿 — cái gai nhọn), phần dưới 貝 (tiền): ĐÒI TIỀN NỢ gắt như gai đâm = TRÁCH (đòi, trách) → 責める, 責任. Thêm bộ bên trái → 積 (tích luỹ — 禾) và 績 (成績 — 糸).',
    tu: [
      { w: '{責任|せきにん}', ro: 'sekinin', vi: 'trách nhiệm' },
      { w: '{責|せ}める', ro: 'semeru', vi: 'trách, đổ lỗi' },
      { w: '{自分|じぶん}を{責|せ}める', ro: 'jibun o semeru', vi: 'tự trách mình' },
    ],
  },
  '任': {
    hv: 'NHIỆM', nghia: 'giao phó, gánh vác', en: 'entrust / duty',
    on: ['ニン'], kun: ['まか・せる', 'まか・す'],
    nho: 'Bên trái 亻 (người), bên phải 壬 (gợi âm ニン; hình cái đòn gánh): người GÁNH VÁC việc được giao = NHIỆM → 任せる, 責任. Khác 仕 (仕事) — bên phải là 士, không có nét phẩy ở đầu.',
    tu: [
      { w: '{責任|せきにん}', ro: 'sekinin', vi: 'trách nhiệm' },
      { w: '{任|まか}せる', ro: 'makaseru', vi: 'giao cho, để cho (ai) làm' },
      { w: '{担任|たんにん}', ro: 'tannin', vi: 'giáo viên chủ nhiệm (N2)' },
      { w: '{主任|しゅにん}', ro: 'shunin', vi: 'tổ trưởng, chủ nhiệm (N2)' },
    ],
  },
  '態': {
    hv: 'THÁI', nghia: 'dáng vẻ, trạng thái', en: 'attitude / condition',
    on: ['タイ'], kun: [],
    nho: 'Trên 能 (năng — khả năng, gợi âm), dưới 心 (trái tim): khả năng thể hiện ra TỪ TRONG LÒNG = THÁI (độ, dáng vẻ) → 態度, 状態.',
    tu: [
      { w: '{態度|たいど}', ro: 'taido', vi: 'thái độ' },
      { w: '{状態|じょうたい}', ro: 'joutai', vi: 'tình trạng (N3)' },
      { w: '{事態|じたい}', ro: 'jitai', vi: 'tình hình, sự thể (N1)' },
    ],
  },
  '協': {
    hv: 'HIỆP', nghia: 'hợp sức, hoà hợp', en: 'cooperate',
    on: ['キョウ'], kun: [],
    nho: 'Bên trái 十 (mười — nhiều), bên phải 劦 (ba chữ 力 — sức): NHIỀU SỨC GỘP LẠI = HIỆP → 協力. Trong chữ đã có ba chữ 力 — nhìn là nhớ ngay từ 協力.',
    tu: [
      { w: '{協力|きょうりょく}', ro: 'kyouryoku', vi: 'hợp tác, chung sức' },
      { w: '{協力的|きょうりょくてき}', ro: 'kyouryokuteki', vi: 'có tinh thần hợp tác' },
      { w: '{協会|きょうかい}', ro: 'kyoukai', vi: 'hiệp hội (N2)' },
      { w: '{協調|きょうちょう}', ro: 'kyouchou', vi: 'hợp tác hài hoà (N1)' },
    ],
  },
  '述': {
    hv: 'THUẬT', nghia: 'trình bày, kể ra', en: 'state / mention',
    on: ['ジュツ'], kun: ['の・べる'],
    nho: 'Bộ 辶 (bước đi) + 朮 (gợi âm ジュツ): đi theo THỨ TỰ TỪNG BƯỚC mà kể = THUẬT (trình bày) → 述べる. Cùng 朮 và cùng đọc ジュツ: 術 (技術, 美術) — 朮 nằm giữa chữ 行.',
    tu: [
      { w: '{述|の}べる', ro: 'noberu', vi: 'trình bày, nêu' },
      { w: '{意見|いけん}を{述|の}べる', ro: 'iken o noberu', vi: 'nêu ý kiến' },
      { w: '{記述|きじゅつ}', ro: 'kijutsu', vi: 'mô tả, ghi chép (N2)' },
      { w: '{前述|ぜんじゅつ}', ro: 'zenjutsu', vi: 'đã nói ở trên (N1)' },
    ],
  },
  '示': {
    hv: 'THỊ', nghia: 'chỉ ra, cho thấy', en: 'show / indicate',
    on: ['ジ', 'シ'], kun: ['しめ・す'],
    nho: 'Hình cái bàn thờ (二 = mặt bàn, 小 = chân bàn / rượu tưới xuống): thần linh HIỆN RA, CHỈ BẢO qua bàn thờ = THỊ (chỉ ra) → 示す. Đây cũng là bộ "thần" (示／礻) trong 社, 神, 礼.',
    tu: [
      { w: '{示|しめ}す', ro: 'shimesu', vi: 'chỉ ra, cho thấy' },
      { w: '{指示|しじ}', ro: 'shiji', vi: 'chỉ thị' },
      { w: '{表示|ひょうじ}', ro: 'hyouji', vi: 'hiển thị (N2)' },
      { w: '{掲示板|けいじばん}', ro: 'keijiban', vi: 'bảng tin' },
    ],
  },
  '個': {
    hv: 'CÁ', nghia: 'cá thể; cái (đếm đồ vật)', en: 'individual / piece',
    on: ['コ'], kun: [],
    nho: 'Bên trái 亻 (người), bên phải 固 (cứng, vững — gợi âm コ): mỗi người là MỘT CÁ THỂ RIÊNG ĐỨNG VỮNG = CÁ → 個人; đếm đồ vật: 一個. Khác 固 (固い) — không có 亻.',
    tu: [
      { w: '{個人|こじん}', ro: 'kojin', vi: 'cá nhân' },
      { w: '{個人的|こじんてき}', ro: 'kojinteki', vi: 'mang tính cá nhân' },
      { w: '{一個|いっこ}', ro: 'ikko', vi: 'một cái' },
      { w: '{個性|こせい}', ro: 'kosei', vi: 'cá tính (N2)' },
    ],
  },
  '的': {
    hv: 'ĐÍCH', nghia: 'cái đích; "mang tính…"', en: 'target / -ic, -al',
    on: ['テキ'], kun: ['まと'],
    nho: 'Bên trái 白 (trắng — chấm hồng tâm), bên phải 勺 (cái muôi — gợi âm): chấm trắng giữa tấm bia = ĐÍCH → 目的; hậu tố ～的 = "mang tính…" (積極的). Khác 約 (約束) — bên trái là 糸.',
    tu: [
      { w: '{目的|もくてき}', ro: 'mokuteki', vi: 'mục đích (N3)' },
      { w: '{積極的|せっきょくてき}', ro: 'sekkyokuteki', vi: 'tích cực, chủ động' },
      { w: '{一般的|いっぱんてき}', ro: 'ippanteki', vi: 'phổ biến, thông thường' },
      { w: '{的|まと}', ro: 'mato', vi: 'cái đích, bia (N1)' },
    ],
  },
  '満': {
    hv: 'MÃN', nghia: 'đầy, đủ', en: 'full / satisfy',
    on: ['マン'], kun: ['み・ちる', 'み・たす'],
    nho: 'Bên trái 氵 (nước), bên phải phần gợi âm マン (hình cái bình có nắp đậy kín): nước ĐẦY TRÀN bình = MÃN → 満員, 満足; 不満 = không đầy = không hài lòng.',
    tu: [
      { w: '{満足|まんぞく}', ro: 'manzoku', vi: 'hài lòng' },
      { w: '{不満|ふまん}', ro: 'fuman', vi: 'bất mãn' },
      { w: '{満員|まんいん}', ro: 'man\'in', vi: 'chật kín người' },
      { w: '{満点|まんてん}', ro: 'manten', vi: 'điểm tối đa (N3)' },
    ],
  },
  '感': {
    hv: 'CẢM', nghia: 'cảm, cảm nhận', en: 'feel / emotion',
    on: ['カン'], kun: [],
    nho: 'Trên 咸 (gợi âm カン; nghĩa gốc "tất cả"), dưới 心 (trái tim): CẢ TRÁI TIM rung lên = CẢM → 感じる (âm On + đuôi じる), 感想. Khác 惑 (迷惑 — 或 + 心) và 減 (減る — 氵 + 咸).',
    tu: [
      { w: '{感|かん}じる', ro: 'kanjiru', vi: 'cảm thấy' },
      { w: '{感想|かんそう}', ro: 'kansou', vi: 'cảm nghĩ' },
      { w: '{感謝|かんしゃ}', ro: 'kansha', vi: 'biết ơn' },
      { w: '{感動|かんどう}', ro: 'kandou', vi: 'cảm động (N3)' },
    ],
  },
  '比': {
    hv: 'TỶ', nghia: 'so sánh', en: 'compare',
    on: ['ヒ'], kun: ['くら・べる'],
    nho: 'Hai người (匕) ĐỨNG CẠNH NHAU CÙNG HƯỚNG → đặt cạnh nhau để so = TỶ → 比べる. Khác 北 (bắc — hai người QUAY LƯNG lại nhau).',
    tu: [
      { w: '{比|くら}べる', ro: 'kuraberu', vi: 'so sánh' },
      { w: '{比較|ひかく}', ro: 'hikaku', vi: 'so sánh, đối chiếu' },
      { w: '{比較的|ひかくてき}', ro: 'hikakuteki', vi: 'tương đối' },
      { w: '{比例|ひれい}', ro: 'hirei', vi: 'tỷ lệ thuận (N2)' },
    ],
  },
};
