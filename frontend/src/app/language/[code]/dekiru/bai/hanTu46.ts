/**
 * Chữ Hán MỚI của Bài 46 (リスク — Rủi ro · tiếp sau sách, cấp N2) cho thẻ chữ Hán — cùng định dạng hanTu.ts.
 * 24 chữ: 災 津 波 避 揺 噴 詐 欺 偽 漏 侵 怪 狙 脅 威 菌 炎 免 疫 株 損 益 慎 暴 — bảng `b46-han-tu` trong bai46.ts.
 * Cấp theo các bảng tham khảo phổ biến (JLPT không công bố danh sách chữ chính thức): 波 N3; 災 避 揺 怪 炎 免 株 損 益 暴 phần lớn
 * bảng xếp N2; 津 噴 詐 欺 偽 漏 侵 狙 脅 威 菌 疫 慎 nhiều bảng xếp N1 nhưng TỪ chứa chúng (津波・噴火・詐欺・偽物・漏れる・侵入・狙う・
 * 脅威・細菌・免疫・慎重) là từ N2–N3 rất hay gặp trong tin tức. Không trùng hanTu.ts, hanTu16–45.ts, hanTuTiep.ts, hanLop.ts và các
 * bảng chữ Hán Bài 1–45 (kiểm 09/11 bằng script — 1.062 chữ đã dạy; Bài 43 = 総 劣 微 妙 星 雰 盛 稿 濃 薄 演 劇 俳 監 督 脚 賞 審 豊 富 迫
 * 鋭 珍 熟 · Bài 44 = 第 挙 句 討 渉 妥 功 粘 再 競 涙 泡 崩 奇 跡 看 舞 捜 索 独 腕 伸 · Bài 45 = 従 拒 罰 償 促 徹 恩 怠 黙 抑 興 奮 激 憧 羨 憎
 * 恨 屈 飽 胸 焦 堪 誇 慰).
 * Cách nhớ: theo cấu tạo chữ (phần chỉ nghĩa + phần gợi âm của chữ hình thanh ghi rõ). Từ đi chung ưu tiên từ dùng trong bai46.ts
 * và từ đã gặp ở bài trước (災害・津波・避難 Bài 27, 怪しい Bài 31, 損 Bài 28, 揺れる Bài 27).
 * On / Kun theo bảng thường dụng (常用): 詐 威 菌 chỉ có âm On; 株 chỉ có âm Kun かぶ (シュ là âm On ngoài bảng); 疫 có On エキ・ヤク
 * (ヤク trong 疫病神); 益 có On エキ・ヤク (ヤク trong ご利益); 暴 có On ボウ・バク (バク trong 暴露) và Kun あば・く／あば・れる;
 * 揺 có bảy Kun (ゆ・れる／ゆ・る／ゆ・らぐ／ゆ・るぐ／ゆ・する／ゆ・さぶる／ゆ・すぶる — ở đây chỉ ghi ba cái hay gặp); 脅 có Kun
 * おびや・かす／おど・す／おど・かす; 偽 có Kun いつわ・る／にせ; 怪我 (けが) là cách đọc đặc biệt của cả từ.
 * Tệp chỉ có `import type` — tải chậm như hanTu.ts.
 */
import type { HanTu } from '@/components/sach-hoc/kanji';

export const HAN_TU_46: Record<string, HanTu> = {
  '災': {
    hv: 'TAI', nghia: 'tai hoạ, thiên tai', en: 'disaster',
    on: ['サイ'], kun: ['わざわ・い'],
    nho: 'Phía trên 巛 (dòng nước cuộn — lũ lụt), phía dưới 火 (lửa — hoả hoạn): NƯỚC LŨ và LỬA CHÁY, hai tai hoạ lớn nhất của con người = TAI → 災害 (thiên tai), 防災 (phòng chống thiên tai).',
    tu: [
      { w: '{災害|さいがい}', ro: 'saigai', vi: 'thiên tai, thảm hoạ (Bài 27)' },
      { w: '{防災|ぼうさい}', ro: 'bousai', vi: 'phòng chống thiên tai (N2)' },
      { w: '{火災|かさい}', ro: 'kasai', vi: 'hoả hoạn (N2)' },
      { w: '{震災|しんさい}', ro: 'shinsai', vi: 'thảm hoạ động đất (N1)' },
    ],
  },
  '津': {
    hv: 'TÂN', nghia: 'bến nước, cảng', en: 'harbor',
    on: ['シン'], kun: ['つ'],
    nho: 'Bên trái 氵 (nước), bên phải 聿 (bàn tay cầm bút — phần gợi âm): chỗ NƯỚC ghé vào bờ = BẾN (TÂN). 津波 = "con sóng ập vào bến cảng" — từ tiếng Nhật đã đi vào tiếng Anh (tsunami).',
    tu: [
      { w: '{津波|つなみ}', ro: 'tsunami', vi: 'sóng thần (Bài 27)' },
      { w: '{津波警報|つなみけいほう}', ro: 'tsunami keihou', vi: 'cảnh báo sóng thần' },
      { w: '{津波注意報|つなみちゅういほう}', ro: 'tsunami chuuihou', vi: 'chú ý sóng thần (mức nhẹ hơn 警報)' },
    ],
  },
  '波': {
    hv: 'BA', nghia: 'sóng, làn sóng', en: 'wave',
    on: ['ハ'], kun: ['なみ'],
    nho: 'Bên trái 氵 (nước), bên phải 皮 (da — gợi âm ハ/ヒ): mặt NƯỚC nhăn lại như lớp DA = SÓNG → 波 (sóng), 電波 (sóng điện), 寒波 (đợt lạnh).',
    tu: [
      { w: '{波|なみ}', ro: 'nami', vi: 'sóng' },
      { w: '{津波|つなみ}', ro: 'tsunami', vi: 'sóng thần' },
      { w: '{電波|でんぱ}', ro: 'denpa', vi: 'sóng điện, sóng (điện thoại) (Bài 30)' },
      { w: '{寒波|かんぱ}', ro: 'kanpa', vi: 'đợt rét, khối không khí lạnh (N1)' },
    ],
  },
  '避': {
    hv: 'TỴ', nghia: 'tránh, lánh', en: 'avoid',
    on: ['ヒ'], kun: ['さ・ける'],
    nho: 'Bộ 辶 (bước đi) bọc 辟 (phần gợi âm ヘキ／ヒ — "lệch sang một bên"): BƯỚC LỆCH sang bên để khỏi chạm vào = TRÁNH → 避ける (tránh), 避難 (lánh nạn, sơ tán).',
    tu: [
      { w: '{避|さ}ける', ro: 'sakeru', vi: 'tránh (N2)' },
      { w: '{避難|ひなん}', ro: 'hinan', vi: 'sơ tán, lánh nạn (Bài 27)' },
      { w: '{避難所|ひなんじょ}', ro: 'hinanjo', vi: 'nơi sơ tán (N2)' },
      { w: '{回避|かいひ}', ro: 'kaihi', vi: 'né tránh (rủi ro) (N1)' },
    ],
  },
  '揺': {
    hv: 'DAO', nghia: 'lay, rung, lắc', en: 'shake / sway',
    on: ['ヨウ'], kun: ['ゆ・れる', 'ゆ・らす', 'ゆ・する'],
    nho: 'Bên trái 扌 (tay), bên phải 䍃 (hình cái bình gốm — phần gợi âm ヨウ): TAY LẮC cái bình = LAY, RUNG → 揺れる (rung, lắc), 揺れ (cơn rung của động đất).',
    tu: [
      { w: '{揺|ゆ}れる', ro: 'yureru', vi: 'rung, lắc (Bài 27)' },
      { w: '{揺|ゆ}れ', ro: 'yure', vi: 'sự rung lắc (N2)' },
      { w: '{揺|ゆ}らす', ro: 'yurasu', vi: 'làm cho rung, đung đưa (N2)' },
      { w: '{動揺|どうよう}', ro: 'douyou', vi: 'dao động, bối rối (N1)' },
    ],
  },
  '噴': {
    hv: 'PHÚN', nghia: 'phun, phụt ra', en: 'erupt / spout',
    on: ['フン'], kun: ['ふ・く'],
    nho: 'Bên trái 口 (miệng), bên phải 賁 (phần gợi âm フン): MIỆNG PHỤT ra mạnh = PHUN → 噴火 (núi lửa phun trào), 噴水 (đài phun nước).',
    tu: [
      { w: '{噴火|ふんか}', ro: 'funka', vi: 'phun trào (núi lửa) (N2)' },
      { w: '{噴水|ふんすい}', ro: 'funsui', vi: 'đài phun nước (N2)' },
      { w: '{噴|ふ}く', ro: 'fuku', vi: 'phun ra (火を噴く — phun lửa)' },
    ],
  },
  '詐': {
    hv: 'TRÁ', nghia: 'dối trá, lừa', en: 'deceive',
    on: ['サ'], kun: [],
    nho: 'Bên trái 言 (lời nói), bên phải 乍 (phần gợi âm サ — "chợt, làm ra vẻ"): LỜI NÓI làm ra vẻ thật = DỐI TRÁ. Hầu như chỉ gặp trong 詐欺 (lừa đảo).',
    tu: [
      { w: '{詐欺|さぎ}', ro: 'sagi', vi: 'lừa đảo (N2)' },
      { w: '{詐欺師|さぎし}', ro: 'sagishi', vi: 'kẻ lừa đảo' },
      { w: '{振|ふ}り{込|こ}め{詐欺|さぎ}', ro: 'furikome sagi', vi: 'lừa đảo chuyển khoản' },
    ],
  },
  '欺': {
    hv: 'KHI', nghia: 'lừa dối', en: 'cheat',
    on: ['ギ'], kun: ['あざむ・く'],
    nho: 'Bên trái 其 (phần gợi âm キ／ギ), bên phải 欠 (người há miệng): HÁ MIỆNG nói lời không thật = LỪA DỐI → 詐欺 (cả hai chữ đều là "lừa": TRÁ + KHI).',
    tu: [
      { w: '{詐欺|さぎ}', ro: 'sagi', vi: 'lừa đảo (N2)' },
      { w: '{欺|あざむ}く', ro: 'azamuku', vi: 'lừa gạt (văn viết — N1)' },
    ],
  },
  '偽': {
    hv: 'NGUỴ', nghia: 'giả, giả mạo', en: 'false / fake',
    on: ['ギ'], kun: ['にせ', 'いつわ・る'],
    nho: 'Bên trái 亻 (người), bên phải 為 (làm — phần gợi âm): thứ do NGƯỜI LÀM RA cho giống thật = GIẢ (NGUỴ) → 偽物 (đồ giả), 偽のサイト (trang web giả).',
    tu: [
      { w: '{偽物|にせもの}', ro: 'nisemono', vi: 'đồ giả (N2)' },
      { w: '{偽|にせ}', ro: 'nise', vi: 'giả (偽の～ / 偽札 — tiền giả)' },
      { w: '{偽|いつわ}る', ro: 'itsuwaru', vi: 'nói dối, giả mạo (N1)' },
      { w: '{偽造|ぎぞう}', ro: 'gizou', vi: 'làm giả (giấy tờ, tiền) (N1)' },
    ],
  },
  '漏': {
    hv: 'LẬU', nghia: 'rò rỉ, lọt ra', en: 'leak',
    on: ['ロウ'], kun: ['も・れる', 'も・らす', 'も・る'],
    nho: 'Bên trái 氵 (nước), bên phải 屚 (尸 mái nhà ＋ 雨 mưa): NƯỚC MƯA rỉ qua MÁI NHÀ = RÒ RỈ → 雨漏り (dột), 漏れる (rò rỉ — cả nước, ánh sáng lẫn THÔNG TIN).',
    tu: [
      { w: '{漏|も}れる', ro: 'moreru', vi: 'rò rỉ, bị lộ (N2)' },
      { w: '{漏|も}らす', ro: 'morasu', vi: 'làm lộ, để lọt (N2)' },
      { w: '{雨漏|あまも}り', ro: 'amamori', vi: 'mái dột (N1)' },
      { w: '{漏|ろう}えい', ro: 'rouei', vi: 'rò rỉ (thông tin) — văn tin tức' },
    ],
  },
  '侵': {
    hv: 'XÂM', nghia: 'xâm phạm, lấn vào', en: 'invade',
    on: ['シン'], kun: ['おか・す'],
    nho: 'Bên trái 亻 (người), bên phải hình bàn tay cầm chổi quét dần về phía trước: NGƯỜI tiến dần, lấn dần vào đất người khác = XÂM → 侵入 (xâm nhập), 侵害 (xâm hại).',
    tu: [
      { w: '{侵入|しんにゅう}', ro: 'shinnyuu', vi: 'xâm nhập (N2)' },
      { w: '{不正侵入|ふせいしんにゅう}', ro: 'fusei shinnyuu', vi: 'xâm nhập trái phép (hệ thống)' },
      { w: '{侵害|しんがい}', ro: 'shingai', vi: 'xâm hại (quyền lợi) (N1)' },
      { w: '{侵|おか}す', ro: 'okasu', vi: 'xâm phạm (N1)' },
    ],
  },
  '怪': {
    hv: 'QUÁI', nghia: 'lạ, kỳ quái, đáng ngờ', en: 'suspicious / strange',
    on: ['カイ'], kun: ['あや・しい', 'あや・しむ'],
    nho: 'Bên trái 忄 (lòng), bên phải 圣 (phần gợi âm カイ): trong LÒNG thấy có gì KỲ LẠ = QUÁI → 怪しい (đáng ngờ — Bài 31). Từ đặc biệt: 怪我 (けが — vết thương) đọc cả từ, không theo âm từng chữ.',
    tu: [
      { w: '{怪|あや}しい', ro: 'ayashii', vi: 'đáng ngờ, khả nghi (Bài 31)' },
      { w: '{怪|あや}しむ', ro: 'ayashimu', vi: 'nghi ngờ (N1)' },
      { w: '{怪我|けが}', ro: 'kega', vi: 'vết thương, bị thương (cách đọc đặc biệt)' },
      { w: '{怪談|かいだん}', ro: 'kaidan', vi: 'chuyện ma' },
    ],
  },
  '狙': {
    hv: 'THƯ', nghia: 'rình, nhắm vào', en: 'aim at',
    on: ['ソ'], kun: ['ねら・う'],
    nho: 'Bên trái 犭 (con thú), bên phải 且 (phần gợi âm ソ): con THÚ rình mồi, nhắm đúng một con = NHẮM, RÌNH → 狙う (nhắm vào), 狙い (mục tiêu, ý đồ).',
    tu: [
      { w: '{狙|ねら}う', ro: 'nerau', vi: 'nhắm vào, rình (N2)' },
      { w: '{狙|ねら}い', ro: 'nerai', vi: 'mục đích, ý đồ (N2)' },
      { w: '{狙|ねら}われる', ro: 'nerawareru', vi: 'bị nhắm tới' },
    ],
  },
  '脅': {
    hv: 'HIẾP', nghia: 'doạ, uy hiếp', en: 'threaten',
    on: ['キョウ'], kun: ['おど・す', 'おびや・かす'],
    nho: 'Phía trên 劦 (ba chữ 力 — dồn sức), phía dưới 月 (thịt, thân người): DỒN SỨC ép vào THÂN người = UY HIẾP, DOẠ → 脅す (doạ), 脅威 (mối đe doạ).',
    tu: [
      { w: '{脅威|きょうい}', ro: 'kyoui', vi: 'mối đe doạ (N1)' },
      { w: '{脅|おど}す', ro: 'odosu', vi: 'đe doạ, doạ nạt (N2)' },
      { w: '{脅|おびや}かす', ro: 'obiyakasu', vi: 'đe doạ (sự an toàn, cuộc sống) (N1)' },
      { w: '{脅迫|きょうはく}', ro: 'kyouhaku', vi: 'khủng bố tinh thần, cưỡng ép bằng lời doạ' },
    ],
  },
  '威': {
    hv: 'UY', nghia: 'uy lực, oai', en: 'might / dignity',
    on: ['イ'], kun: [],
    nho: '戌 (cây binh khí) trùm lên 女 (người phụ nữ): giơ BINH KHÍ doạ người = UY (sức mạnh khiến người khác sợ) → 脅威 (mối đe doạ), 威力 (uy lực).',
    tu: [
      { w: '{脅威|きょうい}', ro: 'kyoui', vi: 'mối đe doạ (N1)' },
      { w: '{威力|いりょく}', ro: 'iryoku', vi: 'uy lực, sức công phá (N1)' },
      { w: '{権威|けんい}', ro: 'ken\'i', vi: 'uy quyền; người có uy tín chuyên môn (N1)' },
    ],
  },
  '菌': {
    hv: 'KHUẨN', nghia: 'vi khuẩn, nấm', en: 'germ / bacteria',
    on: ['キン'], kun: [],
    nho: 'Phía trên 艹 (cây cỏ), phía dưới 囷 (kho lúa tròn — phần gợi âm キン): loài "cây" nhỏ mọc trong kho lúa ẩm = NẤM, KHUẨN → 細菌 (vi khuẩn), 除菌 (diệt khuẩn).',
    tu: [
      { w: '{細菌|さいきん}', ro: 'saikin', vi: 'vi khuẩn (N2)' },
      { w: '{除菌|じょきん}', ro: 'jokin', vi: 'diệt khuẩn (除菌シート — khăn diệt khuẩn)' },
      { w: '{雑菌|ざっきん}', ro: 'zakkin', vi: 'vi khuẩn tạp (gây bẩn, mùi)' },
      { w: '{菌|きん}', ro: 'kin', vi: 'vi khuẩn' },
    ],
  },
  '炎': {
    hv: 'VIÊM', nghia: 'ngọn lửa; viêm', en: 'flame / inflammation',
    on: ['エン'], kun: ['ほのお'],
    nho: 'Hai chữ 火 (lửa) chồng lên nhau: LỬA chồng LỬA = NGỌN LỬA bốc cao; trong y học là chỗ "nóng đỏ như lửa" = VIÊM → 炎症 (viêm). Mạng xã hội: 炎上 = bài đăng "bốc cháy" vì bị chửi tới tấp.',
    tu: [
      { w: '{炎|ほのお}', ro: 'honoo', vi: 'ngọn lửa (N2)' },
      { w: '{炎症|えんしょう}', ro: 'enshou', vi: 'chứng viêm (N1)' },
      { w: '{肺炎|はいえん}', ro: 'haien', vi: 'viêm phổi' },
      { w: '{炎上|えんじょう}', ro: 'enjou', vi: 'bốc cháy; (mạng) bị ném đá dữ dội' },
    ],
  },
  '免': {
    hv: 'MIỄN', nghia: 'miễn, thoát khỏi', en: 'exemption / escape',
    on: ['メン'], kun: ['まぬか・れる'],
    nho: 'Hình một người đang CHUI RA khỏi chỗ chật hẹp (phần trên là cái mũ, dưới là đôi chân 儿): THOÁT RA được = MIỄN → 免許 (giấy phép — được "miễn cấm"), 免疫 (miễn dịch — thoát được bệnh dịch).',
    tu: [
      { w: '{免疫|めんえき}', ro: 'men\'eki', vi: 'miễn dịch (N1)' },
      { w: '{免許|めんきょ}', ro: 'menkyo', vi: 'giấy phép (運転免許 — bằng lái) (N2)' },
      { w: '{免税|めんぜい}', ro: 'menzei', vi: 'miễn thuế (N1)' },
      { w: '{免除|めんじょ}', ro: 'menjo', vi: 'miễn (học phí…) (N1)' },
    ],
  },
  '疫': {
    hv: 'DỊCH', nghia: 'bệnh dịch', en: 'epidemic',
    on: ['エキ', 'ヤク'], kun: [],
    nho: 'Bộ 疒 (bệnh tật — người nằm trên giường bệnh) bọc 殳 (tay cầm gậy quất — như trong 役): BỆNH lan khắp nơi như bị roi QUẤT tới tấp = DỊCH → 免疫 (miễn dịch), 検疫 (kiểm dịch).',
    tu: [
      { w: '{免疫|めんえき}', ro: 'men\'eki', vi: 'miễn dịch (N1)' },
      { w: '{免疫力|めんえきりょく}', ro: 'men\'ekiryoku', vi: 'sức đề kháng' },
      { w: '{検疫|けんえき}', ro: 'ken\'eki', vi: 'kiểm dịch (ở sân bay, cảng)' },
      { w: '{疫病|えきびょう}', ro: 'ekibyou', vi: 'bệnh dịch (văn viết)' },
    ],
  },
  '株': {
    hv: 'CHU', nghia: 'gốc cây; cổ phiếu', en: 'stock / share',
    on: [], kun: ['かぶ'],
    nho: 'Bên trái 木 (cây), bên phải 朱 (màu đỏ — phần gợi âm シュ): phần GỐC CÂY còn lại sau khi chặt = 株. Từ "cái gốc chia phần" mà ra nghĩa CỔ PHẦN → 株 (cổ phiếu), 株価 (giá cổ phiếu), 株式会社 (công ty cổ phần).',
    tu: [
      { w: '{株|かぶ}', ro: 'kabu', vi: 'cổ phiếu; gốc cây (N2)' },
      { w: '{株価|かぶか}', ro: 'kabuka', vi: 'giá cổ phiếu (N1)' },
      { w: '{株式会社|かぶしきがいしゃ}', ro: 'kabushiki gaisha', vi: 'công ty cổ phần' },
      { w: '{株主|かぶぬし}', ro: 'kabunushi', vi: 'cổ đông (N1)' },
    ],
  },
  '損': {
    hv: 'TỔN', nghia: 'lỗ, tổn thất, hư hại', en: 'loss / damage',
    on: ['ソン'], kun: ['そこ・なう', 'そこ・ねる'],
    nho: 'Bên trái 扌 (tay), bên phải 員 (số người, số lượng — phần gợi âm): TAY làm cho SỐ LƯỢNG bớt đi = TỔN (lỗ) → 損 (lỗ — Bài 28), 損害 (thiệt hại), 損失 (tổn thất).',
    tu: [
      { w: '{損|そん}', ro: 'son', vi: 'lỗ, thiệt (Bài 28)' },
      { w: '{損失|そんしつ}', ro: 'sonshitsu', vi: 'tổn thất (N1)' },
      { w: '{損害|そんがい}', ro: 'songai', vi: 'thiệt hại (về tiền, tài sản) (N2)' },
      { w: '{見損|みそこ}なう', ro: 'misokonau', vi: 'xem nhầm người; thất vọng về ai' },
    ],
  },
  '益': {
    hv: 'ÍCH', nghia: 'lợi, có ích', en: 'benefit / profit',
    on: ['エキ', 'ヤク'], kun: [],
    nho: 'Phía trên là chữ 水 (nước) nằm ngang, phía dưới 皿 (cái chậu): NƯỚC TRÀN ĐẦY CHẬU = dư ra, có LỢI = ÍCH → 利益 (lợi nhuận), 有益 (có ích).',
    tu: [
      { w: '{利益|りえき}', ro: 'rieki', vi: 'lợi nhuận, lợi ích (N2)' },
      { w: '{有益|ゆうえき}', ro: 'yuueki', vi: 'có ích (N1)' },
      { w: '{収益|しゅうえき}', ro: 'shuueki', vi: 'doanh thu, thu nhập (N1)' },
      { w: 'ご{利益|りやく}', ro: 'goriyaku', vi: 'phước lành (của thần, Phật — đọc やく)' },
    ],
  },
  '慎': {
    hv: 'THẬN', nghia: 'thận trọng, giữ gìn', en: 'careful / discreet',
    on: ['シン'], kun: ['つつし・む'],
    nho: 'Bên trái 忄 (lòng), bên phải 真 (thật — phần gợi âm シン): LÒNG luôn giữ cho THẬT, không hấp tấp = THẬN TRỌNG → 慎重 (thận trọng), 慎む (giữ gìn, kiêng).',
    tu: [
      { w: '{慎重|しんちょう}', ro: 'shinchou', vi: 'thận trọng (N2)' },
      { w: '{慎|つつし}む', ro: 'tsutsushimu', vi: 'giữ gìn, kiêng (言葉を慎む — giữ lời) (N1)' },
    ],
  },
  '暴': {
    hv: 'BẠO', nghia: 'mạnh bạo, dữ dội; phơi bày', en: 'violent',
    on: ['ボウ', 'バク'], kun: ['あば・れる', 'あば・く'],
    nho: 'Phía trên 日 (mặt trời), giữa 共 (hai tay nâng), dưới là chữ 水 biến thể (gạo): HAI TAY phơi gạo dưới NẮNG GẮT — nắng dữ dội = BẠO → 暴力 (bạo lực), 暴落 (giá rớt dữ dội), 暴れる (quậy phá).',
    tu: [
      { w: '{暴落|ぼうらく}', ro: 'bouraku', vi: '(giá) rớt mạnh (N1)' },
      { w: '{暴力|ぼうりょく}', ro: 'bouryoku', vi: 'bạo lực (N2)' },
      { w: '{乱暴|らんぼう}', ro: 'ranbou', vi: 'thô bạo (N2)' },
      { w: '{暴|あば}れる', ro: 'abareru', vi: 'quậy phá, vùng vẫy (N2)' },
      { w: '{暴風|ぼうふう}', ro: 'boufuu', vi: 'gió bão (暴風警報)' },
    ],
  },
};
