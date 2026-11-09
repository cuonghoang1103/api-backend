/**
 * Chữ Hán MỚI của Bài 37 (職場の日本語 — tiếp sau sách, cấp N3) cho thẻ chữ Hán — cùng định dạng hanTu.ts.
 * 21 chữ: 丁 寧 謙 挨 拶 宛 添 至 致 遣 縮 司 刺 貴 延 封 筒 秘 尋 誠 扱 (N2–N3 là chính theo các bảng tham khảo phổ biến;
 * 丁 có bảng xếp N3–N4; 謙・挨・拶 có bảng cũ xếp N1 nhưng các từ 謙譲語・謙虚・挨拶 rất hay gặp từ N3; 寧 hầu như chỉ còn trong 丁寧
 * — JLPT không công bố danh sách chữ chính thức) — bảng `b37-han-tu` trong bai37.ts.
 * Cách nhớ: theo cấu tạo chữ (phần chỉ nghĩa + phần gợi âm của chữ hình thanh ghi rõ). Từ đi chung ưu tiên từ dùng trong
 * bai37.ts và từ đã học ở bài trước (秘密 Bài 20, 刺す・上司 Bài 22, 名刺 Bài 24, 延期 Bài 27, 一致・司会 Bài 28, 至急・宛先・添付・
 * 貴重 Bài 30, 気を遣う Bài 36; 丁寧 Bài 16). 譲 (Bài 36), 署・締・僚 (Bài 35) đã có thẻ ở bài đó — không lặp.
 * On / Kun theo bảng thường dụng (常用): 寧 謙 挨 拶 chỉ dùng âm On; 宛 và 扱 chỉ có Kun (あ・てる, あつか・う) trong bảng thường dụng;
 * 丁 có On テイ・チョウ; 封 có On フウ・ホウ; 貴 có Kun たっと・い／とうと・い (ít dùng — từ thường gặp là On キ).
 * Tệp chỉ có `import type` — tải chậm như hanTu.ts.
 */
import type { HanTu } from '@/components/sach-hoc/kanji';

export const HAN_TU_37: Record<string, HanTu> = {
  '丁': {
    hv: 'ĐINH', nghia: 'cái đinh; khu phố; cẩn thận', en: 'nail / block (of a town) / polite',
    on: ['テイ', 'チョウ'], kun: [],
    nho: 'Hình CÁI ĐINH nhìn nghiêng: nét ngang là mũ đinh, nét sổ móc là thân đinh → ĐINH. "Đóng đinh cẩn thận" → 丁寧 (kỹ lưỡng, lịch sự). Là phần gợi âm của 町 (まち — 田 + 丁, đọc チョウ) và có trong 打 (うつ — tay 扌 đập đinh 丁).',
    tu: [
      { w: '{丁寧|ていねい}', ro: 'teinei', vi: 'lịch sự, kỹ lưỡng (Bài 16)' },
      { w: '{丁寧語|ていねいご}', ro: 'teineigo', vi: 'thể lịch sự' },
      { w: '{一丁目|いっちょうめ}', ro: 'icchoume', vi: 'khu phố số 1 (trong địa chỉ)' },
      { w: '{包丁|ほうちょう}', ro: 'houchou', vi: 'dao làm bếp' },
    ],
  },
  '寧': {
    hv: 'NINH', nghia: 'yên ổn; kỹ lưỡng', en: 'peaceful / careful',
    on: ['ネイ'], kun: [],
    nho: 'Từ trên xuống: 宀 (mái nhà) + 心 (trái tim) + 皿 (cái bát) + 丁: trong NHÀ, LÒNG yên, BÁT đầy cơm → YÊN ỔN = NINH. Ghép với 丁 thành 丁寧 — làm việc yên ổn, chu đáo. Chữ nhiều nét nhưng hầu như CHỈ gặp trong 丁寧 — nhớ cả cặp.',
    tu: [
      { w: '{丁寧|ていねい}', ro: 'teinei', vi: 'lịch sự, kỹ lưỡng' },
      { w: '{丁寧語|ていねいご}', ro: 'teineigo', vi: 'thể lịch sự' },
      { w: 'ご{丁寧|ていねい}に', ro: 'goteinei ni', vi: 'thật chu đáo (cảm ơn sự chu đáo của người kia)' },
    ],
  },
  '謙': {
    hv: 'KHIÊM', nghia: 'khiêm tốn, nhún nhường', en: 'humble / modest',
    on: ['ケン'], kun: [],
    nho: 'Bên trái 言 (lời nói), bên phải 兼 (gợi âm ケン; 兼 vẽ bàn tay cầm hai bó lúa — "kiêm"): LỜI NÓI biết nhún, không nhận hết về mình = KHIÊM → 謙譲語, 謙虚. Cùng 兼 với 嫌 (いや — ghét: 女 + 兼).',
    tu: [
      { w: '{謙譲語|けんじょうご}', ro: 'kenjougo', vi: 'khiêm nhường ngữ' },
      { w: '{謙虚|けんきょ}', ro: 'kenkyo', vi: 'khiêm tốn (N2)' },
      { w: '{謙遜|けんそん}', ro: 'kenson', vi: 'tự khiêm, nói nhún (N1)' },
    ],
  },

  '挨': {
    hv: 'AI', nghia: 'đẩy, chen (chỉ còn trong 挨拶)', en: 'push / approach',
    on: ['アイ'], kun: [],
    nho: 'Bên trái 扌 (tay), bên phải 矣 (gợi âm アイ): TAY ĐẨY lại gần. 挨拶 gốc là từ nhà Thiền: thầy trò "đẩy (挨) – ép (拶)" nhau bằng câu hỏi để thử sức → nay là CHÀO HỎI. Hai chữ đều có 扌 — nhớ cả cặp "hai bàn tay chào nhau".',
    tu: [
      { w: '{挨拶|あいさつ}', ro: 'aisatsu', vi: 'chào hỏi (Bài 18: あいさつする)' },
      { w: '{挨拶状|あいさつじょう}', ro: 'aisatsujou', vi: 'thư chào (thông báo chuyển việc, năm mới…)' },
      { w: 'ご{挨拶|あいさつ}に{伺|うかが}う', ro: 'goaisatsu ni ukagau', vi: 'đến chào (khách, đối tác)' },
    ],
  },
  '拶': {
    hv: 'TẠT', nghia: 'ép, dồn (chỉ còn trong 挨拶)', en: 'press / close in',
    on: ['サツ'], kun: [],
    nho: 'Bên trái 扌 (tay), bên phải 巛 trên 夕: TAY ÉP sát lại — cặp với 挨 (đẩy). Hầu như chỉ gặp trong 挨拶 (chào hỏi). Đọc サツ — cùng âm với 札 ({改札|かいさつ}) nhưng khác chữ.',
    tu: [
      { w: '{挨拶|あいさつ}', ro: 'aisatsu', vi: 'chào hỏi' },
      { w: '{挨拶|あいさつ}する', ro: 'aisatsu suru', vi: 'chào' },
      { w: 'お{礼|れい}の{挨拶|あいさつ}', ro: 'orei no aisatsu', vi: 'lời chào cảm ơn' },
    ],
  },
  '宛': {
    hv: 'UYỂN', nghia: 'gửi tới, hướng tới', en: 'addressed to',
    on: [], kun: ['あ・てる'],
    nho: 'Trên là 宀 (mái nhà), dưới là 夗 (người nằm co, uốn cong): thứ gì đó "UỐN" về đúng một mái nhà → GỬI TỚI → 宛名 (tên người nhận), 宛先, ～宛. Cùng phần 宛 với 腕 (うで — cánh tay "cong": 月 + 宛). Âm On エン ngoài bảng thường dụng — chỉ cần あて.',
    tu: [
      { w: '{宛名|あてな}', ro: 'atena', vi: 'tên người nhận' },
      { w: '{宛先|あてさき}', ro: 'atesaki', vi: 'địa chỉ gửi đến (Bài 30)' },
      { w: '{森|もり}{宛|あて}', ro: 'Mori ate', vi: 'gửi anh Mori' },
      { w: '{宛|あ}てる', ro: 'ateru', vi: 'gửi cho (thư — văn viết)' },
    ],
  },

  '添': {
    hv: 'THIÊM', nghia: 'thêm vào, kèm theo', en: 'add / attach / accompany',
    on: ['テン'], kun: ['そ・える', 'そ・う'],
    nho: 'Bên trái 氵 (nước), bên phải 忝 (天 trên 㣺 — gợi âm テン): ĐỔ THÊM NƯỚC vào cho đầy = THIÊM (thêm, kèm) → 添付 (đính kèm — Bài 30), 添える (kèm thêm). 付き添う = đi kèm (người bệnh, trẻ con).',
    tu: [
      { w: '{添付|てんぷ}', ro: 'tenpu', vi: 'đính kèm (Bài 30)' },
      { w: '{添|そ}える', ro: 'soeru', vi: 'kèm thêm, đính thêm' },
      { w: '{付|つ}き{添|そ}う', ro: 'tsukisou', vi: 'đi kèm, chăm sóc bên cạnh' },
      { w: '{添削|てんさく}', ro: 'tensaku', vi: 'chữa bài, sửa bài (N1)' },
    ],
  },

  '至': {
    hv: 'CHÍ', nghia: 'đến, đến tận; cực độ', en: 'reach / utmost',
    on: ['シ'], kun: ['いた・る'],
    nho: 'Hình MŨI TÊN cắm phập xuống MẶT ĐẤT (nét 一 dưới cùng): bay tới tận nơi = CHÍ (đến; tột cùng) → 至急 (gấp tột độ — Bài 30), 至る (đến). Là "gốc" của nhiều chữ: 到 (到着 — 至 + 刂), 致 (至 + 攵), 室 (宀 + 至), 屋 (尸 + 至).',
    tu: [
      { w: '{至急|しきゅう}', ro: 'shikyuu', vi: 'gấp, khẩn cấp (Bài 30)' },
      { w: '{至|いた}る', ro: 'itaru', vi: 'đến, dẫn tới (văn viết)' },
      { w: '{冬至|とうじ}', ro: 'touji', vi: 'đông chí' },
      { w: '{現在|げんざい}に{至|いた}るまで', ro: 'genzai ni itaru made', vi: 'cho đến tận bây giờ' },
    ],
  },
  '致': {
    hv: 'TRÍ', nghia: 'đưa tới; gây ra; làm (khiêm)', en: 'bring about / do (humble)',
    on: ['チ'], kun: ['いた・す'],
    nho: 'Bên trái 至 (đến), bên phải 攵 (tay cầm roi — thúc giục): THÚC cho tới nơi = đưa tới, gây ra → いたす (致す — "làm", khiêm nhường: đưa việc tới người kia), 一致 (khớp nhau — Bài 28). Khác 到 (到着): 至 + 刂 — cùng có 至.',
    tu: [
      { w: '{致|いた}します', ro: 'itashimasu', vi: 'xin làm (khiêm nhường — thường viết いたします)' },
      { w: '{一致|いっち}', ro: 'icchi', vi: 'khớp nhau, nhất trí (Bài 28)' },
      { w: '{致命的|ちめいてき}', ro: 'chimeiteki', vi: 'chết người, nghiêm trọng (N1)' },
    ],
  },
  '遣': {
    hv: 'KHIỂN', nghia: 'sai khiến, phái đi; dùng (tâm, tiền)', en: 'dispatch / use',
    on: ['ケン'], kun: ['つか・う', 'つか・わす'],
    nho: 'Bộ 辶 (bước đi) bọc lấy phần bên trong: SAI NGƯỜI ĐI làm việc = KHIỂN (phái đi — 派遣); từ đó nghĩa "DÙNG" (dùng tâm: 気を遣う; dùng lời: 言葉遣い; dùng tiền: 小遣い). ⚠ Rất giống 遺 (để lại — 遺産): 遺 có NGUYÊN chữ 貴 (có 貝) bên trong, 遣 thì không có 貝.',
    tu: [
      { w: '{気|き}を{遣|つか}う', ro: 'ki o tsukau', vi: 'để ý, lo cho người khác (Bài 36)' },
      { w: '{言葉遣|ことばづか}い', ro: 'kotobazukai', vi: 'cách ăn nói' },
      { w: '{気遣|きづか}い', ro: 'kizukai', vi: 'sự quan tâm' },
      { w: 'お{小遣|こづか}い', ro: 'okozukai', vi: 'tiền tiêu vặt' },
      { w: '{派遣|はけん}', ro: 'haken', vi: 'phái cử; lao động phái cử (N2)' },
    ],
  },
  '縮': {
    hv: 'SÚC', nghia: 'co lại, rút ngắn', en: 'shrink / contract',
    on: ['シュク'], kun: ['ちぢ・む', 'ちぢ・める', 'ちぢ・れる'],
    nho: 'Bên trái 糸 (sợi tơ), bên phải 宿 (gợi âm シュク — chữ của 宿題): SỢI TƠ CO RÚT lại = SÚC → 縮む (vải co lại), 短縮 (rút ngắn). 恐縮 = "sợ đến co người lại" → áy náy, ngại.',
    tu: [
      { w: '{恐縮|きょうしゅく}', ro: 'kyoushuku', vi: 'áy náy, ngại (N2)' },
      { w: '{縮|ちぢ}む', ro: 'chijimu', vi: 'co lại (áo len giặt bị co)' },
      { w: '{短縮|たんしゅく}', ro: 'tanshuku', vi: 'rút ngắn (thời gian — N2)' },
      { w: '{縮小|しゅくしょう}', ro: 'shukushou', vi: 'thu nhỏ (N1)' },
    ],
  },
  '司': {
    hv: 'TI (TƯ)', nghia: 'quản lý, coi sóc', en: 'administer / official',
    on: ['シ'], kun: [],
    nho: 'Hình NGƯỜI giơ tay ra hiệu + 口 (cái miệng): người MỞ MIỆNG RA LỆNH = TI (người quản việc) → 上司 (cấp trên — Bài 22), 司会 (người dẫn chương trình — Bài 28). Gợi âm cho 伺 (亻 + 司 — người chờ lệnh của người quản → うかがう!), 飼 (飼う), 詞.',
    tu: [
      { w: '{上司|じょうし}', ro: 'joushi', vi: 'cấp trên (Bài 22)' },
      { w: '{司会|しかい}', ro: 'shikai', vi: 'người dẫn chương trình, chủ toạ (Bài 28)' },
      { w: '{寿司|すし}', ro: 'sushi', vi: 'sushi' },
    ],
  },

  '刺': {
    hv: 'THÍCH', nghia: 'đâm, chích; danh thiếp', en: 'pierce / sting / business card',
    on: ['シ'], kun: ['さ・す', 'さ・さる'],
    nho: 'Bên trái 朿 (cái gai — cây có gai nhọn), bên phải 刂 (con dao): GAI và DAO → ĐÂM, CHÍCH = THÍCH → 刺す (muỗi chích — Bài 22). 名刺: thời xưa khắc tên lên thẻ tre nhọn để trình người trên → danh thiếp. ⚠ Khác 制 (制服): bên trái 制 không phải 朿.',
    tu: [
      { w: '{名刺|めいし}', ro: 'meishi', vi: 'danh thiếp (Bài 24)' },
      { w: '{刺|さ}す', ro: 'sasu', vi: 'đâm, chích (Bài 22)' },
      { w: '{刺身|さしみ}', ro: 'sashimi', vi: 'gỏi cá sống' },
      { w: '{刺激|しげき}', ro: 'shigeki', vi: 'kích thích (N2)' },
    ],
  },
  '貴': {
    hv: 'QUÝ', nghia: 'quý, cao quý; (tiền tố) quý vị', en: 'precious / your (honorific)',
    on: ['キ'], kun: ['たっと・い', 'とうと・い'],
    nho: 'Trên là hai bàn tay nâng (中 + 一), dưới là 貝 (vỏ sò — tiền, của cải): HAI TAY NÂNG CỦA QUÝ = QUÝ → 貴重 (quý giá — Bài 30), 貴社 (quý công ty — văn viết). Có trong 遺 (để lại — 辶 + 貴). Cùng 貝 ở dưới với 費 (費用), 貸 (貸す).',
    tu: [
      { w: '{貴社|きしゃ}', ro: 'kisha', vi: 'quý công ty (văn viết)' },
      { w: '{貴重|きちょう}', ro: 'kichou', vi: 'quý giá (Bài 30)' },
      { w: '{貴重品|きちょうひん}', ro: 'kichouhin', vi: 'đồ có giá trị' },
      { w: '{貴族|きぞく}', ro: 'kizoku', vi: 'quý tộc' },
    ],
  },
  '延': {
    hv: 'DIÊN', nghia: 'kéo dài, hoãn lại', en: 'extend / postpone',
    on: ['エン'], kun: ['の・びる', 'の・ばす', 'の・べる'],
    nho: 'Bộ 廴 (bước dài — nét "dẫn" bao bên trái dưới) đỡ phần trên (nét phẩy + 止 — bàn chân): BƯỚC ĐI KÉO DÀI mãi = DIÊN → 延期 (dời ngày — Bài 27), 延長 (kéo dài), 延びる. Cùng 廴 với 建 (建てる). Là phần gợi âm của 誕 (誕生日 — 言 + 延, đọc タン).',
    tu: [
      { w: '{延期|えんき}', ro: 'enki', vi: 'hoãn, dời ngày (Bài 27)' },
      { w: '{延長|えんちょう}', ro: 'enchou', vi: 'kéo dài (thời gian, hợp đồng — N2)' },
      { w: '{延|の}びる', ro: 'nobiru', vi: 'bị kéo dài, bị hoãn' },
      { w: '{延|の}ばす', ro: 'nobasu', vi: 'kéo dài, hoãn lại' },
    ],
  },
  '封': {
    hv: 'PHONG', nghia: 'phong kín, niêm', en: 'seal / envelope',
    on: ['フウ', 'ホウ'], kun: [],
    nho: 'Bên trái 圭 (hai lớp đất chồng lên), bên phải 寸 (bàn tay): TAY ĐẮP ĐẤT phủ kín = PHONG (niêm kín) → 封筒 (phong bì), 開封 (mở niêm phong). Âm ホウ chỉ gặp trong từ lịch sử (封建 — phong kiến, N1).',
    tu: [
      { w: '{封筒|ふうとう}', ro: 'fuutou', vi: 'phong bì' },
      { w: '{開封|かいふう}', ro: 'kaifuu', vi: 'mở niêm phong, bóc thư' },
      { w: '{同封|どうふう}', ro: 'doufuu', vi: 'gửi kèm trong cùng phong bì (N1)' },
    ],
  },
  '筒': {
    hv: 'ĐỒNG', nghia: 'cái ống', en: 'tube / pipe',
    on: ['トウ'], kun: ['つつ'],
    nho: 'Trên là ⺮ (cây tre), dưới là 同 (gợi âm トウ／ドウ): ỐNG TRE — đốt tre rỗng ruột = ĐỒNG (ống) → 筒 (cái ống), 水筒 (bình nước — xưa làm bằng ống tre). 封筒 = "ống" giấy được niêm kín → phong bì.',
    tu: [
      { w: '{封筒|ふうとう}', ro: 'fuutou', vi: 'phong bì' },
      { w: '{水筒|すいとう}', ro: 'suitou', vi: 'bình đựng nước' },
      { w: '{筒|つつ}', ro: 'tsutsu', vi: 'cái ống' },
    ],
  },
  '秘': {
    hv: 'BÍ', nghia: 'bí mật, kín', en: 'secret',
    on: ['ヒ'], kun: ['ひ・める'],
    nho: 'Bên trái 禾 (cây lúa), bên phải 必 ("nhất định" — gợi âm ヒツ → ヒ): GIẤU LÚA QUÝ vào một chỗ nhất định không ai biết = BÍ (bí mật) → 秘密 (Bài 20). 秘書 = người giữ "giấy tờ kín" của sếp → thư ký. Cùng 禾 bên trái với 私 (わたし — 禾 + ム).',
    tu: [
      { w: '{秘書|ひしょ}', ro: 'hisho', vi: 'thư ký' },
      { w: '{秘密|ひみつ}', ro: 'himitsu', vi: 'bí mật (Bài 20)' },
      { w: '{極秘|ごくひ}', ro: 'gokuhi', vi: 'tuyệt mật (N1)' },
      { w: '{秘|ひ}める', ro: 'himeru', vi: 'giấu kín (trong lòng — văn viết)' },
    ],
  },
  '尋': {
    hv: 'TẦM', nghia: 'hỏi han; tìm kiếm', en: 'inquire / search',
    on: ['ジン'], kun: ['たず・ねる'],
    nho: 'Trên là ⺕ (bàn tay), giữa là 工 + 口, dưới là 寸 (bàn tay): HAI BÀN TAY DANG RA ĐO (xưa 尋 là đơn vị đo bằng một sải tay) → dang tay đi tìm, hỏi han = TẦM → 尋ねる (hỏi — lịch sự hơn 聞く), お尋ねください (mời khách hỏi). ⚠ Đồng âm 訪ねる (たずねる — đến thăm, Bài 24): 尋 = HỎI, 訪 = THĂM.',
    tu: [
      { w: '{尋|たず}ねる', ro: 'tazuneru', vi: 'hỏi (lịch sự)' },
      { w: 'お{尋|たず}ねください', ro: 'otazune kudasai', vi: 'xin quý khách cứ hỏi' },
      { w: '{道|みち}を{尋|たず}ねる', ro: 'michi o tazuneru', vi: 'hỏi đường' },
      { w: '{尋問|じんもん}', ro: 'jinmon', vi: 'thẩm vấn (N1 — tin tức)' },
    ],
  },
  '誠': {
    hv: 'THÀNH', nghia: 'thành thật, chân thành', en: 'sincerity',
    on: ['セイ'], kun: ['まこと'],
    nho: 'Bên trái 言 (lời nói), bên phải 成 ("thành, làm xong" — gợi âm セイ): LỜI NÓI LÀM ĐƯỢC ĐÚNG NHƯ ĐÃ NÓI = THÀNH THẬT → 誠に (thật sự — email trang trọng), 誠実 (thành thật). Cùng phần 成 với 城 (しろ — lâu đài: 土 + 成) và 盛 (もる — 成 + 皿).',
    tu: [
      { w: '{誠|まこと}に', ro: 'makoto ni', vi: 'thật sự (trang trọng — 誠にありがとうございます)' },
      { w: '{誠実|せいじつ}', ro: 'seijitsu', vi: 'thành thật, đáng tin (N2)' },
      { w: '{誠意|せいい}', ro: 'seii', vi: 'thành ý (N1)' },
    ],
  },
  '扱': {
    hv: 'TRÁP', nghia: 'cầm nắm, xử lý, đối xử', en: 'handle / treat',
    on: [], kun: ['あつか・う'],
    nho: 'Bên trái 扌 (tay), bên phải 及 ("với tới"): ĐƯA TAY VỚI TỚI mà cầm nắm = xử lý, đối xử → 扱う, 取り扱い (cách dùng; 取扱説明書 — sách hướng dẫn). ⚠ Khác 吸 (すう — hút: 口 + 及): tay thì "cầm", miệng thì "hút". Bảng thường dụng chỉ có âm Kun あつか・う.',
    tu: [
      { w: '{扱|あつか}う', ro: 'atsukau', vi: 'xử lý, đối xử, dùng (N3)' },
      { w: '{取|と}り{扱|あつか}い', ro: 'toriatsukai', vi: 'cách xử lý, cách dùng' },
      { w: '{取扱説明書|とりあつかいせつめいしょ}', ro: 'toriatsukai setsumeisho', vi: 'sách hướng dẫn sử dụng' },
      { w: '{丁寧|ていねい}に{扱|あつか}う', ro: 'teinei ni atsukau', vi: 'nâng niu, dùng cẩn thận' },
    ],
  },
};
