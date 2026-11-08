/**
 * Chữ Hán MỚI của Bài 20 (うわさ — tiếp sau sách, N4) cho thẻ chữ Hán — cùng định dạng hanTu.ts.
 * 15 chữ: 様 確 実 彼 似 太 泣 表 情 報 絶 対 雲 想 幸 (N3 theo các bảng tham khảo phổ biến; 太 確 có bảng xếp N4)
 * — bảng `b20-han-tu` trong bai20.ts.
 * Cách nhớ: theo cấu tạo chữ khi chắc chắn; chữ hình thanh thì ghi rõ phần nào gợi nghĩa / gợi âm; chữ mà mẹo nhìn hình
 * không phải gốc chữ (様, 実 dạng mới, 幸) thì nói rõ là mẹo. Từ đi chung ưu tiên từ dùng trong bai20.ts.
 * On / Kun theo bảng thường dụng (常用): 対 và 想 không có âm Kun.
 * Tệp chỉ có `import type` — tải chậm như hanTu.ts.
 */
import type { HanTu } from '@/components/sach-hoc/kanji';

export const HAN_TU_20: Record<string, HanTu> = {
  '様': {
    hv: 'DẠNG', nghia: 'dáng vẻ, kiểu cách; ngài (kính ngữ sau tên)', en: 'manner / Mr., Ms.',
    on: ['ヨウ'], kun: ['さま'],
    nho: 'Bên trái 木 (cây), bên phải 羕 (gợi âm ヨウ — trên là 羊 con dê, dưới là dòng nước dài). Mẹo nhìn (không phải gốc chữ): "dáng cái cây, dáng con dê" = DẠNG, hình dáng → 様子. Đặt sau tên người là "ngài": お客様. Khác 横 (ngang) — phải là 黄.',
    tu: [
      { w: '{様子|ようす}', ro: 'yousu', vi: 'dáng vẻ, tình hình' },
      { w: 'お{客様|きゃくさま}', ro: 'okyakusama', vi: 'quý khách' },
      { w: '{皆様|みなさま}', ro: 'minasama', vi: 'quý vị' },
      { w: '{田中様|たなかさま}', ro: 'Tanaka-sama', vi: 'ngài / bà Tanaka (thư từ, cửa hàng)' },
    ],
  },
  '確': {
    hv: 'XÁC', nghia: 'chắc chắn, xác thực', en: 'certain / confirm',
    on: ['カク'], kun: ['たし・か', 'たし・かめる'],
    nho: '石 (đá) bên trái + 隺 (chim bay cao — gợi âm カク) bên phải: rắn chắc như đá = CHẮC CHẮN → 確か, 確認. Cùng bộ 石 với 破 (rách — Bài 19).',
    tu: [
      { w: '{確|たし}か', ro: 'tashika', vi: 'hình như là; chắc chắn' },
      { w: '{確|たし}かめる', ro: 'tashikameru', vi: 'kiểm tra cho chắc' },
      { w: '{確認|かくにん}', ro: 'kakunin', vi: 'xác nhận' },
      { w: '{正確|せいかく}', ro: 'seikaku', vi: 'chính xác (N3)' },
    ],
  },
  '実': {
    hv: 'THỰC', nghia: 'thật, sự thật; quả (trái cây)', en: 'truth / fruit',
    on: ['ジツ'], kun: ['み', 'みの・る'],
    nho: 'Chữ cũ 實 = 宀 (mái nhà) + 貫 (xâu tiền): trong nhà đầy tiền thật = ĐẦY, THỰC; cây đầy quả = 実 (み). Chữ mới 宀 + 三 + 大 — mẹo nhìn: dưới mái nhà có người (大) chất ba lớp (三) đồ thật. Khác 美 (đẹp — trên là 羊).',
    tu: [
      { w: '{実|じつ}は', ro: 'jitsu wa', vi: 'thật ra là' },
      { w: '{事実|じじつ}', ro: 'jijitsu', vi: 'sự thật' },
      { w: '{実際|じっさい}', ro: 'jissai', vi: 'thực tế (N3)' },
      { w: '{木|き}の{実|み}', ro: 'ki no mi', vi: 'quả trên cây' },
    ],
  },
  '彼': {
    hv: 'BỈ', nghia: 'người kia, anh ấy', en: 'he / that',
    on: ['ヒ'], kun: ['かれ', 'かの'],
    nho: '彳 (bước chân) bên trái + 皮 (da — gợi âm ヒ) bên phải: người đang bước đi ĐẰNG KIA = người ấy → 彼, 彼女. Cùng 皮 với 破 (Bài 19), 波 (sóng — trái là 氵).',
    tu: [
      { w: '{彼|かれ}', ro: 'kare', vi: 'anh ấy; bạn trai' },
      { w: '{彼女|かのじょ}', ro: 'kanojo', vi: 'cô ấy; bạn gái' },
      { w: '{彼氏|かれし}', ro: 'kareshi', vi: 'bạn trai (N3)' },
      { w: '{彼|かれ}ら', ro: 'karera', vi: 'họ (N3)' },
    ],
  },
  '似': {
    hv: 'TỰ', nghia: 'giống', en: 'resemble',
    on: ['ジ'], kun: ['に・る'],
    nho: '亻 (người) bên trái + 以 (gợi âm ジ; "lấy làm") bên phải: người lấy người khác làm mẫu = GIỐNG → 似ている. Khác 以 (以上) — thiếu 亻.',
    tu: [
      { w: '{似|に}ている', ro: 'nite iru', vi: 'giống' },
      { w: '{似合|にあ}う', ro: 'niau', vi: 'hợp với' },
      { w: '{真似|まね}', ro: 'mane', vi: 'bắt chước (N3)' },
    ],
  },
  '太': {
    hv: 'THÁI', nghia: 'to, béo; rất', en: 'fat / thick',
    on: ['タイ', 'タ'], kun: ['ふと・い', 'ふと・る'],
    nho: '大 (to) + 丶 (một chấm ở dưới, giữa hai chân): to thêm một chút nữa = TO, BÉO → 太る, 太い; 太陽 = mặt trời — thứ to nhất. Chấm ở DƯỚI; 犬 (chó) chấm ở trên bên phải.',
    tu: [
      { w: '{太|ふと}る', ro: 'futoru', vi: 'béo lên' },
      { w: '{太|ふと}い', ro: 'futoi', vi: 'to, dày' },
      { w: '{太陽|たいよう}', ro: 'taiyou', vi: 'mặt trời' },
      { w: '{太平洋|たいへいよう}', ro: 'Taiheiyou', vi: 'Thái Bình Dương' },
    ],
  },
  '泣': {
    hv: 'KHẤP', nghia: 'khóc', en: 'cry',
    on: ['キュウ'], kun: ['な・く'],
    nho: '氵 (nước) bên trái + 立 (đứng — gợi âm) bên phải: đứng đó mà nước mắt chảy = KHÓC → 泣く. Đồng âm 鳴く (chim, mèo kêu — có 口 và 鳥) — khác chữ!',
    tu: [
      { w: '{泣|な}く', ro: 'naku', vi: 'khóc' },
      { w: '{泣|な}き{出|だ}す', ro: 'nakidasu', vi: 'oà khóc' },
      { w: '{泣|な}き{声|ごえ}', ro: 'nakigoe', vi: 'tiếng khóc' },
      { w: '{泣|な}きそう', ro: 'nakisou', vi: 'sắp khóc' },
    ],
  },
  '表': {
    hv: 'BIỂU', nghia: 'mặt ngoài; biểu hiện; bảng', en: 'surface / express / table',
    on: ['ヒョウ'], kun: ['おもて', 'あらわ・す', 'あらわ・れる'],
    nho: 'Chữ cổ = 衣 (áo) với 毛 (lông) ở giữa: áo lông khoác BÊN NGOÀI = MẶT NGOÀI, đưa ra ngoài → 表情 (nét mặt hiện ra), 発表 (đưa ra công bố), 時刻表 (bảng bày ra để xem). Khác 素 (素晴らしい — dưới là 糸).',
    tu: [
      { w: '{発表|はっぴょう}', ro: 'happyou', vi: 'công bố; thuyết trình' },
      { w: '{表情|ひょうじょう}', ro: 'hyoujou', vi: 'nét mặt (N3)' },
      { w: '{時刻表|じこくひょう}', ro: 'jikokuhyou', vi: 'bảng giờ tàu' },
      { w: '{表|おもて}', ro: 'omote', vi: 'mặt trước' },
      { w: '{代表|だいひょう}', ro: 'daihyou', vi: 'đại diện (N3)' },
    ],
  },
  '情': {
    hv: 'TÌNH', nghia: 'tình cảm; tình hình', en: 'feeling / situation',
    on: ['ジョウ', 'セイ'], kun: ['なさ・け'],
    nho: '忄 (lòng — bộ 心 đứng) bên trái + 青 (xanh, trong — gợi âm) bên phải: lòng trong sáng = TÌNH cảm; mở rộng thành "tình hình" → 情報 (tin về tình hình). Cùng 青 với 晴 (Bài 15 — trái là 日).',
    tu: [
      { w: '{情報|じょうほう}', ro: 'jouhou', vi: 'thông tin' },
      { w: '{表情|ひょうじょう}', ro: 'hyoujou', vi: 'nét mặt (N3)' },
      { w: '{友情|ゆうじょう}', ro: 'yuujou', vi: 'tình bạn (N3)' },
      { w: '{事情|じじょう}', ro: 'jijou', vi: 'hoàn cảnh, lý do (N3)' },
    ],
  },
  '報': {
    hv: 'BÁO', nghia: 'báo tin; báo đáp', en: 'report / news',
    on: ['ホウ'], kun: ['むく・いる'],
    nho: 'Bên trái 幸 (vốn vẽ cái cùm tay), bên phải 㞋 (người quỳ + bàn tay): bắt kẻ có tội rồi BÁO lên trên → 報告, 予報, 情報. Phần phải giống 服 (quần áo — trái là 月).',
    tu: [
      { w: '{情報|じょうほう}', ro: 'jouhou', vi: 'thông tin' },
      { w: '{天気予報|てんきよほう}', ro: 'tenki yohou', vi: 'dự báo thời tiết' },
      { w: '{予報|よほう}', ro: 'yohou', vi: 'dự báo' },
      { w: '{報告|ほうこく}', ro: 'houkoku', vi: 'báo cáo (N3)' },
    ],
  },
  '絶': {
    hv: 'TUYỆT', nghia: 'dứt hẳn; tuyệt đối', en: 'sever / absolutely',
    on: ['ゼツ'], kun: ['た・える', 'た・やす', 'た・つ'],
    nho: '糸 (sợi chỉ) bên trái + 色 (vốn là 刀 dao + người quỳ; nay gợi âm) bên phải: lấy dao cắt ĐỨT HẲN sợi chỉ = TUYỆT → 絶対 (đã dứt khoát, không đổi). Khác 給 (給料 — phải là 合).',
    tu: [
      { w: '{絶対|ぜったい}', ro: 'zettai', vi: 'tuyệt đối' },
      { w: '{絶対|ぜったい}に', ro: 'zettai ni', vi: 'nhất định' },
      { w: '{絶|た}える', ro: 'taeru', vi: 'dứt, tuyệt (N1 — chỉ để biết âm kun)' },
    ],
  },
  '対': {
    hv: 'ĐỐI', nghia: 'đối lại, đối với; cặp', en: 'opposite / versus',
    on: ['タイ', 'ツイ'], kun: [],
    nho: 'Chữ cũ 對: hai vật đặt ĐỐI nhau. Chữ mới = 文 + 寸 (bàn tay đo): mẹo nhìn — đặt chữ (文) đối diện bàn tay (寸). → 反対, 絶対. Khác 村 (làng — trái là 木).',
    tu: [
      { w: '{絶対|ぜったい}', ro: 'zettai', vi: 'tuyệt đối' },
      { w: '{反対|はんたい}', ro: 'hantai', vi: 'phản đối; ngược lại' },
      { w: '{反対側|はんたいがわ}', ro: 'hantaigawa', vi: 'phía đối diện' },
      { w: '～に{対|たい}して', ro: '~ni taishite', vi: 'đối với ~ (N3)' },
    ],
  },
  '雲': {
    hv: 'VÂN', nghia: 'mây', en: 'cloud',
    on: ['ウン'], kun: ['くも'],
    nho: '雨 (mưa) ở trên + 云 (vốn vẽ đám mây cuộn) ở dưới: thứ cuộn trên trời mang mưa đến = MÂY → 雲. 曇 (くもり — Bài 15) = 日 + 雲: mặt trời bị mây che. Khác 雪 (dưới là ヨ), 雷 (dưới là 田).',
    tu: [
      { w: '{雲|くも}', ro: 'kumo', vi: 'mây' },
      { w: '{雨雲|あまぐも}', ro: 'amagumo', vi: 'mây mưa' },
      { w: '{白|しろ}い{雲|くも}', ro: 'shiroi kumo', vi: 'mây trắng' },
    ],
  },
  '想': {
    hv: 'TƯỞNG', nghia: 'nghĩ, tưởng tượng', en: 'idea / imagine',
    on: ['ソウ', 'ソ'], kun: [],
    nho: '相 (nhìn kỹ — gợi âm ソウ) ở trên + 心 (lòng) ở dưới: trong lòng "nhìn thấy" hình ảnh = TƯỞNG, nghĩ đến → 予想 (nghĩ trước), 感想 (điều cảm thấy). Khác 思 (おもう — trên là 田).',
    tu: [
      { w: '{予想|よそう}', ro: 'yosou', vi: 'dự đoán' },
      { w: '{感想|かんそう}', ro: 'kansou', vi: 'cảm tưởng (N3)' },
      { w: '{想像|そうぞう}', ro: 'souzou', vi: 'tưởng tượng (N3)' },
      { w: '{理想|りそう}', ro: 'risou', vi: 'lý tưởng (N3)' },
    ],
  },
  '幸': {
    hv: 'HẠNH', nghia: 'hạnh phúc, may mắn', en: 'happiness / luck',
    on: ['コウ'], kun: ['しあわ・せ', 'さいわ・い', 'さち'],
    nho: 'Gốc chữ vẽ cái cùm tay; thoát được cùm là MAY MẮN → 幸運, 幸せ. Mẹo nhìn (không phải gốc): 土 ở trên + 辛 (cay đắng) ở dưới — đi qua cay đắng mới tới HẠNH PHÚC. Khác 辛 (からい) — trên là 立.',
    tu: [
      { w: '{幸|しあわ}せ', ro: 'shiawase', vi: 'hạnh phúc' },
      { w: '{幸|さいわ}い', ro: 'saiwai', vi: 'may là (N3)' },
      { w: '{不幸|ふこう}', ro: 'fukou', vi: 'bất hạnh (N3)' },
      { w: '{幸運|こううん}', ro: 'kouun', vi: 'vận may' },
    ],
  },
};
