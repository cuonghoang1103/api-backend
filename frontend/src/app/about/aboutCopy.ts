/**
 * Every string on /about, in English and Vietnamese (02/11/2026).
 *
 * Owner facts below come only from what the site already said before the
 * redesign — the old /about (`messages/*.json` → hero.*, about.*), the JSON-LD
 * `Person` in `about/layout.tsx`, and `ContactSection` (location). Anything the
 * site never stated is `null` in `OWNER_TODO` and renders as a dashed
 * placeholder for the owner (dev builds, or `/about?placeholders=1`), never as
 * made-up text for visitors.
 */
import type { Bi } from './aboutData';

export const OWNER = {
  name: 'Cuong Hoang',
  handle: 'CuongHoang',
  photo: '/images/avatar.png',
  email: 'cuongthaihnhe176322@gmail.com',
  role: { en: 'Full-stack developer · AI builder', vi: 'Full-stack developer · AI builder' } as Bi,
  location: { en: 'Hà Nội, Vietnam', vi: 'Hà Nội, Việt Nam' } as Bi,
  languages: { en: 'Vietnamese, English', vi: 'Tiếng Việt, tiếng Anh' } as Bi,
  socials: [
    { label: 'GitHub', href: 'https://github.com/cuonghoang1103' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/cuong-hoang-843a37258/' },
    { label: 'X', href: 'https://x.com/Hncuong311' },
    { label: 'Facebook', href: 'https://www.facebook.com/CuongHoangswit/' },
  ],
};

/**
 * TODO(owner): fill these in — each `null` shows as a dashed placeholder to you
 * (dev / `?placeholders=1`) and is hidden from visitors until it has a value.
 */
export const OWNER_TODO: Record<'education' | 'experience' | 'currently' | 'story', Bi | null> = {
  /** e.g. { en: 'Software Engineering, FPT University (2023–)', vi: 'Kỹ thuật phần mềm, ĐH FPT (2023–)' } */
  education: null,
  /** Years / roles. The old page claimed both "3+ years" and "~6 yrs", so neither is reused here. */
  experience: null,
  /** What you are working on or studying right now. */
  currently: null,
  /** One or two sentences on why you started building this site. */
  story: null,
};

export const PLACEHOLDER_LABEL: Record<keyof typeof OWNER_TODO, Bi> = {
  education: { en: 'Education', vi: 'Học vấn' },
  experience: { en: 'Experience', vi: 'Kinh nghiệm' },
  currently: { en: 'Currently', vi: 'Hiện đang' },
  story: { en: 'Why I built this', vi: 'Vì sao mình làm trang này' },
};

const C = {
  en: {
    pageLabel: 'About',
    heroTitle: 'A place to learn software, and the person who builds it.',
    heroBody:
      'CuongThai is a learning and career platform: curricula, graded exercises, past exam papers, language practice and AI tools, in one place. One developer designs, writes and runs all of it.',
    jumpSite: 'About this website',
    jumpMe: 'About me',
    jumpContact: 'Contact',
    mapTitle: 'How the site is organised',

    siteTitle: 'About this website',
    siteLead:
      'Read for free, practise with real feedback. Everything is organised the way you would study: follow a path, practise until it sticks, sit a real exam paper, then use what you learned at work.',
    siteBody:
      'Content is counted, not estimated: the figures below come from the database, with the time of the count shown.',
    doTitle: 'What you can do here',
    countedTitle: 'Counted from the database',
    countedAt: 'Counted',
    codeTitle: 'Built in the open',
    codeBody: 'Counted from the repository on',
    stackTitle: 'What it runs on',
    open: 'Open',

    meTitle: 'About me',
    meRole: 'Role',
    meLocation: 'Based in',
    meLanguages: 'Languages',
    meBuilding: 'Building this site since',
    meOpenTo: 'Open to work, collaboration, or a question about anything on this site.',
    viewCv: 'View CV',
    skillsTitle: 'Skills, self-assessed',
    skillsNote: 'My own estimate, not a test score.',
    incidentsTitle: 'Production incidents I have fixed',
    incidentsBody:
      'Anyone can list technologies. These are real failures on this site, what caused them, and what changed afterwards.',
    symptom: 'What broke',
    cause: 'Why',
    fix: 'The fix',
    hireTitle: 'Work with me',
    hireBody: 'The studio takes on projects. Start with what it builds, then send a request.',

    contactTitle: 'Get in touch',
    contactBody: 'Email me directly, or use the form.',
    copy: 'Copy',
    copied: 'Copied',
    copyAria: 'Copy email address',
    formName: 'Your name',
    formEmail: 'Your email',
    formSubject: 'Subject',
    formMessage: 'Message',
    formSend: 'Send message',
    formSending: 'Sending…',
    formSent: 'Message sent.',
    formError: 'The message could not be sent. Try again, or email me directly.',
    placeholderHint: 'Owner: add this in app/about/aboutCopy.ts → OWNER_TODO',
  },
  vi: {
    pageLabel: 'Giới thiệu',
    heroTitle: 'Nơi học phần mềm, và người đang xây nó.',
    heroBody:
      'CuongThai là nền tảng học tập và nghề nghiệp: chương trình học, bài tập chấm tự động, đề thi thật, luyện ngoại ngữ và công cụ AI, gom về một chỗ. Một lập trình viên thiết kế, viết và vận hành toàn bộ.',
    jumpSite: 'Về trang web',
    jumpMe: 'Về mình',
    jumpContact: 'Liên hệ',
    mapTitle: 'Trang web được sắp xếp thế nào',

    siteTitle: 'Về trang web này',
    siteLead:
      'Đọc miễn phí, luyện tập có phản hồi thật. Mọi thứ xếp theo đúng cách bạn học: đi theo lộ trình, luyện đến khi nhớ, làm đề thi thật, rồi đem điều đã học vào công việc.',
    siteBody:
      'Nội dung được đếm, không ước lượng: các con số dưới đây lấy từ cơ sở dữ liệu, kèm thời điểm đếm.',
    doTitle: 'Bạn làm được gì ở đây',
    countedTitle: 'Đếm từ cơ sở dữ liệu',
    countedAt: 'Đếm lúc',
    codeTitle: 'Xây dựng công khai',
    codeBody: 'Đếm từ kho mã ngày',
    stackTitle: 'Chạy trên nền gì',
    open: 'Mở',

    meTitle: 'Về mình',
    meRole: 'Vai trò',
    meLocation: 'Nơi ở',
    meLanguages: 'Ngôn ngữ',
    meBuilding: 'Bắt đầu xây trang này từ',
    meOpenTo: 'Sẵn sàng nhận việc, hợp tác, hoặc trả lời câu hỏi về bất cứ thứ gì trên trang.',
    viewCv: 'Xem CV',
    skillsTitle: 'Kỹ năng, tự đánh giá',
    skillsNote: 'Do mình tự ước lượng, không phải điểm bài kiểm tra.',
    incidentsTitle: 'Sự cố production mình đã xử lý',
    incidentsBody:
      'Ai cũng liệt kê được công nghệ. Đây là những lần trang này hỏng thật, nguyên nhân, và điều đã thay đổi sau đó.',
    symptom: 'Hỏng gì',
    cause: 'Vì sao',
    fix: 'Cách chữa',
    hireTitle: 'Hợp tác với mình',
    hireBody: 'Studio nhận làm dự án. Xem studio làm gì trước, rồi gửi yêu cầu.',

    contactTitle: 'Liên hệ',
    contactBody: 'Email trực tiếp cho mình, hoặc dùng biểu mẫu.',
    copy: 'Sao chép',
    copied: 'Đã sao chép',
    copyAria: 'Sao chép địa chỉ email',
    formName: 'Tên của bạn',
    formEmail: 'Email của bạn',
    formSubject: 'Chủ đề',
    formMessage: 'Nội dung',
    formSend: 'Gửi tin nhắn',
    formSending: 'Đang gửi…',
    formSent: 'Đã gửi.',
    formError: 'Chưa gửi được. Thử lại, hoặc email trực tiếp cho mình.',
    placeholderHint: 'Chủ trang: điền ở app/about/aboutCopy.ts → OWNER_TODO',
  },
} as const;

export type AboutCopy = (typeof C)['en'];
export const aboutCopy = (lang: 'en' | 'vi'): AboutCopy => (lang === 'vi' ? C.vi : C.en) as AboutCopy;

/** Bio paragraphs — the same text the old page showed (messages/*.json hero.description, about.description1/2). */
export const BIO: Bi[] = [
  {
    en: 'I build modern web apps with Next.js, Node/Express and TypeScript on PostgreSQL, with AI features that actually ship — interview grading, CV critique, language tutoring. This whole platform is something I built and run myself.',
    vi: 'Mình xây web hiện đại bằng Next.js, Node/Express và TypeScript trên PostgreSQL, kèm các tính năng AI thật — chấm phỏng vấn, mổ CV, gia sư ngôn ngữ. Cả nền tảng này là sản phẩm mình tự dựng và tự vận hành.',
  },
  {
    en: 'I would rather build the thing than go looking for it. The data schema, the API routers, the deploy pipeline — all written and operated by me on my own VPS.',
    vi: 'Mình thích tự dựng thứ mình cần thay vì đi tìm. Lược đồ dữ liệu, các router API, quy trình triển khai — đều do mình viết và tự vận hành trên VPS riêng.',
  },
  {
    en: 'Outside of coding, I write up the production incidents I have hit and how each was fixed — the part nobody can copy, and the part I learn most from.',
    vi: 'Ngoài lúc code, mình viết lại những sự cố production đã gặp và cách chữa — vì đó là phần hiếm ai chép được, và cũng là phần học được nhiều nhất.',
  },
];
