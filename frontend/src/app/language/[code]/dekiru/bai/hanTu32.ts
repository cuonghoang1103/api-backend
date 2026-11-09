/**
 * Chữ Hán MỚI của Bài 32 (昔と今 — tiếp sau sách, cấp N3) cho thẻ chữ Hán — cùng định dạng hanTu.ts.
 * 20 chữ: 歴 史 昭 紀 進 展 移 技 科 器 街 村 齢 老 孫 懐 憶 流 未 常 (N3 theo các bảng tham khảo phổ biến; 展・齢・孫・憶 có
 * bảng xếp N2, 懐 nhiều bảng xếp N1 nhưng từ 懐かしい là N3 — JLPT không công bố danh sách chữ chính thức) — bảng `b32-han-tu`
 * trong bai32.ts.
 * Cách nhớ: theo cấu tạo chữ (phần chỉ nghĩa + phần gợi âm của chữ hình thanh ghi rõ). Từ đi chung ưu tiên từ dùng trong
 * bai32.ts và từ đã học ở bài trước (進学 Bài 16, 懐かしい Bài 23, 交流 Bài 26, 高齢化 Bài 27, 高齢者 Bài 28, 記憶 Bài 31).
 * On / Kun theo bảng thường dụng (常用): 歴 史 昭 紀 展 科 齢 憶 未 chỉ có âm On; 街 có On ガイ・カイ (カイ trong 街道 — N1);
 * 流 có On ル (流布 — N1); 懐 có nhiều Kun (ふところ・なつ・かしい・なつ・かしむ・なつ・く・なつ・ける).
 * Tệp chỉ có `import type` — tải chậm như hanTu.ts.
 */
import type { HanTu } from '@/components/sach-hoc/kanji';

export const HAN_TU_32: Record<string, HanTu> = {
  '歴': {
    hv: 'LỊCH', nghia: 'trải qua; lần lượt', en: 'history / pass through',
    on: ['レキ'], kun: [],
    nho: 'Dưới mái 厂 là hàng cây 林, bên dưới là 止 (bàn chân): bước chân đi QUA lần lượt từng hàng cây = LỊCH (trải qua) → 歴史 = những gì loài người đã trải qua. Khác 暦 (lịch — tờ lịch): dưới là 日 thay cho 止.',
    tu: [
      { w: '{歴史|れきし}', ro: 'rekishi', vi: 'lịch sử' },
      { w: '{歴史的|れきしてき}', ro: 'rekishiteki', vi: 'mang tính lịch sử' },
      { w: '{学歴|がくれき}', ro: 'gakureki', vi: 'học vấn, bằng cấp (N2)' },
      { w: '{履歴書|りれきしょ}', ro: 'rirekisho', vi: 'sơ yếu lý lịch (N2)' },
    ],
  },
  '史': {
    hv: 'SỬ', nghia: 'sử, lịch sử', en: 'history / chronicle',
    on: ['シ'], kun: [],
    nho: 'Hình bàn tay (nét chéo phía dưới) cầm ống thẻ ghi chép (phần 口 có nét dọc xuyên qua): viên quan CHÉP SỬ = SỬ. Khác 使 (使う): 亻 + 吏 — 吏 có thêm một nét ngang trên cùng.',
    tu: [
      { w: '{歴史|れきし}', ro: 'rekishi', vi: 'lịch sử' },
      { w: '{日本史|にほんし}', ro: 'nihonshi', vi: 'lịch sử Nhật Bản (môn học)' },
      { w: '{世界史|せかいし}', ro: 'sekaishi', vi: 'lịch sử thế giới' },
    ],
  },
  '昭': {
    hv: 'CHIÊU', nghia: 'sáng rõ', en: 'shining / bright',
    on: ['ショウ'], kun: [],
    nho: 'Bên trái 日 (mặt trời), bên phải 召 (gọi — gợi âm ショウ; gặp trong 召し上がる, Bài 24): mặt trời chiếu SÁNG RÕ = CHIÊU → 昭和. Khác 照 (chiếu — 照明): 昭 + 灬 (lửa) bên dưới.',
    tu: [
      { w: '{昭和|しょうわ}', ro: 'shouwa', vi: 'thời Showa (1926–1989)' },
      { w: '{昭和時代|しょうわじだい}', ro: 'shouwa jidai', vi: 'thời đại Showa' },
      { w: '{昭和|しょうわ}レトロ', ro: 'shouwa retoro', vi: 'phong cách hoài cổ thời Showa' },
    ],
  },
  '紀': {
    hv: 'KỶ', nghia: 'kỷ (thời kỳ); ghi chép theo thứ tự', en: 'era / chronicle',
    on: ['キ'], kun: [],
    nho: 'Bên trái 糸 (sợi tơ), bên phải 己 (gợi âm キ): gỡ đầu mối sợi tơ rồi XẾP THEO THỨ TỰ = KỶ (kỷ cương; ghi theo năm tháng) → 世紀. Khác 記 (ký — 日記): 言 thay cho 糸, cùng đọc キ.',
    tu: [
      { w: '{世紀|せいき}', ro: 'seiki', vi: 'thế kỷ' },
      { w: '{二十一世紀|にじゅういっせいき}', ro: 'nijuuisseiki', vi: 'thế kỷ 21' },
      { w: '{紀元前|きげんぜん}', ro: 'kigenzen', vi: 'trước Công nguyên (N1)' },
    ],
  },
  '進': {
    hv: 'TIẾN', nghia: 'tiến lên', en: 'advance / progress',
    on: ['シン'], kun: ['すす・む', 'すす・める'],
    nho: '辶 (bước đi) + 隹 (con chim đuôi ngắn): chim chỉ bay về PHÍA TRƯỚC, không bay lùi = TIẾN → 進む, 進歩. Khác 推 (suy — 推理, Bài 31): 扌 + 隹.',
    tu: [
      { w: '{進|すす}む', ro: 'susumu', vi: 'tiến lên, tiến triển' },
      { w: '{進歩|しんぽ}', ro: 'shinpo', vi: 'tiến bộ' },
      { w: '{進化|しんか}', ro: 'shinka', vi: 'tiến hoá' },
      { w: '{進学|しんがく}', ro: 'shingaku', vi: 'học lên (Bài 16)' },
    ],
  },
  '展': {
    hv: 'TRIỂN', nghia: 'mở ra, trải rộng; trưng bày', en: 'unfold / expand / exhibit',
    on: ['テン'], kun: [],
    nho: '尸 (tấm thân, mái che) + phần dưới của 衣 (áo) bị ép lại với hai nét ngang: giũ tấm áo đang gấp cho TRẢI RỘNG ra = TRIỂN → 発展 (phát ra và trải rộng), 展示 (bày ra cho xem).',
    tu: [
      { w: '{発展|はってん}', ro: 'hatten', vi: 'phát triển' },
      { w: '{展示|てんじ}', ro: 'tenji', vi: 'trưng bày (N2)' },
      { w: '{展覧会|てんらんかい}', ro: 'tenrankai', vi: 'cuộc triển lãm (N2)' },
    ],
  },
  '移': {
    hv: 'DI', nghia: 'dời, chuyển', en: 'move / shift',
    on: ['イ'], kun: ['うつ・る', 'うつ・す'],
    nho: 'Bên trái 禾 (cây lúa), bên phải 多 (nhiều): lúa mạ nhiều quá thì nhổ đem CẤY SANG CHỖ KHÁC = DI (dời) → 移る, 移動. ⚠ うつる còn viết 写る (hiện trong ảnh), 映る (phản chiếu) — nghĩa khác.',
    tu: [
      { w: '{移|うつ}る', ro: 'utsuru', vi: 'chuyển sang, dời đến' },
      { w: '{移|うつ}す', ro: 'utsusu', vi: 'dời đi, chuyển (vật)' },
      { w: '{移動|いどう}', ro: 'idou', vi: 'di chuyển (N3)' },
      { w: '{移|うつ}り{変|か}わり', ro: 'utsurikawari', vi: 'sự đổi thay theo thời gian' },
    ],
  },
  '技': {
    hv: 'KỸ', nghia: 'kỹ năng, tay nghề', en: 'skill / technique',
    on: ['ギ'], kun: ['わざ'],
    nho: 'Bên trái 扌 (tay), bên phải 支 (cành — gợi âm): BÀN TAY KHÉO LÉO = KỸ → 技術. Khác 枝 (えだ — cành cây): 木 + 支.',
    tu: [
      { w: '{技術|ぎじゅつ}', ro: 'gijutsu', vi: 'kỹ thuật, công nghệ' },
      { w: '{競技|きょうぎ}', ro: 'kyougi', vi: 'thi đấu (thể thao) (N2)' },
      { w: '{特技|とくぎ}', ro: 'tokugi', vi: 'sở trường (N2)' },
      { w: '{技|わざ}', ro: 'waza', vi: 'chiêu, kỹ thuật (N1)' },
    ],
  },
  '科': {
    hv: 'KHOA', nghia: 'khoa, môn, loại', en: 'department / course / science',
    on: ['カ'], kun: [],
    nho: 'Bên trái 禾 (lúa), bên phải 斗 (cái đấu đong): đong lúa rồi CHIA THEO LOẠI = KHOA (phân loại, môn học) → 科学, 教科書. Khác 料 (料理): 米 + 斗.',
    tu: [
      { w: '{科学|かがく}', ro: 'kagaku', vi: 'khoa học' },
      { w: '{教科書|きょうかしょ}', ro: 'kyoukasho', vi: 'sách giáo khoa' },
      { w: '{科目|かもく}', ro: 'kamoku', vi: 'môn học (N3)' },
      { w: '{内科|ないか}', ro: 'naika', vi: 'khoa nội (N3)' },
    ],
  },
  '器': {
    hv: 'KHÍ', nghia: 'đồ đựng, dụng cụ', en: 'vessel / instrument',
    on: ['キ'], kun: ['うつわ'],
    nho: 'Bốn chữ 口 (bốn cái bát, đĩa) bao quanh 犬 (con chó canh giữ ở giữa): ĐỒ ĐỰNG quý có chó canh = KHÍ (đồ đựng, dụng cụ) → 食器, 楽器.',
    tu: [
      { w: '{楽器|がっき}', ro: 'gakki', vi: 'nhạc cụ (N3)' },
      { w: '{食器|しょっき}', ro: 'shokki', vi: 'bát đĩa (N3)' },
      { w: '{器用|きよう}', ro: 'kiyou', vi: 'khéo tay (N2)' },
      { w: '{機器|きき}', ro: 'kiki', vi: 'thiết bị, máy móc' },
    ],
  },
  '街': {
    hv: 'NHAI', nghia: 'phố, đường phố', en: 'street / town',
    on: ['ガイ', 'カイ'], kun: ['まち'],
    nho: '行 (ngã tư đường — tách làm hai bên) kẹp ở giữa 圭 (hai lớp 土 đất — gợi âm ガイ): con đường lớn, hai bên là nhà đất = NHAI (phố) → 商店街. Khác 術 (技術): giữa 行 là 朮.',
    tu: [
      { w: '{商店街|しょうてんがい}', ro: 'shoutengai', vi: 'phố mua sắm' },
      { w: '{街|まち}', ro: 'machi', vi: 'phố, khu phố (đông vui)' },
      { w: '{街並|まちな}み', ro: 'machinami', vi: 'dãy phố, cảnh phố xá' },
      { w: '{街角|まちかど}', ro: 'machikado', vi: 'góc phố (N2)' },
    ],
  },
  '村': {
    hv: 'THÔN', nghia: 'làng', en: 'village',
    on: ['ソン'], kun: ['むら'],
    nho: 'Bên trái 木 (cây, nhà gỗ), bên phải 寸 (tấc — gợi âm ソン): nơi người dựng nhà gỗ sống QUÂY QUẦN = THÔN (làng) → 村. Khác 材 (材料): 木 + 才.',
    tu: [
      { w: '{村|むら}', ro: 'mura', vi: 'làng' },
      { w: '{村人|むらびと}', ro: 'murabito', vi: 'dân làng' },
      { w: '{農村|のうそん}', ro: 'nouson', vi: 'nông thôn (N2)' },
      { w: '{市町村|しちょうそん}', ro: 'shichouson', vi: 'thành phố, thị trấn, làng (đơn vị hành chính — N2)' },
    ],
  },
  '齢': {
    hv: 'LINH', nghia: 'tuổi', en: 'age',
    on: ['レイ'], kun: [],
    nho: 'Bên trái 歯 (răng — chữ Bài 12), bên phải 令 (gợi âm レイ; 命令 — Bài 23): xưa người ta XEM RĂNG ĐỂ BIẾT TUỔI (của trâu, ngựa) = LINH (tuổi) → 年齢, 高齢者. Cùng đọc レイ với 令, 冷.',
    tu: [
      { w: '{年齢|ねんれい}', ro: 'nenrei', vi: 'tuổi tác' },
      { w: '{高齢者|こうれいしゃ}', ro: 'koureisha', vi: 'người cao tuổi (Bài 28)' },
      { w: '{高齢化|こうれいか}', ro: 'koureika', vi: 'già hoá dân số (Bài 27)' },
    ],
  },
  '老': {
    hv: 'LÃO', nghia: 'già', en: 'old / aged',
    on: ['ロウ'], kun: ['お・いる', 'ふ・ける'],
    nho: 'Trên là 耂 (người tóc dài), dưới là 匕 (người cúi gập, chống gậy): ÔNG LÃO tóc dài lưng còng = LÃO → 老人. Khác 考 (考える — Bài 16): cùng 耂, dưới là 丂.',
    tu: [
      { w: '{老人|ろうじん}', ro: 'roujin', vi: 'người già' },
      { w: '{老後|ろうご}', ro: 'rougo', vi: 'tuổi già, lúc về già (N2)' },
      { w: '{老|お}いる', ro: 'oiru', vi: 'già đi (N2)' },
      { w: '{敬老|けいろう}の{日|ひ}', ro: 'keirou no hi', vi: 'ngày kính lão' },
    ],
  },
  '孫': {
    hv: 'TÔN', nghia: 'cháu', en: 'grandchild',
    on: ['ソン'], kun: ['まご'],
    nho: 'Bên trái 子 (con), bên phải 系 (sợi tơ nối dài — hệ): con của con, NỐI TIẾP dòng họ = TÔN (cháu) → 孫, 子孫. Khác 係 (係員 — Bài 24): 亻 + 系.',
    tu: [
      { w: '{孫|まご}', ro: 'mago', vi: 'cháu (con của con)' },
      { w: 'お{孫|まご}さん', ro: 'omago-san', vi: 'cháu (của người khác — kính)' },
      { w: '{子孫|しそん}', ro: 'shison', vi: 'con cháu, hậu duệ (N2)' },
    ],
  },
  '懐': {
    hv: 'HOÀI', nghia: 'nhớ nhung; ôm ấp; ngực áo', en: 'nostalgia / bosom',
    on: ['カイ'], kun: ['ふところ', 'なつ・かしい', 'なつ・かしむ', 'なつ・く', 'なつ・ける'],
    nho: 'Bên trái 忄 (trái tim), bên phải là phần "giấu vật trong vạt áo" (十 + 罒 + phần dưới của 衣): ÔM ẤP TRONG LÒNG, giữ trong ngực áo = HOÀI (nhớ nhung) → 懐かしい, 懐. Khác 壊 (壊す — Bài 15): cùng phần phải, nhưng trái là 土 (đất — nhà đổ).',
    tu: [
      { w: '{懐|なつ}かしい', ro: 'natsukashii', vi: 'nhớ, bồi hồi (Bài 23)' },
      { w: '{懐|なつ}かしむ', ro: 'natsukashimu', vi: 'hoài niệm (N1)' },
      { w: '{懐|ふところ}', ro: 'futokoro', vi: 'ngực áo; túi tiền (N1)' },
    ],
  },
  '憶': {
    hv: 'ỨC', nghia: 'nhớ', en: 'memory / recollect',
    on: ['オク'], kun: [],
    nho: 'Bên trái 忄 (trái tim), bên phải 意 (ý — 意味, Bài 16; gợi âm オク): điều TRONG LÒNG cứ nghĩ đến mãi = ỨC (nhớ) → 記憶. Khác 億 (trăm triệu — 一億): 亻 + 意, cùng đọc オク.',
    tu: [
      { w: '{記憶|きおく}', ro: 'kioku', vi: 'ký ức, trí nhớ (Bài 31)' },
      { w: '{記憶力|きおくりょく}', ro: 'kiokuryoku', vi: 'khả năng ghi nhớ' },
    ],
  },
  '流': {
    hv: 'LƯU', nghia: 'chảy; lan truyền; dòng, phái', en: 'flow / current',
    on: ['リュウ', 'ル'], kun: ['なが・れる', 'なが・す'],
    nho: 'Bên trái 氵 (nước), bên phải 亠 + 厶 + ba nét như 川 ở dưới: nước từ trên đổ xuống thành DÒNG = LƯU (chảy) → 流れる, 流行 (cái mới "chảy" lan khắp nơi). ⚠ Đồng âm 留 (lưu lại — 留学): cùng đọc リュウ, chữ khác hẳn.',
    tu: [
      { w: '{流|なが}れる', ro: 'nagareru', vi: 'chảy, trôi' },
      { w: '{流|なが}す', ro: 'nagasu', vi: 'xả, cho chảy' },
      { w: '{流行|りゅうこう}', ro: 'ryuukou', vi: 'thịnh hành' },
      { w: '{交流|こうりゅう}', ro: 'kouryuu', vi: 'giao lưu (Bài 26)' },
      { w: '{一流|いちりゅう}', ro: 'ichiryuu', vi: 'hạng nhất (N2)' },
    ],
  },
  '未': {
    hv: 'VỊ', nghia: 'chưa', en: 'not yet',
    on: ['ミ'], kun: [],
    nho: 'Chữ 木 (cây) với NÉT NGANG TRÊN NGẮN hơn nét dưới: ngọn cây chưa lớn hết = VỊ (chưa) → 未来 (cái chưa đến). Khác 末 (週末): nét trên DÀI hơn — ngọn cây là phần CUỐI = MẠT.',
    tu: [
      { w: '{未来|みらい}', ro: 'mirai', vi: 'tương lai' },
      { w: '{未成年|みせいねん}', ro: 'miseinen', vi: 'vị thành niên (N2)' },
      { w: '{未定|みてい}', ro: 'mitei', vi: 'chưa quyết định (N2)' },
      { w: '{未満|みまん}', ro: 'miman', vi: 'dưới, chưa đến (N2)' },
    ],
  },
  '常': {
    hv: 'THƯỜNG', nghia: 'thường, luôn luôn', en: 'usual / always',
    on: ['ジョウ'], kun: ['つね', 'とこ'],
    nho: 'Trên là 尚 (thượng — gợi âm ジョウ), dưới là 巾 (tấm vải): tấm vải DÙNG NGÀY NÀY QUA NGÀY KHÁC = THƯỜNG → 日常, 常識. Khác 堂 (食堂 — Bài 16): dưới là 土; 賞 (thưởng): dưới là 貝.',
    tu: [
      { w: '{日常|にちじょう}', ro: 'nichijou', vi: 'thường ngày' },
      { w: '{常識|じょうしき}', ro: 'joushiki', vi: 'lẽ thường, hiểu biết thông thường' },
      { w: '{非常|ひじょう}に', ro: 'hijou ni', vi: 'vô cùng (N3)' },
      { w: '{非常口|ひじょうぐち}', ro: 'hijouguchi', vi: 'lối thoát hiểm (N3)' },
      { w: '{常|つね}に', ro: 'tsune ni', vi: 'luôn luôn (N2)' },
    ],
  },
};
