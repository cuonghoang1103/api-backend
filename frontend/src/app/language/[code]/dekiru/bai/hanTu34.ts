/**
 * Chữ Hán MỚI của Bài 34 (習慣 — tiếp sau sách, cấp N3) cho thẻ chữ Hán — cùng định dạng hanTu.ts.
 * 22 chữ: 癖 坊 則 付 散 濯 節 改 善 継 姿 勢 肩 腰 掃 除 仮 乱 整 菓 我 慢 (N3 là chính theo các bảng tham khảo phổ biến;
 * 付 thường xếp N4; 継・善・腰・坊・濯 có bảng xếp N2; 癖・慢 nhiều bảng xếp N1 nhưng các từ 癖・我慢・自慢 là N3 — JLPT không công
 * bố danh sách chữ chính thức) — bảng `b34-han-tu` trong bai34.ts.
 * Cách nhớ: theo cấu tạo chữ (phần chỉ nghĩa + phần gợi âm của chữ hình thanh ghi rõ). Từ đi chung ưu tiên từ dùng trong
 * bai34.ts và từ đã học ở bài trước (片付ける Bài 16, 規則 Bài 18, 寝坊 Bài 19, 節約・我慢 Bài 21, 肩・腰 Bài 29, 受け継ぐ・
 * 和菓子屋 Bài 32; 洗濯・掃除・散歩 Bài 5).
 * On / Kun theo bảng thường dụng (常用): 坊 則 濯 善(kun よい ít dùng) 菓 慢 chỉ dùng âm On trong từ thông dụng; 坊 có On ボウ・ボッ;
 * 節 có On セツ・セチ; 勢 có On セイ・ゼイ (大勢); 除 có On ジョ・ジ (掃除); 仮 có On カ・ケ (仮病 — N1) và 仮名 (かな) là cách đọc đặc biệt.
 * Tệp chỉ có `import type` — tải chậm như hanTu.ts.
 */
import type { HanTu } from '@/components/sach-hoc/kanji';

export const HAN_TU_34: Record<string, HanTu> = {
  '癖': {
    hv: 'PHÍCH', nghia: 'tật, thói', en: 'habit / quirk',
    on: ['ヘキ'], kun: ['くせ'],
    nho: 'Bộ 疒 (bệnh — mái nhà có người nằm) bao lấy 辟 (gợi âm ヘキ): thứ "BỆNH" KHÓ BỎ = tật, thói → 癖. Khác 壁 (かべ — tường): 辟 ở trên, 土 ở dưới.',
    tu: [
      { w: '{癖|くせ}', ro: 'kuse', vi: 'tật, thói' },
      { w: '{口癖|くちぐせ}', ro: 'kuchiguse', vi: 'câu cửa miệng' },
      { w: '{寝癖|ねぐせ}', ro: 'neguse', vi: 'tóc rối khi ngủ dậy' },
      { w: '{潔癖|けっぺき}', ro: 'keppeki', vi: 'ưa sạch quá mức (N1)' },
    ],
  },
  '坊': {
    hv: 'PHƯỜNG', nghia: 'phường; nhà sư; đứa bé', en: 'monk / boy / ward',
    on: ['ボウ', 'ボッ'], kun: [],
    nho: 'Bên trái 土 (đất), bên phải 方 (gợi âm ボウ): khu đất chia "phương" = PHƯỜNG — nơi có chùa, nhà sư (坊主) → 三日坊主 (sư ba ngày); trẻ con đầu trọc như sư → 赤ん坊. Khác 防 (予防): 阝 + 方 — cùng đọc ボウ.',
    tu: [
      { w: '{寝坊|ねぼう}', ro: 'nebou', vi: 'dậy muộn (Bài 19)' },
      { w: '{朝寝坊|あさねぼう}', ro: 'asanebou', vi: 'ngủ dậy muộn buổi sáng' },
      { w: '{三日坊主|みっかぼうず}', ro: 'mikka bouzu', vi: 'cả thèm chóng chán' },
      { w: '{赤|あか}ん{坊|ぼう}', ro: 'akanbou', vi: 'em bé' },
    ],
  },
  '則': {
    hv: 'TẮC', nghia: 'phép tắc, quy tắc', en: 'rule / law',
    on: ['ソク'], kun: [],
    nho: 'Bên trái 貝 (vốn là hình cái vạc đồng), bên phải 刂 (con dao): KHẮC LUẬT lên vạc đồng = TẮC (phép tắc) → 規則. Khác 測 (đo — 氵 + 則) và 側 (がわ — phía: 亻 + 則).',
    tu: [
      { w: '{規則|きそく}', ro: 'kisoku', vi: 'quy tắc, nội quy (Bài 18)' },
      { w: '{不規則|ふきそく}', ro: 'fukisoku', vi: 'thất thường' },
      { w: '{原則|げんそく}', ro: 'gensoku', vi: 'nguyên tắc (N2)' },
      { w: '{反則|はんそく}', ro: 'hansoku', vi: 'phạm luật (thể thao)' },
    ],
  },
  '付': {
    hv: 'PHÓ', nghia: 'gắn vào; giao, trao', en: 'attach / give',
    on: ['フ'], kun: ['つ・ける', 'つ・く'],
    nho: 'Bên trái 亻 (người), bên phải 寸 (bàn tay): NGƯỜI ĐƯA TAY gắn / trao vào = PHÓ → 付ける, 受付. Khác 村 (むら): 木 + 寸.',
    tu: [
      { w: '{気|き}を{付|つ}ける', ro: 'ki o tsukeru', vi: 'chú ý, cẩn thận' },
      { w: '{片付|かたづ}ける', ro: 'katazukeru', vi: 'dọn dẹp (Bài 16)' },
      { w: '{受付|うけつけ}', ro: 'uketsuke', vi: 'quầy lễ tân' },
      { w: '{日付|ひづけ}', ro: 'hizuke', vi: 'ngày tháng (ghi trên giấy)' },
      { w: '{付近|ふきん}', ro: 'fukin', vi: 'vùng lân cận (N2)' },
    ],
  },
  '散': {
    hv: 'TÁN', nghia: 'tản ra, rơi vãi', en: 'scatter',
    on: ['サン'], kun: ['ち・る', 'ち・らす', 'ち・らかる', 'ち・らかす'],
    nho: 'Phần trên (bó cành cây) + 月 + 攵 (tay cầm gậy đập): ĐẬP CHO TƠI RA, rơi vãi khắp nơi = TÁN → 散らかる (bừa bộn), 散歩 (đi tản bộ), 桜が散る (hoa rụng).',
    tu: [
      { w: '{散歩|さんぽ}', ro: 'sanpo', vi: 'đi dạo (Bài 5)' },
      { w: '{散|ち}らかる', ro: 'chirakaru', vi: '(đồ đạc) bừa bộn' },
      { w: '{散|ち}らかす', ro: 'chirakasu', vi: 'bày bừa' },
      { w: '{散|ち}る', ro: 'chiru', vi: 'rụng, tàn (hoa)' },
      { w: '{解散|かいさん}', ro: 'kaisan', vi: 'giải tán' },
    ],
  },
  '濯': {
    hv: 'TRẠC', nghia: 'giặt, rửa', en: 'wash / rinse',
    on: ['タク'], kun: [],
    nho: 'Bên trái 氵 (nước), bên phải 翟 (羽 lông vũ trên 隹 con chim): GIŨ TRONG NƯỚC như chim rỉa lông = TRẠC (giặt) → 洗濯. Khác 曜 (曜日): 日 + 翟 — cùng phần phải.',
    tu: [
      { w: '{洗濯|せんたく}', ro: 'sentaku', vi: 'giặt giũ (Bài 5)' },
      { w: '{洗濯物|せんたくもの}', ro: 'sentakumono', vi: 'đồ giặt' },
      { w: '{洗濯機|せんたくき}', ro: 'sentakuki', vi: 'máy giặt' },
    ],
  },
  '節': {
    hv: 'TIẾT', nghia: 'đốt (tre); mùa tiết; tiết chế', en: 'node / season / moderation',
    on: ['セツ', 'セチ'], kun: ['ふし'],
    nho: 'Trên là ⺮ (tre), dưới là 即 (gợi âm): ĐỐT TRE — cây tre chia từng đốt = TIẾT → 季節 (các "đốt" của năm), 節約 (chia từng phần, không phung phí).',
    tu: [
      { w: '{季節|きせつ}', ro: 'kisetsu', vi: 'mùa' },
      { w: '{節約|せつやく}', ro: 'setsuyaku', vi: 'tiết kiệm (Bài 21)' },
      { w: '{調節|ちょうせつ}', ro: 'chousetsu', vi: 'điều chỉnh (N2)' },
      { w: '{節|ふし}', ro: 'fushi', vi: 'đốt, khớp' },
    ],
  },
  '改': {
    hv: 'CẢI', nghia: 'sửa đổi', en: 'reform / change',
    on: ['カイ'], kun: ['あらた・める', 'あらた・まる'],
    nho: 'Bên trái 己 (bản thân — gợi âm), bên phải 攵 (tay cầm roi): TỰ QUẤT ROI VÀO MÌNH để sửa = CẢI → 改める, 改善. Cùng 己 với 記 (日記) và 起 (起きる).',
    tu: [
      { w: '{改|あらた}める', ro: 'aratameru', vi: 'sửa đổi cho đúng' },
      { w: '{改|あらた}めて', ro: 'aratamete', vi: 'lại một lần nữa, dịp khác' },
      { w: '{改善|かいぜん}', ro: 'kaizen', vi: 'cải thiện (N2)' },
      { w: '{改札|かいさつ}', ro: 'kaisatsu', vi: 'cửa soát vé (N3)' },
    ],
  },
  '善': {
    hv: 'THIỆN', nghia: 'tốt, lành', en: 'good / virtuous',
    on: ['ゼン'], kun: ['よ・い'],
    nho: 'Trên là 羊 (con dê — biểu tượng điều lành), dưới là 口 (miệng): LỜI NÓI LÀNH như dê = THIỆN (tốt) → 改善 (sửa cho tốt). Cùng 羊 ở trên với 美 (美しい).',
    tu: [
      { w: '{改善|かいぜん}', ro: 'kaizen', vi: 'cải thiện' },
      { w: '{最善|さいぜん}', ro: 'saizen', vi: 'tốt nhất có thể (N2)' },
      { w: '{親善|しんぜん}', ro: 'shinzen', vi: 'hữu nghị' },
    ],
  },
  '継': {
    hv: 'KẾ', nghia: 'nối tiếp, kế thừa', en: 'continue / inherit',
    on: ['ケイ'], kun: ['つ・ぐ'],
    nho: 'Bên trái 糸 (sợi tơ), bên phải 㡭 (những sợi tơ bị đứt — 米 trong khung): NỐI LẠI SỢI TƠ ĐÃ ĐỨT = KẾ (nối tiếp) → 継続, 受け継ぐ. Ngược với 断 (判断): 㡭 + 斤 (rìu) — chặt đứt.',
    tu: [
      { w: '{継続|けいぞく}', ro: 'keizoku', vi: 'duy trì, tiếp tục (N2)' },
      { w: '{受|う}け{継|つ}ぐ', ro: 'uketsugu', vi: 'kế thừa (Bài 32)' },
      { w: '{引|ひ}き{継|つ}ぐ', ro: 'hikitsugu', vi: 'bàn giao, tiếp quản (N2)' },
      { w: '{中継|ちゅうけい}', ro: 'chuukei', vi: 'truyền hình trực tiếp' },
    ],
  },
  '姿': {
    hv: 'TƯ', nghia: 'dáng, dáng vẻ', en: 'figure / appearance',
    on: ['シ'], kun: ['すがた'],
    nho: 'Trên là 次 (gợi âm シ), dưới là 女 (người con gái): DÁNG NGƯỜI CON GÁI = TƯ → 姿, 姿勢. Khác 資 (資料): 次 + 貝 (tiền) — cùng đọc シ.',
    tu: [
      { w: '{姿勢|しせい}', ro: 'shisei', vi: 'tư thế; thái độ' },
      { w: '{姿|すがた}', ro: 'sugata', vi: 'dáng, hình dáng' },
      { w: '{後|うし}ろ{姿|すがた}', ro: 'ushiro sugata', vi: 'dáng nhìn từ phía sau' },
    ],
  },
  '勢': {
    hv: 'THẾ', nghia: 'thế, sức mạnh, khí thế', en: 'force / momentum',
    on: ['セイ', 'ゼイ'], kun: ['いきお・い'],
    nho: 'Trên là 埶 (người cầm cây trồng — gợi âm), dưới là 力 (sức): SỨC ĐANG LÊN MẠNH = THẾ → 勢い, 大勢. Khác 熱 (ねつ): 埶 + 灬 (lửa) — cùng phần trên.',
    tu: [
      { w: '{姿勢|しせい}', ro: 'shisei', vi: 'tư thế' },
      { w: '{大勢|おおぜい}', ro: 'oozei', vi: 'đông người (đọc đặc biệt)' },
      { w: '{勢|いきお}い', ro: 'ikioi', vi: 'khí thế, đà (N2)' },
      { w: '{情勢|じょうせい}', ro: 'jousei', vi: 'tình hình (N1)' },
    ],
  },
  '肩': {
    hv: 'KIÊN', nghia: 'vai', en: 'shoulder',
    on: ['ケン'], kun: ['かた'],
    nho: 'Trên là 戸 (cánh cửa — tấm phẳng), dưới là 月 (bộ "thịt" — cơ thể): PHẦN CƠ THỂ PHẲNG như tấm cửa = KIÊN (vai) → 肩, 肩こり.',
    tu: [
      { w: '{肩|かた}', ro: 'kata', vi: 'vai (Bài 29)' },
      { w: '{肩|かた}こり', ro: 'katakori', vi: 'mỏi vai' },
      { w: '{両肩|りょうかた}', ro: 'ryoukata', vi: 'hai vai' },
    ],
  },
  '腰': {
    hv: 'YÊU', nghia: 'eo, thắt lưng', en: 'waist / lower back',
    on: ['ヨウ'], kun: ['こし'],
    nho: 'Bên trái 月 (cơ thể), bên phải 要 (gợi âm ヨウ; 要 vốn vẽ người chống hai tay vào eo): chỗ "QUAN TRỌNG" của cơ thể = YÊU (eo, thắt lưng) → 腰. Khác 要 (必要): không có 月 — cùng đọc ヨウ.',
    tu: [
      { w: '{腰|こし}', ro: 'koshi', vi: 'thắt lưng, hông (Bài 29)' },
      { w: '{腰痛|ようつう}', ro: 'youtsuu', vi: 'đau lưng (N2)' },
      { w: '{腰|こし}かける', ro: 'koshikakeru', vi: 'ngồi xuống (ghế)' },
    ],
  },
  '掃': {
    hv: 'TẢO', nghia: 'quét', en: 'sweep',
    on: ['ソウ'], kun: ['は・く'],
    nho: 'Bên trái 扌 (tay), bên phải 帚 (cái chổi): TAY CẦM CHỔI = TẢO (quét) → 掃除, 掃く. Khác 帰 (帰る): cũng có 帚 nhưng bên trái là nét khác — "cô dâu cầm chổi về nhà chồng".',
    tu: [
      { w: '{掃除|そうじ}', ro: 'souji', vi: 'dọn dẹp (Bài 5)' },
      { w: '{掃除機|そうじき}', ro: 'soujiki', vi: 'máy hút bụi' },
      { w: '{掃|は}く', ro: 'haku', vi: 'quét (bằng chổi)' },
    ],
  },
  '除': {
    hv: 'TRỪ', nghia: 'loại bỏ, trừ ra', en: 'remove / exclude',
    on: ['ジョ', 'ジ'], kun: ['のぞ・く'],
    nho: 'Bên trái 阝 (gò đất, bậc thềm), bên phải 余 (gợi âm ジョ): DỌN SẠCH BẬC THỀM, bỏ đi = TRỪ → 掃除 (đọc じ!), 除く. Khác 余 (余裕 — dư) và 徐 (徐々に): 彳 + 余 — cùng đọc ジョ.',
    tu: [
      { w: '{掃除|そうじ}', ro: 'souji', vi: 'dọn dẹp (除 đọc じ)' },
      { w: '{除|のぞ}く', ro: 'nozoku', vi: 'trừ ra, loại bỏ (N2)' },
      { w: '{削除|さくじょ}', ro: 'sakujo', vi: 'xoá (dữ liệu) (N2)' },
      { w: '{解除|かいじょ}', ro: 'kaijo', vi: 'huỷ, gỡ bỏ' },
    ],
  },
  '仮': {
    hv: 'GIẢ', nghia: 'tạm; giả định', en: 'temporary / suppose',
    on: ['カ', 'ケ'], kun: ['かり'],
    nho: 'Bên trái 亻 (người), bên phải 反 (lật ngược — gợi âm): NGƯỜI ĐÓNG GIẢ, không phải thật = GIẢ (tạm, giả định) → 仮に. Cùng 反 với 坂 (土), 板 (木), 返 (辶).',
    tu: [
      { w: '{仮|かり}に', ro: 'kari ni', vi: 'giả sử' },
      { w: '{仮定|かてい}', ro: 'katei', vi: 'giả định (N2)' },
      { w: '{仮名|かな}', ro: 'kana', vi: 'chữ kana (đọc đặc biệt)' },
      { w: '{仮|かり}の', ro: 'kari no', vi: 'tạm thời' },
    ],
  },
  '乱': {
    hv: 'LOẠN', nghia: 'rối, loạn', en: 'disorder / riot',
    on: ['ラン'], kun: ['みだ・れる', 'みだ・す'],
    nho: 'Chữ gốc 亂 vẽ hai bàn tay gỡ cuộn tơ rối; dạng nay viết gọn thành 舌 + 乚 (nét móc). Mẹo: "lưỡi bị móc lại → nói năng RỐI LOẠN" = LOẠN → 乱れる, 混乱. Cùng 舌 với 辞 (辞書) và 話.',
    tu: [
      { w: '{乱|みだ}れる', ro: 'midareru', vi: 'bị rối, bị xáo trộn' },
      { w: '{乱|みだ}す', ro: 'midasu', vi: 'làm rối' },
      { w: '{混乱|こんらん}', ro: 'konran', vi: 'hỗn loạn (N2)' },
      { w: '{乱暴|らんぼう}', ro: 'ranbou', vi: 'thô bạo (N3)' },
    ],
  },
  '整': {
    hv: 'CHỈNH', nghia: 'chỉnh tề, ngay ngắn', en: 'arrange / put in order',
    on: ['セイ'], kun: ['ととの・える', 'ととの・う'],
    nho: 'Trên là 束 (bó củi) + 攵 (tay gõ), dưới là 正 (ngay ngắn): GÕ CHO BÓ CỦI ĐỀU rồi đặt ngay ngắn = CHỈNH → 整理, 整える. Phần dưới 正 (正しい) nhắc nghĩa "ngay ngắn".',
    tu: [
      { w: '{整理|せいり}', ro: 'seiri', vi: 'sắp xếp ngăn nắp' },
      { w: '{整|ととの}える', ro: 'totonoeru', vi: 'sửa sang cho chỉnh tề' },
      { w: '{整|ととの}う', ro: 'totonou', vi: 'vào nếp, chỉnh tề' },
      { w: '{調整|ちょうせい}', ro: 'chousei', vi: 'điều chỉnh (N2)' },
    ],
  },
  '菓': {
    hv: 'QUẢ', nghia: 'bánh trái, bánh kẹo', en: 'sweets / confectionery',
    on: ['カ'], kun: [],
    nho: 'Trên là 艹 (cỏ cây), dưới là 果 (quả — gợi âm カ): TRÁI CÂY — bánh kẹo xưa chính là trái cây ngọt = QUẢ → お菓子, 和菓子. Khác 果 (結果): không có 艹 — cùng đọc カ.',
    tu: [
      { w: 'お{菓子|かし}', ro: 'okashi', vi: 'bánh kẹo' },
      { w: '{和菓子|わがし}', ro: 'wagashi', vi: 'bánh kiểu Nhật (Bài 32)' },
      { w: '{菓子|かし}パン', ro: 'kashipan', vi: 'bánh mì ngọt' },
    ],
  },
  '我': {
    hv: 'NGÃ', nghia: 'ta, bản thân', en: 'I / self',
    on: ['ガ'], kun: ['われ', 'わ'],
    nho: 'Hình BÀN TAY CẦM CÂY KÍCH (vũ khí có răng cưa — phần 戈 giống trong 戦): vũ khí CỦA CHÍNH TA → NGÃ (ta, bản thân) → 我々, 我慢.',
    tu: [
      { w: '{我慢|がまん}', ro: 'gaman', vi: 'chịu đựng, nhịn (Bài 21)' },
      { w: '{我慢強|がまんづよ}い', ro: 'gamanzuyoi', vi: 'nhẫn nại' },
      { w: '{我々|われわれ}', ro: 'wareware', vi: 'chúng tôi (trang trọng)' },
      { w: '{我|わ}が{国|くに}', ro: 'waga kuni', vi: 'nước ta (văn viết)' },
    ],
  },
  '慢': {
    hv: 'MẠN', nghia: 'chậm; kiêu căng', en: 'lazy / arrogant',
    on: ['マン'], kun: [],
    nho: 'Bên trái 忄 (trái tim), bên phải 曼 (kéo dài — gợi âm マン): LÒNG CHẬM CHẠP, TỰ CAO = MẠN → 我慢 (xưa: cái tôi kiêu căng → nay: nén mình chịu đựng), 自慢 (khoe). Khác 漫 (漫画): 氵 + 曼 — cùng đọc マン.',
    tu: [
      { w: '{我慢|がまん}', ro: 'gaman', vi: 'chịu đựng' },
      { w: '{自慢|じまん}', ro: 'jiman', vi: 'khoe, tự hào (N3)' },
      { w: '{自慢話|じまんばなし}', ro: 'jimanbanashi', vi: 'chuyện khoe khoang' },
    ],
  },
};
