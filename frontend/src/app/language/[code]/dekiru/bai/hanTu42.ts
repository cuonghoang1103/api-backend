/**
 * Chữ Hán MỚI của Bài 42 (社会問題 — tiếp sau sách, cấp N2) cho thẻ chữ Hán — cùng định dạng hanTu.ts.
 * 24 chữ: 福 祉 護 療 労 層 拡 援 障 籍 削 染 炭 酸 廃 児 童 偏 処 況 域 施 設 婦 (N2 là chính theo các bảng tham khảo phổ biến;
 * 労・福・婦・設・域 nhiều bảng xếp N3; 祉 có bảng xếp N1 nhưng 福祉 là từ N2 rất hay gặp — JLPT không công bố danh sách chữ chính
 * thức) — bảng `b42-han-tu` trong bai42.ts. Không trùng hanTu.ts, hanTu16–41.ts, hanTuTiep.ts, hanLop.ts (kiểm 09/11: Bài 39 =
 * 聴 符 往 換 駐 輪 渋 滞 税 替 領 振 算 症 傷 希 補 却 訂 催 請 · Bài 41 = 就 採 志 履 企 契 析 項 挑 魅 秀 柄 極 抱 薦 雇 弊 攻 型 厚 遇 貢 献 獲).
 * Cách nhớ: theo cấu tạo chữ (phần chỉ nghĩa + phần gợi âm của chữ hình thanh ghi rõ). Từ đi chung ưu tiên từ dùng trong
 * bai42.ts và từ đã học ở bài trước (状況・地域 Bài 27, 苦労 Bài 28, 偏る・看護師 Bài 29, 実施 Bài 33, 国籍 Bài 36, 支援・故障 Bài 38).
 * On / Kun theo bảng thường dụng (常用): 福 祉 護 療 労 層 拡 援 籍 処 況 域 婦 chỉ có âm On; 児 có hai On ジ・ニ (ニ trong 小児科);
 * 施 có On シ・セ (セ hiếm — 布施); 染 có Kun そ・める／そ・まる／し・みる／し・み; 廃 có Kun すた・れる／すた・る (ít dùng).
 * Tệp chỉ có `import type` — tải chậm như hanTu.ts.
 */
import type { HanTu } from '@/components/sach-hoc/kanji';

export const HAN_TU_42: Record<string, HanTu> = {
  '福': {
    hv: 'PHÚC', nghia: 'phúc, điều may mắn', en: 'fortune / blessing',
    on: ['フク'], kun: [],
    nho: 'Bên trái 礻 (bộ Kỳ — bàn thờ, thần linh), bên phải 畐 (cái bình đầy rượu, gợi âm フク): DÂNG BÌNH ĐẦY lên thần thì được ban PHÚC. Cùng 畐 với 副 (ふく — phó: + 刂 dao) và 幅 (はば — bề rộng: + 巾 vải) — ba chữ đều đọc フク／はば, phân biệt bằng bộ bên trái.',
    tu: [
      { w: '{福祉|ふくし}', ro: 'fukushi', vi: 'phúc lợi xã hội (N2)' },
      { w: '{幸福|こうふく}', ro: 'koufuku', vi: 'hạnh phúc (N2)' },
      { w: '{福袋|ふくぶくろ}', ro: 'fukubukuro', vi: 'túi may mắn bán đầu năm' },
      { w: '{福岡|ふくおか}', ro: 'Fukuoka', vi: 'tỉnh / thành phố Fukuoka' },
    ],
  },
  '祉': {
    hv: 'CHỈ', nghia: 'phúc lành (chỉ còn trong 福祉)', en: 'welfare / blessing',
    on: ['シ'], kun: [],
    nho: 'Bên trái 礻 (thần linh), bên phải 止 (dừng lại, gợi âm シ): PHÚC THẦN BAN DỪNG LẠI ở nhà mình = phúc lành. Hầu như chỉ gặp trong 福祉 — nhớ cả cặp: hai chữ đều có 礻 ("phúc lợi do trời ban"). Cùng 礻 với 社 (しゃ) và 祝 (いわう — Bài 36).',
    tu: [
      { w: '{福祉|ふくし}', ro: 'fukushi', vi: 'phúc lợi xã hội' },
      { w: '{社会福祉|しゃかいふくし}', ro: 'shakai fukushi', vi: 'phúc lợi xã hội (nói đầy đủ)' },
      { w: '{福祉施設|ふくししせつ}', ro: 'fukushi shisetsu', vi: 'cơ sở phúc lợi' },
    ],
  },
  '護': {
    hv: 'HỘ', nghia: 'bảo vệ, che chở', en: 'protect / guard',
    on: ['ゴ'], kun: [],
    nho: 'Bên trái 言 (lời nói), bên phải 蒦 (bàn tay 又 nắm chặt con chim 隹 dưới cỏ 艹 — "giữ chặt"): DÙNG LỜI mà che chở, GIỮ người khác = HỘ → 介護, 保護, 弁護士. Cùng phần 蒦 với 獲 (かく — bắt được: 犭) và 穫 (収穫 — thu hoạch: 禾).',
    tu: [
      { w: '{介護|かいご}', ro: 'kaigo', vi: 'chăm sóc người già, người khuyết tật (N2)' },
      { w: '{保護|ほご}', ro: 'hogo', vi: 'bảo hộ, bảo vệ (N2)' },
      { w: '{看護師|かんごし}', ro: 'kangoshi', vi: 'y tá (Bài 29)' },
      { w: '{弁護士|べんごし}', ro: 'bengoshi', vi: 'luật sư (N2)' },
    ],
  },
  '療': {
    hv: 'LIỆU', nghia: 'chữa bệnh', en: 'heal / cure',
    on: ['リョウ'], kun: [],
    nho: 'Bộ 疒 (bộ Nạch — người nằm trên giường bệnh) bọc 尞 (gợi âm リョウ — đuốc sáng): CHỮA BỆNH = LIỆU → 医療, 治療. ⚠ 寮 (りょう — ký túc xá) = 宀 (mái nhà) + 尞: cùng âm リョウ, khác phần trên — bệnh thì 疒, chỗ ở thì 宀. Cũng khác 僚 (đồng liêu — 亻 + 尞, Bài 35).',
    tu: [
      { w: '{医療|いりょう}', ro: 'iryou', vi: 'y tế (N2)' },
      { w: '{治療|ちりょう}', ro: 'chiryou', vi: 'điều trị (N2)' },
      { w: '{医療費|いりょうひ}', ro: 'iryouhi', vi: 'chi phí y tế' },
      { w: '{療養|りょうよう}', ro: 'ryouyou', vi: 'dưỡng bệnh (N1)' },
    ],
  },
  '労': {
    hv: 'LAO', nghia: 'lao động; vất vả', en: 'labor / toil',
    on: ['ロウ'], kun: [],
    nho: 'Trên là ⺍ (ánh lửa) + 冖 (mái che), dưới là 力 (sức): DƯỚI ÁNH ĐÈN ĐÊM VẪN DỒN SỨC LÀM = LAO (vất vả, lao động). Cùng phần đầu ⺍冖 với 栄 (さかえる), 営 (いとなむ — Bài 38) và 学 (học).',
    tu: [
      { w: '{労働|ろうどう}', ro: 'roudou', vi: 'lao động (N2)' },
      { w: '{労働者|ろうどうしゃ}', ro: 'roudousha', vi: 'người lao động' },
      { w: '{苦労|くろう}', ro: 'kurou', vi: 'vất vả, khó nhọc (Bài 28)' },
      { w: '{疲労|ひろう}', ro: 'hirou', vi: 'mệt mỏi tích tụ (N2)' },
      { w: '{過労|かろう}', ro: 'karou', vi: 'làm việc quá sức' },
    ],
  },
  '層': {
    hv: 'TẦNG', nghia: 'tầng, lớp', en: 'layer / stratum',
    on: ['ソウ'], kun: [],
    nho: 'Bộ 尸 (mái nhà / thân người) phủ trên 曽 (gợi âm ソウ — "chồng lên"): NHÀ NHIỀU TẦNG CHỒNG LÊN NHAU = TẦNG → 高層ビル; nghĩa bóng: TẦNG LỚP người → 若年層, 高齢層, 貧困層. ⚠ 増 (ぞう — tăng) = 土 + 曽: cùng 曽, khác bộ.',
    tu: [
      { w: '{若年層|じゃくねんそう}', ro: 'jakunensou', vi: 'tầng lớp trẻ' },
      { w: '{高齢層|こうれいそう}', ro: 'koureisou', vi: 'tầng lớp cao tuổi' },
      { w: '{貧困層|ひんこんそう}', ro: 'hinkonsou', vi: 'tầng lớp nghèo' },
      { w: '{高層|こうそう}ビル', ro: 'kousou biru', vi: 'nhà cao tầng (N2)' },
    ],
  },
  '拡': {
    hv: 'KHUẾCH', nghia: 'mở rộng', en: 'expand / enlarge',
    on: ['カク'], kun: [],
    nho: 'Bên trái 扌 (tay), bên phải 広 (rộng — Bài 32): DÙNG TAY LÀM CHO RỘNG RA = KHUẾCH → 拡大 (mở rộng, phóng to). Nhớ cặp "広い (rộng) → 拡大 (làm rộng ra)".',
    tu: [
      { w: '{拡大|かくだい}', ro: 'kakudai', vi: 'mở rộng, lan rộng, phóng to (N2)' },
      { w: '{拡張|かくちょう}', ro: 'kakuchou', vi: 'mở rộng (đường, chức năng — N1)' },
      { w: '{拡散|かくさん}', ro: 'kakusan', vi: 'lan truyền (trên mạng — N1)' },
    ],
  },
  '援': {
    hv: 'VIỆN', nghia: 'giúp đỡ, tiếp sức', en: 'help / aid',
    on: ['エン'], kun: [],
    nho: 'Bên trái 扌 (tay), bên phải 爰 (hai bàn tay kéo nhau qua một sợi dây): CHÌA TAY KÉO NGƯỜI KHÁC LÊN = VIỆN (giúp) → 支援, 応援, 援助. Cùng 爰 với 暖 (あたたかい — 日) và 緩 (ゆるい — 糸).',
    tu: [
      { w: '{支援|しえん}', ro: 'shien', vi: 'hỗ trợ (Bài 38)' },
      { w: '{応援|おうえん}', ro: 'ouen', vi: 'cổ vũ, ủng hộ (N3)' },
      { w: '{援助|えんじょ}', ro: 'enjo', vi: 'viện trợ (N2)' },
    ],
  },
  '障': {
    hv: 'CHƯỚNG', nghia: 'cản trở, ngăn chặn', en: 'hinder / obstacle',
    on: ['ショウ'], kun: ['さわ・る'],
    nho: 'Bên trái 阝 (gò đất, bức tường), bên phải 章 (gợi âm ショウ): BỨC TƯỜNG ĐẤT CHẮN NGANG = CHƯỚNG (cản trở) → 障害, 故障, 支障. 保障 = "bảo vệ khỏi trở ngại" (社会保障). Kun さわる (gây hại) ít dùng — gặp trong 差し障り.',
    tu: [
      { w: '{障害|しょうがい}', ro: 'shougai', vi: 'khuyết tật; trở ngại, sự cố (N2)' },
      { w: '{故障|こしょう}', ro: 'koshou', vi: 'hỏng hóc (Bài 38)' },
      { w: '{社会保障|しゃかいほしょう}', ro: 'shakai hoshou', vi: 'an sinh xã hội' },
      { w: '{支障|ししょう}', ro: 'shishou', vi: 'trở ngại (N1)' },
    ],
  },
  '籍': {
    hv: 'TỊCH', nghia: 'sổ hộ tịch, danh sách', en: 'register / enrollment',
    on: ['セキ'], kun: [],
    nho: 'Trên là ⺮ (thẻ tre — xưa dùng ghi chép), dưới là 耒 (cái cày) + 昔 (gợi âm セキ): THẺ TRE GHI TÊN NGƯỜI CÀY RUỘNG (sổ đinh) = TỊCH → 国籍, 戸籍, 書籍 (sách — thẻ tre có chữ). Cùng 昔 với 借 (かりる — 亻) và 錯.',
    tu: [
      { w: '{国籍|こくせき}', ro: 'kokuseki', vi: 'quốc tịch (Bài 36)' },
      { w: '{戸籍|こせき}', ro: 'koseki', vi: 'hộ tịch (N1)' },
      { w: '{書籍|しょせき}', ro: 'shoseki', vi: 'sách, ấn phẩm (N1)' },
      { w: '{在籍|ざいせき}', ro: 'zaiseki', vi: 'có tên trong danh sách (đang học, đang làm — N1)' },
    ],
  },
  '削': {
    hv: 'TƯỚC', nghia: 'gọt, cắt bớt', en: 'shave / cut down',
    on: ['サク'], kun: ['けず・る'],
    nho: 'Bên trái 肖 (nhỏ dần — gợi âm), bên phải 刂 (con dao): DÙNG DAO GỌT CHO NHỎ DẦN = TƯỚC → 削る (gọt bút chì), 削減 (cắt giảm), 削除 (xoá). ⚠ 消 (けす — tắt, xoá) = 氵 + 肖: cùng 肖, nước thì "tắt", dao thì "gọt".',
    tu: [
      { w: '{削減|さくげん}', ro: 'sakugen', vi: 'cắt giảm (N2)' },
      { w: '{削除|さくじょ}', ro: 'sakujo', vi: 'xoá (dữ liệu — N2)' },
      { w: '{削|けず}る', ro: 'kezuru', vi: 'gọt, cắt bớt (N2)' },
    ],
  },
  '染': {
    hv: 'NHIỄM', nghia: 'nhuộm; thấm; lây nhiễm', en: 'dye / stain / infect',
    on: ['セン'], kun: ['そ・める', 'そ・まる', 'し・みる', 'し・み'],
    nho: 'Bên trái 氵 (nước) + 九 (chín — nhiều lần), dưới là 木 (cây): NHÚNG VÀO NƯỚC NHUỘM LẤY TỪ CÂY NHIỀU LẦN = NHUỘM → 染める. Màu "ngấm vào" → 汚染 (bị nhuộm bẩn = ô nhiễm), 感染 (bệnh ngấm vào = lây nhiễm). ⚠ Hai âm Kun: そめる (nhuộm) / しみる (thấm, ngấm).',
    tu: [
      { w: '{汚染|おせん}', ro: 'osen', vi: 'ô nhiễm (N2)' },
      { w: '{感染|かんせん}', ro: 'kansen', vi: 'lây nhiễm (N2)' },
      { w: '{染|そ}める', ro: 'someru', vi: 'nhuộm (N2)' },
      { w: '{染|し}み', ro: 'shimi', vi: 'vết bẩn, vết ố' },
    ],
  },
  '炭': {
    hv: 'THÁN', nghia: 'than', en: 'charcoal / coal',
    on: ['タン'], kun: ['すみ'],
    nho: 'Trên là 山 (núi), dưới là 灰 (tro — lửa 火 dưới mái đá 厂): THỨ ĐEN CHÁY THÀNH TRO LẤY TỪ NÚI = THAN → 石炭 (than đá), 炭 (than củi); trong hoá học là cacbon: 炭素, 二酸化炭素 (CO₂). ⚠ 灰 (はい — tro) chính là phần dưới của 炭.',
    tu: [
      { w: '{二酸化炭素|にさんかたんそ}', ro: 'nisanka tanso', vi: 'khí CO₂ (N2)' },
      { w: '{炭素|たんそ}', ro: 'tanso', vi: 'cacbon' },
      { w: '{石炭|せきたん}', ro: 'sekitan', vi: 'than đá (N2)' },
      { w: '{炭|すみ}', ro: 'sumi', vi: 'than củi' },
    ],
  },
  '酸': {
    hv: 'TOAN', nghia: 'chua; axit', en: 'sour / acid',
    on: ['サン'], kun: ['す・い'],
    nho: 'Bên trái 酉 (vò rượu), bên phải 夋 (gợi âm サン): RƯỢU ĐỂ LÂU THÌ HOÁ CHUA = TOAN → 酸っぱい (chua), 酸性 (tính axit); trong hoá học: 酸素 (oxy — "nguyên tố gốc của axit"), 二酸化炭素. Cùng 酉 với 酒 (さけ), 酢 (す — giấm), 配 (くばる).',
    tu: [
      { w: '{酸素|さんそ}', ro: 'sanso', vi: 'oxy (N2)' },
      { w: '{二酸化炭素|にさんかたんそ}', ro: 'nisanka tanso', vi: 'khí CO₂' },
      { w: '{酸|す}っぱい', ro: 'suppai', vi: 'chua (N3)' },
      { w: '{酸性|さんせい}', ro: 'sansei', vi: 'tính axit' },
    ],
  },
  '廃': {
    hv: 'PHẾ', nghia: 'bỏ đi, phế bỏ', en: 'abolish / discard',
    on: ['ハイ'], kun: ['すた・れる', 'すた・る'],
    nho: 'Bộ 广 (mái nhà mở một bên) phủ trên 発 (gợi âm ハイ／ハツ): NGÔI NHÀ BỊ BỎ ĐI, hoang phế = PHẾ → 廃棄 (vứt bỏ), 廃止 (bãi bỏ), 廃線 (tuyến tàu bị bỏ). Kun すたれる (lỗi thời) ít dùng.',
    tu: [
      { w: '{廃棄|はいき}', ro: 'haiki', vi: 'vứt bỏ, huỷ (N1)' },
      { w: '{廃止|はいし}', ro: 'haishi', vi: 'bãi bỏ (N2)' },
      { w: '{廃棄物|はいきぶつ}', ro: 'haikibutsu', vi: 'chất thải' },
      { w: '{廃線|はいせん}', ro: 'haisen', vi: 'tuyến tàu bị bỏ' },
    ],
  },
  '児': {
    hv: 'NHI', nghia: 'trẻ nhỏ', en: 'child / infant',
    on: ['ジ', 'ニ'], kun: [],
    nho: 'Phần trên vẽ cái ĐẦU EM BÉ còn thóp chưa liền (dạng cổ là 臼 — ở chữ mới giản lược), dưới là 儿 (hai chân người): ĐỨA TRẺ ĐẦU CÒN MỀM = NHI → 育児, 児童, 幼児. ⚠ Âm thứ hai ニ chỉ gặp trong vài từ: 小児科 (しょうにか — khoa nhi).',
    tu: [
      { w: '{育児|いくじ}', ro: 'ikuji', vi: 'nuôi con nhỏ (N2)' },
      { w: '{児童|じどう}', ro: 'jidou', vi: 'trẻ em (tiểu học — N2)' },
      { w: '{幼児|ようじ}', ro: 'youji', vi: 'trẻ nhỏ (N2)' },
      { w: '{小児科|しょうにか}', ro: 'shounika', vi: 'khoa nhi (N2)' },
    ],
  },
  '童': {
    hv: 'ĐỒNG', nghia: 'trẻ em', en: 'child',
    on: ['ドウ'], kun: ['わらべ'],
    nho: 'Trên là 立 (đứng), dưới là 里 (làng, gợi âm): ĐỨA TRẺ ĐỨNG CHƠI TRONG LÀNG = ĐỒNG (trẻ con) → 児童, 童話 (truyện cổ tích), 童謡 (đồng dao). Kun わらべ là từ cổ — gần như chỉ gặp trong thơ, bài hát.',
    tu: [
      { w: '{児童|じどう}', ro: 'jidou', vi: 'trẻ em (tiểu học)' },
      { w: '{待機児童|たいきじどう}', ro: 'taiki jidou', vi: 'trẻ chờ chỗ nhà trẻ' },
      { w: '{童話|どうわ}', ro: 'douwa', vi: 'truyện cổ tích (N2)' },
      { w: '{童謡|どうよう}', ro: 'douyou', vi: 'đồng dao' },
    ],
  },
  '偏': {
    hv: 'THIÊN', nghia: 'lệch, nghiêng về một bên', en: 'biased / one-sided',
    on: ['ヘン'], kun: ['かたよ・る'],
    nho: 'Bên trái 亻 (người), bên phải 扁 (tấm biển mỏng treo lệch một bên, gợi âm ヘン): NGƯỜI CHỈ NHÌN MỘT PHÍA = THIÊN → 偏る (lệch — Bài 29), 偏見 (thiên kiến = định kiến). Cùng 扁 và cùng âm ヘン với 編 (へん — biên tập: 糸 sợi) và 遍.',
    tu: [
      { w: '{偏見|へんけん}', ro: 'henken', vi: 'định kiến (N2)' },
      { w: '{偏|かたよ}る', ro: 'katayoru', vi: 'lệch, thiên về (Bài 29)' },
      { w: '{偏差値|へんさち}', ro: 'hensachi', vi: 'chỉ số độ lệch (dùng để xếp hạng trường)' },
    ],
  },
  '処': {
    hv: 'XỬ', nghia: 'xử lý, xử trí; chốn', en: 'deal with / place',
    on: ['ショ'], kun: [],
    nho: 'Bên trái 夂 (bước chân đi chậm), bên phải 几 (cái ghế): ĐI ĐẾN CHỖ CÁI GHẾ THÌ NGỒI XUỐNG → "chốn, chỗ" → đặt việc vào đúng chỗ = XỬ (xử lý) → 対処, 処理, 処分. ⚠ 拠 (きょ — 根拠 Bài 28) = 扌 + 処.',
    tu: [
      { w: '{対処|たいしょ}', ro: 'taisho', vi: 'xử trí, đối phó (N2)' },
      { w: '{処理|しょり}', ro: 'shori', vi: 'xử lý (N2)' },
      { w: '{処分|しょぶん}', ro: 'shobun', vi: 'xử lý, vứt bỏ; kỷ luật (N2)' },
      { w: '{処方|しょほう}', ro: 'shohou', vi: 'kê đơn thuốc' },
    ],
  },
  '況': {
    hv: 'HUỐNG', nghia: 'tình hình, tình trạng', en: 'situation / condition',
    on: ['キョウ'], kun: [],
    nho: 'Bên trái 氵 (nước), bên phải 兄 (gợi âm キョウ): DÒNG NƯỚC LỚN DẦN → diễn biến, TÌNH HÌNH = HUỐNG → 状況 (Bài 27), 不況 (suy thoái kinh tế). ⚠ 祝 (いわう — Bài 36) = 礻 + 兄: cùng 兄, khác bộ trái.',
    tu: [
      { w: '{状況|じょうきょう}', ro: 'joukyou', vi: 'tình hình (Bài 27)' },
      { w: '{不況|ふきょう}', ro: 'fukyou', vi: 'suy thoái kinh tế (N2)' },
      { w: '{近況|きんきょう}', ro: 'kinkyou', vi: 'tình hình gần đây (N1)' },
    ],
  },
  '域': {
    hv: 'VỰC', nghia: 'khu vực, vùng', en: 'region / area',
    on: ['イキ'], kun: [],
    nho: 'Bên trái 土 (đất), bên phải 或 (người cầm giáo 戈 canh giữ một vùng 口 có ranh giới — gợi âm イキ): VÙNG ĐẤT CÓ RANH GIỚI = VỰC → 地域 (Bài 27), 区域, 領域. ⚠ 惑 (わく — 迷惑) = 或 + 心: cùng 或, tim ở dưới.',
    tu: [
      { w: '{地域|ちいき}', ro: 'chiiki', vi: 'khu vực (Bài 27)' },
      { w: '{区域|くいき}', ro: 'kuiki', vi: 'khu vực (đã khoanh — N2)' },
      { w: '{領域|りょういき}', ro: 'ryouiki', vi: 'lĩnh vực, lãnh thổ (N1)' },
      { w: '{流域|りゅういき}', ro: 'ryuuiki', vi: 'lưu vực sông' },
    ],
  },
  '施': {
    hv: 'THI', nghia: 'thi hành; ban phát', en: 'carry out / bestow',
    on: ['シ', 'セ'], kun: ['ほどこ・す'],
    nho: 'Bên trái 方 + 𠂉 (cán cờ và lá cờ bay), bên phải 也 (gợi âm): LÁ CỜ PHẤP PHỚI LAN RA → ban phát, đưa vào thực hiện = THI → 実施 (Bài 33), 施設 (cơ sở — "nơi đặt ra để thi hành"). ⚠ 旅 (たび — du lịch) cùng phần lá cờ 方 + 𠂉.',
    tu: [
      { w: '{施設|しせつ}', ro: 'shisetsu', vi: 'cơ sở, công trình (N2)' },
      { w: '{実施|じっし}', ro: 'jisshi', vi: 'thực hiện, tổ chức (Bài 33)' },
      { w: '{介護施設|かいごしせつ}', ro: 'kaigo shisetsu', vi: 'viện dưỡng lão' },
      { w: '{施|ほどこ}す', ro: 'hodokosu', vi: 'ban, áp dụng (N1)' },
    ],
  },
  '設': {
    hv: 'THIẾT', nghia: 'đặt ra, thiết lập', en: 'establish / set up',
    on: ['セツ'], kun: ['もう・ける'],
    nho: 'Bên trái 言 (lời nói), bên phải 殳 (bàn tay cầm công cụ): RA LỆNH cho người cầm công cụ DỰNG LÊN = THIẾT (thiết lập) → 設備, 設定 (cài đặt), 設計, 施設. ⚠ 役 (やく — vai trò) = 彳 + 殳: cùng 殳, khác bộ trái. Âm セツ → せっ trước け／て: 設計 (せっけい), 設定 (せってい).',
    tu: [
      { w: '{施設|しせつ}', ro: 'shisetsu', vi: 'cơ sở, công trình' },
      { w: '{設備|せつび}', ro: 'setsubi', vi: 'thiết bị (N2)' },
      { w: '{設定|せってい}', ro: 'settei', vi: 'cài đặt, thiết lập (N2)' },
      { w: '{設計|せっけい}', ro: 'sekkei', vi: 'thiết kế (N2)' },
      { w: '{設|もう}ける', ro: 'moukeru', vi: 'thiết lập, đặt ra (N1)' },
    ],
  },
  '婦': {
    hv: 'PHỤ', nghia: 'người phụ nữ (có chồng), người vợ', en: 'woman / wife',
    on: ['フ'], kun: [],
    nho: 'Bên trái 女 (người nữ), bên phải 帚 (cái chổi): NGƯỜI PHỤ NỮ CẦM CHỔI lo việc nhà (cách nhìn thời xưa) = PHỤ → 主婦, 夫婦, 婦人. ⚠ 帰 (かえる — về) cũng có 帚 nhưng bên trái là リ; 掃 (はく — quét) = 扌 + 帚.',
    tu: [
      { w: '{夫婦|ふうふ}', ro: 'fuufu', vi: 'vợ chồng (N3)' },
      { w: '{主婦|しゅふ}', ro: 'shufu', vi: 'nội trợ (N3)' },
      { w: '{専業主婦|せんぎょうしゅふ}', ro: 'sengyou shufu', vi: 'bà nội trợ toàn thời gian' },
      { w: '{婦人|ふじん}', ro: 'fujin', vi: 'phu nhân, phụ nữ (N2)' },
    ],
  },
};
