/**
 * Chữ Hán MỚI của Bài 51 (強調 — Nhấn mạnh · tiếp sau sách, cấp N2) cho thẻ chữ Hán — cùng định dạng hanTu.ts.
 * 25 chữ: 陶 彫 鑑 奏 鼓 拍 踊 丸 輝 彩 宝 魂 底 殊 是 非 超 愛 孝 犠 牲 叫 祈 稼 繰 — bảng `b51-han-tu` trong bai51.ts.
 * Không trùng hanTu.ts, hanTu16–50.ts, hanTuTiep.ts, hanLop.ts và mọi bảng chữ Hán Bài 1–50 (kiểm 09/11 bằng script — 1.196 chữ đã
 * dạy, gồm cả Bài 49 = 伴 衰 繁 緩 鈍 膨 瞬 徐 著 兆 昇 沈 浮 透 頻 郊 疎 密 革 導 枯 芽 潮 幅 · Bài 50 = 顕 照 双 圧 概 純 矛 盾 裏 狭 豪 華 硬
 * 軟 敏 繊 皮 恵 乏 裕 虚 凡 群 偉).
 * Cấp chữ theo các bảng tham khảo phổ biến (JLPT không công bố danh sách chữ chính thức): 踊 丸 非 N4–N3 (ba chữ "cơ bản" mà khoá chưa
 * có trong bảng nào — dạy bù ở đây; 非 cần cho 是非); 宝 底 超 愛 N3; 彫 奏 拍 輝 殊 是 孝 叫 祈 繰 phần lớn bảng xếp N2; 陶 鑑 鼓 彩 魂 犠 牲 稼 nhiều bảng
 * xếp N1 nhưng TỪ chứa chúng (陶芸・鑑賞・太鼓・色彩・魂を込める・犠牲・稼ぐ) là từ N2 hay gặp.
 * Cách nhớ: theo cấu tạo chữ (phần chỉ nghĩa + phần gợi âm của chữ hình thanh ghi rõ). Từ đi chung ưu tiên từ dùng trong bai51.ts và từ
 * đã gặp ở bài trước (演技・演 Bài 43, 徹 Bài 45, 舞 Bài 44, 監 Bài 43, 根気 — 根 Bài 47).
 * On / Kun theo bảng thường dụng (常用): 陶 鑑(Kun かんが・みる hiếm) 拍 是 非 孝 犠 牲 chỉ dùng âm On trong từ thường gặp; 繰 KHÔNG có âm On
 * trong bảng thường dụng (chỉ く・る); 愛 không có âm Kun thường dụng; 拍 có On ハク・ヒョウ (ヒョウ trong 拍子); 鼓 có Kun つづみ (cái trống
 * tay của kịch Nō); 殊 có Kun こと (殊に); 超 có Kun こ・える／こ・す; 丸 có Kun まる／まる・い／まる・める; 太鼓 đọc たいこ (鼓 = コ).
 * Hán Việt của 繰 ghi SÀO (cũng gặp TAO) — xin người điều phối soát lại nếu có từ điển Hán Việt chuẩn.
 * Tệp chỉ có `import type` — tải chậm như hanTu.ts.
 */
import type { HanTu } from '@/components/sach-hoc/kanji';

export const HAN_TU_51: Record<string, HanTu> = {
  '陶': {
    hv: 'ĐÀO', nghia: 'đồ gốm, nung đất', en: 'pottery, ceramics',
    on: ['トウ'], kun: [],
    nho: 'Bên trái 阝 (gò đất), bên phải 匋 (勹 bọc quanh + 缶 cái vò sành — phần gợi âm トウ): những chiếc VÒ SÀNH nung bên GÒ ĐẤT = ĐỒ GỐM → 陶芸 (nghề gốm), 陶器 (đồ gốm).',
    tu: [
      { w: '{陶芸|とうげい}', ro: 'tougei', vi: 'nghề làm gốm (N2)' },
      { w: '{陶器|とうき}', ro: 'touki', vi: 'đồ gốm (N2)' },
      { w: '{陶芸家|とうげいか}', ro: 'tougeika', vi: 'nghệ nhân gốm' },
      { w: '{陶磁器|とうじき}', ro: 'toujiki', vi: 'đồ gốm sứ (N1)' },
    ],
  },
  '彫': {
    hv: 'ĐIÊU', nghia: 'chạm, khắc', en: 'carve, engrave',
    on: ['チョウ'], kun: ['ほ・る'],
    nho: 'Bên trái 周 (vòng quanh — phần gợi âm チョウ), bên phải 彡 (ba nét = hoa văn): KHẮC hoa văn chạy VÒNG QUANH món đồ = CHẠM KHẮC → 彫る (khắc), 彫刻 (điêu khắc).',
    tu: [
      { w: '{彫|ほ}る', ro: 'horu', vi: 'khắc, chạm (N2)' },
      { w: '{彫刻|ちょうこく}', ro: 'choukoku', vi: 'điêu khắc, tác phẩm điêu khắc (N2)' },
      { w: '{木彫|きぼ}り', ro: 'kibori', vi: 'đồ khắc gỗ' },
      { w: '{名前|なまえ}を{彫|ほ}る', ro: 'namae o horu', vi: 'khắc tên' },
    ],
  },
  '鑑': {
    hv: 'GIÁM', nghia: 'soi xét, thưởng lãm', en: 'appreciate, mirror',
    on: ['カン'], kun: ['かんが・みる'],
    nho: 'Bên trái 金 (kim loại), bên phải 監 (người cúi nhìn vào chậu nước — chữ đã học ở Bài 43, phần gợi âm カン): tấm GƯƠNG ĐỒNG để SOI kỹ → xem kỹ, thưởng thức → 鑑賞 (thưởng lãm nghệ thuật), 図鑑 (sách tranh tra cứu).',
    tu: [
      { w: '{鑑賞|かんしょう}', ro: 'kanshou', vi: 'thưởng thức (nghệ thuật) (N2)' },
      { w: '{図鑑|ずかん}', ro: 'zukan', vi: 'sách tranh minh hoạ, bách khoa có hình' },
      { w: '{鑑定|かんてい}', ro: 'kantei', vi: 'giám định (N1)' },
      { w: '{美術鑑賞|びじゅつかんしょう}', ro: 'bijutsu kanshou', vi: 'thưởng lãm mỹ thuật' },
    ],
  },
  '奏': {
    hv: 'TẤU', nghia: 'tấu (nhạc); dâng lên', en: 'play (music)',
    on: ['ソウ'], kun: ['かな・でる'],
    nho: 'Phần trên như HAI TAY nâng một vật, phần dưới là 天 lệch nét (người ngửa lên): DÂNG một thứ lên bề trên = TÂU; dâng tiếng nhạc lên = TẤU NHẠC → 演奏 (biểu diễn nhạc cụ), 奏でる (tấu lên).',
    tu: [
      { w: '{演奏|えんそう}', ro: 'ensou', vi: 'biểu diễn (nhạc cụ) (N2)' },
      { w: '{奏|かな}でる', ro: 'kanaderu', vi: 'tấu lên, chơi (nhạc) (N1)' },
      { w: '{演奏会|えんそうかい}', ro: 'ensoukai', vi: 'buổi hoà nhạc' },
      { w: '{伴奏|ばんそう}', ro: 'bansou', vi: 'đệm nhạc (伴 Bài 49)' },
    ],
  },
  '鼓': {
    hv: 'CỔ', nghia: 'cái trống; đánh trống', en: 'drum',
    on: ['コ'], kun: ['つづみ'],
    nho: 'Bên trái 壴 (cái TRỐNG đặt trên giá, trên có chỏm trang trí), bên phải 支 (tay cầm cành = cầm DÙI): tay cầm dùi đánh vào trống = TRỐNG → 太鼓 (trống lớn), 鼓動 (nhịp tim — "trống trong ngực").',
    tu: [
      { w: '{太鼓|たいこ}', ro: 'taiko', vi: 'trống (N2)' },
      { w: '{和太鼓|わだいこ}', ro: 'wadaiko', vi: 'trống Nhật truyền thống' },
      { w: '{鼓動|こどう}', ro: 'kodou', vi: 'nhịp đập (tim) (N1)' },
      { w: '{鼓|つづみ}', ro: 'tsuzumi', vi: 'trống tay (kịch Nō)' },
    ],
  },
  '拍': {
    hv: 'PHÁCH', nghia: 'vỗ; nhịp', en: 'clap, beat',
    on: ['ハク', 'ヒョウ'], kun: [],
    nho: 'Bên trái 扌 (tay), bên phải 白 (trắng — phần gợi âm ハク): hai bàn TAY vỗ vào nhau = VỖ → 拍手 (vỗ tay); vỗ đều đều = NHỊP → 拍子 (nhịp — đọc ヒョウ).',
    tu: [
      { w: '{拍手|はくしゅ}', ro: 'hakushu', vi: 'vỗ tay (N2)' },
      { w: '{拍子|ひょうし}', ro: 'hyoushi', vi: 'nhịp; (何かの拍子に) lúc bất chợt' },
      { w: '{一拍|いっぱく}', ro: 'ippaku', vi: 'một nhịp, một phách' },
    ],
  },
  '踊': {
    hv: 'DŨNG', nghia: 'nhảy múa', en: 'dance',
    on: ['ヨウ'], kun: ['おど・る', 'おど・り'],
    nho: 'Bên trái 足 (chân), bên phải 甬 (phần gợi âm ヨウ — như cái ống, "vọt lên"): CHÂN bật lên theo nhịp = NHẢY MÚA → 踊る, 踊り, 盆踊り (múa hội Obon).',
    tu: [
      { w: '{踊|おど}る', ro: 'odoru', vi: 'nhảy, múa (N4)' },
      { w: '{踊|おど}り', ro: 'odori', vi: 'điệu múa' },
      { w: '{盆踊|ぼんおど}り', ro: 'bon\'odori', vi: 'múa hội Obon' },
      { w: '{舞踊|ぶよう}', ro: 'buyou', vi: 'vũ đạo (舞 Bài 44) (N1)' },
    ],
  },
  '丸': {
    hv: 'HOÀN', nghia: 'tròn; viên tròn; trọn vẹn', en: 'round, circle',
    on: ['ガン'], kun: ['まる', 'まる・い', 'まる・める'],
    nho: 'Như số 九 có thêm một CHẤM nhỏ ở trong: một người CUỘN TRÒN lại ôm lấy một viên nhỏ = TRÒN → 丸い (tròn); cả khối tròn trọn vẹn → 丸ごと (nguyên cả), 一丸 (một khối thống nhất).',
    tu: [
      { w: '{丸|まる}い', ro: 'marui', vi: 'tròn (N4)' },
      { w: '{一丸|いちがん}となる', ro: 'ichigan to naru', vi: 'đồng lòng thành một khối (N1)' },
      { w: '{丸|まる}ごと', ro: 'marugoto', vi: 'nguyên cả, trọn' },
      { w: '{日|ひ}の{丸|まる}', ro: 'hinomaru', vi: 'cờ Nhật (vòng tròn mặt trời)' },
    ],
  },
  '輝': {
    hv: 'HUY', nghia: 'chiếu sáng, rực rỡ', en: 'shine, sparkle',
    on: ['キ'], kun: ['かがや・く'],
    nho: 'Bên trái 光 (ánh sáng), bên phải 軍 (đoàn quân — phần gợi âm): ÁNH SÁNG toả ra rầm rộ như cả ĐOÀN QUÂN = RỰC RỠ, TOẢ SÁNG → 輝く, 目を輝かせる (mắt sáng lên).',
    tu: [
      { w: '{輝|かがや}く', ro: 'kagayaku', vi: 'toả sáng, lấp lánh (N2)' },
      { w: '{輝|かがや}き', ro: 'kagayaki', vi: 'ánh sáng, vẻ rực rỡ' },
      { w: '{目|め}を{輝|かがや}かせる', ro: 'me o kagayakaseru', vi: 'mắt sáng lên (vì hào hứng)' },
    ],
  },
  '彩': {
    hv: 'THÁI', nghia: 'sắc màu; tô điểm', en: 'colour, adorn',
    on: ['サイ'], kun: ['いろど・る'],
    nho: 'Bên trái 采 (bàn TAY 爫 hái trên CÂY 木 — phần gợi âm サイ), bên phải 彡 (nét vẽ, màu): hái những bông hoa NHIỀU MÀU = SẮC MÀU → 色彩 (sắc màu), 多彩 (muôn màu), 彩る (tô điểm).',
    tu: [
      { w: '{色彩|しきさい}', ro: 'shikisai', vi: 'sắc màu (N2)' },
      { w: '{多彩|たさい}', ro: 'tasai', vi: 'muôn màu, đa dạng (N1)' },
      { w: '{彩|いろど}る', ro: 'irodoru', vi: 'tô điểm, làm rực rỡ (N1)' },
    ],
  },
  '宝': {
    hv: 'BẢO', nghia: 'của báu', en: 'treasure',
    on: ['ホウ'], kun: ['たから'],
    nho: 'Trên là 宀 (mái nhà), dưới là 玉 (viên ngọc): VIÊN NGỌC được cất kỹ dưới MÁI NHÀ = CỦA BÁU → 宝物 (báu vật), 国宝 (quốc bảo), 宝くじ (xổ số — đã gặp Bài 34).',
    tu: [
      { w: '{宝物|たからもの}', ro: 'takaramono', vi: 'báu vật, vật quý (N3)' },
      { w: '{宝石|ほうせき}', ro: 'houseki', vi: 'đá quý (N2)' },
      { w: '{国宝|こくほう}', ro: 'kokuhou', vi: 'quốc bảo' },
      { w: '{宝|たから}くじ', ro: 'takarakuji', vi: 'xổ số (Bài 34)' },
    ],
  },
  '魂': {
    hv: 'HỒN', nghia: 'linh hồn, tâm hồn', en: 'soul, spirit',
    on: ['コン'], kun: ['たましい'],
    nho: 'Bên trái 云 (mây — phần gợi âm コン/ウン), bên phải 鬼 (hồn ma): phần HỒN nhẹ bay lên như MÂY = LINH HỒN → 魂 (たましい), 魂を込める (dồn cả tâm hồn vào).',
    tu: [
      { w: '{魂|たましい}', ro: 'tamashii', vi: 'linh hồn, tâm hồn (N2)' },
      { w: '{魂|たましい}を{込|こ}める', ro: 'tamashii o komeru', vi: 'dồn cả tâm hồn vào' },
      { w: '{精魂|せいこん}', ro: 'seikon', vi: 'tâm huyết (精魂を込める — N1)' },
    ],
  },
  '底': {
    hv: 'ĐỂ', nghia: 'đáy', en: 'bottom',
    on: ['テイ'], kun: ['そこ'],
    nho: 'Bên ngoài 广 (mái hiên), bên trong 氐 (gốc, chỗ thấp nhất — phần gợi âm テイ; trông giống 低 "thấp" bỏ 亻): chỗ THẤP NHẤT dưới mái = ĐÁY → 底 (そこ), 到底 (rốt cuộc — đến tận đáy cũng không), 徹底 (triệt để — 徹 Bài 45).',
    tu: [
      { w: '{底|そこ}', ro: 'soko', vi: 'đáy (N3)' },
      { w: '{到底|とうてい}', ro: 'toutei', vi: '(～ない) hoàn toàn không thể (N2)' },
      { w: '{徹底的|てっていてき}', ro: 'tetteiteki', vi: 'triệt để (N2)' },
      { w: '{底力|そこぢから}', ro: 'sokojikara', vi: 'sức mạnh tiềm ẩn (N1)' },
      { w: '{心|こころ}の{底|そこ}から', ro: 'kokoro no soko kara', vi: 'từ tận đáy lòng' },
    ],
  },
  '殊': {
    hv: 'THÙ', nghia: 'khác thường, đặc biệt', en: 'special, unusual',
    on: ['シュ'], kun: ['こと'],
    nho: 'Bên trái 歹 (bộ xương tàn — cái chết), bên phải 朱 (màu đỏ son — phần gợi âm シュ): cái chết đổ máu ĐỎ là chuyện KHÁC THƯỜNG = ĐẶC THÙ → 特殊 (đặc thù), 殊に (đặc biệt là — văn viết).',
    tu: [
      { w: '{特殊|とくしゅ}', ro: 'tokushu', vi: 'đặc thù, đặc biệt (N2)' },
      { w: '{殊|こと}に', ro: 'koto ni', vi: 'đặc biệt là (văn viết — N1)' },
      { w: '{特殊|とくしゅ}メイク', ro: 'tokushu meiku', vi: 'hoá trang đặc biệt (phim)' },
    ],
  },
  '是': {
    hv: 'THỊ', nghia: 'đúng; là', en: 'right, correct',
    on: ['ゼ'], kun: [],
    nho: 'Trên là 日 (mặt trời), dưới là 疋 (biến thể của 正 "ngay"): như MẶT TRỜI đứng NGAY CHÍNH giữa trời = ĐÚNG → 是非 (đúng hay sai → "nhất định"), 是非とも (nhất định phải), 是正 (sửa cho đúng).',
    tu: [
      { w: '{是非|ぜひ}', ro: 'zehi', vi: 'nhất định (Bài 6 viết ぜひ); đúng sai' },
      { w: '{是非|ぜひ}とも', ro: 'zehi tomo', vi: 'nhất định phải, rất mong (N2)' },
      { w: '{是正|ぜせい}', ro: 'zesei', vi: 'chấn chỉnh, sửa sai (N1)' },
    ],
  },
  '非': {
    hv: 'PHI', nghia: 'không phải, sai; trái với', en: 'not, wrong',
    on: ['ヒ'], kun: [],
    nho: 'Hình hai hàng lông cánh chim XOÈ NGƯỢC chiều nhau, quay lưng vào nhau = TRÁI NGƯỢC → "không phải, sai" → 非常 (khác thường → cực kỳ), 非難 (chê trách), và đi đôi với 是 (đúng): 是非 = "đúng hay sai" → "bằng mọi giá, nhất định".',
    tu: [
      { w: '{非常|ひじょう}に', ro: 'hijou ni', vi: 'cực kỳ, vô cùng (N3)' },
      { w: '{是非|ぜひ}', ro: 'zehi', vi: 'nhất định (Bài 6 viết ぜひ)' },
      { w: '{非常口|ひじょうぐち}', ro: 'hijouguchi', vi: 'lối thoát hiểm' },
      { w: '{非難|ひなん}', ro: 'hinan', vi: 'chỉ trích, chê trách (N2)' },
      { w: '{非常識|ひじょうしき}', ro: 'hijoushiki', vi: 'thiếu ý thức thường tình (N2)' },
    ],
  },
  '超': {
    hv: 'SIÊU', nghia: 'vượt quá', en: 'exceed, super',
    on: ['チョウ'], kun: ['こ・える', 'こ・す'],
    nho: 'Bên trái-dưới 走 (chạy), bên trong 召 (gọi — phần gợi âm チョウ/ショウ): CHẠY vượt lên trước khi bị GỌI lại = VƯỢT QUÁ → 超える (vượt con số / giới hạn), 超過 (vượt mức), 超 (siêu — văn nói).',
    tu: [
      { w: '{超|こ}える', ro: 'koeru', vi: 'vượt quá (con số, giới hạn) (N2)' },
      { w: '{超過|ちょうか}', ro: 'chouka', vi: 'vượt mức (N2)' },
      { w: '{超|ちょう}', ro: 'chou', vi: 'siêu (văn nói: 超おいしい)' },
      { w: '{予想|よそう}を{超|こ}える', ro: 'yosou o koeru', vi: 'vượt ngoài dự đoán' },
    ],
  },
  '愛': {
    hv: 'ÁI', nghia: 'yêu thương', en: 'love',
    on: ['アイ'], kun: [],
    nho: 'Trên là 爫 (bàn tay) + 冖 (che), giữa là 心 (trái tim), dưới là 夂 (bước chân): TAY che chở TRÁI TIM mà vẫn BƯỚC đi bên nhau = YÊU THƯƠNG → 愛情 (tình thương — Bài 45), 愛着 (lòng gắn bó).',
    tu: [
      { w: '{愛情|あいじょう}', ro: 'aijou', vi: 'tình yêu thương (Bài 45)' },
      { w: '{愛着|あいちゃく}', ro: 'aichaku', vi: 'sự gắn bó, quyến luyến (N1)' },
      { w: '{愛|あい}する', ro: 'ai suru', vi: 'yêu (N3)' },
      { w: '{愛称|あいしょう}', ro: 'aishou', vi: 'tên thân mật (Bài 48)' },
    ],
  },
  '孝': {
    hv: 'HIẾU', nghia: 'hiếu thảo', en: 'filial piety',
    on: ['コウ'], kun: [],
    nho: 'Trên là 耂 (người GIÀ — nửa trên của 老), dưới là 子 (CON): đứa CON đỡ người GIÀ trên lưng = HIẾU THẢO → 親孝行 (hiếu thảo với cha mẹ), 親不孝 (bất hiếu).',
    tu: [
      { w: '{親孝行|おやこうこう}', ro: 'oyakoukou', vi: 'hiếu thảo với cha mẹ (N2)' },
      { w: '{親不孝|おやふこう}', ro: 'oyafukou', vi: 'bất hiếu (N2)' },
      { w: '{孝行|こうこう}', ro: 'koukou', vi: 'lòng hiếu thảo' },
    ],
  },
  '犠': {
    hv: 'HI', nghia: 'con vật tế; hi sinh', en: 'sacrifice',
    on: ['ギ'], kun: [],
    nho: 'Bên trái 牛 (con bò), bên phải 義 (nghĩa — phần gợi âm ギ): con BÒ dâng lên tế lễ vì đại NGHĨA = vật tế → 犠牲 (hi sinh). Chữ này gần như chỉ gặp trong 犠牲.',
    tu: [
      { w: '{犠牲|ぎせい}', ro: 'gisei', vi: 'sự hi sinh (N2)' },
      { w: '{犠牲|ぎせい}にする', ro: 'gisei ni suru', vi: 'hi sinh (cái gì) cho…' },
      { w: '{犠牲者|ぎせいしゃ}', ro: 'giseisha', vi: 'nạn nhân (thảm hoạ, chiến tranh)' },
    ],
  },
  '牲': {
    hv: 'SINH', nghia: 'con vật tế', en: 'sacrificial animal',
    on: ['セイ'], kun: [],
    nho: 'Bên trái 牛 (con bò), bên phải 生 (sống — phần gợi âm セイ): con BÒ còn SỐNG dâng lên thần = vật tế. Học CHUNG với 犠 — cả hai cùng bộ 牛, chỉ ghép thành 犠牲.',
    tu: [
      { w: '{犠牲|ぎせい}', ro: 'gisei', vi: 'sự hi sinh (N2)' },
      { w: '{犠牲|ぎせい}を{払|はら}う', ro: 'gisei o harau', vi: 'trả giá bằng sự hi sinh' },
    ],
  },
  '叫': {
    hv: 'KHIẾU', nghia: 'kêu, la hét', en: 'shout',
    on: ['キョウ'], kun: ['さけ・ぶ'],
    nho: 'Bên trái 口 (miệng), bên phải 丩 (hai sợi dây xoắn vào nhau — phần gợi âm キョウ): MIỆNG gào lên như sợi dây bị VẶN XOẮN = LA HÉT → 叫ぶ (hét — từ Bài 45), 叫び (tiếng thét), 絶叫 (gào thét).',
    tu: [
      { w: '{叫|さけ}ぶ', ro: 'sakebu', vi: 'la, hét (Bài 45)' },
      { w: '{叫|さけ}び', ro: 'sakebi', vi: 'tiếng hét; tiếng lòng' },
      { w: '{絶叫|ぜっきょう}', ro: 'zekkyou', vi: 'gào thét (N1)' },
    ],
  },
  '祈': {
    hv: 'KỲ', nghia: 'cầu khấn', en: 'pray',
    on: ['キ'], kun: ['いの・る'],
    nho: 'Bên trái 礻 (bàn thờ, thần linh), bên phải 斤 (cái rìu — phần gợi âm キ): đứng trước BÀN THỜ khấn xin = CẦU NGUYỆN → 祈る, 祈り, 祈願 (cầu khấn ở đền).',
    tu: [
      { w: '{祈|いの}る', ro: 'inoru', vi: 'cầu nguyện, cầu mong (N2)' },
      { w: '{祈|いの}り', ro: 'inori', vi: 'lời cầu nguyện' },
      { w: 'ご{成功|せいこう}をお{祈|いの}りします', ro: 'goseikou o oinori shimasu', vi: 'chúc thành công (thư từ)' },
      { w: '{祈願|きがん}', ro: 'kigan', vi: 'cầu khấn (N1)' },
    ],
  },
  '稼': {
    hv: 'GIÁ', nghia: 'làm ăn, kiếm tiền', en: 'earn',
    on: ['カ'], kun: ['かせ・ぐ'],
    nho: 'Bên trái 禾 (cây lúa), bên phải 家 (nhà — phần gợi âm カ): mang LÚA làm được về NHÀ = LÀM ĂN, KIẾM SỐNG → 稼ぐ (kiếm tiền), 稼働 (máy, hệ thống đang chạy — từ hay gặp ở công ty IT).',
    tu: [
      { w: '{稼|かせ}ぐ', ro: 'kasegu', vi: 'kiếm (tiền) (N2)' },
      { w: '{稼|かせ}ぎ', ro: 'kasegi', vi: 'tiền kiếm được' },
      { w: '{稼働|かどう}', ro: 'kadou', vi: '(máy, hệ thống) vận hành (N1)' },
      { w: '{時間|じかん}を{稼|かせ}ぐ', ro: 'jikan o kasegu', vi: 'câu giờ, kéo thêm thời gian' },
    ],
  },
  '繰': {
    hv: 'SÀO', nghia: 'kéo (sợi); lần lượt', en: 'reel, repeat',
    on: [], kun: ['く・る'],
    nho: 'Bên trái 糸 (sợi tơ), bên phải 喿 (ba cái miệng chim ríu rít trên cây 木): tay KÉO SỢI tơ ra từng vòng, vòng này nối vòng kia = LẦN LƯỢT → 繰り返す (lặp lại), 繰り上げる (đẩy lên sớm hơn).',
    tu: [
      { w: '{繰|く}り{返|かえ}す', ro: 'kurikaesu', vi: 'lặp lại (N3)' },
      { w: '{繰|く}り{返|かえ}し', ro: 'kurikaeshi', vi: 'sự lặp lại' },
      { w: '{繰|く}り{上|あ}げる', ro: 'kuriageru', vi: 'đẩy (lịch) lên sớm (N1)' },
      { w: '{繰|く}り{越|こ}す', ro: 'kurikosu', vi: 'chuyển sang kỳ sau (N1)' },
    ],
  },
};
