/**
 * Chữ Hán MỚI của Bài 35 (インターン — tiếp sau sách, cấp N3) cho thẻ chữ Hán — cùng định dạng hanTu.ts.
 * 21 chữ: 僚 署 属 歓 修 耐 摘 刷 快 励 訓 惜 悩 充 精 評 締 悔 余 叱 褒 (N3 là chính theo các bảng tham khảo phổ biến;
 * 署・属・耐・摘・励・惜・充・精 có bảng xếp N2; 僚・叱・褒 nhiều bảng xếp N1 nhưng các từ 同僚・叱る・褒める là N3–N4 — JLPT không
 * công bố danh sách chữ chính thức) — bảng `b35-han-tu` trong bai35.ts.
 * Cách nhớ: theo cấu tạo chữ (phần chỉ nghĩa + phần gợi âm của chữ hình thanh ghi rõ). Từ đi chung ưu tiên từ dùng trong
 * bai35.ts và từ đã học ở bài trước (褒める・悔しい Bài 22, 締め切り Bài 26, 叱る Bài 32, 後悔・余裕・充電・戸締まり Bài 34).
 * On / Kun theo bảng thường dụng (常用): 僚 署 属 歓 訓 評 chỉ có âm On; 修 có On シュウ・シュ (修行 — N1) và kun おさ・める (N1);
 * 精 có On セイ・ショウ (不精 — N1); 叱 — bảng 常用 2010 in dạng 𠮟, dùng phổ biến dạng 叱 (cùng một chữ).
 * Tệp chỉ có `import type` — tải chậm như hanTu.ts.
 */
import type { HanTu } from '@/components/sach-hoc/kanji';

export const HAN_TU_35: Record<string, HanTu> = {
  '僚': {
    hv: 'LIÊU', nghia: 'bạn cùng làm, đồng liêu', en: 'colleague / official',
    on: ['リョウ'], kun: [],
    nho: 'Bên trái 亻 (người), bên phải 尞 (gợi âm リョウ; vốn vẽ ngọn đuốc cháy sáng): NHỮNG NGƯỜI CÙNG LÀM DƯỚI MỘT ÁNH ĐUỐC = đồng liêu → 同僚. Cùng 尞 với 寮 (ký túc xá — 宀) và 療 (chữa — 疒): cả ba đọc リョウ.',
    tu: [
      { w: '{同僚|どうりょう}', ro: 'douryou', vi: 'đồng nghiệp' },
      { w: '{官僚|かんりょう}', ro: 'kanryou', vi: 'quan chức (N1)' },
      { w: '{閣僚|かくりょう}', ro: 'kakuryou', vi: 'thành viên nội các (N1)' },
    ],
  },
  '署': {
    hv: 'THỰ', nghia: 'sở, cơ quan; ký tên', en: 'government office / signature',
    on: ['ショ'], kun: [],
    nho: 'Trên 罒 (cái lưới), dưới 者 (người — gợi âm ショ): GIĂNG LƯỚI CHIA NGƯỜI VÀO TỪNG CHỖ = sở, cơ quan → 部署, 警察署; đứng tên chỗ mình → 署名 (ký tên). Cùng 者 với 暑 (日 trên) và 著 (艹 trên).',
    tu: [
      { w: '{部署|ぶしょ}', ro: 'busho', vi: 'phòng ban, bộ phận' },
      { w: '{署名|しょめい}', ro: 'shomei', vi: 'chữ ký, ký tên (N2)' },
      { w: '{警察署|けいさつしょ}', ro: 'keisatsusho', vi: 'đồn cảnh sát' },
      { w: '{消防署|しょうぼうしょ}', ro: 'shoubousho', vi: 'sở cứu hoả' },
    ],
  },
  '属': {
    hv: 'THUỘC', nghia: 'thuộc về', en: 'belong / genus',
    on: ['ゾク'], kun: [],
    nho: 'Chữ gốc 屬 = 尾 (cái đuôi) + 蜀 (gợi âm): CÁI ĐUÔI DÍNH LIỀN THEO THÂN = thuộc về; dạng nay viết gọn 尸 + 禹 → 所属, 配属, 金属.',
    tu: [
      { w: '{配属|はいぞく}', ro: 'haizoku', vi: 'phân về (bộ phận)' },
      { w: '{所属|しょぞく}', ro: 'shozoku', vi: 'trực thuộc (N2)' },
      { w: '{金属|きんぞく}', ro: 'kinzoku', vi: 'kim loại (N2)' },
      { w: '{付属|ふぞく}', ro: 'fuzoku', vi: 'phụ thuộc, trực thuộc' },
    ],
  },
  '歓': {
    hv: 'HOAN', nghia: 'vui mừng', en: 'delight / joy',
    on: ['カン'], kun: [],
    nho: 'Bên trái là phần trái của 観 (gợi âm カン), bên phải 欠 (người há miệng): HÁ MIỆNG REO MỪNG = hoan → 歓迎. 観 (nhìn) có 見 bên phải, 歓 (vui) có 欠 — cùng đọc カン.',
    tu: [
      { w: '{歓迎|かんげい}', ro: 'kangei', vi: 'hoan nghênh, chào đón' },
      { w: '{歓迎会|かんげいかい}', ro: 'kangeikai', vi: 'tiệc chào mừng' },
      { w: '{歓声|かんせい}', ro: 'kansei', vi: 'tiếng reo hò (N1)' },
    ],
  },
  '修': {
    hv: 'TU', nghia: 'sửa, tu sửa; học, rèn', en: 'repair / discipline / study',
    on: ['シュウ', 'シュ'], kun: ['おさ・める'],
    nho: '攸 (亻 + 丨 + 攵: người cầm gậy chỉnh sửa) + 彡 (ba nét lông — vẻ đẹp): CHẢI CHUỐT, SỬA CHO ĐẸP = tu → 修正, 修理; sửa chính mình → học, rèn: 研修, 修学旅行.',
    tu: [
      { w: '{研修|けんしゅう}', ro: 'kenshuu', vi: 'tập huấn, đào tạo' },
      { w: '{修正|しゅうせい}', ro: 'shuusei', vi: 'chỉnh sửa' },
      { w: '{修理|しゅうり}', ro: 'shuuri', vi: 'sửa chữa (đồ vật)' },
      { w: '{修学旅行|しゅうがくりょこう}', ro: 'shuugaku ryokou', vi: 'chuyến đi tham quan của trường' },
    ],
  },
  '耐': {
    hv: 'NẠI', nghia: 'chịu đựng', en: 'endure / resist',
    on: ['タイ'], kun: ['た・える'],
    nho: 'Bên trái 而 (bộ râu), bên phải 寸 (bàn tay / phép tắc): xưa có hình phạt CẠO RÂU — người bị phạt phải CHỊU ĐỰNG = nại → 耐える, 忍耐. Khác 対 (文 + 寸): cùng 寸, cùng đọc タイ.',
    tu: [
      { w: '{耐|た}える', ro: 'taeru', vi: 'chịu đựng' },
      { w: '{忍耐|にんたい}', ro: 'nintai', vi: 'nhẫn nại (N1)' },
      { w: '{耐震|たいしん}', ro: 'taishin', vi: 'chịu được động đất (N1)' },
    ],
  },
  '摘': {
    hv: 'TRÍCH', nghia: 'hái, ngắt; chỉ ra', en: 'pluck / point out',
    on: ['テキ'], kun: ['つ・む'],
    nho: 'Bên trái 扌 (tay), bên phải 啇 (gợi âm テキ): DÙNG TAY NGẮT RA = hái → 摘む; ngắt đúng chỗ sai mà đưa ra → 指摘. Cùng 啇 với 適 (辶) và 敵 (攵) — cả ba đọc テキ.',
    tu: [
      { w: '{指摘|してき}', ro: 'shiteki', vi: 'chỉ ra (lỗi, vấn đề)' },
      { w: '{摘|つ}む', ro: 'tsumu', vi: 'hái (trà, hoa — N1)' },
    ],
  },
  '刷': {
    hv: 'LOÁT', nghia: 'in; quét', en: 'print / brush',
    on: ['サツ'], kun: ['す・る'],
    nho: '尸 + 巾 (tấm khăn) + 刂 (con dao): DÙNG KHĂN LAU, DAO CẠO BẢN KHẮC RỒI IN = loát → 印刷, 刷る. Khác 刺 (名刺 — 朿 + 刂) và 届 (尸 + 由, không có 刂).',
    tu: [
      { w: '{印刷|いんさつ}', ro: 'insatsu', vi: 'in (ấn)' },
      { w: '{刷|す}る', ro: 'suru', vi: 'in (N1)' },
      { w: '{増刷|ぞうさつ}', ro: 'zousatsu', vi: 'in thêm' },
    ],
  },
  '快': {
    hv: 'KHOÁI', nghia: 'dễ chịu, sảng khoái; nhanh', en: 'pleasant / cheerful',
    on: ['カイ'], kun: ['こころよ・い'],
    nho: 'Bên trái 忄 (trái tim), bên phải 夬 (gợi âm カイ — vật được khoét thông): LÒNG THÔNG SUỐT, NHẸ NHÕM = khoái → 快い, 快適. Khác 決 (氵 + 夬): cùng phần phải.',
    tu: [
      { w: '{快|こころよ}い・{快|こころよ}く', ro: 'kokoroyoi / kokoroyoku', vi: 'dễ chịu / vui vẻ, sẵn lòng' },
      { w: '{快適|かいてき}', ro: 'kaiteki', vi: 'dễ chịu, tiện nghi' },
      { w: '{快晴|かいせい}', ro: 'kaisei', vi: 'trời quang đãng (N2)' },
      { w: '{快速|かいそく}', ro: 'kaisoku', vi: 'tàu nhanh' },
    ],
  },
  '励': {
    hv: 'LỆ', nghia: 'khích lệ, gắng sức', en: 'encourage / strive',
    on: ['レイ'], kun: ['はげ・ます', 'はげ・む'],
    nho: 'Bên trái 厉 (厂 + 万 — gợi âm レイ), bên phải 力 (sức): DỒN HẾT SỨC = gắng sức → 励む; truyền sức cho người khác → 励ます (động viên). Chữ có 力 → liên quan sức lực.',
    tu: [
      { w: '{励|はげ}ます', ro: 'hagemasu', vi: 'động viên, khích lệ' },
      { w: '{励|はげ}まし', ro: 'hagemashi', vi: 'lời động viên' },
      { w: '{励|はげ}む', ro: 'hagemu', vi: 'gắng sức (N2)' },
      { w: '{激励|げきれい}', ro: 'gekirei', vi: 'khích lệ mạnh mẽ (N1)' },
    ],
  },
  '訓': {
    hv: 'HUẤN', nghia: 'dạy bảo; âm Kun', en: 'instruction / Japanese reading',
    on: ['クン'], kun: [],
    nho: 'Bên trái 言 (lời nói), bên phải 川 (dòng sông — gợi âm, ý "chảy thuận"): LỜI DẠY CHẢY THUẬN VÀO LÒNG NHƯ NƯỚC SÔNG = huấn → 教訓, 訓練. Và 訓読み = cách đọc "giải nghĩa" bằng tiếng Nhật.',
    tu: [
      { w: '{教訓|きょうくん}', ro: 'kyoukun', vi: 'bài học (rút ra)' },
      { w: '{訓練|くんれん}', ro: 'kunren', vi: 'huấn luyện (N2)' },
      { w: '{訓読|くんよ}み', ro: 'kun\'yomi', vi: 'âm Kun' },
      { w: '{避難訓練|ひなんくんれん}', ro: 'hinan kunren', vi: 'diễn tập sơ tán' },
    ],
  },
  '惜': {
    hv: 'TÍCH', nghia: 'tiếc', en: 'regret / pity',
    on: ['セキ'], kun: ['お・しい', 'お・しむ'],
    nho: 'Bên trái 忄 (lòng), bên phải 昔 (ngày xưa — gợi âm セキ): LÒNG NHỚ NGÀY XƯA KHÔNG TRỞ LẠI = tiếc → 惜しい. Khác 借 (かりる — 亻 + 昔): cùng phần phải, khác bộ trái.',
    tu: [
      { w: '{惜|お}しい', ro: 'oshii', vi: 'tiếc (suýt được)' },
      { w: '{惜|お}しむ', ro: 'oshimu', vi: 'tiếc, quý (N1)' },
      { w: '{負|ま}け{惜|お}しみ', ro: 'makeoshimi', vi: 'cãi cố khi thua' },
      { w: '{惜敗|せきはい}', ro: 'sekihai', vi: 'thua sát nút' },
    ],
  },
  '悩': {
    hv: 'NÃO', nghia: 'phiền não, khổ tâm', en: 'worry / be troubled',
    on: ['ノウ'], kun: ['なや・む', 'なや・ます'],
    nho: 'Bên trái 忄 (lòng), bên phải giống phần phải của 脳 (bộ não — đầu có tóc): LÒNG VÀ ĐẦU ĐỀU RỐI = phiền não → 悩む. 悩 (忄) và 脳 (月) cùng đọc ノウ.',
    tu: [
      { w: '{悩|なや}む', ro: 'nayamu', vi: 'trăn trở, phiền não' },
      { w: '{悩|なや}み', ro: 'nayami', vi: 'nỗi lo, điều phiền muộn' },
      { w: '{苦悩|くのう}', ro: 'kunou', vi: 'khổ não (N1)' },
    ],
  },
  '充': {
    hv: 'SUNG', nghia: 'đầy đủ', en: 'fill / full',
    on: ['ジュウ'], kun: ['あ・てる'],
    nho: '亠 + 厶 + 儿 (người đứng): vẽ ĐỨA TRẺ ĐÃ LỚN ĐẦY ĐỦ = sung (đầy) → 充実, 充電. Nằm trong 統 (Bài 33 — 糸 + 充).',
    tu: [
      { w: '{充実|じゅうじつ}', ro: 'juujitsu', vi: 'đầy đủ, trọn vẹn' },
      { w: '{充電|じゅうでん}', ro: 'juuden', vi: 'sạc pin (Bài 34)' },
      { w: '{充分|じゅうぶん}', ro: 'juubun', vi: 'đầy đủ (= 十分)' },
      { w: '{補充|ほじゅう}', ro: 'hojuu', vi: 'bổ sung (N1)' },
    ],
  },
  '精': {
    hv: 'TINH', nghia: 'tinh (gạo xay kỹ); tinh thần; kỹ lưỡng', en: 'refined / spirit / precise',
    on: ['セイ', 'ショウ'], kun: [],
    nho: 'Bên trái 米 (gạo), bên phải 青 (xanh trong — gợi âm セイ): GẠO XAY TRẮNG TINH = tinh → 精神 (phần "tinh" của con người), 精一杯 (dốc hết tinh lực). Cùng 青 với 晴・清・静 — đều đọc セイ.',
    tu: [
      { w: '{精一杯|せいいっぱい}', ro: 'seiippai', vi: 'hết sức mình' },
      { w: '{精神|せいしん}', ro: 'seishin', vi: 'tinh thần (N2)' },
      { w: '{精密|せいみつ}', ro: 'seimitsu', vi: 'tinh vi, chính xác (N1)' },
      { w: '{不精|ぶしょう}', ro: 'bushou', vi: 'lười (N1)' },
    ],
  },
  '評': {
    hv: 'BÌNH', nghia: 'bình phẩm, đánh giá', en: 'evaluate / criticize',
    on: ['ヒョウ'], kun: [],
    nho: 'Bên trái 言 (lời), bên phải 平 (bằng phẳng, công bằng — gợi âm): LỜI NÓI CÔNG BẰNG = bình phẩm → 評価, 評判. 平 đọc ヘイ, 評 đọc ヒョウ.',
    tu: [
      { w: '{評価|ひょうか}', ro: 'hyouka', vi: 'đánh giá' },
      { w: '{評判|ひょうばん}', ro: 'hyouban', vi: 'tiếng tăm, lời đồn (N3)' },
      { w: '{好評|こうひょう}', ro: 'kouhyou', vi: 'được khen, đón nhận tốt' },
      { w: '{批評|ひひょう}', ro: 'hihyou', vi: 'phê bình (N1)' },
    ],
  },
  '締': {
    hv: 'ĐẾ', nghia: 'thắt, buộc chặt; khép lại', en: 'tighten / conclude',
    on: ['テイ'], kun: ['し・める', 'し・まる'],
    nho: 'Bên trái 糸 (sợi dây), bên phải 帝 (vua — gợi âm テイ): LẤY DÂY BUỘC CHẶT = thắt → 締める; "khép lại" việc nhận → 締め切り. Ba chữ đọc しめる: 締める (thắt) · 閉める (đóng cửa) · 絞める (siết).',
    tu: [
      { w: '{締|し}め{切|き}り', ro: 'shimekiri', vi: 'hạn chót (Bài 26)' },
      { w: '{締|し}める', ro: 'shimeru', vi: 'thắt, siết (cà vạt, dây an toàn)' },
      { w: '{戸締|とじ}まり', ro: 'tojimari', vi: 'khoá cửa nẻo (Bài 34)' },
      { w: '{締結|ていけつ}', ro: 'teiketsu', vi: 'ký kết (N1)' },
    ],
  },
  '悔': {
    hv: 'HỐI', nghia: 'hối hận', en: 'regret / repent',
    on: ['カイ'], kun: ['く・やむ', 'く・やしい', 'く・いる'],
    nho: 'Bên trái 忄 (lòng), bên phải 毎 (mỗi — gợi âm カイ): MỖI LẦN NGHĨ LẠI LÒNG LẠI ĐAU = hối → 後悔, 悔しい. Cùng 毎 với 海 (氵 — cũng đọc カイ) và 梅 (木).',
    tu: [
      { w: '{後悔|こうかい}', ro: 'koukai', vi: 'hối hận (Bài 34)' },
      { w: '{悔|くや}しい', ro: 'kuyashii', vi: 'cay cú, tức (Bài 22)' },
      { w: '{悔|く}やむ', ro: 'kuyamu', vi: 'hối tiếc (N1)' },
    ],
  },
  '余': {
    hv: 'DƯ', nghia: 'dư, thừa', en: 'surplus / excess',
    on: ['ヨ'], kun: ['あま・る', 'あま・す'],
    nho: 'Mái nhà 𠆢 trên cây cột (木 biến dạng): CĂN NHÀ TẠM, CÒN CHỖ TRỐNG = dư → 余裕, 余計, 余る. Nằm trong 除 (阝), 徐 (彳), 途 (辶).',
    tu: [
      { w: '{余裕|よゆう}', ro: 'yoyuu', vi: 'dư dả, thong thả (Bài 34)' },
      { w: '{余計|よけい}', ro: 'yokei', vi: 'thừa, không cần thiết' },
      { w: '{余|あま}る', ro: 'amaru', vi: 'thừa ra' },
      { w: '{余分|よぶん}', ro: 'yobun', vi: 'phần dư' },
    ],
  },
  '叱': {
    hv: 'SẤT', nghia: 'mắng', en: 'scold',
    on: ['シツ'], kun: ['しか・る'],
    nho: 'Bên trái 口 (miệng), bên phải 七 (gợi âm シツ): MỞ MIỆNG QUÁT = mắng → 叱る. Bảng thường dụng 2010 in dạng 𠮟 (phần phải giống ヒ); sách báo và máy tính hay dùng 叱 — là một chữ.',
    tu: [
      { w: '{叱|しか}る', ro: 'shikaru', vi: 'mắng (để dạy — Bài 32)' },
      { w: '{叱|しか}られる', ro: 'shikarareru', vi: 'bị mắng' },
      { w: '{叱責|しっせき}', ro: 'shisseki', vi: 'khiển trách (N1)' },
    ],
  },
  '褒': {
    hv: 'BAO', nghia: 'khen', en: 'praise',
    on: ['ホウ'], kun: ['ほ・める'],
    nho: 'Chữ 衣 (cái áo) tách làm hai — 亠 ở trên, phần dưới ở dưới — kẹp 保 (giữ — gợi âm ホウ) vào giữa: BAN ÁO CHO NGƯỜI CÓ CÔNG = khen → 褒める, 褒美.',
    tu: [
      { w: '{褒|ほ}める', ro: 'homeru', vi: 'khen (Bài 22)' },
      { w: '{褒|ほ}められる', ro: 'homerareru', vi: 'được khen' },
      { w: '{褒美|ほうび}', ro: 'houbi', vi: 'phần thưởng (N1)' },
    ],
  },
};
