/**
 * Chữ Hán MỚI của Bài 30 (伝言 — tiếp sau sách, cấp N3) cho thẻ chữ Hán — cùng định dạng hanTu.ts.
 * 20 chữ: 絡 務 勤 役 資 求 望 欠 誤 頂 打 追 完 到 数 (N3 theo các bảng tham khảo phổ biến; 絡 có bảng xếp N2) · 預 了 御
 * (N2–N3) · 承 依 (N2) — JLPT không công bố danh sách chữ chính thức — bảng `b30-han-tu` trong bai30.ts.
 * Cách nhớ: theo cấu tạo chữ (phần chỉ nghĩa + phần gợi âm của chữ hình thanh ghi rõ); 求, 欠, 承, 了 là chữ cổ / chữ
 * tượng hình mà giải nghĩa nguồn gốc không thống nhất nên ghi rõ là "cách nhớ bằng hình", không khẳng định nguồn gốc.
 * On / Kun theo bảng thường dụng (常用): 役 資 完 到 了 chỉ có âm On (役 thêm エキ); 御 kun = おん; 依 kun よる ít dùng.
 * Tệp chỉ có `import type` — tải chậm như hanTu.ts.
 */
import type { HanTu } from '@/components/sach-hoc/kanji';

export const HAN_TU_30: Record<string, HanTu> = {
  '絡': {
    hv: 'LẠC', nghia: 'quấn, nối; liên lạc', en: 'entwine / contact',
    on: ['ラク'], kun: ['から・む', 'から・まる', 'から・める'],
    nho: 'Bên trái 糸 (sợi chỉ), bên phải 各 (gợi âm; "mỗi, từng nơi"): sợi chỉ NỐI từng nơi lại với nhau → 連絡 (liên lạc). Khác 給 (cấp — 糸 + 合) và 格 (cách — 木 + 各).',
    tu: [
      { w: '{連絡|れんらく}', ro: 'renraku', vi: 'liên lạc' },
      { w: '{連絡先|れんらくさき}', ro: 'renrakusaki', vi: 'thông tin liên lạc' },
      { w: '{絡|から}む', ro: 'karamu', vi: 'quấn vào, dính líu (N1)' },
    ],
  },
  '務': {
    hv: 'VỤ', nghia: 'việc, nhiệm vụ', en: 'duty / task',
    on: ['ム'], kun: ['つと・める', 'つと・まる'],
    nho: '矛 (cây giáo) + 攵 (tay cầm roi — hành động) + 力 (sức): dồn SỨC làm việc được giao → NHIỆM VỤ → 事務, 勤務, 義務. ⚠ 務める = đảm nhận vai trò; khác 勤める (làm cho công ty) và 努める (cố gắng). Khác 努 (奴 + 力).',
    tu: [
      { w: '{事務|じむ}', ro: 'jimu', vi: 'công việc văn phòng' },
      { w: '{勤務|きんむ}', ro: 'kinmu', vi: 'làm việc (theo giờ, tại nơi)' },
      { w: '{業務|ぎょうむ}', ro: 'gyoumu', vi: 'nghiệp vụ (N2)' },
      { w: '{義務|ぎむ}', ro: 'gimu', vi: 'nghĩa vụ (N3)' },
      { w: '{務|つと}める', ro: 'tsutomeru', vi: 'đảm nhận (vai trò) (N2)' },
    ],
  },
  '勤': {
    hv: 'CẦN', nghia: 'chăm chỉ; đi làm', en: 'diligence / work for',
    on: ['キン', 'ゴン'], kun: ['つと・める', 'つと・まる'],
    nho: 'Bên trái 堇 (gợi âm キン; đất sét), bên phải 力 (sức): bỏ SỨC lao động CHĂM CHỈ = CẦN → 勤める (làm cho công ty: 会社に勤める), 通勤, 出勤. Khác 動 (động — 重 + 力) và 働 (làm việc — 亻 + 動).',
    tu: [
      { w: '{勤|つと}める', ro: 'tsutomeru', vi: 'làm việc cho (công ty)' },
      { w: '{勤務|きんむ}', ro: 'kinmu', vi: 'làm việc' },
      { w: '{通勤|つうきん}', ro: 'tsuukin', vi: 'đi làm (đường đi — N3)' },
      { w: '{出勤|しゅっきん}', ro: 'shukkin', vi: 'đến chỗ làm (N3)' },
    ],
  },
  '役': {
    hv: 'DỊCH', nghia: 'vai, phận sự; chức', en: 'role / service',
    on: ['ヤク', 'エキ'], kun: [],
    nho: 'Bên trái 彳 (bước đi), bên phải 殳 (tay cầm gậy): người lính ĐI TUẦN cầm gậy làm phận sự được giao → VAI, PHẬN SỰ → 役割, 役に立つ. Cùng 殳: 投 (ném — 扌), 設 (lập — 言).',
    tu: [
      { w: '{役割|やくわり}', ro: 'yakuwari', vi: 'vai trò' },
      { w: '{役|やく}に{立|た}つ', ro: 'yaku ni tatsu', vi: 'có ích' },
      { w: '{役所|やくしょ}', ro: 'yakusho', vi: 'cơ quan hành chính' },
      { w: '{役員|やくいん}', ro: 'yakuin', vi: 'ban lãnh đạo (N2)' },
      { w: '{主役|しゅやく}', ro: 'shuyaku', vi: 'vai chính (N2)' },
    ],
  },
  '資': {
    hv: 'TƯ', nghia: 'của cải, vốn; tư liệu', en: 'resources / capital',
    on: ['シ'], kun: [],
    nho: 'Trên 次 (gợi âm シ), dưới 貝 (vỏ sò = tiền): TIỀN CỦA dự trữ, nguồn VỐN → 資料 (tư liệu = "vốn" thông tin), 資格. Khác 貸 (cho mượn — 代 + 貝). ⚠ 資格 (しかく) đồng âm 四角 (hình vuông).',
    tu: [
      { w: '{資料|しりょう}', ro: 'shiryou', vi: 'tài liệu' },
      { w: '{資格|しかく}', ro: 'shikaku', vi: 'chứng chỉ, tư cách' },
      { w: '{資源|しげん}', ro: 'shigen', vi: 'tài nguyên (N2)' },
      { w: '{投資|とうし}', ro: 'toushi', vi: 'đầu tư (N2)' },
    ],
  },
  '求': {
    hv: 'CẦU', nghia: 'tìm, mong, đòi hỏi', en: 'request / seek',
    on: ['キュウ'], kun: ['もと・める'],
    nho: 'Cách nhớ bằng hình: chữ cổ thường được giải là tấm ÁO LÔNG THÚ — thứ ai cũng MONG CÓ → tìm, mong cầu → 求める, 要求. Có một chấm nhỏ ở góc trên bên phải. Thêm 攵 → 救 (cứu); thêm 王 → 球 (quả bóng — 野球).',
    tu: [
      { w: '{求|もと}める', ro: 'motomeru', vi: 'yêu cầu, đòi hỏi; tìm kiếm' },
      { w: '{要求|ようきゅう}', ro: 'youkyuu', vi: 'yêu cầu (N3)' },
      { w: '{求人|きゅうじん}', ro: 'kyuujin', vi: 'tuyển người (N2)' },
      { w: '{請求|せいきゅう}', ro: 'seikyuu', vi: 'yêu cầu thanh toán (N2)' },
    ],
  },
  '望': {
    hv: 'VỌNG', nghia: 'trông mong, ước', en: 'hope / wish',
    on: ['ボウ', 'モウ'], kun: ['のぞ・む'],
    nho: '亡 (gợi âm ボウ) + 月 (mặt trăng) + 王 (ở đây là hình người đứng trên đất): người ĐỨNG NHÓN CHÂN NGÓNG TRĂNG → TRÔNG MONG → 希望, 望む. Phần trên giống 忘 (quên — 亡 + 心).',
    tu: [
      { w: '{希望|きぼう}', ro: 'kibou', vi: 'mong muốn, nguyện vọng' },
      { w: '{望|のぞ}む', ro: 'nozomu', vi: 'mong, ước (N3)' },
      { w: '{失望|しつぼう}', ro: 'shitsubou', vi: 'thất vọng (N2)' },
      { w: '{望遠鏡|ぼうえんきょう}', ro: 'bouenkyou', vi: 'kính viễn vọng' },
    ],
  },
  '欠': {
    hv: 'KHIẾM', nghia: 'thiếu', en: 'lack / absent',
    on: ['ケツ'], kun: ['か・ける', 'か・く'],
    nho: 'Cách nhớ bằng hình: người HÁ MIỆNG NGÁP (phần trên) vì THIẾU hơi → THIẾU → 欠ける, 欠席 (Bài 26). Nằm trong 次 (thứ), 吹 (thổi), 歌 (bài hát). 4 nét — dễ viết.',
    tu: [
      { w: '{欠席|けっせき}', ro: 'kesseki', vi: 'vắng mặt' },
      { w: '{欠|か}ける', ro: 'kakeru', vi: 'thiếu; bị mẻ' },
      { w: '{欠点|けってん}', ro: 'ketten', vi: 'khuyết điểm (N3)' },
      { w: '{欠|か}かす', ro: 'kakasu', vi: 'bỏ sót, thiếu (欠かせない = không thể thiếu)' },
    ],
  },
  '誤': {
    hv: 'NGỘ', nghia: 'sai, lầm', en: 'mistake / err',
    on: ['ゴ'], kun: ['あやま・る'],
    nho: 'Bên trái 言 (lời), bên phải 呉 (gợi âm ゴ): lời nói LỆCH đi → SAI → 誤り, 誤解. ⚠ Khác 語 (ngữ — 言 + 吾): cùng 言, cùng đọc ゴ. ⚠ 誤る (sai) cùng âm 謝る (xin lỗi — Bài 19).',
    tu: [
      { w: '{誤|あやま}り', ro: 'ayamari', vi: 'sai sót' },
      { w: '{誤解|ごかい}', ro: 'gokai', vi: 'hiểu lầm (N3)' },
      { w: '{誤|あやま}る', ro: 'ayamaru', vi: 'sai, mắc lỗi (N2)' },
    ],
  },
  '頂': {
    hv: 'ĐỈNH', nghia: 'đỉnh; nhận (khiêm nhường)', en: 'summit / receive',
    on: ['チョウ'], kun: ['いただ・く', 'いただき'],
    nho: 'Bên trái 丁 (gợi âm チョウ; cái đinh nhọn), bên phải 頁 (cái đầu): chỗ CAO NHẤT trên đầu → ĐỈNH (頂上); đội lên đầu kính cẩn → NHẬN = 頂く (thường viết いただく). Khác 項 (hạng — 工 + 頁) và 順 (thuận — 川 + 頁).',
    tu: [
      { w: '{頂|いただ}く', ro: 'itadaku', vi: 'nhận (khiêm nhường; thường viết kana)' },
      { w: '{頂上|ちょうじょう}', ro: 'choujou', vi: 'đỉnh núi (N3)' },
      { w: '{山頂|さんちょう}', ro: 'sanchou', vi: 'đỉnh núi (N2)' },
    ],
  },
  '打': {
    hv: 'ĐẢ', nghia: 'đánh, gõ', en: 'hit / strike',
    on: ['ダ'], kun: ['う・つ'],
    nho: 'Bên trái 扌 (tay), bên phải 丁 (cái đinh): TAY ĐÓNG ĐINH → ĐÁNH, GÕ → 打つ, 打ち合わせ (gõ nhịp cho khớp → bàn cho khớp). 5 nét — dễ viết.',
    tu: [
      { w: '{打|う}つ', ro: 'utsu', vi: 'đánh, gõ' },
      { w: '{打|う}ち{合|あ}わせ', ro: 'uchiawase', vi: 'buổi họp bàn' },
      { w: '{打|う}ち{明|あ}ける', ro: 'uchiakeru', vi: 'thổ lộ (N2)' },
      { w: '{打者|だしゃ}', ro: 'dasha', vi: 'người đánh bóng (bóng chày)' },
    ],
  },
  '追': {
    hv: 'TRUY', nghia: 'đuổi theo; thêm sau', en: 'chase / add',
    on: ['ツイ'], kun: ['お・う'],
    nho: 'Bộ 辶 (bước đi) ôm 𠂤 (gò đất, đoàn người): BƯỚC THEO SAU đoàn người → ĐUỔI THEO, THÊM VÀO SAU → 追う, 追加. ⚠ Khác 退 (lùi — Bài 29: 辶 + 艮) và 迫 (bức — 辶 + 白).',
    tu: [
      { w: '{追加|ついか}', ro: 'tsuika', vi: 'bổ sung' },
      { w: '{追|お}う', ro: 'ou', vi: 'đuổi theo (N3)' },
      { w: '{追|お}い{越|こ}す', ro: 'oikosu', vi: 'vượt lên (N3)' },
      { w: '{追|お}いつく', ro: 'oitsuku', vi: 'đuổi kịp (N3)' },
    ],
  },
  '完': {
    hv: 'HOÀN', nghia: 'trọn vẹn, xong', en: 'complete',
    on: ['カン'], kun: [],
    nho: 'Trên 宀 (mái nhà), dưới 元 (gợi âm; "nguyên, gốc"): ngôi nhà làm TRỌN VẸN từ gốc đến mái → HOÀN, XONG → 完了, 完成. 院 (viện) = 阝 + 完 — nhớ 完 là nhớ được 院.',
    tu: [
      { w: '{完了|かんりょう}', ro: 'kanryou', vi: 'hoàn tất' },
      { w: '{完成|かんせい}', ro: 'kansei', vi: 'hoàn thành (N3)' },
      { w: '{完全|かんぜん}', ro: 'kanzen', vi: 'hoàn toàn (N3)' },
      { w: '{完璧|かんぺき}', ro: 'kanpeki', vi: 'hoàn hảo (N2)' },
    ],
  },
  '到': {
    hv: 'ĐÁO', nghia: 'đến nơi', en: 'arrive',
    on: ['トウ'], kun: [],
    nho: 'Bên trái 至 (đến, tới nơi), bên phải 刂 (con dao — ở đây gợi âm トウ, vốn là 刀): ĐẾN NƠI = ĐÁO → 到着. 倒 (đổ — Bài 15) = 亻 + 到.',
    tu: [
      { w: '{到着|とうちゃく}', ro: 'touchaku', vi: 'đến nơi' },
      { w: '{到底|とうてい}', ro: 'toutei', vi: '(～ない) dù thế nào cũng không (N2)' },
    ],
  },
  '数': {
    hv: 'SỐ', nghia: 'số; đếm', en: 'number / count',
    on: ['スウ', 'ス'], kun: ['かず', 'かぞ・える'],
    nho: '米 (hạt gạo) + 女 + 攵 (tay cầm que): ngồi lấy que ĐẾM TỪNG HẠT → SỐ, ĐẾM → 数, 数える, 人数 (にんずう — スウ đục thành ズウ). Khác 類 (loại — 米 + 大 + 頁, Bài 27).',
    tu: [
      { w: '{数|かず}', ro: 'kazu', vi: 'số, con số' },
      { w: '{数|かぞ}える', ro: 'kazoeru', vi: 'đếm' },
      { w: '{人数|にんずう}', ro: 'ninzuu', vi: 'số người' },
      { w: '{数字|すうじ}', ro: 'suuji', vi: 'chữ số (N3)' },
      { w: '{数学|すうがく}', ro: 'suugaku', vi: 'môn toán' },
    ],
  },
  '預': {
    hv: 'DỰ', nghia: 'gửi, giữ hộ', en: 'deposit / entrust',
    on: ['ヨ'], kun: ['あず・ける', 'あず・かる'],
    nho: 'Bên trái 予 (gợi âm ヨ; "trước"), bên phải 頁 (cái đầu): GIAO TRƯỚC cho người khác lo → GỬI, GIỮ HỘ → 預ける (người gửi), 預かる (người giữ hộ: 伝言をお預かりします). Khác 頂, 領, 順 — cùng 頁 bên phải.',
    tu: [
      { w: '{預|あず}ける', ro: 'azukeru', vi: 'gửi (nhờ giữ)' },
      { w: '{預|あず}かる', ro: 'azukaru', vi: 'nhận giữ, giữ hộ' },
      { w: '{預金|よきん}', ro: 'yokin', vi: 'tiền gửi ngân hàng (N2)' },
    ],
  },
  '了': {
    hv: 'LIỄU', nghia: 'xong, kết thúc; hiểu rõ', en: 'finish / understand',
    on: ['リョウ'], kun: [],
    nho: 'Cách nhớ bằng hình: chỉ 2 nét — một SỢI DÂY BUỘC XONG, nút thắt ở trên → XONG, KẾT THÚC → 完了, 終了; hiểu "xong" một điều → 了解. ⚠ Khác 子 (con — 3 nét, có nét ngang).',
    tu: [
      { w: '{了解|りょうかい}', ro: 'ryoukai', vi: 'đã hiểu, rõ (với bạn bè)' },
      { w: '{完了|かんりょう}', ro: 'kanryou', vi: 'hoàn tất' },
      { w: '{終了|しゅうりょう}', ro: 'shuuryou', vi: 'kết thúc (N2)' },
    ],
  },
  '御': {
    hv: 'NGỰ', nghia: '(tiếp đầu ngữ kính trọng); điều khiển', en: 'honorable / control',
    on: ['ギョ', 'ゴ'], kun: ['おん'],
    nho: 'Bên trái 彳 (bước đi), bên phải 卸 (gợi âm ギョ; tháo, xếp đặt): người ĐIỀU KHIỂN XE NGỰA → CHẾ NGỰ (制御); về sau thành tiếp đầu ngữ KÍNH TRỌNG: 御社 (quý công ty), 御中 (kính gửi — ghi sau tên công ty / phòng ban). Khác 卸 (bán buôn).',
    tu: [
      { w: '{御社|おんしゃ}', ro: 'onsha', vi: 'quý công ty (khi nói, phỏng vấn — N2)' },
      { w: '{御中|おんちゅう}', ro: 'onchuu', vi: 'kính gửi (sau tên tổ chức)' },
      { w: '{御飯|ごはん}', ro: 'gohan', vi: 'cơm (thường viết ご飯)' },
      { w: '{制御|せいぎょ}', ro: 'seigyo', vi: 'điều khiển (N1)' },
    ],
  },
  '承': {
    hv: 'THỪA', nghia: 'nhận lấy, tiếp nối', en: 'accept / receive',
    on: ['ショウ'], kun: ['うけたまわ・る'],
    nho: 'Cách nhớ bằng hình: chữ cổ thường được giải là HAI TAY ĐỠ LẤY (nâng lên) một người → NHẬN LẤY, TIẾP NHẬN → 承る (khiêm nhường: ご伝言を承ります), 承知しました (Bài 24). Phần giữa có ba nét ngang — đừng lẫn với 水.',
    tu: [
      { w: '{承知|しょうち}', ro: 'shouchi', vi: 'biết, chấp thuận (承知しました)' },
      { w: '{承|うけたまわ}る', ro: 'uketamawaru', vi: '(khiêm nhường) nhận, xin nghe' },
      { w: '{了承|りょうしょう}', ro: 'ryoushou', vi: 'chấp thuận (N1)' },
    ],
  },
  '依': {
    hv: 'Y', nghia: 'dựa vào, nhờ', en: 'depend / request',
    on: ['イ', 'エ'], kun: ['よ・る'],
    nho: 'Bên trái 亻 (người), bên phải 衣 (áo, gợi âm イ): đứa trẻ NÍU ÁO người lớn → DỰA VÀO, NHỜ CẬY → 依頼 (nhờ, yêu cầu chính thức). ⚠ いらい — đừng đọc ~~えらい~~ (偉い = giỏi giang).',
    tu: [
      { w: '{依頼|いらい}', ro: 'irai', vi: 'nhờ, yêu cầu (chính thức)' },
      { w: '{依存|いぞん}', ro: 'izon', vi: 'phụ thuộc (N1)' },
      { w: '{依然|いぜん}', ro: 'izen', vi: 'vẫn như cũ (N1)' },
    ],
  },
};
