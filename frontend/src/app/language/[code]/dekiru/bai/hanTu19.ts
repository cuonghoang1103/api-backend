/**
 * Chữ Hán MỚI của Bài 19 (失敗 — tiếp sau sách, N4) cho thẻ chữ Hán — cùng định dạng hanTu.ts.
 * 15 chữ: 失 敗 次 違 困 覚 破 折 刻 悲 怒 謝 直 警 察 (N3 theo các bảng tham khảo phổ biến) — bảng `b19-han-tu` trong bai19.ts.
 * Cách nhớ: theo cấu tạo chữ khi chắc chắn; chữ hình thanh thì ghi rõ phần nào gợi nghĩa / gợi âm;
 * chữ mà mẹo nhìn hình không phải gốc chữ (失) thì nói rõ là mẹo. Từ đi chung ưu tiên từ dùng trong bai19.ts.
 * On / Kun theo bảng thường dụng (常用): 警 và 察 không có âm Kun.
 * Tệp chỉ có `import type` — tải chậm như hanTu.ts.
 */
import type { HanTu } from '@/components/sach-hoc/kanji';

export const HAN_TU_19: Record<string, HanTu> = {
  '失': {
    hv: 'THẤT', nghia: 'mất, đánh mất; sai sót', en: 'lose / error',
    on: ['シツ'], kun: ['うしな・う'],
    nho: 'Sách cổ giải thích là 手 (bàn tay) + 乙 (gợi âm). Mẹo nhìn (không phải gốc chữ): bàn tay mà có vật tuột ra qua kẽ ngón — nét phẩy nhô lên trên đầu — là để MẤT. Khác 夫 (chồng) đúng ở nét phẩy đó. 失敗 đọc しっぱい (シツ → しっ).',
    tu: [
      { w: '{失敗|しっぱい}', ro: 'shippai', vi: 'thất bại' },
      { w: '{失礼|しつれい}します', ro: 'shitsurei shimasu', vi: 'xin phép; thất lễ' },
      { w: '{失|うしな}う', ro: 'ushinau', vi: 'đánh mất (N3)' },
      { w: '{失恋|しつれん}', ro: 'shitsuren', vi: 'thất tình' },
    ],
  },
  '敗': {
    hv: 'BẠI', nghia: 'thua, hỏng', en: 'defeat / failure',
    on: ['ハイ'], kun: ['やぶ・れる'],
    nho: 'Bên trái 貝 (vỏ sò — vật quý, tiền), bên phải 攵 (bàn tay cầm gậy đánh): đập vỡ đồ quý = HỎNG, THUA. Trong 失敗 đọc ぱい. Đừng nhầm với 販 (bán — 販売) cũng có 貝.',
    tu: [
      { w: '{失敗|しっぱい}', ro: 'shippai', vi: 'thất bại' },
      { w: '{勝敗|しょうはい}', ro: 'shouhai', vi: 'thắng thua' },
      { w: '{敗|やぶ}れる', ro: 'yabureru', vi: 'thua (trận) — N2' },
    ],
  },
  '次': {
    hv: 'THỨ', nghia: 'tiếp theo, kế; lần sau', en: 'next',
    on: ['ジ', 'シ'], kun: ['つ・ぐ', 'つぎ'],
    nho: 'Bên trái 冫 (gốc là 二 — "hai", gợi âm), bên phải 欠 (người há miệng): người thứ hai há miệng chờ tới lượt = KẾ TIẾP. Câu xin lỗi chuẩn: 次から気をつけます.',
    tu: [
      { w: '{次|つぎ}', ro: 'tsugi', vi: 'lần sau, cái tiếp theo' },
      { w: '{次|つぎ}の{日|ひ}', ro: 'tsugi no hi', vi: 'ngày hôm sau' },
      { w: '{目次|もくじ}', ro: 'mokuji', vi: 'mục lục' },
      { w: '{次回|じかい}', ro: 'jikai', vi: 'lần tới' },
    ],
  },
  '違': {
    hv: 'VI', nghia: 'khác; sai', en: 'differ / mistake',
    on: ['イ'], kun: ['ちが・う', 'ちが・える'],
    nho: '辶 (bước đi) + 韋 (gợi âm イ; vốn vẽ hai bàn chân đi ngược chiều nhau): đi trái hướng nhau = KHÁC, SAI. 韋 cũng nằm trong 韓 (韓国).',
    tu: [
      { w: '{違|ちが}う', ro: 'chigau', vi: 'khác, sai' },
      { w: '{間違|まちが}える', ro: 'machigaeru', vi: 'nhầm, làm sai' },
      { w: '{間違|まちが}い', ro: 'machigai', vi: 'chỗ sai, lỗi sai' },
      { w: '{違反|いはん}', ro: 'ihan', vi: 'vi phạm (N2)' },
    ],
  },
  '困': {
    hv: 'KHỐN', nghia: 'khó khăn, khốn đốn', en: 'be troubled',
    on: ['コン'], kun: ['こま・る'],
    nho: '囗 (khung bao quanh) + 木 (cây): cây bị nhốt trong khung, không lớn lên được = KHỐN ĐỐN, gặp khó. Khác 因 (原因 — trong khung là 大).',
    tu: [
      { w: '{困|こま}る', ro: 'komaru', vi: 'khó xử, gặp rắc rối' },
      { w: '{困|こま}ったこと', ro: 'komatta koto', vi: 'chuyện phiền' },
      { w: '{困難|こんなん}', ro: 'konnan', vi: 'khó khăn (N2)' },
    ],
  },
  '覚': {
    hv: 'GIÁC', nghia: 'nhớ; tỉnh dậy; cảm giác', en: 'memorize / wake',
    on: ['カク'], kun: ['おぼ・える', 'さ・める', 'さ・ます'],
    nho: 'Chữ cũ 覺 = phần trên của 學 (học — gợi âm) + 見 (thấy): học rồi thấy ra = HIỂU, NHỚ; thấy rõ lại = TỈNH. Nhìn: trên giống 学, dưới là 見. Hai âm kun: おぼえる (nhớ) / さめる (tỉnh giấc).',
    tu: [
      { w: '{覚|おぼ}える', ro: 'oboeru', vi: 'nhớ, thuộc' },
      { w: '{目|め}が{覚|さ}める', ro: 'me ga sameru', vi: 'tỉnh giấc' },
      { w: '{目覚|めざ}まし{時計|どけい}', ro: 'mezamashi-dokei', vi: 'đồng hồ báo thức' },
      { w: '{感覚|かんかく}', ro: 'kankaku', vi: 'cảm giác' },
    ],
  },
  '破': {
    hv: 'PHÁ', nghia: 'phá, xé; rách', en: 'tear / break',
    on: ['ハ'], kun: ['やぶ・る', 'やぶ・れる'],
    nho: '石 (đá) gợi nghĩa + 皮 (da) gợi âm ハ: đá đập làm toạc ra = PHÁ, RÁCH. やぶる (tha — xé) ↔ やぶれる (tự — rách). 約束を破る = thất hứa.',
    tu: [
      { w: '{破|やぶ}れる', ro: 'yabureru', vi: '(vải, giấy) rách' },
      { w: '{破|やぶ}る', ro: 'yaburu', vi: 'xé' },
      { w: '{約束|やくそく}を{破|やぶ}る', ro: 'yakusoku o yaburu', vi: 'thất hứa' },
    ],
  },
  '折': {
    hv: 'CHIẾT', nghia: 'bẻ, gập; gãy', en: 'fold / break',
    on: ['セツ'], kun: ['お・る', 'お・れる', 'おり'],
    nho: '扌 (tay) + 斤 (cái rìu): tay cầm rìu chặt gãy cành = BẺ GÃY. おる (tha) ↔ おれる (tự). 骨折 đọc こっせつ.',
    tu: [
      { w: '{折|お}る', ro: 'oru', vi: 'bẻ, gập' },
      { w: '{折|お}れる', ro: 'oreru', vi: 'gãy' },
      { w: '{骨折|こっせつ}', ro: 'kossetsu', vi: 'gãy xương' },
      { w: '{折|お}り{紙|がみ}', ro: 'origami', vi: 'gấp giấy' },
    ],
  },
  '刻': {
    hv: 'KHẮC', nghia: 'khắc; thời khắc', en: 'engrave / time',
    on: ['コク'], kun: ['きざ・む'],
    nho: '亥 (gợi âm) + 刂 (con dao): dùng dao KHẮC vạch; đồng hồ nước xưa khắc vạch chia giờ → 時刻 (giờ), 遅刻 (trễ giờ). Đọc ちこく, không đục.',
    tu: [
      { w: '{遅刻|ちこく}', ro: 'chikoku', vi: 'đến muộn' },
      { w: '{時刻|じこく}', ro: 'jikoku', vi: 'giờ, thời khắc' },
      { w: '{時刻表|じこくひょう}', ro: 'jikokuhyou', vi: 'bảng giờ tàu xe' },
      { w: '{深刻|しんこく}', ro: 'shinkoku', vi: 'nghiêm trọng (N2)' },
    ],
  },
  '悲': {
    hv: 'BI', nghia: 'buồn, bi thương', en: 'sad',
    on: ['ヒ'], kun: ['かな・しい', 'かな・しむ'],
    nho: '非 (trái, không — gợi âm ヒ) ở trên + 心 (lòng) ở dưới: lòng trái ý = BUỒN. Khác 悪 (xấu) — cùng 心 ở dưới nhưng trên là 亜.',
    tu: [
      { w: '{悲|かな}しい', ro: 'kanashii', vi: 'buồn' },
      { w: '{悲|かな}しむ', ro: 'kanashimu', vi: 'đau buồn' },
      { w: '{悲劇|ひげき}', ro: 'higeki', vi: 'bi kịch (N2)' },
    ],
  },
  '怒': {
    hv: 'NỘ', nghia: 'giận', en: 'anger',
    on: ['ド'], kun: ['おこ・る', 'いか・る'],
    nho: '奴 (nô lệ — gợi âm ド) ở trên + 心 (lòng) ở dưới: lòng người bị bắt làm nô lệ sôi lên = GIẬN. Văn nói đọc おこる; いかる là văn viết. Khác 努 (努力 — dưới là 力).',
    tu: [
      { w: '{怒|おこ}る', ro: 'okoru', vi: 'nổi giận' },
      { w: '{怒|おこ}っている', ro: 'okotte iru', vi: 'đang giận' },
      { w: '{怒|いか}り', ro: 'ikari', vi: 'cơn giận (N2)' },
    ],
  },
  '謝': {
    hv: 'TẠ', nghia: 'tạ lỗi; cảm tạ', en: 'apologize / thank',
    on: ['シャ'], kun: ['あやま・る'],
    nho: '言 (lời nói) gợi nghĩa + 射 (bắn) gợi âm シャ: lời nói ra để TẠ lỗi, tạ ơn. Đồng âm: 誤り (あやまり — sai lầm) khác chữ.',
    tu: [
      { w: '{謝|あやま}る', ro: 'ayamaru', vi: 'xin lỗi' },
      { w: '{感謝|かんしゃ}', ro: 'kansha', vi: 'cảm tạ, biết ơn' },
      { w: '{感謝|かんしゃ}する', ro: 'kansha suru', vi: 'biết ơn' },
    ],
  },
  '直': {
    hv: 'TRỰC', nghia: 'thẳng, ngay thật; sửa', en: 'straight / fix',
    on: ['チョク', 'ジキ'], kun: ['なお・す', 'なお・る', 'ただ・ちに'],
    nho: '十 (mười) + 目 (mắt) + nét gấp ㇄ bên dưới: mười con mắt cùng nhìn thì chẳng gì cong vẹo che được = THẲNG, NGAY → 正直; làm cho ngay lại = SỬA → 直す. Khác 真 (có 八 ở dưới). Ba cách đọc: なお／ちょく／じき.',
    tu: [
      { w: '{直|なお}す', ro: 'naosu', vi: 'sửa' },
      { w: '{直|なお}る', ro: 'naoru', vi: 'được sửa xong' },
      { w: '{正直|しょうじき}', ro: 'shoujiki', vi: 'thật thà, thành thật' },
      { w: '{直接|ちょくせつ}', ro: 'chokusetsu', vi: 'trực tiếp' },
      { w: '{素直|すなお}', ro: 'sunao', vi: 'ngoan, thẳng thắn' },
    ],
  },
  '警': {
    hv: 'CẢNH', nghia: 'cảnh báo, canh giữ', en: 'warn / police',
    on: ['ケイ'], kun: [],
    nho: '敬 (kính — gợi âm ケイ) ở trên + 言 (lời) ở dưới: lời nhắc để người ta giữ ý = CẢNH BÁO, canh giữ → 警察. Khác 驚 (おどろく — dưới là 馬 con ngựa).',
    tu: [
      { w: '{警察|けいさつ}', ro: 'keisatsu', vi: 'cảnh sát' },
      { w: '{警官|けいかん}', ro: 'keikan', vi: 'viên cảnh sát' },
      { w: '{警察官|けいさつかん}', ro: 'keisatsukan', vi: 'nhân viên cảnh sát' },
      { w: '{警告|けいこく}', ro: 'keikoku', vi: 'cảnh cáo (N2)' },
    ],
  },
  '察': {
    hv: 'SÁT', nghia: 'xem xét kỹ', en: 'inspect / guess',
    on: ['サツ'], kun: [],
    nho: '宀 (mái nhà) ở trên + 祭 (lễ — gợi âm) ở dưới: dưới mái đền khi làm lễ phải XEM XÉT kỹ → 警察 (canh giữ + xem xét), 診察 (khám bệnh). Đọc さつ, không đọc theo 祭 (さい). Khác 祭 (お祭り — không có 宀).',
    tu: [
      { w: '{警察|けいさつ}', ro: 'keisatsu', vi: 'cảnh sát' },
      { w: '{診察|しんさつ}', ro: 'shinsatsu', vi: 'khám bệnh' },
      { w: '{観察|かんさつ}', ro: 'kansatsu', vi: 'quan sát (N2)' },
    ],
  },
};
