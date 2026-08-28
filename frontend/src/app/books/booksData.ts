// Dữ liệu bộ sách CuongThai Book Series (25 tập) — trích từ index.html gốc.
// Mỗi tập mở ở /books/<file> (HTML tự chứa). Cập nhật: tái sinh từ nguồn.
export type Book = { vol: string; file: string; color: string; title: string; chapters: string; practice: string; words: string; icon: string };
export type BookGroup = { title: string; desc: string; books: Book[] };
export type PlannedBook = { vol: string; title: string; chapters: string };

// Logo thương hiệu THẬT (Simple Icons, đơn sắc) cho từng tập — phủ lên bìa bằng
// CSS mask nên ăn theo màu "foil" của bìa, đóng vai ép nhũ như bìa cứng thật.
// File nằm ở /public/books/logos/<slug>.svg. Bốn tập là khái niệm thuần (không
// có một logo hãng duy nhất) → để trống, dùng lại glyph vẽ tay trong `icon`.
export const BOOK_LOGOS: Record<string, string> = {
  '01': 'react', '02': 'openjdk', '03': 'javascript', '04': 'typescript',
  '05': 'nextdotjs', '06': 'postgresql', '07': 'nodedotjs', '08': 'docker',
  '09': 'git', '10': 'tailwindcss', '11': 'prisma', '12': 'redis',
  '13': 'socketdotio', '14': 'openid', '15': 'nginx', '16': 'ubuntu',
  '17': 'linux', '18': 'githubactions', '20': 'cloudflare', '21': 'ffmpeg',
  '22': 'grafana',
  // 24 Terminal · 25 Networking · 19 Object Storage · 23 Payment → glyph khái niệm
};

export const SERIES_STATS = {
  "volumes": "41",
  "chapters": "649",
  "practice": "5,503",
  "listings": "2,425",
  "tables": "1,468",
  "words": "1,469,374"
} as const;

// Bộ Kỹ năng toàn diện: đúng 16 quyển / 237 chương (No. 26–41), TRỌN BỘ.
export const SKILL_BOOKS: Book[] = [
  {
    vol: '26', file: '26-lam-chu-ban-than.html', color: '#6B3A6E',
    title: 'Làm chủ bản thân', chapters: '14', practice: '112', words: '35,826',
    icon: '<svg viewBox="0 0 100 100" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="50" cy="50" r="36"/><path d="M50 20v60M28 36c9 4 15 3 22-3M72 36c-9 4-15 3-22-3M30 66c8-5 14-5 20 0M70 66c-8-5-14-5-20 0"/></g><circle cx="50" cy="50" r="5" fill="currentColor"/></svg>',
  },
  {
    vol: '27', file: '27-tu-duy-phan-bien-va-giai-quyet-van-de.html', color: '#8E3B2A',
    title: 'Tư duy phản biện và giải quyết vấn đề', chapters: '17', practice: '136', words: '44,022',
    icon: '<svg viewBox="0 0 100 100" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M18 78l22-22 14 12 28-34"/><path d="M64 34h18v18"/><circle cx="36" cy="34" r="18"/><path d="M31 34h10M36 29v10"/></g></svg>',
  },
  {
    vol: '28', file: '28-hoc-cach-hoc-va-quan-ly-tri-thuc.html', color: '#256B4F',
    title: 'Học cách học và quản lý tri thức', chapters: '13', practice: '104', words: '26,774',
    icon: '<svg viewBox="0 0 100 100" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 28c14-6 26-4 38 5v48c-12-9-24-11-38-5zM88 28c-14-6-26-4-38 5v48c12-9 24-11 38-5z"/><path d="M25 43h13M25 53h17M75 43H62M75 53H58"/></g></svg>',
  },
  {
    vol: '29', file: '29-quan-ly-thoi-gian-va-hieu-suat.html', color: '#2B4C86',
    title: 'Quản lý thời gian và hiệu suất', chapters: '13', practice: '104', words: '37,363',
    icon: '<svg viewBox="0 0 100 100" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="50" cy="52" r="34"/><path d="M50 32v20l14 10"/><path d="M40 12h20"/></g></svg>',
  },
  {
    vol: '30', file: '30-giao-tiep-chuyen-nghiep.html', color: '#0E6E6B',
    title: 'Giao tiếp chuyên nghiệp', chapters: '15', practice: '120', words: '42,561',
    icon: '<svg viewBox="0 0 100 100" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M14 24h72v46H46l-14 14v-14H14z"/><path d="M28 40h44M28 52h30"/></g></svg>',
  },
  {
    vol: '31', file: '31-lam-viec-nhom-va-xu-ly-mau-thuan.html', color: '#8A5A14',
    title: 'Làm việc nhóm và xử lý mâu thuẫn', chapters: '12', practice: '96', words: '30,480',
    icon: '<svg viewBox="0 0 100 100" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="36" cy="34" r="14"/><circle cx="70" cy="40" r="11"/><path d="M12 82c2-18 14-28 24-28s22 10 24 28"/><path d="M60 82c2-14 10-22 18-22s15 8 17 22"/></g></svg>',
  },
  {
    vol: '32', file: '32-lap-ke-hoach-va-quan-ly-du-an.html', color: '#3B3E8C',
    title: 'Lập kế hoạch và quản lý dự án', chapters: '15', practice: '120', words: '40,292',
    icon: '<svg viewBox="0 0 100 100" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="10" y="16" width="80" height="68" rx="6"/><path d="M10 34h80"/><path d="M36 16v68M63 16v68"/></g></svg>',
  },
  {
    vol: '33', file: '33-lanh-dao-va-quan-ly-con-nguoi.html', color: '#6B3A6E',
    title: 'Lãnh đạo và quản lý con người', chapters: '17', practice: '136', words: '49,163',
    icon: '<svg viewBox="0 0 100 100" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M16 70l-4-34 20 14 18-24 18 24 20-14-4 34z"/><path d="M16 70h68"/></g></svg>',
  },
  {
    vol: '34', file: '34-lap-trinh-va-nang-luc-cong-nghe.html', color: '#3D5567',
    title: 'Lập trình và năng lực công nghệ', chapters: '20', practice: '160', words: '61,592',
    icon: '<svg viewBox="0 0 100 100" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="10" y="20" width="80" height="60" rx="8"/><path d="M26 42l12 10-12 10"/><path d="M48 62h20"/></g></svg>',
  },
  {
    vol: '35', file: '35-xay-dung-san-pham.html', color: '#256B4F',
    title: 'Xây dựng sản phẩm', chapters: '14', practice: '112', words: '38,917',
    icon: '<svg viewBox="0 0 100 100" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="16" y="50" width="26" height="26" rx="4"/><rect x="58" y="50" width="26" height="26" rx="4"/><rect x="37" y="16" width="26" height="26" rx="4"/></g></svg>',
  },
  {
    vol: '36', file: '36-marketing-ban-hang-va-go-to-market.html', color: '#8E3B2A',
    title: 'Marketing, bán hàng và đưa sản phẩm ra thị trường', chapters: '22', practice: '176', words: '65,821',
    icon: '<svg viewBox="0 0 100 100" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M14 42v16h12l30 20V22L26 42z"/><path d="M56 38a14 14 0 0 1 0 24"/><path d="M70 30a26 26 0 0 1 0 40"/></g></svg>',
  },
  {
    vol: '37', file: '37-su-nghiep-phong-van-va-freelance.html', color: '#2B4C86',
    title: 'Sự nghiệp, phỏng vấn và freelance', chapters: '20', practice: '160', words: '64,614',
    icon: '<svg viewBox="0 0 100 100" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="14" y="34" width="72" height="48" rx="6"/><path d="M36 34v-8a6 6 0 0 1 6-6h16a6 6 0 0 1 6 6v8"/><path d="M14 54h72"/></g></svg>',
  },
  {
    vol: '38', file: '38-khoi-nghiep-va-van-hanh-doanh-nghiep.html', color: '#8A5A14',
    title: 'Khởi nghiệp và vận hành doanh nghiệp', chapters: '16', practice: '128', words: '53,929',
    icon: '<svg viewBox="0 0 100 100" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M50 14c14 10 18 30 14 48l-14 10-14-10c-4-18 0-38 14-48z"/><circle cx="50" cy="40" r="6"/><path d="M36 62l-10 18M64 62l10 18"/></g></svg>',
  },
  {
    vol: '39', file: '39-ai-du-lieu-va-nang-luc-so.html', color: '#3B3E8C',
    title: 'AI, dữ liệu và năng lực số', chapters: '10', practice: '80', words: '26,326',
    icon: '<svg viewBox="0 0 100 100" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="30" y="30" width="40" height="40" rx="4"/><path d="M50 12v18M50 70v18M12 50h18M70 50h18M22 22l13 13M65 65l13 13M78 22l-13 13M35 65l-13 13"/></g></svg>',
  },
  {
    vol: '40', file: '40-tai-chinh-ca-nhan-va-ky-nang-doi-song.html', color: '#0E6E6B',
    title: 'Tài chính cá nhân và kỹ năng đời sống', chapters: '12', practice: '96', words: '38,530',
    icon: '<svg viewBox="0 0 100 100" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="14" y="28" width="72" height="50" rx="8"/><path d="M14 44h72"/><circle cx="68" cy="60" r="6"/></g></svg>',
  },
  {
    vol: '41', file: '41-he-thong-thuc-hanh-tong-hop.html', color: '#3D5567',
    title: 'Hệ thống thực hành tổng hợp', chapters: '7', practice: '56', words: '23,038',
    icon: '<svg viewBox="0 0 100 100" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="50" cy="50" r="34"/><circle cx="50" cy="50" r="20"/><circle cx="50" cy="50" r="6" fill="currentColor"/></g></svg>',
  },
];

export const SKILL_BOOKS_UPCOMING: PlannedBook[] = [];

export const BOOK_GROUPS: BookGroup[] = [
  {
    "title": "Foundations",
    "desc": "The ground everything else stands on.",
    "books": [
      {
        "vol": "24",
        "file": "24-the-terminal-from-zero-to-fluent.html",
        "color": "#256B4F",
        "title": "The Terminal from Zero to Fluent",
        "chapters": "24",
        "practice": "179",
        "words": "77,095",
        "icon": "<svg viewBox=\"0 0 100 100\" aria-hidden=\"true\"><g fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"8\" y=\"16\" width=\"84\" height=\"68\" rx=\"8\"/><path d=\"M8 32h84\"/> <path d=\"M24 48l10 8-10 8\"/></g> <g fill=\"currentColor\" stroke=\"none\"><circle cx=\"20\" cy=\"24\" r=\"3\"/><circle cx=\"30\" cy=\"24\" r=\"3\"/><circle cx=\"40\" cy=\"24\" r=\"3\"/> <rect x=\"42\" y=\"48\" width=\"14\" height=\"16\" rx=\"2\"/></g></svg>"
      },
      {
        "vol": "17",
        "file": "17-linux-and-bash-from-zero-to-production.html",
        "color": "#8A5A14",
        "title": "Linux and Bash from Zero to Production",
        "chapters": "16",
        "practice": "175",
        "words": "34,408",
        "icon": "<svg viewBox=\"0 0 100 100\" aria-hidden=\"true\"><g fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"10\" y=\"20\" width=\"80\" height=\"60\" rx=\"8\"/><path d=\"M26 42l12 10-12 10\"/> <path d=\"M48 62h20\"/></g></svg>"
      },
      {
        "vol": "25",
        "file": "25-networking-from-zero-to-production.html",
        "color": "#1F5D7A",
        "title": "Networking from Zero to Production",
        "chapters": "24",
        "practice": "182",
        "words": "129,015",
        "icon": "<svg viewBox=\"0 0 100 100\" aria-hidden=\"true\"><g fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M28 30h44\"/><path d=\"M22 38v24\"/><path d=\"M78 38v24\"/> <path d=\"M28 70h44\"/><path d=\"M30 36l40 28\"/><path d=\"M70 36L30 64\"/></g> <g fill=\"currentColor\" stroke=\"none\"><circle cx=\"22\" cy=\"30\" r=\"7\"/><circle cx=\"78\" cy=\"30\" r=\"7\"/> <circle cx=\"22\" cy=\"70\" r=\"7\"/><circle cx=\"78\" cy=\"70\" r=\"7\"/> <circle cx=\"50\" cy=\"50\" r=\"5\"/></g></svg>"
      },
      {
        "vol": "09",
        "file": "09-git-from-zero-to-confident.html",
        "color": "#8E3B2A",
        "title": "Git from Zero to Confident",
        "chapters": "17",
        "practice": "160",
        "words": "20,889",
        "icon": "<svg viewBox=\"0 0 100 100\" aria-hidden=\"true\"><g fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M28 90V22\"/><path d=\"M28 46h24a20 20 0 0 1 20 20v6\"/> <path d=\"M72 40v-8\"/></g> <g fill=\"currentColor\" stroke=\"none\"><circle cx=\"28\" cy=\"16\" r=\"7\"/><circle cx=\"28\" cy=\"52\" r=\"7\"/> <circle cx=\"72\" cy=\"26\" r=\"7\"/><circle cx=\"72\" cy=\"78\" r=\"7\"/></g></svg>"
      }
    ]
  },
  {
    "title": "Languages",
    "desc": "The three languages the rest of the series is written in.",
    "books": [
      {
        "vol": "03",
        "file": "03-javascript-from-zero-to-production.html",
        "color": "#8A5A14",
        "title": "JavaScript from Zero to Production",
        "chapters": "17",
        "practice": "160",
        "words": "17,605",
        "icon": "<svg viewBox=\"0 0 100 100\" aria-hidden=\"true\"><g fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M40 14c-12 0-12 12-12 22s-8 14-14 14c6 0 14 4 14 14s0 22 12 22\"/> <path d=\"M60 14c12 0 12 12 12 22s8 14 14 14c-6 0-14 4-14 14s0 22-12 22\"/></g> <circle cx=\"50\" cy=\"50\" r=\"4\" fill=\"currentColor\" stroke=\"none\"/></svg>"
      },
      {
        "vol": "04",
        "file": "04-typescript-from-zero-to-type-safe.html",
        "color": "#3B3E8C",
        "title": "TypeScript from Zero to Type-Safe",
        "chapters": "20",
        "practice": "160",
        "words": "29,747",
        "icon": "<svg viewBox=\"0 0 100 100\" aria-hidden=\"true\"><g fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"12\" y=\"12\" width=\"76\" height=\"76\" rx=\"10\"/> <path d=\"M30 38h40\"/><path d=\"M50 38v34\"/><path d=\"M74 60l8 8-8 8\"/></g></svg>"
      },
      {
        "vol": "02",
        "file": "02-java-from-zero-to-lab211.html",
        "color": "#256B4F",
        "title": "Java from Zero to LAB211",
        "chapters": "22",
        "practice": "91",
        "words": "26,124",
        "icon": "<svg viewBox=\"0 0 100 100\" aria-hidden=\"true\"><g fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M22 44h46v24a14 14 0 0 1-14 14H36a14 14 0 0 1-14-14z\"/> <path d=\"M68 50h6a10 10 0 0 1 0 20h-6\"/><path d=\"M28 90h44\"/> <path d=\"M38 32c0-6 6-6 6-12s-6-6-6-12\"/><path d=\"M52 32c0-6 6-6 6-12s-6-6-6-12\"/></g></svg>"
      }
    ]
  },
  {
    "title": "The front end",
    "desc": "What the user actually touches.",
    "books": [
      {
        "vol": "01",
        "file": "01-react-from-zero-to-production.html",
        "color": "#2B4C86",
        "title": "React from Zero to Production",
        "chapters": "25",
        "practice": "160",
        "words": "55,186",
        "icon": "<svg viewBox=\"0 0 100 100\" aria-hidden=\"true\"><g fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><ellipse cx=\"50\" cy=\"50\" rx=\"44\" ry=\"17\"/> <ellipse cx=\"50\" cy=\"50\" rx=\"44\" ry=\"17\" transform=\"rotate(60 50 50)\"/> <ellipse cx=\"50\" cy=\"50\" rx=\"44\" ry=\"17\" transform=\"rotate(120 50 50)\"/></g> <circle cx=\"50\" cy=\"50\" r=\"7\" fill=\"currentColor\" stroke=\"none\"/></svg>"
      },
      {
        "vol": "05",
        "file": "05-nextjs-from-zero-to-production.html",
        "color": "#3D5567",
        "title": "Next.js from Zero to Production",
        "chapters": "20",
        "practice": "160",
        "words": "26,506",
        "icon": "<svg viewBox=\"0 0 100 100\" aria-hidden=\"true\"><g fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"50\" cy=\"50\" r=\"38\"/><path d=\"M36 68V32l30 40\"/><path d=\"M66 32v22\"/></g></svg>"
      },
      {
        "vol": "10",
        "file": "10-tailwind-css-from-zero-to-production.html",
        "color": "#0E6E6B",
        "title": "Tailwind CSS from Zero to Production",
        "chapters": "16",
        "practice": "160",
        "words": "16,385",
        "icon": "<svg viewBox=\"0 0 100 100\" aria-hidden=\"true\"><g fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 38c10-14 20-14 30 0s20 14 30 0c8-11 8-11 16-6\"/> <path d=\"M12 62c10-14 20-14 30 0s20 14 30 0c8-11 8-11 16-6\"/></g></svg>"
      }
    ]
  },
  {
    "title": "The back end",
    "desc": "Serving requests, and knowing who is asking.",
    "books": [
      {
        "vol": "07",
        "file": "07-nodejs-and-express-from-zero-to-production.html",
        "color": "#256B4F",
        "title": "Node.js and Express from Zero to Production",
        "chapters": "19",
        "practice": "160",
        "words": "27,297",
        "icon": "<svg viewBox=\"0 0 100 100\" aria-hidden=\"true\"><g fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M50 10l34 20v40L50 90 16 70V30z\"/><path d=\"M6 50h24\"/> <path d=\"M70 50h24\"/><path d=\"M84 42l10 8-10 8\"/></g></svg>"
      },
      {
        "vol": "13",
        "file": "13-socketio-from-zero-to-production.html",
        "color": "#3B3E8C",
        "title": "Socket.IO from Zero to Production",
        "chapters": "12",
        "practice": "120",
        "words": "21,383",
        "icon": "<svg viewBox=\"0 0 100 100\" aria-hidden=\"true\"><g fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M28 38c14-12 30-12 44 0\"/><path d=\"M28 62c14 12 30 12 44 0\"/> <path d=\"M64 32l8 6-8 6\"/><path d=\"M36 56l-8 6 8 6\"/></g> <g fill=\"currentColor\" stroke=\"none\"><circle cx=\"16\" cy=\"50\" r=\"8\"/><circle cx=\"84\" cy=\"50\" r=\"8\"/></g></svg>"
      },
      {
        "vol": "14",
        "file": "14-authentication-from-zero-to-production.html",
        "color": "#8A5A14",
        "title": "Authentication from Zero to Production",
        "chapters": "12",
        "practice": "120",
        "words": "24,992",
        "icon": "<svg viewBox=\"0 0 100 100\" aria-hidden=\"true\"><g fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M50 8l32 12v28c0 22-14 34-32 42C32 82 18 70 18 48V20z\"/> <circle cx=\"50\" cy=\"44\" r=\"8\"/><path d=\"M50 52v14\"/></g></svg>"
      }
    ]
  },
  {
    "title": "Data",
    "desc": "Where the state lives, and how it is reached.",
    "books": [
      {
        "vol": "06",
        "file": "06-postgresql-from-zero-to-production.html",
        "color": "#0E6E6B",
        "title": "PostgreSQL from Zero to Production",
        "chapters": "25",
        "practice": "210",
        "words": "36,792",
        "icon": "<svg viewBox=\"0 0 100 100\" aria-hidden=\"true\"><g fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><ellipse cx=\"50\" cy=\"24\" rx=\"32\" ry=\"11\"/> <path d=\"M18 24v22c0 6 14 11 32 11s32-5 32-11V24\"/> <path d=\"M18 46v22c0 6 14 11 32 11s32-5 32-11V46\"/> <path d=\"M18 68v10c0 6 14 11 32 11s32-5 32-11V68\"/></g></svg>"
      },
      {
        "vol": "11",
        "file": "11-prisma-from-zero-to-production.html",
        "color": "#6B3A6E",
        "title": "Prisma from Zero to Production",
        "chapters": "16",
        "practice": "160",
        "words": "21,104",
        "icon": "<svg viewBox=\"0 0 100 100\" aria-hidden=\"true\"><g fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M46 18L20 74h52z\"/><path d=\"M4 50h16\"/> <path d=\"M74 44h22\"/><path d=\"M74 56h22\"/><path d=\"M72 68h24\"/></g></svg>"
      },
      {
        "vol": "12",
        "file": "12-redis-from-zero-to-production.html",
        "color": "#8E3B2A",
        "title": "Redis from Zero to Production",
        "chapters": "16",
        "practice": "160",
        "words": "23,241",
        "icon": "<svg viewBox=\"0 0 100 100\" aria-hidden=\"true\"><g fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><ellipse cx=\"50\" cy=\"26\" rx=\"34\" ry=\"12\"/> <path d=\"M16 26v20c0 7 15 12 34 12s34-5 34-12V26\"/> <path d=\"M16 50v20c0 7 15 12 34 12s34-5 34-12V50\"/></g> <path d=\"M54 34l-12 18h9l-4 14 13-19h-9z\" fill=\"currentColor\" stroke=\"none\"/></svg>"
      },
      {
        "vol": "19",
        "file": "19-object-storage-from-zero-to-production.html",
        "color": "#6B3A6E",
        "title": "Object Storage from Zero to Production",
        "chapters": "12",
        "practice": "120",
        "words": "27,752",
        "icon": "<svg viewBox=\"0 0 100 100\" aria-hidden=\"true\"><g fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 30h32l-4 46a6 6 0 0 1-6 6H22a6 6 0 0 1-6-6z\"/> <path d=\"M56 30h32l-4 46a6 6 0 0 1-6 6H66a6 6 0 0 1-6-6z\"/> <path d=\"M18 20c0-6 8-8 10-8s10 2 10 8\"/><path d=\"M62 20c0-6 8-8 10-8s10 2 10 8\"/></g></svg>"
      }
    ]
  },
  {
    "title": "Infrastructure",
    "desc": "Getting it onto a machine that strangers can reach.",
    "books": [
      {
        "vol": "08",
        "file": "08-docker-from-zero-to-production.html",
        "color": "#2B4C86",
        "title": "Docker from Zero to Production",
        "chapters": "18",
        "practice": "160",
        "words": "22,437",
        "icon": "<svg viewBox=\"0 0 100 100\" aria-hidden=\"true\"><g fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"26\" y=\"42\" width=\"16\" height=\"16\"/><rect x=\"46\" y=\"42\" width=\"16\" height=\"16\"/> <rect x=\"66\" y=\"42\" width=\"16\" height=\"16\"/><rect x=\"46\" y=\"24\" width=\"16\" height=\"16\"/> <path d=\"M10 70c8 0 8 6 16 6s8-6 16-6 8 6 16 6 8-6 16-6 8 6 16 6\"/> <path d=\"M10 84c8 0 8 6 16 6s8-6 16-6 8 6 16 6 8-6 16-6 8 6 16 6\"/></g></svg>"
      },
      {
        "vol": "15",
        "file": "15-nginx-from-zero-to-production.html",
        "color": "#256B4F",
        "title": "Nginx from Zero to Production",
        "chapters": "14",
        "practice": "140",
        "words": "26,565",
        "icon": "<svg viewBox=\"0 0 100 100\" aria-hidden=\"true\"><g fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M8 22h22c10 0 10 28 20 28\"/><path d=\"M8 50h42\"/> <path d=\"M8 78h22c10 0 10-28 20-28\"/><path d=\"M50 50h42\"/> <path d=\"M84 42l8 8-8 8\"/></g> <g fill=\"currentColor\" stroke=\"none\"><circle cx=\"50\" cy=\"50\" r=\"7\"/></g></svg>"
      },
      {
        "vol": "16",
        "file": "16-deploying-to-a-vps-from-zero-to-production.html",
        "color": "#3D5567",
        "title": "Deploying to a VPS from Zero to Production",
        "chapters": "12",
        "practice": "120",
        "words": "21,973",
        "icon": "<svg viewBox=\"0 0 100 100\" aria-hidden=\"true\"><g fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"14\" y=\"16\" width=\"72\" height=\"20\" rx=\"4\"/> <rect x=\"14\" y=\"42\" width=\"72\" height=\"20\" rx=\"4\"/><rect x=\"14\" y=\"68\" width=\"72\" height=\"20\" rx=\"4\"/> <path d=\"M62 26h12\"/><path d=\"M62 52h12\"/><path d=\"M62 78h12\"/></g> <g fill=\"currentColor\" stroke=\"none\"><circle cx=\"28\" cy=\"26\" r=\"4\"/><circle cx=\"28\" cy=\"52\" r=\"4\"/><circle cx=\"28\" cy=\"78\" r=\"4\"/></g></svg>"
      },
      {
        "vol": "18",
        "file": "18-github-actions-from-zero-to-production.html",
        "color": "#0E6E6B",
        "title": "GitHub Actions from Zero to Production",
        "chapters": "13",
        "practice": "130",
        "words": "33,139",
        "icon": "<svg viewBox=\"0 0 100 100\" aria-hidden=\"true\"><g fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"50\" cy=\"50\" r=\"16\"/> <path d=\"M50 22V10M50 90V78M22 50H10M90 50H78M30 30l-9-9M79 79l-9-9M70 30l9-9M21 79l9-9\"/></g> <circle cx=\"50\" cy=\"50\" r=\"5\" fill=\"currentColor\" stroke=\"none\"/></svg>"
      },
      {
        "vol": "20",
        "file": "20-domains-dns-and-tls-from-zero-to-production.html",
        "color": "#2B4C86",
        "title": "Domains, DNS and TLS from Zero to Production",
        "chapters": "10",
        "practice": "100",
        "words": "23,834",
        "icon": "<svg viewBox=\"0 0 100 100\" aria-hidden=\"true\"><g fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M50 14v16\"/><path d=\"M22 46v-8h56v8\"/><path d=\"M22 46v10\"/><path d=\"M50 30v26\"/> <path d=\"M78 46v10\"/><rect x=\"38\" y=\"70\" width=\"24\" height=\"18\" rx=\"3\"/> <path d=\"M43 70v-5a7 7 0 0 1 14 0v5\"/></g> <g fill=\"currentColor\" stroke=\"none\"><circle cx=\"50\" cy=\"10\" r=\"5\"/><circle cx=\"22\" cy=\"60\" r=\"5\"/><circle cx=\"78\" cy=\"60\" r=\"5\"/></g></svg>"
      }
    ]
  },
  {
    "title": "Running a product",
    "desc": "The parts that only matter once people rely on it.",
    "books": [
      {
        "vol": "21",
        "file": "21-media-processing-from-zero-to-production.html",
        "color": "#8E3B2A",
        "title": "Media Processing from Zero to Production",
        "chapters": "12",
        "practice": "120",
        "words": "26,459",
        "icon": "<svg viewBox=\"0 0 100 100\" aria-hidden=\"true\"><g fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"10\" y=\"18\" width=\"80\" height=\"40\" rx=\"5\"/> <path d=\"M10 30h80M10 46h80M26 18v40M50 18v40M74 18v40\"/> <path d=\"M12 76v8M24 70v20M36 78v4M48 66v28M60 74v12M72 70v20M84 78v4\"/></g></svg>"
      },
      {
        "vol": "22",
        "file": "22-observability-and-monitoring-from-zero-to-production.html",
        "color": "#3D5567",
        "title": "Observability and Monitoring from Zero to Production",
        "chapters": "10",
        "practice": "100",
        "words": "20,352",
        "icon": "<svg viewBox=\"0 0 100 100\" aria-hidden=\"true\"><g fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 84V16\"/><path d=\"M12 84h78\"/> <path d=\"M20 70l14-10 12 8 10-26 12 30 14-20\"/></g> <circle cx=\"68\" cy=\"52\" r=\"6\" fill=\"currentColor\" stroke=\"none\"/></svg>"
      },
      {
        "vol": "23",
        "file": "23-payment-integration-from-zero-to-production.html",
        "color": "#3B3E8C",
        "title": "Payment Integration from Zero to Production",
        "chapters": "10",
        "practice": "100",
        "words": "19,500",
        "icon": "<svg viewBox=\"0 0 100 100\" aria-hidden=\"true\"><g fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"8\" y=\"24\" width=\"84\" height=\"54\" rx=\"8\"/><path d=\"M8 42h84\"/> <rect x=\"20\" y=\"54\" width=\"16\" height=\"12\" rx=\"3\"/><path d=\"M58 62h22\"/></g></svg>"
      }
    ]
  }
];
