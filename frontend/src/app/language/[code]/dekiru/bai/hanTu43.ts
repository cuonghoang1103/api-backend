/**
 * Chữ Hán MỚI của Bài 43 (評価 — tiếp sau sách, cấp N2) cho thẻ chữ Hán — cùng định dạng hanTu.ts.
 * 24 chữ: 総 劣 微 妙 星 雰 盛 稿 濃 薄 演 劇 俳 監 督 脚 賞 審 豊 富 迫 鋭 珍 熟 — bảng `b43-han-tu` trong bai43.ts.
 * Cấp theo các bảng tham khảo phổ biến (JLPT không công bố danh sách chữ chính thức): phần lớn N2; 星 nhiều bảng xếp N3–N4;
 * 劣 妙 雰 稿 俳 監 督 審 鋭 nhiều bảng xếp N1 nhưng TỪ chứa chúng (劣る・微妙・雰囲気・投稿・俳優・監督・審査・鋭い) là từ N2–N3 rất
 * hay gặp. Không trùng hanTu.ts, hanTu16–42.ts, hanTuTiep.ts, hanLop.ts và các bảng chữ Hán Bài 1–42 (kiểm 09/11 bằng script — Bài 41 =
 * 就 採 志 履 企 契 析 項 挑 魅 秀 柄 極 抱 薦 雇 弊 攻 型 厚 遇 貢 献 獲 · Bài 42 = 福 祉 護 療 労 層 拡 援 障 籍 削 染 炭 酸 廃 児 童 偏 処 況 域 施 設 婦).
 * Cách nhớ: theo cấu tạo chữ (phần chỉ nghĩa + phần gợi âm của chữ hình thanh ghi rõ). Từ đi chung ưu tiên từ dùng trong bai43.ts
 * và từ đã gặp ở bài trước (雰囲気 Bài 36, 豊富 Bài 33/37, 俳優 Bài 33, 珍しい Bài 28/29, 濃い Bài 31, 薄い Bài 18/32, 微妙 Bài 36).
 * On / Kun theo bảng thường dụng (常用): 総 微 妙 雰 稿 演 劇 俳 監 督 審 chỉ có âm On; 星 có On セイ・ショウ (ショウ hiếm — 明星);
 * 盛 có On セイ・ジョウ (ジョウ trong 繁盛) và Kun も・る／さか・る／さか・ん; 脚 có On キャク・キャ (キャ trong 脚立); 富 có On フ・フウ
 * (フウ trong 富貴 — hiếm) và Kun と・む／とみ; 薄 có nhiều Kun (うす・い／うす・める／うす・まる／うす・らぐ／うす・れる); 熟 có Kun う・れる.
 * Tệp chỉ có `import type` — tải chậm như hanTu.ts.
 */
import type { HanTu } from '@/components/sach-hoc/kanji';

export const HAN_TU_43: Record<string, HanTu> = {
  '総': {
    hv: 'TỔNG', nghia: 'tổng, gộp tất cả lại', en: 'general / total',
    on: ['ソウ'], kun: [],
    nho: 'Bên trái 糸 (sợi chỉ), bên phải 公 (chung, của mọi người) chồng trên 心 (lòng): lấy SỢI CHỈ BUỘC GỘP mọi thứ CHUNG lại làm MỘT = TỔNG → 総合 (tổng hợp), 総額 (tổng số tiền). Ghép sẵn từ đã học: 合 (Bài 1–15), 額 (Bài 38).',
    tu: [
      { w: '{総合|そうごう}', ro: 'sougou', vi: 'tổng hợp (N2)' },
      { w: '{総合評価|そうごうひょうか}', ro: 'sougou hyouka', vi: 'đánh giá tổng thể' },
      { w: '{総額|そうがく}', ro: 'sougaku', vi: 'tổng số tiền (N2)' },
      { w: '{総理大臣|そうりだいじん}', ro: 'souri daijin', vi: 'thủ tướng' },
    ],
  },
  '劣': {
    hv: 'LIỆT', nghia: 'kém, thua, xấu đi', en: 'inferior',
    on: ['レツ'], kun: ['おと・る'],
    nho: 'Trên là 少 (ít), dưới là 力 (sức): ÍT SỨC thì THUA KÉM người khác = LIỆT → 劣る (kém hơn). Đặt cạnh 優 (ưu — giỏi, Bài 41 優秀): 優劣 = hơn kém. Chữ ghép rất "dễ đoán": ít + sức.',
    tu: [
      { w: '{劣|おと}る', ro: 'otoru', vi: 'kém hơn, thua (N2)' },
      { w: '{優劣|ゆうれつ}', ro: 'yuuretsu', vi: 'hơn kém, thứ bậc (N1)' },
      { w: '{劣化|れっか}', ro: 'rekka', vi: 'xuống cấp, giảm chất lượng (N1)' },
      { w: '{劣等感|れっとうかん}', ro: 'rettoukan', vi: 'mặc cảm tự ti' },
    ],
  },
  '微': {
    hv: 'VI', nghia: 'nhỏ bé, rất ít, nhẹ', en: 'slight / minute',
    on: ['ビ'], kun: [],
    nho: 'Bên trái 彳 (bước chân), giữa là 山 + 一 + 几 (một thứ nhỏ đặt trên ghế), bên phải 攵 (gõ nhẹ): BƯỚC RÓN RÉN, GÕ THẬT KHẼ vào vật nhỏ = VI (nhỏ, nhẹ). ⚠ Đừng nhầm với 徴 (Bài 36 — 特徴): giữa 徴 là 王, giữa 微 là 几.',
    tu: [
      { w: '{微妙|びみょう}', ro: 'bimyou', vi: 'tế nhị; "hơi khó nói", không hẳn tốt (N2)' },
      { w: '{微熱|びねつ}', ro: 'binetsu', vi: 'sốt nhẹ (N2)' },
      { w: '{微笑|ほほえ}む', ro: 'hohoemu', vi: 'mỉm cười (đọc đặc biệt — N2)' },
      { w: '{微量|びりょう}', ro: 'biryou', vi: 'lượng rất nhỏ' },
    ],
  },
  '妙': {
    hv: 'DIỆU', nghia: 'lạ, kỳ lạ; khéo, tài tình', en: 'strange / exquisite',
    on: ['ミョウ'], kun: [],
    nho: 'Bên trái 女 (người con gái), bên phải 少 (trẻ, nhỏ): CÔ GÁI TRẺ đẹp đến KỲ DIỆU, khó tả = DIỆU → 妙な (lạ lạ), 微妙 (tinh tế, khó nói). Cùng phần 少 với 劣 (ít sức) và 省 (Bài 36).',
    tu: [
      { w: '{微妙|びみょう}', ro: 'bimyou', vi: 'tế nhị, khó nói (N2)' },
      { w: '{妙|みょう}な', ro: 'myou na', vi: 'lạ lùng, kỳ quặc (N2)' },
      { w: '{奇妙|きみょう}', ro: 'kimyou', vi: 'kỳ quái (N1)' },
      { w: '{絶妙|ぜつみょう}', ro: 'zetsumyou', vi: 'tuyệt diệu, vừa khéo (N1)' },
    ],
  },
  '星': {
    hv: 'TINH', nghia: 'ngôi sao', en: 'star',
    on: ['セイ', 'ショウ'], kun: ['ほし'],
    nho: 'Trên là 日 (mặt trời — ánh sáng), dưới là 生 (sinh ra, gợi âm セイ): ÁNH SÁNG SINH RA trên trời đêm = NGÔI SAO. Trang đánh giá (レビュー) chấm bằng sao: ★★★ = {星|ほし}{三|みっ}つ. Cùng 生 gợi âm セイ với 性 (tính), 姓.',
    tu: [
      { w: '{星|ほし}', ro: 'hoshi', vi: 'ngôi sao; "sao" đánh giá (★)' },
      { w: '{星|ほし}{三|みっ}つ', ro: 'hoshi mittsu', vi: 'ba sao (★★★)' },
      { w: '{火星|かせい}', ro: 'kasei', vi: 'sao Hoả' },
      { w: '{流|なが}れ{星|ぼし}', ro: 'nagareboshi', vi: 'sao băng' },
    ],
  },
  '雰': {
    hv: 'PHÂN', nghia: 'hơi sương, không khí (chỉ còn trong 雰囲気)', en: 'atmosphere',
    on: ['フン'], kun: [],
    nho: 'Trên là 雨 (mưa, khí trời), dưới là 分 (chia ra, gợi âm フン): HƠI SƯƠNG MƯA TẢN RA khắp nơi = bầu không khí → 雰囲気 (ふんいき). Gần như chỉ gặp trong 雰囲気 — nhớ cả từ: 雨 + 分 · 囲 (Bài 36 — bao quanh) · 気.',
    tu: [
      { w: '{雰囲気|ふんいき}', ro: 'fun\'iki', vi: 'bầu không khí, không gian (Bài 36)' },
      { w: '{雰囲気|ふんいき}がいい', ro: 'fun\'iki ga ii', vi: 'không gian dễ chịu' },
      { w: '{明|あか}るい{雰囲気|ふんいき}', ro: 'akarui fun\'iki', vi: 'không khí vui vẻ' },
    ],
  },
  '盛': {
    hv: 'THỊNH', nghia: 'đầy, chất đầy; thịnh vượng, sôi nổi', en: 'pile up / prosper',
    on: ['セイ', 'ジョウ'], kun: ['も・る', 'さか・る', 'さか・ん'],
    nho: 'Trên là 成 (thành, gợi âm セイ), dưới là 皿 (cái đĩa): đồ ăn CHẤT THÀNH ĐỐNG trên ĐĨA = đầy, THỊNH → 盛る (xới, bày ra đĩa), 大盛り (suất lớn). Đầy thì "thịnh" → 盛ん (sôi nổi), 盛り上がる (náo nhiệt). Cùng 皿 với 監 (giám).',
    tu: [
      { w: '{大盛|おおも}り', ro: 'oomori', vi: 'suất lớn (cơm, mì) (N2)' },
      { w: '{盛|も}り{付|つ}け', ro: 'moritsuke', vi: 'cách bày món ăn (N2)' },
      { w: '{盛|さか}ん', ro: 'sakan', vi: 'thịnh hành, sôi nổi (N2)' },
      { w: '{盛|も}り{上|あ}がる', ro: 'moriagaru', vi: 'trở nên náo nhiệt, sôi động (N2)' },
      { w: '{繁盛|はんじょう}', ro: 'hanjou', vi: '(quán) đắt khách (N1)' },
    ],
  },
  '稿': {
    hv: 'CẢO', nghia: 'bản thảo, bài viết gửi đi', en: 'draft / manuscript',
    on: ['コウ'], kun: [],
    nho: 'Bên trái 禾 (cây lúa), bên phải 高 (cao, gợi âm コウ): ngày xưa viết nháp lên GIẤY LÀM TỪ RƠM LÚA = bản THẢO → 原稿 (bản thảo), 投稿 (gửi bài — nay là "đăng bài" trên mạng, viết レビュー). Cùng 禾 với 秀 (Bài 41), 私, 利.',
    tu: [
      { w: '{投稿|とうこう}', ro: 'toukou', vi: 'đăng bài, gửi bài (lên mạng, báo) (N2)' },
      { w: '{原稿|げんこう}', ro: 'genkou', vi: 'bản thảo (N2)' },
      { w: '{投稿者|とうこうしゃ}', ro: 'toukousha', vi: 'người đăng bài' },
    ],
  },
  '濃': {
    hv: 'NỒNG', nghia: 'đậm, đặc', en: 'thick / dense / strong (taste, colour)',
    on: ['ノウ'], kun: ['こ・い'],
    nho: 'Bên trái 氵 (nước), bên phải 農 (nông nghiệp, gợi âm ノウ): NƯỚC Ở RUỘNG đặc quánh như bùn = ĐẬM, ĐẶC → 濃い (đậm: vị, màu, trà). Đối nghĩa: 薄い (nhạt, mỏng) — cùng bài. Cùng 農 với 農業 (Bài 42 — đã gặp).',
    tu: [
      { w: '{濃|こ}い', ro: 'koi', vi: 'đậm, đặc (N3)' },
      { w: '{味|あじ}が{濃|こ}い', ro: 'aji ga koi', vi: 'vị đậm (mặn)' },
      { w: '{濃厚|のうこう}', ro: 'noukou', vi: 'đậm đà, nồng (vị); khả năng cao (N1)' },
      { w: '{濃度|のうど}', ro: 'noudo', vi: 'nồng độ' },
    ],
  },
  '薄': {
    hv: 'BẠC', nghia: 'mỏng; nhạt; ít, mờ', en: 'thin / weak / light',
    on: ['ハク'], kun: ['うす・い', 'うす・める', 'うす・まる', 'うす・らぐ', 'うす・れる'],
    nho: 'Trên là 艹 (cỏ), dưới trái 氵 (nước), dưới phải 尃 (trải rộng, gợi âm ハク): lớp CỎ MỌC TRẢI MỎNG trên MẶT NƯỚC = MỎNG, NHẠT → 薄い. Dùng cho cả vị (nhạt), màu (nhạt), sách (mỏng), ấn tượng (mờ nhạt). Đối nghĩa: 濃い・厚い (Bài 41 — dày).',
    tu: [
      { w: '{薄|うす}い', ro: 'usui', vi: 'mỏng; nhạt (N3)' },
      { w: '{薄味|うすあじ}', ro: 'usuaji', vi: 'vị nhạt, ít mặn' },
      { w: '{薄|うす}める', ro: 'usumeru', vi: 'pha loãng (N2)' },
      { w: '{印象|いんしょう}が{薄|うす}い', ro: 'inshou ga usui', vi: 'ấn tượng mờ nhạt' },
    ],
  },
  '演': {
    hv: 'DIỄN', nghia: 'trình diễn, diễn xuất', en: 'perform / act',
    on: ['エン'], kun: [],
    nho: 'Bên trái 氵 (nước), bên phải 寅 (dần — phần gợi âm): NƯỚC CHẢY TRẢI DÀI ra = bày ra cho người xem → DIỄN (diễn xuất, diễn tấu, diễn thuyết). Bốn từ hay gặp: 演技 (diễn xuất), 演奏 (biểu diễn nhạc), 出演 (xuất hiện trên phim / show), 公演 (buổi diễn).',
    tu: [
      { w: '{演技|えんぎ}', ro: 'engi', vi: 'diễn xuất (N2)' },
      { w: '{演奏|えんそう}', ro: 'ensou', vi: 'biểu diễn (nhạc cụ) (N2)' },
      { w: '{出演|しゅつえん}', ro: 'shutsuen', vi: 'tham gia diễn, xuất hiện (N2)' },
      { w: '{公演|こうえん}', ro: 'kouen', vi: 'buổi biểu diễn (N1)' },
    ],
  },
  '劇': {
    hv: 'KỊCH', nghia: 'kịch; dữ dội', en: 'drama / play',
    on: ['ゲキ'], kun: [],
    nho: 'Bên trái 豦 (con hổ 虍 vồ con lợn 豕 — đánh nhau), bên phải 刂 (dao): cảnh VẬT LỘN CÓ DAO KIẾM dữ dội diễn trên sân khấu = KỊCH → 演劇, 劇場; "dữ dội, đột ngột" → 劇的 (kịch tính). ⚠ Bên phải là 刂 (dao) — cùng 刂 với 削 (Bài 42), 割.',
    tu: [
      { w: '{演劇|えんげき}', ro: 'engeki', vi: 'kịch, nghệ thuật sân khấu (N2)' },
      { w: '{劇場|げきじょう}', ro: 'gekijou', vi: 'nhà hát (N2)' },
      { w: '{劇的|げきてき}', ro: 'gekiteki', vi: 'kịch tính, đột biến (N1)' },
      { w: '{悲劇|ひげき}', ro: 'higeki', vi: 'bi kịch (N1)' },
    ],
  },
  '俳': {
    hv: 'BÀI', nghia: 'diễn viên; thơ haiku', en: 'actor / haiku',
    on: ['ハイ'], kun: [],
    nho: 'Bên trái 亻 (người), bên phải 非 (khác thường, gợi âm ハイ — 非 hai cánh chim quay lưng): NGƯỜI LÀM ĐIỀU KHÁC THƯỜNG để mua vui = người diễn trò → 俳優 (diễn viên). Cũng là chữ đầu của 俳句 (thơ haiku 5-7-5). Cùng 非 với 悲 (bi — buồn), 排 (Bài 42 — 排出).',
    tu: [
      { w: '{俳優|はいゆう}', ro: 'haiyuu', vi: 'diễn viên (Bài 33 — N2)' },
      { w: '{俳句|はいく}', ro: 'haiku', vi: 'thơ haiku' },
      { w: '{女性俳優|じょせいはいゆう}', ro: 'josei haiyuu', vi: 'nữ diễn viên' },
    ],
  },
  '監': {
    hv: 'GIÁM', nghia: 'trông coi, giám sát', en: 'oversee / supervise',
    on: ['カン'], kun: [],
    nho: 'Trên trái 臣 (con mắt mở to), trên phải 𠂉 + 一 (người cúi xuống), dưới là 皿 (chậu nước): NGƯỜI CÚI XUỐNG NHÌN vào chậu nước (ngày xưa soi gương) = NHÌN KỸ, TRÔNG COI → 監督 (đạo diễn, huấn luyện viên — người "trông" cả đoàn). Cùng 皿 với 盛 (bài này).',
    tu: [
      { w: '{監督|かんとく}', ro: 'kantoku', vi: 'đạo diễn; huấn luyện viên (N2)' },
      { w: '{映画監督|えいがかんとく}', ro: 'eiga kantoku', vi: 'đạo diễn phim' },
      { w: '{監視|かんし}', ro: 'kanshi', vi: 'giám sát, canh chừng (N1)' },
    ],
  },
  '督': {
    hv: 'ĐỐC', nghia: 'đốc thúc, chỉ huy', en: 'supervise / urge',
    on: ['トク'], kun: [],
    nho: 'Trên là 叔 (gợi âm — bàn tay 又 nhặt đậu), dưới là 目 (mắt): DÙNG MẮT TRÔNG CHỪNG mà ĐỐC THÚC người khác làm = ĐỐC. Gần như chỉ gặp trong 監督 — hai chữ cùng "nhìn": 監 (cúi nhìn chậu nước) + 督 (mắt trông chừng).',
    tu: [
      { w: '{監督|かんとく}', ro: 'kantoku', vi: 'đạo diễn, huấn luyện viên, giám sát (N2)' },
      { w: '{現場監督|げんばかんとく}', ro: 'genba kantoku', vi: 'đốc công công trường' },
      { w: '{督促|とくそく}', ro: 'tokusoku', vi: 'đôn đốc, thúc nợ (N1)' },
    ],
  },
  '脚': {
    hv: 'CƯỚC', nghia: 'chân; cái chân (bàn, ghế); kịch bản', en: 'leg / script',
    on: ['キャク', 'キャ'], kun: ['あし'],
    nho: 'Bên trái 月 (bộ Nhục — cơ thể), bên phải 却 (lùi lại — Bài 39 返却, gợi âm キャク): BỘ PHẬN CƠ THỂ bước tới bước LUI = CÁI CHÂN. "Chân" của vở kịch = cái làm nền cho cả vở → 脚本 (kịch bản). ⚠ 足 = bàn chân, cả chân (thường ngày); 脚 = phần chân dài, chân bàn ghế (văn viết).',
    tu: [
      { w: '{脚本|きゃくほん}', ro: 'kyakuhon', vi: 'kịch bản (N2)' },
      { w: '{脚本家|きゃくほんか}', ro: 'kyakuhonka', vi: 'nhà biên kịch' },
      { w: '{机|つくえ}の{脚|あし}', ro: 'tsukue no ashi', vi: 'chân bàn' },
      { w: '{二人三脚|ににんさんきゃく}', ro: 'ninin sankyaku', vi: 'chạy ba chân; "hai người cùng chung sức"' },
    ],
  },
  '賞': {
    hv: 'THƯỞNG', nghia: 'giải thưởng; khen; thưởng thức', en: 'prize / admire',
    on: ['ショウ'], kun: [],
    nho: 'Trên là 尚 (đề cao, gợi âm ショウ), dưới là 貝 (vỏ sò — tiền, của báu): ĐEM CỦA BÁU ra ĐỀ CAO người giỏi = THƯỞNG → 賞 (giải), 受賞 (đoạt giải), 賞金 (tiền thưởng). Cũng "thưởng thức": 鑑賞 (thưởng thức nghệ thuật). Cùng 尚 với 常 (thường), 党.',
    tu: [
      { w: '{賞|しょう}', ro: 'shou', vi: 'giải thưởng (N2)' },
      { w: '{受賞|じゅしょう}', ro: 'jushou', vi: 'đoạt giải, nhận giải (N2)' },
      { w: '{賞金|しょうきん}', ro: 'shoukin', vi: 'tiền thưởng (N2)' },
      { w: '{鑑賞|かんしょう}', ro: 'kanshou', vi: 'thưởng thức (phim, nhạc, tranh) (N2)' },
    ],
  },
  '審': {
    hv: 'THẨM', nghia: 'xét kỹ, thẩm định', en: 'examine / judge',
    on: ['シン'], kun: [],
    nho: 'Trên là 宀 (mái nhà), dưới là 番 (lượt, gợi ý "xem từng cái một"): Ở TRONG NHÀ lần lượt XEM XÉT TỪNG CÁI = THẨM (xét kỹ) → 審査 (thẩm tra, chấm thi), 審査員 (giám khảo). Đi chung chữ 査 đã học (調査 — Bài 33).',
    tu: [
      { w: '{審査|しんさ}', ro: 'shinsa', vi: 'thẩm tra, xét duyệt, chấm (cuộc thi) (N2)' },
      { w: '{審査員|しんさいん}', ro: 'shinsain', vi: 'giám khảo (N2)' },
      { w: '{審判|しんぱん}', ro: 'shinpan', vi: 'trọng tài (N1)' },
      { w: '{不審|ふしん}な', ro: 'fushin na', vi: 'khả nghi (N1)' },
    ],
  },
  '豊': {
    hv: 'PHONG', nghia: 'phong phú, dồi dào, sung túc', en: 'abundant / rich',
    on: ['ホウ'], kun: ['ゆた・か'],
    nho: 'Trên là 曲 (hình những bông lúa chất cao), dưới là 豆 (cái bát cao chân dâng lễ): BÁT LỄ CHẤT ĐẦY ẮP = DỒI DÀO → 豊か (sung túc, phong phú), 豊富 (phong phú — nhiều loại). Cùng 豆 với 頭 (đầu), 短 (ngắn).',
    tu: [
      { w: '{豊|ゆた}か', ro: 'yutaka', vi: 'phong phú, sung túc (N3)' },
      { w: '{豊富|ほうふ}', ro: 'houfu', vi: 'phong phú, nhiều (Bài 33 — N2)' },
      { w: '{経験豊富|けいけんほうふ}', ro: 'keiken houfu', vi: 'giàu kinh nghiệm' },
      { w: '{豊作|ほうさく}', ro: 'housaku', vi: 'được mùa (N1)' },
    ],
  },
  '富': {
    hv: 'PHÚ', nghia: 'giàu, của cải', en: 'wealth / rich',
    on: ['フ', 'フウ'], kun: ['と・む', 'とみ'],
    nho: 'Trên là 宀 (mái nhà), dưới là 畐 (cái bình đầy — đúng phần phải của 福 Bài 42): NHÀ CÓ BÌNH ĐẦY ẮP = GIÀU → 豊富, 富む (giàu có, nhiều). Nhớ cặp: 福 (礻 + 畐 — thần ban bình đầy = phúc) ↔ 富 (宀 + 畐 — nhà có bình đầy = phú). Chữ đầu của 富士山.',
    tu: [
      { w: '{豊富|ほうふ}', ro: 'houfu', vi: 'phong phú (N2)' },
      { w: '{富士山|ふじさん}', ro: 'Fujisan', vi: 'núi Phú Sĩ' },
      { w: '{富|と}む', ro: 'tomu', vi: 'giàu (về…), có nhiều (N1)' },
      { w: '{貧富|ひんぷ}の{差|さ}', ro: 'hinpu no sa', vi: 'chênh lệch giàu nghèo' },
    ],
  },
  '迫': {
    hv: 'BÁCH', nghia: 'áp sát, dồn tới; cấp bách', en: 'press / approach',
    on: ['ハク'], kun: ['せま・る'],
    nho: 'Bên dưới-trái 辶 (bộ Sước — đi, tiến tới), bên trong 白 (trắng, gợi âm ハク): TIẾN SÁT TỚI gần = ÁP SÁT → 迫る (đến gần, ép), 迫力 (sức "dồn ép" người xem = độ hoành tráng, cuốn hút). Cùng 白 gợi âm ハク với 拍手 (はくしゅ — vỗ tay).',
    tu: [
      { w: '{迫力|はくりょく}', ro: 'hakuryoku', vi: 'sức mạnh lôi cuốn, hoành tráng (N2)' },
      { w: '{迫|せま}る', ro: 'semaru', vi: 'đến gần, áp sát; ép buộc (N2)' },
      { w: '{締|し}め{切|き}りが{迫|せま}る', ro: 'shimekiri ga semaru', vi: 'hạn chót đến gần' },
      { w: '{圧迫|あっぱく}', ro: 'appaku', vi: 'áp lực, chèn ép (N1)' },
    ],
  },
  '鋭': {
    hv: 'NHUỆ', nghia: 'sắc, nhọn; nhạy bén', en: 'sharp / keen',
    on: ['エイ'], kun: ['するど・い'],
    nho: 'Bên trái 金 (kim loại), bên phải 兑 (gợi âm — đầu nhọn 丷 trên một thân): KIM LOẠI CÓ ĐẦU NHỌN = SẮC → 鋭い (sắc; nhận xét, câu hỏi "sắc sảo"). Đối nghĩa: 鈍い (にぶい — cùn, chậm hiểu). Cùng phần phải 兑 với 説 (thuyết) và 税 (Bài 39).',
    tu: [
      { w: '{鋭|するど}い', ro: 'surudoi', vi: 'sắc, nhọn; sắc sảo, nhạy (N2)' },
      { w: '{鋭|するど}い{指摘|してき}', ro: 'surudoi shiteki', vi: 'lời chỉ ra sắc sảo' },
      { w: '{鋭|するど}い{質問|しつもん}', ro: 'surudoi shitsumon', vi: 'câu hỏi sắc bén' },
    ],
  },
  '珍': {
    hv: 'TRÂN', nghia: 'hiếm, lạ, quý', en: 'rare / unusual',
    on: ['チン'], kun: ['めずら・しい'],
    nho: 'Bên trái 王 (biến thể của 玉 — ngọc), bên phải 㐱 (tóc dày, gợi âm): VIÊN NGỌC HIẾM có vân đẹp = QUÝ, LẠ → 珍しい (hiếm, lạ). Âm On チン: 珍味 (món ăn lạ). Cùng 王 (玉) với 現 (hiện), 理 (lý).',
    tu: [
      { w: '{珍|めずら}しい', ro: 'mezurashii', vi: 'hiếm, hiếm thấy, lạ (N4)' },
      { w: '{珍|めずら}しく', ro: 'mezurashiku', vi: '(làm…) một cách hiếm thấy' },
      { w: '{珍味|ちんみ}', ro: 'chinmi', vi: 'món ăn lạ, đặc sản hiếm' },
    ],
  },
  '熟': {
    hv: 'THỤC', nghia: 'chín; thành thạo, kỹ', en: 'ripe / mature / skilled',
    on: ['ジュク'], kun: ['う・れる'],
    nho: 'Trên là 孰 (người bưng đồ cúng đã nấu), dưới là 灬 (lửa): NẤU TRÊN LỬA THẬT KỸ cho CHÍN = THỤC (chín; thành thạo) → 未熟 (chưa chín = non nớt), 成熟 (chín chắn), 熟練 (lão luyện), 熟睡 (ngủ say). Cùng 灬 với 熱 (nóng) và 点 (điểm).',
    tu: [
      { w: '{未熟|みじゅく}', ro: 'mijuku', vi: 'non nớt, chưa thạo (N2)' },
      { w: '{成熟|せいじゅく}', ro: 'seijuku', vi: 'trưởng thành, chín (N1)' },
      { w: '{熟練|じゅくれん}', ro: 'jukuren', vi: 'lão luyện, tay nghề cao (N1)' },
      { w: '{熟睡|じゅくすい}', ro: 'jukusui', vi: 'ngủ say (N1)' },
    ],
  },
};
