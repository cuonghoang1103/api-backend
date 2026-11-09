/**
 * Chữ Hán MỚI của Bài 48 (原因と結果 — Nhân quả · tiếp sau sách, cấp N2) cho thẻ chữ Hán — cùng định dạng hanTu.ts.
 * 24 chữ: 坂 谷 岸 浜 湾 丘 郷 称 縁 遺 釈 慌 遭 詰 陥 嘆 懸 拠 錯 冗 愚 芸 賢 穏 — bảng `b48-han-tu` trong bai48.ts.
 * Không trùng hanTu.ts, hanTu16–47.ts, hanTuTiep.ts, hanLop.ts và các bảng chữ Hán Bài 1–47 (kiểm 09/11 bằng script — ~1.110 chữ đã
 * dạy; Bài 43 = 総 劣 微 妙 星 雰 盛 稿 濃 薄 演 劇 俳 監 督 脚 賞 審 豊 富 迫 鋭 珍 熟 · Bài 44 = 第 挙 句 討 渉 妥 功 粘 再 競 涙 泡 崩 奇 跡 看
 * 舞 捜 索 独 腕 伸 · Bài 45 = 従 拒 罰 償 促 徹 恩 怠 黙 抑 興 奮 激 憧 羨 憎 恨 屈 飽 胸 焦 堪 誇 慰 · Bài 46 = 災 津 波 避 揺 噴 詐 欺 偽 漏 侵
 * 怪 狙 脅 威 菌 炎 免 疫 株 損 益 慎 暴 · Bài 47 = 悟 誓 諦 貫 勇 敢 尽 践 遂 肝 揮 筋 唯 剣 根 克 忍 闘 鍛 宣 叶 壁 維).
 * Cấp chữ theo các bảng tham khảo phổ biến (JLPT không công bố danh sách chữ chính thức): 芸 冗 N3; 坂 谷 岸 浜 湾 丘 郷 称 縁 遺 釈 詰 拠 愚
 * phần lớn bảng xếp N2; 慌 遭 陥 嘆 懸 錯 賢 穏 nhiều bảng xếp N1 nhưng TỪ chứa chúng (慌てる・事故に遭う・欠陥・嘆く・懸命に・錯覚・
 * 賢い・穏やか・冗談・愚痴) là từ N2 hay gặp. (09/11 17:15: ba chữ 密 頻 昇 lúc đầu chọn đã đổi thành 錯 冗 愚 vì hanTu49.ts
 * dùng 密 頻 昇.) 浜 là dạng giản thể của 濱 (Hán Việt TÂN — "bến, bờ nước").
 * Cách nhớ: theo cấu tạo chữ (phần chỉ nghĩa + phần gợi âm của chữ hình thanh ghi rõ). Từ đi chung ưu tiên từ dùng trong bai48.ts
 * và từ đã gặp ở bài trước (縁起 Bài 36, 一生懸命 Bài 16, 根拠 Bài 28, 証拠 Bài 31).
 * On / Kun theo bảng thường dụng (常用): 湾 郷 称 釈 拠 錯 冗 芸 chỉ có âm On; 郷 có On キョウ・ゴウ (ゴウ trong 郷に入っては郷に従え);
 * 遺 có On イ・ユイ (ユイ trong 遺言); 拠 có On キョ・コ (コ trong 証拠); 懸 có On ケン・ケ (ケ trong 懸念) và Kun か・ける／か・かる;
 * 陥 có Kun おちい・る／おとしい・れる; 慌 có Kun あわ・てる／あわ・ただしい; 詰 có Kun つ・める／つ・まる／つ・む; 渋谷 (しぶや) là
 * cách đọc riêng của địa danh.
 * Tệp chỉ có `import type` — tải chậm như hanTu.ts.
 */
import type { HanTu } from '@/components/sach-hoc/kanji';

export const HAN_TU_48: Record<string, HanTu> = {
  '坂': {
    hv: 'PHẢN', nghia: 'con dốc', en: 'slope',
    on: ['ハン'], kun: ['さか'],
    nho: 'Bên trái 土 (đất), bên phải 反 (lật ngược — phần gợi âm ハン): mặt ĐẤT bị LẬT nghiêng lên = CON DỐC → 坂 (dốc), 坂道 (đường dốc). Rất nhiều địa danh Nhật có 〜坂, và tên thường giải thích bằng ～ことから.',
    tu: [
      { w: '{坂|さか}', ro: 'saka', vi: 'con dốc' },
      { w: '{坂道|さかみち}', ro: 'sakamichi', vi: 'đường dốc' },
      { w: '{上|のぼ}り{坂|ざか}', ro: 'noborizaka', vi: 'dốc lên (nghĩa bóng: đang đi lên)' },
      { w: '{下|くだ}り{坂|ざか}', ro: 'kudarizaka', vi: 'dốc xuống (nghĩa bóng: đang đi xuống)' },
    ],
  },
  '谷': {
    hv: 'CỐC', nghia: 'thung lũng, khe núi', en: 'valley',
    on: ['コク'], kun: ['たに'],
    nho: 'Hai nét 八 chồng lên nhau (dòng nước tách ra chảy xuống) trên 口 (cửa, miệng): chỗ NƯỚC từ núi chảy ra qua một CỬA hẹp = THUNG LŨNG → 谷 (たに). Địa danh 渋谷 đọc riêng là しぶや.',
    tu: [
      { w: '{谷|たに}', ro: 'tani', vi: 'thung lũng' },
      { w: '{谷間|たにま}', ro: 'tanima', vi: 'khe núi, thung lũng hẹp' },
      { w: '{渋谷|しぶや}', ro: 'Shibuya', vi: 'Shibuya (địa danh — 谷 đọc や)' },
      { w: '{峡谷|きょうこく}', ro: 'kyoukoku', vi: 'hẻm núi (N1)' },
    ],
  },
  '岸': {
    hv: 'NGẠN', nghia: 'bờ (sông, biển)', en: 'shore, bank',
    on: ['ガン'], kun: ['きし'],
    nho: 'Trên là 山 (núi), giữa là 厂 (vách đá), dưới là 干 (phần gợi âm カン → ガン): VÁCH ĐÁ dựng như núi ở mép nước = BỜ → 岸 (bờ), 海岸 (bờ biển), 川岸 (bờ sông).',
    tu: [
      { w: '{岸|きし}', ro: 'kishi', vi: 'bờ' },
      { w: '{海岸|かいがん}', ro: 'kaigan', vi: 'bờ biển (N2)' },
      { w: '{川岸|かわぎし}', ro: 'kawagishi', vi: 'bờ sông' },
      { w: '{対岸|たいがん}', ro: 'taigan', vi: 'bờ bên kia' },
    ],
  },
  '浜': {
    hv: 'TÂN', nghia: 'bãi biển, bờ nước', en: 'beach',
    on: ['ヒン'], kun: ['はま'],
    nho: 'Chữ cũ 濱 = 氵 (nước) + 賓 (khách — gợi âm ヒン); chữ mới viết gọn phần phải thành 兵. Nhớ: "LÍNH (兵) đóng trại trên BÃI CÁT cạnh NƯỚC (氵)" = BÃI BIỂN → 浜 (はま), 砂浜 (bãi cát), 横浜.',
    tu: [
      { w: '{浜|はま}', ro: 'hama', vi: 'bãi biển' },
      { w: '{砂浜|すなはま}', ro: 'sunahama', vi: 'bãi cát (N2)' },
      { w: '{浜辺|はまべ}', ro: 'hamabe', vi: 'bờ biển, mé bãi' },
      { w: '{横浜|よこはま}', ro: 'Yokohama', vi: 'Yokohama (địa danh)' },
    ],
  },
  '湾': {
    hv: 'LOAN', nghia: 'vịnh', en: 'bay',
    on: ['ワン'], kun: [],
    nho: 'Bên trái 氵 (nước), bên phải 弯 (cong — chữ cũ 灣 với 彎 "uốn cong", gợi âm ワン): NƯỚC biển ôm vào đất liền thành đường CONG = VỊNH → 東京湾, 湾岸.',
    tu: [
      { w: '{湾|わん}', ro: 'wan', vi: 'vịnh' },
      { w: '{東京湾|とうきょうわん}', ro: 'Toukyou-wan', vi: 'vịnh Tokyo' },
      { w: '{湾岸|わんがん}', ro: 'wangan', vi: 'ven vịnh' },
      { w: '{台湾|たいわん}', ro: 'Taiwan', vi: 'Đài Loan' },
    ],
  },
  '丘': {
    hv: 'KHÂU', nghia: 'đồi, gò', en: 'hill',
    on: ['キュウ'], kun: ['おか'],
    nho: 'Chữ tượng hình: hai GÒ ĐẤT nhỏ nhô lên trên mặt đất (nét ngang dưới cùng) = ĐỒI → 丘 (おか). Tên phố kiểu 〜が丘 (桜が丘 — "đồi hoa anh đào") rất phổ biến.',
    tu: [
      { w: '{丘|おか}', ro: 'oka', vi: 'đồi' },
      { w: '{砂丘|さきゅう}', ro: 'sakyuu', vi: 'đồi cát (鳥取砂丘)' },
      { w: '{丘陵|きゅうりょう}', ro: 'kyuuryou', vi: 'vùng đồi (N1)' },
    ],
  },
  '郷': {
    hv: 'HƯƠNG', nghia: 'làng, quê', en: 'home village',
    on: ['キョウ', 'ゴウ'], kun: [],
    nho: 'Bộ 阝 ở BÊN PHẢI (= 邑, làng ấp); chữ gốc vẽ hai người ngồi đối diện quanh mâm cơm — cảnh cả LÀNG cùng ăn uống = QUÊ → 郷土 (quê hương, địa phương), 故郷 (cố hương).',
    tu: [
      { w: '{郷土|きょうど}', ro: 'kyoudo', vi: 'quê hương, địa phương (N1)' },
      { w: '{郷土料理|きょうどりょうり}', ro: 'kyoudo ryouri', vi: 'món ăn địa phương' },
      { w: '{故郷|こきょう}', ro: 'kokyou', vi: 'cố hương, quê nhà' },
      { w: '{郷|ごう}に{入|い}っては{郷|ごう}に{従|したが}え', ro: 'gou ni itte wa gou ni shitagae', vi: 'nhập gia tuỳ tục (tục ngữ — 郷 đọc ゴウ)' },
    ],
  },
  '称': {
    hv: 'XƯNG', nghia: 'gọi tên; khen', en: 'name, call',
    on: ['ショウ'], kun: [],
    nho: 'Bên trái 禾 (cây lúa), bên phải 尔 (chữ cũ 稱 với 爯 — tay nhấc lên): NHẤC bó LÚA lên cân → "cân nhắc, định giá" → GỌI TÊN, xưng hô → 名称 (tên gọi), 愛称 (tên thân mật).',
    tu: [
      { w: '{名称|めいしょう}', ro: 'meishou', vi: 'tên gọi (chính thức) (N2)' },
      { w: '{愛称|あいしょう}', ro: 'aishou', vi: 'tên thân mật, biệt danh (N1)' },
      { w: '{称|しょう}する', ro: 'shou suru', vi: 'xưng là, gọi là (văn viết)' },
      { w: '{対称|たいしょう}', ro: 'taishou', vi: 'đối xứng' },
    ],
  },
  '縁': {
    hv: 'DUYÊN', nghia: 'duyên, mối quan hệ; mép viền', en: 'relation, edge',
    on: ['エン'], kun: ['ふち'],
    nho: 'Bên trái 糸 (sợi chỉ), bên phải 彖 (phần gợi âm): SỢI CHỈ viền quanh MÉP vải = VIỀN (ふち) → nghĩa rộng: sợi chỉ vô hình nối người với người = DUYÊN → ご縁, 縁起 (Bài 36).',
    tu: [
      { w: '{縁|えん}', ro: 'en', vi: 'duyên, mối liên hệ (ご縁がある)' },
      { w: '{縁起|えんぎ}', ro: 'engi', vi: 'điềm, lành dữ (Bài 36)' },
      { w: '{縁側|えんがわ}', ro: 'engawa', vi: 'hiên gỗ nhà kiểu Nhật' },
      { w: '{縁|ふち}', ro: 'fuchi', vi: 'mép, viền (眼鏡の縁)' },
    ],
  },
  '遺': {
    hv: 'DI', nghia: 'để lại, sót lại', en: 'leave behind',
    on: ['イ', 'ユイ'], kun: [],
    nho: 'Bộ 辶 (bước đi) + 貴 (quý giá): người đi rồi mà ĐỂ LẠI vật QUÝ trên đường = DI (để lại) → 遺跡 (di tích), 遺産 (di sản). 遺言 đọc ゆいごん.',
    tu: [
      { w: '{遺跡|いせき}', ro: 'iseki', vi: 'di tích (N2)' },
      { w: '{遺産|いさん}', ro: 'isan', vi: 'di sản' },
      { w: '{世界遺産|せかいいさん}', ro: 'sekai isan', vi: 'di sản thế giới' },
      { w: '{遺伝|いでん}', ro: 'iden', vi: 'di truyền' },
      { w: '{遺言|ゆいごん}', ro: 'yuigon', vi: 'di chúc (遺 đọc ユイ)' },
    ],
  },
  '釈': {
    hv: 'THÍCH', nghia: 'giải thích, gỡ ra', en: 'explain',
    on: ['シャク'], kun: [],
    nho: 'Bên trái 釆 (vết chân thú — "phân biệt, tách bạch"), bên phải 尺 (chữ cũ 釋): TÁCH từng phần ra cho rõ = GIẢI THÍCH → 解釈 (cách hiểu), 釈明 (giải trình, thanh minh).',
    tu: [
      { w: '{解釈|かいしゃく}', ro: 'kaishaku', vi: 'cách hiểu, diễn giải (N2)' },
      { w: '{釈明|しゃくめい}', ro: 'shakumei', vi: 'giải trình, thanh minh (N1)' },
      { w: '{注釈|ちゅうしゃく}', ro: 'chuushaku', vi: 'chú thích' },
    ],
  },
  '慌': {
    hv: 'HOẢNG', nghia: 'hoảng hốt, vội vàng', en: 'panic',
    on: ['コウ'], kun: ['あわ・てる', 'あわ・ただしい'],
    nho: 'Bên trái 忄 (lòng), bên phải 荒 (hoang — bừa bộn, gợi âm コウ): LÒNG rối như cánh đồng HOANG = HOẢNG → 慌てる (cuống lên), 慌ただしい (tất bật).',
    tu: [
      { w: '{慌|あわ}てる', ro: 'awateru', vi: 'hoảng, cuống lên (N2)' },
      { w: '{大慌|おおあわ}て', ro: 'ooawate', vi: 'cuống cuồng' },
      { w: '{慌|あわ}ただしい', ro: 'awatadashii', vi: 'tất bật, vội vã (N1)' },
    ],
  },
  '遭': {
    hv: 'TAO', nghia: 'gặp phải (chuyện không may)', en: 'encounter',
    on: ['ソウ'], kun: ['あ・う'],
    nho: 'Bộ 辶 (bước đi) + 曹 (phần gợi âm ソウ): đang ĐI thì GẶP PHẢI = TAO (tao ngộ) → 事故に遭う (gặp tai nạn). Chỉ dùng cho chuyện KHÔNG MAY; gặp người thì viết 会う.',
    tu: [
      { w: '{遭|あ}う', ro: 'au', vi: 'gặp phải (事故・雨・詐欺に遭う) (N2)' },
      { w: '{遭難|そうなん}', ro: 'sounan', vi: 'gặp nạn (trên núi, biển) (N1)' },
      { w: '{遭遇|そうぐう}', ro: 'souguu', vi: 'chạm trán, gặp phải (N1)' },
    ],
  },
  '詰': {
    hv: 'CẬT', nghia: 'nhồi chặt; vặn hỏi', en: 'pack, press',
    on: ['キツ'], kun: ['つ・める', 'つ・まる', 'つ・む'],
    nho: 'Bên trái 言 (lời), bên phải 吉 (phần gợi âm キツ): LỜI dồn tới tận cùng = VẶN HỎI (問い詰める); nghĩa rộng: NHỒI CHẶT (詰める・詰め込む), bị TẮC (詰まる).',
    tu: [
      { w: '{詰|つ}める', ro: 'tsumeru', vi: 'nhồi, xếp chặt; dồn (N2)' },
      { w: '{詰|つ}め{込|こ}む', ro: 'tsumekomu', vi: 'nhồi nhét (N2)' },
      { w: '{問|と}い{詰|つ}める', ro: 'toitsumeru', vi: 'vặn hỏi tới cùng (N1)' },
      { w: '{詰|つ}まる', ro: 'tsumaru', vi: 'bị tắc, bị kín (予定が詰まる)' },
      { w: '{缶詰|かんづめ}', ro: 'kanzume', vi: 'đồ hộp' },
    ],
  },
  '陥': {
    hv: 'HÃM', nghia: 'rơi xuống, sa vào; khuyết', en: 'fall into',
    on: ['カン'], kun: ['おちい・る', 'おとしい・れる'],
    nho: 'Bộ 阝 ở BÊN TRÁI (= 阜, gò đất) + phần phải vẽ một người rơi xuống HỐ: rơi từ gò đất xuống hố = SA VÀO → 陥る (rơi vào tình trạng xấu), 欠陥 (khiếm khuyết — "chỗ lõm, chỗ thiếu").',
    tu: [
      { w: '{欠陥|けっかん}', ro: 'kekkan', vi: 'khiếm khuyết, lỗi thiết kế (N2)' },
      { w: '{陥|おちい}る', ro: 'ochiiru', vi: 'rơi vào (tình trạng xấu) (N1)' },
      { w: '{陥没|かんぼつ}', ro: 'kanbotsu', vi: 'sụt lún (N1)' },
    ],
  },
  '嘆': {
    hv: 'THÁN', nghia: 'than thở; thán phục', en: 'lament',
    on: ['タン'], kun: ['なげ・く', 'なげ・かわしい'],
    nho: 'Bên trái 口 (miệng), bên phải là phần gợi âm タン: MIỆNG thốt ra tiếng THAN = THÁN → 嘆く (than thở), 感嘆 (thán phục — khi ngạc nhiên vì cái đẹp, cái giỏi).',
    tu: [
      { w: '{嘆|なげ}く', ro: 'nageku', vi: 'than thở, than vãn (N2)' },
      { w: '{嘆|なげ}かわしい', ro: 'nagekawashii', vi: 'đáng buồn, đáng than (N1)' },
      { w: '{感嘆|かんたん}', ro: 'kantan', vi: 'thán phục (N1)' },
    ],
  },
  '懸': {
    hv: 'HUYỀN', nghia: 'treo; dốc hết', en: 'hang, stake',
    on: ['ケン', 'ケ'], kun: ['か・ける', 'か・かる'],
    nho: 'Trên là 県 + 系 (chữ 縣 cổ — TREO lên bằng SỢI DÂY), dưới là 心 (lòng): LÒNG như bị TREO lơ lửng → 懸命 = "treo cả mạng sống" = dốc hết sức; 懸念 (ケ — mối lo treo trong lòng).',
    tu: [
      { w: '{一生懸命|いっしょうけんめい}', ro: 'isshou kenmei', vi: 'hết sức mình (Bài 16)' },
      { w: '{懸命|けんめい}に', ro: 'kenmei ni', vi: 'dốc sức, cật lực (N2)' },
      { w: '{懸念|けねん}', ro: 'kenen', vi: 'mối lo ngại (N1 — tin tức)' },
      { w: '{命|いのち}を{懸|か}ける', ro: 'inochi o kakeru', vi: 'đặt cược cả mạng sống' },
    ],
  },
  '拠': {
    hv: 'CỨ', nghia: 'dựa vào, căn cứ', en: 'basis',
    on: ['キョ', 'コ'], kun: [],
    nho: 'Bên trái 扌 (tay), bên phải 処 (xứ — một chỗ): TAY bám chắc vào một CHỖ = DỰA VÀO → 根拠 (căn cứ), 証拠 (chứng cứ — 拠 đọc コ), 拠点 (cứ điểm).',
    tu: [
      { w: '{根拠|こんきょ}', ro: 'konkyo', vi: 'căn cứ (Bài 28)' },
      { w: '{証拠|しょうこ}', ro: 'shouko', vi: 'chứng cứ (Bài 31 — 拠 đọc コ)' },
      { w: '{拠点|きょてん}', ro: 'kyoten', vi: 'cứ điểm, cơ sở (N1)' },
    ],
  },
  '錯': {
    hv: 'THÁC', nghia: 'lẫn lộn, sai lệch', en: 'mix up, mistake',
    on: ['サク'], kun: [],
    nho: 'Bên trái 金 (kim loại), bên phải 昔 (xưa — phần gợi âm サク／セキ): nghĩa gốc là dát vàng XEN KẼ từng lớp → các lớp XEN LẪN nhau = LẪN LỘN, SAI LỆCH → 錯覚 (tưởng nhầm, ảo giác), 試行錯誤 (thử và sai).',
    tu: [
      { w: '{錯覚|さっかく}', ro: 'sakkaku', vi: 'ảo giác; tưởng nhầm (N1)' },
      { w: '{試行錯誤|しこうさくご}', ro: 'shikou sakugo', vi: 'thử và sai, mò mẫm (đã gặp ở Bài 44)' },
      { w: '{錯誤|さくご}', ro: 'sakugo', vi: 'sai lầm, lệch lạc (N1 — 時代錯誤: lỗi thời)' },
    ],
  },
  '冗': {
    hv: 'NHŨNG', nghia: 'thừa, rườm rà', en: 'superfluous',
    on: ['ジョウ'], kun: [],
    nho: 'Trên là 冖 (mái che), dưới là 几 (cái ghế): người NGỒI KHÔNG dưới mái nhà, chẳng có việc gì = THỪA, NHÀN → 冗談 ("lời thừa" = lời nói đùa), 冗長 (dài dòng thừa thãi).',
    tu: [
      { w: '{冗談|じょうだん}', ro: 'joudan', vi: 'lời nói đùa (đã gặp nhiều lần ở các bài trước)' },
      { w: '{冗談半分|じょうだんはんぶん}', ro: 'joudan hanbun', vi: 'nửa đùa nửa thật' },
      { w: '{冗長|じょうちょう}', ro: 'jouchou', vi: 'dài dòng, rườm rà (N1 — văn viết)' },
    ],
  },
  '愚': {
    hv: 'NGU', nghia: 'ngu dại, dại dột', en: 'foolish',
    on: ['グ'], kun: ['おろ・か'],
    nho: 'Trên là 禺 (con khỉ — phần gợi âm グ), dưới là 心 (lòng): LÒNG lăng xăng như con KHỈ, không suy nghĩ = NGU DẠI → 愚か (dại dột), 愚痴 (lời than vãn, cằn nhằn).',
    tu: [
      { w: '{愚|おろ}か', ro: 'oroka', vi: 'dại dột, ngu ngốc (N2)' },
      { w: '{愚痴|ぐち}', ro: 'guchi', vi: 'lời than vãn, cằn nhằn (愚痴を言う・こぼす)' },
      { w: '{愚問|ぐもん}', ro: 'gumon', vi: 'câu hỏi ngớ ngẩn (N1)' },
    ],
  },
  '芸': {
    hv: 'NGHỆ', nghia: 'nghệ thuật, tài nghệ', en: 'art, skill',
    on: ['ゲイ'], kun: [],
    nho: 'Trên là 艹 (cây cỏ), dưới là 云 (chữ cũ 藝 vẽ người quỳ TRỒNG CÂY): trồng cây giỏi cần tay nghề = TÀI NGHỆ → 芸術 (nghệ thuật), 芸能人 (nghệ sĩ giải trí), 園芸 (làm vườn).',
    tu: [
      { w: '{芸術|げいじゅつ}', ro: 'geijutsu', vi: 'nghệ thuật (N2)' },
      { w: '{芸能人|げいのうじん}', ro: 'geinoujin', vi: 'nghệ sĩ, người của giới giải trí (N2)' },
      { w: '{芸|げい}', ro: 'gei', vi: 'tài nghệ, tiết mục biểu diễn' },
      { w: '{園芸|えんげい}', ro: 'engei', vi: 'nghề làm vườn, trồng hoa' },
    ],
  },
  '賢': {
    hv: 'HIỀN', nghia: 'khôn ngoan, hiền tài', en: 'wise',
    on: ['ケン'], kun: ['かしこ・い'],
    nho: 'Trên là 臤 (臣 bề tôi + 又 bàn tay — giữ CHẮC), dưới là 貝 (vỏ sò = tiền của): người biết GIỮ CHẮC của cải = KHÔN NGOAN → 賢い (khôn, sáng dạ), 賢明 (sáng suốt). Cẩn thận: 賢明 và 懸命 cùng đọc けんめい!',
    tu: [
      { w: '{賢|かしこ}い', ro: 'kashikoi', vi: 'khôn ngoan, thông minh (N2)' },
      { w: '{賢明|けんめい}', ro: 'kenmei', vi: 'sáng suốt (N1 — ≠ 懸命)' },
      { w: '{賢者|けんじゃ}', ro: 'kenja', vi: 'người hiền triết' },
    ],
  },
  '穏': {
    hv: 'ỔN', nghia: 'yên ổn, êm đềm', en: 'calm',
    on: ['オン'], kun: ['おだ・やか'],
    nho: 'Bên trái 禾 (lúa), bên phải là ⺕ (bàn tay) trên 心 (lòng): LÚA đầy kho, TAY đã cất giữ, LÒNG yên = ỔN → 穏やか (êm đềm, ôn hoà), 平穏 (bình yên).',
    tu: [
      { w: '{穏|おだ}やか', ro: 'odayaka', vi: 'êm đềm, ôn hoà (N2)' },
      { w: '{平穏|へいおん}', ro: 'heion', vi: 'bình yên (N1)' },
      { w: '{穏便|おんびん}', ro: 'onbin', vi: 'êm thấm, không làm to chuyện (N1)' },
    ],
  },
};
