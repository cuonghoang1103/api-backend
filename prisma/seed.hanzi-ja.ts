/**
 * seed.hanzi-ja.ts — the N5 kanji set, with meanings, readings and mnemonics.
 *
 * Stroke geometry is NOT here (hanzi-writer-data has all of it). This seeds what
 * that data cannot know: the Vietnamese meaning, the on/kun readings, a mnemonic
 * and the compound words that make a character stick. Illustrations are left for
 * the admin to upload.
 *
 * Idempotent: upsert by (language, char). Re-running never duplicates, and it
 * never overwrites an admin's edits to mnemonic/images — only fills gaps.
 *
 *   docker exec cuonghoangdev_backend npx tsx prisma/seed.hanzi-ja.ts
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface K {
  c: string; s: number; on: string; kun: string; m: string; rad: string;
  mn: string; ex: Array<{ word: string; reading: string; meaningVi: string }>;
}

// N5 (JLPT) — the ~80 characters a beginner meets first, ordered by how early
// they are actually needed rather than by stroke count.
const N5: K[] = [
  { c: '日', s: 4, on: 'ニチ、ジツ', kun: 'ひ、か', m: 'Ngày, mặt trời', rad: '日', mn: 'Hình mặt trời có chấm ở giữa — người xưa vẽ mặt trời là vòng tròn có tâm, viết vuông lại thành 日.', ex: [{ word: '日本', reading: 'にほん', meaningVi: 'Nhật Bản' }, { word: '毎日', reading: 'まいにち', meaningVi: 'mỗi ngày' }] },
  { c: '月', s: 4, on: 'ゲツ、ガツ', kun: 'つき', m: 'Tháng, mặt trăng', rad: '月', mn: 'Hình mặt trăng khuyết. Trăng tròn một vòng là một tháng.', ex: [{ word: '月曜日', reading: 'げつようび', meaningVi: 'thứ Hai' }, { word: '一月', reading: 'いちがつ', meaningVi: 'tháng Một' }] },
  { c: '火', s: 4, on: 'カ', kun: 'ひ', m: 'Lửa', rad: '火', mn: 'Hình ngọn lửa bùng lên với tàn lửa bắn hai bên.', ex: [{ word: '火曜日', reading: 'かようび', meaningVi: 'thứ Ba' }, { word: '花火', reading: 'はなび', meaningVi: 'pháo hoa' }] },
  { c: '水', s: 4, on: 'スイ', kun: 'みず', m: 'Nước', rad: '水', mn: 'Hình dòng nước chảy, có nhánh toả hai bên.', ex: [{ word: '水曜日', reading: 'すいようび', meaningVi: 'thứ Tư' }, { word: 'お水', reading: 'おみず', meaningVi: 'nước (uống)' }] },
  { c: '木', s: 4, on: 'モク、ボク', kun: 'き', m: 'Cây, gỗ', rad: '木', mn: 'Hình cái cây: thân đứng, cành ngang, rễ toả xuống.', ex: [{ word: '木曜日', reading: 'もくようび', meaningVi: 'thứ Năm' }, { word: '木', reading: 'き', meaningVi: 'cây' }] },
  { c: '金', s: 8, on: 'キン、コン', kun: 'かね', m: 'Vàng, tiền, kim loại', rad: '金', mn: 'Mái nhà che hai hạt vàng chôn dưới đất — của quý phải cất kỹ.', ex: [{ word: '金曜日', reading: 'きんようび', meaningVi: 'thứ Sáu' }, { word: 'お金', reading: 'おかね', meaningVi: 'tiền' }] },
  { c: '土', s: 3, on: 'ド、ト', kun: 'つち', m: 'Đất', rad: '土', mn: 'Mầm cây (十) nhú lên khỏi mặt đất (一).', ex: [{ word: '土曜日', reading: 'どようび', meaningVi: 'thứ Bảy' }, { word: '土地', reading: 'とち', meaningVi: 'đất đai' }] },
  { c: '一', s: 1, on: 'イチ', kun: 'ひと(つ)', m: 'Một', rad: '一', mn: 'Một nét ngang = một.', ex: [{ word: '一つ', reading: 'ひとつ', meaningVi: 'một cái' }, { word: '一人', reading: 'ひとり', meaningVi: 'một người' }] },
  { c: '二', s: 2, on: 'ニ', kun: 'ふた(つ)', m: 'Hai', rad: '二', mn: 'Hai nét ngang = hai.', ex: [{ word: '二つ', reading: 'ふたつ', meaningVi: 'hai cái' }, { word: '二月', reading: 'にがつ', meaningVi: 'tháng Hai' }] },
  { c: '三', s: 3, on: 'サン', kun: 'みっ(つ)', m: 'Ba', rad: '一', mn: 'Ba nét ngang = ba.', ex: [{ word: '三つ', reading: 'みっつ', meaningVi: 'ba cái' }, { word: '三人', reading: 'さんにん', meaningVi: 'ba người' }] },
  { c: '四', s: 5, on: 'シ', kun: 'よん、よっ(つ)', m: 'Bốn', rad: '囗', mn: 'Cái hộp có hai chân bên trong — không còn vẽ 4 gạch được nên đổi hình.', ex: [{ word: '四つ', reading: 'よっつ', meaningVi: 'bốn cái' }, { word: '四月', reading: 'しがつ', meaningVi: 'tháng Tư' }] },
  { c: '五', s: 4, on: 'ゴ', kun: 'いつ(つ)', m: 'Năm', rad: '二', mn: 'Hai vạch trời đất kẹp một chữ X ở giữa.', ex: [{ word: '五つ', reading: 'いつつ', meaningVi: 'năm cái' }, { word: '五月', reading: 'ごがつ', meaningVi: 'tháng Năm' }] },
  { c: '六', s: 4, on: 'ロク', kun: 'むっ(つ)', m: 'Sáu', rad: '八', mn: 'Cái nón có hai chân — nhớ hình túp lều.', ex: [{ word: '六つ', reading: 'むっつ', meaningVi: 'sáu cái' }, { word: '六月', reading: 'ろくがつ', meaningVi: 'tháng Sáu' }] },
  { c: '七', s: 2, on: 'シチ', kun: 'なな(つ)', m: 'Bảy', rad: '一', mn: 'Giống số 7 lật ngược.', ex: [{ word: '七つ', reading: 'ななつ', meaningVi: 'bảy cái' }, { word: '七月', reading: 'しちがつ', meaningVi: 'tháng Bảy' }] },
  { c: '八', s: 2, on: 'ハチ', kun: 'やっ(つ)', m: 'Tám', rad: '八', mn: 'Hai nét xoè ra như số 8 mở.', ex: [{ word: '八つ', reading: 'やっつ', meaningVi: 'tám cái' }, { word: '八月', reading: 'はちがつ', meaningVi: 'tháng Tám' }] },
  { c: '九', s: 2, on: 'キュウ、ク', kun: 'ここの(つ)', m: 'Chín', rad: '乙', mn: 'Giống số 9 viết vội.', ex: [{ word: '九つ', reading: 'ここのつ', meaningVi: 'chín cái' }, { word: '九月', reading: 'くがつ', meaningVi: 'tháng Chín' }] },
  { c: '十', s: 2, on: 'ジュウ', kun: 'とお', m: 'Mười', rad: '十', mn: 'Dấu cộng = mười (đủ hai bàn tay).', ex: [{ word: '十', reading: 'じゅう', meaningVi: 'mười' }, { word: '十月', reading: 'じゅうがつ', meaningVi: 'tháng Mười' }] },
  { c: '百', s: 6, on: 'ヒャク', kun: '', m: 'Trăm', rad: '白', mn: 'Một (一) chồng lên trắng (白) — một trăm.', ex: [{ word: '百', reading: 'ひゃく', meaningVi: 'một trăm' }, { word: '八百屋', reading: 'やおや', meaningVi: 'tiệm rau' }] },
  { c: '千', s: 3, on: 'セン', kun: 'ち', m: 'Nghìn', rad: '十', mn: 'Chữ mười (十) có thêm nét phẩy trên đầu.', ex: [{ word: '千', reading: 'せん', meaningVi: 'một nghìn' }, { word: '千円', reading: 'せんえん', meaningVi: 'một nghìn yên' }] },
  { c: '万', s: 3, on: 'マン、バン', kun: '', m: 'Vạn (mười nghìn)', rad: '一', mn: 'Ba nét đơn giản nhưng là số lớn nhất trong bộ số cơ bản.', ex: [{ word: '一万', reading: 'いちまん', meaningVi: 'mười nghìn' }, { word: '万年筆', reading: 'まんねんひつ', meaningVi: 'bút máy' }] },
  { c: '円', s: 4, on: 'エン', kun: 'まる(い)', m: 'Yên, tròn', rad: '冂', mn: 'Đồng tiền tròn trong khung — đơn vị tiền Nhật.', ex: [{ word: '百円', reading: 'ひゃくえん', meaningVi: 'một trăm yên' }, { word: '円い', reading: 'まるい', meaningVi: 'tròn' }] },
  { c: '人', s: 2, on: 'ジン、ニン', kun: 'ひと', m: 'Người', rad: '人', mn: 'Hình người đang bước, hai chân dang ra.', ex: [{ word: '日本人', reading: 'にほんじん', meaningVi: 'người Nhật' }, { word: '一人', reading: 'ひとり', meaningVi: 'một người' }] },
  { c: '子', s: 3, on: 'シ、ス', kun: 'こ', m: 'Con, trẻ con', rad: '子', mn: 'Em bé quấn tã, hai tay giơ ra.', ex: [{ word: '子ども', reading: 'こども', meaningVi: 'trẻ con' }, { word: '女子', reading: 'じょし', meaningVi: 'nữ' }] },
  { c: '女', s: 3, on: 'ジョ', kun: 'おんな', m: 'Nữ, phụ nữ', rad: '女', mn: 'Hình người phụ nữ đang ngồi khoanh chân.', ex: [{ word: '女の人', reading: 'おんなのひと', meaningVi: 'phụ nữ' }, { word: '彼女', reading: 'かのじょ', meaningVi: 'cô ấy' }] },
  { c: '男', s: 7, on: 'ダン、ナン', kun: 'おとこ', m: 'Nam, đàn ông', rad: '田', mn: 'Ruộng (田) + sức (力) — người dùng sức làm ruộng là đàn ông.', ex: [{ word: '男の人', reading: 'おとこのひと', meaningVi: 'đàn ông' }, { word: '男子', reading: 'だんし', meaningVi: 'nam' }] },
  { c: '父', s: 4, on: 'フ', kun: 'ちち、とう', m: 'Cha', rad: '父', mn: 'Hình bàn tay cầm rìu — người đàn ông trụ cột.', ex: [{ word: 'お父さん', reading: 'おとうさん', meaningVi: 'bố (lịch sự)' }, { word: '父', reading: 'ちち', meaningVi: 'bố (mình)' }] },
  { c: '母', s: 5, on: 'ボ', kun: 'はは、かあ', m: 'Mẹ', rad: '毋', mn: 'Hình người mẹ có hai chấm là bầu ngực cho con bú.', ex: [{ word: 'お母さん', reading: 'おかあさん', meaningVi: 'mẹ (lịch sự)' }, { word: '母', reading: 'はは', meaningVi: 'mẹ (mình)' }] },
  { c: '友', s: 4, on: 'ユウ', kun: 'とも', m: 'Bạn', rad: '又', mn: 'Hai bàn tay nắm lấy nhau — tình bạn.', ex: [{ word: '友だち', reading: 'ともだち', meaningVi: 'bạn bè' }, { word: '親友', reading: 'しんゆう', meaningVi: 'bạn thân' }] },
  { c: '先', s: 6, on: 'セン', kun: 'さき', m: 'Trước, đi đầu', rad: '儿', mn: 'Bàn chân bước lên phía trước người.', ex: [{ word: '先生', reading: 'せんせい', meaningVi: 'thầy/cô giáo' }, { word: '先週', reading: 'せんしゅう', meaningVi: 'tuần trước' }] },
  { c: '生', s: 5, on: 'セイ、ショウ', kun: 'い(きる)、う(まれる)', m: 'Sinh, sống', rad: '生', mn: 'Mầm cây mọc lên khỏi mặt đất — sự sống.', ex: [{ word: '学生', reading: 'がくせい', meaningVi: 'học sinh' }, { word: '生きる', reading: 'いきる', meaningVi: 'sống' }] },
  { c: '学', s: 8, on: 'ガク', kun: 'まな(ぶ)', m: 'Học', rad: '子', mn: 'Mái nhà che đứa trẻ (子) đang học.', ex: [{ word: '学校', reading: 'がっこう', meaningVi: 'trường học' }, { word: '大学', reading: 'だいがく', meaningVi: 'đại học' }] },
  { c: '校', s: 10, on: 'コウ', kun: '', m: 'Trường', rad: '木', mn: 'Gỗ (木) + giao (交) — ngôi nhà gỗ nơi mọi người gặp nhau.', ex: [{ word: '学校', reading: 'がっこう', meaningVi: 'trường học' }, { word: '高校', reading: 'こうこう', meaningVi: 'trung học phổ thông' }] },
  { c: '大', s: 3, on: 'ダイ、タイ', kun: 'おお(きい)', m: 'To, lớn', rad: '大', mn: 'Người (人) dang rộng hai tay hết cỡ — to.', ex: [{ word: '大きい', reading: 'おおきい', meaningVi: 'to' }, { word: '大学', reading: 'だいがく', meaningVi: 'đại học' }] },
  { c: '小', s: 3, on: 'ショウ', kun: 'ちい(さい)', m: 'Nhỏ', rad: '小', mn: 'Ba hạt nhỏ rơi xuống.', ex: [{ word: '小さい', reading: 'ちいさい', meaningVi: 'nhỏ' }, { word: '小学校', reading: 'しょうがっこう', meaningVi: 'tiểu học' }] },
  { c: '中', s: 4, on: 'チュウ', kun: 'なか', m: 'Trong, giữa', rad: '丨', mn: 'Mũi tên xuyên qua chính giữa cái hộp.', ex: [{ word: '中国', reading: 'ちゅうごく', meaningVi: 'Trung Quốc' }, { word: '中', reading: 'なか', meaningVi: 'bên trong' }] },
  { c: '上', s: 3, on: 'ジョウ', kun: 'うえ、あ(げる)', m: 'Trên', rad: '一', mn: 'Vạch chỉ lên phía trên đường ngang.', ex: [{ word: '上', reading: 'うえ', meaningVi: 'phía trên' }, { word: '上手', reading: 'じょうず', meaningVi: 'giỏi' }] },
  { c: '下', s: 3, on: 'カ、ゲ', kun: 'した、さ(げる)', m: 'Dưới', rad: '一', mn: 'Vạch chỉ xuống dưới đường ngang — ngược của 上.', ex: [{ word: '下', reading: 'した', meaningVi: 'phía dưới' }, { word: '地下', reading: 'ちか', meaningVi: 'tầng hầm' }] },
  { c: '左', s: 5, on: 'サ', kun: 'ひだり', m: 'Trái', rad: '工', mn: 'Tay (⿰) cầm thước thợ (工) — tay trái giữ đồ.', ex: [{ word: '左', reading: 'ひだり', meaningVi: 'bên trái' }, { word: '左手', reading: 'ひだりて', meaningVi: 'tay trái' }] },
  { c: '右', s: 5, on: 'ウ、ユウ', kun: 'みぎ', m: 'Phải', rad: '口', mn: 'Tay cầm cái miệng (口) — tay phải đưa đồ ăn lên miệng.', ex: [{ word: '右', reading: 'みぎ', meaningVi: 'bên phải' }, { word: '右手', reading: 'みぎて', meaningVi: 'tay phải' }] },
  { c: '前', s: 9, on: 'ゼン', kun: 'まえ', m: 'Trước', rad: '刂', mn: 'Con thuyền tiến về phía trước.', ex: [{ word: '前', reading: 'まえ', meaningVi: 'phía trước' }, { word: '午前', reading: 'ごぜん', meaningVi: 'buổi sáng' }] },
  { c: '後', s: 9, on: 'ゴ、コウ', kun: 'あと、うし(ろ)', m: 'Sau', rad: '彳', mn: 'Bước chân đi chậm phía sau.', ex: [{ word: '後ろ', reading: 'うしろ', meaningVi: 'phía sau' }, { word: '午後', reading: 'ごご', meaningVi: 'buổi chiều' }] },
  { c: '外', s: 5, on: 'ガイ', kun: 'そと', m: 'Ngoài', rad: '夕', mn: 'Chiều tối (夕) mà bói toán (卜) — làm ở ngoài lệ thường.', ex: [{ word: '外', reading: 'そと', meaningVi: 'bên ngoài' }, { word: '外国', reading: 'がいこく', meaningVi: 'nước ngoài' }] },
  { c: '国', s: 8, on: 'コク', kun: 'くに', m: 'Nước, quốc gia', rad: '囗', mn: 'Vòng biên giới (囗) bao quanh ngọc quý (玉).', ex: [{ word: '外国', reading: 'がいこく', meaningVi: 'nước ngoài' }, { word: '国', reading: 'くに', meaningVi: 'đất nước' }] },
  { c: '本', s: 5, on: 'ホン', kun: 'もと', m: 'Sách, gốc', rad: '木', mn: 'Cây (木) có vạch ở gốc rễ — cái gốc, và sách làm từ gỗ.', ex: [{ word: '本', reading: 'ほん', meaningVi: 'sách' }, { word: '日本', reading: 'にほん', meaningVi: 'Nhật Bản' }] },
  { c: '山', s: 3, on: 'サン', kun: 'やま', m: 'Núi', rad: '山', mn: 'Ba đỉnh núi nhấp nhô.', ex: [{ word: '山', reading: 'やま', meaningVi: 'núi' }, { word: '富士山', reading: 'ふじさん', meaningVi: 'núi Phú Sĩ' }] },
  { c: '川', s: 3, on: 'セン', kun: 'かわ', m: 'Sông', rad: '川', mn: 'Ba dòng nước chảy song song.', ex: [{ word: '川', reading: 'かわ', meaningVi: 'sông' }, { word: '小川', reading: 'おがわ', meaningVi: 'suối nhỏ' }] },
  { c: '田', s: 5, on: 'デン', kun: 'た', m: 'Ruộng', rad: '田', mn: 'Thửa ruộng nhìn từ trên xuống, chia thành 4 ô.', ex: [{ word: '田んぼ', reading: 'たんぼ', meaningVi: 'ruộng lúa' }, { word: '山田', reading: 'やまだ', meaningVi: 'Yamada (họ)' }] },
  { c: '天', s: 4, on: 'テン', kun: 'あま', m: 'Trời', rad: '大', mn: 'Người lớn (大) đội một vạch trên đầu — bầu trời.', ex: [{ word: '天気', reading: 'てんき', meaningVi: 'thời tiết' }, { word: '天ぷら', reading: 'てんぷら', meaningVi: 'tempura' }] },
  { c: '気', s: 6, on: 'キ、ケ', kun: '', m: 'Khí, tinh thần', rad: '气', mn: 'Hơi bốc lên từ nồi cơm — khí, hơi, tâm trạng.', ex: [{ word: '天気', reading: 'てんき', meaningVi: 'thời tiết' }, { word: '元気', reading: 'げんき', meaningVi: 'khoẻ' }] },
  { c: '雨', s: 8, on: 'ウ', kun: 'あめ', m: 'Mưa', rad: '雨', mn: 'Đám mây có 4 giọt nước rơi xuống.', ex: [{ word: '雨', reading: 'あめ', meaningVi: 'mưa' }, { word: '大雨', reading: 'おおあめ', meaningVi: 'mưa to' }] },
  { c: '花', s: 7, on: 'カ', kun: 'はな', m: 'Hoa', rad: '艹', mn: 'Bộ cỏ (艹) + hoá (化) — cây cỏ biến hoá thành hoa.', ex: [{ word: '花', reading: 'はな', meaningVi: 'hoa' }, { word: '花見', reading: 'はなみ', meaningVi: 'ngắm hoa anh đào' }] },
  { c: '魚', s: 11, on: 'ギョ', kun: 'さかな', m: 'Cá', rad: '魚', mn: 'Hình con cá: đầu, thân có vảy, đuôi là 4 chấm.', ex: [{ word: '魚', reading: 'さかな', meaningVi: 'cá' }, { word: '金魚', reading: 'きんぎょ', meaningVi: 'cá vàng' }] },
  { c: '車', s: 7, on: 'シャ', kun: 'くるま', m: 'Xe', rad: '車', mn: 'Chiếc xe nhìn từ trên: trục và hai bánh.', ex: [{ word: '車', reading: 'くるま', meaningVi: 'ô tô' }, { word: '電車', reading: 'でんしゃ', meaningVi: 'tàu điện' }] },
  { c: '電', s: 13, on: 'デン', kun: '', m: 'Điện', rad: '雨', mn: 'Mưa (雨) + tia chớp loằng ngoằng — sấm sét sinh ra điện.', ex: [{ word: '電気', reading: 'でんき', meaningVi: 'điện, đèn' }, { word: '電話', reading: 'でんわ', meaningVi: 'điện thoại' }] },
  { c: '話', s: 13, on: 'ワ', kun: 'はな(す)', m: 'Nói chuyện', rad: '言', mn: 'Lời nói (言) + lưỡi (舌) — dùng lưỡi để nói.', ex: [{ word: '話す', reading: 'はなす', meaningVi: 'nói' }, { word: '電話', reading: 'でんわ', meaningVi: 'điện thoại' }] },
  { c: '語', s: 14, on: 'ゴ', kun: 'かた(る)', m: 'Ngôn ngữ', rad: '言', mn: 'Lời nói (言) + năm (五) + miệng (口) — nhiều miệng nói thành một thứ tiếng.', ex: [{ word: '日本語', reading: 'にほんご', meaningVi: 'tiếng Nhật' }, { word: '英語', reading: 'えいご', meaningVi: 'tiếng Anh' }] },
  { c: '読', s: 14, on: 'ドク', kun: 'よ(む)', m: 'Đọc', rad: '言', mn: 'Lời nói (言) + bán (売) — đọc to lên như người bán rao hàng.', ex: [{ word: '読む', reading: 'よむ', meaningVi: 'đọc' }, { word: '読書', reading: 'どくしょ', meaningVi: 'việc đọc sách' }] },
  { c: '書', s: 10, on: 'ショ', kun: 'か(く)', m: 'Viết', rad: '曰', mn: 'Bàn tay cầm bút (聿) viết lên tấm thẻ.', ex: [{ word: '書く', reading: 'かく', meaningVi: 'viết' }, { word: '辞書', reading: 'じしょ', meaningVi: 'từ điển' }] },
  { c: '聞', s: 14, on: 'ブン、モン', kun: 'き(く)', m: 'Nghe', rad: '耳', mn: 'Cái tai (耳) áp vào cánh cổng (門) để nghe lén.', ex: [{ word: '聞く', reading: 'きく', meaningVi: 'nghe, hỏi' }, { word: '新聞', reading: 'しんぶん', meaningVi: 'báo' }] },
  { c: '見', s: 7, on: 'ケン', kun: 'み(る)', m: 'Nhìn, xem', rad: '見', mn: 'Con mắt (目) đặt trên đôi chân — mắt đi tìm để nhìn.', ex: [{ word: '見る', reading: 'みる', meaningVi: 'xem, nhìn' }, { word: '花見', reading: 'はなみ', meaningVi: 'ngắm hoa' }] },
  { c: '行', s: 6, on: 'コウ、ギョウ', kun: 'い(く)', m: 'Đi', rad: '行', mn: 'Ngã tư đường — nơi người ta đi qua.', ex: [{ word: '行く', reading: 'いく', meaningVi: 'đi' }, { word: '銀行', reading: 'ぎんこう', meaningVi: 'ngân hàng' }] },
  { c: '来', s: 7, on: 'ライ', kun: 'く(る)', m: 'Đến', rad: '木', mn: 'Cây lúa chín — mùa gặt đến.', ex: [{ word: '来る', reading: 'くる', meaningVi: 'đến' }, { word: '来年', reading: 'らいねん', meaningVi: 'năm sau' }] },
  { c: '食', s: 9, on: 'ショク', kun: 'た(べる)', m: 'Ăn', rad: '食', mn: 'Mái nhà che bát cơm — vào nhà là ăn.', ex: [{ word: '食べる', reading: 'たべる', meaningVi: 'ăn' }, { word: '食堂', reading: 'しょくどう', meaningVi: 'nhà ăn' }] },
  { c: '飲', s: 12, on: 'イン', kun: 'の(む)', m: 'Uống', rad: '食', mn: 'Ăn (食) + há miệng (欠) — há miệng ra mà uống.', ex: [{ word: '飲む', reading: 'のむ', meaningVi: 'uống' }, { word: '飲み物', reading: 'のみもの', meaningVi: 'đồ uống' }] },
  { c: '出', s: 5, on: 'シュツ', kun: 'で(る)、だ(す)', m: 'Ra', rad: '凵', mn: 'Hai ngọn núi chồng lên — mầm chui ra khỏi hang.', ex: [{ word: '出る', reading: 'でる', meaningVi: 'ra ngoài' }, { word: '出口', reading: 'でぐち', meaningVi: 'lối ra' }] },
  { c: '入', s: 2, on: 'ニュウ', kun: 'はい(る)、い(れる)', m: 'Vào', rad: '入', mn: 'Mũi tên chúc xuống chui vào — ngược với 人.', ex: [{ word: '入る', reading: 'はいる', meaningVi: 'đi vào' }, { word: '入口', reading: 'いりぐち', meaningVi: 'lối vào' }] },
  { c: '口', s: 3, on: 'コウ', kun: 'くち', m: 'Miệng', rad: '口', mn: 'Cái miệng há ra hình vuông.', ex: [{ word: '口', reading: 'くち', meaningVi: 'miệng' }, { word: '入口', reading: 'いりぐち', meaningVi: 'lối vào' }] },
  { c: '目', s: 5, on: 'モク', kun: 'め', m: 'Mắt', rad: '目', mn: 'Con mắt dựng đứng, có con ngươi ở giữa.', ex: [{ word: '目', reading: 'め', meaningVi: 'mắt' }, { word: '目的', reading: 'もくてき', meaningVi: 'mục đích' }] },
  { c: '耳', s: 6, on: 'ジ', kun: 'みみ', m: 'Tai', rad: '耳', mn: 'Hình cái tai với vành tai.', ex: [{ word: '耳', reading: 'みみ', meaningVi: 'tai' }, { word: '耳鼻科', reading: 'じびか', meaningVi: 'khoa tai mũi họng' }] },
  { c: '手', s: 4, on: 'シュ', kun: 'て', m: 'Tay', rad: '手', mn: 'Bàn tay xoè năm ngón.', ex: [{ word: '手', reading: 'て', meaningVi: 'tay' }, { word: '上手', reading: 'じょうず', meaningVi: 'giỏi' }] },
  { c: '足', s: 7, on: 'ソク', kun: 'あし', m: 'Chân, đủ', rad: '足', mn: 'Đầu gối (口) đặt trên bàn chân (止).', ex: [{ word: '足', reading: 'あし', meaningVi: 'chân' }, { word: '足りる', reading: 'たりる', meaningVi: 'đủ' }] },
  { c: '名', s: 6, on: 'メイ', kun: 'な', m: 'Tên', rad: '口', mn: 'Chiều tối (夕) phải xưng miệng (口) báo tên vì không nhìn rõ mặt.', ex: [{ word: '名前', reading: 'なまえ', meaningVi: 'tên' }, { word: '有名', reading: 'ゆうめい', meaningVi: 'nổi tiếng' }] },
  { c: '年', s: 6, on: 'ネン', kun: 'とし', m: 'Năm, tuổi', rad: '干', mn: 'Người vác bó lúa — một vụ mùa là một năm.', ex: [{ word: '今年', reading: 'ことし', meaningVi: 'năm nay' }, { word: '来年', reading: 'らいねん', meaningVi: 'năm sau' }] },
  { c: '時', s: 10, on: 'ジ', kun: 'とき', m: 'Giờ, lúc', rad: '日', mn: 'Mặt trời (日) + chùa (寺) — chuông chùa báo giờ theo mặt trời.', ex: [{ word: '時間', reading: 'じかん', meaningVi: 'thời gian' }, { word: '何時', reading: 'なんじ', meaningVi: 'mấy giờ' }] },
  { c: '間', s: 12, on: 'カン、ケン', kun: 'あいだ', m: 'Khoảng, giữa', rad: '門', mn: 'Mặt trời (日) lọt qua khe cổng (門) — khoảng trống.', ex: [{ word: '時間', reading: 'じかん', meaningVi: 'thời gian' }, { word: '人間', reading: 'にんげん', meaningVi: 'con người' }] },
  { c: '分', s: 4, on: 'ブン、フン', kun: 'わ(かる)', m: 'Phút, chia, hiểu', rad: '刀', mn: 'Con dao (刀) chia (八) vật ra — chia nhỏ, phút là phần nhỏ của giờ.', ex: [{ word: '分かる', reading: 'わかる', meaningVi: 'hiểu' }, { word: '五分', reading: 'ごふん', meaningVi: 'năm phút' }] },
  { c: '今', s: 4, on: 'コン', kun: 'いま', m: 'Bây giờ', rad: '人', mn: 'Mái nhà che một khoảnh khắc — ngay lúc này.', ex: [{ word: '今', reading: 'いま', meaningVi: 'bây giờ' }, { word: '今日', reading: 'きょう', meaningVi: 'hôm nay' }] },
  { c: '何', s: 7, on: 'カ', kun: 'なに、なん', m: 'Cái gì', rad: '亻', mn: 'Người (亻) mang gánh (可) và hỏi: cái gì đây?', ex: [{ word: '何', reading: 'なに', meaningVi: 'cái gì' }, { word: '何時', reading: 'なんじ', meaningVi: 'mấy giờ' }] },
  { c: '毎', s: 6, on: 'マイ', kun: '', m: 'Mỗi', rad: '毋', mn: 'Giống chữ mẹ (母) có thêm nét — mẹ làm việc đó mỗi ngày.', ex: [{ word: '毎日', reading: 'まいにち', meaningVi: 'mỗi ngày' }, { word: '毎年', reading: 'まいとし', meaningVi: 'mỗi năm' }] },
  { c: '高', s: 10, on: 'コウ', kun: 'たか(い)', m: 'Cao, đắt', rad: '高', mn: 'Toà tháp nhiều tầng — cao.', ex: [{ word: '高い', reading: 'たかい', meaningVi: 'cao, đắt' }, { word: '高校', reading: 'こうこう', meaningVi: 'trung học' }] },
  { c: '安', s: 6, on: 'アン', kun: 'やす(い)', m: 'Rẻ, yên', rad: '宀', mn: 'Người phụ nữ (女) ở trong nhà (宀) — yên ổn.', ex: [{ word: '安い', reading: 'やすい', meaningVi: 'rẻ' }, { word: '安心', reading: 'あんしん', meaningVi: 'yên tâm' }] },
  { c: '新', s: 13, on: 'シン', kun: 'あたら(しい)', m: 'Mới', rad: '斤', mn: 'Cây (木) bị rìu (斤) chặt — gỗ mới đốn.', ex: [{ word: '新しい', reading: 'あたらしい', meaningVi: 'mới' }, { word: '新聞', reading: 'しんぶん', meaningVi: 'báo' }] },
  { c: '長', s: 8, on: 'チョウ', kun: 'なが(い)', m: 'Dài, trưởng', rad: '長', mn: 'Ông già tóc dài chống gậy.', ex: [{ word: '長い', reading: 'ながい', meaningVi: 'dài' }, { word: '社長', reading: 'しゃちょう', meaningVi: 'giám đốc' }] },
  { c: '白', s: 5, on: 'ハク', kun: 'しろ(い)', m: 'Trắng', rad: '白', mn: 'Tia nắng (丿) chiếu lên mặt trời (日) — chói trắng.', ex: [{ word: '白い', reading: 'しろい', meaningVi: 'trắng' }, { word: '白', reading: 'しろ', meaningVi: 'màu trắng' }] },
];

async function main() {
  const lang = await prisma.language.findUnique({ where: { code: 'ja' }, select: { id: true } });
  if (!lang) { console.log('[hanzi:ja] chưa có ngôn ngữ ja — bỏ qua'); return; }

  let created = 0, filled = 0, skipped = 0;
  for (let i = 0; i < N5.length; i++) {
    const k = N5[i];
    const existing = await prisma.langHanziChar.findFirst({
      where: { languageId: lang.id, char: k.c },
      select: { id: true, mnemonic: true, images: true },
    });

    if (existing) {
      // Never clobber an admin's work: only fill a mnemonic that is still empty,
      // and never touch images.
      if (!existing.mnemonic) {
        await prisma.langHanziChar.update({ where: { id: existing.id }, data: { mnemonic: k.mn } });
        filled++;
      } else {
        skipped++;
      }
      continue;
    }

    await prisma.langHanziChar.create({
      data: {
        languageId: lang.id,
        char: k.c,
        level: 'N5',
        strokeCount: k.s,
        onyomi: k.on || null,
        kunyomi: k.kun || null,
        meaningVi: k.m,
        mnemonic: k.mn,
        radical: k.rad || null,
        examples: k.ex as never,
        images: [] as never,
        order: i,
      },
    });
    created++;
  }
  console.log(`[hanzi:ja] DONE ${N5.length} chữ N5 — tạo ${created}, bổ sung mẹo nhớ ${filled}, giữ nguyên ${skipped}`);
}

main()
  .catch((e) => { console.error('[hanzi:ja] error', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
