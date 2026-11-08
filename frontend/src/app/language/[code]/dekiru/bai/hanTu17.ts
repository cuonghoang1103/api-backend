/**
 * Chữ Hán MỚI của Bài 17 (旅行の計画 — tiếp sau sách, N4) cho thẻ chữ Hán — cùng định dạng hanTu.ts.
 * 15 chữ: 発 光 重 軽 洋 世 界 (N4) · 港 島 湖 案 内 定 指 側 (N3) — bảng `b17-han-tu` trong bai17.ts.
 * Cách nhớ: theo cấu tạo chữ khi chắc chắn; chữ hình thanh thì ghi rõ phần nào gợi nghĩa / gợi âm;
 * chữ mà mẹo nhìn hình không phải gốc chữ (重) thì nói rõ là mẹo. Từ đi chung ưu tiên từ dùng trong bai17.ts.
 * Tệp chỉ có `import type` — tải chậm như hanTu.ts.
 */
import type { HanTu } from '@/components/sach-hoc/kanji';

export const HAN_TU_17: Record<string, HanTu> = {
  '発': {
    hv: 'PHÁT', nghia: 'phát ra, xuất phát; phát biểu', en: 'depart / emit / announce',
    on: ['ハツ', 'ホツ'], kun: [],
    nho: 'Phần trên là 癶 (hai bàn chân dang ra — bộ "bát", cũng có trong 登 leo): đôi chân bước ra đi = XUẤT PHÁT. 出発 đọc しゅっぱつ (っ + ぱ), 発表 đọc はっぴょう — âm ハツ hay biến thành はっ／ぱつ khi ghép.',
    tu: [
      { w: '{出発|しゅっぱつ}します', ro: 'shuppatsu shimasu', vi: 'xuất phát, khởi hành' },
      { w: '{発音|はつおん}', ro: 'hatsuon', vi: 'phát âm' },
      { w: '{発表|はっぴょう}します', ro: 'happyou shimasu', vi: 'phát biểu, thuyết trình' },
      { w: '{東京発|とうきょうはつ}', ro: 'Toukyou-hatsu', vi: 'khởi hành từ Tokyo (trên vé, bảng giờ)' },
    ],
  },
  '光': {
    hv: 'QUANG', nghia: 'ánh sáng; toả sáng', en: 'light / shine',
    on: ['コウ'], kun: ['ひか・る', 'ひかり'],
    nho: 'Phần trên là ngọn lửa (火 viết biến dạng), phần dưới là 儿 (đôi chân người): người đội ngọn lửa trên đầu toả ÁNH SÁNG. 観光 = "đi xem ánh sáng (vẻ đẹp) của một vùng" → tham quan.',
    tu: [
      { w: '{観光|かんこう}', ro: 'kankou', vi: 'tham quan, du lịch ngắm cảnh' },
      { w: '{光|ひかり}', ro: 'hikari', vi: 'ánh sáng' },
      { w: '{光|ひか}ります', ro: 'hikarimasu', vi: 'toả sáng, lấp lánh' },
      { w: '{日光|にっこう}', ro: 'nikkou', vi: 'ánh nắng mặt trời; Nikko (địa danh)' },
    ],
  },
  '重': {
    hv: 'TRỌNG', nghia: 'nặng; quan trọng; chồng lên', en: 'heavy / important',
    on: ['ジュウ', 'チョウ'], kun: ['おも・い', 'かさ・ねる'],
    nho: 'Mẹo nhìn (không phải gốc chữ): trông như 千 (nghìn) đặt trên 里 (dặm): gánh nghìn dặm thì NẶNG. Cẩn thận đồng âm: 重い (nặng) và 思い (ý nghĩ) cùng đọc おもい. Nét ngang giữa dài nhất.',
    tu: [
      { w: '{重|おも}い', ro: 'omoi', vi: 'nặng' },
      { w: '{体重|たいじゅう}', ro: 'taijuu', vi: 'cân nặng (của người)' },
      { w: '{重要|じゅうよう}', ro: 'juuyou', vi: 'quan trọng' },
      { w: '{貴重品|きちょうひん}', ro: 'kichouhin', vi: 'đồ quý giá (重 đọc チョウ)' },
    ],
  },
  '軽': {
    hv: 'KHINH', nghia: 'nhẹ; nhẹ nhàng, đơn giản', en: 'light (weight)',
    on: ['ケイ'], kun: ['かる・い'],
    nho: 'Bên trái 車 (xe) gợi nghĩa, bên phải 圣 là dạng tắt kiểu Nhật của phần gợi âm ケイ (cùng phần với 経): chiếc xe NHẸ, chạy nhanh → 軽自動車 (ô tô cỡ nhỏ).',
    tu: [
      { w: '{軽|かる}い', ro: 'karui', vi: 'nhẹ' },
      { w: '{軽食|けいしょく}', ro: 'keishoku', vi: 'bữa ăn nhẹ' },
      { w: '{手軽|てがる}', ro: 'tegaru', vi: 'dễ dàng, tiện, đơn giản' },
    ],
  },
  '洋': {
    hv: 'DƯƠNG', nghia: 'đại dương; phương Tây', en: 'ocean / Western',
    on: ['ヨウ'], kun: [],
    nho: 'Bên trái 氵 (nước) gợi nghĩa, bên phải 羊 (con dê) gợi âm ヨウ: vùng nước mênh mông = ĐẠI DƯƠNG. Thứ đến từ bên kia đại dương = phương Tây → 洋室 (phòng kiểu Tây), 洋服.',
    tu: [
      { w: '{洋室|ようしつ}', ro: 'youshitsu', vi: 'phòng kiểu Tây (có giường)' },
      { w: '{洋服|ようふく}', ro: 'youfuku', vi: 'quần áo kiểu Tây' },
      { w: '{西洋|せいよう}', ro: 'seiyou', vi: 'phương Tây' },
      { w: '{太平洋|たいへいよう}', ro: 'Taiheiyou', vi: 'Thái Bình Dương' },
    ],
  },
  '世': {
    hv: 'THẾ', nghia: 'đời, thế hệ; thế gian', en: 'world / generation',
    on: ['セ', 'セイ'], kun: ['よ'],
    nho: 'Gốc chữ là ba chữ 十 (mười) viết liền nhau = 30 năm = một ĐỜI người (một thế hệ). Thế gian của mọi đời người → 世界 (thế giới). 世界 đọc セ, không phải セイ.',
    tu: [
      { w: '{世界|せかい}', ro: 'sekai', vi: 'thế giới' },
      { w: '{世話|せわ}', ro: 'sewa', vi: 'sự chăm sóc, giúp đỡ (お世話になりました)' },
      { w: '{世|よ}の{中|なか}', ro: 'yo no naka', vi: 'cuộc đời, xã hội' },
    ],
  },
  '界': {
    hv: 'GIỚI', nghia: 'ranh giới; giới, lĩnh vực', en: 'boundary / world',
    on: ['カイ'], kun: [],
    nho: 'Trên là 田 (ruộng), dưới là 介 (ở giữa — cũng gợi âm カイ): bờ đất NGĂN GIỮA các thửa ruộng = ranh GIỚI. Mọi ranh giới của đời người gộp lại = 世界.',
    tu: [
      { w: '{世界|せかい}', ro: 'sekai', vi: 'thế giới' },
      { w: '{世界中|せかいじゅう}', ro: 'sekaijuu', vi: 'khắp thế giới' },
      { w: '{世界遺産|せかいいさん}', ro: 'sekai isan', vi: 'di sản thế giới' },
    ],
  },
  '港': {
    hv: 'CẢNG', nghia: 'cảng, bến cảng', en: 'port / harbor',
    on: ['コウ'], kun: ['みなと'],
    nho: 'Bên trái 氵 (nước) gợi nghĩa, bên phải 巷 (ngõ, lối nhỏ) gợi âm コウ: lối nước cho thuyền đi vào = CẢNG. 空港 = "cảng trên trời" → sân bay. Đứng riêng đọc みなと.',
    tu: [
      { w: '{空港|くうこう}', ro: 'kuukou', vi: 'sân bay' },
      { w: '{港|みなと}', ro: 'minato', vi: 'cảng biển' },
      { w: '{成田空港|なりたくうこう}', ro: 'Narita kuukou', vi: 'sân bay Narita' },
    ],
  },
  '島': {
    hv: 'ĐẢO', nghia: 'hòn đảo', en: 'island',
    on: ['トウ'], kun: ['しま'],
    nho: 'Phần trên là 鳥 (con chim) bỏ bớt bốn chấm chân, phía dưới chèn 山 (núi): chim đậu trên ngọn núi nhô lên giữa biển = HÒN ĐẢO. Trong tên đảo thường đọc じま: 宮島.',
    tu: [
      { w: '{島|しま}', ro: 'shima', vi: 'hòn đảo' },
      { w: '{半島|はんとう}', ro: 'hantou', vi: 'bán đảo' },
      { w: '{島国|しまぐに}', ro: 'shimaguni', vi: 'đảo quốc' },
      { w: '{宮島|みやじま}', ro: 'Miyajima', vi: 'đảo Miyajima (Hiroshima)' },
    ],
  },
  '湖': {
    hv: 'HỒ', nghia: 'hồ (lớn)', en: 'lake',
    on: ['コ'], kun: ['みずうみ'],
    nho: 'Bên trái 氵 (nước) gợi nghĩa, bên phải 胡 gợi âm コ: vùng nước lớn nằm trong đất liền = HỒ. Đứng riêng đọc みずうみ (mizu-umi — "biển nước ngọt"), trong tên hồ đọc こ: 琵琶湖.',
    tu: [
      { w: '{湖|みずうみ}', ro: 'mizuumi', vi: 'hồ' },
      { w: '{琵琶湖|びわこ}', ro: 'Biwako', vi: 'hồ Biwa (lớn nhất Nhật Bản)' },
      { w: '{芦ノ湖|あしのこ}', ro: 'Ashinoko', vi: 'hồ Ashi (Hakone)' },
    ],
  },
  '案': {
    hv: 'ÁN', nghia: 'phương án, ý tưởng; dẫn đường', en: 'plan / proposal',
    on: ['アン'], kun: [],
    nho: 'Trên là 安 (yên — gợi âm アン), dưới là 木 (gỗ — chiếc bàn gỗ): ngồi yên bên bàn gỗ nghĩ PHƯƠNG ÁN. 案内 = đưa ra phương án vào bên trong → dẫn đường, hướng dẫn.',
    tu: [
      { w: '{案内|あんない}します', ro: 'annai shimasu', vi: 'hướng dẫn, dẫn đường' },
      { w: '{観光案内所|かんこうあんないじょ}', ro: 'kankou annaijo', vi: 'quầy thông tin du lịch' },
      { w: '{案|あん}', ro: 'an', vi: 'phương án, đề xuất' },
    ],
  },
  '内': {
    hv: 'NỘI', nghia: 'bên trong', en: 'inside',
    on: ['ナイ', 'ダイ'], kun: ['うち'],
    nho: 'Khung 冂 là cái cửa / khung nhà, bên trong có 人 (người) đi vào: BÊN TRONG. Đối nghĩa với 外 (ngoài). Chỉ 4 nét — chữ ✍ nên viết.',
    tu: [
      { w: '{案内|あんない}', ro: 'annai', vi: 'hướng dẫn' },
      { w: '{国内|こくない}', ro: 'kokunai', vi: 'trong nước' },
      { w: '{以内|いない}', ro: 'inai', vi: 'trong vòng (3日以内 = trong vòng 3 ngày)' },
      { w: '{内側|うちがわ}', ro: 'uchigawa', vi: 'phía bên trong' },
    ],
  },
  '定': {
    hv: 'ĐỊNH', nghia: 'định, cố định, quyết định', en: 'fix / decide',
    on: ['テイ', 'ジョウ'], kun: ['さだ・める'],
    nho: 'Trên là 宀 (mái nhà), dưới là biến thể của 正 (ngay ngắn): dưới mái nhà mọi thứ được đặt ngay ngắn, CỐ ĐỊNH một chỗ. 予定 = định trước; 指定席 = ghế được chỉ định.',
    tu: [
      { w: '{予定|よてい}', ro: 'yotei', vi: 'dự định, lịch' },
      { w: '{指定席|していせき}', ro: 'shiteiseki', vi: 'ghế đặt trước' },
      { w: '{定食|ていしょく}', ro: 'teishoku', vi: 'suất cơm phần' },
      { w: '{定休日|ていきゅうび}', ro: 'teikyuubi', vi: 'ngày nghỉ cố định (của cửa hàng)' },
    ],
  },
  '指': {
    hv: 'CHỈ', nghia: 'ngón tay; chỉ, trỏ', en: 'finger / point',
    on: ['シ'], kun: ['ゆび', 'さ・す'],
    nho: 'Bên trái 扌 (tay) gợi nghĩa, bên phải 旨 gợi âm シ: phần của bàn tay = NGÓN TAY, dùng ngón tay để CHỈ. 指定 = chỉ định.',
    tu: [
      { w: '{指定席|していせき}', ro: 'shiteiseki', vi: 'ghế đặt trước' },
      { w: '{指|ゆび}', ro: 'yubi', vi: 'ngón tay' },
      { w: '{指|さ}します', ro: 'sashimasu', vi: 'chỉ vào, trỏ' },
      { w: '{指輪|ゆびわ}', ro: 'yubiwa', vi: 'nhẫn' },
    ],
  },
  '側': {
    hv: 'TRẮC', nghia: 'phía, bên, cạnh', en: 'side',
    on: ['ソク'], kun: ['がわ', 'かわ'],
    nho: 'Bên trái 亻 (người) gợi nghĩa, bên phải 則 (quy tắc) gợi âm ソク: người đứng BÊN CẠNH. Sau danh từ đọc がわ (âm đục): 窓側, 右側. Đừng nhầm với 則 (quy tắc) và 測 (đo — có 氵).',
    tu: [
      { w: '{窓側|まどがわ}', ro: 'madogawa', vi: 'phía cửa sổ' },
      { w: '{通路側|つうろがわ}', ro: 'tsuurogawa', vi: 'phía lối đi' },
      { w: '{右側|みぎがわ}', ro: 'migigawa', vi: 'bên phải' },
      { w: '{両側|りょうがわ}', ro: 'ryougawa', vi: 'hai bên' },
    ],
  },
};
