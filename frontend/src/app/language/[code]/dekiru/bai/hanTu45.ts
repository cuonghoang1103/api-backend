/**
 * Chữ Hán MỚI của Bài 45 (義務と感情 — Bổn phận & cảm xúc · tiếp sau sách, cấp N2) cho thẻ chữ Hán — cùng định dạng hanTu.ts.
 * 24 chữ: 従 拒 罰 償 促 徹 恩 怠 黙 抑 興 奮 激 憧 羨 憎 恨 屈 飽 胸 焦 堪 誇 慰 — bảng `b45-han-tu` trong bai45.ts.
 * Cấp theo các bảng tham khảo phổ biến (JLPT không công bố danh sách chữ chính thức): phần lớn N2; 従・胸 nhiều bảng xếp N3;
 * 償 促 徹 恩 憧 羨 恨 堪 誇 nhiều bảng xếp N1 nhưng TỪ chứa chúng (弁償・催促・徹夜・恩返し・憧れる・羨ましい・恨む・たまらない・誇り)
 * là từ N2 rất hay gặp. Không trùng hanTu.ts, hanTu16–44.ts, hanTuTiep.ts, hanLop.ts và các bảng chữ Hán Bài 1–44 (kiểm 09/11 bằng
 * script — Bài 43 = 総 劣 微 妙 星 雰 盛 稿 濃 薄 演 劇 俳 監 督 脚 賞 審 豊 富 迫 鋭 珍 熟 · Bài 44 = 第 挙 句 討 渉 妥 功 粘 再 競 涙 泡 崩
 * 奇 跡 看 舞 捜 索 独 腕 伸).
 * Cách nhớ: theo cấu tạo chữ (phần chỉ nghĩa + phần gợi âm của chữ hình thanh ghi rõ). Từ đi chung ưu tiên từ dùng trong bai45.ts
 * và từ đã học ở bài trước (興味 N4, 徹夜 Bài 26, 怠ける Bài 28, 焦る Bài 34, 退屈 Bài 43, 催 Bài 39, 賞 Bài 43, 童 Bài 42).
 * On / Kun theo bảng thường dụng (常用): 罰 徹 恩 屈 chỉ có âm On (罰 có hai On バツ・バチ); 従 có On ジュウ・ショウ・ジュ (ショウ, ジュ hiếm)
 * và Kun したが・う／したが・える; 興 có On コウ・キョウ và Kun おこ・る／おこ・す; 怠 có hai Kun おこた・る／なま・ける; 憎 có bốn Kun
 * にく・む／にく・い／にく・らしい／にく・しみ; 焦 có bốn Kun こ・げる／こ・がす／こ・がれる／あせ・る; 胸 có Kun むね／むな (むな trong
 * 胸騒ぎ); 堪 có On カン và Kun た・える — 堪能 đọc たんのう (cách đọc quen dùng), たまらない thường viết bằng かな.
 * Tệp chỉ có `import type` — tải chậm như hanTu.ts.
 */
import type { HanTu } from '@/components/sach-hoc/kanji';

export const HAN_TU_45: Record<string, HanTu> = {
  '従': {
    hv: 'TÙNG', nghia: 'đi theo, tuân theo', en: 'follow / obey',
    on: ['ジュウ', 'ショウ', 'ジュ'], kun: ['したが・う', 'したが・える'],
    nho: 'Bên trái 彳 (bước chân, đường đi); bên phải là hai người nối nhau (từ 从, viết gọn thành ソ + 一) đứng trên 止 (bàn chân): người này BƯỚC THEO SAU người kia = TÙNG (tuân theo, phục tùng). Cùng 彳 với 待・役・彼 — chữ có 彳 hay liên quan "đi, làm".',
    tu: [
      { w: '{従|したが}う', ro: 'shitagau', vi: 'tuân theo, làm theo (N2)' },
      { w: '{従業員|じゅうぎょういん}', ro: 'juugyouin', vi: 'nhân viên (của công ty, cửa hàng — N2)' },
      { w: '{服従|ふくじゅう}', ro: 'fukujuu', vi: 'phục tùng (N1)' },
      { w: '{従来|じゅうらい}', ro: 'juurai', vi: 'từ trước tới nay, kiểu cũ (N2)' },
    ],
  },
  '拒': {
    hv: 'CỰ', nghia: 'cự tuyệt, từ chối', en: 'refuse / reject',
    on: ['キョ'], kun: ['こば・む'],
    nho: 'Bên trái 扌 (tay), bên phải 巨 (to lớn, gợi âm キョ): giơ BÀN TAY TO ra chặn lại = CỰ tuyệt. Cùng 巨 với 距 (きょ — khoảng cách: 距離) — 拒 dùng tay, 距 dùng chân (𧾷).',
    tu: [
      { w: '{拒否|きょひ}', ro: 'kyohi', vi: 'từ chối, cự tuyệt (N2)' },
      { w: '{拒|こば}む', ro: 'kobamu', vi: 'khước từ (văn viết — N1)' },
      { w: '{拒絶|きょぜつ}', ro: 'kyozetsu', vi: 'cự tuyệt dứt khoát (N1)' },
    ],
  },
  '罰': {
    hv: 'PHẠT', nghia: 'hình phạt, phạt', en: 'penalty / punishment',
    on: ['バツ', 'バチ'], kun: [],
    nho: 'Trên là 罒 (cái lưới), dưới trái 言 (lời nói), dưới phải 刂 (con dao): bắt kẻ có lỗi vào LƯỚI, kể tội bằng LỜI, xử bằng DAO = PHẠT. On バチ chỉ gặp trong cụm 罰が当たる (bị trời phạt).',
    tu: [
      { w: '{罰金|ばっきん}', ro: 'bakkin', vi: 'tiền phạt (N2)' },
      { w: '{罰|ばつ}', ro: 'batsu', vi: 'hình phạt (N2)' },
      { w: '{罰則|ばっそく}', ro: 'bassoku', vi: 'điều khoản xử phạt (N1)' },
      { w: '{罰|ばち}が{当|あ}たる', ro: 'bachi ga ataru', vi: 'bị trời phạt, bị quả báo' },
    ],
  },
  '償': {
    hv: 'THƯỜNG', nghia: 'đền bù, bồi thường', en: 'compensate / make amends',
    on: ['ショウ'], kun: ['つぐな・う'],
    nho: 'Bên trái 亻 (người), bên phải 賞 (thưởng — Bài 43, gợi âm ショウ; dưới có 貝 = tiền, của cải): NGƯỜI đem CỦA trả lại cho người bị thiệt = BỒI THƯỜNG. Nhớ cặp: 賞 (thưởng — cho thêm) ↔ 償 (thường — trả lại).',
    tu: [
      { w: '{弁償|べんしょう}', ro: 'benshou', vi: 'đền (đồ làm hỏng, làm mất — N2)' },
      { w: '{補償|ほしょう}', ro: 'hoshou', vi: 'bồi thường thiệt hại (N1)' },
      { w: '{償|つぐな}う', ro: 'tsugunau', vi: 'chuộc lỗi, đền bù (N1)' },
      { w: '{賠償|ばいしょう}', ro: 'baishou', vi: 'bồi thường (pháp lý — N1)' },
    ],
  },
  '促': {
    hv: 'XÚC', nghia: 'thúc giục, thúc đẩy', en: 'urge / prompt',
    on: ['ソク'], kun: ['うなが・す'],
    nho: 'Bên trái 亻 (người), bên phải 足 (chân, gợi âm ソク): NGƯỜI giục ĐÔI CHÂN bước nhanh lên = XÚC (thúc giục). Đi với 催 (Bài 39): 催促 = giục (trả tiền, trả lời).',
    tu: [
      { w: '{催促|さいそく}', ro: 'saisoku', vi: 'giục, thúc (N2)' },
      { w: '{促|うなが}す', ro: 'unagasu', vi: 'thúc giục, khuyến khích (N1)' },
      { w: '{促進|そくしん}', ro: 'sokushin', vi: 'thúc đẩy (N1)' },
    ],
  },
  '徹': {
    hv: 'TRIỆT', nghia: 'xuyên suốt, triệt để', en: 'thorough / through',
    on: ['テツ'], kun: [],
    nho: 'Bên trái 彳 (đường đi), giữa 育 (nuôi lớn), phải 攵 (tay cầm gậy gõ): đi một mạch, gõ cho XUYÊN QUA tới cuối = TRIỆT. 徹夜 = thức xuyên đêm (Bài 26 — nay học chữ).',
    tu: [
      { w: '{徹夜|てつや}', ro: 'tetsuya', vi: 'thức trắng đêm (N2)' },
      { w: '{徹底|てってい}', ro: 'tettei', vi: 'triệt để (N1)' },
      { w: '{徹底的|てっていてき}', ro: 'tetteiteki', vi: 'một cách triệt để (N1)' },
    ],
  },
  '恩': {
    hv: 'ÂN', nghia: 'ơn, ân huệ', en: 'favor / kindness owed',
    on: ['オン'], kun: [],
    nho: 'Trên là 因 (nguyên nhân, gợi âm), dưới là 心 (lòng): trong LÒNG luôn nhớ NGUYÊN NHÂN mình có hôm nay (người đã giúp mình) = ÂN, ơn nghĩa. Đi đôi với 義理 — "ơn phải trả".',
    tu: [
      { w: '{恩|おん}', ro: 'on', vi: 'ơn (N2)' },
      { w: '{恩返|おんがえ}し', ro: 'ongaeshi', vi: 'báo ơn, đền ơn (N2)' },
      { w: '{恩人|おんじん}', ro: 'onjin', vi: 'ân nhân (N1)' },
      { w: '{恩師|おんし}', ro: 'onshi', vi: 'ân sư, người thầy mình mang ơn (N1)' },
    ],
  },
  '怠': {
    hv: 'ĐÃI', nghia: 'lười, chểnh mảng', en: 'lazy / neglect',
    on: ['タイ'], kun: ['おこた・る', 'なま・ける'],
    nho: 'Trên là 台 (bệ, gợi âm タイ), dưới là 心 (lòng): LÒNG cứ NGỒI LÌ trên bệ, không muốn đứng dậy làm = lười. Hai Kun: なまける (lười — Bài 28, nói thường) · おこたる (lơ là bổn phận — văn viết: 義務を怠る).',
    tu: [
      { w: '{怠|なま}ける', ro: 'namakeru', vi: 'lười biếng (Bài 28)' },
      { w: '{怠|おこた}る', ro: 'okotaru', vi: 'lơ là, sao nhãng (bổn phận — N1)' },
      { w: '{怠慢|たいまん}', ro: 'taiman', vi: 'chểnh mảng, tắc trách (N1)' },
    ],
  },
  '黙': {
    hv: 'MẶC', nghia: 'im lặng', en: 'silent',
    on: ['モク'], kun: ['だま・る'],
    nho: 'Bên trái 黒 (đen), bên phải 犬 (con chó): CON CHÓ ĐEN nằm im trong bóng tối, không sủa tiếng nào = IM LẶNG. 黙る = im · 黙っていられない = không thể im được (gần mẫu ずにはいられない của bài).',
    tu: [
      { w: '{黙|だま}る', ro: 'damaru', vi: 'im lặng, không nói (N2)' },
      { w: '{沈黙|ちんもく}', ro: 'chinmoku', vi: 'sự im lặng (N2)' },
      { w: '{黙々|もくもく}と', ro: 'mokumoku to', vi: 'lặng lẽ (làm việc — N1)' },
    ],
  },
  '抑': {
    hv: 'ỨC', nghia: 'đè xuống, kìm lại', en: 'suppress / hold down',
    on: ['ヨク'], kun: ['おさ・える'],
    nho: 'Bên trái 扌 (tay), bên phải 卬 (người cúi xuống — như con dấu ấn xuống): dùng TAY ẤN XUỐNG = kìm nén. 感情を抑える = kìm cảm xúc · 費用を抑える = giữ chi phí thấp.',
    tu: [
      { w: '{抑|おさ}える', ro: 'osaeru', vi: 'kìm nén; giữ ở mức thấp (N2)' },
      { w: '{抑制|よくせい}', ro: 'yokusei', vi: 'ức chế, kiềm chế (N1)' },
      { w: '{抑圧|よくあつ}', ro: 'yokuatsu', vi: 'đàn áp (N1)' },
    ],
  },
  '興': {
    hv: 'HƯNG / HỨNG', nghia: 'nổi lên, hưng thịnh; hứng thú', en: 'rise / interest',
    on: ['コウ', 'キョウ'], kun: ['おこ・る', 'おこ・す'],
    nho: 'Bốn bàn tay (trên hai, dưới hai — hình 舁) cùng NÂNG một vật (同 ở giữa) lên cao = làm NỔI LÊN. Hai âm: キョウ khi là "hứng" (興味) · コウ khi là "hưng / nổi lên" (興奮・復興). 興味 bạn dùng từ N4 — nay học chữ.',
    tu: [
      { w: '{興味|きょうみ}', ro: 'kyoumi', vi: 'hứng thú, quan tâm (N4)' },
      { w: '{興奮|こうふん}', ro: 'koufun', vi: 'phấn khích, hưng phấn (N2)' },
      { w: '{復興|ふっこう}', ro: 'fukkou', vi: 'phục hưng, tái thiết (N1)' },
      { w: '{興味深|きょうみぶか}い', ro: 'kyoumibukai', vi: 'rất thú vị (N2)' },
    ],
  },
  '奮': {
    hv: 'PHẤN', nghia: 'hăng lên, phấn chấn', en: 'rouse / be stirred',
    on: ['フン'], kun: ['ふる・う'],
    nho: 'Trên 大 (to), giữa 隹 (con chim), dưới 田 (ruộng): CON CHIM LỚN dang cánh bật lên khỏi RUỘNG = HĂNG LÊN, phấn chấn. Đi đôi với 興: 興奮 = hưng phấn.',
    tu: [
      { w: '{興奮|こうふん}', ro: 'koufun', vi: 'phấn khích (N2)' },
      { w: '{奮発|ふんぱつ}', ro: 'funpatsu', vi: 'chịu chi, mạnh tay (N1)' },
      { w: '{奮|ふる}って', ro: 'furutte', vi: 'hăng hái, nhiệt tình (thông báo: 奮ってご参加ください)' },
    ],
  },
  '激': {
    hv: 'KÍCH', nghia: 'mạnh, dữ dội; kích động', en: 'violent / intense',
    on: ['ゲキ'], kun: ['はげ・しい'],
    nho: 'Bên trái 氵 (nước), bên phải 敫 (白 + 方 + 攵 — gợi âm ゲキ): NƯỚC xô vào đá BẮN TUNG lên = dữ dội. 感激 = xúc động mạnh · 激しい = dữ dội.',
    tu: [
      { w: '{感激|かんげき}', ro: 'kangeki', vi: 'cảm kích, xúc động mạnh (N2)' },
      { w: '{激|はげ}しい', ro: 'hageshii', vi: 'dữ dội, mãnh liệt (N2)' },
      { w: '{刺激|しげき}', ro: 'shigeki', vi: 'kích thích (N2)' },
      { w: '{急激|きゅうげき}', ro: 'kyuugeki', vi: 'đột ngột, gấp (N2)' },
    ],
  },
  '憧': {
    hv: 'SUNG', nghia: 'khát khao, ngưỡng mộ', en: 'long for / admire',
    on: ['ショウ'], kun: ['あこが・れる'],
    nho: 'Bên trái 忄 (lòng), bên phải 童 (trẻ em — Bài 42): TẤM LÒNG như ĐỨA TRẺ ngước nhìn người lớn mà mơ "sau này mình cũng thế" = khát khao, ngưỡng mộ. On ショウ chỉ gặp trong 憧憬 (しょうけい — văn viết).',
    tu: [
      { w: '{憧|あこが}れる', ro: 'akogareru', vi: 'ngưỡng mộ, mơ ước được như (N2)' },
      { w: '{憧|あこが}れ', ro: 'akogare', vi: 'niềm mơ ước, thần tượng (N2)' },
      { w: '{憧|あこが}れの{仕事|しごと}', ro: 'akogare no shigoto', vi: 'công việc mơ ước' },
    ],
  },
  '羨': {
    hv: 'TIỆN', nghia: 'thèm muốn, ghen tị (nhẹ)', en: 'envy',
    on: ['セン'], kun: ['うらや・む', 'うらや・ましい'],
    nho: 'Trên là 羊 (con cừu — món ngon), dưới là 次 (gợi hình người há miệng chảy nước dãi): thấy THỊT CỪU người khác có mà CHẢY NƯỚC DÃI = thèm, ghen tị. 羨ましい = (thấy người ta có) mà thèm.',
    tu: [
      { w: '{羨|うらや}ましい', ro: 'urayamashii', vi: 'đáng ghen tị, thèm được như (N2)' },
      { w: '{羨|うらや}む', ro: 'urayamu', vi: 'ghen tị, thèm muốn (N1)' },
      { w: '{羨望|せんぼう}', ro: 'senbou', vi: 'sự thèm muốn (văn viết — N1)' },
    ],
  },
  '憎': {
    hv: 'TĂNG', nghia: 'ghét, căm ghét', en: 'hate',
    on: ['ゾウ'], kun: ['にく・む', 'にく・い', 'にく・らしい', 'にく・しみ'],
    nho: 'Bên trái 忄 (lòng), bên phải 曽 (chồng chất, gợi âm ゾウ): trong LÒNG điều khó chịu CHỒNG CHẤT mãi = căm ghét. Cùng 曽 với 増 (ぞう — tăng) và 層 (そう — tầng, Bài 42): 憎 có 忄 (lòng).',
    tu: [
      { w: '{憎|にく}い', ro: 'nikui', vi: 'đáng ghét (N2)' },
      { w: '{憎|にく}む', ro: 'nikumu', vi: 'căm ghét (N2)' },
      { w: '{憎|にく}しみ', ro: 'nikushimi', vi: 'lòng căm ghét (N2)' },
      { w: '{憎|にく}らしい', ro: 'nikurashii', vi: 'đáng ghét (nói cả đùa — N2)' },
    ],
  },
  '恨': {
    hv: 'HẬN', nghia: 'oán hận', en: 'grudge / resent',
    on: ['コン'], kun: ['うら・む', 'うら・めしい'],
    nho: 'Bên trái 忄 (lòng), bên phải 艮 (dừng lại, quay đầu nhìn — gợi âm コン): LÒNG cứ DỪNG LẠI ở chuyện cũ, quay đầu nhìn mãi = oán HẬN. Cùng 艮 với 根 (ね — rễ) và 限 (かぎる — Bài 42 mẫu に限って).',
    tu: [
      { w: '{恨|うら}む', ro: 'uramu', vi: 'oán, hận (N2)' },
      { w: '{恨|うら}み', ro: 'urami', vi: 'mối hận (N2)' },
      { w: '{痛恨|つうこん}', ro: 'tsuukon', vi: 'vô cùng đáng tiếc (痛恨のミス — N1)' },
    ],
  },
  '屈': {
    hv: 'KHUẤT', nghia: 'cong, khuất phục; bí bách', en: 'bend / yield',
    on: ['クツ'], kun: [],
    nho: 'Trên là 尸 (thân người khom xuống), dưới là 出 (ra): người phải KHOM MÌNH mới chui RA được chỗ chật = cong, bí bách. 退屈 (Bài 43) = "lui lại + bí bách" → chán, buồn tẻ. 理屈 = lý lẽ (hay mang nghĩa "lý sự").',
    tu: [
      { w: '{退屈|たいくつ}', ro: 'taikutsu', vi: 'chán, buồn tẻ (Bài 43)' },
      { w: '{理屈|りくつ}', ro: 'rikutsu', vi: 'lý lẽ, lý sự (N2)' },
      { w: '{窮屈|きゅうくつ}', ro: 'kyuukutsu', vi: 'chật chội, gò bó (N2)' },
    ],
  },
  '飽': {
    hv: 'BÃO', nghia: 'no, chán ngấy', en: 'be satiated / tired of',
    on: ['ホウ'], kun: ['あ・きる', 'あ・かす'],
    nho: 'Bên trái 飠 (ăn), bên phải 包 (gói, bọc — gợi âm ホウ): ĂN đến mức bụng căng như cái BỌC = no; no quá thì CHÁN. 飽きる = chán (vì lặp lại mãi) · 飽きっぽい = cả thèm chóng chán.',
    tu: [
      { w: '{飽|あ}きる', ro: 'akiru', vi: 'chán, ngán (N2)' },
      { w: '{飽|あ}きっぽい', ro: 'akippoi', vi: 'cả thèm chóng chán (N2)' },
      { w: '{飽和|ほうわ}', ro: 'houwa', vi: 'bão hoà (N1)' },
    ],
  },
  '胸': {
    hv: 'HUNG', nghia: 'ngực; lòng', en: 'chest / heart',
    on: ['キョウ'], kun: ['むね', 'むな'],
    nho: 'Bên trái 月 (thịt — bộ phận cơ thể), bên phải 匈 (gợi âm キョウ; 勹 ôm lấy 凶): phần THÂN ôm lấy tim phổi = NGỰC. Người Nhật nói cảm xúc "ở ngực": 胸がいっぱい (nghẹn ngào), 胸が痛む (đau lòng), 胸がどきどきする.',
    tu: [
      { w: '{胸|むね}', ro: 'mune', vi: 'ngực; lòng (N3)' },
      { w: '{胸|むね}がいっぱい', ro: 'mune ga ippai', vi: 'nghẹn ngào, xúc động (N2)' },
      { w: '{度胸|どきょう}', ro: 'dokyou', vi: 'gan dạ, can đảm (N1)' },
      { w: '{胸騒|むなさわ}ぎ', ro: 'munasawagi', vi: 'linh cảm bất an (N1)' },
    ],
  },
  '焦': {
    hv: 'TIÊU', nghia: 'cháy xém; sốt ruột', en: 'scorch / be impatient',
    on: ['ショウ'], kun: ['こ・げる', 'こ・がす', 'こ・がれる', 'あせ・る'],
    nho: 'Trên là 隹 (con chim), dưới là 灬 (lửa): CHIM nướng trên LỬA — để lâu là CHÁY XÉM; người đứng nướng thì SỐT RUỘT. Hai nghĩa đời thường: 焦げる (cháy khét) · 焦る (cuống, sốt ruột — Bài 34).',
    tu: [
      { w: '{焦|あせ}る', ro: 'aseru', vi: 'sốt ruột, cuống (Bài 34)' },
      { w: '{焦|こ}げる', ro: 'kogeru', vi: 'bị cháy, khét (N2)' },
      { w: '{焦点|しょうてん}', ro: 'shouten', vi: 'tiêu điểm (N2)' },
    ],
  },
  '堪': {
    hv: 'KHAM', nghia: 'chịu đựng, kham nổi', en: 'endure / bear',
    on: ['カン'], kun: ['た・える'],
    nho: 'Bên trái 土 (đất), bên phải 甚 (rất, quá mức — gợi âm カン): như MẶT ĐẤT gánh được sức nặng QUÁ MỨC = chịu đựng (kham nhẫn). たまらない ("không chịu nổi" — mẫu của bài) vốn là 堪らない, nhưng nay thường viết bằng かな. 堪能 đọc **たんのう** (thưởng thức trọn vẹn; giỏi — cách đọc đặc biệt).',
    tu: [
      { w: '{堪|た}える', ro: 'taeru', vi: 'chịu đựng (văn viết; thường viết 耐える — N1)' },
      { w: '{堪|たま}らない', ro: 'tamaranai', vi: 'không chịu nổi (thường viết たまらない — N2)' },
      { w: '{堪能|たんのう}', ro: 'tannou', vi: 'thưởng thức thoả thích; thông thạo (N1)' },
    ],
  },
  '誇': {
    hv: 'KHOA', nghia: 'tự hào; khoe, phóng đại', en: 'pride / boast',
    on: ['コ'], kun: ['ほこ・る'],
    nho: 'Bên trái 言 (lời nói), bên phải 夸 (to lớn, phóng to — gợi âm コ): LỜI NÓI PHÓNG TO về mình = khoe, tự hào. Ý tốt: 誇り (niềm tự hào); ý xấu: 誇張 (khoa trương, nói quá).',
    tu: [
      { w: '{誇|ほこ}り', ro: 'hokori', vi: 'niềm tự hào (N2)' },
      { w: '{誇|ほこ}らしい', ro: 'hokorashii', vi: 'tự hào, hãnh diện (N2)' },
      { w: '{誇|ほこ}る', ro: 'hokoru', vi: 'tự hào về, khoe (N2)' },
      { w: '{誇張|こちょう}', ro: 'kochou', vi: 'khoa trương, phóng đại (N1)' },
    ],
  },
  '慰': {
    hv: 'ÚY', nghia: 'an ủi', en: 'console / comfort',
    on: ['イ'], kun: ['なぐさ・める', 'なぐさ・む'],
    nho: 'Trên là 尉 (cái bàn là — 尸 + 示 + 寸, gợi âm イ), dưới là 心 (lòng): như BÀN LÀ ấm áp vuốt phẳng nếp nhăn trong LÒNG = an ủi. 慰める = an ủi người đang buồn.',
    tu: [
      { w: '{慰|なぐさ}める', ro: 'nagusameru', vi: 'an ủi (N2)' },
      { w: '{慰|なぐさ}め', ro: 'nagusame', vi: 'sự an ủi (N2)' },
      { w: '{慰謝料|いしゃりょう}', ro: 'isharyou', vi: 'tiền bồi thường tổn thất tinh thần (N1)' },
    ],
  },
};
