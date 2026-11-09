/**
 * Chữ Hán MỚI của Bài 49 (変化 — Biến đổi · tiếp sau sách, cấp N2) cho thẻ chữ Hán — cùng định dạng hanTu.ts.
 * 24 chữ: 伴 衰 繁 緩 鈍 膨 瞬 徐 著 兆 昇 沈 浮 透 頻 郊 疎 密 革 導 枯 芽 潮 幅 — bảng `b49-han-tu` trong bai49.ts.
 * Cấp theo các bảng tham khảo phổ biến (JLPT không công bố danh sách chữ chính thức): 浮 沈 枯 芽 N3; 伴 衰 繁 緩 鈍 瞬 著 兆 昇 透 郊
 * 密 革 導 潮 幅 phần lớn bảng xếp N2; 膨 徐 頻 疎 nhiều bảng xếp N1 nhưng TỪ chứa chúng (膨らむ・徐々に・頻繁・過疎) là từ N2 rất hay gặp.
 * Không trùng hanTu.ts, hanTu16–47.ts, hanTuTiep.ts, hanLop.ts và các bảng chữ Hán Bài 1–48 (kiểm 09/11 bằng script — 1.122 chữ đã
 * dạy; Bài 48 soạn song song — grep lại trước khi chốt).
 * Cách nhớ: theo cấu tạo chữ (phần chỉ nghĩa + phần gợi âm của chữ hình thanh ghi rõ); chỗ nào là MẸO nhớ chứ không phải nguồn gốc
 * chữ thì ghi "mẹo". Từ đi chung ưu tiên từ dùng trong bai49.ts và từ đã gặp ở bài trước (一瞬 Bài 26, 徐々に・郊外 Bài 32, 過疎化・改革
 * Bài 42, 秘密).
 * On / Kun theo bảng thường dụng (常用): 繁 徐 頻 郊 chỉ có âm On; 伴 có On ハン・バン; 著 có Kun あらわ・す／いちじる・しい; 浮 có Kun
 * う・く／う・かれる／う・かぶ／う・かべる (浮気 うわき là cách đọc đặc biệt của cả từ); 透 có Kun す・く／す・かす／す・ける; 緩 có Kun
 * ゆる・い／ゆる・やか／ゆる・む／ゆる・める; 疎 có Kun うと・い／うと・む. Hán Việt của 幅 ghi PHÚC (nhiều từ điển còn ghi BỨC — "bức tranh").
 * Tệp chỉ có `import type` — tải chậm như hanTu.ts.
 */
import type { HanTu } from '@/components/sach-hoc/kanji';

export const HAN_TU_49: Record<string, HanTu> = {
  '伴': {
    hv: 'BẠN', nghia: 'đi cùng, kèm theo', en: 'accompany',
    on: ['ハン', 'バン'], kun: ['ともな・う'],
    nho: 'Bên trái 亻 (người), bên phải 半 (một nửa — phần gợi âm ハン): NGƯỜI chia nửa đường đi cùng mình = BẠN đồng hành → 伴う (kèm theo), 同伴 (đi cùng). Mẫu ngữ pháp của bài: ～に伴って (kéo theo, cùng với).',
    tu: [
      { w: '{伴|ともな}う', ro: 'tomonau', vi: 'kèm theo, đi cùng (N2)' },
      { w: '～に{伴|ともな}って', ro: 'ni tomonatte', vi: 'kéo theo, cùng với (ngữ pháp N2 — Bài 49)' },
      { w: '{同伴|どうはん}', ro: 'douhan', vi: 'đi cùng (保護者同伴 — có phụ huynh đi cùng) (N1)' },
      { w: '{伴奏|ばんそう}', ro: 'bansou', vi: 'đệm nhạc (đọc バン) (N1)' },
    ],
  },
  '衰': {
    hv: 'SUY', nghia: 'suy yếu, tàn lụi', en: 'decline',
    on: ['スイ'], kun: ['おとろ・える'],
    nho: 'Chữ gốc vẽ chiếc ÁO TƠI kết bằng cỏ (khung chữ 衣 — áo, ở giữa là các tua cỏ rủ xuống): áo cỏ dùng lâu thì xơ xác, rách rũ = SUY → 衰える (yếu đi), 衰退 (suy thoái). Mẹo: so với 衣 — 衰 có thêm "đống cỏ rối" ở giữa.',
    tu: [
      { w: '{衰|おとろ}える', ro: 'otoroeru', vi: 'yếu đi, suy giảm (体力が衰える) (N2)' },
      { w: '{衰退|すいたい}', ro: 'suitai', vi: 'suy thoái, tàn lụi (産業の衰退) (N1)' },
      { w: '{老衰|ろうすい}', ro: 'rousui', vi: 'già yếu (chết vì già) (N1)' },
    ],
  },
  '繁': {
    hv: 'PHỒN', nghia: 'rậm rạp, sum suê; đông đúc, thịnh', en: 'luxuriant / prosperous',
    on: ['ハン'], kun: [],
    nho: 'Phía trên 敏 (nhanh nhẹn — phần gợi âm), phía dưới 糸 (sợi tơ): tơ sợi mọc NHANH, rậm rạp chằng chịt = PHỒN (sum suê, nhiều) → 繁栄 (phồn vinh), 頻繁 (thường xuyên, dày đặc), 繁華街 (phố sầm uất).',
    tu: [
      { w: '{繁栄|はんえい}', ro: 'han\'ei', vi: 'phồn vinh, thịnh vượng (N1)' },
      { w: '{頻繁|ひんぱん}', ro: 'hinpan', vi: 'thường xuyên, dày đặc (繁 đọc パン sau ん) (N2)' },
      { w: '{繁華街|はんかがい}', ro: 'hankagai', vi: 'khu phố sầm uất (N1)' },
      { w: '{繁盛|はんじょう}', ro: 'hanjou', vi: '(buôn bán) phát đạt (店が繁盛する) (N1)' },
    ],
  },
  '緩': {
    hv: 'HOÃN', nghia: 'lỏng, chậm, thoai thoải', en: 'loose / gentle',
    on: ['カン'], kun: ['ゆる・い', 'ゆる・やか', 'ゆる・む', 'ゆる・める'],
    nho: 'Bên trái 糸 (sợi dây), bên phải 爰 (hai bàn tay kéo — phần gợi âm カン): hai tay NỚI sợi dây ra cho chùng = HOÃN (lỏng, chậm) → 緩い (lỏng, thoải), 緩やか (thoai thoải, từ từ), 緩和 (nới lỏng).',
    tu: [
      { w: '{緩|ゆる}やか', ro: 'yuruyaka', vi: 'thoai thoải, từ từ (緩やかな坂・緩やかに増える) (N2)' },
      { w: '{緩|ゆる}い', ro: 'yurui', vi: 'lỏng, rộng; thoải; dễ dãi (N2)' },
      { w: '{緩和|かんわ}', ro: 'kanwa', vi: 'nới lỏng, làm dịu (規制緩和) (N1)' },
      { w: '{緩|ゆる}める', ro: 'yurumeru', vi: 'nới, làm lỏng ra (ベルトを緩める) (N1)' },
    ],
  },
  '鈍': {
    hv: 'ĐỘN', nghia: 'cùn, chậm, kém nhạy', en: 'dull / slow',
    on: ['ドン'], kun: ['にぶ・い', 'にぶ・る'],
    nho: 'Bên trái 金 (kim loại), bên phải 屯 (phần gợi âm トン → ドン): con dao KIM LOẠI đã cùn, cắt không ngọt = ĐỘN → 鈍い (cùn, chậm chạp), 鈍化 (chậm lại), 鈍感 (kém nhạy cảm).',
    tu: [
      { w: '{鈍化|どんか}', ro: 'donka', vi: '(tốc độ tăng) chậm lại (成長が鈍化する) (N1)' },
      { w: '{鈍|にぶ}い', ro: 'nibui', vi: 'cùn; chậm chạp; kém nhạy (N2)' },
      { w: '{鈍感|どんかん}', ro: 'donkan', vi: 'kém nhạy cảm, vô tâm (N1)' },
    ],
  },
  '膨': {
    hv: 'BÀNH', nghia: 'phình ra, căng lên', en: 'swell',
    on: ['ボウ'], kun: ['ふく・らむ', 'ふく・れる'],
    nho: 'Bên trái 月 (bộ nhục — thân thể), bên phải 彭 (tiếng trống vang to — phần gợi âm ボウ): BỤNG căng PHÌNH như mặt trống = BÀNH → 膨らむ (phình ra, phồng lên), 膨大 (khổng lồ).',
    tu: [
      { w: '{膨|ふく}らむ', ro: 'fukuramu', vi: 'phình ra, phồng lên; (dự toán, hy vọng) tăng lên (N2)' },
      { w: '{膨大|ぼうだい}', ro: 'boudai', vi: 'khổng lồ, đồ sộ (膨大なデータ) (N1)' },
      { w: '{膨|ふく}れる', ro: 'fukureru', vi: 'phồng lên; phụng phịu (N2)' },
    ],
  },
  '瞬': {
    hv: 'THUẤN', nghia: 'chớp mắt, khoảnh khắc', en: 'blink / instant',
    on: ['シュン'], kun: ['またた・く'],
    nho: 'Bên trái 目 (mắt), bên phải 舜 (phần gợi âm シュン): cái CHỚP MẮT = khoảnh khắc ngắn nhất = THUẤN → 一瞬 (một thoáng — Bài 26), 瞬間 (khoảnh khắc — Bài 26), 瞬く間に (trong nháy mắt).',
    tu: [
      { w: '{一瞬|いっしゅん}', ro: 'isshun', vi: 'một thoáng, trong chốc lát (Bài 26)' },
      { w: '{瞬間|しゅんかん}', ro: 'shunkan', vi: 'khoảnh khắc (Bài 26)' },
      { w: '{瞬|またた}く{間|ま}に', ro: 'matataku ma ni', vi: 'trong nháy mắt (N1)' },
    ],
  },
  '徐': {
    hv: 'TỪ', nghia: 'thong thả, từ từ', en: 'slowly / gradually',
    on: ['ジョ'], kun: [],
    nho: 'Bên trái 彳 (bước chân đi), bên phải 余 (dư, thừa — phần gợi âm ヨ → ジョ): BƯỚC ĐI thong thả, còn dư thời gian = TỪ TỪ → 徐々に (dần dần — Bài 32), 徐行 (chạy chậm — biển báo giao thông).',
    tu: [
      { w: '{徐々|じょじょ}に', ro: 'jojo ni', vi: 'dần dần (Bài 32)' },
      { w: '{徐行|じょこう}', ro: 'jokou', vi: 'đi chậm, chạy chậm (biển báo 徐行) (N1)' },
    ],
  },
  '著': {
    hv: 'TRỨ', nghia: 'rõ rệt, nổi bật; viết sách', en: 'remarkable / author',
    on: ['チョ'], kun: ['あらわ・す', 'いちじる・しい'],
    nho: 'Phía trên 艹 (cỏ), phía dưới 者 (người — phần gợi âm シャ → チョ). Mẹo: cây cỏ mọc NỔI BẬT trên đầu người, ai cũng thấy = RÕ RỆT (著しい); người viết sách cho tên mình nổi bật = TRỨ TÁC (著者). ⚠ Khác 箸 (はし, đũa — trên là ⺮ tre).',
    tu: [
      { w: '{著|いちじる}しい', ro: 'ichijirushii', vi: 'rõ rệt, đáng kể (著しい変化) (N1 — rất hay gặp ở N2)' },
      { w: '{著者|ちょしゃ}', ro: 'chosha', vi: 'tác giả (của sách) (N2)' },
      { w: '{著作権|ちょさくけん}', ro: 'chosakuken', vi: 'quyền tác giả (N1)' },
      { w: '{著|あらわ}す', ro: 'arawasu', vi: 'viết (sách), trứ tác (N1)' },
    ],
  },
  '兆': {
    hv: 'TRIỆU', nghia: 'điềm báo; nghìn tỉ', en: 'sign / trillion',
    on: ['チョウ'], kun: ['きざ・す', 'きざ・し'],
    nho: 'Chữ vẽ những VẾT NỨT trên mai rùa khi người xưa hơ lửa để bói: vết nứt báo trước điều sắp tới = ĐIỀM BÁO → 兆し (dấu hiệu, điềm). Vết nứt chi chít vô số → số rất lớn: 一兆 = một nghìn tỉ.',
    tu: [
      { w: '{兆|きざ}し', ro: 'kizashi', vi: 'dấu hiệu, điềm báo (回復の兆し) (N1 — hay gặp ở N2)' },
      { w: '{一兆円|いっちょうえん}', ro: 'icchouen', vi: 'một nghìn tỉ yên (N2)' },
      { w: '{前兆|ぜんちょう}', ro: 'zenchou', vi: 'điềm báo trước (地震の前兆) (N1)' },
    ],
  },
  '昇': {
    hv: 'THĂNG', nghia: 'lên cao', en: 'rise',
    on: ['ショウ'], kun: ['のぼ・る'],
    nho: 'Phía trên 日 (mặt trời), phía dưới 升 (cái đấu múc lên — phần gợi âm ショウ): MẶT TRỜI dâng LÊN = THĂNG → 上昇 (tăng lên), 昇進 (thăng chức), 日が昇る (mặt trời mọc — viết 昇る khi nói mặt trời, khói bay lên).',
    tu: [
      { w: '{上昇|じょうしょう}', ro: 'joushou', vi: 'tăng lên, đi lên (気温・物価の上昇) (N2)' },
      { w: '{昇進|しょうしん}', ro: 'shoushin', vi: 'thăng chức (N1)' },
      { w: '{昇|のぼ}る', ro: 'noboru', vi: '(mặt trời) mọc, lên cao (N2)' },
    ],
  },
  '沈': {
    hv: 'TRẦM', nghia: 'chìm, lặn', en: 'sink',
    on: ['チン'], kun: ['しず・む', 'しず・める'],
    nho: 'Bên trái 氵 (nước), bên phải 冘 (người đeo gông nặng — phần gợi âm チン): vật nặng rơi xuống NƯỚC thì CHÌM = TRẦM → 沈む (chìm; mặt trời lặn), 沈黙 (im lặng — "lời nói chìm xuống"; 黙 Bài 45).',
    tu: [
      { w: '{沈|しず}む', ro: 'shizumu', vi: 'chìm; (mặt trời) lặn; (tâm trạng) chùng xuống (N3)' },
      { w: '{沈黙|ちんもく}', ro: 'chinmoku', vi: 'sự im lặng (N1)' },
      { w: '{沈|しず}める', ro: 'shizumeru', vi: 'nhấn chìm, dìm xuống (N1)' },
    ],
  },
  '浮': {
    hv: 'PHÙ', nghia: 'nổi', en: 'float',
    on: ['フ'], kun: ['う・く', 'う・かれる', 'う・かぶ', 'う・かべる'],
    nho: 'Bên trái 氵 (nước), bên phải 孚 (bàn tay đỡ đứa trẻ — phần gợi âm フ): bàn tay đỡ cho đứa trẻ NỔI trên NƯỚC = PHÙ → 浮く (nổi), 浮かぶ (nổi lên; ý tưởng hiện ra). Cặp với 沈 (chìm).',
    tu: [
      { w: '{浮|う}かぶ', ro: 'ukabu', vi: 'nổi lên; (ý tưởng) nảy ra (アイデアが浮かぶ) (N3)' },
      { w: '{浮|う}く', ro: 'uku', vi: 'nổi; (tiền) dư ra (N3)' },
      { w: '{浮上|ふじょう}', ro: 'fujou', vi: 'nổi lên (mặt nước; bảng xếp hạng) (N1)' },
      { w: '{浮気|うわき}', ro: 'uwaki', vi: 'ngoại tình, lăng nhăng (đọc đặc biệt) (N2)' },
    ],
  },
  '透': {
    hv: 'THẤU', nghia: 'xuyên qua, trong suốt', en: 'transparent / penetrate',
    on: ['トウ'], kun: ['す・く', 'す・かす', 'す・ける'],
    nho: 'Bên trái 辶 (bước đi), bên trong 秀 (phần gợi âm): ĐI XUYÊN qua được = THẤU → 透明 (trong suốt — ánh sáng đi xuyên), 浸透 (thấm vào; lan rộng — 浸 = thấm, chữ N1: đã gặp trong 浸水 ở Bài 46, chỉ cần đọc cả từ).',
    tu: [
      { w: '{浸透|しんとう}', ro: 'shintou', vi: 'thấm vào; (ý tưởng, sản phẩm) lan rộng, ăn sâu (N1 — hay gặp ở N2)' },
      { w: '{透明|とうめい}', ro: 'toumei', vi: 'trong suốt (透明なプラスチック) (N2)' },
      { w: '{透|す}ける', ro: 'sukeru', vi: 'nhìn xuyên qua được (N1)' },
    ],
  },
  '頻': {
    hv: 'TẦN', nghia: 'nhiều lần, liên tục', en: 'frequent',
    on: ['ヒン'], kun: [],
    nho: 'Bên trái 歩 (bước chân), bên phải 頁 (cái đầu — mặt người). Mẹo: BƯỚC CHÂN ghé tới trước MẶT ai đó hết lần này tới lần khác = NHIỀU LẦN, TẦN SUẤT → 頻繁 (thường xuyên), 頻度 (tần suất).',
    tu: [
      { w: '{頻繁|ひんぱん}', ro: 'hinpan', vi: 'thường xuyên, dày đặc (頻繁に起こる) (N2 — từ vựng Bài 48)' },
      { w: '{頻度|ひんど}', ro: 'hindo', vi: 'tần suất (使用頻度) (N1)' },
    ],
  },
  '郊': {
    hv: 'GIAO', nghia: 'vùng ven thành', en: 'suburbs',
    on: ['コウ'], kun: [],
    nho: 'Bên trái 交 (giao nhau — phần gợi âm コウ), bên phải 阝 (bộ ấp — làng, thành): chỗ thành phố GIAO với nông thôn = NGOẠI Ô → 郊外 (ngoại ô — Bài 32), 近郊 (vùng lân cận đô thị).',
    tu: [
      { w: '{郊外|こうがい}', ro: 'kougai', vi: 'ngoại ô (Bài 32)' },
      { w: '{近郊|きんこう}', ro: 'kinkou', vi: 'vùng ven, lân cận thành phố (東京近郊) (N1)' },
    ],
  },
  '疎': {
    hv: 'SƠ', nghia: 'thưa, xa cách', en: 'sparse / estranged',
    on: ['ソ'], kun: ['うと・い', 'うと・む'],
    nho: 'Bên trái 𤴔 (biến thể của 疋 — cái chân), bên phải 束 (bó lại — phần gợi âm ソク → ソ): CHÂN gỡ khỏi BÓ, mỗi cái một nơi = THƯA, XA CÁCH → 過疎 (quá thưa dân — 過疎化 Bài 42), 疎遠 (xa cách, ít liên lạc).',
    tu: [
      { w: '{過疎|かそ}', ro: 'kaso', vi: 'thưa dân quá mức (過疎化 — Bài 42) (N1 — hay gặp ở N2)' },
      { w: '{疎遠|そえん}', ro: 'soen', vi: 'xa cách, ít qua lại (N1)' },
      { w: '{疎|うと}い', ro: 'utoi', vi: 'mù mờ, ít hiểu biết (世の中に疎い) (N1)' },
    ],
  },
  '密': {
    hv: 'MẬT', nghia: 'kín đáo; dày đặc', en: 'secret / dense',
    on: ['ミツ'], kun: [],
    nho: 'Phía trên 宀 (mái nhà) + 必 (phần gợi âm ヒツ → ミツ), phía dưới 山 (núi): ngôi nhà KÍN giữa núi sâu = BÍ MẬT; cây cối um tùm KÍN mít = DÀY ĐẶC → 秘密 (bí mật), 過密 (quá đông đúc), 密度 (mật độ).',
    tu: [
      { w: '{秘密|ひみつ}', ro: 'himitsu', vi: 'bí mật (N3)' },
      { w: '{過密|かみつ}', ro: 'kamitsu', vi: 'quá đông đúc, quá dày (過密なスケジュール) (N1 — hay gặp ở N2)' },
      { w: '{密度|みつど}', ro: 'mitsudo', vi: 'mật độ (人口密度) (N2)' },
      { w: '{親密|しんみつ}', ro: 'shinmitsu', vi: 'thân mật (N1)' },
    ],
  },
  '革': {
    hv: 'CÁCH', nghia: 'da thuộc; đổi mới, cải cách', en: 'leather / reform',
    on: ['カク'], kun: ['かわ'],
    nho: 'Chữ vẽ TẤM DA THÚ căng ra đã cạo sạch lông (phía trên là đầu, giữa là thân, dưới là đuôi): da sống biến thành da thuộc = ĐỔI KHÁC hẳn → CÁCH (cải cách, cách mạng). 革 (かわ) = da thuộc (革のかばん).',
    tu: [
      { w: '{改革|かいかく}', ro: 'kaikaku', vi: 'cải cách (働き方改革 — Bài 42)' },
      { w: '{革新|かくしん}', ro: 'kakushin', vi: 'đổi mới, cách tân (技術革新) (N1 — hay gặp ở N2)' },
      { w: '{革命|かくめい}', ro: 'kakumei', vi: 'cách mạng (産業革命) (N2)' },
      { w: '{革|かわ}', ro: 'kawa', vi: 'da thuộc (革の靴) (N2)' },
    ],
  },
  '導': {
    hv: 'ĐẠO', nghia: 'dẫn dắt', en: 'guide / lead',
    on: ['ドウ'], kun: ['みちび・く'],
    nho: 'Phía trên 道 (con đường — phần gợi âm ドウ), phía dưới 寸 (bàn tay): BÀN TAY dắt người đi đúng ĐƯỜNG = DẪN → 導く (dẫn dắt), 導入 (dẫn vào = đưa vào sử dụng), 指導 (chỉ đạo, hướng dẫn).',
    tu: [
      { w: '{導入|どうにゅう}', ro: 'dounyuu', vi: 'đưa vào (áp dụng — công nghệ, chế độ) (N2)' },
      { w: '{指導|しどう}', ro: 'shidou', vi: 'hướng dẫn, chỉ đạo (卒論の指導) (N2)' },
      { w: '{導|みちび}く', ro: 'michibiku', vi: 'dẫn dắt (成功に導く) (N1)' },
    ],
  },
  '枯': {
    hv: 'KHÔ', nghia: 'khô héo', en: 'wither',
    on: ['コ'], kun: ['か・れる', 'か・らす'],
    nho: 'Bên trái 木 (cây), bên phải 古 (cũ, xưa — phần gợi âm コ): CÂY đã CŨ, già cỗi thì KHÔ HÉO = KHÔ → 枯れる (héo, khô chết), 枯れ葉 (lá khô).',
    tu: [
      { w: '{枯|か}れる', ro: 'kareru', vi: '(cây, hoa) khô héo (N3)' },
      { w: '{枯|か}れ{葉|は}', ro: 'kareha', vi: 'lá khô (N2)' },
      { w: '{枯|か}らす', ro: 'karasu', vi: 'làm (cây) chết khô (花を枯らす) (N2)' },
    ],
  },
  '芽': {
    hv: 'NHA', nghia: 'mầm, chồi', en: 'bud / sprout',
    on: ['ガ'], kun: ['め'],
    nho: 'Phía trên 艹 (cỏ cây), phía dưới 牙 (răng nanh — phần gợi âm ガ): cái MẦM nhọn như RĂNG NANH nhú lên khỏi đất = NHA → 芽 (mầm), 芽生える (nảy mầm; tình cảm nảy nở), 発芽 (nảy mầm).',
    tu: [
      { w: '{芽|め}', ro: 'me', vi: 'mầm, chồi (芽が出る) (N2)' },
      { w: '{芽生|めば}える', ro: 'mebaeru', vi: 'nảy mầm; (tình cảm, ý thức) nảy nở (N1)' },
      { w: '{発芽|はつが}', ro: 'hatsuga', vi: 'sự nảy mầm (N1)' },
    ],
  },
  '潮': {
    hv: 'TRIỀU', nghia: 'thuỷ triều; trào lưu', en: 'tide / trend',
    on: ['チョウ'], kun: ['しお'],
    nho: 'Bên trái 氵 (nước), bên phải 朝 (buổi sáng — phần gợi âm チョウ): NƯỚC biển dâng lên mỗi BUỔI SÁNG = THUỶ TRIỀU → 潮 (しお), 満潮 (triều cường). Dòng chảy chung của xã hội như con nước = TRÀO LƯU → 風潮 (xu hướng, trào lưu).',
    tu: [
      { w: '{風潮|ふうちょう}', ro: 'fuuchou', vi: 'trào lưu, xu hướng xã hội (N1 — hay gặp ở N2)' },
      { w: '{潮|しお}', ro: 'shio', vi: 'thuỷ triều; nước biển (N2)' },
      { w: '{満潮|まんちょう}', ro: 'manchou', vi: 'triều cường, nước lớn (N1)' },
      { w: '{最高潮|さいこうちょう}', ro: 'saikouchou', vi: 'cao trào (N1)' },
    ],
  },
  '幅': {
    hv: 'PHÚC', nghia: 'bề ngang, độ rộng; biên độ', en: 'width',
    on: ['フク'], kun: ['はば'],
    nho: 'Bên trái 巾 (tấm vải), bên phải 畐 (cái bình đầy — phần gợi âm フク): BỀ NGANG của tấm VẢI = KHỔ, ĐỘ RỘNG → 幅 (はば), 大幅 (biên độ lớn — 大幅に増える: tăng mạnh), 幅広い (rộng rãi, đa dạng).',
    tu: [
      { w: '{大幅|おおはば}', ro: 'oohaba', vi: 'mạnh, lớn (mức thay đổi) (大幅に下がる) (N2)' },
      { w: '{幅|はば}', ro: 'haba', vi: 'bề ngang, độ rộng; biên độ (N2)' },
      { w: '{幅広|はばひろ}い', ro: 'habahiroi', vi: 'rộng; đa dạng (幅広い年代) (N2)' },
      { w: '{横幅|よこはば}', ro: 'yokohaba', vi: 'chiều ngang (N2)' },
    ],
  },
};
