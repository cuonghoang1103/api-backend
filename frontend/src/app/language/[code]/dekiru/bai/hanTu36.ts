/**
 * Chữ Hán MỚI của Bài 36 (文化の違い — tiếp sau sách, cấp N3) cho thẻ chữ Hán — cùng định dạng hanTu.ts.
 * 21 chữ: 異 祝 包 列 離 周 囲 燃 省 (N3 theo các bảng tham khảo phổ biến) · 較 贈 譲 旧 般 宗 恥 略 (N2–N3) · 握 距 徴 儀 (N2)
 * — JLPT không công bố danh sách chữ chính thức — bảng `b36-han-tu` trong bai36.ts. 則・姿 thuộc Bài 34 nên không có ở đây.
 * Cách nhớ: theo cấu tạo chữ (phần chỉ nghĩa + phần gợi âm của chữ hình thanh ghi rõ); 異, 旧 là chữ mà giải nghĩa nguồn gốc
 * không thống nhất / là dạng giản lược nên ghi rõ "cách nhớ bằng hình", không khẳng định nguồn gốc.
 * On / Kun theo bảng thường dụng (常用): 較 列 距 旧 般 徴 宗 儀 略 chỉ có âm On; 省 hai âm On (セイ・ショウ).
 * Tệp chỉ có `import type` — tải chậm như hanTu.ts.
 */
import type { HanTu } from '@/components/sach-hoc/kanji';

export const HAN_TU_36: Record<string, HanTu> = {
  '異': {
    hv: 'DỊ', nghia: 'khác, lạ', en: 'different / unusual',
    on: ['イ'], kun: ['こと・なる'],
    nho: 'Trên là 田, dưới là 共 (hai tay nâng lên). Cách nhớ bằng hình: chữ cổ hay được giải thích là một người đeo mặt nạ to, giơ hai tay — trông KỲ LẠ, KHÁC thường → 異なる (khác nhau), 異常 (bất thường). ⚠ Thiếu 田 là 共 (cộng — {共通|きょうつう}).',
    tu: [
      { w: '{異|こと}なる', ro: 'kotonaru', vi: 'khác nhau (trang trọng)' },
      { w: '{異文化|いぶんか}', ro: 'ibunka', vi: 'văn hoá khác' },
      { w: '{異常|いじょう}', ro: 'ijou', vi: 'bất thường (N3)' },
      { w: '{異動|いどう}', ro: 'idou', vi: 'điều chuyển công tác (N2)' },
    ],
  },
  '較': {
    hv: 'GIẢO', nghia: 'so sánh', en: 'compare',
    on: ['カク'], kun: [],
    nho: 'Bên trái 車 (xe), bên phải 交 (giao nhau — gợi âm): hai cỗ XE đặt CẠNH NHAU để so xem chiếc nào hơn → SO SÁNH → 比較. Khác 校 (木 + 交 — trường học) và 効 (交 + 力 — hiệu quả).',
    tu: [
      { w: '{比較|ひかく}', ro: 'hikaku', vi: 'so sánh' },
      { w: '{比較的|ひかくてき}', ro: 'hikakuteki', vi: 'tương đối (N3)' },
      { w: '{比較|ひかく}する', ro: 'hikaku suru', vi: 'so sánh (động từ)' },
    ],
  },
  '祝': {
    hv: 'CHÚC', nghia: 'chúc mừng', en: 'celebrate / congratulate',
    on: ['シュク', 'シュウ'], kun: ['いわ・う'],
    nho: 'Bên trái 礻 (bàn thờ — thần linh), bên phải 兄 (cái miệng 口 trên người 儿 — người đứng ra khấn): người đứng trước bàn thờ cất LỜI CHÚC → 祝う, 祝日. Khác 況 (氵 + 兄 — tình huống) và 社 (礻 + 土).',
    tu: [
      { w: '{祝|いわ}う', ro: 'iwau', vi: 'chúc mừng, ăn mừng' },
      { w: 'お{祝|いわ}い', ro: 'oiwai', vi: 'quà mừng; sự chúc mừng' },
      { w: '{祝日|しゅくじつ}', ro: 'shukujitsu', vi: 'ngày lễ (nghỉ)' },
      { w: '{祝福|しゅくふく}', ro: 'shukufuku', vi: 'chúc phúc (N1)' },
    ],
  },
  '贈': {
    hv: 'TẶNG', nghia: 'tặng', en: 'give (as a gift)',
    on: ['ゾウ', 'ソウ'], kun: ['おく・る'],
    nho: 'Bên trái 貝 (vỏ sò — tiền, của cải), bên phải 曽 (gợi âm ソウ／ゾウ): đem CỦA CẢI ra trao cho người → TẶNG → 贈る, 贈り物. Cùng phần 曽: 増 (土 — tăng thêm), 憎 (忄 — ghét). ⚠ 贈る (tặng quà) ≠ 送る (gửi đi, tiễn).',
    tu: [
      { w: '{贈|おく}る', ro: 'okuru', vi: 'tặng' },
      { w: '{贈|おく}り{物|もの}', ro: 'okurimono', vi: 'quà tặng' },
      { w: '{贈呈|ぞうてい}', ro: 'zoutei', vi: 'trao tặng (trang trọng — N1)' },
    ],
  },
  '包': {
    hv: 'BAO', nghia: 'gói, bọc', en: 'wrap',
    on: ['ホウ'], kun: ['つつ・む'],
    nho: 'Bên ngoài 勹 (vòng tay ôm quanh), bên trong 己 (vốn vẽ bào thai): cái bụng ÔM LẤY em bé bên trong → GÓI, BỌC → 包む, 包装. Là phần gợi âm ホウ của 抱 (扌 — ôm), 泡 (氵 — bọt).',
    tu: [
      { w: '{包|つつ}む', ro: 'tsutsumu', vi: 'gói, bọc' },
      { w: '{包装|ほうそう}', ro: 'housou', vi: 'đóng gói, giấy gói' },
      { w: '{小包|こづつみ}', ro: 'kozutsumi', vi: 'bưu kiện (N3)' },
      { w: '{包丁|ほうちょう}', ro: 'houchou', vi: 'dao bếp (N3)' },
    ],
  },
  '列': {
    hv: 'LIỆT', nghia: 'hàng, dãy', en: 'row / line',
    on: ['レツ'], kun: [],
    nho: 'Bên trái 歹 (xương tàn), bên phải 刂 (con dao): dùng dao chia thành từng khúc rồi xếp thẳng HÀNG → 列, 行列. Thêm 亻 → 例 (ví dụ — "người" đứng làm mẫu đầu hàng).',
    tu: [
      { w: '{列|れつ}', ro: 'retsu', vi: 'hàng, dãy' },
      { w: '{行列|ぎょうれつ}', ro: 'gyouretsu', vi: 'hàng người xếp dài' },
      { w: '{列車|れっしゃ}', ro: 'ressha', vi: 'đoàn tàu' },
      { w: '{一列|いちれつ}', ro: 'ichiretsu', vi: 'một hàng' },
    ],
  },
  '譲': {
    hv: 'NHƯỢNG', nghia: 'nhường, nhượng', en: 'yield / hand over',
    on: ['ジョウ'], kun: ['ゆず・る'],
    nho: 'Bên trái 言 (lời nói), bên phải 襄 (gợi âm ジョウ): dùng LỜI lễ phép mời người khác đi trước, ngồi trước → NHƯỜNG → 譲る. Cùng phần 襄: 嬢 (女 — cô gái, cũng đọc ジョウ). Khác 議 (言 + 義 — bàn bạc).',
    tu: [
      { w: '{譲|ゆず}る', ro: 'yuzuru', vi: 'nhường' },
      { w: '{譲|ゆず}り{合|あ}う', ro: 'yuzuriau', vi: 'nhường nhau (N3)' },
      { w: '{譲歩|じょうほ}', ro: 'jouho', vi: 'nhượng bộ (N1)' },
      { w: '{親譲|おやゆず}り', ro: 'oyayuzuri', vi: 'thừa hưởng từ bố mẹ (N1)' },
    ],
  },
  '握': {
    hv: 'ÁC', nghia: 'nắm', en: 'grasp / grip',
    on: ['アク'], kun: ['にぎ・る'],
    nho: 'Bên trái 扌 (tay), bên phải 屋 (gợi âm; mái nhà che kín): bàn TAY khép KÍN lại như mái che → NẮM → 握る, 握手. Thiếu 扌 là 屋 (nhà — {部屋|へや}).',
    tu: [
      { w: '{握手|あくしゅ}', ro: 'akushu', vi: 'bắt tay' },
      { w: '{握|にぎ}る', ro: 'nigiru', vi: 'nắm (N3)' },
      { w: '{握|にぎ}り{寿司|ずし}', ro: 'nigirizushi', vi: 'sushi nắm' },
    ],
  },
  '距': {
    hv: 'CỰ', nghia: 'cự ly, khoảng cách', en: 'distance',
    on: ['キョ'], kun: [],
    nho: 'Bên trái 足 (chân), bên phải 巨 (to lớn — gợi âm キョ): khoảng cách mà BƯỚC CHÂN phải đi → CỰ LY → 距離. Cùng phần 巨: 拒 (扌 — cự tuyệt, N1), 巨 (to — {巨大|きょだい}).',
    tu: [
      { w: '{距離|きょり}', ro: 'kyori', vi: 'khoảng cách' },
      { w: '{長距離|ちょうきょり}', ro: 'choukyori', vi: 'đường dài' },
      { w: '{短距離|たんきょり}', ro: 'tankyori', vi: 'cự ly ngắn' },
    ],
  },
  '離': {
    hv: 'LY', nghia: 'rời, xa', en: 'separate / leave',
    on: ['リ'], kun: ['はな・れる', 'はな・す'],
    nho: 'Bên phải 隹 (con chim đuôi ngắn), bên trái 离 (gợi âm リ): con CHIM bay RỜI khỏi lưới → RỜI XA → 離れる, 距離. Khác 難 (cũng có 隹 bên phải — khó).',
    tu: [
      { w: '{離|はな}れる', ro: 'hanareru', vi: 'rời xa' },
      { w: '{離|はな}す', ro: 'hanasu', vi: 'tách ra, buông (N3)' },
      { w: '{距離|きょり}', ro: 'kyori', vi: 'khoảng cách' },
      { w: '{離婚|りこん}', ro: 'rikon', vi: 'ly hôn (N3)' },
    ],
  },
  '旧': {
    hv: 'CỰU', nghia: 'cũ', en: 'old / former',
    on: ['キュウ'], kun: [],
    nho: 'Dạng giản lược của chữ 舊. Cách nhớ bằng hình: một nét dọc 丨 đứng cạnh 日 (ngày) — một ngày ĐÃ QUA rồi → CŨ → 旧正月 (Tết theo lịch cũ), 旧暦 (âm lịch).',
    tu: [
      { w: '{旧正月|きゅうしょうがつ}', ro: 'kyuushougatsu', vi: 'Tết âm lịch' },
      { w: '{旧暦|きゅうれき}', ro: 'kyuureki', vi: 'âm lịch (N2)' },
      { w: '{復旧|ふっきゅう}', ro: 'fukkyuu', vi: 'khôi phục (N2)' },
    ],
  },
  '般': {
    hv: 'BAN', nghia: 'loại; chung', en: 'general / kind',
    on: ['ハン'], kun: [],
    nho: 'Bên trái 舟 (thuyền), bên phải 殳 (tay cầm sào): chống sào cho thuyền QUAY VÒNG — nghĩa gốc "xoay chuyển", nay chủ yếu gặp trong 一般 (thông thường, chung). Khác 船 (舟 + 㕣 — con thuyền).',
    tu: [
      { w: '{一般|いっぱん}', ro: 'ippan', vi: 'thông thường, phổ thông' },
      { w: '{一般的|いっぱんてき}', ro: 'ippanteki', vi: 'phổ biến' },
      { w: '{全般|ぜんぱん}', ro: 'zenpan', vi: 'toàn bộ (N1)' },
    ],
  },
  '徴': {
    hv: 'TRƯNG', nghia: 'dấu hiệu; trưng thu', en: 'sign / characteristic',
    on: ['チョウ'], kun: [],
    nho: '彳 (bước đi) + 山 + 王 + 攵 (tay hành động): dấu hiệu LỘ RA bên ngoài → ĐẶC TRƯNG → 特徴, 象徴. ⚠ Rất giống 微 (vi — {微妙|びみょう}): giữa 徴 là 王, giữa 微 là 几 — học theo TỪ.',
    tu: [
      { w: '{特徴|とくちょう}', ro: 'tokuchou', vi: 'đặc trưng' },
      { w: '{象徴|しょうちょう}', ro: 'shouchou', vi: 'biểu tượng (N2)' },
    ],
  },
  '周': {
    hv: 'CHU', nghia: 'vòng quanh, xung quanh', en: 'around / circumference',
    on: ['シュウ'], kun: ['まわ・り'],
    nho: 'Khung 冂 bao quanh 土 + 口: rào kín MỘT VÒNG quanh mảnh đất → XUNG QUANH → 周り, 周囲, 一周. Là phần gợi âm của 週 (辶 — tuần: một vòng bảy ngày) và 調 (言 — điều tra).',
    tu: [
      { w: '{周|まわ}り', ro: 'mawari', vi: 'xung quanh' },
      { w: '{周囲|しゅうい}', ro: 'shuui', vi: 'xung quanh (văn viết)' },
      { w: '{一周|いっしゅう}', ro: 'isshuu', vi: 'một vòng' },
      { w: '{周辺|しゅうへん}', ro: 'shuuhen', vi: 'vùng lân cận (N2)' },
    ],
  },
  '囲': {
    hv: 'VI', nghia: 'vây quanh', en: 'surround / enclose',
    on: ['イ'], kun: ['かこ・む', 'かこ・う'],
    nho: 'Khung 囗 (vòng rào) + 井 (cái giếng): hàng rào VÂY QUANH miệng giếng → 囲む, 周囲, 雰囲気. Khác 困 (trong khung là 木 — khó khăn) và 図.',
    tu: [
      { w: '{囲|かこ}む', ro: 'kakomu', vi: 'vây quanh, quây quanh' },
      { w: '{周囲|しゅうい}', ro: 'shuui', vi: 'xung quanh' },
      { w: '{雰囲気|ふんいき}', ro: 'fun\'iki', vi: 'bầu không khí' },
      { w: '{範囲|はんい}', ro: 'han\'i', vi: 'phạm vi (N3)' },
    ],
  },
  '宗': {
    hv: 'TÔNG', nghia: 'tôn giáo; dòng, phái', en: 'religion / sect',
    on: ['シュウ', 'ソウ'], kun: [],
    nho: 'Trên 宀 (mái nhà), dưới 示 (bàn thờ): ngôi nhà có BÀN THỜ tổ tiên, thần linh → TÔNG MIẾU → TÔN GIÁO → 宗教. Thiếu 宀 là 示 (chỉ ra — {示|しめ}す).',
    tu: [
      { w: '{宗教|しゅうきょう}', ro: 'shuukyou', vi: 'tôn giáo' },
      { w: '{宗派|しゅうは}', ro: 'shuuha', vi: 'giáo phái (N1)' },
    ],
  },
  '儀': {
    hv: 'NGHI', nghia: 'nghi lễ, phép tắc', en: 'ceremony / etiquette',
    on: ['ギ'], kun: [],
    nho: 'Bên trái 亻 (người), bên phải 義 (lẽ phải — gợi âm ギ): NGƯỜI làm đúng PHÉP TẮC → NGHI LỄ → 礼儀, 儀式, お辞儀. Cùng phần 義, cùng đọc ギ: 議 (言 — bàn bạc), 義 (nghĩa).',
    tu: [
      { w: '{礼儀|れいぎ}', ro: 'reigi', vi: 'lễ nghi, phép lịch sự' },
      { w: '{儀式|ぎしき}', ro: 'gishiki', vi: 'nghi thức (N2)' },
      { w: 'お{辞儀|じぎ}', ro: 'ojigi', vi: 'cúi chào' },
    ],
  },
  '恥': {
    hv: 'SỈ', nghia: 'xấu hổ', en: 'shame',
    on: ['チ'], kun: ['は・じる', 'はじ', 'は・じらう', 'は・ずかしい'],
    nho: 'Bên trái 耳 (tai), bên phải 心 (lòng): xấu hổ thì TAI đỏ bừng, LÒNG nóng ran → 恥ずかしい, 恥をかく. Khác 取 (耳 + 又 — lấy).',
    tu: [
      { w: '{恥|は}ずかしい', ro: 'hazukashii', vi: 'ngượng, xấu hổ' },
      { w: '{恥|はじ}', ro: 'haji', vi: 'nỗi xấu hổ (N3)' },
      { w: '{恥|はじ}をかく', ro: 'haji o kaku', vi: 'bị bẽ mặt' },
    ],
  },
  '燃': {
    hv: 'NHIÊN', nghia: 'cháy, đốt', en: 'burn',
    on: ['ネン'], kun: ['も・える', 'も・やす', 'も・す'],
    nho: 'Bên trái 火 (lửa), bên phải 然 (gợi âm ネン／ゼン). Chữ 然 vốn đã có 灬 (lửa) và nghĩa gốc là "đốt"; khi 然 chuyển sang nghĩa "như thế" ({自然|しぜん}), người ta thêm một 火 nữa để giữ nghĩa CHÁY → 燃える, 燃やす.',
    tu: [
      { w: '{燃|も}える', ro: 'moeru', vi: 'cháy' },
      { w: '{燃|も}やす', ro: 'moyasu', vi: 'đốt (N3)' },
      { w: '{燃|も}えるごみ', ro: 'moeru gomi', vi: 'rác cháy được' },
      { w: '{燃料|ねんりょう}', ro: 'nenryou', vi: 'nhiên liệu (N2)' },
    ],
  },
  '省': {
    hv: 'TỈNH', nghia: 'xét lại; lược bớt; bộ (chính phủ)', en: 'reflect / omit / ministry',
    on: ['セイ', 'ショウ'], kun: ['かえり・みる', 'はぶ・く'],
    nho: 'Trên 少 (ít), dưới 目 (mắt): nheo MẮT nhìn kỹ để BỚT cái thừa và XÉT LẠI chính mình → 省略 (lược bỏ — ショウ), 反省 (tự kiểm điểm — セイ). Còn nghĩa "bộ" của chính phủ: 外務省 (ショウ).',
    tu: [
      { w: '{反省|はんせい}', ro: 'hansei', vi: 'tự kiểm điểm' },
      { w: '{省略|しょうりゃく}', ro: 'shouryaku', vi: 'lược bỏ' },
      { w: '{省|はぶ}く', ro: 'habuku', vi: 'bớt, lược (N2)' },
      { w: '{外務省|がいむしょう}', ro: 'gaimushou', vi: 'Bộ Ngoại giao (N2)' },
    ],
  },
  '略': {
    hv: 'LƯỢC', nghia: 'lược, tóm gọn', en: 'abbreviate / outline',
    on: ['リャク'], kun: [],
    nho: 'Bên trái 田 (ruộng), bên phải 各 (gợi âm): vạch sơ LƯỢC ranh giới các thửa ruộng → tóm gọn → 略す, 省略, 略語. Cùng phần 各: 路 (足 — đường), 格 (木 — cách), 客 (khách).',
    tu: [
      { w: '{略|りゃく}す', ro: 'ryakusu', vi: 'nói tắt, viết tắt' },
      { w: '{省略|しょうりゃく}', ro: 'shouryaku', vi: 'lược bỏ' },
      { w: '{略語|りゃくご}', ro: 'ryakugo', vi: 'từ viết tắt (N2)' },
      { w: '{戦略|せんりゃく}', ro: 'senryaku', vi: 'chiến lược (N2)' },
    ],
  },
};
