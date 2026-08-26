// Dữ liệu bộ sách CuongThai Book Series (25 tập) — trích từ index.html gốc.
// Mỗi tập mở ở /books/<file> (HTML tự chứa). Cập nhật: tái sinh từ nguồn.
export type Book = { vol: string; file: string; color: string; title: string; chapters: string; practice: string; words: string; icon: string };
export type BookGroup = { title: string; desc: string; books: Book[] };

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
  "volumes": "25",
  "chapters": "412",
  "practice": "3,607",
  "listings": "2,479",
  "tables": "745",
  "words": "809,780"
} as const;

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
