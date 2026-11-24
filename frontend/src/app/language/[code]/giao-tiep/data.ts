/**
 * Khoá TIẾNG ANH GIAO TIẾP (30 ngày; A2 → B2). Hạ tầng dựng 24/11/2026 — user: "tiếng anh giao tiếp, đi làm… đầy đủ".
 *
 * Ranh giới (KHÔNG lặp): IELTS Tập 1–5 lo thi + 4 kỹ năng học thuật; khoá Courses `tieng-anh-ky-thuat-di-lam` lo tiếng Anh
 * KỸ THUẬT (ticket, bug report, commit/PR, email khách, Q&A list, standup, demo, họp khách); `interview-prep` ch8 lo phỏng vấn
 * kỹ thuật. Khoá này lo GIAO TIẾP: đời sống + công sở không kỹ thuật + kết bạn, văn hoá, nghe người bản xứ nói thật.
 * Kế hoạch + quy tắc soạn: `docs/en-giao-tiep-soan.md`.
 *
 * Khuôn ngày: **listening** (cảnh hội thoại, nhiều giọng) · **speaking** (mẫu câu theo mức lịch sự, phát âm, nhập vai) ·
 * **reading** (ngày lẻ: tin nhắn, thông báo, thực đơn, email…) / **writing** (ngày chẵn: tự nhắn, tự viết) · **homework**;
 * Ngày 6 / 12 / 18 / 24 / 30 thêm bài `review` (kiểm tra chặng).
 *
 * TÁCH khỏi IELTS (cùng bộ khung `components/sach-hoc`, khác khoá):
 *   - `stage: 'giaotiep1'`, `storageKey: 'en-giao-tiep'` — tiến độ riêng. Đổi là MẤT tiến độ người học.
 *   - id bài / bài tập: `gtdN-…`. `npm run course:manifest` chặn id sai tiền tố.
 */

import { loadNgay } from './ngay';
import { MANIFEST } from './ngay/manifest';
import { VIDEO_BAI_GT } from './videos';

import { defineCourse } from '@/components/sach-hoc/course';
import type { Lesson, Day } from '@/components/sach-hoc/types';

export type { Ex, Block, Voice, Role, Kind, Lesson, Day } from '@/components/sach-hoc/types';

/* ───────────────────────── Bắt đầu ───────────────────────── */

const INTRO: Lesson = {
  id: 'gt-bat-dau',
  kind: 'intro',
  title: 'Bắt đầu: nói được tiếng Anh trong 30 ngày',
  goal: 'Biết khoá này dạy gì, khác IELTS ở đâu, mỗi ngày học thế nào và cuối khoá làm được gì.',
  minutes: 6,
  blocks: [
    {
      t: 'recap',
      title: 'Khoá này dành cho ai',
      items: [
        'Bạn đọc hiểu được câu đơn giản nhưng **gặp người nước ngoài là đứng hình**, nghe không kịp, không biết mở lời hay kết thúc cuộc nói chuyện.',
        'Cần mức khoảng **A2** để bắt đầu (xong IELTS Tập 1 là đủ). Học xong khoảng **B2**: nói chuyện 15–20 phút về đời sống và công việc mà không phải dịch trong đầu.',
        '**30 ngày**, mỗi ngày **3 bài + 1 bài tập**, khoảng 60–75 phút. Ngày **6, 12, 18, 24, 30** có kiểm tra chặng.',
        'Khác IELTS: IELTS dạy để **thi đạt band**; khoá này dạy để **nói chuyện được với người thật** — câu ngắn, tự nhiên, đúng mức lịch sự, nghe được người ta nói nhanh.',
      ],
    },
    { t: 'h', text: 'Mỗi ngày học gì?' },
    {
      t: 'table',
      head: ['Bài', 'Bạn làm gì', 'Kết quả'],
      rows: [
        ['1 · Nghe cảnh', 'Nghe một cảnh hội thoại thật (nhiều giọng: Anh, Mỹ, Úc, Canada, NZ, Ireland), trả lời câu hỏi, chép chính tả câu khó', 'Nghe kịp tốc độ thật'],
        ['2 · Nói', 'Mẫu câu xếp theo mức lịch sự, phát âm, nhại theo (shadowing), nhập vai từng lượt', 'Nói được ngay câu cần dùng'],
        ['3 · Đọc / Viết', 'Ngày lẻ đọc tin nhắn, thông báo, email; ngày chẵn tự viết tin nhắn, email ngắn', 'Nhắn tin, email tự nhiên'],
        ['Bài tập', '≥ 30 câu có đáp án: chọn câu hợp cảnh, sửa câu "kiểu Việt", sắp xếp hội thoại, chính tả', 'Nhớ lâu'],
      ],
    },
    {
      t: 'note',
      title: 'Học sao cho nói được',
      items: [
        '**Nói to mọi câu mẫu** — đọc thầm không làm miệng quen. Bấm loa nghe trước, nói theo, ghi âm so lại.',
        'Mỗi ngày **nhập vai một cảnh với Gia sư AI** (nút Gia sư ở góc màn) hoặc ở trang **Nhập vai** — sai cứ nói tiếp, AI sửa sau.',
        'Mẫu câu tự vào **Tra cứu từ vựng** và app CT Language để ôn thẻ.',
        'Tiếng Anh **kỹ thuật khi đi làm** (ticket, PR, email khách, standup, demo): khoá **Technical English at Work** ở mục Courses. **Thi IELTS**: IELTS Tập 1–5.',
      ],
    },
  ],
};

/* ─────────────── Mục lục 30 ngày (docs/en-giao-tiep-soan.md mục 2) ─────────────── */

type Stub = [Lesson['kind'], string];

const stub = (n: number, i: number, [kind, title]: Stub): Lesson => ({
  id: `gtd${n}-${i}`,
  kind,
  title,
  goal: '',
  minutes: 25,
});

/** 3 bài mỗi ngày: nghe cảnh · nói · đọc (lẻ) / viết (chẵn). Bài tập + Kiểm tra chặng tự thêm ở `DAYS`. */
const MUC_LUC: Stub[][] = [
  /* Chặng 1 — Sống sót (A2) */
  /* 1 */ [['listening', 'Gặp lần đầu: chào, giới thiệu, hỏi thăm'], ['speaking', 'Tự giới thiệu 30 giây + hỏi lại người kia'], ['reading', 'Hồ sơ, thẻ tên, lời chào trong tin nhắn']],
  /* 2 */ [['listening', 'Khi không nghe kịp: xin nhắc lại, đánh vần, số'], ['speaking', 'Câu "cứu nguy" — hỏi lại, nói chậm, xác nhận'], ['writing', 'Nhắn xác nhận tên, số điện thoại, giờ hẹn']],
  /* 3 */ [['listening', 'Small talk: thời tiết, cuối tuần, sở thích'], ['speaking', 'Giữ câu chuyện: hỏi tiếp, kể thêm, phản hồi'], ['reading', 'Bài đăng mạng xã hội & bình luận']],
  /* 4 */ [['listening', 'Quán cà phê & nhà hàng: gọi món, dị ứng, tính tiền'], ['speaking', 'Gọi món, đổi món, phàn nàn nhẹ'], ['writing', 'Đặt bàn, nhắn rủ đi ăn, đánh giá quán']],
  /* 5 */ [['listening', 'Mua sắm & dịch vụ: hỏi giá, đổi trả, ngân hàng'], ['speaking', 'Hỏi, mặc cả, đổi trả lịch sự'], ['reading', 'Hoá đơn, chính sách đổi trả, khuyến mãi']],
  /* 6 */ [['listening', 'Đi lại: hỏi đường, gọi xe, sân bay, khách sạn'], ['speaking', 'Chỉ đường và hỏi đường'], ['writing', 'Nhắn tài xế, check-in, hỏi lễ tân']],
  /* Chặng 2 — Đời sống (A2+ → B1) */
  /* 7 */ [['listening', 'Hiệu thuốc & bác sĩ: mô tả triệu chứng'], ['speaking', 'Nói về sức khoẻ, đặt lịch khám'], ['reading', 'Đơn thuốc, hướng dẫn dùng thuốc, bảo hiểm']],
  /* 8 */ [['listening', 'Thuê nhà: xem phòng, hợp đồng, báo hỏng'], ['speaking', 'Nói chuyện với chủ nhà & hàng xóm'], ['writing', 'Tin nhắn báo hỏng, email hỏi thuê phòng']],
  /* 9 */ [['listening', 'Gọi điện: đặt lịch, để lại lời nhắn, nghe hộp thư'], ['speaking', 'Mở đầu – chuyển máy – kết thúc cuộc gọi'], ['reading', 'Lời nhắn thoại chép lại, thông báo lịch hẹn']],
  /* 10 */ [['listening', 'Mời, nhận lời, từ chối, dời hẹn'], ['speaking', 'Từ chối khéo không làm mất lòng'], ['writing', 'Thiệp mời, nhắn từ chối, đổi lịch']],
  /* 11 */ [['listening', 'Kể chuyện đã xảy ra: trình tự & phản ứng người nghe'], ['speaking', 'Kể một chuyện 1 phút (quá khứ + từ nối thời gian)'], ['reading', 'Chuyện ngắn đời thường, tin nhắn kể chuyện']],
  /* 12 */ [['listening', 'Cảm xúc: khen, cảm ơn, xin lỗi, chia buồn, chúc mừng'], ['speaking', 'Nói đúng cảm xúc, đúng mức'], ['writing', 'Thiệp chúc mừng, lời xin lỗi, lời cảm ơn']],
  /* Chặng 3 — Công sở (B1) */
  /* 13 */ [['listening', 'Ngày đầu đi làm: làm quen với team'], ['speaking', 'Giới thiệu mình với đồng nghiệp, nhớ và gọi tên'], ['reading', 'Email chào mừng, sơ đồ văn phòng, nội quy']],
  /* 14 */ [['listening', 'Small talk công sở: giờ ăn trưa, pantry, sau họp'], ['speaking', 'Chủ đề an toàn và chủ đề nên tránh'], ['writing', 'Tin nhắn nhóm: rủ ăn trưa, sinh nhật đồng nghiệp']],
  /* 15 */ [['listening', 'Nhờ giúp, đề nghị giúp, hỏi ý kiến'], ['speaking', 'Bậc lịch sự: can you → could you → would you mind'], ['reading', 'Tin nhắn nhờ việc: đọc giọng điệu']],
  /* 16 */ [['listening', 'Xin nghỉ, báo ốm, báo trễ, xin về sớm'], ['speaking', 'Nói với quản lý: xin phép và giải thích'], ['writing', 'Tin nhắn / email xin nghỉ, báo trễ']],
  /* 17 */ [['listening', 'Video call: kết nối, mic, chia sẻ màn hình, nói chồng'], ['speaking', 'Câu dùng khi gọi video'], ['reading', 'Lời mời họp, chat trong cuộc gọi, biên bản ngắn']],
  /* 18 */ [['listening', 'Nêu ý kiến, đồng ý, không đồng ý khi trò chuyện'], ['speaking', 'Không đồng ý lịch sự — 3 mức'], ['writing', 'Trả lời góp ý trong nhóm chat']],
  /* Chặng 4 — Giao tiếp sâu (B1+ → B2) */
  /* 19 */ [['listening', 'Kết bạn & networking: meetup, hội thảo'], ['speaking', 'Mở lời, giữ chuyện, xin liên lạc, chào ra về'], ['reading', 'Hồ sơ LinkedIn, lời mời kết nối']],
  /* 20 */ [['listening', 'Đón khách nước ngoài: giới thiệu Việt Nam'], ['speaking', 'Giải thích món ăn, phong tục, lịch sử ngắn'], ['writing', 'Lịch trình gợi ý cho khách, tin nhắn hướng dẫn']],
  /* 21 */ [['listening', 'Phàn nàn & giải quyết: khách sạn, giao hàng, dịch vụ'], ['speaking', 'Phàn nàn chắc mà lịch sự; xử lý khi bị phàn nàn'], ['reading', 'Email khiếu nại & thư trả lời của công ty']],
  /* 22 */ [['listening', 'Thuyết phục & thương lượng đời thường'], ['speaking', 'Đưa đề xuất, nhượng bộ, chốt'], ['writing', 'Tin nhắn thuyết phục nhóm, đề xuất kế hoạch']],
  /* 23 */ [['listening', 'Chuyện thời sự: kể lại tin và bình luận'], ['speaking', 'Nói chắc vừa phải: I think, it seems, apparently'], ['reading', 'Tin ngắn, tiêu đề báo — cách đọc']],
  /* 24 */ [['listening', 'Khác biệt văn hoá: nói thẳng / vòng, đùa, chủ đề nhạy cảm'], ['speaking', 'Khi lỡ lời: chữa ngượng, đổi chủ đề'], ['writing', 'Trả lời khéo một tin nhắn khó']],
  /* Chặng 5 — Tự nhiên như người bản xứ (B2) */
  /* 25 */ [['listening', 'Nghe người bản xứ nói nhanh: nối âm, gonna, wanna'], ['speaking', 'Nói tự nhiên: rút gọn, từ đệm, nhịp câu'], ['reading', 'Tiếng lóng & idiom hay gặp — đọc trong ngữ cảnh']],
  /* 26 */ [['listening', 'Trò chuyện dài: giữ mạch, chuyển chủ đề, kết thúc khéo'], ['speaking', 'Nói 3 phút không đứt: chuyển ý, quay lại ý'], ['writing', 'Email/tin nhắn dài kể chuyện cho bạn nước ngoài']],
  /* 27 */ [['listening', 'Kể chuyện hấp dẫn và đùa nhẹ'], ['speaking', 'Kể chuyện có cao trào; hiểu và đáp lại câu đùa'], ['reading', 'Truyện cười ngắn, chơi chữ — vì sao buồn cười']],
  /* 28 */ [['listening', 'Nói về bản thân, mục tiêu, nghề nghiệp với sếp mới / nhà tuyển dụng'], ['speaking', 'Câu chuyện của bạn trong 2 phút'], ['writing', 'Đoạn giới thiệu bản thân, tin nhắn cảm ơn sau buổi gặp']],
  /* 29 */ [['listening', 'Tình huống khó: bị ngắt lời, hiểu lầm, khẩn cấp'], ['speaking', 'Giữ lượt nói, gỡ hiểu lầm, gọi giúp đỡ'], ['reading', 'Biển báo, hướng dẫn khẩn cấp, thông báo sự cố']],
  /* 30 */ [['listening', 'Một ngày sống bằng tiếng Anh — 6 cảnh liền'], ['speaking', 'Nhập vai tổng hợp 15 phút với Gia sư AI'], ['writing', 'Nhật ký một ngày bằng tiếng Anh + tự chấm']],
];

/** Ngày có bài kiểm tra chặng (`kind: 'review'`, id `gtdN-kiem-tra`) → các ngày nó gom. */
export const CHANG_GT: Record<number, string> = { 6: 'Ngày 1–6', 12: 'Ngày 7–12', 18: 'Ngày 13–18', 24: 'Ngày 19–24', 30: 'Ngày 25–30' };

const khungNgay = (n: number, ba: Stub[]): Lesson[] => [
  ...ba,
  ['homework', `Bài tập Ngày ${n}`] as Stub,
  ...(CHANG_GT[n] ? [['review', `Kiểm tra chặng (${CHANG_GT[n]})`] as Stub] : []),
].map((s, j) => stub(n, j + 1, s));

export const DAYS: Day[] = MUC_LUC.map((ba, i) => ({ n: i + 1, lessons: MANIFEST[i + 1]?.lessons ?? khungNgay(i + 1, ba) }));

/** Tra cứu từ vựng / mẫu câu của khoá — khối `vocabAll` tự đọc từ mục lục. */
const TRA_TU_VUNG_GT: Lesson = {
  id: 'gt-tra-tu-vung',
  kind: 'vocab',
  title: 'Tra cứu: mẫu câu & từ vựng giao tiếp',
  goal: 'Tìm nhanh mọi mẫu câu, cụm từ đã học (gõ tiếng Anh hoặc tiếng Việt), lọc theo ngày, che nghĩa để tự kiểm tra.',
  minutes: 10,
  blocks: [
    {
      t: 'recap',
      title: 'Ôn mẫu câu mỗi ngày 10 phút',
      items: [
        'Chọn **ngày vừa học** → **Che nghĩa** → nhìn câu tiếng Anh, nói to nghĩa.',
        'Đổi sang **Che tiếng Anh**: nhìn nghĩa, **nói thành câu tiếng Anh** — đây mới là luyện nói thật.',
        'Mẫu câu cũng có trong app CT Language để ôn thẻ trên điện thoại.',
      ],
    },
    { t: 'vocabAll' },
  ],
};

export { INTRO };

export const GIAO_TIEP = defineCourse({
  // ⚠️ Máy chủ chỉ nhận stage có trong `CAC_SACH` (src/services/ielts/ielts.service.ts) — 'giaotiep1' thêm 24/11/2026.
  stage: 'giaotiep1',
  storageKey: 'en-giao-tiep',
  title: 'Tiếng Anh giao tiếp',
  backHref: '/language/en',
  ngonNgu: 'en',
  unit: 'Ngày',
  badgeWord: 'Day',
  intro: INTRO,
  extras: [TRA_TU_VUNG_GT],
  links: [
    { href: '/language/en/roleplay', label: '🎭 Nhập vai với AI — luyện cảnh vừa học' },
    { href: '/language/en/conversation', label: '💬 Trò chuyện tự do với AI' },
    { href: '/language/en/nhan-xet-tuan', label: '📊 Nhận xét tuần của CuongMini — số liệu, điểm yếu, kế hoạch tuần sau' },
    { href: '/language/en/ielts', label: '📘 IELTS Tập 1–5 (mất gốc → band 8.0)' },
    { href: '/courses/tieng-anh-ky-thuat-di-lam', label: '💼 Technical English at Work — tiếng Anh kỹ thuật khi đi làm' },
  ],
  videos: VIDEO_BAI_GT,
  days: DAYS,
  manifest: MANIFEST,
  loadDay: loadNgay,
  kindLabel: { review: 'Kiểm tra' },
  kindEn: {
    intro: 'Start Here', grammar: 'Grammar', vocab: 'Phrases', listening: 'Listening — Scene',
    reading: 'Reading', writing: 'Writing', speaking: 'Speaking', homework: 'Homework',
    review: 'Checkpoint Test',
  },
  kindHue: {},
  voice: 'us-nu',
  tutor: { name: 'Gia sư giao tiếp', mon: 'ielts' },
  planContext: 'Trang kế hoạch học Tiếng Anh giao tiếp (A2 → B2): 30 ngày, mỗi ngày nghe một cảnh hội thoại · luyện nói mẫu câu + nhập vai · đọc (ngày lẻ) / viết (ngày chẵn) tin nhắn, email; kiểm tra chặng Ngày 6/12/18/24/30. Năm chặng: sống sót · đời sống · công sở · giao tiếp sâu · tự nhiên như người bản xứ.',
});
