/**
 * Chữ Hán MỚI của Bài 50 (比較 — So sánh · tiếp sau sách, cấp N2) cho thẻ chữ Hán — cùng định dạng hanTu.ts.
 * 24 chữ: 顕 照 双 圧 概 純 矛 盾 裏 狭 豪 華 硬 軟 敏 繊 皮 恵 乏 裕 虚 凡 群 偉 — bảng `b50-han-tu` trong bai50.ts.
 * Không trùng hanTu.ts, hanTu16–49.ts, hanTuTiep.ts, hanLop.ts và các bảng chữ Hán Bài 1–49 (kiểm lại 09/11 bằng script sau khi
 * Bài 48/49 chốt — 1.172 chữ đã dạy; Bài 48 = 坂 谷 岸 浜 湾 丘 郷 称 縁 遺 釈 慌 遭 詰 陥 嘆 懸 拠 錯 冗 愚 芸 賢 穏 · Bài 49 = 伴 衰 繁 緩 鈍 膨
 * 瞬 徐 著 兆 昇 沈 浮 透 頻 郊 疎 密 革 導 枯 芽 潮 幅).
 * Cấp chữ theo các bảng tham khảo phổ biến (JLPT không công bố danh sách chữ chính thức): 照 裏 狭 硬 皮 偉 群 nhiều bảng xếp N3–N2;
 * 圧 純 華 豪 軟 敏 恵 乏 裕 虚 凡 双 概 phần lớn bảng xếp N2; 顕 矛 盾 繊 nhiều bảng xếp N1 nhưng TỪ chứa chúng (顕著・矛盾・繊細) là
 * từ N2 hay gặp trong bài đọc.
 * On / Kun theo bảng thường dụng (常用): 顕 圧 概 純 豪 敏 繊 裕 chỉ có âm On; 虚 chỉ có On キョ・コ (むなしい viết 空しい trong bảng —
 * 虚しい là cách viết ngoài bảng); 恵 có On ケイ・エ + Kun めぐ・む; 凡 có On ボン・ハン; 華 có On カ・ケ + Kun はな; 群 có Kun む・れる／む・れ／
 * むら; 狭 có Kun せま・い／せば・める／せば・まる; 軟 có Kun やわ・らか／やわ・らかい.
 * Cách nhớ: theo cấu tạo chữ (phần chỉ nghĩa + phần gợi âm của chữ hình thanh ghi rõ). Từ đi chung ưu tiên từ dùng trong bai50.ts và
 * từ đã học ở bài trước (謙虚 Bài 37, 平凡 Bài 43, 一概に Bài 43, 余裕 Bài 34, 裏切る Bài 47, 照れる Bài 45, 狭い Bài 15…).
 * Tệp chỉ có `import type` — tải chậm như hanTu.ts.
 */
import type { HanTu } from '@/components/sach-hoc/kanji';

export const HAN_TU_50: Record<string, HanTu> = {
  '顕': {
    hv: 'HIỂN', nghia: 'rõ ràng, lộ ra (dễ thấy)', en: 'manifest / evident',
    on: ['ケン'], kun: [],
    nho: 'Trái là 㬎 (日 mặt trời + những sợi tơ đem phơi), phải là 頁 (cái đầu): TƠ PHƠI DƯỚI NẮNG, NGẨNG ĐẦU LÀ THẤY RÕ = HIỂN (hiển hiện). 顕著 = "rõ (顕) và nổi bật (著)" → khác biệt thấy ngay. ⚠ 頁 cũng có trong 頭・顔・題 — chữ nào có 頁 thường liên quan tới đầu / mặt.',
    tu: [
      { w: '{顕著|けんちょ}', ro: 'kencho', vi: 'rõ rệt, nổi bật (N1 — Bài 50)' },
      { w: '{顕著|けんちょ}な{差|さ}', ro: 'kencho na sa', vi: 'sự chênh lệch rõ rệt' },
      { w: '{顕微鏡|けんびきょう}', ro: 'kenbikyou', vi: 'kính hiển vi' },
    ],
  },
  '照': {
    hv: 'CHIẾU', nghia: 'chiếu sáng; đối chiếu', en: 'shine / compare',
    on: ['ショウ'], kun: ['て・る', 'て・らす', 'て・れる'],
    nho: 'Trên là 昭 (sáng rực, gợi âm ショウ), dưới là 灬 (lửa): LỬA TO LÀM SÁNG RỰC = CHIẾU → 照らす (rọi sáng). Đặt hai thứ cạnh nhau dưới ánh đèn mà nhìn = 対照 (đối chiếu) → 対照的 (trái ngược hẳn). ⚠ 照れる (ngượng — Bài 45) cũng là chữ này: mặt "nóng đỏ như lửa".',
    tu: [
      { w: '{対照的|たいしょうてき}', ro: 'taishouteki', vi: 'tương phản, trái ngược hẳn (N2 — Bài 50)' },
      { w: '{参照|さんしょう}する', ro: 'sanshou suru', vi: 'tham khảo, xem (tài liệu)' },
      { w: '{照|て}らす', ro: 'terasu', vi: 'chiếu sáng, rọi' },
      { w: '{照|て}れる', ro: 'tereru', vi: 'ngượng ngùng (Bài 45)' },
    ],
  },
  '双': {
    hv: 'SONG', nghia: 'đôi, cả hai', en: 'pair / both',
    on: ['ソウ'], kun: ['ふた'],
    nho: 'Hai chữ 又 (bàn tay) đứng cạnh nhau: HAI BÀN TAY = một đôi = SONG → 双方 (cả hai phía), 双子 (sinh đôi). ⚠ Đừng nhầm với 友 (とも — bạn): 友 chỉ có MỘT 又.',
    tu: [
      { w: '{双方|そうほう}', ro: 'souhou', vi: 'cả hai bên, song phương (N1 — Bài 50)' },
      { w: '{双子|ふたご}', ro: 'futago', vi: 'anh chị em sinh đôi' },
      { w: '{双眼鏡|そうがんきょう}', ro: 'sougankyou', vi: 'ống nhòm' },
    ],
  },
  '圧': {
    hv: 'ÁP', nghia: 'đè, ép; áp lực', en: 'pressure',
    on: ['アツ'], kun: [],
    nho: 'Ngoài là 厂 (vách đá), trong là 土 (đất): ĐẤT BỊ VÁCH ĐÁ ĐÈ NÉN xuống = ÁP → 圧力 (áp lực), 気圧 (khí áp). 圧倒的 = "đè (圧) cho đổ (倒)" → áp đảo, hơn hẳn. ⚠ 庄・圧 khác: 圧 không có nét chấm ở trên.',
    tu: [
      { w: '{圧倒的|あっとうてき}', ro: 'attouteki', vi: 'áp đảo, vượt trội hẳn (N2 — Bài 50)' },
      { w: '{圧力|あつりょく}', ro: 'atsuryoku', vi: 'áp lực, sức ép' },
      { w: '{気圧|きあつ}', ro: 'kiatsu', vi: 'khí áp' },
      { w: '{血圧|けつあつ}', ro: 'ketsuatsu', vi: 'huyết áp' },
    ],
  },
  '概': {
    hv: 'KHÁI', nghia: 'đại khái, khái quát', en: 'general / outline',
    on: ['ガイ'], kun: [],
    nho: 'Trái là 木 (gỗ), phải là 既 (đã, gợi âm キ→ガイ): thời xưa là thanh gỗ GẠT NGANG miệng đấu gạo cho bằng — không đếm từng hạt, chỉ "lấy đại thể" = KHÁI → 概要 (tóm tắt), 一概に (gộp tất cả làm một → 一概に～とは言えない). ⚠ 既 (すでに) đứng riêng không có 木.',
    tu: [
      { w: '{一概|いちがい}に', ro: 'ichigai ni', vi: '(không thể) vơ đũa cả nắm mà nói (Bài 43)' },
      { w: '{概|がい}して', ro: 'gai shite', vi: 'nói chung, đại thể (N1 — Bài 50)' },
      { w: '{概要|がいよう}', ro: 'gaiyou', vi: 'tóm tắt, khái quát (N2)' },
      { w: '{大概|たいがい}', ro: 'taigai', vi: 'phần lớn, thường thì' },
    ],
  },
  '純': {
    hv: 'THUẦN', nghia: 'thuần, trong sạch, không pha', en: 'pure',
    on: ['ジュン'], kun: [],
    nho: 'Trái là 糸 (sợi tơ), phải là 屯 (mầm cây mới nhú, gợi âm トン→ジュン): SỢI TƠ MỚI, CHƯA NHUỘM = THUẦN (nguyên chất) → 純粋 (thuần khiết), 単純 (đơn thuần). ⚠ 鈍 (にぶい — chữ Bài 49) có cùng 屯 nhưng bên trái là 金.',
    tu: [
      { w: '{単純|たんじゅん}', ro: 'tanjun', vi: 'đơn giản, đơn thuần (N2 — Bài 50)' },
      { w: '{単純|たんじゅん}に{比|くら}べる', ro: 'tanjun ni kuraberu', vi: 'so sánh một cách đơn giản' },
      { w: '{純粋|じゅんすい}', ro: 'junsui', vi: 'thuần khiết, trong sáng (N2)' },
    ],
  },
  '矛': {
    hv: 'MÂU', nghia: 'cái giáo (mâu)', en: 'spear / halberd',
    on: ['ム'], kun: ['ほこ'],
    nho: 'Cả chữ vẽ một CÂY GIÁO cán dài có móc = MÂU. Đi với 盾 (cái khiên) thành 矛盾 — chuyện cổ: người bán "giáo đâm thủng mọi khiên" và "khiên không giáo nào đâm thủng" → lời nói tự đá nhau = MÂU THUẪN. ⚠ 予 (よ — 予想) trông giống nhưng thiếu nét phẩy bên phải.',
    tu: [
      { w: '{矛盾|むじゅん}', ro: 'mujun', vi: 'mâu thuẫn (N2 — Bài 50)' },
      { w: '{矛先|ほこさき}', ro: 'hokosaki', vi: 'mũi giáo; mũi dùi (công kích) (N1)' },
    ],
  },
  '盾': {
    hv: 'THUẪN', nghia: 'cái khiên', en: 'shield',
    on: ['ジュン'], kun: ['たて'],
    nho: 'Nét 厂 + 十 là TẤM KHIÊN dựng đứng, bên dưới là 目 (con mắt) núp sau khiên = THUẪN (cái khiên). 矛 (giáo) + 盾 (khiên) = 矛盾. ⚠ 循 (じゅん — 循環) có thêm 彳 bên trái.',
    tu: [
      { w: '{矛盾|むじゅん}', ro: 'mujun', vi: 'mâu thuẫn' },
      { w: '{盾|たて}', ro: 'tate', vi: 'cái khiên' },
      { w: '{後|うし}ろ{盾|だて}', ro: 'ushirodate', vi: 'chỗ dựa, người đỡ đầu (N1)' },
    ],
  },
  '裏': {
    hv: 'LÝ', nghia: 'mặt trái, mặt sau, bên trong', en: 'back / reverse side',
    on: ['リ'], kun: ['うら'],
    nho: 'Chữ 衣 (áo) bị tách làm hai, kẹp ở giữa là 里 (làng, gợi âm リ): PHẦN NẰM BÊN TRONG CÁI ÁO = mặt trái = LÝ → 裏 (mặt sau), 裏腹 (bụng và lưng → trái ngược), 裏切る (Bài 47 — "cắt từ phía sau"). ⚠ 表 (おもて — mặt trước) cũng có 衣 bên dưới.',
    tu: [
      { w: '{裏|うら}', ro: 'ura', vi: 'mặt sau, mặt trái' },
      { w: '{裏腹|うらはら}', ro: 'urahara', vi: 'trái ngược (lời ↔ lòng) (N1 — Bài 50)' },
      { w: '{裏目|うらめ}に{出|で}る', ro: 'urame ni deru', vi: 'phản tác dụng (Bài 50)' },
      { w: '{裏切|うらぎ}る', ro: 'uragiru', vi: 'phản bội (Bài 47)' },
    ],
  },
  '狭': {
    hv: 'HIỆP', nghia: 'hẹp, chật', en: 'narrow',
    on: ['キョウ'], kun: ['せま・い', 'せば・める', 'せば・まる'],
    nho: 'Trái là 犭 (con thú), phải là 夹 (kẹp ở giữa, gợi âm キョウ): CON THÚ BỊ KẸP GIỮA HAI VÁCH = chật hẹp = HIỆP → 狭い. ⚠ 挟 (はさむ — kẹp) cùng phần phải nhưng bên trái là 扌 (tay).',
    tu: [
      { w: '{狭|せま}い', ro: 'semai', vi: 'hẹp, chật (Bài 15)' },
      { w: '{狭|せば}める', ro: 'sebameru', vi: 'thu hẹp' },
      { w: '{視野|しや}が{狭|せま}い', ro: 'shiya ga semai', vi: 'tầm nhìn hẹp' },
    ],
  },
  '豪': {
    hv: 'HÀO', nghia: 'hào hoa, lớn lao, mạnh', en: 'grand / powerful',
    on: ['ゴウ'], kun: [],
    nho: 'Trên là phần đầu của 高 (cao, gợi âm コウ→ゴウ), dưới là 豕 (con heo rừng / con nhím lông dựng): CON THÚ LÔNG DỰNG CAO, TRÔNG OAI = HÀO (hào hùng, hào nhoáng) → 豪華 (xa hoa), 豪雨 (mưa như trút). ⚠ 家 (いえ) dưới cũng là 豕 nhưng trên là 宀.',
    tu: [
      { w: '{豪華|ごうか}', ro: 'gouka', vi: 'xa hoa, sang trọng (N2 — Bài 50)' },
      { w: '{豪雨|ごうう}', ro: 'gouu', vi: 'mưa lớn, mưa như trút (N2)' },
      { w: '{豪快|ごうかい}', ro: 'goukai', vi: 'phóng khoáng, mạnh mẽ (N1)' },
    ],
  },
  '華': {
    hv: 'HOA', nghia: 'hoa; rực rỡ, lộng lẫy', en: 'flower / splendor',
    on: ['カ', 'ケ'], kun: ['はな'],
    nho: 'Trên là 艹 (cỏ cây), dưới là cành cây trĩu nặng HOA NỞ CHI CHÍT = HOA (rực rỡ) → 華やか (lộng lẫy), 豪華 (xa hoa), 中華 (Trung Hoa — 中華料理). ⚠ 花 (はな — bông hoa thường ngày) đơn giản hơn; 華 thiên về "vẻ rực rỡ".',
    tu: [
      { w: '{豪華|ごうか}', ro: 'gouka', vi: 'xa hoa, sang trọng' },
      { w: '{華|はな}やか', ro: 'hanayaka', vi: 'lộng lẫy, rực rỡ (N2)' },
      { w: '{中華料理|ちゅうかりょうり}', ro: 'chuuka ryouri', vi: 'món ăn Trung Hoa' },
    ],
  },
  '硬': {
    hv: 'NGẠNH', nghia: 'cứng', en: 'hard / stiff',
    on: ['コウ'], kun: ['かた・い'],
    nho: 'Trái là 石 (đá), phải là 更 (gợi âm コウ): CỨNG NHƯ ĐÁ = NGẠNH → 硬い (cứng, cứng nhắc), 硬貨 (tiền xu). ⚠ Ba chữ cùng đọc かたい: 固い (chắc, khó lay — 頭が固い), 硬い (cứng như đá — 表情が硬い), 堅い (vững chắc, nghiêm túc — 堅い仕事).',
    tu: [
      { w: '{硬|かた}い', ro: 'katai', vi: 'cứng; cứng nhắc (biểu cảm, văn phong) (Bài 50)' },
      { w: '{硬貨|こうか}', ro: 'kouka', vi: 'tiền xu (N2)' },
      { w: '{表情|ひょうじょう}が{硬|かた}い', ro: 'hyoujou ga katai', vi: 'nét mặt căng cứng' },
    ],
  },
  '軟': {
    hv: 'NHUYỄN', nghia: 'mềm', en: 'soft',
    on: ['ナン'], kun: ['やわ・らか', 'やわ・らかい'],
    nho: 'Trái là 車 (xe), phải là 欠 (há miệng, cong người xuống): BÁNH XE BỌC THỨ MỀM, LÚN XUỐNG = NHUYỄN (mềm) → 柔軟 (mềm dẻo, linh hoạt). ⚠ Hằng ngày やわらかい thường viết 柔らかい (柔); 軟らかい dùng cho thứ mềm về chất ({軟|やわ}らかい{土|つち}).',
    tu: [
      { w: '{柔軟|じゅうなん}', ro: 'juunan', vi: 'mềm dẻo, linh hoạt (N2)' },
      { w: '{柔軟|じゅうなん}な{考|かんが}え{方|かた}', ro: 'juunan na kangaekata', vi: 'cách nghĩ linh hoạt' },
      { w: '{軟|やわ}らかい', ro: 'yawarakai', vi: 'mềm (về chất)' },
    ],
  },
  '敏': {
    hv: 'MẪN', nghia: 'nhạy, nhanh nhẹn', en: 'quick / sensitive',
    on: ['ビン'], kun: [],
    nho: 'Trái là 毎 (mỗi, gợi âm マイ→ビン), phải là 攵 (cầm roi, hành động): LÚC NÀO CŨNG SẴN TAY HÀNH ĐỘNG = nhanh nhạy = MẪN → 敏感 (nhạy cảm), 機敏 (nhanh nhẹn). ⚠ 毎 (まい — 毎日) đứng riêng không có 攵.',
    tu: [
      { w: '{敏感|びんかん}', ro: 'binkan', vi: 'nhạy cảm (N2 — Bài 50; gặp ở Bài 32)' },
      { w: '{過敏|かびん}', ro: 'kabin', vi: 'quá nhạy cảm, dị ứng (N1)' },
      { w: '{機敏|きびん}', ro: 'kibin', vi: 'nhanh nhẹn, lanh lợi (N1)' },
    ],
  },
  '繊': {
    hv: 'TIÊM', nghia: 'mảnh, nhỏ như sợi', en: 'slender / fine',
    on: ['セン'], kun: [],
    nho: 'Trái là 糸 (sợi tơ), phải là 韱 (cọng hẹ mảnh, gợi âm セン): MẢNH NHƯ SỢI TƠ = TIÊM → 繊細 (tinh tế, mỏng manh), 繊維 (sợi — 維 Bài 47). Chữ có nhiều nét — chỉ cần nhận mặt: "糸 + nhiều nét nhỏ li ti".',
    tu: [
      { w: '{繊細|せんさい}', ro: 'sensai', vi: 'tinh tế; mỏng manh, dễ tổn thương (N2 — Bài 50)' },
      { w: '{繊維|せんい}', ro: 'sen\'i', vi: 'sợi, chất xơ (N2)' },
    ],
  },
  '皮': {
    hv: 'BÌ', nghia: 'da, vỏ', en: 'skin / peel',
    on: ['ヒ'], kun: ['かわ'],
    nho: 'Hình BÀN TAY (又) đang LỘT TẤM DA treo trên móc = BÌ (da, vỏ) → 皮 (vỏ — みかんの皮), 皮肉 ("da và thịt" — chỉ chạm vào bề ngoài mà châm chích → mỉa mai; 皮肉なことに = trớ trêu thay). ⚠ 波 (なみ — Bài 46) = 氵 + 皮, 彼 (かれ) = 彳 + 皮, 被 = 衤 + 皮: 皮 gợi âm ヒ／ハ.',
    tu: [
      { w: '{皮肉|ひにく}', ro: 'hiniku', vi: 'mỉa mai; trớ trêu (N2 — Bài 50)' },
      { w: '{皮肉|ひにく}なことに', ro: 'hiniku na koto ni', vi: 'trớ trêu thay' },
      { w: '{皮|かわ}', ro: 'kawa', vi: 'vỏ, da' },
      { w: '{皮膚|ひふ}', ro: 'hifu', vi: 'da (người) (N2)' },
    ],
  },
  '恵': {
    hv: 'HUỆ', nghia: 'ơn huệ, ban ơn', en: 'blessing / favor',
    on: ['ケイ', 'エ'], kun: ['めぐ・む'],
    nho: 'Trên là 叀 (con suốt quay tơ — đều đặn, chu đáo), dưới là 心 (lòng): TẤM LÒNG CHU ĐÁO BAN CHO NGƯỜI KHÁC = HUỆ (ơn huệ) → 恵まれる (được ban cho, may mắn có), 恩恵 (ân huệ — 恩 Bài 45), 知恵 (trí khôn — đọc ちえ). ⚠ 専 (せん — 専門) phần trên giống nhưng dưới là 寸.',
    tu: [
      { w: '{恵|めぐ}まれる', ro: 'megumareru', vi: 'được may mắn có, được ưu đãi (N2 — Bài 50)' },
      { w: '{恩恵|おんけい}', ro: 'onkei', vi: 'ân huệ, lợi ích được hưởng (N1)' },
      { w: '{知恵|ちえ}', ro: 'chie', vi: 'trí khôn, sáng kiến (N2)' },
    ],
  },
  '乏': {
    hv: 'PHẠP', nghia: 'thiếu thốn', en: 'scarce / lack',
    on: ['ボウ'], kun: ['とぼ・しい'],
    nho: 'Hình chữ 之 (đi) bị bẻ ngược, thêm một nét phẩy trên đầu: ĐI MÃI MÀ KHÔNG CÒN GÌ TRONG TAY = thiếu = PHẠP → 乏しい (nghèo nàn, ít ỏi), 貧乏 (nghèo — đọc びんぼう). Chữ chỉ 4 nét — nên viết được.',
    tu: [
      { w: '{乏|とぼ}しい', ro: 'toboshii', vi: 'thiếu, nghèo nàn (N2 — Bài 50)' },
      { w: '{経験|けいけん}に{乏|とぼ}しい', ro: 'keiken ni toboshii', vi: 'ít kinh nghiệm' },
      { w: '{貧乏|びんぼう}', ro: 'binbou', vi: 'nghèo (N2)' },
    ],
  },
  '裕': {
    hv: 'DỤ', nghia: 'dư dả, rộng rãi', en: 'abundant / ample',
    on: ['ユウ'], kun: [],
    nho: 'Trái là 衤 (áo), phải là 谷 (thung lũng — chữ Bài 48, gợi âm ヨク→ユウ): ÁO RỘNG NHƯ THUNG LŨNG = dư dả = DỤ → 余裕 (dư dả thời gian / tiền / tinh thần), 裕福 (giàu có). ⚠ 浴 (よく — 入浴) cùng 谷 nhưng bên trái là 氵.',
    tu: [
      { w: '{余裕|よゆう}', ro: 'yoyuu', vi: 'sự dư dả, thong thả (Bài 34)' },
      { w: '{裕福|ゆうふく}', ro: 'yuufuku', vi: 'giàu có, sung túc (N1)' },
      { w: '{余裕|よゆう}がある', ro: 'yoyuu ga aru', vi: 'có dư (thời gian, tiền), thong dong' },
    ],
  },
  '虚': {
    hv: 'HƯ', nghia: 'trống rỗng, không thật', en: 'empty / false',
    on: ['キョ', 'コ'], kun: [],
    nho: 'Trên là 虍 (đầu con hổ), dưới là 业 (cái gò): ĐẦU HỔ TRÊN GÒ ĐẤT TRỐNG — bên trong chẳng có gì = HƯ (rỗng, hư không) → 謙虚 ("khiêm + để lòng trống" → khiêm tốn — Bài 37), 虚偽 (dối trá). ⚠ むなしい trong bảng thường dụng viết 空しい; 虚しい là cách viết ngoài bảng.',
    tu: [
      { w: '{謙虚|けんきょ}', ro: 'kenkyo', vi: 'khiêm tốn (Bài 37)' },
      { w: '{虚偽|きょぎ}', ro: 'kyogi', vi: 'dối trá, không đúng sự thật (N1)' },
      { w: '{空虚|くうきょ}', ro: 'kuukyo', vi: 'trống rỗng (N1)' },
    ],
  },
  '凡': {
    hv: 'PHÀM', nghia: 'tầm thường, bình thường; nói chung', en: 'ordinary / commonplace',
    on: ['ボン', 'ハン'], kun: [],
    nho: 'Hình CÁI KHAY / CÁNH BUỒM đơn sơ với một nét chấm: thứ AI CŨNG CÓ, chẳng có gì đặc biệt = PHÀM → 平凡 (bình thường — Bài 43), 非凡 (phi phàm). ⚠ 風 (かぜ) và 帆 (ほ — cánh buồm) chứa phần giống 凡.',
    tu: [
      { w: '{平凡|へいぼん}', ro: 'heibon', vi: 'bình thường, tầm thường (Bài 43)' },
      { w: '{非凡|ひぼん}', ro: 'hibon', vi: 'phi phàm, xuất chúng (N1)' },
      { w: '{凡人|ぼんじん}', ro: 'bonjin', vi: 'người thường (N1)' },
    ],
  },
  '群': {
    hv: 'QUẦN', nghia: 'bầy, đàn, nhóm', en: 'group / flock',
    on: ['グン'], kun: ['む・れる', 'む・れ', 'むら'],
    nho: 'Trái là 君 (ông chủ, gợi âm クン→グン), phải là 羊 (con cừu): ĐÀN CỪU QUÂY QUANH NGƯỜI CHĂN = QUẦN (bầy) → 群れ (đàn). 抜群 = "nhô (抜) ra khỏi bầy (群)" → xuất sắc vượt trội. ⚠ 郡 (ぐん — quận, huyện) = 君 + 阝.',
    tu: [
      { w: '{抜群|ばつぐん}', ro: 'batsugun', vi: 'xuất sắc vượt trội (N2 — Bài 50)' },
      { w: '{群|む}れ', ro: 'mure', vi: 'bầy, đàn' },
      { w: '{群衆|ぐんしゅう}', ro: 'gunshuu', vi: 'đám đông (N1)' },
    ],
  },
  '偉': {
    hv: 'VĨ', nghia: 'vĩ đại, giỏi giang', en: 'great / admirable',
    on: ['イ'], kun: ['えら・い'],
    nho: 'Trái là 亻 (người), phải là 韋 (gợi âm イ — vốn là tấm da thuộc bao quanh): NGƯỜI ĐỨNG NỔI HẲN LÊN GIỮA MỌI NGƯỜI = VĨ → 偉い (giỏi, đáng nể; 偉そう = ra vẻ ta đây), 偉大 (vĩ đại). ⚠ 違 (ちがう) = 辶 + 韋, 緯 (い — 経緯) = 糸 + 韋.',
    tu: [
      { w: '{偉|えら}い', ro: 'erai', vi: 'giỏi, đáng nể; có địa vị (Bài 24)' },
      { w: '{偉|えら}そう', ro: 'erasou', vi: 'ra vẻ ta đây (Bài 28)' },
      { w: '{偉大|いだい}', ro: 'idai', vi: 'vĩ đại (N2 — Bài 50)' },
    ],
  },
};
