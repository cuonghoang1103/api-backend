/**
 * Chữ Hán MỚI của Bài 53 (ビジネスメール — Email công việc · tiếp sau sách, cấp N2) cho thẻ chữ Hán — cùng định dạng hanTu.ts.
 * 24 chữ: 啓 謹 諾 賜 詫 陳 迅 戴 甚 拙 宜 閲 寛 捗 殿 煩 懇 控 仰 氏 裁 赦 憾 賀 — bảng `b53-han-tu` trong bai53.ts.
 * Không trùng hanTu.ts, hanTu16–52.ts, hanLop.ts và các bảng chữ Hán Bài 1–52 (kiểm bằng script 09/11/2026: 1.242 chữ đã dạy —
 * Bài 50 = 顕 照 双 圧 概 純 矛 盾 裏 狭 豪 華 硬 軟 敏 繊 皮 恵 乏 裕 虚 凡 群 偉 · Bài 51 = 陶 彫 鑑 奏 鼓 拍 踊 丸 輝 彩 宝 魂 底 殊 是 非 超 愛
 * 孝 犠 牲 叫 祈 稼 繰 (非 thay 涯 — 涯 KHÔNG dạy) · Bài 52 = 序 章 構 執 旨 範 括 欄 箇 冒 尾 典 唆 視 堅 潔 該 遍 唱 模 盤 版 倫 刊 (底・是 thuộc Bài 51) — Bài 51/52 soạn song song, đã grep
 * lại trước khi chốt). Phần lớn chữ "email" quen thuộc đã dạy ở Bài 24–45 (件 宛 添 拝 承 御 貴 弊 恐 縮 伺 敬 依 頼 致 督 促 署 稿 誠 慮 謙 譲…)
 * ⇒ bài này dạy những chữ còn lại của câu khuôn email: 拝啓・謹んで・承諾・賜る・お詫び・陳謝・迅速・頂戴・幸甚・拙い・適宜・閲覧・寛大・
 * 進捗・殿・煩わせる・懇親会・差し控える・仰ぐ・氏名・決裁・容赦・遺憾・謹賀新年.
 * Cấp chữ theo các bảng tham khảo phổ biến (JLPT không công bố danh sách chữ chính thức): 氏 殿 控 仰 裁 賀 寛 nhiều bảng xếp N2;
 * 啓 謹 諾 賜 陳 迅 甚 拙 宜 閲 煩 懇 phần lớn bảng xếp N1; 詫 捗 戴 赦 憾 N1 (詫 捗 vào bảng thường dụng năm 2010) — nhưng TỪ chứa chúng
 * (お詫び・進捗・頂戴・容赦・遺憾・迅速・承諾・閲覧) là từ email công việc gặp hằng ngày.
 * On / Kun theo bảng thường dụng (常用): 捗 trong bảng chỉ có On チョク (はかどる viết 捗る là cách viết ngoài bảng — hay viết かな);
 * 宜 chỉ có On ギ (よろしく viết 宜しく là ngoài bảng); 仰 có Kun あお・ぐ／おお・せ (おっしゃる viết 仰る là ngoài bảng); 詫 có On タ
 * + Kun わ・びる; 煩 có On ハン・ボン + Kun わずら・う／わずら・わす; 殿 có On デン・テン + Kun との・どの; 甚 có On ジン + Kun
 * はなは・だ／はなは・だしい; 拙 có On セツ + Kun つたな・い; 謹 có On キン + Kun つつし・む; 賜 có On シ + Kun たまわ・る.
 * ⚠ Hán Việt của 捗 ghi TRẮC theo các từ điển Nhật–Việt phổ biến (進捗 = TIẾN TRẮC) — người điều phối kiểm lại.
 * Cách nhớ: theo cấu tạo chữ (phần chỉ nghĩa + phần gợi âm của chữ hình thanh ghi rõ). Tệp chỉ có `import type` — tải chậm như hanTu.ts.
 */
import type { HanTu } from '@/components/sach-hoc/kanji';

export const HAN_TU_53: Record<string, HanTu> = {
  '啓': {
    hv: 'KHẢI', nghia: 'mở ra; thưa, trình (mở đầu thư)', en: 'open / say (formal)',
    on: ['ケイ'], kun: [],
    nho: 'Trên là 戸 (cánh cửa) + 攵 (bàn tay cầm que — hành động), dưới là 口 (cái miệng): ĐẨY CỬA RA, MỞ MIỆNG THƯA = KHẢI (khai mở, thưa trình). 拝啓 = "cúi lạy (拝) mà thưa (啓)" — câu mở đầu thư tay trang trọng, đi cặp với 敬具 ở cuối. 啓発 = mở mang hiểu biết.',
    tu: [
      { w: '{拝啓|はいけい}', ro: 'haikei', vi: 'kính gửi (câu mở đầu thư trang trọng — Bài 53)' },
      { w: '{謹啓|きんけい}', ro: 'kinkei', vi: 'kính gửi (trang trọng hơn 拝啓)' },
      { w: '{啓発|けいはつ}', ro: 'keihatsu', vi: 'khai sáng, nâng cao nhận thức' },
    ],
  },
  '謹': {
    hv: 'CẨN', nghia: 'cẩn trọng, kính cẩn', en: 'respectful / humble',
    on: ['キン'], kun: ['つつし・む'],
    nho: 'Trái là 言 (lời nói), phải là 堇 (đất sét, gợi âm キン — giống 勤 キン): LỜI NÓI DÈ DẶT, KÍNH CẨN = CẨN. 謹んで = "kính cẩn mà…" (謹んでお詫び申し上げます). ⚠ 勤 (つとめる) cùng phần 堇 nhưng bên phải là 力; 謹 có 言 bên trái.',
    tu: [
      { w: '{謹|つつし}んで', ro: 'tsutsushinde', vi: 'kính cẩn, xin trân trọng (Bài 53)' },
      { w: '{謹賀新年|きんがしんねん}', ro: 'kinga shinnen', vi: 'cung chúc tân xuân (thiệp / email đầu năm)' },
      { w: '{謹啓|きんけい}', ro: 'kinkei', vi: 'kính gửi (mở thư rất trang trọng)' },
      { w: '{謹慎|きんしん}', ro: 'kinshin', vi: 'tự kiểm điểm, bị đình chỉ (N1)' },
    ],
  },
  '諾': {
    hv: 'NẶC', nghia: 'nhận lời, đồng ý', en: 'consent',
    on: ['ダク'], kun: [],
    nho: 'Trái là 言 (lời), phải là 若 (gợi âm ジャク → ダク): LỜI "VÂNG" = NẶC (nhận lời — như "nhất nặc thiên kim": một lời hứa đáng ngàn vàng). 承諾 = nhận (承) + vâng (諾); 快諾 = vui vẻ (快) nhận lời. ⚠ 若 (わかい) đứng một mình là "trẻ".',
    tu: [
      { w: '{承諾|しょうだく}', ro: 'shoudaku', vi: 'chấp thuận, đồng ý (Bài 53)' },
      { w: '{快諾|かいだく}', ro: 'kaidaku', vi: 'vui vẻ nhận lời (Bài 53)' },
      { w: '{受諾|じゅだく}', ro: 'judaku', vi: 'chấp nhận (đề nghị, điều kiện — N1)' },
    ],
  },
  '賜': {
    hv: 'TỨ', nghia: 'ban cho (người trên cho người dưới)', en: 'bestow',
    on: ['シ'], kun: ['たまわ・る'],
    nho: 'Trái là 貝 (vỏ sò — tiền, của cải), phải là 易 (đổi, trao): ĐEM CỦA QUÝ TRAO XUỐNG = TỨ (ban). 賜る = được (người trên) ban cho → trong email: ご高配を賜り (được quý vị quan tâm). 賜物 = thành quả, "quà" của (nỗ lực…). ⚠ 易 (やさしい／えき) đứng riêng là "dễ".',
    tu: [
      { w: '{賜|たまわ}る', ro: 'tamawaru', vi: 'được ban cho; (người trên) cho (Bài 53)' },
      { w: '{賜物|たまもの}', ro: 'tamamono', vi: 'thành quả, kết quả của (努力の賜物)' },
      { w: 'ご{高配|こうはい}を{賜|たまわ}る', ro: 'gokouhai o tamawaru', vi: 'được quý vị quan tâm chiếu cố' },
    ],
  },
  '詫': {
    hv: 'SÁ', nghia: 'xin lỗi', en: 'apologize',
    on: ['タ'], kun: ['わ・びる'],
    nho: 'Trái là 言 (lời nói), phải là 宅 (nhà, gợi âm タク → タ): LỜI NÓI MANG TỚI TẬN NHÀ để xin lỗi = SÁ (詫). お詫び = lời xin lỗi (Bài 37 — có furigana), nay học chữ. ⚠ 宅 (たく — お宅, 住宅) đứng riêng là "nhà".',
    tu: [
      { w: 'お{詫|わ}び', ro: 'owabi', vi: 'lời xin lỗi (Bài 37)' },
      { w: '{詫|わ}びる', ro: 'wabiru', vi: 'xin lỗi, tạ lỗi (văn viết)' },
      { w: 'お{詫|わ}び{申|もう}し{上|あ}げます', ro: 'owabi moushiagemasu', vi: 'xin thành thật xin lỗi' },
    ],
  },
  '陳': {
    hv: 'TRẦN', nghia: 'bày ra; trình bày; cũ', en: 'display / state',
    on: ['チン'], kun: [],
    nho: 'Trái là 阝 (gò đất, bậc), phải là 東 (bó hàng — hình cái túi buộc hai đầu): BÀY HÀNG LÊN BẬC = TRẦN (trần liệt — bày ra). Bày tỏ lời xin lỗi trước mặt mọi người = 陳謝 (xin lỗi chính thức). 新陳代謝 = "cái mới (新) thay cái cũ (陳)".',
    tu: [
      { w: '{陳謝|ちんしゃ}', ro: 'chinsha', vi: 'xin lỗi chính thức (Bài 53)' },
      { w: '{陳列|ちんれつ}', ro: 'chinretsu', vi: 'trưng bày (hàng hoá)' },
      { w: '{新陳代謝|しんちんたいしゃ}', ro: 'shinchin taisha', vi: 'trao đổi chất; cái mới thay cái cũ' },
    ],
  },
  '迅': {
    hv: 'TẤN', nghia: 'nhanh, mau lẹ', en: 'swift',
    on: ['ジン'], kun: [],
    nho: 'Bộ 辶 (bước đi) + 卂 (hình con chim bay vụt): ĐI NHANH NHƯ CHIM VỤT QUA = TẤN (tấn tốc). Gần như chỉ gặp trong 迅速 (nhanh chóng) — từ của email xin lỗi / cảm ơn: 迅速なご対応 (sự xử lý nhanh chóng của quý vị).',
    tu: [
      { w: '{迅速|じんそく}', ro: 'jinsoku', vi: 'nhanh chóng, mau lẹ (Bài 53)' },
      { w: '{迅速|じんそく}なご{対応|たいおう}', ro: 'jinsoku na gotaiou', vi: 'sự xử lý nhanh chóng (của quý vị)' },
    ],
  },
  '戴': {
    hv: 'ĐÁI', nghia: 'đội lên đầu; nhận (kính cẩn)', en: 'receive humbly',
    on: ['タイ'], kun: [],
    nho: 'Chữ nhiều nét: phần trên là 𢦏 (戈 cây kích + 十), phần dưới là 異 (người đội vật gì trên đầu): ĐỘI LÊN ĐẦU MÀ NHẬN = ĐÁI. 頂戴 = "đặt lên đỉnh đầu (頂) mà đội (戴)" → nhận một cách kính cẩn (khiêm nhường của もらう). Gần như chỉ gặp trong 頂戴.',
    tu: [
      { w: '{頂戴|ちょうだい}する', ro: 'choudai suru', vi: 'nhận (khiêm nhường của もらう — Bài 53)' },
      { w: 'ご{連絡|れんらく}を{頂戴|ちょうだい}する', ro: 'gorenraku o choudai suru', vi: 'nhận được liên lạc (của quý vị)' },
      { w: '{戴冠式|たいかんしき}', ro: 'taikanshiki', vi: 'lễ đăng quang (N1+)' },
    ],
  },
  '甚': {
    hv: 'THẬM', nghia: 'rất, quá mức', en: 'extremely',
    on: ['ジン'], kun: ['はなは・だ', 'はなは・だしい'],
    nho: 'Trên là 甘 (ngọt, ngon), dưới là 匹 (đôi, cặp): NGỌT QUÁ, VUI QUÁ ĐỖI = THẬM (thậm chí, thậm tệ). 甚だ = rất (văn viết, trang trọng — 甚だ恐縮ですが). 幸甚 = vô cùng may mắn (幸甚に存じます — cảm ơn rất trang trọng). 甚大 = cực lớn (thiệt hại).',
    tu: [
      { w: '{甚|はなは}だ', ro: 'hanahada', vi: 'rất, hết sức (văn viết — Bài 53)' },
      { w: '{幸甚|こうじん}', ro: 'koujin', vi: 'vô cùng may mắn, rất biết ơn (Bài 53)' },
      { w: '{甚大|じんだい}', ro: 'jindai', vi: 'cực lớn (thiệt hại)' },
    ],
  },
  '拙': {
    hv: 'CHUYẾT', nghia: 'vụng về', en: 'clumsy',
    on: ['セツ'], kun: ['つたな・い'],
    nho: 'Trái là 扌 (tay), phải là 出 (ra, gợi âm シュツ → セツ): TAY LÀM RA MÀ VỤNG = CHUYẾT. 拙い = vụng về, còn non (khiêm tốn về mình: 拙い日本語ですが). 稚拙 = non nớt vụng về. 拙速 = nhanh mà ẩu.',
    tu: [
      { w: '{拙|つたな}い', ro: 'tsutanai', vi: 'vụng về, non kém (khiêm tốn — Bài 53)' },
      { w: '{稚拙|ちせつ}', ro: 'chisetsu', vi: 'non nớt, vụng về (N1)' },
      { w: '{拙速|せっそく}', ro: 'sessoku', vi: 'nhanh mà ẩu (N1)' },
    ],
  },
  '宜': {
    hv: 'NGHI', nghia: 'thích hợp, nên', en: 'suitable',
    on: ['ギ'], kun: [],
    nho: 'Trên là 宀 (mái nhà), dưới là 且 (bàn thờ bày đồ cúng): ĐỒ CÚNG BÀY ĐÚNG CHỖ TRONG NHÀ = NGHI (thích nghi, hợp lẽ). 適宜 = "hợp (適) và nên (宜)" → tuỳ tình hình mà làm cho phù hợp. 便宜 = sự tiện lợi, ưu đãi (便宜を図る). ⚠ よろしく đôi khi viết 宜しく — cách viết ngoài bảng thường dụng, email nên viết かな.',
    tu: [
      { w: '{適宜|てきぎ}', ro: 'tekigi', vi: 'tuỳ tình hình, khi thích hợp (Bài 53)' },
      { w: '{便宜|べんぎ}', ro: 'bengi', vi: 'sự tiện lợi, ưu đãi (N1)' },
      { w: '{時宜|じぎ}', ro: 'jigi', vi: 'đúng thời điểm (N1+)' },
    ],
  },
  '閲': {
    hv: 'DUYỆT', nghia: 'xem xét, đọc kiểm', en: 'inspect / read',
    on: ['エツ'], kun: [],
    nho: 'Ngoài là 門 (cổng), trong là 兌 (gợi âm エツ — giống 説・悦): ĐỨNG Ở CỔNG ĐẾM, XEM XÉT TỪNG NGƯỜI = DUYỆT (duyệt binh, kiểm duyệt). 閲覧 = xem, đọc (tài liệu, trang web). 校閲 = soát lỗi bản thảo.',
    tu: [
      { w: '{閲覧|えつらん}', ro: 'etsuran', vi: 'xem, đọc (tài liệu, web — Bài 53)' },
      { w: '{校閲|こうえつ}', ro: 'kouetsu', vi: 'hiệu đính, soát bản thảo' },
      { w: '{検閲|けんえつ}', ro: 'ken\'etsu', vi: 'kiểm duyệt (N1)' },
    ],
  },
  '寛': {
    hv: 'KHOAN', nghia: 'rộng lượng', en: 'tolerant / lenient',
    on: ['カン'], kun: [],
    nho: 'Trên là 宀 (mái nhà), dưới là 莧 (cỏ rậm, gợi âm カン): NGÔI NHÀ RỘNG, CỎ MỌC THOẢI MÁI = KHOAN (khoan dung, rộng lòng). 寛大 = rộng lượng (寛大なご対応). 寛容 = khoan dung.',
    tu: [
      { w: '{寛大|かんだい}', ro: 'kandai', vi: 'rộng lượng, độ lượng (Bài 53)' },
      { w: '{寛容|かんよう}', ro: 'kan\'you', vi: 'khoan dung' },
      { w: '{寛|くつろ}ぐ', ro: 'kutsurogu', vi: 'thư giãn (cách viết ngoài bảng — thường viết くつろぐ)' },
    ],
  },
  '捗': {
    hv: 'TRẮC', nghia: 'tiến triển, trôi chảy', en: 'progress',
    on: ['チョク'], kun: [],
    nho: 'Trái là 扌 (tay), phải là 歩 (bước đi): TAY LÀM, CHÂN BƯỚC — VIỆC CỨ THẾ TIẾN LÊN = TIẾN TRIỂN. Trong bảng thường dụng chỉ có âm チョク, gần như chỉ gặp trong 進捗 (tiến độ — 進捗状況). はかどる (việc trôi chảy) thường viết かな; viết 捗る là cách ngoài bảng. ⚠ 歩 bên phải KHÔNG có chấm như 少.',
    tu: [
      { w: '{進捗|しんちょく}', ro: 'shinchoku', vi: 'tiến độ (công việc — từ vựng Bài 52)' },
      { w: '{進捗状況|しんちょくじょうきょう}', ro: 'shinchoku joukyou', vi: 'tình hình tiến độ' },
      { w: '{捗|はかど}る', ro: 'hakadoru', vi: '(việc) trôi chảy, tiến triển tốt (ngoài bảng — hay viết かな)' },
    ],
  },
  '殿': {
    hv: 'ĐIỆN', nghia: 'cung điện; ngài (gọi người)', en: 'palace / Mr. (formal)',
    on: ['デン', 'テン'], kun: ['との', 'どの'],
    nho: 'Trái trên là 尸 + 共 (người ngồi trên bệ cao), phải là 殳 (tay cầm binh khí canh gác): TOÀ NHÀ CAO CÓ LÍNH GÁC = ĐIỆN (cung điện). Gọi người ở trong điện = ～殿 (どの — "ngài…", dùng trong văn bản hành chính, giấy khen; email công ty với khách KHÔNG dùng, dùng 様).',
    tu: [
      { w: '～{殿|どの}', ro: '~dono', vi: 'ngài… (văn bản hành chính — Bài 53)' },
      { w: '{宮殿|きゅうでん}', ro: 'kyuuden', vi: 'cung điện' },
      { w: '{御殿|ごてん}', ro: 'goten', vi: 'dinh thự' },
      { w: '{殿様|とのさま}', ro: 'tonosama', vi: 'lãnh chúa (thời xưa)' },
    ],
  },
  '煩': {
    hv: 'PHIỀN', nghia: 'phiền, rắc rối', en: 'trouble / bother',
    on: ['ハン', 'ボン'], kun: ['わずら・う', 'わずら・わす'],
    nho: 'Trái là 火 (lửa), phải là 頁 (cái đầu): ĐẦU NÓNG NHƯ LỬA ĐỐT = PHIỀN (phiền não). 煩わしい = phiền phức, rắc rối. お手を煩わせる = làm phiền tay (người khác) — câu rào đón email: お手を煩わせて申し訳ございません. 煩悩 (ぼんのう) = phiền não (nhà Phật).',
    tu: [
      { w: '{煩|わずら}わしい', ro: 'wazurawashii', vi: 'phiền phức, rườm rà' },
      { w: 'お{手|て}を{煩|わずら}わせる', ro: 'ote o wazurawaseru', vi: 'làm phiền (người kia) phải ra tay (Bài 53)' },
      { w: '{煩雑|はんざつ}', ro: 'hanzatsu', vi: 'rườm rà, phức tạp (thủ tục — N1)' },
      { w: '{煩悩|ぼんのう}', ro: 'bonnou', vi: 'phiền não (N1+)' },
    ],
  },
  '懇': {
    hv: 'KHẨN', nghia: 'thân thiết; khẩn thiết', en: 'cordial / earnest',
    on: ['コン'], kun: ['ねんご・ろ'],
    nho: 'Trên là 貇 (gợi âm コン — hình con thú cày đất kiên nhẫn), dưới là 心 (tấm lòng): TẤM LÒNG CHÂN THÀNH, KIÊN NHẪN = KHẨN (khẩn thiết, thân tình). 懇親会 = tiệc giao lưu thân mật (công ty, hội thảo). 懇切丁寧 = tận tình, chu đáo. 懇談 = trò chuyện thân mật.',
    tu: [
      { w: '{懇親会|こんしんかい}', ro: 'konshinkai', vi: 'buổi giao lưu thân mật (Bài 53)' },
      { w: '{懇談|こんだん}', ro: 'kondan', vi: 'trò chuyện thân mật, toạ đàm' },
      { w: '{懇切丁寧|こんせつていねい}', ro: 'konsetsu teinei', vi: 'tận tình, chu đáo (N1)' },
    ],
  },
  '控': {
    hv: 'KHỐNG', nghia: 'kiềm chế; chờ sẵn; bản lưu', en: 'refrain / wait / copy',
    on: ['コウ'], kun: ['ひか・える'],
    nho: 'Trái là 扌 (tay), phải là 空 (trống, gợi âm クウ → コウ): GIỮ TAY LẠI ĐỂ TRỐNG, không làm = KHỐNG (kiềm chế). 控える = (1) hạn chế, kiêng (外出を控える) (2) chờ sẵn (控え室) (3) ghi lại (メモに控える). 差し控える = xin phép không làm (văn trang trọng).',
    tu: [
      { w: '{控|ひか}える', ro: 'hikaeru', vi: 'hạn chế, kiêng; chờ sẵn; ghi lại' },
      { w: '{差|さ}し{控|ひか}える', ro: 'sashihikaeru', vi: 'xin không (làm), kiềm lại (Bài 53)' },
      { w: '{控|ひか}え{室|しつ}', ro: 'hikaeshitsu', vi: 'phòng chờ' },
      { w: '{控除|こうじょ}', ro: 'koujo', vi: 'khấu trừ (thuế — N1)' },
    ],
  },
  '仰': {
    hv: 'NGƯỠNG', nghia: 'ngẩng lên; kính trọng', en: 'look up / respect',
    on: ['ギョウ', 'コウ'], kun: ['あお・ぐ', 'おお・せ'],
    nho: 'Trái là 亻 (người), phải là 卬 (người ngẩng nhìn người đứng cao): NGƯỜI NGẨNG ĐẦU NHÌN LÊN = NGƯỠNG (ngưỡng mộ). 仰ぐ = ngẩng nhìn; xin (chỉ thị, ý kiến của người trên: ご指示を仰ぐ). 仰せ = lời (người trên) nói. おっしゃる đôi khi viết 仰る — cách viết ngoài bảng, email nên viết かな.',
    tu: [
      { w: '{仰|あお}ぐ', ro: 'aogu', vi: 'ngẩng nhìn; xin (ý kiến, chỉ thị của người trên — Bài 53)' },
      { w: '{仰|おお}せ', ro: 'oose', vi: 'lời dạy, lời (người trên) nói (N1)' },
      { w: '{信仰|しんこう}', ro: 'shinkou', vi: 'tín ngưỡng' },
      { w: '{仰天|ぎょうてん}', ro: 'gyouten', vi: 'kinh ngạc (びっくり仰天)' },
    ],
  },
  '氏': {
    hv: 'THỊ', nghia: 'họ; ông / bà (gọi người)', en: 'surname / Mr., Ms.',
    on: ['シ'], kun: ['うじ'],
    nho: 'Hình cái thìa / rễ cây cắm xuống đất — GỐC RỄ CỦA MỘT DÒNG HỌ = THỊ. 氏名 = họ tên (đầy đủ). ～氏 = ông / bà… (văn viết, báo chí: 田中氏). 彼氏 = bạn trai. ⚠ 民 (みん — dân) giống nhưng có thêm nét ở trên; 紙 (かみ) = 糸 + 氏.',
    tu: [
      { w: '{氏名|しめい}', ro: 'shimei', vi: 'họ tên (Bài 53)' },
      { w: '～{氏|し}', ro: '~shi', vi: 'ông / bà… (văn viết, báo chí)' },
      { w: '{彼氏|かれし}', ro: 'kareshi', vi: 'bạn trai' },
      { w: '{氏|うじ}', ro: 'uji', vi: 'dòng họ (thời xưa)' },
    ],
  },
  '裁': {
    hv: 'TÀI', nghia: 'cắt (vải); phán xử, quyết định', en: 'cut / judge',
    on: ['サイ'], kun: ['さば・く', 'た・つ'],
    nho: 'Ngoài là 𢦏 (cây kích — cắt), trong là 衣 (áo, vải): CẮT VẢI MAY ÁO = TÀI (tài phùng — thợ may). Cắt cho phân minh → phán xử: 裁判 (toà xử), 裁く. Người có quyền "cắt" (quyết) → 決裁 (phê duyệt của cấp trên). 体裁 = bề ngoài, hình thức. ⚠ 栽 (さい — 盆栽) có 木; 載 (さい — 記載) có 車.',
    tu: [
      { w: '{決裁|けっさい}', ro: 'kessai', vi: 'phê duyệt (của người có thẩm quyền — Bài 53)' },
      { w: '{裁判|さいばん}', ro: 'saiban', vi: 'xét xử, toà án' },
      { w: '{体裁|ていさい}', ro: 'teisai', vi: 'hình thức, thể diện (N1)' },
      { w: '{裁|さば}く', ro: 'sabaku', vi: 'phán xử' },
    ],
  },
  '赦': {
    hv: 'XÁ', nghia: 'tha thứ, ân xá', en: 'pardon',
    on: ['シャ'], kun: [],
    nho: 'Trái là 赤 (đỏ, gợi âm セキ → シャ), phải là 攵 (tay cầm roi — hành động): BỎ ROI XUỐNG, THA CHO = XÁ (ân xá). 容赦 = "dung (容) và tha (赦)" → ご容赦ください = xin quý vị lượng thứ. 容赦なく = không nương tay. 恩赦 = ân xá.',
    tu: [
      { w: '{容赦|ようしゃ}', ro: 'yousha', vi: 'lượng thứ, nương tay (Bài 53)' },
      { w: 'ご{容赦|ようしゃ}ください', ro: 'goyousha kudasai', vi: 'xin quý vị lượng thứ' },
      { w: '{恩赦|おんしゃ}', ro: 'onsha', vi: 'ân xá (N1+)' },
    ],
  },
  '憾': {
    hv: 'HÁM', nghia: 'tiếc, ân hận', en: 'regret',
    on: ['カン'], kun: [],
    nho: 'Trái là 忄 (tấm lòng), phải là 感 (cảm, gợi âm カン): LÒNG CẢM THẤY NUỐI TIẾC = HÁM (di hám — điều đáng tiếc). Gần như chỉ gặp trong 遺憾 (đáng tiếc — văn chính thức: 誠に遺憾に存じます; trong thông cáo chính phủ là lời "lấy làm tiếc", không hẳn là xin lỗi).',
    tu: [
      { w: '{遺憾|いかん}', ro: 'ikan', vi: 'đáng tiếc (văn chính thức — Bài 53)' },
      { w: '{遺憾|いかん}に{存|ぞん}じます', ro: 'ikan ni zonjimasu', vi: 'chúng tôi lấy làm tiếc' },
      { w: '{遺憾|いかん}なく', ro: 'ikan naku', vi: 'trọn vẹn, không gì đáng tiếc (遺憾なく発揮する)' },
    ],
  },
  '賀': {
    hv: 'HẠ', nghia: 'chúc mừng', en: 'congratulate',
    on: ['ガ'], kun: [],
    nho: 'Trên là 加 (thêm vào, gợi âm カ → ガ), dưới là 貝 (của cải): ĐEM QUÀ THÊM CHO NGƯỜI MÀ MỪNG = HẠ (chúc hạ). 年賀状 = thiệp chúc Tết. 謹賀新年 = cung chúc tân xuân (câu mở email / thiệp đầu năm). 祝賀会 = tiệc mừng. ⚠ 加 + 貝 = 賀; 加 + 口 + 木 khác hẳn.',
    tu: [
      { w: '{年賀状|ねんがじょう}', ro: 'nengajou', vi: 'thiệp chúc Tết' },
      { w: '{謹賀新年|きんがしんねん}', ro: 'kinga shinnen', vi: 'cung chúc tân xuân (Bài 53)' },
      { w: '{祝賀会|しゅくがかい}', ro: 'shukugakai', vi: 'tiệc mừng' },
      { w: '{賀正|がしょう}', ro: 'gashou', vi: 'mừng năm mới (chữ trên thiệp)' },
    ],
  },
};
