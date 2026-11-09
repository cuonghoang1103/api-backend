/**
 * Chữ Hán MỚI của Bài 47 (決意 — Quyết tâm · tiếp sau sách, cấp N2) cho thẻ chữ Hán — cùng định dạng hanTu.ts.
 * 23 chữ: 悟 誓 諦 貫 勇 敢 尽 践 遂 肝 揮 筋 唯 剣 根 克 忍 闘 鍛 宣 叶 壁 維 — bảng `b47-han-tu` trong bai47.ts.
 * Cấp theo các bảng tham khảo phổ biến (JLPT không công bố danh sách chữ chính thức): 勇 根 壁 nhiều bảng xếp N3–N2; 誓 筋 剣 宣 揮
 * 肝 維 闘 phần lớn bảng xếp N2; 悟 諦 貫 敢 尽 践 遂 唯 克 忍 鍛 叶 nhiều bảng xếp N1 nhưng TỪ chứa chúng (覚悟・諦める・貫く・勇敢・
 * 尽くす・実践・やり遂げる・唯一・克服・忍耐・鍛える・夢が叶う) là từ N2 rất hay gặp. Không trùng hanTu.ts, hanTu16–46.ts, hanTuTiep.ts,
 * hanLop.ts và các bảng chữ Hán Bài 1–46 (kiểm 09/11 bằng script — 1.086 chữ đã dạy, gồm Bài 43 = 総 劣 微 妙 星 雰 盛 稿 濃 薄 演 劇 俳 監
 * 督 脚 賞 審 豊 富 迫 鋭 珍 熟 · Bài 44 = 第 挙 句 討 渉 妥 功 粘 再 競 涙 泡 崩 奇 跡 看 舞 捜 索 独 腕 伸 · Bài 45 = 従 拒 罰 償 促 徹 恩 怠 黙 抑
 * 興 奮 激 憧 羨 憎 恨 屈 飽 胸 焦 堪 誇 慰 · Bài 46 = 災 津 波 避 揺 噴 詐 欺 偽 漏 侵 怪 狙 脅 威 菌 炎 免 疫 株 損 益 慎 暴).
 * Cách nhớ: theo cấu tạo chữ (phần chỉ nghĩa + phần gợi âm của chữ hình thanh ghi rõ). Từ đi chung ưu tiên từ dùng trong bai47.ts và từ
 * đã học ở bài trước (諦める Bài 21, 筋肉・筋トレ・鍛える Bài 29, 真剣 Bài 28, 壁 Bài 18).
 * On / Kun theo bảng thường dụng (常用): 践 揮 克 宣 維 chỉ có âm On; 敢 chỉ có On カン (あえて = 敢えて là cách viết ngoài bảng, thường viết
 * かな); 遂 có Kun と・げる (ついに = 遂に là cách đọc ngoài bảng); 叶 chỉ có Kun かな・う (thêm vào bảng năm 2010, không có âm On trong bảng);
 * 唯 có On ユイ・イ; 尽 có Kun つ・くす／つ・きる／つ・かす; 忍 có Kun しの・ぶ／しの・ばせる; 剣 có Kun つるぎ.
 * Tệp chỉ có `import type` — tải chậm như hanTu.ts.
 */
import type { HanTu } from '@/components/sach-hoc/kanji';

export const HAN_TU_47: Record<string, HanTu> = {
  '悟': {
    hv: 'NGỘ', nghia: 'hiểu ra, tỉnh ngộ; sẵn lòng chấp nhận (trong 覚悟)', en: 'realize / resolve',
    on: ['ゴ'], kun: ['さと・る'],
    nho: 'Trái là 忄 (trái tim, tấm lòng), phải là 吾 (ta, gợi âm ゴ): TRONG LÒNG TA bỗng sáng ra = NGỘ (giác ngộ). 覚悟 = "tỉnh ra và hiểu rõ" → biết trước điều khó mà vẫn sẵn sàng đón nhận = quyết tâm, chuẩn bị tinh thần.',
    tu: [
      { w: '{覚悟|かくご}', ro: 'kakugo', vi: 'sự chuẩn bị tinh thần, quyết tâm đón nhận (N2 — Bài 47)' },
      { w: '{覚悟|かくご}を{決|き}める', ro: 'kakugo o kimeru', vi: 'hạ quyết tâm, chấp nhận mọi hậu quả' },
      { w: '{悟|さと}る', ro: 'satoru', vi: 'nhận ra, ngộ ra (N1)' },
      { w: '{悟|さと}り', ro: 'satori', vi: 'sự giác ngộ' },
    ],
  },
  '誓': {
    hv: 'THỆ', nghia: 'thề, hứa chắc', en: 'vow / swear',
    on: ['セイ'], kun: ['ちか・う'],
    nho: 'Trên là 折 (bẻ gãy, gợi âm セツ→セイ), dưới là 言 (lời nói): LỜI NÓI DỨT KHOÁT như bẻ gãy một cành cây, không rút lại được = THỆ (lời thề). ⚠ Đừng nhầm với 哲 (てつ — 哲学: 折 + 口).',
    tu: [
      { w: '{誓|ちか}う', ro: 'chikau', vi: 'thề, nguyện (N2 — Bài 47)' },
      { w: '{誓|ちか}い', ro: 'chikai', vi: 'lời thề, lời nguyện' },
      { w: '{宣誓|せんせい}', ro: 'sensei', vi: 'tuyên thệ (lễ khai mạc thể thao — N1)' },
    ],
  },
  '諦': {
    hv: 'ĐẾ', nghia: 'bỏ cuộc, buông (tiếng Nhật); xét rõ, chân lý (gốc Hán)', en: 'give up',
    on: ['テイ'], kun: ['あきら・める'],
    nho: 'Trái là 言 (lời), phải là 帝 (vua, gợi âm テイ): gốc Hán là "XÉT RÕ đến tận lẽ thật". Tiếng Nhật dùng cho あきらめる — "nhìn rõ là không được nữa rồi buông tay". Chữ bạn đã gặp trong từ 諦める (Bài 21), nay học hẳn chữ.',
    tu: [
      { w: '{諦|あきら}める', ro: 'akirameru', vi: 'bỏ cuộc, từ bỏ (Bài 21)' },
      { w: '{諦|あきら}め', ro: 'akirame', vi: 'sự buông bỏ, cam chịu' },
      { w: '{諦|あきら}めない', ro: 'akiramenai', vi: 'không bỏ cuộc' },
    ],
  },
  '貫': {
    hv: 'QUÁN', nghia: 'xuyên qua, xuyên suốt; giữ trọn', en: 'pierce / carry through',
    on: ['カン'], kun: ['つらぬ・く'],
    nho: 'Trên là 毌 (một thanh xuyên qua hai vật), dưới là 貝 (vỏ sò — tiền thời xưa): XÂU TIỀN BẰNG MỘT SỢI DÂY xuyên từ đầu tới cuối = QUÁN → 貫く (giữ một ý từ đầu đến cuối), 一貫 (nhất quán). ⚠ 慣 (なれる — 慣れる đã học) có thêm 忄.',
    tu: [
      { w: '{貫|つらぬ}く', ro: 'tsuranuku', vi: 'xuyên qua; giữ trọn (ý chí, lập trường) (N1 — Bài 47)' },
      { w: '{一貫|いっかん}して', ro: 'ikkan shite', vi: 'nhất quán, trước sau như một (N1)' },
      { w: '{初志貫徹|しょしかんてつ}', ro: 'shoshi kantetsu', vi: 'giữ trọn chí hướng ban đầu (thành ngữ)' },
    ],
  },
  '勇': {
    hv: 'DŨNG', nghia: 'mạnh dạn, can đảm', en: 'courage',
    on: ['ユウ'], kun: ['いさ・む'],
    nho: 'Trên là 甬 (dòng chảy dâng trào, gợi âm ヨウ→ユウ), dưới là 力 (sức): SỨC MẠNH DÂNG TRÀO từ bên trong = DŨNG → 勇気 (dũng khí). ⚠ Dưới là 力, không phải 男 (おとこ — 田 + 力).',
    tu: [
      { w: '{勇気|ゆうき}', ro: 'yuuki', vi: 'lòng can đảm, dũng khí (N3 — Bài 47)' },
      { w: '{勇気|ゆうき}を{出|だ}す', ro: 'yuuki o dasu', vi: 'lấy hết can đảm' },
      { w: '{勇|いさ}ましい', ro: 'isamashii', vi: 'oai hùng, dũng mãnh (N1)' },
      { w: '{勇敢|ゆうかん}', ro: 'yuukan', vi: 'dũng cảm (N1)' },
    ],
  },
  '敢': {
    hv: 'CẢM', nghia: 'dám, mạnh bạo', en: 'daring / dare to',
    on: ['カン'], kun: [],
    nho: 'Phần trái (theo cách giải thích phổ biến: bàn tay giành lấy vật) + 攵 (tay cầm gậy — chỉ hành động): DÁM XÔNG TỚI giành lấy = CẢM (dám). 勇敢 = dũng + dám. あえて (cố tình, dám) thường viết bằng かな; cách viết 敢えて là ngoài bảng 常用.',
    tu: [
      { w: '{勇敢|ゆうかん}', ro: 'yuukan', vi: 'dũng cảm (N1)' },
      { w: '{果敢|かかん}に', ro: 'kakan ni', vi: 'một cách quả cảm (N1)' },
      { w: 'あえて（{敢|あ}えて）', ro: 'aete', vi: 'cố tình, dám (làm điều không dễ) (N2 — Bài 47)' },
    ],
  },
  '尽': {
    hv: 'TẬN', nghia: 'hết sạch; dốc hết', en: 'exhaust / devote',
    on: ['ジン'], kun: ['つ・くす', 'つ・きる', 'つ・かす'],
    nho: 'Dạng giản của 盡 (bàn tay cầm bàn chải cọ một cái chén cho tới ĐÁY). Nay viết 尺 + hai chấm ⺀ (giọt cuối còn sót lại): DÙNG TỚI GIỌT CUỐI = TẬN → 全力を尽くす (dốc hết sức), 尽きる (cạn).',
    tu: [
      { w: '{尽|つ}くす', ro: 'tsukusu', vi: 'dốc hết, tận lực (N2 — Bài 47)' },
      { w: '{全力|ぜんりょく}を{尽|つ}くす', ro: 'zenryoku o tsukusu', vi: 'dốc toàn lực' },
      { w: '{尽|つ}きる', ro: 'tsukiru', vi: 'cạn, hết (N1)' },
      { w: '{理不尽|りふじん}', ro: 'rifujin', vi: 'vô lý, bất công (N1)' },
    ],
  },
  '践': {
    hv: 'TIỄN', nghia: 'bước lên; làm bằng hành động', en: 'practice / tread',
    on: ['セン'], kun: [],
    nho: 'Trái là ⻊ (bàn chân), phải là 戋 (gợi âm セン): BÀN CHÂN THẬT SỰ BƯỚC LÊN = TIỄN → 実践 = đem điều đã học ra làm thật. Cùng 戋 với 浅 (あさい — nông) và 銭 (せん — tiền xu).',
    tu: [
      { w: '{実践|じっせん}', ro: 'jissen', vi: 'thực hành, đem ra làm thật (N1/N2 — Bài 47)' },
      { w: '{実践的|じっせんてき}', ro: 'jissenteki', vi: 'mang tính thực hành' },
    ],
  },
  '遂': {
    hv: 'TOẠI', nghia: 'đi tới cùng, hoàn thành', en: 'accomplish',
    on: ['スイ'], kun: ['と・げる'],
    nho: 'Bộ 辶 (đường đi) + 㒸 (gợi âm スイ): ĐI MỘT MẠCH TỚI ĐÍCH = TOẠI (toại nguyện) → 遂げる (hoàn thành), やり遂げる・成し遂げる. ついに (cuối cùng — Bài 44) có khi viết 遂に (ngoài bảng 常用). ⚠ 逐 (ちく — 逐一) gần giống, phần trong khác.',
    tu: [
      { w: 'やり{遂|と}げる', ro: 'yaritogeru', vi: 'làm tới nơi tới chốn (N2 — Bài 47)' },
      { w: '{成|な}し{遂|と}げる', ro: 'nashitogeru', vi: 'hoàn thành (việc lớn) (N1 — Bài 47)' },
      { w: '{遂|と}げる', ro: 'togeru', vi: 'đạt được, hoàn thành (N1)' },
      { w: '{未遂|みすい}', ro: 'misui', vi: 'chưa thành (vụ việc chưa xảy ra trọn — tin tức, N1)' },
    ],
  },
  '肝': {
    hv: 'CAN', nghia: 'lá gan; điều cốt yếu', en: 'liver / vital point',
    on: ['カン'], kun: ['きも'],
    nho: 'Trái là 月 (thịt — bộ phận cơ thể), phải là 干 (gợi âm カン): MỘT BỘ PHẬN TRONG THÂN = CAN (gan). Người xưa coi gan và tim là cốt lõi của cơ thể → 肝心 = "gan và tim" = điều cốt yếu nhất. ⚠ 汗 (あせ) = 氵 + 干.',
    tu: [
      { w: '{肝心|かんじん}', ro: 'kanjin', vi: 'cốt yếu, quan trọng nhất (N2 — Bài 47)' },
      { w: '{肝臓|かんぞう}', ro: 'kanzou', vi: 'lá gan (y học — N1)' },
      { w: '{肝|きも}に{銘|めい}じる', ro: 'kimo ni meijiru', vi: 'khắc cốt ghi tâm (N1)' },
    ],
  },
  '揮': {
    hv: 'HUY', nghia: 'vung, vẫy; phát huy', en: 'wield / display',
    on: ['キ'], kun: [],
    nho: 'Trái là 扌 (tay), phải là 軍 (quân đội, gợi âm クン→キ): TAY VẪY CỜ CHỈ HUY QUÂN = HUY → 指揮 (chỉ huy), 発揮 (phát huy sức mạnh đang có). ⚠ 輝 (かがやく) = 光 + 軍.',
    tu: [
      { w: '{発揮|はっき}', ro: 'hakki', vi: 'phát huy (năng lực) (N2 — Bài 47)' },
      { w: '{実力|じつりょく}を{発揮|はっき}する', ro: 'jitsuryoku o hakki suru', vi: 'phát huy thực lực' },
      { w: '{指揮|しき}', ro: 'shiki', vi: 'chỉ huy, chỉ đạo (dàn nhạc) (N1)' },
    ],
  },
  '筋': {
    hv: 'CÂN', nghia: 'cơ bắp, gân; sợi, mạch (của câu chuyện)', en: 'muscle / line / logic',
    on: ['キン'], kun: ['すじ'],
    nho: 'Trên là ⺮ (tre), dưới là 月 (thịt) + 力 (sức): THỚ THỊT LÀM RA SỨC, dai như thớ tre = CÂN (cơ, gân) → 筋肉. Nghĩa mở rộng: "sợi chạy suốt" → 話の筋 (mạch truyện), 筋が通る (hợp lẽ). Bạn đã gặp 筋肉・筋トレ ở Bài 29.',
    tu: [
      { w: '{筋肉|きんにく}', ro: 'kinniku', vi: 'cơ bắp (Bài 29)' },
      { w: '{筋|きん}トレ', ro: 'kintore', vi: 'tập cơ (Bài 29)' },
      { w: '{筋|すじ}', ro: 'suji', vi: 'sợi, gân; mạch, lý lẽ (N2)' },
      { w: '{筋|すじ}が{通|とお}る', ro: 'suji ga tooru', vi: 'hợp lẽ, có lý (N1)' },
    ],
  },
  '唯': {
    hv: 'DUY', nghia: 'chỉ, duy nhất', en: 'only / sole',
    on: ['ユイ', 'イ'], kun: [],
    nho: 'Trái là 口 (miệng), phải là 隹 (con chim đuôi ngắn, gợi âm イ／ユイ): gốc là tiếng "DẠ" đáp nhanh; nghĩa "CHỈ, DUY NHẤT" là nghĩa mượn âm. Nhớ bằng từ: 唯一 = "duy nhất". ⚠ Cùng âm DUY với 維 (維持 — có 糸) nhưng khác nghĩa.',
    tu: [
      { w: '{唯一|ゆいいつ}', ro: 'yuiitsu', vi: 'duy nhất (N2 — Bài 47)' },
      { w: '{唯一|ゆいいつ}の{方法|ほうほう}', ro: 'yuiitsu no houhou', vi: 'cách duy nhất' },
    ],
  },
  '剣': {
    hv: 'KIẾM', nghia: 'thanh kiếm', en: 'sword',
    on: ['ケン'], kun: ['つるぎ'],
    nho: 'Trái là 㑒 (gợi âm ケン), phải là 刂 (con dao): LƯỠI DAO DÀI = KIẾM. 真剣 = "kiếm thật" (không phải kiếm gỗ để tập) → đấu bằng kiếm thật thì phải NGHIÊM TÚC. ⚠ 険 (けわしい — 阝), 検 (けん — 木), 験 (けん — 馬) cùng phần gợi âm.',
    tu: [
      { w: '{真剣|しんけん}', ro: 'shinken', vi: 'nghiêm túc, hết lòng (Bài 28)' },
      { w: '{剣道|けんどう}', ro: 'kendou', vi: 'kiếm đạo (môn võ)' },
      { w: '{真剣勝負|しんけんしょうぶ}', ro: 'shinken shoubu', vi: 'cuộc đấu thật sự, sống còn' },
    ],
  },
  '根': {
    hv: 'CĂN', nghia: 'rễ; gốc; sức bền (căn tính)', en: 'root',
    on: ['コン'], kun: ['ね'],
    nho: 'Trái là 木 (cây), phải là 艮 (dừng lại, bám chặt — gợi âm コン): PHẦN CỦA CÂY BÁM CHẶT VÀO ĐẤT = CĂN (rễ) → 根本 (gốc rễ), 根性・根気 (sức bền từ gốc). ⚠ 限 (かぎる — 阝 + 艮), 眼 (め — 目 + 艮).',
    tu: [
      { w: '{根性|こんじょう}', ro: 'konjou', vi: 'ý chí bền bỉ, gan lì (N2 — Bài 47)' },
      { w: '{根気|こんき}', ro: 'konki', vi: 'sự kiên nhẫn bền bỉ (N1)' },
      { w: '{根本的|こんぽんてき}', ro: 'konponteki', vi: 'mang tính gốc rễ (N2)' },
      { w: '{屋根|やね}', ro: 'yane', vi: 'mái nhà' },
    ],
  },
  '克': {
    hv: 'KHẮC', nghia: 'vượt qua, thắng được', en: 'overcome',
    on: ['コク'], kun: [],
    nho: 'Theo cách giải thích phổ biến: hình người đội một vật NẶNG trên đầu mà vẫn đứng vững → CHỊU ĐƯỢC, THẮNG ĐƯỢC = KHẮC → 克服 (khắc phục, vượt qua). ⚠ Đừng nhầm với 兄 (あに) — 克 có thêm 十 ở trên.',
    tu: [
      { w: '{克服|こくふく}', ro: 'kokufuku', vi: 'khắc phục, vượt qua (N1/N2 — Bài 47)' },
      { w: '{弱点|じゃくてん}を{克服|こくふく}する', ro: 'jakuten o kokufuku suru', vi: 'khắc phục điểm yếu' },
      { w: '{克明|こくめい}に', ro: 'kokumei ni', vi: 'tỉ mỉ, rõ từng chi tiết (N1)' },
    ],
  },
  '忍': {
    hv: 'NHẪN', nghia: 'nhẫn nại, chịu đựng; lén lút', en: 'endure / conceal',
    on: ['ニン'], kun: ['しの・ぶ', 'しの・ばせる'],
    nho: 'Trên là 刃 (lưỡi dao, gợi âm ジン→ニン), dưới là 心 (trái tim): LƯỠI DAO KỀ TRÊN TIM mà vẫn chịu = NHẪN → 忍耐 (nhẫn nại). Nghĩa thứ hai "lặng lẽ, lén" → 忍者 (ninja). ⚠ 認 (みとめる) có thêm 言.',
    tu: [
      { w: '{忍耐|にんたい}', ro: 'nintai', vi: 'sự nhẫn nại (N1 — Bài 47)' },
      { w: '{忍耐力|にんたいりょく}', ro: 'nintairyoku', vi: 'sức chịu đựng' },
      { w: '{忍者|にんじゃ}', ro: 'ninja', vi: 'ninja' },
      { w: '{忍|しの}ぶ', ro: 'shinobu', vi: 'chịu đựng; lẩn tránh (N1)' },
    ],
  },
  '闘': {
    hv: 'ĐẤU', nghia: 'đấu, chiến đấu (với khó khăn)', en: 'fight / struggle',
    on: ['トウ'], kun: ['たたか・う'],
    nho: 'Bộ ngoài vốn là 鬥 (hai người túm tóc vật nhau — chữ mới viết gọn như 門), trong là 豆 + 寸 (gợi âm トウ): HAI NGƯỜI VẬT NHAU = ĐẤU → 闘う (đấu với bệnh tật, khó khăn), 闘病, 奮闘 (奮 — Bài 45). ⚠ 戦う (Bài 47 phân biệt) = đánh trận, thi đấu với ĐỐI THỦ.',
    tu: [
      { w: '{闘|たたか}う', ro: 'tatakau', vi: 'chiến đấu, vật lộn (với khó khăn, bệnh) (N2 — Bài 47)' },
      { w: '{闘病|とうびょう}', ro: 'toubyou', vi: 'chống chọi bệnh tật (N1)' },
      { w: '{奮闘|ふんとう}', ro: 'funtou', vi: 'phấn đấu hết sức (N1)' },
      { w: '{格闘|かくとう}', ro: 'kakutou', vi: 'vật lộn; võ đối kháng (N1)' },
    ],
  },
  '鍛': {
    hv: 'ĐOÁN', nghia: 'rèn (kim loại); rèn luyện', en: 'forge / train',
    on: ['タン'], kun: ['きた・える'],
    nho: 'Trái là 金 (kim loại), phải là 段 (bậc, nện từng nhát — gợi âm ダン→タン): NỆN KIM LOẠI TỪNG NHÁT cho cứng = ĐOÁN (rèn) → 鍛える (rèn thân thể, rèn ý chí). Bạn đã gặp 鍛える ở Bài 29, nay học chữ.',
    tu: [
      { w: '{鍛|きた}える', ro: 'kitaeru', vi: 'rèn luyện (Bài 29)' },
      { w: '{体|からだ}を{鍛|きた}える', ro: 'karada o kitaeru', vi: 'rèn luyện thân thể' },
      { w: '{心|こころ}を{鍛|きた}える', ro: 'kokoro o kitaeru', vi: 'rèn ý chí' },
      { w: '{鍛錬|たんれん}', ro: 'tanren', vi: 'sự rèn luyện (văn viết, N1)' },
    ],
  },
  '宣': {
    hv: 'TUYÊN', nghia: 'tuyên bố, nói cho mọi người biết', en: 'proclaim',
    on: ['セン'], kun: [],
    nho: 'Trên là 宀 (mái nhà — cung điện), dưới là 亘 (vòng khắp, gợi âm セン): LỜI TỪ CUNG ĐIỆN TRUYỀN KHẮP NƠI = TUYÊN → 宣言 (tuyên bố), 宣伝 (quảng cáo, tuyên truyền). ⚠ 宜 (ぎ — 便宜) phần dưới là 且.',
    tu: [
      { w: '{宣言|せんげん}', ro: 'sengen', vi: 'tuyên bố (N2 — Bài 47)' },
      { w: '{宣伝|せんでん}', ro: 'senden', vi: 'quảng cáo, tuyên truyền (N2)' },
      { w: '{宣誓|せんせい}', ro: 'sensei', vi: 'tuyên thệ (N1)' },
    ],
  },
  '叶': {
    hv: 'HIỆP', nghia: '(mong ước) thành hiện thực', en: 'come true',
    on: [], kun: ['かな・う'],
    nho: 'Trái là 口 (miệng), phải là 十 (mười): MƯỜI MIỆNG NÓI CÙNG MỘT LỜI → hợp ý nhau → điều mong ƯỚC ĐƯỢC THÀNH = HIỆP. Trong bảng 常用 chỉ có cách đọc Kun かなう (夢が叶う). ⚠ Đừng nhầm với 吐 (はく — 弱音を吐く: 口 + 土).',
    tu: [
      { w: '{叶|かな}う', ro: 'kanau', vi: '(ước mơ) thành hiện thực (N2 — Bài 47)' },
      { w: '{叶|かな}える', ro: 'kanaeru', vi: 'biến (ước mơ) thành hiện thực (N2 — Bài 47)' },
      { w: '{夢|ゆめ}が{叶|かな}う', ro: 'yume ga kanau', vi: 'giấc mơ thành sự thật' },
    ],
  },
  '壁': {
    hv: 'BÍCH', nghia: 'bức tường; trở ngại', en: 'wall / barrier',
    on: ['ヘキ'], kun: ['かべ'],
    nho: 'Trên là 辟 (gợi âm ヘキ), dưới là 土 (đất): BỨC TƯỜNG ĐẮP BẰNG ĐẤT = BÍCH → 壁 (tường — Bài 18), nghĩa bóng: 壁にぶつかる (gặp trở ngại). ⚠ 完璧 (かんぺき — hoàn hảo) viết 璧 có 玉 (ngọc), KHÔNG phải 壁.',
    tu: [
      { w: '{壁|かべ}', ro: 'kabe', vi: 'bức tường (Bài 18)' },
      { w: '{壁|かべ}にぶつかる', ro: 'kabe ni butsukaru', vi: 'gặp bức tường, gặp trở ngại (N2 — Bài 47)' },
      { w: '{言葉|ことば}の{壁|かべ}', ro: 'kotoba no kabe', vi: 'rào cản ngôn ngữ' },
      { w: '{壁画|へきが}', ro: 'hekiga', vi: 'tranh tường (N1)' },
    ],
  },
  '維': {
    hv: 'DUY', nghia: 'sợi dây buộc; giữ gìn', en: 'maintain / fiber',
    on: ['イ'], kun: [],
    nho: 'Trái là 糸 (sợi tơ), phải là 隹 (chim, gợi âm イ): SỢI DÂY BUỘC GIỮ cho khỏi rời = DUY → 維持 (duy trì), 繊維 (sợi). ⚠ Cùng 隹 với 唯 (唯一 — 口) và 推 (すい — 扌), nhưng 維 có 糸.',
    tu: [
      { w: '{維持|いじ}', ro: 'iji', vi: 'duy trì (N2 — Bài 47)' },
      { w: '{健康|けんこう}を{維持|いじ}する', ro: 'kenkou o iji suru', vi: 'giữ gìn sức khoẻ' },
      { w: '{繊維|せんい}', ro: 'sen\'i', vi: 'sợi, chất xơ (N2)' },
      { w: '{明治維新|めいじいしん}', ro: 'Meiji ishin', vi: 'Minh Trị Duy Tân' },
    ],
  },
};
