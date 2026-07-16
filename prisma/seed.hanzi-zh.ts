/**
 * seed.hanzi-zh.ts — the HSK1 hanzi set, with meanings, pinyin and mnemonics.
 *
 * Mirrors seed.hanzi-ja.ts. Stroke geometry is not here: Chinese comes from the
 * `hanzi-writer-data` npm package (simplified forms), which covers HSK1 fully —
 * unlike Japanese, which needed animCJK because the npm set has no shinjitai.
 *
 * Idempotent: upsert by (language, char). Re-running never duplicates, and it
 * never overwrites an admin's edits — only fills a mnemonic that is still empty.
 *
 *   docker exec cuonghoangdev_backend npx tsx prisma/seed.hanzi-zh.ts
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface H {
  c: string; s: number; p: string; m: string; rad: string;
  mn: string; ex: Array<{ word: string; reading: string; meaningVi: string }>;
}

// HSK1 — the 150-odd characters of the first level, ordered by how early a
// learner meets them rather than by stroke count.
const HSK1: H[] = [
  { c: '我', s: 7, p: 'wǒ', m: 'Tôi', rad: '戈', mn: 'Tay (扌) cầm giáo (戈) bảo vệ bản thân — cái tôi.', ex: [{ word: '我们', reading: 'wǒmen', meaningVi: 'chúng tôi' }, { word: '我的', reading: 'wǒ de', meaningVi: 'của tôi' }] },
  { c: '你', s: 7, p: 'nǐ', m: 'Bạn, anh/chị', rad: '亻', mn: 'Người (亻) đứng bên cạnh — người đối diện là "bạn".', ex: [{ word: '你好', reading: 'nǐ hǎo', meaningVi: 'xin chào' }, { word: '你们', reading: 'nǐmen', meaningVi: 'các bạn' }] },
  { c: '他', s: 5, p: 'tā', m: 'Anh ấy', rad: '亻', mn: 'Người (亻) + cái khác (也) — người khác, anh ta.', ex: [{ word: '他们', reading: 'tāmen', meaningVi: 'họ (nam)' }, { word: '其他', reading: 'qítā', meaningVi: 'khác' }] },
  { c: '她', s: 6, p: 'tā', m: 'Cô ấy', rad: '女', mn: 'Giống 他 nhưng bộ nữ (女) — cô ấy.', ex: [{ word: '她们', reading: 'tāmen', meaningVi: 'họ (nữ)' }] },
  { c: '好', s: 6, p: 'hǎo', m: 'Tốt, khoẻ', rad: '女', mn: 'Nữ (女) + con (子) — mẹ có con là điều tốt lành.', ex: [{ word: '你好', reading: 'nǐ hǎo', meaningVi: 'xin chào' }, { word: '好吃', reading: 'hǎochī', meaningVi: 'ngon' }] },
  { c: '是', s: 9, p: 'shì', m: 'Là, đúng', rad: '日', mn: 'Mặt trời (日) ở trên, chính (正) ở dưới — mặt trời thì luôn đúng.', ex: [{ word: '不是', reading: 'bù shì', meaningVi: 'không phải' }, { word: '是的', reading: 'shì de', meaningVi: 'đúng vậy' }] },
  { c: '不', s: 4, p: 'bù', m: 'Không', rad: '一', mn: 'Con chim bay đụng trần (一) không lên được — phủ định.', ex: [{ word: '不好', reading: 'bù hǎo', meaningVi: 'không tốt' }, { word: '不用', reading: 'búyòng', meaningVi: 'không cần' }] },
  { c: '人', s: 2, p: 'rén', m: 'Người', rad: '人', mn: 'Hình người đang bước, hai chân dang ra.', ex: [{ word: '中国人', reading: 'Zhōngguó rén', meaningVi: 'người Trung Quốc' }, { word: '人们', reading: 'rénmen', meaningVi: 'mọi người' }] },
  { c: '大', s: 3, p: 'dà', m: 'To, lớn', rad: '大', mn: 'Người (人) dang rộng hai tay hết cỡ — to.', ex: [{ word: '大学', reading: 'dàxué', meaningVi: 'đại học' }, { word: '大家', reading: 'dàjiā', meaningVi: 'mọi người' }] },
  { c: '小', s: 3, p: 'xiǎo', m: 'Nhỏ', rad: '小', mn: 'Ba hạt nhỏ rơi xuống.', ex: [{ word: '小姐', reading: 'xiǎojiě', meaningVi: 'cô' }, { word: '小时', reading: 'xiǎoshí', meaningVi: 'giờ (đồng hồ)' }] },
  { c: '中', s: 4, p: 'zhōng', m: 'Giữa, Trung Quốc', rad: '丨', mn: 'Mũi tên xuyên qua chính giữa cái hộp.', ex: [{ word: '中国', reading: 'Zhōngguó', meaningVi: 'Trung Quốc' }, { word: '中午', reading: 'zhōngwǔ', meaningVi: 'buổi trưa' }] },
  { c: '上', s: 3, p: 'shàng', m: 'Trên, lên', rad: '一', mn: 'Vạch chỉ lên phía trên đường ngang.', ex: [{ word: '上午', reading: 'shàngwǔ', meaningVi: 'buổi sáng' }, { word: '上班', reading: 'shàngbān', meaningVi: 'đi làm' }] },
  { c: '下', s: 3, p: 'xià', m: 'Dưới, xuống', rad: '一', mn: 'Vạch chỉ xuống dưới — ngược của 上.', ex: [{ word: '下午', reading: 'xiàwǔ', meaningVi: 'buổi chiều' }, { word: '下面', reading: 'xiàmiàn', meaningVi: 'phía dưới' }] },
  { c: '学', s: 8, p: 'xué', m: 'Học', rad: '子', mn: 'Mái nhà che đứa trẻ (子) đang học.', ex: [{ word: '学生', reading: 'xuéshēng', meaningVi: 'học sinh' }, { word: '学习', reading: 'xuéxí', meaningVi: 'học tập' }] },
  { c: '生', s: 5, p: 'shēng', m: 'Sinh, sống', rad: '生', mn: 'Mầm cây mọc lên khỏi mặt đất — sự sống.', ex: [{ word: '学生', reading: 'xuéshēng', meaningVi: 'học sinh' }, { word: '医生', reading: 'yīshēng', meaningVi: 'bác sĩ' }] },
  { c: '老', s: 6, p: 'lǎo', m: 'Già, cũ', rad: '老', mn: 'Ông già tóc dài chống gậy.', ex: [{ word: '老师', reading: 'lǎoshī', meaningVi: 'giáo viên' }, { word: '老人', reading: 'lǎorén', meaningVi: 'người già' }] },
  { c: '师', s: 6, p: 'shī', m: 'Thầy', rad: '巾', mn: 'Người dẫn dắt đám đông — người thầy.', ex: [{ word: '老师', reading: 'lǎoshī', meaningVi: 'giáo viên' }] },
  { c: '叫', s: 5, p: 'jiào', m: 'Gọi, tên là', rad: '口', mn: 'Miệng (口) phát ra tiếng — gọi.', ex: [{ word: '叫做', reading: 'jiàozuò', meaningVi: 'gọi là' }, { word: '你叫什么', reading: 'nǐ jiào shénme', meaningVi: 'bạn tên gì' }] },
  { c: '名', s: 6, p: 'míng', m: 'Tên', rad: '口', mn: 'Chiều tối (夕) phải xưng miệng (口) báo tên vì không nhìn rõ mặt.', ex: [{ word: '名字', reading: 'míngzi', meaningVi: 'tên' }, { word: '有名', reading: 'yǒumíng', meaningVi: 'nổi tiếng' }] },
  { c: '字', s: 6, p: 'zì', m: 'Chữ', rad: '宀', mn: 'Đứa con (子) trong nhà (宀) học chữ.', ex: [{ word: '名字', reading: 'míngzi', meaningVi: 'tên' }, { word: '汉字', reading: 'Hànzì', meaningVi: 'chữ Hán' }] },
  { c: '国', s: 8, p: 'guó', m: 'Nước, quốc gia', rad: '囗', mn: 'Vòng biên giới (囗) bao quanh ngọc quý (玉).', ex: [{ word: '中国', reading: 'Zhōngguó', meaningVi: 'Trung Quốc' }, { word: '国家', reading: 'guójiā', meaningVi: 'quốc gia' }] },
  { c: '文', s: 4, p: 'wén', m: 'Văn, chữ viết', rad: '文', mn: 'Hình hoa văn khắc trên ngực — văn tự.', ex: [{ word: '中文', reading: 'Zhōngwén', meaningVi: 'tiếng Trung' }, { word: '文化', reading: 'wénhuà', meaningVi: 'văn hoá' }] },
  { c: '书', s: 4, p: 'shū', m: 'Sách', rad: '乙', mn: 'Bàn tay cầm bút viết — sách vở.', ex: [{ word: '看书', reading: 'kàn shū', meaningVi: 'đọc sách' }, { word: '书店', reading: 'shūdiàn', meaningVi: 'hiệu sách' }] },
  { c: '本', s: 5, p: 'běn', m: 'Gốc, quyển', rad: '木', mn: 'Cây (木) có vạch ở gốc rễ — cái gốc.', ex: [{ word: '一本书', reading: 'yì běn shū', meaningVi: 'một quyển sách' }, { word: '本子', reading: 'běnzi', meaningVi: 'quyển vở' }] },
  { c: '水', s: 4, p: 'shuǐ', m: 'Nước', rad: '水', mn: 'Hình dòng nước chảy, có nhánh toả hai bên.', ex: [{ word: '喝水', reading: 'hē shuǐ', meaningVi: 'uống nước' }, { word: '水果', reading: 'shuǐguǒ', meaningVi: 'trái cây' }] },
  { c: '火', s: 4, p: 'huǒ', m: 'Lửa', rad: '火', mn: 'Hình ngọn lửa bùng lên với tàn lửa hai bên.', ex: [{ word: '火车', reading: 'huǒchē', meaningVi: 'tàu hoả' }] },
  { c: '月', s: 4, p: 'yuè', m: 'Tháng, mặt trăng', rad: '月', mn: 'Hình mặt trăng khuyết. Trăng tròn một vòng là một tháng.', ex: [{ word: '一月', reading: 'yīyuè', meaningVi: 'tháng Một' }, { word: '月亮', reading: 'yuèliang', meaningVi: 'mặt trăng' }] },
  { c: '日', s: 4, p: 'rì', m: 'Ngày, mặt trời', rad: '日', mn: 'Hình mặt trời có chấm ở giữa, viết vuông lại.', ex: [{ word: '生日', reading: 'shēngrì', meaningVi: 'sinh nhật' }, { word: '日本', reading: 'Rìběn', meaningVi: 'Nhật Bản' }] },
  { c: '山', s: 3, p: 'shān', m: 'Núi', rad: '山', mn: 'Ba đỉnh núi nhấp nhô.', ex: [{ word: '山水', reading: 'shānshuǐ', meaningVi: 'sông núi' }] },
  { c: '出', s: 5, p: 'chū', m: 'Ra', rad: '凵', mn: 'Hai ngọn núi chồng lên — mầm chui ra khỏi hang.', ex: [{ word: '出来', reading: 'chūlái', meaningVi: 'đi ra' }, { word: '出去', reading: 'chūqù', meaningVi: 'ra ngoài' }] },
  { c: '入', s: 2, p: 'rù', m: 'Vào', rad: '入', mn: 'Mũi tên chúc xuống chui vào — ngược với 人.', ex: [{ word: '入口', reading: 'rùkǒu', meaningVi: 'lối vào' }] },
  { c: '口', s: 3, p: 'kǒu', m: 'Miệng, cửa', rad: '口', mn: 'Cái miệng há ra hình vuông.', ex: [{ word: '出口', reading: 'chūkǒu', meaningVi: 'lối ra' }, { word: '人口', reading: 'rénkǒu', meaningVi: 'dân số' }] },
  { c: '目', s: 5, p: 'mù', m: 'Mắt', rad: '目', mn: 'Con mắt dựng đứng, có con ngươi ở giữa.', ex: [{ word: '目的', reading: 'mùdì', meaningVi: 'mục đích' }] },
  { c: '手', s: 4, p: 'shǒu', m: 'Tay', rad: '手', mn: 'Bàn tay xoè năm ngón.', ex: [{ word: '手机', reading: 'shǒujī', meaningVi: 'điện thoại' }, { word: '手表', reading: 'shǒubiǎo', meaningVi: 'đồng hồ đeo tay' }] },
  { c: '年', s: 6, p: 'nián', m: 'Năm', rad: '干', mn: 'Người vác bó lúa — một vụ mùa là một năm.', ex: [{ word: '今年', reading: 'jīnnián', meaningVi: 'năm nay' }, { word: '去年', reading: 'qùnián', meaningVi: 'năm ngoái' }] },
  { c: '时', s: 7, p: 'shí', m: 'Giờ, lúc', rad: '日', mn: 'Mặt trời (日) + tấc (寸) — đo mặt trời để biết giờ.', ex: [{ word: '时候', reading: 'shíhou', meaningVi: 'lúc, khi' }, { word: '小时', reading: 'xiǎoshí', meaningVi: 'giờ' }] },
  { c: '分', s: 4, p: 'fēn', m: 'Phút, chia', rad: '刀', mn: 'Con dao (刀) chia (八) vật ra — phút là phần nhỏ của giờ.', ex: [{ word: '十分', reading: 'shí fēn', meaningVi: 'mười phút' }, { word: '分钟', reading: 'fēnzhōng', meaningVi: 'phút' }] },
  { c: '今', s: 4, p: 'jīn', m: 'Nay', rad: '人', mn: 'Mái nhà che một khoảnh khắc — ngay lúc này.', ex: [{ word: '今天', reading: 'jīntiān', meaningVi: 'hôm nay' }, { word: '今年', reading: 'jīnnián', meaningVi: 'năm nay' }] },
  { c: '天', s: 4, p: 'tiān', m: 'Trời, ngày', rad: '大', mn: 'Người lớn (大) đội một vạch trên đầu — bầu trời.', ex: [{ word: '今天', reading: 'jīntiān', meaningVi: 'hôm nay' }, { word: '天气', reading: 'tiānqì', meaningVi: 'thời tiết' }] },
  { c: '们', s: 5, p: 'men', m: '(số nhiều)', rad: '亻', mn: 'Người (亻) + cửa (门) — nhiều người ra vào cửa.', ex: [{ word: '我们', reading: 'wǒmen', meaningVi: 'chúng tôi' }, { word: '他们', reading: 'tāmen', meaningVi: 'họ' }] },
  { c: '爱', s: 10, p: 'ài', m: 'Yêu', rad: '爪', mn: 'Bàn tay (爪) che chở người bạn (友) — tình yêu.', ex: [{ word: '爱人', reading: 'àirén', meaningVi: 'vợ/chồng' }, { word: '喜爱', reading: 'xǐ\'ài', meaningVi: 'yêu thích' }] },
  { c: '有', s: 6, p: 'yǒu', m: 'Có', rad: '月', mn: 'Bàn tay cầm miếng thịt (月) — có của.', ex: [{ word: '没有', reading: 'méiyǒu', meaningVi: 'không có' }, { word: '有名', reading: 'yǒumíng', meaningVi: 'nổi tiếng' }] },
  { c: '在', s: 6, p: 'zài', m: 'Ở, đang', rad: '土', mn: 'Mầm cây bám trên đất (土) — ở tại đó.', ex: [{ word: '现在', reading: 'xiànzài', meaningVi: 'bây giờ' }, { word: '在家', reading: 'zài jiā', meaningVi: 'ở nhà' }] },
  { c: '这', s: 7, p: 'zhè', m: 'Này, đây', rad: '辶', mn: 'Bộ đi (辶) + văn (文) — chỉ cái ngay đây.', ex: [{ word: '这个', reading: 'zhège', meaningVi: 'cái này' }, { word: '这里', reading: 'zhèlǐ', meaningVi: 'ở đây' }] },
  { c: '那', s: 6, p: 'nà', m: 'Kia, đó', rad: '阝', mn: 'Chỉ nơi xa — ngược với 这.', ex: [{ word: '那个', reading: 'nàge', meaningVi: 'cái kia' }, { word: '那里', reading: 'nàlǐ', meaningVi: 'ở đó' }] },
  { c: '看', s: 9, p: 'kàn', m: 'Nhìn, xem', rad: '目', mn: 'Bàn tay (手) che trên mắt (目) để nhìn xa.', ex: [{ word: '看书', reading: 'kàn shū', meaningVi: 'đọc sách' }, { word: '看见', reading: 'kànjiàn', meaningVi: 'nhìn thấy' }] },
  { c: '听', s: 7, p: 'tīng', m: 'Nghe', rad: '口', mn: 'Miệng (口) + rìu (斤) — nghe cho thủng.', ex: [{ word: '听说', reading: 'tīngshuō', meaningVi: 'nghe nói' }, { word: '好听', reading: 'hǎotīng', meaningVi: 'hay (nghe)' }] },
  { c: '说', s: 9, p: 'shuō', m: 'Nói', rad: '讠', mn: 'Lời nói (讠) + đổi (兑) — trao đổi bằng lời.', ex: [{ word: '说话', reading: 'shuōhuà', meaningVi: 'nói chuyện' }, { word: '听说', reading: 'tīngshuō', meaningVi: 'nghe nói' }] },
  { c: '读', s: 10, p: 'dú', m: 'Đọc', rad: '讠', mn: 'Lời nói (讠) + bán (卖) — đọc to như người rao hàng.', ex: [{ word: '读书', reading: 'dúshū', meaningVi: 'đọc sách, đi học' }] },
  { c: '写', s: 5, p: 'xiě', m: 'Viết', rad: '冖', mn: 'Mái che (冖) trên tờ giấy — ngồi trong nhà mà viết.', ex: [{ word: '写字', reading: 'xiězì', meaningVi: 'viết chữ' }] },
  { c: '吃', s: 6, p: 'chī', m: 'Ăn', rad: '口', mn: 'Miệng (口) + khất (乞) — há miệng xin ăn.', ex: [{ word: '吃饭', reading: 'chīfàn', meaningVi: 'ăn cơm' }, { word: '好吃', reading: 'hǎochī', meaningVi: 'ngon' }] },
  { c: '喝', s: 12, p: 'hē', m: 'Uống', rad: '口', mn: 'Miệng (口) + hạt (曷) — đưa lên miệng mà uống.', ex: [{ word: '喝水', reading: 'hē shuǐ', meaningVi: 'uống nước' }, { word: '喝茶', reading: 'hē chá', meaningVi: 'uống trà' }] },
  { c: '买', s: 6, p: 'mǎi', m: 'Mua', rad: '乙', mn: 'Cái lưới (罒) chụp xuống — gom hàng về là mua.', ex: [{ word: '买东西', reading: 'mǎi dōngxi', meaningVi: 'mua đồ' }] },
  { c: '钱', s: 10, p: 'qián', m: 'Tiền', rad: '钅', mn: 'Kim loại (钅) + giáo (戋) — kim loại đúc thành tiền.', ex: [{ word: '多少钱', reading: 'duōshao qián', meaningVi: 'bao nhiêu tiền' }] },
  { c: '多', s: 6, p: 'duō', m: 'Nhiều', rad: '夕', mn: 'Hai buổi chiều (夕) chồng lên — ngày qua ngày, nhiều.', ex: [{ word: '多少', reading: 'duōshao', meaningVi: 'bao nhiêu' }, { word: '很多', reading: 'hěn duō', meaningVi: 'rất nhiều' }] },
  { c: '少', s: 4, p: 'shǎo', m: 'Ít', rad: '小', mn: 'Nhỏ (小) mất thêm một nét — càng ít.', ex: [{ word: '多少', reading: 'duōshao', meaningVi: 'bao nhiêu' }, { word: '很少', reading: 'hěn shǎo', meaningVi: 'rất ít' }] },
  { c: '几', s: 2, p: 'jǐ', m: 'Mấy, vài', rad: '几', mn: 'Cái ghế đẩu — hai nét đơn giản.', ex: [{ word: '几个', reading: 'jǐ gè', meaningVi: 'mấy cái' }, { word: '几点', reading: 'jǐ diǎn', meaningVi: 'mấy giờ' }] },
  { c: '个', s: 3, p: 'gè', m: '(lượng từ)', rad: '人', mn: 'Người (人) + một vạch — đếm từng cái.', ex: [{ word: '一个', reading: 'yí gè', meaningVi: 'một cái' }, { word: '这个', reading: 'zhège', meaningVi: 'cái này' }] },
  { c: '家', s: 10, p: 'jiā', m: 'Nhà, gia đình', rad: '宀', mn: 'Mái nhà (宀) che con lợn (豕) — nhà nông có lợn là có nhà.', ex: [{ word: '家人', reading: 'jiārén', meaningVi: 'người nhà' }, { word: '国家', reading: 'guójiā', meaningVi: 'quốc gia' }] },
  { c: '里', s: 7, p: 'lǐ', m: 'Trong, dặm', rad: '里', mn: 'Ruộng (田) trên đất (土) — làng xóm, bên trong.', ex: [{ word: '这里', reading: 'zhèlǐ', meaningVi: 'ở đây' }, { word: '里面', reading: 'lǐmiàn', meaningVi: 'bên trong' }] },
  { c: '前', s: 9, p: 'qián', m: 'Trước', rad: '刂', mn: 'Con thuyền tiến về phía trước.', ex: [{ word: '前面', reading: 'qiánmiàn', meaningVi: 'phía trước' }, { word: '以前', reading: 'yǐqián', meaningVi: 'trước đây' }] },
  { c: '后', s: 6, p: 'hòu', m: 'Sau', rad: '口', mn: 'Người đi sau lưng.', ex: [{ word: '后面', reading: 'hòumiàn', meaningVi: 'phía sau' }, { word: '以后', reading: 'yǐhòu', meaningVi: 'sau này' }] },
  { c: '车', s: 4, p: 'chē', m: 'Xe', rad: '车', mn: 'Chiếc xe nhìn từ trên: trục và bánh (giản thể của 車).', ex: [{ word: '汽车', reading: 'qìchē', meaningVi: 'ô tô' }, { word: '火车', reading: 'huǒchē', meaningVi: 'tàu hoả' }] },
  { c: '飞', s: 3, p: 'fēi', m: 'Bay', rad: '飞', mn: 'Cánh chim vỗ lên (giản thể của 飛).', ex: [{ word: '飞机', reading: 'fēijī', meaningVi: 'máy bay' }] },
  { c: '机', s: 6, p: 'jī', m: 'Máy', rad: '木', mn: 'Gỗ (木) + ghế (几) — khung gỗ thành cỗ máy.', ex: [{ word: '手机', reading: 'shǒujī', meaningVi: 'điện thoại' }, { word: '飞机', reading: 'fēijī', meaningVi: 'máy bay' }] },
  { c: '爸', s: 8, p: 'bà', m: 'Bố', rad: '父', mn: 'Cha (父) + âm 巴 — đọc là "ba".', ex: [{ word: '爸爸', reading: 'bàba', meaningVi: 'bố' }] },
  { c: '妈', s: 6, p: 'mā', m: 'Mẹ', rad: '女', mn: 'Nữ (女) + ngựa (马) — mượn âm "ma".', ex: [{ word: '妈妈', reading: 'māma', meaningVi: 'mẹ' }] },
  { c: '女', s: 3, p: 'nǚ', m: 'Nữ', rad: '女', mn: 'Hình người phụ nữ đang ngồi khoanh chân.', ex: [{ word: '女儿', reading: 'nǚ\'ér', meaningVi: 'con gái' }, { word: '女人', reading: 'nǚrén', meaningVi: 'phụ nữ' }] },
  { c: '儿', s: 2, p: 'ér', m: 'Con, nhi', rad: '儿', mn: 'Đứa trẻ hai chân — con.', ex: [{ word: '儿子', reading: 'érzi', meaningVi: 'con trai' }, { word: '女儿', reading: 'nǚ\'ér', meaningVi: 'con gái' }] },
  { c: '子', s: 3, p: 'zi', m: 'Con, hạt', rad: '子', mn: 'Em bé quấn tã, hai tay giơ ra.', ex: [{ word: '儿子', reading: 'érzi', meaningVi: 'con trai' }, { word: '桌子', reading: 'zhuōzi', meaningVi: 'cái bàn' }] },
  { c: '朋', s: 8, p: 'péng', m: 'Bạn', rad: '月', mn: 'Hai xâu vỏ sò cạnh nhau — bạn bè đi đôi.', ex: [{ word: '朋友', reading: 'péngyou', meaningVi: 'bạn bè' }] },
  { c: '友', s: 4, p: 'yǒu', m: 'Bạn', rad: '又', mn: 'Hai bàn tay nắm lấy nhau — tình bạn.', ex: [{ word: '朋友', reading: 'péngyou', meaningVi: 'bạn bè' }] },
  { c: '医', s: 7, p: 'yī', m: 'Y, chữa bệnh', rad: '匚', mn: 'Mũi tên (矢) cất trong hộp (匚) — rút tên ra chữa thương.', ex: [{ word: '医生', reading: 'yīshēng', meaningVi: 'bác sĩ' }, { word: '医院', reading: 'yīyuàn', meaningVi: 'bệnh viện' }] },
  { c: '院', s: 9, p: 'yuàn', m: 'Viện, sân', rad: '阝', mn: 'Bức tường (阝) bao quanh — cái sân, toà viện.', ex: [{ word: '医院', reading: 'yīyuàn', meaningVi: 'bệnh viện' }, { word: '学院', reading: 'xuéyuàn', meaningVi: 'học viện' }] },
  { c: '开', s: 4, p: 'kāi', m: 'Mở, lái', rad: '廾', mn: 'Hai tay tháo then cửa — mở ra.', ex: [{ word: '开车', reading: 'kāichē', meaningVi: 'lái xe' }, { word: '开始', reading: 'kāishǐ', meaningVi: 'bắt đầu' }] },
  { c: '关', s: 6, p: 'guān', m: 'Đóng, quan hệ', rad: '丷', mn: 'Then cài cửa — đóng lại.', ex: [{ word: '关门', reading: 'guānmén', meaningVi: 'đóng cửa' }, { word: '关系', reading: 'guānxi', meaningVi: 'quan hệ' }] },
  { c: '门', s: 3, p: 'mén', m: 'Cửa', rad: '门', mn: 'Hai cánh cửa (giản thể của 門).', ex: [{ word: '开门', reading: 'kāimén', meaningVi: 'mở cửa' }, { word: '门口', reading: 'ménkǒu', meaningVi: 'cửa ra vào' }] },
  { c: '来', s: 7, p: 'lái', m: 'Đến', rad: '木', mn: 'Cây lúa chín — mùa gặt đến.', ex: [{ word: '来了', reading: 'lái le', meaningVi: 'đến rồi' }, { word: '回来', reading: 'huílái', meaningVi: 'trở về' }] },
  { c: '去', s: 5, p: 'qù', m: 'Đi', rad: '厶', mn: 'Đất (土) + cái muôi (厶) — rời đất mà đi.', ex: [{ word: '出去', reading: 'chūqù', meaningVi: 'ra ngoài' }, { word: '去年', reading: 'qùnián', meaningVi: 'năm ngoái' }] },
  { c: '回', s: 6, p: 'huí', m: 'Về, lần', rad: '囗', mn: 'Hai vòng xoáy lồng nhau — quay về.', ex: [{ word: '回家', reading: 'huí jiā', meaningVi: 'về nhà' }, { word: '回来', reading: 'huílái', meaningVi: 'trở về' }] },
  { c: '做', s: 11, p: 'zuò', m: 'Làm', rad: '亻', mn: 'Người (亻) + cố gắng (故) — bắt tay vào làm.', ex: [{ word: '做饭', reading: 'zuòfàn', meaningVi: 'nấu cơm' }, { word: '工作', reading: 'gōngzuò', meaningVi: 'công việc' }] },
  { c: '工', s: 3, p: 'gōng', m: 'Công, thợ', rad: '工', mn: 'Cái thước thợ mộc.', ex: [{ word: '工作', reading: 'gōngzuò', meaningVi: 'công việc' }, { word: '工人', reading: 'gōngrén', meaningVi: 'công nhân' }] },
  { c: '作', s: 7, p: 'zuò', m: 'Làm, tác', rad: '亻', mn: 'Người (亻) + vừa mới (乍) — bắt tay tạo ra.', ex: [{ word: '工作', reading: 'gōngzuò', meaningVi: 'công việc' }] },
  { c: '菜', s: 11, p: 'cài', m: 'Rau, món ăn', rad: '艹', mn: 'Cỏ (艹) + hái (采) — hái rau về làm món.', ex: [{ word: '中国菜', reading: 'Zhōngguó cài', meaningVi: 'món Trung Quốc' }, { word: '青菜', reading: 'qīngcài', meaningVi: 'rau xanh' }] },
  { c: '饭', s: 7, p: 'fàn', m: 'Cơm', rad: '饣', mn: 'Bộ ăn (饣) + phản (反) — bữa cơm.', ex: [{ word: '吃饭', reading: 'chīfàn', meaningVi: 'ăn cơm' }, { word: '米饭', reading: 'mǐfàn', meaningVi: 'cơm trắng' }] },
  { c: '茶', s: 9, p: 'chá', m: 'Trà', rad: '艹', mn: 'Cỏ (艹) + người (人) + cây (木) — người hái lá cây pha trà.', ex: [{ word: '喝茶', reading: 'hē chá', meaningVi: 'uống trà' }, { word: '茶馆', reading: 'cháguǎn', meaningVi: 'quán trà' }] },
  { c: '气', s: 4, p: 'qì', m: 'Khí, hơi', rad: '气', mn: 'Hơi bốc lên — khí (giản thể của 氣).', ex: [{ word: '天气', reading: 'tiānqì', meaningVi: 'thời tiết' }, { word: '生气', reading: 'shēngqì', meaningVi: 'tức giận' }] },
  { c: '雨', s: 8, p: 'yǔ', m: 'Mưa', rad: '雨', mn: 'Đám mây có 4 giọt nước rơi xuống.', ex: [{ word: '下雨', reading: 'xiàyǔ', meaningVi: 'trời mưa' }] },
  { c: '热', s: 10, p: 'rè', m: 'Nóng', rad: '灬', mn: 'Bốn chấm lửa (灬) bên dưới — nóng.', ex: [{ word: '很热', reading: 'hěn rè', meaningVi: 'rất nóng' }, { word: '热情', reading: 'rèqíng', meaningVi: 'nhiệt tình' }] },
  { c: '冷', s: 7, p: 'lěng', m: 'Lạnh', rad: '冫', mn: 'Hai giọt băng (冫) — lạnh.', ex: [{ word: '很冷', reading: 'hěn lěng', meaningVi: 'rất lạnh' }] },
  { c: '很', s: 9, p: 'hěn', m: 'Rất', rad: '彳', mn: 'Bước chân (彳) + dừng (艮) — mức độ mạnh.', ex: [{ word: '很好', reading: 'hěn hǎo', meaningVi: 'rất tốt' }, { word: '很多', reading: 'hěn duō', meaningVi: 'rất nhiều' }] },
  { c: '太', s: 4, p: 'tài', m: 'Quá, thái', rad: '大', mn: 'To (大) thêm một chấm — quá to.', ex: [{ word: '太好了', reading: 'tài hǎo le', meaningVi: 'tuyệt quá' }, { word: '太太', reading: 'tàitai', meaningVi: 'bà, vợ' }] },
  { c: '都', s: 10, p: 'dōu', m: 'Đều, tất cả', rad: '阝', mn: 'Người (者) trong thành (阝) — tất cả dân trong đô.', ex: [{ word: '都是', reading: 'dōu shì', meaningVi: 'đều là' }, { word: '首都', reading: 'shǒudū', meaningVi: 'thủ đô' }] },
  { c: '和', s: 8, p: 'hé', m: 'Và, hoà', rad: '口', mn: 'Lúa (禾) + miệng (口) — chia lúa đủ miệng thì hoà thuận.', ex: [{ word: '我和你', reading: 'wǒ hé nǐ', meaningVi: 'tôi và bạn' }] },
  { c: '东', s: 5, p: 'dōng', m: 'Đông (hướng)', rad: '一', mn: 'Mặt trời mọc sau cây — hướng đông (giản thể của 東).', ex: [{ word: '东西', reading: 'dōngxi', meaningVi: 'đồ vật' }, { word: '东方', reading: 'dōngfāng', meaningVi: 'phương Đông' }] },
  { c: '西', s: 6, p: 'xī', m: 'Tây', rad: '西', mn: 'Tổ chim — chim về tổ khi mặt trời lặn hướng tây.', ex: [{ word: '东西', reading: 'dōngxi', meaningVi: 'đồ vật' }, { word: '西瓜', reading: 'xīguā', meaningVi: 'dưa hấu' }] },
  { c: '一', s: 1, p: 'yī', m: 'Một', rad: '一', mn: 'Một nét ngang = một.', ex: [{ word: '一个', reading: 'yí gè', meaningVi: 'một cái' }, { word: '一起', reading: 'yìqǐ', meaningVi: 'cùng nhau' }] },
  { c: '二', s: 2, p: 'èr', m: 'Hai', rad: '二', mn: 'Hai nét ngang = hai.', ex: [{ word: '二十', reading: 'èrshí', meaningVi: 'hai mươi' }] },
  { c: '三', s: 3, p: 'sān', m: 'Ba', rad: '一', mn: 'Ba nét ngang = ba.', ex: [{ word: '三个', reading: 'sān gè', meaningVi: 'ba cái' }] },
  { c: '四', s: 5, p: 'sì', m: 'Bốn', rad: '囗', mn: 'Cái hộp có hai chân bên trong.', ex: [{ word: '四十', reading: 'sìshí', meaningVi: 'bốn mươi' }] },
  { c: '五', s: 4, p: 'wǔ', m: 'Năm', rad: '二', mn: 'Hai vạch trời đất kẹp một chữ X ở giữa.', ex: [{ word: '五个', reading: 'wǔ gè', meaningVi: 'năm cái' }] },
  { c: '六', s: 4, p: 'liù', m: 'Sáu', rad: '八', mn: 'Cái nón có hai chân.', ex: [{ word: '六十', reading: 'liùshí', meaningVi: 'sáu mươi' }] },
  { c: '七', s: 2, p: 'qī', m: 'Bảy', rad: '一', mn: 'Giống số 7 lật ngược.', ex: [{ word: '七月', reading: 'qīyuè', meaningVi: 'tháng Bảy' }] },
  { c: '八', s: 2, p: 'bā', m: 'Tám', rad: '八', mn: 'Hai nét xoè ra như số 8 mở.', ex: [{ word: '八十', reading: 'bāshí', meaningVi: 'tám mươi' }] },
  { c: '九', s: 2, p: 'jiǔ', m: 'Chín', rad: '乙', mn: 'Giống số 9 viết vội.', ex: [{ word: '九月', reading: 'jiǔyuè', meaningVi: 'tháng Chín' }] },
  { c: '十', s: 2, p: 'shí', m: 'Mười', rad: '十', mn: 'Dấu cộng = mười (đủ hai bàn tay).', ex: [{ word: '十个', reading: 'shí gè', meaningVi: 'mười cái' }] },
  { c: '百', s: 6, p: 'bǎi', m: 'Trăm', rad: '白', mn: 'Một (一) chồng lên trắng (白) — một trăm.', ex: [{ word: '一百', reading: 'yìbǎi', meaningVi: 'một trăm' }] },
  { c: '块', s: 7, p: 'kuài', m: 'Đồng, cục', rad: '土', mn: 'Đất (土) vỡ thành cục — đơn vị tiền khẩu ngữ.', ex: [{ word: '五块钱', reading: 'wǔ kuài qián', meaningVi: 'năm đồng' }] },
  { c: '点', s: 9, p: 'diǎn', m: 'Điểm, giờ', rad: '灬', mn: 'Chấm lửa nhỏ — cái chấm, điểm giờ.', ex: [{ word: '几点', reading: 'jǐ diǎn', meaningVi: 'mấy giờ' }, { word: '一点儿', reading: 'yìdiǎnr', meaningVi: 'một chút' }] },
  { c: '想', s: 13, p: 'xiǎng', m: 'Nghĩ, muốn', rad: '心', mn: 'Nhìn nhau (相) bằng con tim (心) — nhớ, muốn.', ex: [{ word: '我想', reading: 'wǒ xiǎng', meaningVi: 'tôi muốn' }, { word: '想念', reading: 'xiǎngniàn', meaningVi: 'nhớ nhung' }] },
  { c: '会', s: 6, p: 'huì', m: 'Biết, sẽ, họp', rad: '人', mn: 'Mọi người (人) tụ dưới mái — hội họp; biết làm.', ex: [{ word: '会说', reading: 'huì shuō', meaningVi: 'biết nói' }, { word: '开会', reading: 'kāihuì', meaningVi: 'họp' }] },
  { c: '能', s: 10, p: 'néng', m: 'Có thể', rad: '月', mn: 'Con gấu khoẻ — có khả năng.', ex: [{ word: '不能', reading: 'bù néng', meaningVi: 'không thể' }, { word: '能力', reading: 'nénglì', meaningVi: 'năng lực' }] },
  { c: '住', s: 7, p: 'zhù', m: 'Ở, sống', rad: '亻', mn: 'Người (亻) + chủ (主) — người làm chủ nơi ở.', ex: [{ word: '住在', reading: 'zhù zài', meaningVi: 'sống ở' }] },
  { c: '喜', s: 12, p: 'xǐ', m: 'Vui, thích', rad: '口', mn: 'Cái trống (壴) + miệng (口) — đánh trống hát ca mừng vui.', ex: [{ word: '喜欢', reading: 'xǐhuan', meaningVi: 'thích' }] },
  { c: '欢', s: 6, p: 'huān', m: 'Vui, hoan', rad: '欠', mn: 'Há miệng (欠) reo lên — hoan hỉ.', ex: [{ word: '喜欢', reading: 'xǐhuan', meaningVi: 'thích' }, { word: '欢迎', reading: 'huānyíng', meaningVi: 'hoan nghênh' }] },
  { c: '谢', s: 12, p: 'xiè', m: 'Cảm ơn', rad: '讠', mn: 'Lời nói (讠) + bắn (射) — nói lời tạ ơn.', ex: [{ word: '谢谢', reading: 'xièxie', meaningVi: 'cảm ơn' }] },
  { c: '请', s: 10, p: 'qǐng', m: 'Mời, xin', rad: '讠', mn: 'Lời nói (讠) + xanh (青) — lời mời trong trẻo.', ex: [{ word: '请问', reading: 'qǐngwèn', meaningVi: 'xin hỏi' }, { word: '请进', reading: 'qǐng jìn', meaningVi: 'mời vào' }] },
  { c: '问', s: 6, p: 'wèn', m: 'Hỏi', rad: '门', mn: 'Miệng (口) ở trong cửa (门) — gõ cửa mà hỏi.', ex: [{ word: '请问', reading: 'qǐngwèn', meaningVi: 'xin hỏi' }, { word: '问题', reading: 'wèntí', meaningVi: 'câu hỏi, vấn đề' }] },
  { c: '再', s: 6, p: 'zài', m: 'Lại, nữa', rad: '冂', mn: 'Chồng thêm một lớp — làm lại lần nữa.', ex: [{ word: '再见', reading: 'zàijiàn', meaningVi: 'tạm biệt' }, { word: '再来', reading: 'zài lái', meaningVi: 'đến nữa' }] },
  { c: '见', s: 4, p: 'jiàn', m: 'Gặp, thấy', rad: '见', mn: 'Con mắt (目) trên đôi chân — mắt đi tìm để nhìn.', ex: [{ word: '再见', reading: 'zàijiàn', meaningVi: 'tạm biệt' }, { word: '看见', reading: 'kànjiàn', meaningVi: 'nhìn thấy' }] },
  { c: '没', s: 7, p: 'méi', m: 'Không có', rad: '氵', mn: 'Nước (氵) cuốn trôi mất — không còn.', ex: [{ word: '没有', reading: 'méiyǒu', meaningVi: 'không có' }, { word: '没关系', reading: 'méi guānxi', meaningVi: 'không sao' }] },
  { c: '什', s: 4, p: 'shén', m: 'Cái gì (什么)', rad: '亻', mn: 'Người (亻) + mười (十) — hỏi "cái gì".', ex: [{ word: '什么', reading: 'shénme', meaningVi: 'cái gì' }] },
  { c: '么', s: 3, p: 'me', m: '(trợ từ)', rad: '丿', mn: 'Ba nét nhỏ — trợ từ nghi vấn.', ex: [{ word: '什么', reading: 'shénme', meaningVi: 'cái gì' }, { word: '怎么', reading: 'zěnme', meaningVi: 'thế nào' }] },
  { c: '哪', s: 9, p: 'nǎ', m: 'Nào', rad: '口', mn: 'Miệng (口) + kia (那) — hỏi "cái nào".', ex: [{ word: '哪儿', reading: 'nǎr', meaningVi: 'ở đâu' }, { word: '哪个', reading: 'nǎge', meaningVi: 'cái nào' }] },
  { c: '谁', s: 10, p: 'shéi', m: 'Ai', rad: '讠', mn: 'Lời nói (讠) + chim (隹) — hỏi ai đó.', ex: [{ word: '是谁', reading: 'shì shéi', meaningVi: 'là ai' }] },
  { c: '爷', s: 6, p: 'yé', m: 'Ông', rad: '父', mn: 'Cha (父) của cha — ông.', ex: [{ word: '爷爷', reading: 'yéye', meaningVi: 'ông nội' }] },
  { c: '奶', s: 5, p: 'nǎi', m: 'Bà, sữa', rad: '女', mn: 'Nữ (女) + 乃 — bà, và sữa mẹ.', ex: [{ word: '奶奶', reading: 'nǎinai', meaningVi: 'bà nội' }, { word: '牛奶', reading: 'niúnǎi', meaningVi: 'sữa bò' }] },
];

async function main() {
  const lang = await prisma.language.findUnique({ where: { code: 'zh' }, select: { id: true } });
  if (!lang) { console.log('[hanzi:zh] chưa có ngôn ngữ zh — bỏ qua'); return; }

  let created = 0, filled = 0, skipped = 0;
  for (let i = 0; i < HSK1.length; i++) {
    const h = HSK1[i];
    const existing = await prisma.langHanziChar.findFirst({
      where: { languageId: lang.id, char: h.c },
      select: { id: true, mnemonic: true },
    });

    if (existing) {
      // Never clobber an admin's work: only fill a mnemonic still empty.
      if (!existing.mnemonic) {
        await prisma.langHanziChar.update({ where: { id: existing.id }, data: { mnemonic: h.mn } });
        filled++;
      } else {
        skipped++;
      }
      continue;
    }

    await prisma.langHanziChar.create({
      data: {
        languageId: lang.id,
        char: h.c,
        level: 'HSK1',
        strokeCount: h.s,
        pinyin: h.p,
        meaningVi: h.m,
        mnemonic: h.mn,
        radical: h.rad || null,
        examples: h.ex as never,
        images: [] as never,
        order: i,
      },
    });
    created++;
  }
  console.log(`[hanzi:zh] DONE ${HSK1.length} chữ HSK1 — tạo ${created}, bổ sung mẹo nhớ ${filled}, giữ nguyên ${skipped}`);
}

main()
  .catch((e) => { console.error('[hanzi:zh] error', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
