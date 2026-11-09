/**
 * Chữ Hán MỚI của Bài 22 (困ったこと — tiếp sau sách, N4) cho thẻ chữ Hán — cùng định dạng hanTu.ts.
 * 15 chữ: 踏 盗 犯 捕 被 害 届 誘 招 騒 驚 喜 輸 訳 鳴 (N3 theo các bảng tham khảo phổ biến; một số bảng xếp 踏・被 ở N2 —
 * JLPT không công bố danh sách chữ chính thức) — bảng `b22-han-tu` trong bai22.ts.
 * Cách nhớ: theo cấu tạo chữ khi chắc chắn; chữ hình thanh thì ghi rõ phần nào gợi nghĩa / gợi âm; chữ mà mẹo nhìn hình
 * không phải gốc chữ (害, 届) thì nói rõ là mẹo. Từ đi chung ưu tiên từ dùng trong bai22.ts.
 * On / Kun theo bảng thường dụng (常用): 害 輸 không có âm Kun; 届 chỉ có âm Kun (とど・く／とど・ける).
 * Tệp chỉ có `import type` — tải chậm như hanTu.ts.
 */
import type { HanTu } from '@/components/sach-hoc/kanji';

export const HAN_TU_22: Record<string, HanTu> = {
  '踏': {
    hv: 'ĐẠP', nghia: 'giẫm, đạp lên', en: 'step on',
    on: ['トウ'], kun: ['ふ・む', 'ふ・まえる'],
    nho: 'Bên trái ⻊ (chân), bên phải 沓 (gợi âm トウ; vốn nghĩa là đôi giày): chân đi giày GIẪM xuống = ĐẠP → 踏む, 足を踏まれる. Khác 路 (đường — 道路): cùng ⻊ nhưng bên phải là 各.',
    tu: [
      { w: '{踏|ふ}む', ro: 'fumu', vi: 'giẫm, đạp' },
      { w: '{足|あし}を{踏|ふ}まれる', ro: 'ashi o fumareru', vi: 'bị giẫm vào chân' },
      { w: 'ブレーキを{踏|ふ}む', ro: 'bureeki o fumu', vi: 'đạp phanh' },
      { w: '{踏切|ふみきり}', ro: 'fumikiri', vi: 'chỗ chắn tàu (N3)' },
    ],
  },
  '盗': {
    hv: 'ĐẠO', nghia: 'trộm, lấy cắp', en: 'steal',
    on: ['トウ'], kun: ['ぬす・む'],
    nho: 'Trên là 次 (gốc là 㳄 — người há miệng chảy nước dãi), dưới là 皿 (cái đĩa): THÈM NHỎ DÃI nhìn đĩa thức ăn của người khác rồi lấy = TRỘM → 盗む. Phần trên trông như chữ 次 (Bài 19).',
    tu: [
      { w: '{盗|ぬす}む', ro: 'nusumu', vi: 'lấy cắp (Bài 19)' },
      { w: '{盗|ぬす}まれる', ro: 'nusumareru', vi: 'bị lấy cắp' },
      { w: '{強盗|ごうとう}', ro: 'goutou', vi: 'cướp, kẻ cướp (N2)' },
      { w: '{盗難|とうなん}', ro: 'tounan', vi: 'mất trộm (văn viết — N1)' },
    ],
  },
  '犯': {
    hv: 'PHẠM', nghia: 'phạm (tội), xâm phạm', en: 'crime / offend',
    on: ['ハン'], kun: ['おか・す'],
    nho: 'Bên trái 犭 (bộ khuyển — chó, thú), bên phải 㔾 (gợi âm): con thú xông vào XÂM PHẠM = PHẠM → 犯人 (người phạm tội). Bộ 犭 chính là chữ 犬 (chó) viết gọn.',
    tu: [
      { w: '{犯人|はんにん}', ro: 'hannin', vi: 'thủ phạm' },
      { w: '{犯罪|はんざい}', ro: 'hanzai', vi: 'tội phạm, tội ác (N3)' },
      { w: '{防犯|ぼうはん}カメラ', ro: 'bouhan kamera', vi: 'camera an ninh (N2)' },
    ],
  },
  '捕': {
    hv: 'BỘ', nghia: 'bắt, tóm', en: 'catch / capture',
    on: ['ホ'], kun: ['と・らえる', 'と・る', 'つか・まえる', 'つか・まる'],
    nho: 'Bên trái 扌 (tay), bên phải 甫 (gợi âm ホ): dùng TAY TÓM lấy = BẮT → 捕まえる (bắt — tha), 捕まる (bị bắt — tự). Khác 補 (bổ — 補習): bên trái là 衤 (áo).',
    tu: [
      { w: '{捕|つか}まえる', ro: 'tsukamaeru', vi: 'bắt, tóm (tha động từ)' },
      { w: '{捕|つか}まる', ro: 'tsukamaru', vi: 'bị bắt; bám vào (tự động từ)' },
      { w: '{逮捕|たいほ}', ro: 'taiho', vi: 'bắt giữ (tin tức — N2)' },
    ],
  },
  '被': {
    hv: 'BỊ', nghia: 'bị, chịu; che phủ', en: 'suffer / cover',
    on: ['ヒ'], kun: ['こうむ・る'],
    nho: 'Bên trái 衤 (áo), bên phải 皮 (da — gợi âm ヒ): áo PHỦ lên da → nghĩa mở rộng "chịu, BỊ" → 被害 (bị hại). Chính là chữ "bị" trong "bị động" (tiếng Trung gọi bị động là 被动). Khác 彼 (anh ấy — Bài 20): bên trái là 彳.',
    tu: [
      { w: '{被害|ひがい}', ro: 'higai', vi: 'thiệt hại' },
      { w: '{被害者|ひがいしゃ}', ro: 'higaisha', vi: 'nạn nhân (N2)' },
      { w: '{被害|ひがい}を{受|う}ける', ro: 'higai o ukeru', vi: 'chịu thiệt hại' },
    ],
  },
  '害': {
    hv: 'HẠI', nghia: 'hại, có hại', en: 'harm',
    on: ['ガイ'], kun: [],
    nho: 'Mẹo nhìn (không phải gốc chữ): dưới mái nhà 宀 có lời nói 口 sắc như dao (丰) — lời ác làm HẠI người trong nhà → 被害. Thêm 刂 (con dao) bên phải là 割 (割る — Bài 19).',
    tu: [
      { w: '{被害|ひがい}', ro: 'higai', vi: 'thiệt hại' },
      { w: '{害|がい}がある', ro: 'gai ga aru', vi: 'có hại' },
      { w: '{公害|こうがい}', ro: 'kougai', vi: 'ô nhiễm môi trường (N3)' },
      { w: '{災害|さいがい}', ro: 'saigai', vi: 'thiên tai (N3)' },
    ],
  },
  '届': {
    hv: 'GIỚI', nghia: 'đưa tới; tới nơi', en: 'deliver / reach',
    on: [], kun: ['とど・く', 'とど・ける'],
    nho: 'Trên là 尸 (mái, thân người), dưới là 由 (gợi âm; "từ, do"). Mẹo nhìn: đi qua cửa (尸) mang đồ ĐẾN TẬN NƠI = ĐƯA TỚI → 届く (tự), 届ける (tha). Chữ chỉ có âm Kun. Khác 屋 (nhà): dưới 尸 là 至.',
    tu: [
      { w: '{届|とど}く', ro: 'todoku', vi: '(đồ, thư) tới nơi (Bài 18)' },
      { w: '{届|とど}ける', ro: 'todokeru', vi: 'đưa tới; báo, nộp cho (cảnh sát…) (Bài 18)' },
      { w: '{警察|けいさつ}に{届|とど}ける', ro: 'keisatsu ni todokeru', vi: 'báo cảnh sát' },
      { w: '{届|とど}け', ro: 'todoke', vi: 'giấy báo, đơn trình (N3)' },
    ],
  },
  '誘': {
    hv: 'DỤ', nghia: 'rủ, dụ dỗ', en: 'invite / tempt',
    on: ['ユウ'], kun: ['さそ・う'],
    nho: 'Bên trái 言 (lời nói), bên phải 秀 (ưu tú — gợi âm ユウ): dùng LỜI HAY dẫn dắt người khác = RỦ, DỤ → 誘う. Khác 透 (thấu — 透明): cùng 秀 nhưng có ⻌ bao dưới.',
    tu: [
      { w: '{誘|さそ}う', ro: 'sasou', vi: 'rủ, mời' },
      { w: '{誘|さそ}われる', ro: 'sasowareru', vi: 'được rủ' },
      { w: '{誘|さそ}い', ro: 'sasoi', vi: 'lời rủ (N3)' },
    ],
  },
  '招': {
    hv: 'CHIÊU', nghia: 'vẫy gọi, mời', en: 'invite / beckon',
    on: ['ショウ'], kun: ['まね・く'],
    nho: 'Bên trái 扌 (tay), bên phải 召 (gọi — gợi âm ショウ): VẪY TAY GỌI người đến = CHIÊU, MỜI → 招待. ⚠ Khác 紹 (紹介): bên trái là 糸 — hai chữ cùng đọc ショウ!',
    tu: [
      { w: '{招待|しょうたい}', ro: 'shoutai', vi: 'mời (chính thức)' },
      { w: '{招待状|しょうたいじょう}', ro: 'shoutaijou', vi: 'thiệp mời (N3)' },
      { w: '{招|まね}く', ro: 'maneku', vi: 'mời, vẫy gọi (N2)' },
    ],
  },
  '騒': {
    hv: 'TAO', nghia: 'ồn ào, náo động', en: 'noisy / make a fuss',
    on: ['ソウ'], kun: ['さわ・ぐ'],
    nho: 'Bên trái 馬 (ngựa), bên phải 蚤 (bọ chét — nay viết gọn thành 又 + 虫; chữ cũ 騷): ngựa bị bọ chét đốt NHẢY LOẠN, NÁO ĐỘNG = TAO → 騒ぐ. Cùng bộ 馬 với 験 (試験) và 駅 (ga).',
    tu: [
      { w: '{騒|さわ}ぐ', ro: 'sawagu', vi: 'làm ồn' },
      { w: '{騒|さわ}がれる', ro: 'sawagareru', vi: 'bị (ai) làm ồn — bị phiền' },
      { w: '{騒|さわ}がしい', ro: 'sawagashii', vi: 'ồn ào (N3)' },
      { w: '{騒音|そうおん}', ro: 'souon', vi: 'tiếng ồn (N2)' },
    ],
  },
  '驚': {
    hv: 'KINH', nghia: 'giật mình, kinh ngạc', en: 'surprise',
    on: ['キョウ'], kun: ['おどろ・く', 'おどろ・かす'],
    nho: 'Trên là 敬 (kính — gợi âm キョウ), dưới là 馬 (ngựa): con ngựa GIẬT MÌNH chồm lên = KINH (kinh ngạc) → 驚く. Khác 警 (警察 — Bài 19): cùng 敬 ở trên nhưng dưới là 言.',
    tu: [
      { w: '{驚|おどろ}く', ro: 'odoroku', vi: 'ngạc nhiên, giật mình (Bài 20)' },
      { w: '{驚|おどろ}き', ro: 'odoroki', vi: 'sự ngạc nhiên' },
      { w: '{驚|おどろ}かす', ro: 'odorokasu', vi: 'làm giật mình (N2)' },
    ],
  },
  '喜': {
    hv: 'HỈ', nghia: 'vui mừng', en: 'rejoice',
    on: ['キ'], kun: ['よろこ・ぶ'],
    nho: 'Trên là 壴 (cái trống), dưới là 口 (miệng): ĐÁNH TRỐNG, MỞ MIỆNG CA HÁT vì vui = HỈ → 喜ぶ. Chữ "song hỉ" 囍 dán ngày cưới là hai chữ 喜 ghép lại.',
    tu: [
      { w: '{喜|よろこ}ぶ', ro: 'yorokobu', vi: 'vui mừng (Bài 18)' },
      { w: '{喜|よろこ}び', ro: 'yorokobi', vi: 'niềm vui' },
      { w: '{大喜|おおよろこ}び', ro: 'ooyorokobi', vi: 'mừng rỡ' },
      { w: '{喜|よろこ}ばれる', ro: 'yorokobareru', vi: 'được (người khác) vui lòng đón nhận' },
    ],
  },
  '輸': {
    hv: 'THÂU', nghia: 'vận chuyển, chở đi', en: 'transport',
    on: ['ユ'], kun: [],
    nho: 'Bên trái 車 (xe), bên phải 兪 (gợi âm ユ; vốn vẽ chiếc thuyền độc mộc): dùng XE, THUYỀN CHỞ hàng đi = VẬN THÂU → 輸出 (chở ra), 輸入 (chở vào). Khác 輪 (指輪 — Bài 20): bên phải là 侖.',
    tu: [
      { w: '{輸出|ゆしゅつ}', ro: 'yushutsu', vi: 'xuất khẩu' },
      { w: '{輸入|ゆにゅう}', ro: 'yunyuu', vi: 'nhập khẩu' },
      { w: '{輸入品|ゆにゅうひん}', ro: 'yunyuuhin', vi: 'hàng nhập khẩu (N3)' },
      { w: '{輸送|ゆそう}', ro: 'yusou', vi: 'vận chuyển (N2)' },
    ],
  },
  '訳': {
    hv: 'DỊCH', nghia: 'dịch; lý do', en: 'translate / reason',
    on: ['ヤク'], kun: ['わけ'],
    nho: 'Bên trái 言 (lời nói), bên phải 尺 (chữ cũ 譯 — phần phải gợi âm): CHUYỂN LỜI sang tiếng khác = DỊCH → 翻訳, 通訳. Âm Kun わけ = lý do (言い訳 = lời bào chữa). Khác 駅 (ga): cùng 尺 nhưng bên trái là 馬.',
    tu: [
      { w: '{翻訳|ほんやく}', ro: 'hon\'yaku', vi: 'dịch (văn bản)' },
      { w: '{通訳|つうやく}', ro: 'tsuuyaku', vi: 'phiên dịch (N3)' },
      { w: '{言|い}い{訳|わけ}', ro: 'iiwake', vi: 'lời bào chữa (N3)' },
      { w: '{訳|わけ}', ro: 'wake', vi: 'lý do (N3)' },
    ],
  },
  '鳴': {
    hv: 'MINH', nghia: '(chim, thú) kêu; (chuông) reo', en: 'cry (animal) / ring',
    on: ['メイ'], kun: ['な・く', 'な・る', 'な・らす'],
    nho: 'Bên trái 口 (miệng), bên phải 鳥 (chim): con chim MỞ MIỆNG KÊU = MINH → 鳴く, 鳴る. ⚠ Đồng âm 泣く (người khóc — Bài 19): 泣 = 氵 (nước mắt) + 立.',
    tu: [
      { w: '{鳴|な}く', ro: 'naku', vi: '(con vật) kêu, hót' },
      { w: '{鳴|な}る', ro: 'naru', vi: '(chuông, điện thoại) reo' },
      { w: '{鳴|な}らす', ro: 'narasu', vi: 'làm cho reo, bấm chuông (N3)' },
      { w: '{悲鳴|ひめい}', ro: 'himei', vi: 'tiếng thét (N2)' },
    ],
  },
};
