/**
 * 💬 CHỦ ĐỀ / TÌNH HUỐNG cho phòng "Trò chuyện cùng CuongMini" (19/10/2026).
 *
 * Một bảng duy nhất cho cả web lẫn máy chủ: web xin danh sách qua
 * `GET /ielts/ai/tro-chuyen/chu-de?ngonNgu=` (để chọn), máy chủ đọc `capDo` +
 * `vai` dựng prompt. Chủ đề chia theo TRÌNH ĐỘ người học thật sự hay thi:
 * IELTS Speaking Part 1/2/3 · JLPT N5–N3 · HSK 1–4, cộng tình huống nhập vai.
 *
 * `moDau`: vài câu mở đầu có sẵn cho mỗi chủ đề — mở chủ đề là phát ngay (không
 * chờ model), và chọn NGẪU NHIÊN nên không còn cảnh vào lần nào cũng nghe đúng
 * một câu chào. `[en]…[/en]` = đoạn ngoại ngữ (tên thẻ giữ như cũ cho mọi thứ tiếng).
 */
export type NgonNguTC = 'en' | 'ja' | 'zh';

export interface ChuDe {
  id: string;
  /** Nhóm hiển thị (trình độ / phần thi). */
  nhom: string;
  nhomEn: string;
  ten: string;
  tenEn: string;
  /** Tên bằng ngôn ngữ đang học (hiện nhỏ dưới tên). */
  tenGoc?: string;
  /** Mô tả trình độ cho prompt. */
  capDo: string;
  /** Vai/tình huống cho prompt. */
  vai: string;
  moDau: string[];
  /** IELTS Part 2: thẻ đề + gợi ý, chuẩn bị 1 phút, nói 1–2 phút. */
  cueCard?: { de: string; goiY: string[] };
  /** Chế độ giám khảo: sửa lỗi chỉ nằm trên thẻ, KHÔNG chen tiếng Việt vào lời nói (giữ nhịp phòng thi). */
  giamKhao?: boolean;
}

const P1 = 'IELTS Speaking Part 1 (câu hỏi ngắn về bản thân), mục tiêu band 6.5';
const P3 = 'IELTS Speaking Part 3 (thảo luận trừu tượng, cần lý do + ví dụ), mục tiêu band 6.5';
const GK = 'Bạn là GIÁM KHẢO IELTS thân thiện. Hỏi từng câu một, đúng kiểu phòng thi thật; người học trả lời xong thì hỏi câu kế (có thể hỏi "Why?").';

export const CHU_DE: Record<NgonNguTC, ChuDe[]> = {
  en: [
    { id: 'en-p1-hometown', nhom: 'IELTS Part 1', nhomEn: 'IELTS Part 1', ten: 'Quê hương', tenEn: 'Hometown', capDo: P1, vai: `${GK} Chủ đề: hometown.`, giamKhao: true,
      moDau: ['Mình vào Part 1 nhé, mình là giám khảo. [en]Let\'s talk about your hometown. Where is your hometown?[/en]', 'Phòng thi bắt đầu rồi nhé! [en]Let\'s talk about where you grew up. What is your hometown like?[/en]'] },
    { id: 'en-p1-work-study', nhom: 'IELTS Part 1', nhomEn: 'IELTS Part 1', ten: 'Học tập / công việc', tenEn: 'Work or study', capDo: P1, vai: `${GK} Chủ đề: work or study.`, giamKhao: true,
      moDau: ['Mình vào Part 1 nhé. [en]Do you work or are you a student?[/en]', 'Bắt đầu nhé! [en]Let\'s talk about your studies. What are you studying at the moment?[/en]'] },
    { id: 'en-p1-hobbies', nhom: 'IELTS Part 1', nhomEn: 'IELTS Part 1', ten: 'Sở thích', tenEn: 'Hobbies', capDo: P1, vai: `${GK} Chủ đề: hobbies & free time.`, giamKhao: true,
      moDau: ['Part 1 nhé! [en]What do you usually do in your free time?[/en]', 'Mình hỏi về sở thích nhé. [en]Do you have any hobbies?[/en]'] },
    { id: 'en-p1-food', nhom: 'IELTS Part 1', nhomEn: 'IELTS Part 1', ten: 'Đồ ăn', tenEn: 'Food', capDo: P1, vai: `${GK} Chủ đề: food & cooking.`, giamKhao: true,
      moDau: ['Part 1 về đồ ăn nhé. [en]What kind of food do you like?[/en]', 'Mình hỏi chuyện ăn uống nhé. [en]Do you often cook at home?[/en]'] },
    { id: 'en-p1-technology', nhom: 'IELTS Part 1', nhomEn: 'IELTS Part 1', ten: 'Điện thoại & công nghệ', tenEn: 'Phones & technology', capDo: P1, vai: `${GK} Chủ đề: mobile phones & technology.`, giamKhao: true,
      moDau: ['Part 1 về công nghệ nhé. [en]How often do you use your mobile phone?[/en]'] },
    { id: 'en-p2-person', nhom: 'IELTS Part 2', nhomEn: 'IELTS Part 2', ten: 'Một người truyền cảm hứng', tenEn: 'A person who inspired you', capDo: 'IELTS Speaking Part 2 (nói dài 1–2 phút theo thẻ đề), mục tiêu band 6.5', giamKhao: true,
      vai: 'Bạn là GIÁM KHẢO IELTS. Người học vừa nói dài theo thẻ đề. Đáp MỘT câu cảm ơn ngắn rồi hỏi MỘT câu rounding-off ngắn liên quan; lượt sau đó nói "Let\'s move on to Part 3" và hỏi một câu Part 3 cùng chủ đề.',
      cueCard: { de: 'Describe a person who has inspired you.', goiY: ['who this person is', 'how you know them', 'what they have done', 'and explain why they inspired you'] },
      moDau: ['Part 2 nhé! Bạn có một phút chuẩn bị theo thẻ đề, rồi nói một đến hai phút. [en]Describe a person who has inspired you.[/en]'] },
    { id: 'en-p2-trip', nhom: 'IELTS Part 2', nhomEn: 'IELTS Part 2', ten: 'Một chuyến đi đáng nhớ', tenEn: 'A memorable trip', capDo: 'IELTS Speaking Part 2 (nói dài 1–2 phút theo thẻ đề), mục tiêu band 6.5', giamKhao: true,
      vai: 'Bạn là GIÁM KHẢO IELTS. Người học vừa nói dài theo thẻ đề. Đáp MỘT câu cảm ơn ngắn rồi hỏi MỘT câu rounding-off ngắn; lượt sau chuyển sang Part 3 cùng chủ đề.',
      cueCard: { de: 'Describe a memorable trip you have taken.', goiY: ['where you went', 'who you went with', 'what you did there', 'and explain why it was memorable'] },
      moDau: ['Part 2 nhé! Một phút chuẩn bị, rồi nói một đến hai phút. [en]Describe a memorable trip you have taken.[/en]'] },
    { id: 'en-p2-skill', nhom: 'IELTS Part 2', nhomEn: 'IELTS Part 2', ten: 'Một kỹ năng bạn đã học', tenEn: 'A skill you learned', capDo: 'IELTS Speaking Part 2 (nói dài 1–2 phút theo thẻ đề), mục tiêu band 6.5', giamKhao: true,
      vai: 'Bạn là GIÁM KHẢO IELTS. Người học vừa nói dài theo thẻ đề. Đáp MỘT câu cảm ơn ngắn rồi hỏi MỘT câu rounding-off ngắn; lượt sau chuyển sang Part 3 cùng chủ đề.',
      cueCard: { de: 'Describe a skill that you learned.', goiY: ['what the skill is', 'when and how you learned it', 'how difficult it was', 'and explain how it has helped you'] },
      moDau: ['Part 2 nhé! Một phút chuẩn bị, rồi nói một đến hai phút. [en]Describe a skill that you learned.[/en]'] },
    { id: 'en-p3-education', nhom: 'IELTS Part 3', nhomEn: 'IELTS Part 3', ten: 'Giáo dục & công nghệ', tenEn: 'Education & technology', capDo: P3, vai: `${GK} Chủ đề: education and technology. Câu hỏi mở, đòi lý do và so sánh.`, giamKhao: true,
      moDau: ['Part 3 nhé, câu hỏi sẽ sâu hơn. [en]Do you think technology has changed the way students learn?[/en]'] },
    { id: 'en-p3-city', nhom: 'IELTS Part 3', nhomEn: 'IELTS Part 3', ten: 'Thành thị & nông thôn', tenEn: 'City vs countryside', capDo: P3, vai: `${GK} Chủ đề: city life vs countryside.`, giamKhao: true,
      moDau: ['Part 3 nhé. [en]Why do so many young people move to big cities?[/en]'] },
    { id: 'en-rp-cafe', nhom: 'Tình huống', nhomEn: 'Role-play', ten: 'Gọi đồ ở quán cà phê', tenEn: 'Ordering at a café', capDo: 'giao tiếp cơ bản (A2–B1)', vai: 'Nhập vai: bạn là nhân viên quán cà phê ở London, người học là khách. Giữ vai, nói tự nhiên, câu ngắn.',
      moDau: ['Mình đóng vai nhân viên quán cà phê nhé. [en]Hi there! What can I get for you today?[/en]'] },
    { id: 'en-rp-interview', nhom: 'Tình huống', nhomEn: 'Role-play', ten: 'Phỏng vấn xin việc', tenEn: 'Job interview', capDo: 'giao tiếp công việc (B1–B2)', vai: 'Nhập vai: bạn là người phỏng vấn tuyển thực tập sinh IT, người học là ứng viên. Hỏi từng câu một.',
      moDau: ['Mình là người phỏng vấn nhé. [en]Thanks for coming in today. Could you tell me a little about yourself?[/en]'] },
  ],
  ja: [
    { id: 'ja-n5-jiko', nhom: 'JLPT N5', nhomEn: 'JLPT N5', ten: 'Tự giới thiệu', tenEn: 'Self-introduction', tenGoc: '自己紹介', capDo: 'JLPT N5 — chỉ dùng mẫu câu です/ます, từ vựng N5, câu rất ngắn', vai: 'Hỏi người học về tên, quê, nghề, sở thích — từng câu một.',
      moDau: ['Mình cùng tự giới thiệu nhé. [en]はじめまして。わたしは CuongMini です。おなまえは？[/en]', 'Bắt đầu nhé! [en]こんにちは。おくには どちらですか。[/en]'] },
    { id: 'ja-n5-kaimono', nhom: 'JLPT N5', nhomEn: 'JLPT N5', ten: 'Mua sắm ở konbini', tenEn: 'Shopping at a konbini', tenGoc: 'コンビニで', capDo: 'JLPT N5 — です/ます, số đếm, giá tiền', vai: 'Nhập vai: bạn là nhân viên cửa hàng tiện lợi, người học là khách.',
      moDau: ['Mình là nhân viên cửa hàng tiện lợi nhé. [en]いらっしゃいませ。なにを さがしていますか。[/en]'] },
    { id: 'ja-n5-shumi', nhom: 'JLPT N5', nhomEn: 'JLPT N5', ten: 'Sở thích & cuối tuần', tenEn: 'Hobbies & weekend', tenGoc: 'しゅみ', capDo: 'JLPT N5 — thì quá khứ ました, động từ cơ bản', vai: 'Hỏi về sở thích và việc làm cuối tuần.',
      moDau: ['Mình nói về sở thích nhé. [en]しゅみは なんですか。[/en]', '[en]しゅうまつは なにを しましたか。[/en]'] },
    { id: 'ja-n4-resutoran', nhom: 'JLPT N4', nhomEn: 'JLPT N4', ten: 'Gọi món ở nhà hàng', tenEn: 'Ordering at a restaurant', tenGoc: 'レストランで', capDo: 'JLPT N4 — thể て, ～たい, ～ください', vai: 'Nhập vai: bạn là nhân viên nhà hàng ramen, người học là khách.',
      moDau: ['Mình là nhân viên nhà hàng nhé. [en]いらっしゃいませ。ご注文は お決まりですか。[/en]'] },
    { id: 'ja-n4-michi', nhom: 'JLPT N4', nhomEn: 'JLPT N4', ten: 'Hỏi đường', tenEn: 'Asking for directions', tenGoc: '道を聞く', capDo: 'JLPT N4 — ～て、～たら, từ chỉ phương hướng', vai: 'Nhập vai: bạn là người đi đường ở Tokyo, người học hỏi đường tới ga.',
      moDau: ['Bạn hỏi đường mình nhé, mình là người đi đường ở Tokyo. [en]どうしましたか。だいじょうぶですか。[/en]'] },
    { id: 'ja-n3-baito', nhom: 'JLPT N3', nhomEn: 'JLPT N3', ten: 'Phỏng vấn làm thêm', tenEn: 'Part-time job interview', tenGoc: 'アルバイトの面接', capDo: 'JLPT N3 — kính ngữ cơ bản, ～ことができる, ～ようにする', vai: 'Nhập vai: bạn là quản lý cửa hàng phỏng vấn người học xin làm thêm.',
      moDau: ['Mình là quản lý cửa hàng phỏng vấn bạn nhé. [en]今日は来てくれてありがとう。まず自己紹介をお願いします。[/en]'] },
  ],
  zh: [
    { id: 'zh-hsk1-ziwo', nhom: 'HSK 1', nhomEn: 'HSK 1', ten: 'Tự giới thiệu', tenEn: 'Self-introduction', tenGoc: '自我介绍', capDo: 'HSK 1 — câu rất ngắn, từ vựng HSK1', vai: 'Hỏi tên, quốc tịch, tuổi, nghề — từng câu một.',
      moDau: ['Mình cùng tự giới thiệu nhé. [en]你好！我叫CuongMini。你叫什么名字？[/en]', 'Bắt đầu nhé! [en]你好！你是哪国人？[/en]'] },
    { id: 'zh-hsk1-shijian', nhom: 'HSK 1', nhomEn: 'HSK 1', ten: 'Số, ngày và giờ', tenEn: 'Numbers, dates & time', tenGoc: '时间', capDo: 'HSK 1 — số đếm, ngày tháng, giờ', vai: 'Hỏi ngày sinh, hôm nay thứ mấy, mấy giờ đi học.',
      moDau: ['Mình luyện số và giờ nhé. [en]今天几月几号？[/en]'] },
    { id: 'zh-hsk2-diancai', nhom: 'HSK 2', nhomEn: 'HSK 2', ten: 'Gọi món', tenEn: 'Ordering food', tenGoc: '点菜', capDo: 'HSK 2 — 想/要, lượng từ, giá tiền', vai: 'Nhập vai: bạn là phục vụ quán ăn ở Bắc Kinh, người học là khách.',
      moDau: ['Mình là phục vụ quán ăn nhé. [en]欢迎光临！请问你想吃什么？[/en]'] },
    { id: 'zh-hsk2-wenlu', nhom: 'HSK 2', nhomEn: 'HSK 2', ten: 'Hỏi đường', tenEn: 'Asking for directions', tenGoc: '问路', capDo: 'HSK 2 — 怎么走, 在哪儿, phương hướng', vai: 'Nhập vai: bạn là người đi đường, người học hỏi đường tới ga tàu điện.',
      moDau: ['Bạn hỏi đường mình nhé. [en]你好，你要去哪儿？[/en]'] },
    { id: 'zh-hsk3-zhoumo', nhom: 'HSK 3', nhomEn: 'HSK 3', ten: 'Kế hoạch cuối tuần', tenEn: 'Weekend plans', tenGoc: '周末计划', capDo: 'HSK 3 — 打算, 一边…一边…, 了/过', vai: 'Hỏi kế hoạch cuối tuần, chuyện đã làm tuần trước.',
      moDau: ['Mình nói chuyện cuối tuần nhé. [en]这个周末你打算做什么？[/en]'] },
    { id: 'zh-hsk3-maiyifu', nhom: 'HSK 3', nhomEn: 'HSK 3', ten: 'Mua quần áo', tenEn: 'Buying clothes', tenGoc: '买衣服', capDo: 'HSK 3 — so sánh 比, 有点儿, mặc cả', vai: 'Nhập vai: bạn là người bán quần áo, người học là khách.',
      moDau: ['Mình là người bán quần áo nhé. [en]你好！你想买什么衣服？[/en]'] },
    { id: 'zh-hsk4-gongzuo', nhom: 'HSK 4', nhomEn: 'HSK 4', ten: 'Học tập & công việc', tenEn: 'Study & work', tenGoc: '工作和学习', capDo: 'HSK 4 — câu phức, 虽然…但是…, 因为…所以…', vai: 'Thảo luận về học tập, công việc mơ ước; hỏi lý do.',
      moDau: ['Mình bàn chuyện học và làm nhé. [en]你以后想做什么工作？为什么？[/en]'] },
  ],
};

/** Chủ đề "Bài đang học" — dựng theo tên bài web gửi (mặc định cho người mới: vào thẳng). */
export const MA_BAI_HIEN_TAI = 'bai-hien-tai';

const MO_BAI: Record<NgonNguTC, string[]> = {
  en: ['Mình cùng nói tiếng Anh về bài hôm nay nhé, bí thì cứ nói tiếng Việt. [en]Hi! How are you today?[/en]', 'Chào bạn! Mình luyện nói một chút nhé. [en]What did you do today?[/en]', 'Hôm nay mình nói chuyện nhé, câu ngắn cũng được. [en]How was your day so far?[/en]'],
  ja: ['Mình cùng nói tiếng Nhật nhé, bí thì cứ nói tiếng Việt. [en]こんにちは！きょうは げんきですか。[/en]', 'Chào bạn! Luyện nói chút nhé. [en]きょうは なにを しましたか。[/en]'],
  zh: ['Mình cùng nói tiếng Trung nhé, bí thì cứ nói tiếng Việt. [en]你好！你今天好吗？[/en]', 'Chào bạn! Luyện nói chút nhé. [en]你今天做什么了？[/en]'],
};

export function docNN(x: unknown): NgonNguTC { return x === 'ja' || x === 'zh' ? x : 'en'; }

/** Tìm chủ đề; không có (hoặc `bai-hien-tai`) ⇒ chủ đề theo bài đang học. */
export function timChuDe(nn: NgonNguTC, id: unknown, tenBai = ''): ChuDe {
  const c = CHU_DE[nn].find((x) => x.id === id);
  if (c) return c;
  const bai = String(tenBai).trim().slice(0, 160);
  return {
    id: MA_BAI_HIEN_TAI, nhom: 'Bài đang học', nhomEn: 'Current lesson', ten: bai || 'Trò chuyện tự do', tenEn: bai || 'Free talk',
    capDo: nn === 'en' ? 'mới bắt đầu tới trung cấp (A2–B1)' : nn === 'ja' ? 'mới bắt đầu (N5)' : 'mới bắt đầu (HSK 1–2)',
    vai: bai ? `Trò chuyện tự nhiên, ưu tiên từ và mẫu câu của bài: ${bai}.` : 'Trò chuyện tự nhiên về cuộc sống hằng ngày.',
    moDau: MO_BAI[nn],
  };
}

/** Danh sách cho web (bỏ phần prompt nội bộ). */
export function dsChoWeb(nn: NgonNguTC) {
  return CHU_DE[nn].map(({ id, nhom, nhomEn, ten, tenEn, tenGoc, cueCard, giamKhao }) => ({ id, nhom, nhomEn, ten, tenEn, ...(tenGoc ? { tenGoc } : {}), ...(cueCard ? { cueCard } : {}), ...(giamKhao ? { giamKhao } : {}) }));
}

/** Câu mở đầu — chọn ngẫu nhiên (truyền `r` để test). */
export function cauMoDau(c: ChuDe, r = Math.random()): string {
  return c.moDau[Math.min(c.moDau.length - 1, Math.floor(r * c.moDau.length))]!;
}
