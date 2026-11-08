/**
 * Chữ Hán MỚI của Bài 18 (引っ越し — tiếp sau sách, N4) cho thẻ chữ Hán — cùng định dạng hanTu.ts.
 * 15 chữ: 建 県 (N4) · 箱 段 具 宅 連 助 礼 掛 返 頼 庭 費 戻 (N3) — bảng `b18-han-tu` trong bai18.ts.
 * Cách nhớ: theo cấu tạo chữ khi chắc chắn; chữ hình thanh thì ghi rõ phần nào gợi nghĩa / gợi âm;
 * chữ mà mẹo nhìn hình không phải gốc chữ (県, 頼) thì nói rõ là mẹo. Từ đi chung ưu tiên từ dùng trong bai18.ts.
 * On / Kun theo bảng thường dụng (常用): 箱 và 掛 không có âm On thường dụng.
 * Tệp chỉ có `import type` — tải chậm như hanTu.ts.
 */
import type { HanTu } from '@/components/sach-hoc/kanji';

export const HAN_TU_18: Record<string, HanTu> = {
  '建': {
    hv: 'KIẾN', nghia: 'xây, dựng', en: 'build',
    on: ['ケン', 'コン'], kun: ['た・てる', 'た・つ'],
    nho: '聿 (bàn tay cầm cây bút) + 廴 (bước dài — nét kéo dài ôm phía dưới, viết SAU CÙNG): cầm bút vẽ rồi dựng lên = XÂY. ～{階建|かいだ}て đọc だて (âm đục). Đừng nhầm với 健 (khoẻ — có thêm 亻).',
    tu: [
      { w: '{建物|たてもの}', ro: 'tatemono', vi: 'toà nhà' },
      { w: '{建|た}てます', ro: 'tatemasu', vi: 'xây (nhà)' },
      { w: '{二階建|にかいだ}て', ro: 'nikaidate', vi: 'nhà 2 tầng' },
      { w: '{一戸建|いっこだ}て', ro: 'ikkodate', vi: 'nhà riêng (không phải căn hộ)' },
    ],
  },
  '県': {
    hv: 'HUYỆN', nghia: 'tỉnh (đơn vị hành chính của Nhật)', en: 'prefecture',
    on: ['ケン'], kun: [],
    nho: 'Chữ cũ là 縣. Mẹo nhìn (không phải gốc chữ): con mắt 目 nhìn xuống vùng đất 小 bên dưới. ⚠ Hán Việt là HUYỆN nhưng ở Nhật 県 là TỈNH — Nhật có 47 {都道府県|とどうふけん}.',
    tu: [
      { w: '{県|けん}', ro: 'ken', vi: 'tỉnh' },
      { w: '{千葉県|ちばけん}', ro: 'Chiba-ken', vi: 'tỉnh Chiba' },
      { w: '{県立|けんりつ}', ro: 'kenritsu', vi: 'của tỉnh, tỉnh lập' },
      { w: '{県庁|けんちょう}', ro: 'kenchou', vi: 'uỷ ban tỉnh' },
    ],
  },
  '箱': {
    hv: 'TƯƠNG', nghia: 'hộp, thùng', en: 'box',
    on: [], kun: ['はこ'],
    nho: 'Trên là ⺮ (tre) gợi nghĩa, dưới là 相 gợi âm: hộp đan bằng tre = HỘP. Đứng riêng đọc はこ, sau danh từ khác đọc ばこ: ごみ箱, 段ボール箱, 本箱.',
    tu: [
      { w: '{箱|はこ}', ro: 'hako', vi: 'hộp, thùng' },
      { w: '{段|だん}ボール{箱|ばこ}', ro: 'danbooru-bako', vi: 'thùng các-tông' },
      { w: 'ごみ{箱|ばこ}', ro: 'gomibako', vi: 'thùng rác' },
      { w: '{本箱|ほんばこ}', ro: 'honbako', vi: 'tủ sách' },
    ],
  },
  '段': {
    hv: 'ĐOẠN', nghia: 'bậc, nấc, tầng', en: 'step / grade',
    on: ['ダン'], kun: [],
    nho: 'Phần trái là những bậc đá, phần phải 殳 là bàn tay cầm dùi: đẽo đá thành từng BẬC → 階段 (cầu thang), 値段 (giá cả — từng nấc giá). 段ボール = bìa nhiều lớp gợn sóng.',
    tu: [
      { w: '{階段|かいだん}', ro: 'kaidan', vi: 'cầu thang' },
      { w: '{段|だん}ボール', ro: 'danbooru', vi: 'bìa / thùng các-tông' },
      { w: '{値段|ねだん}', ro: 'nedan', vi: 'giá cả' },
      { w: '{一段|いちだん}', ro: 'ichidan', vi: 'một bậc' },
    ],
  },
  '具': {
    hv: 'CỤ', nghia: 'đồ dùng, dụng cụ', en: 'tool / utensil',
    on: ['グ'], kun: [],
    nho: 'Phần trên gốc là một vật quý (nay viết như 目), phần dưới là 一 + 八 — hai bàn tay nâng: hai tay sắm sửa đồ dùng đầy đủ = ĐỒ DÙNG. Đừng nhầm với 真 (thật — có 十 ở trên).',
    tu: [
      { w: '{家具|かぐ}', ro: 'kagu', vi: 'đồ nội thất' },
      { w: '{道具|どうぐ}', ro: 'dougu', vi: 'dụng cụ' },
      { w: '{具合|ぐあい}', ro: 'guai', vi: 'tình trạng (sức khoẻ, máy móc)' },
      { w: '{文房具|ぶんぼうぐ}', ro: 'bunbougu', vi: 'văn phòng phẩm' },
    ],
  },
  '宅': {
    hv: 'TRẠCH', nghia: 'nhà ở', en: 'house / home',
    on: ['タク'], kun: [],
    nho: 'Trên là 宀 (mái nhà) gợi nghĩa, dưới là 乇 gợi âm タク: chỗ ở dưới mái = NHÀ. 宅配便 = "giao tận nhà". Đừng nhầm với 宇 (vũ — mái + 于).',
    tu: [
      { w: 'お{宅|たく}', ro: 'otaku', vi: 'nhà (của người khác — lịch sự)' },
      { w: '{自宅|じたく}', ro: 'jitaku', vi: 'nhà riêng của mình' },
      { w: '{宅配便|たくはいびん}', ro: 'takuhaibin', vi: 'chuyển phát tận nhà' },
      { w: '{住宅|じゅうたく}', ro: 'juutaku', vi: 'nhà ở' },
    ],
  },
  '連': {
    hv: 'LIÊN', nghia: 'liền, nối tiếp; dắt theo', en: 'connect / take along',
    on: ['レン'], kun: ['つ・れる', 'つら・なる', 'つら・ねる'],
    nho: '辶 (bước đi) + 車 (xe): xe nối đuôi nhau chạy = LIỀN, nối tiếp; kéo theo người khác = 連れる (dắt theo). Đừng nhầm với 運 (vận — trong 辶 là 軍).',
    tu: [
      { w: '{連絡|れんらく}', ro: 'renraku', vi: 'liên lạc' },
      { w: '{連|つ}れていきます', ro: 'tsurete ikimasu', vi: 'dẫn (ai) đi' },
      { w: '{連休|れんきゅう}', ro: 'renkyuu', vi: 'kỳ nghỉ dài (Bài 17)' },
    ],
  },
  '助': {
    hv: 'TRỢ', nghia: 'giúp, cứu', en: 'help / rescue',
    on: ['ジョ'], kun: ['たす・ける', 'たす・かる', 'すけ'],
    nho: 'Bên trái 且 gợi âm ジョ, bên phải 力 (sức) gợi nghĩa: góp thêm SỨC cho người = GIÚP. 助ける (tha — giúp người) ↔ 助かる (tự — được cứu, "đỡ quá").',
    tu: [
      { w: '{助|たす}かります', ro: 'tasukarimasu', vi: 'đỡ quá, được cứu' },
      { w: '{助|たす}けます', ro: 'tasukemasu', vi: 'giúp, cứu' },
      { w: '{助手|じょしゅ}', ro: 'joshu', vi: 'trợ lý' },
    ],
  },
  '礼': {
    hv: 'LỄ', nghia: 'lễ, phép lịch sự; cảm ơn', en: 'courtesy / thanks',
    on: ['レイ', 'ライ'], kun: [],
    nho: 'Bên trái 礻 (bộ thị — thần linh, nghi lễ) gợi nghĩa: phép tắc khi cúng tế = LỄ → lễ phép, lời cảm ơn. 失礼 = "mất lễ" = thất lễ.',
    tu: [
      { w: 'お{礼|れい}', ro: 'orei', vi: 'lời cảm ơn, quà cảm ơn' },
      { w: '{失礼|しつれい}', ro: 'shitsurei', vi: 'thất lễ; xin phép' },
      { w: '{礼金|れいきん}', ro: 'reikin', vi: 'tiền lễ khi thuê nhà (không hoàn lại)' },
    ],
  },
  '掛': {
    hv: 'QUẢI', nghia: 'treo; (gọi điện, khoá cửa…)', en: 'hang',
    on: [], kun: ['か・ける', 'か・かる', 'かかり'],
    nho: 'Bên trái 扌 (tay) gợi nghĩa, bên phải 卦 (quẻ bói) gợi âm: dùng tay móc lên = TREO. Nhiều nơi viết かける bằng かな, nhất là nghĩa "gọi điện, khoá cửa".',
    tu: [
      { w: '{掛|か}けます', ro: 'kakemasu', vi: 'treo' },
      { w: '{出掛|でか}けます', ro: 'dekakemasu', vi: 'ra ngoài, đi vắng' },
      { w: '{掛|か}け{時計|どけい}', ro: 'kakedokei', vi: 'đồng hồ treo tường' },
    ],
  },
  '返': {
    hv: 'PHẢN', nghia: 'trả lại; đáp lại', en: 'return (something)',
    on: ['ヘン'], kun: ['かえ・す', 'かえ・る'],
    nho: '辶 (bước đi) + 反 (ngược lại — gợi âm ハン／ヘン): đi ngược về = TRẢ LẠI, đáp lại → 返事 (lời đáp). Đồng âm: 返す (trả lại đồ) ≠ 帰す (cho ai về).',
    tu: [
      { w: '{返|かえ}します', ro: 'kaeshimasu', vi: 'trả lại' },
      { w: '{返事|へんじ}', ro: 'henji', vi: 'lời đáp, hồi âm' },
      { w: '{返品|へんぴん}', ro: 'henpin', vi: 'trả hàng' },
    ],
  },
  '頼': {
    hv: 'LẠI', nghia: 'nhờ; nương tựa, tin cậy', en: 'request / rely on',
    on: ['ライ'], kun: ['たの・む', 'たの・もしい', 'たよ・る'],
    nho: 'Mẹo nhìn (không phải gốc chữ): 束 (bó) + 頁 (cái đầu) — bó đồ của mình rồi gửi lên đầu người khác = NHỜ, nương tựa. Hai âm kun: たのむ (nhờ) / たよる (dựa vào). Đừng nhầm với 願 (mong — trái là 原).',
    tu: [
      { w: '{頼|たの}みます', ro: 'tanomimasu', vi: 'nhờ' },
      { w: '{頼|たよ}ります', ro: 'tayorimasu', vi: 'dựa vào' },
      { w: '{信頼|しんらい}', ro: 'shinrai', vi: 'tin cậy (N2)' },
    ],
  },
  '庭': {
    hv: 'ĐÌNH', nghia: 'sân, vườn', en: 'garden / yard',
    on: ['テイ'], kun: ['にわ'],
    nho: '广 (mái nhà rộng) gợi nghĩa + 廷 (sân chầu — gợi âm テイ): khoảng SÂN trước ngôi nhà lớn. Đứng riêng đọc にわ; trong từ ghép đọc テイ: 家庭, 校庭. Đừng nhầm với 底 (đáy).',
    tu: [
      { w: '{庭|にわ}', ro: 'niwa', vi: 'sân vườn' },
      { w: '{家庭|かてい}', ro: 'katei', vi: 'gia đình, tổ ấm' },
      { w: '{校庭|こうてい}', ro: 'koutei', vi: 'sân trường' },
    ],
  },
  '費': {
    hv: 'PHÍ', nghia: 'chi phí; tiêu tốn', en: 'expense',
    on: ['ヒ'], kun: ['つい・やす'],
    nho: 'Trên là 弗 gợi âm, dưới là 貝 (vỏ sò = tiền ngày xưa) gợi nghĩa: tiền tiêu đi = CHI PHÍ. Từ ghép ～費 = tiền ~: 交通費, 生活費, 会費.',
    tu: [
      { w: '{費用|ひよう}', ro: 'hiyou', vi: 'chi phí' },
      { w: '{交通費|こうつうひ}', ro: 'koutsuuhi', vi: 'tiền đi lại' },
      { w: '{生活費|せいかつひ}', ro: 'seikatsuhi', vi: 'sinh hoạt phí' },
      { w: '{会費|かいひ}', ro: 'kaihi', vi: 'hội phí' },
    ],
  },
  '戻': {
    hv: 'LỆ', nghia: 'quay lại; trả về chỗ cũ', en: 'return / go back',
    on: ['レイ'], kun: ['もど・る', 'もど・す'],
    nho: 'Chữ cũ 戾 = 戸 (cánh cửa) + 犬 (con chó — nay viết 大): con chó chui ra cửa rồi QUAY LẠI. 戻る (tự — quay lại) ↔ 戻す (tha — để lại chỗ cũ). Đừng nhầm với 涙 (nước mắt — có 氵).',
    tu: [
      { w: '{戻|もど}ります', ro: 'modorimasu', vi: 'quay lại' },
      { w: '{戻|もど}します', ro: 'modoshimasu', vi: 'để lại chỗ cũ, trả về' },
      { w: '{払|はら}い{戻|もど}し', ro: 'haraimodoshi', vi: 'hoàn tiền' },
    ],
  },
};
