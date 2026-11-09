/**
 * Chữ Hán MỚI của Bài 39 (聴解 N3 — tiếp sau sách, cấp N3) cho thẻ chữ Hán — cùng định dạng hanTu.ts.
 * 21 chữ: 聴 符 往 換 駐 輪 渋 滞 税 替 領 振 算 症 傷 希 補 却 訂 催 請 (N3–N2 theo các bảng tham khảo phổ biến; 聴・渋・滞・却・
 * 訂・催・請 nhiều bảng xếp N2 nhưng các từ 聴解・渋滞・返却・訂正・開催・申請 rất hay gặp ở bài nghe / thông báo N3 — JLPT không công bố
 * danh sách chữ chính thức) — bảng `b39-han-tu` trong bai39.ts.
 * Chủ đề: chữ của những nơi đề 聴解 hay đặt bối cảnh — nhà ga & đường phố (符 往 換 駐 輪 渋 滞), cửa hàng & quầy thủ tục (税 替 領 振
 * 算 請 却 訂), bệnh viện (症 傷), trường học & sự kiện (補 希 催) và chính việc NGHE (聴).
 * Cách nhớ: theo cấu tạo chữ (phần chỉ nghĩa + phần gợi âm của chữ hình thanh ghi rõ). Từ đi chung ưu tiên từ dùng trong bai39.ts và
 * từ đã học ở bài trước (切符 Bài 13, 往復 Bài 17, 乗り換えます・両替します Bài 17, 取り替えます Bài 18, 駐輪場 Bài 14, 着替えます Bài 23,
 * 振り込みます Bài 26, 渋滞 Bài 27, 症状 Bài 29, 希望します Bài 30, 申請 Bài 37, 交換・返却 Bài 38, 予算 Bài 17).
 * On / Kun theo bảng thường dụng (常用): 符 往 駐 税 領 算 症 希 却 訂 chỉ có âm On; 請 có On セイ・シン (普請 — N1); 希 có On キ (ケ chỉ
 * trong từ hiếm).
 * Tệp chỉ có `import type` — tải chậm như hanTu.ts.
 */
import type { HanTu } from '@/components/sach-hoc/kanji';

export const HAN_TU_39: Record<string, HanTu> = {
  '聴': {
    hv: 'THÍNH', nghia: 'nghe (chăm chú)', en: 'listen attentively',
    on: ['チョウ'], kun: ['き・く'],
    nho: 'Bên trái 耳 (cái tai), bên phải 十 + 罒 (mắt) + 心 (tim) — cùng phần phải với 徳: NGHE BẰNG TAI, MẮT VÀ CẢ TRÁI TIM = nghe chăm chú → 聴解, 聴く (nghe nhạc, nghe giảng). 聞く là nghe thấy nói chung; 聴く là chủ động lắng nghe.',
    tu: [
      { w: '{聴解|ちょうかい}', ro: 'choukai', vi: 'nghe hiểu (phần thi nghe)' },
      { w: '{聴|き}く', ro: 'kiku', vi: 'lắng nghe (nhạc, bài giảng)' },
      { w: '{視聴者|しちょうしゃ}', ro: 'shichousha', vi: 'người xem (TV) (N2)' },
      { w: '{聴衆|ちょうしゅう}', ro: 'choushuu', vi: 'thính giả (N1)' },
    ],
  },
  '符': {
    hv: 'PHÙ', nghia: 'thẻ, phù hiệu; ký hiệu', en: 'token / sign',
    on: ['フ'], kun: [],
    nho: 'Trên ⺮ (tre), dưới 付 (gợi âm フ; trao cho): THẺ TRE CHẺ ĐÔI, MỖI BÊN GIỮ MỘT NỬA ĐỂ ĐỐI CHIẾU = phù hiệu → thẻ đi đường → 切符 (vé); dấu để nhận ra → 符号, 音符. Cùng 付: 府 (广 trên — Bài 38), 附 — đều đọc フ.',
    tu: [
      { w: '{切符|きっぷ}', ro: 'kippu', vi: 'vé (tàu, xe)' },
      { w: '{音符|おんぷ}', ro: 'onpu', vi: 'nốt nhạc' },
      { w: '{符号|ふごう}', ro: 'fugou', vi: 'ký hiệu, mã (N1)' },
    ],
  },
  '往': {
    hv: 'VÃNG', nghia: 'đi tới, qua lại', en: 'go / journey',
    on: ['オウ'], kun: [],
    nho: 'Bên trái 彳 (bước chân đi), bên phải 主 (vốn là phần gợi âm): BƯỚC CHÂN ĐI TỚI = vãng → 往復 (đi và về). ⚠ Đừng nhầm với 住 (ở — 亻 bên trái): 往 có 彳 vì là ĐI, 住 có 亻 vì là NGƯỜI ở.',
    tu: [
      { w: '{往復|おうふく}', ro: 'oufuku', vi: 'khứ hồi, đi và về' },
      { w: '{往来|おうらい}', ro: 'ourai', vi: 'sự qua lại (đường phố) (N1)' },
      { w: '{往復|おうふく}はがき', ro: 'oufuku hagaki', vi: 'bưu thiếp có phần trả lời' },
    ],
  },
  '換': {
    hv: 'HOÁN', nghia: 'đổi, trao đổi', en: 'exchange',
    on: ['カン'], kun: ['か・える', 'か・わる'],
    nho: 'Bên trái 扌 (tay), bên phải 奐 (gợi âm カン): DÙNG TAY TRAO ĐỔI = hoán → 交換, 乗り換える (đổi tàu), 換気 (đổi không khí — thông gió). Cùng đọc かえる với 替える: 換える = ĐỔI cái này lấy cái kia; 替える = THAY cái cũ bằng cái mới (hay dùng 両替・着替える).',
    tu: [
      { w: '{交換|こうかん}', ro: 'koukan', vi: 'trao đổi, đổi (hàng)' },
      { w: '{乗|の}り{換|か}える', ro: 'norikaeru', vi: 'đổi tàu, chuyển xe' },
      { w: '{換気|かんき}', ro: 'kanki', vi: 'thông gió (N2)' },
      { w: '{言|い}い{換|か}える', ro: 'iikaeru', vi: 'nói cách khác' },
    ],
  },
  '駐': {
    hv: 'TRÚ', nghia: 'dừng lại, đóng (ở một chỗ)', en: 'stay / park',
    on: ['チュウ'], kun: [],
    nho: 'Bên trái 馬 (ngựa), bên phải 主 (gợi âm チュウ; ngọn lửa đèn đứng yên): NGỰA DỪNG LẠI ĐỨNG YÊN MỘT CHỖ = trú → 駐車 (đỗ xe), 駐輪場. Cùng 主 gợi âm: 注 (chú — 氵), 柱 (cột — 木), 住 (ở — 亻): チュウ／ジュウ.',
    tu: [
      { w: '{駐車場|ちゅうしゃじょう}', ro: 'chuushajou', vi: 'bãi đỗ xe' },
      { w: '{駐輪場|ちゅうりんじょう}', ro: 'chuurinjou', vi: 'bãi đỗ xe đạp' },
      { w: '{駐車禁止|ちゅうしゃきんし}', ro: 'chuusha kinshi', vi: 'cấm đỗ xe' },
    ],
  },
  '輪': {
    hv: 'LUÂN', nghia: 'bánh xe; vòng tròn', en: 'wheel / ring',
    on: ['リン'], kun: ['わ'],
    nho: 'Bên trái 車 (xe), bên phải 侖 (gợi âm リン; xếp theo thứ tự cho đều): NAN XE XẾP ĐỀU QUANH TRỤC = bánh xe → 車輪, rồi vòng tròn → 輪, 指輪 (nhẫn). Cùng 侖: 論 (luận — 言 bên trái, đọc ロン).',
    tu: [
      { w: '{輪|わ}', ro: 'wa', vi: 'vòng, vòng tròn' },
      { w: '{指輪|ゆびわ}', ro: 'yubiwa', vi: 'nhẫn' },
      { w: '{車輪|しゃりん}', ro: 'sharin', vi: 'bánh xe (N2)' },
      { w: '{駐輪場|ちゅうりんじょう}', ro: 'chuurinjou', vi: 'bãi đỗ xe đạp' },
    ],
  },
  '渋': {
    hv: 'SÁP', nghia: 'chát; ách tắc, trì trệ', en: 'astringent / congested',
    on: ['ジュウ'], kun: ['しぶ', 'しぶ・い', 'しぶ・る'],
    nho: 'Bên trái 氵 (nước), bên phải vốn là các chữ 止 (bàn chân dừng) chồng lên nhau, nay viết gọn: NƯỚC CHẢY MÀ BỊ CHÂN CHẶN LẠI, KHÔNG TRÔI = tắc → 渋滞 (kẹt xe); vị làm lưỡi "khựng lại" = chát → 渋い (chát; trầm, sành điệu).',
    tu: [
      { w: '{渋滞|じゅうたい}', ro: 'juutai', vi: 'kẹt xe, ùn tắc' },
      { w: '{渋|しぶ}い', ro: 'shibui', vi: 'chát; trầm, sang (màu, gu) (N2)' },
      { w: '{渋谷|しぶや}', ro: 'Shibuya', vi: 'Shibuya (địa danh Tokyo)' },
    ],
  },
  '滞': {
    hv: 'TRỆ', nghia: 'ứ đọng, ở lại', en: 'stagnate / stay',
    on: ['タイ'], kun: ['とどこお・る'],
    nho: 'Bên trái 氵 (nước), bên phải 帯 (gợi âm タイ; dây đai): NƯỚC BỊ DÂY BUỘC LẠI, KHÔNG CHẢY = ứ đọng → 渋滞; người dừng lại lâu ở một nơi → 滞在 (lưu trú). Cùng đọc タイ với 帯 (dây đai) — chỉ khác 氵.',
    tu: [
      { w: '{渋滞|じゅうたい}', ro: 'juutai', vi: 'kẹt xe, ùn tắc' },
      { w: '{滞在|たいざい}', ro: 'taizai', vi: 'lưu trú, ở lại (N2)' },
      { w: '{滞|とどこお}る', ro: 'todokooru', vi: 'bị ứ, bị chậm trễ (N1)' },
    ],
  },
  '税': {
    hv: 'THUẾ', nghia: 'thuế', en: 'tax',
    on: ['ゼイ'], kun: [],
    nho: 'Bên trái 禾 (cây lúa), bên phải 兑 (gợi âm; trao đổi): PHẦN LÚA PHẢI NỘP ĐỔI CHO NHÀ NƯỚC = thuế → 税金, 消費税. Cùng 兑: 説 (thuyết — 言, セツ), 脱 (thoát — 月, ダツ) — chú ý bộ bên trái.',
    tu: [
      { w: '{税込|ぜいこ}み', ro: 'zeikomi', vi: 'đã gồm thuế' },
      { w: '{税抜|ぜいぬ}き', ro: 'zeinuki', vi: 'chưa gồm thuế' },
      { w: '{税金|ぜいきん}', ro: 'zeikin', vi: 'tiền thuế' },
      { w: '{消費税|しょうひぜい}', ro: 'shouhizei', vi: 'thuế tiêu dùng' },
      { w: '{免税|めんぜい}', ro: 'menzei', vi: 'miễn thuế (N2)' },
    ],
  },
  '替': {
    hv: 'THẾ', nghia: 'thay, thay thế', en: 'replace / exchange',
    on: ['タイ'], kun: ['か・える', 'か・わる'],
    nho: 'Trên là hai chữ 夫 (người) đứng cạnh nhau, dưới 日 (mặt trời, ngày): HAI NGƯỜI THAY PHIÊN NHAU MỖI NGÀY = thay thế → 両替 (đổi tiền), 着替える (thay đồ), 取り替える. Trông giống 賛 (tán thành — dưới là 貝): 替 dưới là 日.',
    tu: [
      { w: '{両替|りょうがえ}', ro: 'ryougae', vi: 'đổi tiền' },
      { w: '{着替|きが}える', ro: 'kigaeru', vi: 'thay quần áo' },
      { w: '{取|と}り{替|か}える', ro: 'torikaeru', vi: 'thay, đổi (cái mới)' },
      { w: '{交替|こうたい}', ro: 'koutai', vi: 'thay ca, luân phiên (N2)' },
    ],
  },
  '領': {
    hv: 'LĨNH', nghia: 'nhận lãnh; cai quản', en: 'receive / territory / govern',
    on: ['リョウ'], kun: [],
    nho: 'Bên trái 令 (gợi âm リョウ; ra lệnh), bên phải 頁 (cái đầu): CÁI ĐẦU RA LỆNH = cai quản → 領土, 大統領 (tổng thống); "lĩnh" cũng là nhận về → 領収書 (giấy đã nhận tiền). Cùng 令: 冷 (lạnh), 鈴 (chuông), 齢 (tuổi) — đều đọc レイ／リョウ.',
    tu: [
      { w: '{領収書|りょうしゅうしょ}', ro: 'ryoushuusho', vi: 'hoá đơn, biên lai' },
      { w: '{大統領|だいとうりょう}', ro: 'daitouryou', vi: 'tổng thống (N2)' },
      { w: '{要領|ようりょう}', ro: 'youryou', vi: 'bí quyết, cách làm cho gọn (N1)' },
    ],
  },
  '振': {
    hv: 'CHẤN', nghia: 'vẫy, lắc, rung', en: 'shake / wave',
    on: ['シン'], kun: ['ふ・る', 'ふ・るう', 'ふ・れる'],
    nho: 'Bên trái 扌 (tay), bên phải 辰 (gợi âm シン; rung động): TAY VẪY, TAY LẮC = chấn → 振る (vẫy tay), 振り込む (chuyển khoản — "vẫy" tiền sang tài khoản khác). Cùng 辰: 震 (động đất — 雨 trên, hanLop Bài 15) — đều đọc シン.',
    tu: [
      { w: '{振|ふ}る', ro: 'furu', vi: 'vẫy, lắc' },
      { w: '{振|ふ}り{込|こ}む', ro: 'furikomu', vi: 'chuyển khoản' },
      { w: '{久|ひさ}しぶり（{久|ひさ}し{振|ぶ}り）', ro: 'hisashiburi', vi: 'lâu lắm rồi mới…' },
      { w: '{振動|しんどう}', ro: 'shindou', vi: 'rung động, rung (N1)' },
    ],
  },
  '算': {
    hv: 'TOÁN', nghia: 'tính toán', en: 'calculate',
    on: ['サン'], kun: [],
    nho: 'Trên ⺮ (que tre), giữa 目 (hình cái bàn tính), dưới 廾 (hai bàn tay): HAI TAY XẾP QUE TRE TRÊN BÀN TÍNH = tính toán → 計算, 予算 (tiền dự tính). Ở ga có máy 精算機 — máy tính bù tiền vé.',
    tu: [
      { w: '{計算|けいさん}', ro: 'keisan', vi: 'tính toán' },
      { w: '{予算|よさん}', ro: 'yosan', vi: 'ngân sách, tiền dự trù' },
      { w: '{算数|さんすう}', ro: 'sansuu', vi: 'môn toán (tiểu học)' },
      { w: '{精算|せいさん}', ro: 'seisan', vi: 'tính bù, thanh toán (N1)' },
    ],
  },
  '症': {
    hv: 'CHỨNG', nghia: 'chứng bệnh, triệu chứng', en: 'symptom / illness',
    on: ['ショウ'], kun: [],
    nho: 'Ngoài 疒 (giường bệnh — bộ bệnh), trong 正 (gợi âm ショウ／セイ): DẤU HIỆU HIỆN RA CỦA BỆNH = chứng → 症状 (triệu chứng), 花粉症, 熱中症. Cùng 正 gợi âm: 証 (chứng cứ — 言), 政 (chính trị — 攵).',
    tu: [
      { w: '{症状|しょうじょう}', ro: 'shoujou', vi: 'triệu chứng' },
      { w: '{花粉症|かふんしょう}', ro: 'kafunshou', vi: 'dị ứng phấn hoa' },
      { w: '{熱中症|ねっちゅうしょう}', ro: 'necchuushou', vi: 'say nắng, sốc nhiệt' },
      { w: '{軽症|けいしょう}', ro: 'keishou', vi: 'bệnh nhẹ (N1)' },
    ],
  },
  '傷': {
    hv: 'THƯƠNG', nghia: 'vết thương; làm tổn thương', en: 'wound / hurt',
    on: ['ショウ'], kun: ['きず', 'いた・む', 'いた・める'],
    nho: 'Bên trái 亻 (người), bên phải ⺈ + 昜 (gợi âm ショウ): NGƯỜI BỊ THƯƠNG = thương → 傷 (vết thương), 傷つく (bị tổn thương — cả lòng). Cùng 昜: 湯 (nước nóng), 場 (chỗ), 陽 (mặt trời) — phần phải giống nhau, bộ trái khác.',
    tu: [
      { w: '{傷|きず}', ro: 'kizu', vi: 'vết thương, vết xước' },
      { w: '{傷|きず}つく', ro: 'kizutsuku', vi: 'bị tổn thương, bị xước' },
      { w: '{負傷|ふしょう}', ro: 'fushou', vi: 'bị thương (văn tin tức) (N1)' },
      { w: '{傷|いた}む', ro: 'itamu', vi: '(đồ ăn) bị hỏng, (đồ) bị hư (N2)' },
    ],
  },
  '希': {
    hv: 'HI', nghia: 'mong; hiếm', en: 'hope / rare',
    on: ['キ'], kun: [],
    nho: 'Trên 㐅 (đường đan chéo), dưới 布 (vải): TẤM VẢI DỆT THƯA, LỖ CHỖ = ít, hiếm → điều hiếm thì người ta MONG → 希望 (nguyện vọng). Dưới là 布 (vải — ぬの): đừng viết thiếu nét ngang.',
    tu: [
      { w: '{希望|きぼう}', ro: 'kibou', vi: 'nguyện vọng, mong muốn' },
      { w: '{希望者|きぼうしゃ}', ro: 'kibousha', vi: 'người có nguyện vọng, người đăng ký' },
      { w: '{希少|きしょう}', ro: 'kishou', vi: 'hiếm (N1)' },
    ],
  },
  '補': {
    hv: 'BỔ', nghia: 'bổ sung, vá', en: 'supplement / patch',
    on: ['ホ'], kun: ['おぎな・う'],
    nho: 'Bên trái 衤 (áo — bộ y), bên phải 甫 (gợi âm ホ): VÁ CHỖ RÁCH CỦA ÁO = bổ sung → 補う (bù vào), 補習 (học bù). Cùng 甫: 捕 (bắt — 扌, ホ). Đừng nhầm 衤 (áo, hai chấm) với 礻 (thần, một chấm).',
    tu: [
      { w: '{補習|ほしゅう}', ro: 'hoshuu', vi: 'học bù, học phụ đạo' },
      { w: '{補|おぎな}う', ro: 'oginau', vi: 'bù, bổ sung (N2)' },
      { w: '{候補|こうほ}', ro: 'kouho', vi: 'ứng viên, phương án được chọn (N2)' },
    ],
  },
  '却': {
    hv: 'KHƯỚC', nghia: 'lùi lại; trả lại; từ chối', en: 'retreat / return / reject',
    on: ['キャク'], kun: [],
    nho: 'Bên trái 去 (rời đi), bên phải 卩 (người quỳ gối): QUỲ XUỐNG RỒI LÙI RA = lùi lại → trả lại → 返却 (trả lại sách, đồ mượn); làm cho lùi nhiệt → 冷却. Cùng phần 却: 脚 (chân — 月, キャク).',
    tu: [
      { w: '{返却|へんきゃく}', ro: 'henkyaku', vi: 'trả lại (đồ mượn)' },
      { w: '{返却日|へんきゃくび}', ro: 'henkyakubi', vi: 'ngày hạn trả' },
      { w: '{冷却|れいきゃく}', ro: 'reikyaku', vi: 'làm lạnh (N1)' },
    ],
  },
  '訂': {
    hv: 'ĐÍNH', nghia: 'sửa cho đúng, đính chính', en: 'correct / revise',
    on: ['テイ'], kun: [],
    nho: 'Bên trái 言 (lời nói), bên phải 丁 (gợi âm テイ; cái đinh): ĐÓNG ĐINH CHO LỜI NÓI ĐỨNG ĐÚNG CHỖ = sửa cho đúng → 訂正 (đính chính). Cùng 丁: 町 (thị trấn — 田), 庁 (sảnh — 广), 頂.',
    tu: [
      { w: '{訂正|ていせい}', ro: 'teisei', vi: 'đính chính, sửa lại cho đúng' },
      { w: '{改訂|かいてい}', ro: 'kaitei', vi: 'sửa đổi (bản in, giáo trình) (N1)' },
      { w: '{改訂版|かいていばん}', ro: 'kaiteiban', vi: 'bản sửa đổi' },
    ],
  },
  '催': {
    hv: 'THÔI', nghia: 'thúc giục; tổ chức', en: 'urge / hold (an event)',
    on: ['サイ'], kun: ['もよお・す'],
    nho: 'Bên trái 亻 (người), bên phải 崔 (gợi âm サイ; núi cao — 山 trên 隹): NGƯỜI THÚC GIỤC MỌI NGƯỜI TỤ LẠI = tổ chức → 開催 (tổ chức sự kiện), 催し (sự kiện); thúc giục → 催促. ⚠ Đừng nhầm với 推 (đẩy — 扌, スイ): cùng có 隹.',
    tu: [
      { w: '{開催|かいさい}', ro: 'kaisai', vi: 'tổ chức (sự kiện)' },
      { w: '{主催|しゅさい}', ro: 'shusai', vi: 'đơn vị tổ chức, đứng ra tổ chức (N2)' },
      { w: '{催|もよお}し', ro: 'moyooshi', vi: 'sự kiện, chương trình (N2)' },
      { w: '{催促|さいそく}', ro: 'saisoku', vi: 'thúc giục, nhắc (trả nợ…) (N1)' },
    ],
  },
  '請': {
    hv: 'THỈNH', nghia: 'xin, thỉnh cầu', en: 'request / ask for',
    on: ['セイ', 'シン'], kun: ['こ・う', 'う・ける'],
    nho: 'Bên trái 言 (lời nói), bên phải 青 (gợi âm セイ): DÙNG LỜI ĐỂ XIN = thỉnh cầu → 申請 (xin phép bằng giấy tờ), 請求 (đòi tiền) → 請求書. Cùng 青 gợi âm セイ: 晴 (日), 清 (氵), 精 (米), 静 (争) — phân biệt bằng bộ bên trái.',
    tu: [
      { w: '{申請|しんせい}', ro: 'shinsei', vi: 'xin (cấp phép), nộp đơn' },
      { w: '{請求|せいきゅう}', ro: 'seikyuu', vi: 'yêu cầu thanh toán (N2)' },
      { w: '{請求書|せいきゅうしょ}', ro: 'seikyuusho', vi: 'giấy đòi tiền, hoá đơn thanh toán' },
    ],
  },
};
