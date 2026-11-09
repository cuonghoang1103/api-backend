/**
 * Chữ Hán MỚI của Bài 26 (留学生活 — tiếp sau sách, bài đầu tiên của N3) cho thẻ chữ Hán — cùng định dạng hanTu.ts.
 * 20 chữ: 途 端 講 義 研 究 専 論 提 期 限 寮 賃 突 偶 寄 頑 互 際 乾 (N3 theo các bảng tham khảo phổ biến; 寮・偶 có bảng
 * xếp N2 — JLPT không công bố danh sách chữ chính thức) — bảng `b26-han-tu` trong bai26.ts.
 * Cách nhớ: theo cấu tạo chữ (phần chỉ nghĩa + phần gợi âm của chữ hình thanh ghi rõ); 頑 trong 頑張る là chữ mượn âm (ateji)
 * nên nói rõ. Từ đi chung ưu tiên từ dùng trong bai26.ts.
 * On / Kun theo bảng thường dụng (常用): 途 講 義 論 寮 賃 偶 頑 chỉ có âm On; 際 có Kun きわ.
 * Tệp chỉ có `import type` — tải chậm như hanTu.ts.
 */
import type { HanTu } from '@/components/sach-hoc/kanji';

export const HAN_TU_26: Record<string, HanTu> = {
  '途': {
    hv: 'ĐỒ', nghia: 'con đường; giữa đường', en: 'route / way',
    on: ['ト'], kun: [],
    nho: 'Bên trái 辶 (bước đi), bên phải 余 (gợi âm ト): con ĐƯỜNG đang đi → 途中 (giữa đường, giữa chừng), 途端 (ngay đúng lúc). Khác 余 (dư — không có 辶).',
    tu: [
      { w: '{途中|とちゅう}', ro: 'tochuu', vi: 'giữa đường, giữa chừng' },
      { w: '{途端|とたん}', ro: 'totan', vi: 'ngay khi, vừa lúc' },
      { w: '{帰|かえ}る{途中|とちゅう}', ro: 'kaeru tochuu', vi: 'trên đường về' },
      { w: '{用途|ようと}', ro: 'youto', vi: 'công dụng (N1)' },
    ],
  },
  '端': {
    hv: 'ĐOAN', nghia: 'đầu mút, mép, rìa', en: 'edge / end',
    on: ['タン'], kun: ['はし', 'は', 'はた'],
    nho: 'Bên trái 立 (đứng), bên phải 耑 (gợi âm タン; vẽ ngọn mầm cây cùng bộ rễ — phần đầu mút): chỗ ĐẦU MÚT, MÉP của một vật → 端 (はし), 途端. ⚠ はし còn là 橋 (cầu) và 箸 (đũa) — ba chữ cùng âm.',
    tu: [
      { w: '{端|はし}', ro: 'hashi', vi: 'mép, đầu, rìa' },
      { w: '{道|みち}の{端|はし}', ro: 'michi no hashi', vi: 'mép đường' },
      { w: '{途端|とたん}', ro: 'totan', vi: 'ngay khi, vừa lúc' },
      { w: '{中途半端|ちゅうとはんぱ}', ro: 'chuuto hanpa', vi: 'dở dang, nửa vời (N2)' },
      { w: '{極端|きょくたん}', ro: 'kyokutan', vi: 'cực đoan (N2)' },
    ],
  },
  '講': {
    hv: 'GIẢNG', nghia: 'giảng, giảng giải', en: 'lecture',
    on: ['コウ'], kun: [],
    nho: 'Bên trái 言 (lời nói), bên phải 冓 (gợi âm コウ; hai khung gỗ đan khớp cân đối): lời nói được SẮP ĐẶT MẠCH LẠC = GIẢNG → 講義. Cùng 冓 và cùng đọc コウ: 構 (cấu — 構う), 購 (mua — 購入).',
    tu: [
      { w: '{講義|こうぎ}', ro: 'kougi', vi: 'giờ giảng (đại học)' },
      { w: '{休講|きゅうこう}', ro: 'kyuukou', vi: '(lớp) được nghỉ' },
      { w: '{講師|こうし}', ro: 'koushi', vi: 'giảng viên' },
      { w: '{講演|こうえん}', ro: 'kouen', vi: 'bài diễn thuyết (N2)' },
    ],
  },
  '義': {
    hv: 'NGHĨA', nghia: 'nghĩa, lẽ phải; ý nghĩa', en: 'righteousness / meaning',
    on: ['ギ'], kun: [],
    nho: 'Trên 羊 (con cừu — vật tế, điều tốt lành), dưới 我 (ta; cây kích): việc ĐÚNG ĐẮN mình phải làm = NGHĨA. Thêm 言 bên trái → 議 (nghị — 会議).',
    tu: [
      { w: '{講義|こうぎ}', ro: 'kougi', vi: 'giờ giảng' },
      { w: '{義務|ぎむ}', ro: 'gimu', vi: 'nghĩa vụ (N2)' },
      { w: '{正義|せいぎ}', ro: 'seigi', vi: 'chính nghĩa (N2)' },
      { w: '{意義|いぎ}', ro: 'igi', vi: 'ý nghĩa (N1)' },
    ],
  },
  '研': {
    hv: 'NGHIÊN', nghia: 'mài; nghiên cứu', en: 'polish / study',
    on: ['ケン'], kun: ['と・ぐ'],
    nho: 'Bên trái 石 (đá), bên phải 幵 (gợi âm; hai vật ngang bằng nhau): MÀI ĐÁ cho phẳng → mài giũa → NGHIÊN cứu (mài giũa kiến thức) → 研究.',
    tu: [
      { w: '{研究|けんきゅう}', ro: 'kenkyuu', vi: 'nghiên cứu' },
      { w: '{研究室|けんきゅうしつ}', ro: 'kenkyuushitsu', vi: 'phòng nghiên cứu' },
      { w: '{研修|けんしゅう}', ro: 'kenshuu', vi: 'tập huấn, đào tạo (N2)' },
      { w: '{研|と}ぐ', ro: 'togu', vi: 'mài (dao); vo (gạo) (N1)' },
    ],
  },
  '究': {
    hv: 'CỨU', nghia: 'tìm đến tận cùng', en: 'research / investigate',
    on: ['キュウ'], kun: ['きわ・める'],
    nho: 'Trên 穴 (cái hang), dưới 九 (gợi âm キュウ; số chín — chỗ cùng cực): đi vào TẬN CÙNG cái hang = tìm cho ra lẽ → 研究. Cùng 穴: 空 (trống — dưới là 工), 突 (đột — dưới là 犬).',
    tu: [
      { w: '{研究|けんきゅう}', ro: 'kenkyuu', vi: 'nghiên cứu' },
      { w: '{研究者|けんきゅうしゃ}', ro: 'kenkyuusha', vi: 'nhà nghiên cứu' },
      { w: '{究|きわ}める', ro: 'kiwameru', vi: 'tìm hiểu đến tận cùng (N1)' },
    ],
  },
  '専': {
    hv: 'CHUYÊN', nghia: 'chuyên, riêng một', en: 'specialty / exclusive',
    on: ['セン'], kun: ['もっぱ・ら'],
    nho: 'Phần trên 叀 (con suốt xe sợi), dưới 寸 (bàn tay): tay CHUYÊN CHÚ quay một con suốt = CHUYÊN → 専門, 専攻. ⚠ Không có dấu chấm ở góc trên bên phải (phần bên phải chữ 博 mới có).',
    tu: [
      { w: '{専攻|せんこう}', ro: 'senkou', vi: 'chuyên ngành' },
      { w: '{専門|せんもん}', ro: 'senmon', vi: 'chuyên môn' },
      { w: '{専門学校|せんもんがっこう}', ro: 'senmon gakkou', vi: 'trường nghề, trường chuyên môn' },
      { w: '{専用|せんよう}', ro: 'sen\'you', vi: 'dành riêng (N2)' },
    ],
  },
  '論': {
    hv: 'LUẬN', nghia: 'bàn luận, lý luận', en: 'argument / theory',
    on: ['ロン'], kun: [],
    nho: 'Bên trái 言 (lời nói), bên phải 侖 (gợi âm ロン; các thẻ tre xếp theo thứ tự): lời nói CÓ THỨ LỚP = LUẬN → 論文. Cùng 侖: 輪 (vòng — 指輪) với 車 bên trái.',
    tu: [
      { w: '{論文|ろんぶん}', ro: 'ronbun', vi: 'luận văn, bài báo khoa học' },
      { w: '{卒論|そつろん}', ro: 'sotsuron', vi: 'khoá luận tốt nghiệp' },
      { w: '{議論|ぎろん}', ro: 'giron', vi: 'tranh luận (N2)' },
      { w: '{結論|けつろん}', ro: 'ketsuron', vi: 'kết luận (N2)' },
    ],
  },
  '提': {
    hv: 'ĐỀ', nghia: 'đưa ra, nâng lên', en: 'present / submit',
    on: ['テイ'], kun: ['さ・げる'],
    nho: 'Bên trái 扌 (tay), bên phải 是 (gợi âm テイ): TAY NHẤC LÊN, ĐƯA RA = ĐỀ (xuất) → 提出 (nộp). Khác 題 (đề bài — 宿題, 問題) = 是 + 頁 bên phải.',
    tu: [
      { w: '{提出|ていしゅつ}', ro: 'teishutsu', vi: 'nộp (bài, hồ sơ)' },
      { w: '{提出期限|ていしゅつきげん}', ro: 'teishutsu kigen', vi: 'hạn nộp' },
      { w: '{提案|ていあん}', ro: 'teian', vi: 'đề xuất (N2)' },
      { w: '{前提|ぜんてい}', ro: 'zentei', vi: 'tiền đề (N1)' },
    ],
  },
  '期': {
    hv: 'KỲ', nghia: 'kỳ, thời hạn; mong đợi', en: 'period / expect',
    on: ['キ', 'ゴ'], kun: [],
    nho: 'Bên trái 其 (gợi âm キ), bên phải 月 (mặt trăng): CHU KỲ trăng tròn — khuyết = KỲ (hạn) → 学期, 期限; hẹn đến kỳ thì MONG ĐỢI → 期待. Khác 基 (cơ — 其 + 土 bên dưới).',
    tu: [
      { w: '{学期|がっき}', ro: 'gakki', vi: 'học kỳ' },
      { w: '{期末試験|きまつしけん}', ro: 'kimatsu shiken', vi: 'thi cuối kỳ' },
      { w: '{期限|きげん}', ro: 'kigen', vi: 'thời hạn' },
      { w: '{期待|きたい}', ro: 'kitai', vi: 'kỳ vọng, mong đợi' },
      { w: '{期間|きかん}', ro: 'kikan', vi: 'khoảng thời gian (N3)' },
    ],
  },
  '限': {
    hv: 'HẠN', nghia: 'giới hạn', en: 'limit',
    on: ['ゲン'], kun: ['かぎ・る'],
    nho: 'Bên trái 阝 (gò đất), bên phải 艮 (gợi âm; dừng lại): gò đất CHẶN không cho đi tiếp = GIỚI HẠN → 期限, 限る. Cùng 艮: 根 (rễ — 大根), 銀 (bạc — 銀行), 眼 (mắt — 眼鏡).',
    tu: [
      { w: '{期限|きげん}', ro: 'kigen', vi: 'thời hạn' },
      { w: '{限|かぎ}る', ro: 'kagiru', vi: 'giới hạn, chỉ ở (N3)' },
      { w: '{限|かぎ}られた{時間|じかん}', ro: 'kagirareta jikan', vi: 'thời gian có hạn' },
      { w: '{制限|せいげん}', ro: 'seigen', vi: 'hạn chế (N2)' },
      { w: '{限界|げんかい}', ro: 'genkai', vi: 'giới hạn, sức chịu đựng (N2)' },
    ],
  },
  '寮': {
    hv: 'LIÊU', nghia: 'nhà ở tập thể, ký túc xá', en: 'dormitory',
    on: ['リョウ'], kun: [],
    nho: 'Trên 宀 (mái nhà), dưới 尞 (gợi âm リョウ): NHÀ nhiều người ở chung = ký túc xá. Cùng 尞 và cùng đọc リョウ: 療 (trị liệu — 治療, có 疒), 僚 (đồng nghiệp — 同僚, có 亻). Đứng riêng vẫn đọc On: 寮 (りょう).',
    tu: [
      { w: '{寮|りょう}', ro: 'ryou', vi: 'ký túc xá' },
      { w: '{学生寮|がくせいりょう}', ro: 'gakuseiryou', vi: 'ký túc xá sinh viên' },
      { w: '{社員寮|しゃいんりょう}', ro: 'shainryou', vi: 'ký túc xá của công ty' },
      { w: '{寮生|りょうせい}', ro: 'ryousei', vi: 'người ở ký túc xá' },
    ],
  },
  '賃': {
    hv: 'NHẪM', nghia: 'tiền thuê, tiền công', en: 'fee / rent',
    on: ['チン'], kun: [],
    nho: 'Trên 任 (gợi âm; giao việc), dưới 貝 (vỏ sò — tiền): TIỀN trả khi giao việc / thuê đồ = tiền thuê → 家賃. Khác 貸 (cho mượn — 貸す) = 代 + 貝.',
    tu: [
      { w: '{家賃|やちん}', ro: 'yachin', vi: 'tiền thuê nhà' },
      { w: '{運賃|うんちん}', ro: 'unchin', vi: 'tiền vé tàu xe (N2)' },
      { w: '{賃金|ちんぎん}', ro: 'chingin', vi: 'tiền lương, tiền công (N1)' },
    ],
  },
  '突': {
    hv: 'ĐỘT', nghia: 'đột ngột; đâm, chọc', en: 'sudden / thrust',
    on: ['トツ'], kun: ['つ・く'],
    nho: 'Trên 穴 (cái hang), dưới 犬 (con chó): con chó LAO VỤT ra khỏi hang = ĐỘT (ngột) → 突然. Nhớ hình ảnh con chó phóng ra là nhớ cả nghĩa "đột nhiên" lẫn "đâm, chọc".',
    tu: [
      { w: '{突然|とつぜん}', ro: 'totsuzen', vi: 'đột nhiên' },
      { w: '{突|つ}く', ro: 'tsuku', vi: 'chọc, đâm (N2)' },
      { w: '{衝突|しょうとつ}', ro: 'shoutotsu', vi: 'va chạm (N1)' },
    ],
  },
  '偶': {
    hv: 'NGẪU', nghia: 'tình cờ; cặp, số chẵn', en: 'accidental / even number',
    on: ['グウ'], kun: [],
    nho: 'Bên trái 亻 (người), bên phải 禺 (gợi âm グウ; hình nộm): HÌNH NỘM người — thường đặt thành CẶP → số chẵn (偶数); hai thứ TÌNH CỜ gặp nhau → 偶然. Cùng 禺: 遇 (ngộ), 隅 (góc) — đọc グウ.',
    tu: [
      { w: '{偶然|ぐうぜん}', ro: 'guuzen', vi: 'tình cờ' },
      { w: '{偶数|ぐうすう}', ro: 'guusuu', vi: 'số chẵn (N2)' },
    ],
  },
  '寄': {
    hv: 'KÝ', nghia: 'ghé; dựa vào; gom lại', en: 'drop in / approach',
    on: ['キ'], kun: ['よ・る', 'よ・せる'],
    nho: 'Trên 宀 (mái nhà), dưới 奇 (gợi âm キ): GHÉ VÀO nương nhờ dưới mái nhà người khác = KÝ → 寄る, 立ち寄る. Khác 奇 (lạ — không có 宀).',
    tu: [
      { w: '{寄|よ}る', ro: 'yoru', vi: 'ghé qua' },
      { w: '{立|た}ち{寄|よ}る', ro: 'tachiyoru', vi: 'ghé qua (trên đường đi)' },
      { w: '{年寄|としよ}り', ro: 'toshiyori', vi: 'người già (N3)' },
      { w: '{寄付|きふ}', ro: 'kifu', vi: 'quyên góp (N2)' },
    ],
  },
  '頑': {
    hv: 'NGOAN', nghia: 'cứng, bướng', en: 'stubborn',
    on: ['ガン'], kun: [],
    nho: 'Bên trái 元 (gợi âm ガン; cái đầu tròn), bên phải 頁 (cái đầu): ĐẦU CỨNG = bướng → 頑固. Trong 頑張る chữ chỉ được MƯỢN ÂM (ateji) — học cả từ. Khác 願 (nguyện — お願い) = 原 + 頁.',
    tu: [
      { w: '{頑張|がんば}る', ro: 'ganbaru', vi: 'cố gắng' },
      { w: '{頑固|がんこ}', ro: 'ganko', vi: 'cứng đầu, bảo thủ (N2)' },
      { w: '{頑丈|がんじょう}', ro: 'ganjou', vi: 'chắc chắn, bền (N1)' },
    ],
  },
  '互': {
    hv: 'HỖ', nghia: 'lẫn nhau', en: 'mutual',
    on: ['ゴ'], kun: ['たが・い'],
    nho: 'Chữ tượng hình: cái GUỒNG QUẤN DÂY, hai đầu móc ĐAN VÀO NHAU = LẪN NHAU → お互い. Chỉ 4 nét — đừng nhầm với 五 (năm, cũng 4 nét).',
    tu: [
      { w: 'お{互|たが}い', ro: 'otagai', vi: 'lẫn nhau, cả hai bên' },
      { w: 'お{互|たが}いさま', ro: 'otagaisama', vi: 'ai cũng như ai (câu đáp khiêm tốn)' },
      { w: '{交互|こうご}に', ro: 'kougo ni', vi: 'luân phiên, lần lượt (N2)' },
      { w: '{相互|そうご}', ro: 'sougo', vi: 'tương hỗ (N1)' },
    ],
  },
  '際': {
    hv: 'TẾ', nghia: 'chỗ giáp ranh; quan hệ giữa các bên; lúc', en: 'occasion / border',
    on: ['サイ'], kun: ['きわ'],
    nho: 'Bên trái 阝 (bức tường đất), bên phải 祭 (gợi âm サイ): chỗ hai bức tường GIÁP NHAU = ranh giới → quan hệ GIỮA các bên (国際 = giữa các nước). Khác 祭 (lễ hội — 祭り) và 察 (警察) = 宀 + 祭.',
    tu: [
      { w: '{国際|こくさい}', ro: 'kokusai', vi: 'quốc tế' },
      { w: '{実際|じっさい}に', ro: 'jissai ni', vi: 'thực tế, tận mắt' },
      { w: '{国際交流|こくさいこうりゅう}', ro: 'kokusai kouryuu', vi: 'giao lưu quốc tế' },
      { w: '{交際|こうさい}', ro: 'kousai', vi: 'giao du, hẹn hò (N2)' },
    ],
  },
  '乾': {
    hv: 'CAN', nghia: 'khô', en: 'dry',
    on: ['カン'], kun: ['かわ・く', 'かわ・かす'],
    nho: 'Bên trái 倝 (mặt trời lên, ánh nắng toả), bên phải 乞 (hơi bốc lên): NẮNG làm hơi nước bốc đi = KHÔ → 乾く, 乾杯 (cạn chén). Cùng phần trái với 幹 (cán — 新幹線), nhưng phải của 幹 là 干.',
    tu: [
      { w: '{乾|かわ}く', ro: 'kawaku', vi: 'khô' },
      { w: '{乾|かわ}かす', ro: 'kawakasu', vi: 'làm khô, sấy' },
      { w: '{乾杯|かんぱい}', ro: 'kanpai', vi: 'cạn ly' },
      { w: '{乾燥|かんそう}', ro: 'kansou', vi: 'khô hanh (N2)' },
    ],
  },
};
