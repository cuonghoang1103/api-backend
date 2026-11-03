/**
 * Every string on /about, in English and Vietnamese (02/11/2026).
 *
 * Owner facts below come only from what the site already said before the
 * redesign — the old /about (`messages/*.json` → hero.*, about.*), the JSON-LD
 * `Person` in `about/layout.tsx`, and `ContactSection` (location), plus what the
 * owner told us on 03/11/2026 for `OWNER_TODO` (education, experience, now, why).
 * A slot set to `null` renders as a dashed placeholder for the owner (dev
 * builds, or `/about?placeholders=1`), never as made-up text for visitors.
 */
import type { Bi } from './aboutData';

export const OWNER = {
  name: 'Cuong Hoang',
  handle: 'CuongHoang',
  photo: '/images/avatar.png',
  email: 'cuongthaihnhe176322@gmail.com',
  role: { en: 'Software Engineering student · Full-stack developer · AI builder', vi: 'Sinh viên Kỹ thuật phần mềm · Full-stack developer · AI builder' } as Bi,
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
 * The four "About me" slots. Filled 03/11/2026 from facts the owner gave; set a
 * slot back to `null` to hide it (it then shows as a dashed placeholder to you in
 * dev / `?placeholders=1`, never to visitors).
 */
export const OWNER_TODO: Record<'education' | 'experience' | 'currently' | 'story', Bi | null> = {
  education: {
    en: 'Software Engineering at FPT University. I specialise in Node.js and Spring Boot, and I am heading toward AI engineering, then MLOps.',
    vi: 'Kỹ thuật phần mềm, Đại học FPT. Chuyên ngành hẹp Node.js và Spring Boot; mình đang hướng tới AI Engineer, rồi MLOps.',
  },
  experience: {
    en: 'My experience comes from building and running real products end to end: CT Work (web, desktop, iOS), the CuongMini AI tools and this platform. Every production incident and bug teaches me something hands-on instead of theory.',
    vi: 'Kinh nghiệm của mình đến từ việc tự làm và vận hành sản phẩm thật từ đầu đến cuối: CT Work (web, máy tính, iOS), bộ công cụ AI CuongMini và chính nền tảng này. Mỗi sự cố, mỗi lỗi khi vận hành đều cho mình thêm một bài học thực tế thay vì lý thuyết suông.',
  },
  currently: {
    en: 'Writing courses and recording video lessons for this site, and looking after CT Work, now on the App Store. I practise every day in Code Lab and on the real projects here.',
    vi: 'Soạn khoá học và quay video bài giảng cho trang, và chăm CT Work vừa lên App Store. Mỗi ngày mình luyện thêm ở Code Lab và các dự án thật trên trang.',
  },
  story: {
    en: 'This is my personal website. It began as a place to keep and organise my study materials and notes, and I turn them into courses and practice, for myself and for other students. It is also my workshop: where I build real products end to end and ship them, on the web, the desktop, iOS and as AI tools.',
    vi: 'Đây là trang web cá nhân của mình. Ban đầu nó là chỗ cất và sắp xếp tài liệu học, ghi chép của mình, rồi mình biến chúng thành khoá học và bài luyện, cho mình và cho các bạn sinh viên khác. Nó cũng là xưởng của mình: nơi mình tự làm sản phẩm thật từ đầu đến cuối và đưa ra dùng, trên web, máy tính, iOS và thành công cụ AI.',
  },
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
      'This is my personal website. I keep my study materials here and turn them into curricula, graded exercises, past exam papers, language practice and AI tools, for me and for other students. It is also where I build and ship real products. One developer designs, writes and runs all of it.',
    heroNew: 'New',
    heroNewText: 'CT Work is on the App Store',
    jumpSite: 'About this website',
    jumpWork: 'What I’ve built',
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
    codeGate: 'Type checks gate every deploy, which then smoke-tests the core routes before it counts as done.',
    postsTitle: 'Latest writing',
    postsAll: 'All articles',
    hanzi: 'kanji & hanzi',
    repos: 'curated repositories',

    workTitle: 'What I’ve built',
    workLead:
      'This is my hands-on experience: products I designed, built, shipped and still run myself. Every link below goes to the real thing.',
    platforms: 'Runs on',
    status: 'Status',
    openWeb: 'Open on the web',
    desktopApp: 'Desktop app',
    caseStudy: 'Case study',
    releases: 'Releases on GitHub',
    moreProjects: 'More projects',
    studioTitle: 'The studio page',
    studioBody: 'The same products, told for clients: case studies, the stack in production and how a project is run.',
    mentorTitle: 'Mentoring',
    mentorBody: 'I mentor three junior students through their PRJ301 project: the plan and task board on CT Work, step-by-step guides, and code review.',
    stackTitle: 'What it runs on',
    open: 'Open',

    meTitle: 'About me',
    meRole: 'Role',
    meLocation: 'Based in',
    meLanguages: 'Languages',
    meBuilding: 'Building this site since',
    meOpenTo: 'Open to work, collaboration, or a question about anything on this site.',
    viewCv: 'View CV',
    downloadCv: 'Download CV',
    cvUpdated: 'Updated',
    cvOther: 'Other formats:',
    skillsTitle: 'Skills, self-assessed',
    skillsNote: 'My own estimate, not a test score.',
    skillsIntro: 'Grouped by what they do. Tap one for the proficiency bar, what I actually know, and the real products that use it.',
    skillKnow: 'What I know',
    skillUsedIn: 'Used in',
    runTitle: 'How it all runs',
    runIntro:
      'One VPS, Docker-managed, from the apps people open down to the database and the AI. Tap a product to open the real thing.',
    runLegend: 'All on one self-managed server',
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
      'Đây là trang web cá nhân của mình. Mình cất tài liệu học ở đây rồi biến chúng thành chương trình học, bài tập chấm tự động, đề thi thật, luyện ngoại ngữ và công cụ AI, cho mình và cho các bạn sinh viên khác. Đây cũng là nơi mình làm và đưa sản phẩm thật ra dùng. Một lập trình viên thiết kế, viết và vận hành toàn bộ.',
    heroNew: 'Mới',
    heroNewText: 'CT Work đã có trên App Store',
    jumpSite: 'Về trang web',
    jumpWork: 'Sản phẩm mình làm',
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
    codeGate: 'Kiểm kiểu chặn mọi lần deploy, rồi deploy tự kiểm các route lõi trước khi được coi là xong.',
    postsTitle: 'Bài viết mới',
    postsAll: 'Xem tất cả bài viết',
    hanzi: 'chữ Hán & Kanji',
    repos: 'kho mã tuyển chọn',

    workTitle: 'Sản phẩm mình làm',
    workLead:
      'Đây là kinh nghiệm thực tế của mình: những sản phẩm mình tự thiết kế, viết, phát hành và vẫn đang tự vận hành. Mọi liên kết dưới đây dẫn tới sản phẩm thật.',
    platforms: 'Chạy trên',
    status: 'Trạng thái',
    openWeb: 'Mở trên web',
    desktopApp: 'App máy tính',
    caseStudy: 'Case study',
    releases: 'Bản phát hành trên GitHub',
    moreProjects: 'Xem thêm dự án',
    studioTitle: 'Trang studio',
    studioBody: 'Cũng những sản phẩm này, kể cho khách hàng: case study, công nghệ đang chạy production và cách một dự án được làm.',
    mentorTitle: 'Kèm học',
    mentorBody: 'Mình kèm ba bạn khoá dưới làm đồ án PRJ301: lập kế hoạch và bảng việc trên CT Work, viết hướng dẫn từng bước, và review code.',
    stackTitle: 'Chạy trên nền gì',
    open: 'Mở',

    meTitle: 'Về mình',
    meRole: 'Vai trò',
    meLocation: 'Nơi ở',
    meLanguages: 'Ngôn ngữ',
    meBuilding: 'Bắt đầu xây trang này từ',
    meOpenTo: 'Sẵn sàng nhận việc, hợp tác, hoặc trả lời câu hỏi về bất cứ thứ gì trên trang.',
    viewCv: 'Xem CV',
    downloadCv: 'Tải CV',
    cvUpdated: 'Cập nhật',
    cvOther: 'Định dạng khác:',
    skillsTitle: 'Kỹ năng, tự đánh giá',
    skillsNote: 'Do mình tự ước lượng, không phải điểm bài kiểm tra.',
    skillsIntro: 'Nhóm theo công việc chúng làm. Chạm vào một kỹ năng để xem thanh thành thạo, mình thực sự biết gì, và sản phẩm thật nào đang dùng nó.',
    skillKnow: 'Mình làm được gì',
    skillUsedIn: 'Dùng trong',
    runTitle: 'Bộ máy vận hành',
    runIntro:
      'Một VPS, quản lý bằng Docker, từ app người dùng mở xuống tới cơ sở dữ liệu và AI. Chạm vào một sản phẩm để mở thứ thật.',
    runLegend: 'Tất cả trên một máy chủ mình tự quản',
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
