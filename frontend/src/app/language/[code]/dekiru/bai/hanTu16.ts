/**
 * Chữ Hán MỚI của Bài 16 (アルバイト — tiếp sau sách, N4) cho thẻ chữ Hán — cùng định dạng hanTu.ts.
 * 15 chữ: 代 意 考 答 問 質 正 工 堂 面 接 決 夢 将 守 (bảng `b16-han-tu` trong bai16.ts).
 * Cách nhớ: theo cấu tạo chữ khi chắc chắn; chữ hình thanh thì ghi rõ phần nào gợi nghĩa / gợi âm;
 * chữ có nguồn gốc chưa chắc (将) thì nhớ theo nghĩa và từ. Từ đi chung ưu tiên từ dùng trong bai16.ts.
 * Tệp chỉ có `import type` — tải chậm như hanTu.ts.
 */
import type { HanTu } from '@/components/sach-hoc/kanji';

export const HAN_TU_16: Record<string, HanTu> = {
  '代': {
    hv: 'ĐẠI', nghia: 'thay thế; đời, thời; tiền phí', en: 'substitute / generation / fee',
    on: ['ダイ', 'タイ'], kun: ['か・わります', 'か・えます'],
    nho: 'Bên trái 亻 (người), bên phải 弋 (cái cọc — phần này cũng gợi âm): người cắm cọc giữ chỗ để THAY cho người khác. Đổi người là 交代; tiền trả "thay" cho công sức là ～代 (アルバイト代).',
    tu: [
      { w: '{交代|こうたい}します', ro: 'koutai shimasu', vi: 'đổi ca, thay người (代 đọc タイ)' },
      { w: 'アルバイト{代|だい}', ro: 'arubaito-dai', vi: 'tiền làm thêm' },
      { w: '{時代|じだい}', ro: 'jidai', vi: 'thời đại' },
      { w: '{代|か}わりに', ro: 'kawari ni', vi: 'thay cho (鈴木さんの代わりに)' },
    ],
  },
  '意': {
    hv: 'Ý', nghia: 'ý, ý nghĩ, ý nghĩa', en: 'idea / mind / meaning',
    on: ['イ'], kun: [],
    nho: 'Trên là 音 (âm thanh), dưới là 心 (tim): "tiếng nói trong lòng" = Ý nghĩ. Chữ không đứng một mình, luôn đọc イ trong từ ghép.',
    tu: [
      { w: '{意味|いみ}', ro: 'imi', vi: 'ý nghĩa, nghĩa của từ' },
      { w: '{注意|ちゅうい}します', ro: 'chuui shimasu', vi: 'chú ý, cẩn thận; nhắc nhở' },
      { w: '{用意|ようい}します', ro: 'youi shimasu', vi: 'chuẩn bị sẵn' },
      { w: '{意見|いけん}', ro: 'iken', vi: 'ý kiến' },
    ],
  },
  '考': {
    hv: 'KHẢO', nghia: 'suy nghĩ, cân nhắc; khảo', en: 'think / consider',
    on: ['コウ'], kun: ['かんが・えます'],
    nho: 'Phần trên 耂 là chữ "lão" (người già) viết tắt; phần dưới là nét ngoặt trông như cây gậy. Ông già chống gậy ngồi SUY NGHĨ. Đừng nhầm với 孝 (hiếu — dưới là 子) và 老 (lão — dưới là 匕).',
    tu: [
      { w: '{考|かんが}えます', ro: 'kangaemasu', vi: 'suy nghĩ, cân nhắc' },
      { w: '{考|かんが}え', ro: 'kangae', vi: 'ý nghĩ, ý tưởng' },
      { w: '{参考|さんこう}', ro: 'sankou', vi: 'tham khảo' },
    ],
  },
  '答': {
    hv: 'ĐÁP', nghia: 'trả lời, đáp án', en: 'answer',
    on: ['トウ'], kun: ['こた・えます', 'こた・え'],
    nho: 'Trên là ⺮ (bộ trúc — tre), dưới là 合 (hợp, khớp): hai thanh tre ghép KHỚP nhau như câu TRẢ LỜI khớp với câu hỏi. Cẩn thận với 笑 (cười) — cũng có ⺮ nhưng dưới là 夭.',
    tu: [
      { w: '{答|こた}えます', ro: 'kotaemasu', vi: 'trả lời (質問に答えます)' },
      { w: '{答|こた}え', ro: 'kotae', vi: 'câu trả lời, đáp án' },
      { w: '{回答|かいとう}', ro: 'kaitou', vi: 'câu trả lời (văn viết, khảo sát)' },
    ],
  },
  '問': {
    hv: 'VẤN', nghia: 'hỏi; vấn đề', en: 'question / ask',
    on: ['モン'], kun: ['と・い'],
    nho: 'Cái cổng 門 bao ngoài, cái miệng 口 ở trong (門 cũng gợi âm モン): đứng ở cổng mở miệng HỎI. So sánh: 門 + 日 = 間 (khoảng), 門 + 耳 = 聞 (nghe).',
    tu: [
      { w: '{質問|しつもん}', ro: 'shitsumon', vi: 'câu hỏi; hỏi (質問します)' },
      { w: '{問題|もんだい}', ro: 'mondai', vi: 'vấn đề, bài tập, câu hỏi trong đề' },
      { w: '{問|と}い', ro: 'toi', vi: 'câu hỏi (văn viết, đề thi)' },
    ],
  },
  '質': {
    hv: 'CHẤT', nghia: 'chất, bản chất; hỏi', en: 'quality / question',
    on: ['シツ', 'シチ'], kun: [],
    nho: 'Trên là hai chữ 斤 (cái rìu) đứng cạnh nhau, dưới là 貝 (vỏ sò — tiền xưa, xem 買 Bài 5): đặt của cải (貝) ra để đối chất, hỏi cho rõ. Học theo từ: 質問 (hỏi), 品質 (chất lượng).',
    tu: [
      { w: '{質問|しつもん}', ro: 'shitsumon', vi: 'câu hỏi' },
      { w: '{品質|ひんしつ}', ro: 'hinshitsu', vi: 'chất lượng (hàng hoá)' },
      { w: '{質|しつ}', ro: 'shitsu', vi: 'chất lượng (質がいい = chất lượng tốt)' },
    ],
  },
  '正': {
    hv: 'CHÍNH', nghia: 'đúng, ngay thẳng; chính thức', en: 'correct / proper',
    on: ['セイ', 'ショウ'], kun: ['ただ・しい'],
    nho: 'Dưới là 止 (hình bàn chân), trên là vạch 一 (cái đích): bàn chân đi THẲNG tới đích, không lệch = ĐÚNG, CHÍNH. 正社員 = nhân viên "chính" thức.',
    tu: [
      { w: '{正|ただ}しい', ro: 'tadashii', vi: 'đúng' },
      { w: '{正社員|せいしゃいん}', ro: 'seishain', vi: 'nhân viên chính thức' },
      { w: 'お{正月|しょうがつ}', ro: 'oshougatsu', vi: 'Tết (đầu năm) — 正 đọc ショウ' },
    ],
  },
  '工': {
    hv: 'CÔNG', nghia: 'thợ; công việc làm ra đồ', en: 'craft / construction',
    on: ['コウ', 'ク'], kun: [],
    nho: 'Hình cái thước thợ (hoặc cái đục): một vạch trên, một vạch dưới, trục đứng nối giữa. Thợ cầm thước LÀM RA đồ → 工場 (nhà máy). Chỉ 3 nét — chữ ✍ nên viết.',
    tu: [
      { w: '{工場|こうじょう}', ro: 'koujou', vi: 'nhà máy' },
      { w: '{工事|こうじ}', ro: 'kouji', vi: 'công trình, thi công' },
      { w: '{大工|だいく}', ro: 'daiku', vi: 'thợ mộc (工 đọc ク)' },
    ],
  },
  '堂': {
    hv: 'ĐƯỜNG', nghia: 'gian nhà lớn, hội trường', en: 'hall',
    on: ['ドウ'], kun: [],
    nho: 'Phần trên là 尚 (chữ "thượng" — cao quý, cũng gợi âm), dưới là 土 (đất): nền đất đắp cao dựng GIAN NHÀ LỚN cho nhiều người. 食堂 = gian nhà để ăn → nhà ăn, quán cơm.',
    tu: [
      { w: '{食堂|しょくどう}', ro: 'shokudou', vi: 'nhà ăn, quán cơm (ひまわり食堂)' },
      { w: '{講堂|こうどう}', ro: 'koudou', vi: 'giảng đường, hội trường' },
    ],
  },
  '面': {
    hv: 'DIỆN', nghia: 'mặt, bề mặt; phương diện', en: 'face / surface',
    on: ['メン'], kun: ['おもて', 'つら'],
    nho: 'Hình khuôn MẶT nhìn thẳng: khung ngoài là đường viền mặt, bên trong là mắt mũi. 面接 = gặp mặt (面) trực tiếp (接) → phỏng vấn.',
    tu: [
      { w: '{面接|めんせつ}', ro: 'mensetsu', vi: 'phỏng vấn' },
      { w: '{画面|がめん}', ro: 'gamen', vi: 'màn hình' },
      { w: '{面白|おもしろ}い', ro: 'omoshiroi', vi: 'thú vị, hay (cách đọc đặc biệt)' },
    ],
  },
  '接': {
    hv: 'TIẾP', nghia: 'tiếp, nối; tiếp xúc, gặp', en: 'contact / connect',
    on: ['セツ'], kun: ['つ・ぎます'],
    nho: 'Bên trái 扌 (bàn tay) gợi nghĩa, bên phải 妾 (立 + 女) gợi âm: đưa TAY ra đón, nối tiếp với người khác → 接客 (tiếp khách), 面接 (gặp mặt).',
    tu: [
      { w: '{面接|めんせつ}', ro: 'mensetsu', vi: 'phỏng vấn' },
      { w: '{接客|せっきゃく}', ro: 'sekkyaku', vi: 'tiếp khách, phục vụ khách (có っ)' },
      { w: '{直接|ちょくせつ}', ro: 'chokusetsu', vi: 'trực tiếp' },
    ],
  },
  '決': {
    hv: 'QUYẾT', nghia: 'quyết định', en: 'decide',
    on: ['ケツ'], kun: ['き・めます', 'き・まります'],
    nho: 'Bên trái 氵 (nước), bên phải 夬 (khoét, mở toang): nước phá vỡ bờ đê — đã vỡ thì chảy một hướng, không quay lại = QUYẾT. Tha động từ 決めます (tôi quyết) ↔ tự động từ 決まります (được quyết).',
    tu: [
      { w: '{決|き}めます', ro: 'kimemasu', vi: 'quyết định' },
      { w: '{決|き}まります', ro: 'kimarimasu', vi: 'được quyết định (バイトが決まりました)' },
      { w: '{決心|けっしん}', ro: 'kesshin', vi: 'quyết tâm (có っ)' },
    ],
  },
  '夢': {
    hv: 'MỘNG', nghia: 'giấc mơ, ước mơ', en: 'dream',
    on: ['ム'], kun: ['ゆめ'],
    nho: 'Phần trên (trông như 艹) và 罒 là lông mày và con mắt, ở dưới có 夕 (buổi tối): đêm xuống, mắt nhắm lại thì thấy GIẤC MƠ.',
    tu: [
      { w: '{夢|ゆめ}', ro: 'yume', vi: 'giấc mơ; ước mơ (将来の夢)' },
      { w: '{夢|ゆめ}を{見|み}ます', ro: 'yume o mimasu', vi: 'nằm mơ' },
      { w: '{夢中|むちゅう}', ro: 'muchuu', vi: 'say mê (夢 đọc ム)' },
    ],
  },
  '将': {
    hv: 'TƯƠNG', nghia: 'sắp, sẽ; tướng (cầm quân)', en: 'future / commander',
    on: ['ショウ'], kun: [],
    nho: 'Nguồn gốc chữ phức tạp — nhớ theo nghĩa: TƯƠNG trong "tương lai" (sắp đến) và "tướng" cầm quân (bàn tay 寸 ở góc dưới). 将来 = cái "sắp" (将) "đến" (来) — gần như chỉ gặp trong từ này ở N4.',
    tu: [
      { w: '{将来|しょうらい}', ro: 'shourai', vi: 'tương lai' },
      { w: '{将来|しょうらい}の{夢|ゆめ}', ro: 'shourai no yume', vi: 'ước mơ tương lai' },
      { w: '{将棋|しょうぎ}', ro: 'shougi', vi: 'cờ tướng Nhật' },
    ],
  },
  '守': {
    hv: 'THỦ', nghia: 'giữ, bảo vệ; tuân thủ', en: 'protect / keep',
    on: ['シュ', 'ス'], kun: ['まも・ります', 'も・り'],
    nho: 'Trên là 宀 (mái nhà), dưới là 寸 (bàn tay): bàn tay dưới mái nhà GIỮ GÌN ngôi nhà. Giữ giờ = 時間を守る; người vắng nhà thì cần ai giữ nhà → 留守.',
    tu: [
      { w: '{守|まも}ります', ro: 'mamorimasu', vi: 'giữ, tuân thủ (時間・約束を守ります)' },
      { w: '{留守|るす}', ro: 'rusu', vi: 'vắng nhà (守 đọc ス)' },
      { w: 'お{守|まも}り', ro: 'omamori', vi: 'bùa hộ mệnh (mua ở đền chùa)' },
    ],
  },
};
