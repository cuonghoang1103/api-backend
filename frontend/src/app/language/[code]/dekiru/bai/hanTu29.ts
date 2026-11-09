/**
 * Chữ Hán MỚI của Bài 29 (健康 — tiếp sau sách, cấp N3) cho thẻ chữ Hán — cùng định dạng hanTu.ts.
 * 22 chữ: 程 首 退 呼 適 普 腹 煙 貧 抜 更 良 (N3 theo các bảng tham khảo phổ biến) · 血 骨 胃 汗 検 査 栄 養 診 防 (chữ
 * của chủ đề y tế — các bảng xếp N3 hoặc N2; JLPT không công bố danh sách chữ chính thức) — bảng `b29-han-tu` trong bai29.ts.
 * Cách nhớ: theo cấu tạo chữ (phần chỉ nghĩa + phần gợi âm của chữ hình thanh ghi rõ); 更 và 良 là chữ cổ mà giải nghĩa nguồn
 * gốc không thống nhất nên ghi rõ là "cách nhớ bằng hình", không khẳng định nguồn gốc. お腹 (おなか) là cách đọc quen dùng —
 * không thuộc âm chính thức của 腹, nên chỉ ghi ở phần từ đi chung.
 * On / Kun theo bảng thường dụng (常用): 適 胃 検 査 chỉ có âm On.
 * Tệp chỉ có `import type` — tải chậm như hanTu.ts.
 */
import type { HanTu } from '@/components/sach-hoc/kanji';

export const HAN_TU_29: Record<string, HanTu> = {
  '程': {
    hv: 'TRÌNH', nghia: 'mức độ, chừng; trình tự', en: 'extent / degree',
    on: ['テイ'], kun: ['ほど'],
    nho: 'Bên trái 禾 (cây lúa), bên phải 呈 (gợi âm テイ): đong lúa theo MỨC, theo CHỪNG → mức độ: 程度. Đây chính là chữ của ほど trong ngữ pháp Bài 29 (thường viết かな). Khác 税 (thuế — 禾 + 兑).',
    tu: [
      { w: '{程度|ていど}', ro: 'teido', vi: 'mức độ, chừng' },
      { w: '{程|ほど}', ro: 'hodo', vi: 'mức, chừng (thường viết かな)' },
      { w: '{日程|にってい}', ro: 'nittei', vi: 'lịch trình (N2)' },
      { w: '{過程|かてい}', ro: 'katei', vi: 'quá trình (N2)' },
    ],
  },
  '首': {
    hv: 'THỦ', nghia: 'cổ; đầu, đứng đầu', en: 'neck / head',
    on: ['シュ'], kun: ['くび'],
    nho: 'Chữ tượng hình: cái ĐẦU người có tóc (hai nét chấm 丷 trên cùng) và khuôn mặt (自) → đầu; phần nối đầu với thân = CỔ (首). "Đầu" của đất nước = 首都 (thủ đô). Thêm 辶 (bước đi) → 道 (con đường).',
    tu: [
      { w: '{首|くび}', ro: 'kubi', vi: 'cổ' },
      { w: '{手首|てくび}', ro: 'tekubi', vi: 'cổ tay' },
      { w: '{足首|あしくび}', ro: 'ashikubi', vi: 'cổ chân' },
      { w: '{首都|しゅと}', ro: 'shuto', vi: 'thủ đô (N3)' },
      { w: '{首相|しゅしょう}', ro: 'shushou', vi: 'thủ tướng (N2)' },
    ],
  },
  '退': {
    hv: 'THOÁI', nghia: 'lùi, rút lui', en: 'retreat / withdraw',
    on: ['タイ'], kun: ['しりぞ・く', 'しりぞ・ける'],
    nho: 'Bộ 辶 (bước đi) ôm 艮 (dừng lại, quay lại): bước LÙI ra = THOÁI → 退院 (rời bệnh viện), 早退 (về sớm). Cùng 艮: 限 (hạn — Bài 26), 根 (rễ). Khác 追 (đuổi — 辶 + 𠂤).',
    tu: [
      { w: '{退院|たいいん}', ro: 'taiin', vi: 'xuất viện' },
      { w: '{早退|そうたい}', ro: 'soutai', vi: 'về sớm (N3)' },
      { w: '{退屈|たいくつ}', ro: 'taikutsu', vi: 'buồn chán (N3)' },
      { w: '{引退|いんたい}', ro: 'intai', vi: 'giải nghệ, nghỉ hưu (N2)' },
    ],
  },
  '呼': {
    hv: 'HÔ', nghia: 'gọi; thở ra', en: 'call / exhale',
    on: ['コ'], kun: ['よ・ぶ'],
    nho: 'Bên trái 口 (miệng), bên phải 乎 (gợi âm コ; hình hơi thở bật ra): mở miệng GỌI, THỞ RA → 呼ぶ, 呼吸 (thở ra ＋ hít vào). ⚠ 乎 có nét phẩy trên cùng — khác 平 (bình).',
    tu: [
      { w: '{呼|よ}ぶ', ro: 'yobu', vi: 'gọi' },
      { w: '{呼吸|こきゅう}', ro: 'kokyuu', vi: 'hô hấp, hít thở' },
      { w: '{深呼吸|しんこきゅう}', ro: 'shinkokyuu', vi: 'hít thở sâu' },
      { w: '{呼|よ}び{出|だ}す', ro: 'yobidasu', vi: 'gọi ra, triệu tập (N3)' },
    ],
  },
  '適': {
    hv: 'THÍCH', nghia: 'vừa, thích hợp', en: 'suitable / fit',
    on: ['テキ'], kun: [],
    nho: 'Bộ 辶 (bước đi) + 啇 (gợi âm テキ): bước đến ĐÚNG CHỖ = THÍCH (hợp) → 適度 (vừa phải), 適当 (thích hợp). Cùng 啇, cùng đọc テキ: 敵 (kẻ địch — có 攵) và 滴 (giọt — có 氵).',
    tu: [
      { w: '{適度|てきど}', ro: 'tekido', vi: 'vừa phải, điều độ' },
      { w: '{適当|てきとう}', ro: 'tekitou', vi: 'thích hợp; (văn nói) qua loa' },
      { w: '{快適|かいてき}', ro: 'kaiteki', vi: 'dễ chịu, thoải mái (N2)' },
      { w: '{最適|さいてき}', ro: 'saiteki', vi: 'tối ưu, thích hợp nhất (N2)' },
    ],
  },
  '普': {
    hv: 'PHỔ', nghia: 'rộng khắp; thông thường', en: 'universal / ordinary',
    on: ['フ'], kun: [],
    nho: 'Phần trên giống 並 (đứng cạnh nhau, xếp hàng), dưới là 日 (mặt trời): mặt trời chiếu KHẮP lên mọi thứ đứng cạnh nhau = PHỔ (rộng khắp, chung cho mọi người) → 普通 (thông thường), 普段 (ngày thường). Khác 並 (並ぶ — xếp hàng): 並 không có 日 ở dưới.',
    tu: [
      { w: '{普段|ふだん}', ro: 'fudan', vi: 'thường ngày' },
      { w: '{普通|ふつう}', ro: 'futsuu', vi: 'bình thường, thông thường' },
      { w: '{普段着|ふだんぎ}', ro: 'fudangi', vi: 'quần áo mặc thường ngày' },
      { w: '{普及|ふきゅう}', ro: 'fukyuu', vi: 'phổ cập, lan rộng (N2)' },
    ],
  },
  '腹': {
    hv: 'PHÚC', nghia: 'bụng', en: 'belly / stomach',
    on: ['フク'], kun: ['はら'],
    nho: 'Bên trái 月 (bộ nhục — thịt, cơ thể), bên phải 复 (gợi âm フク): phần CƠ THỂ phình ra = BỤNG. Cùng 复, cùng đọc フク: 復 (回復 — có 彳) và 複 (複雑 — có 衤). お腹 đọc おなか — cách đọc quen dùng, học thuộc cả từ.',
    tu: [
      { w: 'お{腹|なか}', ro: 'onaka', vi: 'bụng (cách đọc quen dùng)' },
      { w: '{満腹|まんぷく}', ro: 'manpuku', vi: 'no bụng (満 — Bài 28)' },
      { w: '{腹|はら}が{立|た}つ', ro: 'hara ga tatsu', vi: 'tức giận (N3)' },
      { w: '{空腹|くうふく}', ro: 'kuufuku', vi: 'bụng đói (N2)' },
      { w: '{腹八分目|はらはちぶんめ}', ro: 'hara hachibunme', vi: 'ăn tám phần no' },
    ],
  },
  '煙': {
    hv: 'YÊN', nghia: 'khói', en: 'smoke',
    on: ['エン'], kun: ['けむり', 'けむ・る', 'けむ・い'],
    nho: 'Bên trái 火 (lửa), bên phải 垔 (gợi âm エン; bịt lại): lửa bị BỊT lại thì bốc KHÓI → 煙, 禁煙 (cấm hút thuốc). Khác 燃 (cháy — 火 + 然).',
    tu: [
      { w: '{煙|けむり}', ro: 'kemuri', vi: 'khói' },
      { w: '{煙|けむ}い', ro: 'kemui', vi: 'ngạt khói, cay mắt vì khói (N3)' },
      { w: '{禁煙|きんえん}', ro: "kin'en", vi: 'cấm hút thuốc; bỏ thuốc' },
      { w: '{喫煙|きつえん}', ro: 'kitsuen', vi: 'hút thuốc (N2)' },
    ],
  },
  '貧': {
    hv: 'BẦN', nghia: 'nghèo; thiếu', en: 'poor / lacking',
    on: ['ヒン', 'ビン'], kun: ['まず・しい'],
    nho: 'Trên 分 (chia), dưới 貝 (vỏ sò = tiền): tiền bị CHIA nhỏ mãi → NGHÈO, THIẾU → 貧しい, 貧血 (thiếu máu). Khác 貨 (hoá — 化 + 貝) và 貸 (cho mượn — 代 + 貝).',
    tu: [
      { w: '{貧血|ひんけつ}', ro: 'hinketsu', vi: 'thiếu máu' },
      { w: '{貧|まず}しい', ro: 'mazushii', vi: 'nghèo (N3)' },
      { w: '{貧乏|びんぼう}', ro: 'binbou', vi: 'nghèo túng (N3)' },
    ],
  },
  '抜': {
    hv: 'BẠT', nghia: 'rút, nhổ; bỏ', en: 'pull out / skip',
    on: ['バツ'], kun: ['ぬ・く', 'ぬ・ける', 'ぬ・かす', 'ぬ・かる'],
    nho: 'Bên trái 扌 (tay), bên phải 犮 (gợi âm バツ): TAY RÚT, NHỔ ra → 抜く (nhổ răng, bỏ bữa), 抜ける (rụng, tuột). Khác 技 (kỹ — 扌 + 支: 技術).',
    tu: [
      { w: '{抜|ぬ}く', ro: 'nuku', vi: 'rút, nhổ; bỏ (bữa)' },
      { w: '{抜|ぬ}ける', ro: 'nukeru', vi: 'rụng, tuột ra' },
      { w: '{追|お}い{抜|ぬ}く', ro: 'oinuku', vi: 'vượt qua (N3)' },
      { w: '{選抜|せんばつ}', ro: 'senbatsu', vi: 'tuyển chọn (N1)' },
    ],
  },
  '更': {
    hv: 'CANH', nghia: 'đổi, thay; thêm nữa; (đêm) khuya', en: 'change / further',
    on: ['コウ'], kun: ['さら', 'ふ・ける', 'ふ・かす'],
    nho: 'Chữ cổ, giải nghĩa nguồn gốc không thống nhất — nhớ bằng hình: một nét ngang trên 日, dưới có 乂 (bắt chéo): "ngày (日) lại bị ĐỔI sang canh mới" → 変更 (thay đổi), 夜更かし (thức tới canh khuya), 更に (thêm nữa). Thêm 亻 → 便 (tiện); thêm 石 → 硬 (cứng).',
    tu: [
      { w: '{更|さら}に', ro: 'sara ni', vi: 'hơn nữa, càng… hơn' },
      { w: '{変更|へんこう}', ro: 'henkou', vi: 'thay đổi (N3)' },
      { w: '{更新|こうしん}', ro: 'koushin', vi: 'gia hạn, cập nhật (N2)' },
      { w: '{夜更|よふ}かし', ro: 'yofukashi', vi: 'thức khuya' },
    ],
  },
  '良': {
    hv: 'LƯƠNG', nghia: 'tốt', en: 'good',
    on: ['リョウ'], kun: ['よ・い'],
    nho: 'Chữ tượng hình cổ — thường được giải là dụng cụ SÀNG LỌC ngũ cốc để lấy phần TỐT → 良い, 不良 (không tốt). Nằm trong chữ 食 (thức ăn — 人 + 良): đồ TỐT đem cho NGƯỜI ăn.',
    tu: [
      { w: '{良|よ}い', ro: 'yoi', vi: 'tốt' },
      { w: '{仲良|なかよ}く', ro: 'nakayoku', vi: 'thân thiết, hoà thuận' },
      { w: '{不良|ふりょう}', ro: 'furyou', vi: 'kém, hư hỏng (N2)' },
      { w: '{改良|かいりょう}', ro: 'kairyou', vi: 'cải tiến (N2)' },
    ],
  },
  '血': {
    hv: 'HUYẾT', nghia: 'máu', en: 'blood',
    on: ['ケツ'], kun: ['ち'],
    nho: 'Dưới là 皿 (cái bát), trên là một nét phẩy (giọt MÁU rơi vào bát — máu tế lễ thời cổ) → 血, 血圧. Bớt nét phẩy là 皿 (さら — cái đĩa).',
    tu: [
      { w: '{血|ち}', ro: 'chi', vi: 'máu' },
      { w: '{血圧|けつあつ}', ro: 'ketsuatsu', vi: 'huyết áp' },
      { w: '{貧血|ひんけつ}', ro: 'hinketsu', vi: 'thiếu máu' },
      { w: '{出血|しゅっけつ}', ro: 'shukketsu', vi: 'chảy máu (N2)' },
      { w: '{鼻血|はなぢ}', ro: 'hanaji', vi: 'máu cam' },
    ],
  },
  '骨': {
    hv: 'CỐT', nghia: 'xương', en: 'bone',
    on: ['コツ'], kun: ['ほね'],
    nho: 'Phần trên vẽ KHỚP XƯƠNG, phần dưới 月 (thịt): bộ khung nằm trong thịt = XƯƠNG → 骨, 骨折. Thêm 氵 → 滑 (trượt — 滑る).',
    tu: [
      { w: '{骨|ほね}', ro: 'hone', vi: 'xương' },
      { w: '{骨折|こっせつ}', ro: 'kossetsu', vi: 'gãy xương' },
      { w: '{骨|ほね}が{折|お}れる', ro: 'hone ga oreru', vi: 'gãy xương; vất vả (N2)' },
    ],
  },
  '胃': {
    hv: 'VỊ', nghia: 'dạ dày', en: 'stomach',
    on: ['イ'], kun: [],
    nho: 'Trên 田 (ở đây vẽ cái TÚI chứa thức ăn — không phải ruộng), dưới 月 (cơ thể): túi đựng thức ăn trong người = DẠ DÀY → 胃. Khác 冒 (mạo — 曰 trên 目).',
    tu: [
      { w: '{胃|い}', ro: 'i', vi: 'dạ dày' },
      { w: '{胃薬|いぐすり}', ro: 'igusuri', vi: 'thuốc dạ dày' },
      { w: '{胃腸|いちょう}', ro: 'ichou', vi: 'dạ dày và ruột (N2)' },
    ],
  },
  '汗': {
    hv: 'HÃN', nghia: 'mồ hôi', en: 'sweat',
    on: ['カン'], kun: ['あせ'],
    nho: 'Bên trái 氵 (nước), bên phải 干 (gợi âm カン): NƯỚC toát ra từ da = MỒ HÔI → 汗をかく. Khác 汚 (bẩn — 氵 + 亏).',
    tu: [
      { w: '{汗|あせ}', ro: 'ase', vi: 'mồ hôi' },
      { w: '{汗|あせ}をかく', ro: 'ase o kaku', vi: 'đổ mồ hôi' },
      { w: '{冷|ひ}や{汗|あせ}', ro: 'hiyaase', vi: 'mồ hôi lạnh (N2)' },
      { w: '{汗|あせ}っかき', ro: 'asekkaki', vi: 'người hay đổ mồ hôi' },
    ],
  },
  '検': {
    hv: 'KIỂM', nghia: 'kiểm tra, xem xét', en: 'examine / inspect',
    on: ['ケン'], kun: [],
    nho: 'Bên trái 木 (thẻ gỗ), bên phải 㑒 (gợi âm ケン; gom lại): thời xưa niêm phong bằng thẻ gỗ để KIỂM TRA → 検査. Cùng 㑒, cùng đọc ケン: 険 (保険 — 阝) và 験 (経験 — 馬) — chỉ khác bộ bên trái.',
    tu: [
      { w: '{検査|けんさ}', ro: 'kensa', vi: 'xét nghiệm, kiểm tra' },
      { w: '{検定|けんてい}', ro: 'kentei', vi: 'kỳ thi chứng chỉ (N2)' },
      { w: '{点検|てんけん}', ro: 'tenken', vi: 'kiểm tra định kỳ (N2)' },
      { w: '{検索|けんさく}', ro: 'kensaku', vi: 'tìm kiếm (N2)' },
    ],
  },
  '査': {
    hv: 'TRA', nghia: 'tra xét, điều tra', en: 'investigate',
    on: ['サ'], kun: [],
    nho: 'Trên 木 (gỗ), dưới 且 (gợi âm サ; chồng lên): xếp gỗ chặn lại để TRA XÉT → 検査, 調査 (Bài 27).',
    tu: [
      { w: '{検査|けんさ}', ro: 'kensa', vi: 'xét nghiệm' },
      { w: '{調査|ちょうさ}', ro: 'chousa', vi: 'điều tra, khảo sát' },
      { w: '{審査|しんさ}', ro: 'shinsa', vi: 'thẩm định (N1)' },
    ],
  },
  '栄': {
    hv: 'VINH', nghia: 'vinh, tươi tốt, thịnh', en: 'flourish / glory',
    on: ['エイ'], kun: ['さか・える', 'は・え', 'は・える'],
    nho: 'Trên ⺍ (ánh sáng toả) + 冖 (che), dưới 木 (cây): cây được ánh sáng soi, TƯƠI TỐT = VINH → 栄養 (chất làm cơ thể tươi tốt). Cùng phần trên, cùng đọc エイ: 営 (営業 — dưới là 呂).',
    tu: [
      { w: '{栄養|えいよう}', ro: 'eiyou', vi: 'dinh dưỡng' },
      { w: '{栄養士|えいようし}', ro: 'eiyoushi', vi: 'chuyên gia dinh dưỡng' },
      { w: '{栄|さか}える', ro: 'sakaeru', vi: 'thịnh vượng (N2)' },
    ],
  },
  '養': {
    hv: 'DƯỠNG', nghia: 'nuôi, dưỡng', en: 'nourish / raise',
    on: ['ヨウ'], kun: ['やしな・う'],
    nho: 'Trên 𦍌 (con cừu, viết gọn), dưới 食 (ăn): cho cừu ĂN = NUÔI DƯỠNG → 栄養, 養う. Phần trên giống 美 (đẹp — dưới là 大).',
    tu: [
      { w: '{栄養|えいよう}', ro: 'eiyou', vi: 'dinh dưỡng' },
      { w: '{休養|きゅうよう}', ro: 'kyuuyou', vi: 'nghỉ dưỡng (N2)' },
      { w: '{養|やしな}う', ro: 'yashinau', vi: 'nuôi (gia đình) (N2)' },
      { w: '{教養|きょうよう}', ro: 'kyouyou', vi: 'học thức, sự hiểu biết (N2)' },
    ],
  },
  '診': {
    hv: 'CHẨN', nghia: 'khám bệnh', en: 'diagnose / examine',
    on: ['シン'], kun: ['み・る'],
    nho: 'Bên trái 言 (lời), bên phải 㐱 (gợi âm シン): bác sĩ HỎI HAN để biết bệnh = CHẨN → 診察, 診る. Cùng 㐱: 珍 (hiếm — 珍しい, bên trái 王).',
    tu: [
      { w: '{診察|しんさつ}', ro: 'shinsatsu', vi: 'khám bệnh' },
      { w: '{診|み}る', ro: 'miru', vi: '(bác sĩ) khám' },
      { w: '{健康診断|けんこうしんだん}', ro: 'kenkou shindan', vi: 'khám sức khoẻ định kỳ' },
      { w: '{診断|しんだん}', ro: 'shindan', vi: 'chẩn đoán (N2)' },
    ],
  },
  '防': {
    hv: 'PHÒNG', nghia: 'phòng, ngăn chặn', en: 'prevent / defend',
    on: ['ボウ'], kun: ['ふせ・ぐ'],
    nho: 'Bên trái 阝 (gò đất, con đê), bên phải 方 (gợi âm ボウ): đắp ĐÊ CHẮN nước = PHÒNG → 防ぐ, 予防. Cùng 方: 訪 (thăm — 訪問, bên trái 言).',
    tu: [
      { w: '{予防|よぼう}', ro: 'yobou', vi: 'phòng ngừa' },
      { w: '{防|ふせ}ぐ', ro: 'fusegu', vi: 'ngăn, chặn' },
      { w: '{防止|ぼうし}', ro: 'boushi', vi: 'ngăn chặn (N2)' },
      { w: '{消防|しょうぼう}', ro: 'shoubou', vi: 'cứu hoả (N2)' },
    ],
  },
};
