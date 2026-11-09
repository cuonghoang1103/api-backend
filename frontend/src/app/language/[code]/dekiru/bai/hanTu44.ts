/**
 * Chữ Hán MỚI của Bài 44 (結果 — Kết cục · tiếp sau sách, cấp N2) cho thẻ chữ Hán — cùng định dạng hanTu.ts.
 * 22 chữ: 第 挙 句 討 渉 妥 功 粘 再 競 涙 泡 崩 奇 跡 看 舞 捜 索 独 腕 伸 — bảng `b44-han-tu` trong bai44.ts.
 * Cấp theo các bảng tham khảo phổ biến (JLPT không công bố danh sách chữ chính thức): phần lớn N2; 第・再・独・伸 nhiều bảng xếp N3;
 * 妥 粘 泡 nhiều bảng xếp N1 nhưng TỪ chứa chúng (妥協・粘る・水の泡) là từ N2 hay gặp. Không trùng hanTu.ts, hanTu16–42.ts,
 * hanTuTiep.ts, hanLop.ts và các bảng chữ Hán Bài 1–42 (kiểm 09/11 bằng script — 1.016 chữ đã dạy), và không trùng chữ Bài 43 đang
 * soạn song song (hanTu43.ts: 総 劣 微 妙 星 雰 盛 稿 濃 薄 演 劇 俳 監 督 脚 賞 審 豊 富 迫 鋭 珍 熟 — vì thế KHÔNG lấy 迫).
 * Cách nhớ: theo cấu tạo chữ (phần chỉ nghĩa + phần gợi âm của chữ hình thanh ghi rõ). Từ đi chung ưu tiên từ dùng trong bai44.ts
 * và từ đã học ở bài trước (次第に Bài 26, 第一印象 Bài 41, 例を挙げる Bài 28, 文句 Bài 22, 成功 Bài 28, 再開 Bài 27, 粘り強い Bài 41,
 * 看護師 Bài 29, 体調 Bài 29).
 * On / Kun theo bảng thường dụng (常用): 第 句 渉 妥 看 索 奇 chỉ có âm On; 功 có On コウ・ク (ク hiếm — 功徳); 再 có On サイ・サ
 * (サ trong 再来年・再来週); 競 có On キョウ・ケイ (ケイ trong 競馬) và Kun きそ・う／せ・る; 伸 có Kun の・びる／の・ばす／の・べる;
 * 舞 có Kun ま・う／まい; 崩 có Kun くず・れる／くず・す; 挙 có Kun あ・げる／あ・がる.
 * Tệp chỉ có `import type` — tải chậm như hanTu.ts.
 */
import type { HanTu } from '@/components/sach-hoc/kanji';

export const HAN_TU_44: Record<string, HanTu> = {
  '第': {
    hv: 'ĐỆ', nghia: 'thứ (thứ tự); tuỳ theo (trong 次第)', en: 'ordinal prefix / order',
    on: ['ダイ'], kun: [],
    nho: 'Trên là ⺮ (thẻ tre), dưới là 弟 rút gọn (vốn là sợi dây quấn quanh cọc theo từng vòng, gợi âm テイ／ダイ): THẺ TRE XẾP THEO THỨ TỰ = ĐỆ (thứ nhất, thứ hai…). 次第 = "thứ tự tiếp theo" → "tuỳ theo, ngay khi". ⚠ 弟 (おとうと) không có ⺮.',
    tu: [
      { w: '{次第|しだい}', ro: 'shidai', vi: 'tuỳ vào; ngay khi; sự tình (N2 — ngữ pháp Bài 44)' },
      { w: '{次第|しだい}に', ro: 'shidai ni', vi: 'dần dần (Bài 26)' },
      { w: '{第一|だいいち}', ro: 'daiichi', vi: 'thứ nhất, trước hết (N3)' },
      { w: '{第一印象|だいいちいんしょう}', ro: 'daiichi inshou', vi: 'ấn tượng đầu tiên (Bài 41)' },
      { w: '{落第|らくだい}', ro: 'rakudai', vi: 'thi trượt, ở lại lớp (N2)' },
    ],
  },
  '挙': {
    hv: 'CỬ', nghia: 'nâng lên, đưa ra; cử (bầu)', en: 'raise / cite / elect',
    on: ['キョ'], kun: ['あ・げる', 'あ・がる'],
    nho: 'Trên là hai bàn tay đỡ (phần ⺍ và hai nét ngang — dạng giản của 與 "cùng nâng"), dưới là 手 (tay): NHIỀU BÀN TAY CÙNG NÂNG LÊN = CỬ → 挙げる (đưa ra: 例を挙げる), 選挙 (giơ tay chọn người). 挙げ句 = "câu cuối cùng được đưa ra" (câu kết của bài thơ liên vần) → "rốt cuộc".',
    tu: [
      { w: '{挙|あ}げ{句|く}', ro: 'ageku', vi: 'rốt cuộc (sau khi…) — ngữ pháp Bài 44' },
      { w: '{例|れい}を{挙|あ}げる', ro: 'rei o ageru', vi: 'đưa ra ví dụ (Bài 28)' },
      { w: '{選挙|せんきょ}', ro: 'senkyo', vi: 'bầu cử (N2)' },
      { w: '{挙手|きょしゅ}', ro: 'kyoshu', vi: 'giơ tay (biểu quyết, phát biểu — N1)' },
    ],
  },
  '句': {
    hv: 'CÚ', nghia: 'câu, cụm chữ', en: 'phrase / clause',
    on: ['ク'], kun: [],
    nho: 'Bộ 勹 (vòng tay ôm, bao lại) ôm lấy 口 (miệng, lời nói): LỜI NÓI ĐƯỢC BAO LẠI THÀNH MỘT ĐOẠN = CÚ (câu, cụm). 文句 = "những câu chữ" → lời càu nhàu; 俳句 = thơ ba câu. ⚠ 旬 (しゅん — mùa ngon nhất) = 勹 + 日.',
    tu: [
      { w: '{挙|あ}げ{句|く}', ro: 'ageku', vi: 'rốt cuộc — ngữ pháp Bài 44' },
      { w: '{文句|もんく}', ro: 'monku', vi: 'lời càu nhàu, phàn nàn (Bài 22)' },
      { w: '{語句|ごく}', ro: 'goku', vi: 'từ ngữ, cụm từ (đề thi — N2)' },
      { w: '{俳句|はいく}', ro: 'haiku', vi: 'thơ haiku (N2)' },
    ],
  },
  '討': {
    hv: 'THẢO', nghia: 'xem xét, bàn bạc; đánh dẹp', en: 'examine / discuss',
    on: ['トウ'], kun: ['う・つ'],
    nho: 'Bên trái 言 (lời nói), bên phải 寸 (bàn tay, phép đo — gợi "theo phép tắc"): DÙNG LỜI THEO PHÉP TẮC MÀ TRA XÉT = THẢO → 検討 (xem xét kỹ), 討論 (tranh luận). Kun うつ (đánh dẹp — 敵を討つ) chỉ gặp trong truyện lịch sử.',
    tu: [
      { w: '{検討|けんとう}', ro: 'kentou', vi: 'xem xét, cân nhắc (N2)' },
      { w: '{再検討|さいけんとう}', ro: 'saikentou', vi: 'xem xét lại (N2)' },
      { w: '{討論|とうろん}', ro: 'touron', vi: 'tranh luận, thảo luận (N2)' },
    ],
  },
  '渉': {
    hv: 'THIỆP', nghia: 'lội qua; qua lại, dính líu', en: 'ford / negotiate',
    on: ['ショウ'], kun: [],
    nho: 'Bên trái 氵 (nước), bên phải 歩 (đi bộ — Bài 10): ĐI BỘ LỘI QUA SÔNG = THIỆP → qua lại giữa hai bên → 交渉 (đàm phán: hai bên "lội qua lại" với nhau), 干渉 (can thiệp). Phần bên phải viết y như chữ 歩 — nhớ "nước + bước đi".',
    tu: [
      { w: '{交渉|こうしょう}', ro: 'koushou', vi: 'đàm phán, thương lượng (N2)' },
      { w: '{値段|ねだん}の{交渉|こうしょう}', ro: 'nedan no koushou', vi: 'mặc cả giá' },
      { w: '{干渉|かんしょう}', ro: 'kanshou', vi: 'can thiệp, xen vào (N1)' },
    ],
  },
  '妥': {
    hv: 'THOẢ', nghia: 'yên ổn, thoả đáng', en: 'gentle / settle / compromise',
    on: ['ダ'], kun: [],
    nho: 'Trên là 爫 (bàn tay từ trên đặt xuống), dưới là 女 (người con gái): BÀN TAY VỖ VỀ CHO NGƯỜI TA YÊN LÒNG = THOẢ (yên ổn, chấp nhận được) → 妥協 (thoả hiệp: hai bên nhượng nhau cho yên), 妥当 (thoả đáng). Cùng 爫 với 受 (うける) và 採 (Bài 41).',
    tu: [
      { w: '{妥協|だきょう}', ro: 'dakyou', vi: 'thoả hiệp, nhượng bộ (N2)' },
      { w: '{妥当|だとう}', ro: 'datou', vi: 'thoả đáng, hợp lý (N1)' },
      { w: '{妥協案|だきょうあん}', ro: 'dakyouan', vi: 'phương án thoả hiệp' },
    ],
  },
  '功': {
    hv: 'CÔNG', nghia: 'công lao, thành công', en: 'achievement / merit',
    on: ['コウ', 'ク'], kun: [],
    nho: 'Bên trái 工 (công việc, gợi âm コウ), bên phải 力 (sức): BỎ SỨC RA LÀM VIỆC thì có CÔNG LAO → 成功 (thành công), 功績 (công trạng). ⚠ 攻 (こう — tấn công, Bài 41 専攻) = 工 + 攵 (tay cầm roi); 功 thì là 力.',
    tu: [
      { w: '{成功|せいこう}', ro: 'seikou', vi: 'thành công (Bài 28)' },
      { w: '{功績|こうせき}', ro: 'kouseki', vi: 'công trạng, thành tích lớn (N1)' },
      { w: '{大成功|だいせいこう}', ro: 'daiseikou', vi: 'thành công rực rỡ' },
    ],
  },
  '粘': {
    hv: 'NIÊM', nghia: 'dính, dẻo; bám dai', en: 'sticky / persevere',
    on: ['ネン'], kun: ['ねば・る'],
    nho: 'Bên trái 米 (gạo), bên phải 占 (gợi âm ネン／セン): CƠM GẠO DẺO DÍNH TAY = NIÊM → 粘る (dính dẻo → bám dai, kiên trì tới cùng), 粘り強い (Bài 41), 粘土 (đất sét). Cùng 占 với 店 (みせ) và 点 (てん).',
    tu: [
      { w: '{粘|ねば}る', ro: 'nebaru', vi: 'bám dai, kiên trì đến cùng (N2)' },
      { w: '{粘|ねば}り{強|づよ}い', ro: 'nebarizuyoi', vi: 'bền bỉ, lì lợm (Bài 41)' },
      { w: '{粘土|ねんど}', ro: 'nendo', vi: 'đất sét (N2)' },
    ],
  },
  '再': {
    hv: 'TÁI', nghia: 'lần nữa, lại', en: 'again / re-',
    on: ['サイ', 'サ'], kun: ['ふたた・び'],
    nho: 'Hình hai cái giỏ (冉) chồng lên nhau, thêm một nét 一 ở trên: CHỒNG THÊM MỘT LẦN NỮA = TÁI (lại, lần thứ hai) → 再び, 再開 (Bài 27), 再検討. ⚠ Âm サ chỉ trong 再来年 (năm kia… năm sau nữa) và 再来週 (tuần sau nữa).',
    tu: [
      { w: '{再|ふたた}び', ro: 'futatabi', vi: 'lại lần nữa (văn viết — N2)' },
      { w: '{再開|さいかい}', ro: 'saikai', vi: 'mở lại, bắt đầu lại (Bài 27)' },
      { w: '{再検討|さいけんとう}', ro: 'saikentou', vi: 'xem xét lại (N2)' },
      { w: '{再来年|さらいねん}', ro: 'sarainen', vi: 'năm sau nữa (N3)' },
    ],
  },
  '競': {
    hv: 'CẠNH', nghia: 'đua tranh', en: 'compete / vie',
    on: ['キョウ', 'ケイ'], kun: ['きそ・う', 'せ・る'],
    nho: 'Hai chữ 立 + 兄 đứng song song: HAI NGƯỜI ĐỨNG CẠNH NHAU, AI CŨNG MUỐN HƠN = CẠNH (đua tranh) → 競争, 競技, 競う. Âm ケイ chỉ gặp trong 競馬 (đua ngựa). ⚠ Đừng nhầm với 鏡 (かがみ — gương: 金 + 竟).',
    tu: [
      { w: '{競争|きょうそう}', ro: 'kyousou', vi: 'cạnh tranh (N2)' },
      { w: '{競|きそ}う', ro: 'kisou', vi: 'đua nhau, thi thố (N1)' },
      { w: '{競技|きょうぎ}', ro: 'kyougi', vi: 'môn thi đấu (N2)' },
      { w: '{競馬|けいば}', ro: 'keiba', vi: 'đua ngựa' },
    ],
  },
  '涙': {
    hv: 'LỆ', nghia: 'nước mắt', en: 'tear(s)',
    on: ['ルイ'], kun: ['なみだ'],
    nho: 'Bên trái 氵 (nước), bên phải 戻 (quay lại, trào ngược — Bài 24 戻る; gợi âm ルイ／レイ): NƯỚC TRÀO NGƯỢC RA TỪ MẮT = LỆ (nước mắt). Nhớ: "cảm xúc dâng ngược lên thành 涙".',
    tu: [
      { w: '{涙|なみだ}', ro: 'namida', vi: 'nước mắt (N2)' },
      { w: '{涙|なみだ}が{出|で}る', ro: 'namida ga deru', vi: 'chảy nước mắt' },
      { w: 'うれし{涙|なみだ}', ro: 'ureshi namida', vi: 'nước mắt vui mừng' },
      { w: '{悔|くや}し{涙|なみだ}', ro: 'kuyashi namida', vi: 'nước mắt tức tưởi (悔しい — Bài 22)' },
    ],
  },
  '泡': {
    hv: 'BÀO', nghia: 'bọt', en: 'bubble / foam',
    on: ['ホウ'], kun: ['あわ'],
    nho: 'Bên trái 氵 (nước), bên phải 包 (gói, bao — gợi âm ホウ): NƯỚC BAO LẤY KHÔNG KHÍ = BÀO (bọt). 水の泡 = "bọt nước" — vỡ ngay → công sức thành công cốc. Cùng 包 với 抱 (かかえる — Bài 41) và 砲.',
    tu: [
      { w: '{泡|あわ}', ro: 'awa', vi: 'bọt (N2)' },
      { w: '{水|みず}の{泡|あわ}', ro: 'mizu no awa', vi: 'công cốc, đổ sông đổ biển (thành ngữ)' },
      { w: '{泡|あわ}{立|だ}つ', ro: 'awadatsu', vi: 'sủi bọt' },
      { w: '{発泡|はっぽう}スチロール', ro: 'happou suchirooru', vi: 'xốp (hộp xốp)' },
    ],
  },
  '崩': {
    hv: 'BĂNG', nghia: 'sụp, lở', en: 'collapse / crumble',
    on: ['ホウ'], kun: ['くず・れる', 'くず・す'],
    nho: 'Trên là 山 (núi), dưới là 朋 (hai mặt trăng đứng cạnh — "bạn bè", gợi âm ホウ): NÚI LỞ, ĐẤT ĐÁ RƠI THÀNH TỪNG MẢNG = BĂNG → 崩れる (sụp, đổ vỡ: 計画が崩れる), 崩す (làm sụp: 体調を崩す — đổ bệnh). Đặc biệt: 雪崩 đọc なだれ (tuyết lở).',
    tu: [
      { w: '{崩|くず}れる', ro: 'kuzureru', vi: 'sụp, đổ, vỡ (kế hoạch, thời tiết) (N2)' },
      { w: '{体調|たいちょう}を{崩|くず}す', ro: 'taichou o kuzusu', vi: 'đổ bệnh, sức khoẻ sa sút' },
      { w: '{崩壊|ほうかい}', ro: 'houkai', vi: 'sụp đổ (N1)' },
      { w: '{雪崩|なだれ}', ro: 'nadare', vi: 'tuyết lở (cách đọc đặc biệt)' },
    ],
  },
  '奇': {
    hv: 'KÌ', nghia: 'lạ, khác thường; lẻ', en: 'strange / odd',
    on: ['キ'], kun: [],
    nho: 'Trên là 大 (người dang tay), dưới là 可 (gợi âm カ／キ): NGƯỜI ĐỨNG LỆCH MỘT CHÂN, DÁNG KHÁC THƯỜNG = KÌ (lạ) → 奇跡 (dấu vết của điều lạ = phép màu), 好奇心. ⚠ 寄 (よる — ghé: 宀 + 奇), 崎 (さき — 山 + 奇), 騎 — cùng phần 奇.',
    tu: [
      { w: '{奇跡|きせき}', ro: 'kiseki', vi: 'kỳ tích, phép màu (N2)' },
      { w: '{奇跡的|きせきてき}に', ro: 'kisekiteki ni', vi: 'một cách kỳ diệu' },
      { w: '{好奇心|こうきしん}', ro: 'koukishin', vi: 'tính tò mò (N2)' },
      { w: '{奇数|きすう}', ro: 'kisuu', vi: 'số lẻ (N1)' },
    ],
  },
  '跡': {
    hv: 'TÍCH', nghia: 'dấu vết', en: 'trace / mark / ruins',
    on: ['セキ'], kun: ['あと'],
    nho: 'Bên trái ⻊ (chân), bên phải 亦 (gợi âm エキ／セキ): CHỖ BÀN CHÂN ĐỂ LẠI = TÍCH (dấu vết) → 足跡, 遺跡 (di tích), 奇跡. Kun あと viết 跡 khi là "vết để lại" (タイヤの跡); あと chỉ thời gian ("sau") viết 後.',
    tu: [
      { w: '{奇跡|きせき}', ro: 'kiseki', vi: 'kỳ tích, phép màu (N2)' },
      { w: '{足跡|あしあと}', ro: 'ashiato', vi: 'dấu chân (N2)' },
      { w: '{遺跡|いせき}', ro: 'iseki', vi: 'di tích (N2)' },
      { w: '{跡継|あとつ}ぎ', ro: 'atotsugi', vi: 'người nối nghiệp (N1)' },
    ],
  },
  '看': {
    hv: 'KHÁN', nghia: 'trông, nhìn; trông nom', en: 'watch over / look',
    on: ['カン'], kun: [],
    nho: 'Trên là 手 (bàn tay, viết nghiêng thành ⺹), dưới là 目 (mắt): LẤY TAY CHE TRÊN MẮT MÀ NHÌN CHO KỸ = KHÁN → trông nom: 看病 (trông người ốm), 看護 (chăm sóc y tế); 看板 (tấm bảng để người ta nhìn = biển hiệu). Cùng 目 với 見 nhưng 看 là "nhìn để chăm".',
    tu: [
      { w: '{看病|かんびょう}', ro: 'kanbyou', vi: 'chăm người ốm (N2)' },
      { w: '{看護師|かんごし}', ro: 'kangoshi', vi: 'y tá (Bài 29)' },
      { w: '{看板|かんばん}', ro: 'kanban', vi: 'biển hiệu (N2)' },
    ],
  },
  '舞': {
    hv: 'VŨ', nghia: 'múa; bay lượn', en: 'dance / flutter',
    on: ['ブ'], kun: ['ま・う', 'まい'],
    nho: 'Trên là 無 rút gọn (vốn là hình người cầm cành lông múa, gợi âm ブ／ム), dưới là 舛 (hai bàn chân quay ngược nhau): HAI CHÂN XOAY QUA LẠI, TAY CẦM ĐỒ MÚA = VŨ → 舞う (múa, bay lượn: 花びらが舞う), 舞台 (sân khấu). 見舞う = "đến nhìn, ghé thăm" người ốm / gặp nạn → お見舞い.',
    tu: [
      { w: 'お{見舞|みま}い', ro: 'omimai', vi: 'việc đi thăm người ốm; quà thăm (N2)' },
      { w: '{見舞|みま}う', ro: 'mimau', vi: 'đi thăm (người ốm, gặp nạn) (N2)' },
      { w: '{舞台|ぶたい}', ro: 'butai', vi: 'sân khấu (N2)' },
      { w: '{舞|ま}う', ro: 'mau', vi: 'múa; bay lượn (N1)' },
    ],
  },
  '捜': {
    hv: 'SƯU', nghia: 'tìm kiếm (thứ bị mất)', en: 'search for',
    on: ['ソウ'], kun: ['さが・す'],
    nho: 'Bên trái 扌 (tay), bên phải 叟 (hình một ông già cầm đuốc lần tìm trong nhà): DÙNG TAY LẦN TÌM TRONG BÓNG TỐI = SƯU → 捜す (tìm thứ đã mất / người mất tích), 捜索, 捜査. ⚠ 探す (Bài 10) = tìm thứ MÌNH MUỐN CÓ (việc làm, nhà); 捜す = tìm thứ ĐÃ MẤT (ví, người mất tích).',
    tu: [
      { w: '{捜|さが}す', ro: 'sagasu', vi: 'tìm (đồ đánh rơi, người mất tích) (N2)' },
      { w: '{捜索|そうさく}', ro: 'sousaku', vi: 'cuộc tìm kiếm (người mất tích) (N1)' },
      { w: '{捜査|そうさ}', ro: 'sousa', vi: 'điều tra (cảnh sát) (N1)' },
    ],
  },
  '索': {
    hv: 'SÁCH', nghia: 'dây thừng; lần tìm', en: 'rope / search',
    on: ['サク'], kun: [],
    nho: 'Trên là 十 + 冖, dưới là 糸 (sợi tơ): NHIỀU SỢI TƠ XOẮN THÀNH DÂY THỪNG = SÁCH; rồi "lần theo sợi dây mà tìm" → 検索 (tra cứu — từ IT rất hay gặp), 捜索 (tìm kiếm). ⚠ 素 (そ — 酸素 Bài 42) = 龶 + 糸: phần trên khác.',
    tu: [
      { w: '{検索|けんさく}', ro: 'kensaku', vi: 'tìm kiếm, tra cứu (trên mạng) (N2)' },
      { w: '{捜索|そうさく}', ro: 'sousaku', vi: 'cuộc tìm kiếm (N1)' },
      { w: '{検索|けんさく}エンジン', ro: 'kensaku enjin', vi: 'công cụ tìm kiếm' },
    ],
  },
  '独': {
    hv: 'ĐỘC', nghia: 'một mình, riêng', en: 'alone / independent',
    on: ['ドク'], kun: ['ひと・り'],
    nho: 'Bên trái 犭 (con thú, con chó), bên phải 虫 (dạng giản của 蜀 — gợi âm ドク): CON CHÓ HAY GÂY GỔ NÊN PHẢI ĐI MỘT MÌNH = ĐỘC (một mình, riêng) → 独立 (đứng riêng = tự lập, ra riêng), 独身 (độc thân), 独り言. Cùng 虫 với 触 (ふれる).',
    tu: [
      { w: '{独立|どくりつ}', ro: 'dokuritsu', vi: 'độc lập; ra riêng, tự lập công ty (N2)' },
      { w: '{独身|どくしん}', ro: 'dokushin', vi: 'độc thân (N2)' },
      { w: '{独|ひと}り{言|ごと}', ro: 'hitorigoto', vi: 'nói một mình (N2)' },
      { w: '{独特|どくとく}', ro: 'dokutoku', vi: 'độc đáo, đặc trưng riêng (N2)' },
    ],
  },
  '腕': {
    hv: 'OẢN', nghia: 'cánh tay; tay nghề', en: 'arm / skill',
    on: ['ワン'], kun: ['うで'],
    nho: 'Bên trái 月 (bộ Nhục — phần thân thể), bên phải 宛 (người cuộn mình dưới mái nhà — "cong", gợi âm ワン／エン): PHẦN THÂN THỂ GẬP CONG ĐƯỢC = cánh tay (OẢN). Nghĩa bóng: TAY NGHỀ → 腕がいい, 腕次第, 腕前. ⚠ 碗 (わん — cái bát).',
    tu: [
      { w: '{腕|うで}', ro: 'ude', vi: 'cánh tay; tay nghề (N2)' },
      { w: '{腕時計|うでどけい}', ro: 'udedokei', vi: 'đồng hồ đeo tay (N3)' },
      { w: '{腕前|うでまえ}', ro: 'udemae', vi: 'tay nghề, bản lĩnh (N1)' },
      { w: '{腕|うで}を{上|あ}げる', ro: 'ude o ageru', vi: 'lên tay, tiến bộ tay nghề' },
    ],
  },
  '伸': {
    hv: 'THÂN', nghia: 'duỗi ra, dài ra', en: 'stretch / extend / grow',
    on: ['シン'], kun: ['の・びる', 'の・ばす', 'の・べる'],
    nho: 'Bên trái 亻 (người), bên phải 申 (tia chớp duỗi dài từ trời xuống, gợi âm シン): NGƯỜI DUỖI THẲNG THÂN RA = THÂN → 伸びる (dài ra, tăng lên: 背が伸びる, 成績が伸びる), 伸ばす (kéo dài, phát huy). ⚠ 延びる (Bài 37) = kéo dài THỜI GIAN / khoảng cách (会議が延びる); 伸びる = DÀI RA, TĂNG lên tự nhiên.',
    tu: [
      { w: '{伸|の}びる', ro: 'nobiru', vi: 'dài ra, tăng lên, tiến bộ (N2)' },
      { w: '{伸|の}ばす', ro: 'nobasu', vi: 'kéo dài, duỗi; phát huy (N2)' },
      { w: '{背伸|せの}び', ro: 'senobi', vi: 'kiễng chân; cố tỏ ra hơn sức mình' },
      { w: '{追伸|ついしん}', ro: 'tsuishin', vi: 'tái bút (P.S.)' },
    ],
  },
};
