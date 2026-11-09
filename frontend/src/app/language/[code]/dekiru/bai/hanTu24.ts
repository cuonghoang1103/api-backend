/**
 * Chữ Hán MỚI của Bài 24 (会社訪問 — tiếp sau sách, N4) cho thẻ chữ Hán — cùng định dạng hanTu.ts.
 * 15 chữ: 訪 敬 尊 存 伺 拝 召 課 係 担 談 職 紹 介 応 (N3 theo các bảng tham khảo phổ biến; 伺・拝・召 có bảng xếp N2,
 * 課 có bảng xếp N4 — JLPT không công bố danh sách chữ chính thức) — bảng `b24-han-tu` trong bai24.ts.
 * Cách nhớ: theo cấu tạo chữ khi chắc chắn; chữ hình thanh thì ghi rõ phần nào gợi nghĩa / gợi âm; chữ mà mẹo nhìn hình
 * không phải gốc chữ (職, 介) thì nói rõ là mẹo. Từ đi chung ưu tiên từ dùng trong bai24.ts.
 * On / Kun theo bảng thường dụng (常用): 存 課 談 職 紹 介 không có âm Kun; 伺 chỉ dùng âm Kun (うかが・う) ở cấp này.
 * Tệp chỉ có `import type` — tải chậm như hanTu.ts.
 */
import type { HanTu } from '@/components/sach-hoc/kanji';

export const HAN_TU_24: Record<string, HanTu> = {
  '訪': {
    hv: 'PHỎNG', nghia: 'thăm, hỏi thăm', en: 'visit',
    on: ['ホウ'], kun: ['たず・ねる', 'おとず・れる'],
    nho: 'Bên trái 言 (lời nói), bên phải 方 (phương — gợi âm ホウ): mang lời đi đến các phương để HỎI THĂM = PHỎNG → 訪問, 訪ねる. Đọc ホウ giống chữ 方. Khác 話 (話す): bên phải là 舌.',
    tu: [
      { w: '{訪問|ほうもん}', ro: 'houmon', vi: 'thăm (trang trọng)' },
      { w: '{会社訪問|かいしゃほうもん}', ro: 'kaisha houmon', vi: 'thăm công ty' },
      { w: '{訪|たず}ねる', ro: 'tazuneru', vi: 'đến thăm' },
      { w: '{訪|おとず}れる', ro: 'otozureru', vi: 'ghé thăm (văn viết — N2)' },
    ],
  },
  '敬': {
    hv: 'KÍNH', nghia: 'kính trọng, cẩn trọng', en: 'respect',
    on: ['ケイ'], kun: ['うやま・う'],
    nho: 'Bên trái 苟 (cẩn trọng), bên phải 攵 (bàn tay cầm roi = hành động): luôn giữ mình CẨN TRỌNG trước người trên = KÍNH → 敬語, 尊敬. Chữ 敬 nằm trong 警 (警察 — thêm 言 bên dưới) và 驚 (驚く — thêm 馬 bên dưới).',
    tu: [
      { w: '{敬語|けいご}', ro: 'keigo', vi: 'kính ngữ (Bài 16)' },
      { w: '{尊敬|そんけい}', ro: 'sonkei', vi: 'kính trọng' },
      { w: '{敬|うやま}う', ro: 'uyamau', vi: 'kính, tôn kính (N1)' },
    ],
  },
  '尊': {
    hv: 'TÔN', nghia: 'tôn quý, tôn kính', en: 'revere / precious',
    on: ['ソン'], kun: ['たっと・い', 'とうと・い', 'たっと・ぶ', 'とうと・ぶ'],
    nho: 'Phần trên 酋 (bình rượu ngon), phần dưới 寸 (bàn tay): HAI TAY NÂNG BÌNH RƯỢU DÂNG LÊN người trên = TÔN → 尊敬 (kính trọng), 尊敬語 (tôn kính ngữ). Cùng 寸 ở dưới với 導 (dẫn — 指導).',
    tu: [
      { w: '{尊敬|そんけい}', ro: 'sonkei', vi: 'kính trọng' },
      { w: '{尊敬語|そんけいご}', ro: 'sonkeigo', vi: 'tôn kính ngữ' },
      { w: '{尊重|そんちょう}', ro: 'sonchou', vi: 'tôn trọng (N2)' },
    ],
  },
  '存': {
    hv: 'TỒN', nghia: 'còn, tồn tại; biết (trong kính ngữ)', en: 'exist / know (humble)',
    on: ['ソン', 'ゾン'], kun: [],
    nho: 'Phần trên là biến thể của 才 (gợi âm), phần dưới là 子 (con): con cái được GÌN GIỮ, còn mãi = TỒN → 保存 (lưu, bảo quản). Trong kính ngữ đọc ゾン: ご存じ (người trên biết), 存じております (tôi biết). Khác 在 (現在): phần dưới là 土 (đất).',
    tu: [
      { w: 'ご{存|ぞん}じ', ro: 'gozonji', vi: '(người trên) biết' },
      { w: '{存|ぞん}じる', ro: 'zonjiru', vi: '(tôi) biết, nghĩ — khiêm nhường' },
      { w: '{保存|ほぞん}', ro: 'hozon', vi: 'lưu (file), bảo quản (N2)' },
    ],
  },
  '伺': {
    hv: 'TỨ', nghia: 'hầu, hỏi thăm (khiêm nhường)', en: 'visit / ask (humble)',
    on: ['シ'], kun: ['うかが・う'],
    nho: 'Bên trái 亻 (người), bên phải 司 (quan coi việc — gợi âm シ): người HẦU bên cạnh chờ hỏi ý chủ = TỨ → 伺う (hỏi; đến thăm — khiêm nhường). Khác 何 (gì — Bài 1): bên phải 何 là 可, không phải 司.',
    tu: [
      { w: '{伺|うかが}う', ro: 'ukagau', vi: '(tôi) hỏi; đến thăm — khiêm nhường' },
      { w: 'ちょっと{伺|うかが}いますが', ro: 'chotto ukagaimasu ga', vi: 'xin hỏi một chút' },
      { w: 'お{宅|たく}に{伺|うかが}う', ro: 'otaku ni ukagau', vi: 'đến thăm nhà (người trên)' },
    ],
  },
  '拝': {
    hv: 'BÁI', nghia: 'vái lạy, kính cẩn', en: 'worship / (humble prefix)',
    on: ['ハイ'], kun: ['おが・む'],
    nho: 'Bên trái 扌 (tay), bên phải gợi hình hai bàn tay chắp lại: CHẮP TAY VÁI = BÁI → 拝む (chắp tay khấn). Trong kính ngữ: 拝見 = "cúi đầu kính cẩn mà xem" (khiêm nhường của 見る).',
    tu: [
      { w: '{拝見|はいけん}', ro: 'haiken', vi: 'xem (khiêm nhường)' },
      { w: '{拝|おが}む', ro: 'ogamu', vi: 'chắp tay vái, khấn' },
      { w: '{参拝|さんぱい}', ro: 'sanpai', vi: 'viếng đền chùa (N2)' },
    ],
  },
  '召': {
    hv: 'TRIỆU', nghia: 'gọi đến, vời (kính)', en: 'summon / (honorific: eat, wear)',
    on: ['ショウ'], kun: ['め・す'],
    nho: 'Phần trên 刀 (gợi âm), phần dưới 口 (miệng): DÙNG MIỆNG GỌI người đến = TRIỆU. Kính ngữ: 召し上がる (dùng bữa — tôn kính). 召 nằm trong 招 (招待 — Bài 22: thêm 扌 vẫy tay gọi) và 紹 (紹介 — thêm 糸); cả ba cùng đọc ショウ.',
    tu: [
      { w: '{召|め}し{上|あ}がる', ro: 'meshiagaru', vi: '(người trên) ăn, uống' },
      { w: '{召|め}す', ro: 'mesu', vi: '(người trên) mặc, gọi — tôn kính (N1)' },
      { w: 'お{召|め}し{上|あ}がりください', ro: 'omeshiagari kudasai', vi: 'xin mời dùng (cửa hàng hay viết)' },
    ],
  },
  '課': {
    hv: 'KHOÁ', nghia: 'bài học; phòng, ban', en: 'lesson / section',
    on: ['カ'], kun: [],
    nho: 'Bên trái 言 (lời), bên phải 果 (quả, kết quả — gợi âm カ): LỜI GIAO VIỆC để có kết quả = phần việc, BÀI (第1課 — bài 1), rồi thành PHÒNG BAN nhận phần việc → 課長 (trưởng phòng). Khác 菓 (お菓子): trên là 艹.',
    tu: [
      { w: '{課長|かちょう}', ro: 'kachou', vi: 'trưởng phòng' },
      { w: '{第|だい}24{課|か}', ro: 'dai nijuuyon-ka', vi: 'bài 24' },
      { w: '{課題|かだい}', ro: 'kadai', vi: 'bài tập, vấn đề cần giải quyết (N2)' },
      { w: '{日課|にっか}', ro: 'nikka', vi: 'việc làm hằng ngày (N2)' },
    ],
  },
  '係': {
    hv: 'HỆ', nghia: 'liên quan; người phụ trách', en: 'person in charge / connection',
    on: ['ケイ'], kun: ['かか・る', 'かかり'],
    nho: 'Bên trái 亻 (người), bên phải 系 (sợi tơ nối — hệ): NGƯỜI ĐƯỢC NỐI VỚI MỘT VIỆC = có liên quan, người phụ trách → 係 (かかり), 関係 (quan hệ). Khác 孫 (cháu): bên trái là 子. Đứng sau danh từ đọc đục: 案内係 (あんないがかり).',
    tu: [
      { w: '{係|かかり}', ro: 'kakari', vi: 'người phụ trách' },
      { w: '{係員|かかりいん}', ro: 'kakariin', vi: 'nhân viên phụ trách' },
      { w: '{関係|かんけい}', ro: 'kankei', vi: 'quan hệ, liên quan (N3)' },
      { w: '{案内係|あんないがかり}', ro: 'annaigakari', vi: 'người hướng dẫn' },
    ],
  },
  '担': {
    hv: 'ĐẢM', nghia: 'gánh vác, đảm nhận', en: 'carry / be in charge',
    on: ['タン'], kun: ['かつ・ぐ', 'にな・う'],
    nho: 'Bên trái 扌 (tay), bên phải 旦 (bình minh — gợi âm タン): dùng TAY, VAI GÁNH lên = ĐẢM (gánh vác) → 担当 (gánh phần việc = phụ trách), 負担 (gánh nặng). Khác 但 (nhưng): bên trái là 亻.',
    tu: [
      { w: '{担当|たんとう}', ro: 'tantou', vi: 'phụ trách (Bài 23)' },
      { w: '{担任|たんにん}', ro: 'tannin', vi: 'giáo viên chủ nhiệm (N2)' },
      { w: '{負担|ふたん}', ro: 'futan', vi: 'gánh nặng (N2)' },
    ],
  },
  '談': {
    hv: 'ĐÀM', nghia: 'nói chuyện, bàn bạc', en: 'talk / discuss',
    on: ['ダン'], kun: [],
    nho: 'Bên trái 言 (lời), bên phải 炎 (hai chữ 火 — lửa, gợi âm): NGỒI BÊN BẾP LỬA TRÒ CHUYỆN = ĐÀM → 相談 (bàn bạc, xin ý kiến), 冗談 (chuyện đùa). Khác 淡 (nhạt): bên trái là 氵.',
    tu: [
      { w: '{相談|そうだん}', ro: 'soudan', vi: 'bàn bạc, xin ý kiến (Bài 17)' },
      { w: '{冗談|じょうだん}', ro: 'joudan', vi: 'chuyện đùa (N3)' },
      { w: '{面談|めんだん}', ro: 'mendan', vi: 'gặp mặt trao đổi (N2)' },
    ],
  },
  '職': {
    hv: 'CHỨC', nghia: 'chức vụ, nghề nghiệp', en: 'job / post',
    on: ['ショク'], kun: [],
    nho: 'Bên trái 耳 (tai), bên phải 戠 (gồm 音 + 戈 — gợi âm). Mẹo nhìn (không phải gốc chữ): TAI NGHE HIỆU LỆNH, TAY CẦM MÁC làm nhiệm vụ = CHỨC vụ → 就職, 職場. Khác 識 (知識): trái là 言; 織 (dệt): trái là 糸. 18 nét — viết 耳 trước.',
    tu: [
      { w: '{就職|しゅうしょく}', ro: 'shuushoku', vi: 'đi làm, vào làm (Bài 16)' },
      { w: '{職場|しょくば}', ro: 'shokuba', vi: 'nơi làm việc (N3)' },
      { w: '{職員室|しょくいんしつ}', ro: 'shokuinshitsu', vi: 'phòng giáo viên' },
      { w: '{職業|しょくぎょう}', ro: 'shokugyou', vi: 'nghề nghiệp (N3)' },
    ],
  },
  '紹': {
    hv: 'THIỆU', nghia: 'nối, giới thiệu', en: 'introduce',
    on: ['ショウ'], kun: [],
    nho: 'Bên trái 糸 (sợi chỉ), bên phải 召 (gọi — gợi âm ショウ): NỐI SỢI CHỈ, gọi người này đến với người kia = THIỆU (giới thiệu) → 紹介. Khác 招 (招待 — Bài 22): bên trái là 扌. Gần như chỉ gặp trong từ 紹介.',
    tu: [
      { w: '{紹介|しょうかい}', ro: 'shoukai', vi: 'giới thiệu (Bài 22)' },
      { w: '{自己紹介|じこしょうかい}', ro: 'jiko shoukai', vi: 'tự giới thiệu' },
      { w: '{紹介状|しょうかいじょう}', ro: 'shoukaijou', vi: 'thư giới thiệu (N2)' },
    ],
  },
  '介': {
    hv: 'GIỚI', nghia: 'ở giữa, làm trung gian', en: 'mediate',
    on: ['カイ'], kun: [],
    nho: 'Phía trên 人 (người, như mái che), phía dưới hai nét đứng tách hai bên — mẹo nhìn: NGƯỜI ĐỨNG GIỮA HAI BÊN = GIỚI (trung gian) → 紹介 (giới thiệu), 介護 (chăm sóc). Khác 今 (bây giờ): dưới 今 là 一 + ㇇.',
    tu: [
      { w: '{紹介|しょうかい}', ro: 'shoukai', vi: 'giới thiệu' },
      { w: '{介護|かいご}', ro: 'kaigo', vi: 'chăm sóc người già, người bệnh (N2)' },
      { w: '{自己紹介|じこしょうかい}', ro: 'jiko shoukai', vi: 'tự giới thiệu' },
    ],
  },
  '応': {
    hv: 'ỨNG', nghia: 'đáp lại, ứng', en: 'respond',
    on: ['オウ'], kun: ['こた・える'],
    nho: 'Bên ngoài 广 (mái nhà), bên trong 心 (tim): trong nhà, LÒNG SẴN SÀNG ĐÁP LẠI = ỨNG → 応接室 (phòng tiếp khách), 応募 (ứng tuyển), 反応 (phản ứng). Chữ cũ là 應. Khác 広 (広い): bên trong là ム.',
    tu: [
      { w: '{応接室|おうせつしつ}', ro: 'ousetsushitsu', vi: 'phòng tiếp khách' },
      { w: '{応募|おうぼ}', ro: 'oubo', vi: 'ứng tuyển (Bài 16)' },
      { w: '{対応|たいおう}', ro: 'taiou', vi: 'ứng phó, tiếp nhận xử lý (N2)' },
      { w: '{反応|はんのう}', ro: 'hannou', vi: 'phản ứng (N2)' },
    ],
  },
};
