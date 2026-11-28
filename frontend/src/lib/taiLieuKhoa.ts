/**
 * Khu "📁 Tài liệu" của khoá học (28/11/2026) — bộ phân tích ghi chú tài liệu.
 *
 * Mỗi tệp khoá (content/courses/*.mjs, content/academy/*.mjs) có `documentsNote` là MỘT chuỗi liền, kiểu:
 *   "Tài liệu tham chiếu chính: postgresql.org/docs (tài liệu chính thức…) • use-the-index-luke.com (…). Phần thực hành
 *    đi kèm: track "PostgreSQL" trên Code Lab. Loạt bài "100 Ngày Database" trên trang chủ /feed bổ trợ…"
 * Trước đây trang học in nguyên khối chữ đó: xấu, và không link nào bấm được. Ở đây tách nó thành NHÓM (theo câu dẫn
 * "Tài liệu tham chiếu chính", "Phần thực hành đi kèm", "Giáo trình", "Công cụ"…) → MỤC (tên · link · mô tả · loại).
 *
 * Quét thật 134 ghi chú ngày 28/11/2026: các mục cách nhau bằng " • ", " · " hoặc "; "; mô tả nằm trong ngoặc; link
 * là tên miền trần (không có https://) đứng đầu mục hoặc trong ngoặc; nhóm "Công cụ" liệt kê bằng dấu phẩy. Test:
 * `npx tsx --test frontend/src/lib/taiLieuKhoa.test.ts` (chạy trên mẫu thật + quét mọi tệp khoá).
 *
 * Hàm thuần, không phụ thuộc React — app/desktop dùng lại được.
 */

export type LoaiTaiLieu =
  | 'chinh-thuc' // tài liệu chính thức (docs của dự án/hãng)
  | 'thuc-hanh' // bài tập / lab / Code Lab / sân luyện
  | 'video'
  | 'sach' // sách, giáo trình, bài báo
  | 'chuan' // RFC, ISO, NIST, đặc tả
  | 'khoa-hoc' // MOOC, khoá ngoài, môn Academy
  | 'cong-cu' // phần mềm, công cụ
  | 'tai-ve' // tệp đi kèm khoá (syllabus gốc, slide…) — nằm ở mục Tệp tải về
  | 'tham-khao';

export interface LienKetPhu { ten: string; url: string; noiBo: boolean }

export interface MucTaiLieu {
  ten: string;
  /** URL tuyệt đối (https://…) hoặc tuyến nội bộ (/code-lab/…). Không có = mục chỉ là tên (sách giấy…). */
  url?: string;
  noiBo: boolean;
  /** Tên miền hiển thị (postgresql.org) — chỉ link ngoài. */
  tenMien?: string;
  moTa?: string;
  loai: LoaiTaiLieu;
  /** Link phụ khi một mục nhắc nhiều trang (vd ba trang luật). */
  phu?: LienKetPhu[];
  /** Mục nhắc tệp đi kèm (syllabus gốc…) ⇒ giao diện trỏ xuống "Tệp tải về". */
  laTepDiKem?: boolean;
}

export interface NhomTaiLieu { tieuDe: string; loai: LoaiTaiLieu; muc: MucTaiLieu[] }

export interface KetQuaTaiLieu {
  nhom: NhomTaiLieu[];
  /** Câu ghi chú không phải tài liệu (vd "Model, giá và giới hạn đổi nhanh…"). */
  ghiChu: string[];
}

/** Trường có cấu trúc tuỳ chọn trong tệp khoá: `documents: [{ title, url, mo_ta, loai }]` (ưu tiên hơn ghi chú). */
export interface TaiLieuCoCauTruc { title: string; url?: string; mo_ta?: string; loai?: LoaiTaiLieu | string; nhom?: string }

// ───────────────────────── tiện ích ─────────────────────────

const TLD = 'com|org|net|io|dev|sh|vn|edu|gov|info|me|ai|co|app|us|uk|eu|page|site|cloud|tech|ly|so|to|day|re|one|xyz|gg|tv|ca|de|fr|nl|ch|jp|au|cc|ws|guru|google|works|tools|school|blog|wiki|online|space|link|fun';
/** Tên miền trần hoặc có https:// — chữ thường (để "Node.js", "ASP.NET" không bị nhận nhầm). */
const RE_MIEN = new RegExp(
  String.raw`(?:https?:\/\/)?(?:www\.)?(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:${TLD})(?![a-z0-9-])(?:\/[^\s,;()"“”'’]*)?`,
  'g',
);
const RE_MIEN_1 = new RegExp(RE_MIEN.source);
/** Chuỗi có chứa tên miền không (không dính lastIndex của regex /g). */
const coMien = (s: string) => RE_MIEN_1.test(s);
/** Tuyến nội bộ được nhắc trần trong ghi chú: "/feed", "/os-lab", "(/language/ja)". */
const RE_TUYEN = /(?:^|[\s(])(\/[a-z][a-z0-9-]*(?:\/[a-z0-9-]+)*)(?=$|[\s),.;])/g;

/** Track Code Lab: tên hiển thị trong ghi chú → slug thật (/code-lab/<slug>). Quét từ link thật trong content/. */
const TRACK_CODE_LAB: Record<string, string> = {
  'postgresql': 'postgresql', 'node.js (express)': 'nodejs-express', 'node.js': 'nodejs-express', 'docker': 'docker',
  'redis': 'redis', 'lab211': 'lab211', 'linux & bash': 'linux-bash', 'rest apis': 'rest-apis', 'rest api': 'rest-apis',
  'react': 'react', 'authentication': 'authentication', 'git': 'git', 'next.js': 'nextjs', 'c': 'c',
  'spring boot': 'spring-boot', 'prisma orm': 'prisma-orm', 'java core': 'java-core', 'java-core': 'java-core',
  'data structures & algorithms': 'data-structures-algorithms', 'python': 'python', 'sql': 'sql',
  'socket.io': 'socket-io', 'javascript': 'javascript', 'react native': 'react-native', 'typescript': 'typescript',
  'deploy vps': 'deploy-vps', 'nginx': 'nginx', 'github actions': 'github-actions', 'mongodb': 'mongodb', 'expo': 'expo',
  'flutter': 'flutter', 'dart': 'dart', 'sqlite': 'sqlite', 'system design': 'system-design', 'object storage': 'object-storage-s3',
};

/** Tuyến nội bộ quen thuộc được nhắc bằng TÊN (không có dấu /). */
const TEN_NOI_BO: Array<[RegExp, string, string]> = [
  [/\bExp Hub\b/i, '/exp-hub', 'Exp Hub'],
  [/\bPhòng thi\b|\bExam Room\b/i, '/exam', 'Phòng thi'],
  [/\bAlgorithm Visualizer\b/i, '/algorithms', 'Algorithm Visualizer'],
];

const TEN_TUYEN: Record<string, string> = {
  '/os-lab': 'OS Lab — phòng lab hệ điều hành trực quan', '/cpu-lab': 'CPU Lab', '/net-lab': 'Net Lab', '/algorithms': 'Algorithm Visualizer',
  '/feed': 'Feed CuongThai', '/exam': 'Phòng thi', '/exp-hub': 'Exp Hub', '/code-lab': 'Code Lab',
};
const tenMienCua = (url: string) => url.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
const chuanUrl = (raw: string) => {
  const s = raw.replace(/[.,:;!?…]+$/, '');
  return /^https?:\/\//.test(s) ? s : `https://${s}`;
};
const goc = (s: string) => s.replace(/\s+/g, ' ').trim();
const boDauCau = (s: string) => goc(s)
  .replace(/^[\s,;:/+&–—-]+|[\s,;:–—(-]+$/g, '')
  .replace(/^(?:và|and|hoặc|or)\s+/i, '')
  .replace(/\s+(?:tại|ở|trên|at|on|qua|tra trên|tra|xem)$/i, '')
  .trim();
const boChamCuoi = (s: string) => s.replace(/\.\s*$/, '').trim();

/** Tách chuỗi theo ký tự phân cách, CHỈ ở tầng ngoài (không cắt trong ngoặc / ngoặc kép). */
export function tachNgoai(s: string, laPhanCach: (s: string, i: number) => number): string[] {
  const kq: string[] = [];
  let sau = 0; let nhay = false; let tu = 0;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch === '(' || ch === '[') sau++;
    else if ((ch === ')' || ch === ']') && sau > 0) sau--;
    else if (ch === '"' || ch === '“' || ch === '”') nhay = ch === '“' ? true : ch === '”' ? false : !nhay;
    if (sau === 0 && !nhay) {
      const dai = laPhanCach(s, i);
      if (dai > 0) { kq.push(s.slice(tu, i)); tu = i + dai; i += dai - 1; }
    }
  }
  kq.push(s.slice(tu));
  return kq.map(goc).filter(Boolean);
}

/** " • ", " · ", "; " (và " ⏎ ") là ranh giới mục. */
const phanCachMuc = (s: string, i: number) => {
  const ch = s[i];
  if ((ch === '•' || ch === '·') && /\s/.test(s[i - 1] ?? ' ') && /\s/.test(s[i + 1] ?? ' ')) return 1;
  if (ch === ';' && /\s/.test(s[i + 1] ?? ' ')) return 1;
  if (ch === '\n') return 1;
  return 0;
};

/** Chữ viết tắt hay đứng trước dấu chấm mà KHÔNG phải hết câu: "Ph.", "V.I.", "ed.", "vs.", "Inc."… */
const VIET_TAT = /^(?:[A-ZĐ](?:\.[A-ZĐ])*|ph|ed|eds|inc|st|dr|mr|ms|vs|no|vol|al|etc|tr|tp|ths|ts|pgs|gs|ver|v\.v|e\.g|i\.e|nd|rd|th)$/i;
/** ". " + chữ hoa ở tầng ngoài và không sau chữ viết tắt ⇒ hết câu. */
const phanCachCau = (s: string, i: number) => {
  if (s[i] !== '.' || !/\s/.test(s[i + 1] ?? '')) return 0;
  const sau = s.slice(i + 1).trimStart();
  if (!/^[A-ZÀ-ỸĐ"“]/.test(sau)) return 0;
  const truoc = s.slice(0, i).split(/\s/).pop() ?? '';
  if (VIET_TAT.test(truoc)) return 0;
  return 1;
};

/** Câu dẫn mở một NHÓM tài liệu. Chỉ những câu dẫn quen (quét thật) mới tách nhóm — tránh "Ph. Ăngghen: …". */
const RE_DAN_DAU = /^(?:Tài liệu|Tài nguyên|Giáo trình|Tham khảo|Tham chiếu|Công cụ|Luyện|Phần thực hành|Thực hành|Học liệu|Nguồn|Bổ trợ|Chuỗi MOOC|Bộ MOOC|Sách|Đọc thêm|Phòng lab|Môn học|Video|Templates?|Kèm)(?=[\s:(])/i;

/**
 * Câu dẫn ở đầu câu: từ khoá quen + phần chữ tới dấu ":" đầu tiên ở TẦNG NGOÀI (không tính ":" trong ngoặc / ngoặc
 * kép — "Chuỗi MOOC bắt buộc (Coursera — UC Irvine, "Academic English: Writing" Specialization): …"). Gặp " • ",
 * "; " trước dấu ":" ⇒ không phải câu dẫn. Trả { nhan, dai } hoặc null.
 */
export function timCauDan(cau: string): { nhan: string; dai: number } | null {
  if (!RE_DAN_DAU.test(cau)) return null;
  let sau = 0; let nhay = false;
  for (let i = 0; i < Math.min(cau.length, 200); i++) {
    const ch = cau[i];
    if (ch === '(') sau++;
    else if (ch === ')' && sau > 0) sau--;
    else if (ch === '"') nhay = !nhay;
    else if (ch === '“') nhay = true;
    else if (ch === '”') nhay = false;
    else if (sau === 0 && !nhay) {
      if (ch === '•' || ch === '·' || ch === ';') return null;
      if (ch === ':' && /\s/.test(cau[i + 1] ?? '')) {
        const nhan = cau.slice(0, i).trim();
        if (nhan.split(/\s+/).length > 16) return null;
        let j = i + 1; while (j < cau.length && /\s/.test(cau[j])) j++;
        return { nhan, dai: j };
      }
    }
  }
  return null;
}

function loaiNhom(nhan: string): LoaiTaiLieu {
  const n = nhan.toLowerCase();
  if (/thực hành|luyện|phòng lab|\blab\b/.test(n)) return 'thuc-hanh';
  if (/công cụ/.test(n)) return 'cong-cu';
  if (/giáo trình|sách|bổ trợ/.test(n)) return 'sach';
  if (/mooc|khoá|khóa/.test(n)) return 'khoa-hoc';
  if (/video/.test(n)) return 'video';
  if (/template/.test(n)) return 'tai-ve';
  if (/chính|tham chiếu|học liệu|tài nguyên|nguồn/.test(n)) return 'chinh-thuc';
  return 'tham-khao';
}

function loaiMuc(m: { ten: string; moTa?: string; url?: string; noiBo: boolean }, macDinh: LoaiTaiLieu): LoaiTaiLieu {
  const t = `${m.ten} ${m.moTa ?? ''}`;
  const u = m.url ?? '';
  if (/youtube\.com|youtu\.be|3blue1brown|\bvideo\b|bài nói|\btalk\b/i.test(t + u)) return 'video';
  if (m.noiBo && /code-lab|\/exam|lab\b|os-lab|cpu-lab|net-lab|algorithms/.test(u)) return 'thuc-hanh';
  if (/\bRFC\s?\d|\bISO\/IEC|\bISO \d|\bIEEE\b|\bNIST\b|\bFIPS\b|\bEIP|Nghị định|^Luật |Regulation/i.test(m.ten)
    || /đặc tả|\bspec\b|whitepaper|yellow paper|Quy định \(EU\)/i.test(t)) return 'chuan';
  if (/leetcode|neetcode|exercises|pgexercises|crackmes|picoctf|ethernaut|damn vulnerable|playground|\/play\b|sandbox|bài tập|track\b/i.test(t + u)) return 'thuc-hanh';
  if (/O[’']Reilly|Wiley|Pearson|No Starch|Cambridge University Press|Packt|Cengage|Addison|Manning|Springer|Wrox|\bed\.|\bedition\b|giáo trình|\bsách\b|book\b|“[^”]+”|"[^"]+"|Toàn tập|\(\d{4}\)/i.test(t)) {
    if (!m.url || /book|cryptobook|deeplearningbook|statlearning|mml-book|hpbn|distributed-systems\.net|nlp\.stanford|wisc\.edu/i.test(u) || !/docs?\b|documentation/i.test(t + u)) return 'sach';
  }
  if (/coursera|\bedx\b|\bMOOC\b|udemy|startup school|skill builder|^Khoá|^Khóa|^khoá|^khóa|OpenCourseWare|MIT 6\.|CS229|University\b|Academy\b/.test(m.ten)
    || /coursera|\bedx\b|\bMOOC\b|udemy/i.test(t) || /courses?\.|learn\.mongodb|khanacademy|ocw\.mit/i.test(u)) return 'khoa-hoc';
  if (macDinh === 'cong-cu') return 'cong-cu';
  if (m.url && !m.noiBo && /docs?|documentation|reference|manual|guide|learn\.|developer|api|help|support|readthedocs|\.dev\b/i.test(u + t)) return 'chinh-thuc';
  return macDinh;
}

/** Mục nhắc track Code Lab ⇒ một hoặc nhiều link /code-lab/<slug>. Trả null nếu không phải. */
function mucCodeLab(text: string): MucTaiLieu[] | null {
  if (!/code lab/i.test(text)) return null;
  // "track "PostgreSQL" trên Code Lab", "track Code Lab Java Core + Spring Boot + SQL", "Code Lab track java-core",
  // "Luyện tập trực tiếp trên Code Lab: track React Native, Expo, React (…)"
  let ten = '';
  const q = /track\s+["“]([^"”]+)["”]/i.exec(text);
  if (q) ten = q[1];
  else {
    // Tên track có thể chứa dấu chấm ("Next.js") ⇒ chỉ dừng ở "(", ". " hoặc gạch ngang.
    const m = /(?:track\s+Code Lab|Code Lab\s+track|trên Code Lab[:\s]+track)\s+((?:[^().]|\.(?!\s|$))+?)(?=\s*(?:\(|\.\s|\.$|$|—|–|\s-\s))/i.exec(text);
    if (m) ten = m[1];
  }
  const ngoacCuoi = /\(([^)]+)\)\s*\.?$/.exec(text)?.[1];
  const moTaNgoac = ngoacCuoi && !ngoacCuoi.trim().startsWith('/') ? ngoacCuoi : undefined;
  const tracks = ten
    ? ten.split(/\s*(?:\+|,|\bvà\b|\band\b)\s*/i).map((x) => x.trim())
      .filter((x) => x && (/^[A-Z0-9"“]/.test(x) || TRACK_CODE_LAB[x.toLowerCase()] !== undefined || /^[a-z0-9]+(?:-[a-z0-9]+)+$/.test(x)))
    : [];
  if (!tracks.length) {
    // "Phần thực hành đi kèm Phòng thi (3 PT · 5 FE · 10 PE) và Code Lab." ⇒ Phòng thi + Code Lab, mỗi thứ một thẻ
    const kq: MucTaiLieu[] = [];
    for (const [re, url, tenNb] of TEN_NOI_BO) {
      const mm = re.exec(text);
      if (!mm) continue;
      const sau = text.slice((mm.index ?? 0) + mm[0].length);
      const ng = /^\s*\(([^)]+)\)/.exec(sau)?.[1];
      kq.push({ ten: tenNb, url, noiBo: true, moTa: ng && !ng.startsWith('/') ? ng : undefined, loai: 'thuc-hanh' });
    }
    const conLai = kq.length ? '' : boDauCau(text.replace(/Code Lab/i, ''));
    kq.push({ ten: 'Code Lab', url: '/code-lab', noiBo: true, moTa: conLai || 'Bài tập chạy thật, có lời giải — luyện song song với bài giảng', loai: 'thuc-hanh' });
    return kq;
  }
  return tracks.map((t) => {
    const nb = TEN_NOI_BO.find(([re]) => re.test(t));
    if (nb) return { ten: nb[2], url: nb[1], noiBo: true, loai: 'thuc-hanh' as const };
    const k = t.toLowerCase().replace(/["“”]/g, '').trim();
    const slug = TRACK_CODE_LAB[k] ?? (/^[a-z0-9-]+$/.test(k) ? k : undefined);
    return {
      ten: `Code Lab · ${t.replace(/["“”]/g, '')}`,
      url: slug ? `/code-lab/${slug}` : '/code-lab',
      noiBo: true,
      moTa: tracks.length === 1 ? (moTaNgoac ?? 'Bài tập chạy thật, có lời giải — luyện song song với bài giảng') : undefined,
      loai: 'thuc-hanh' as const,
    };
  });
}

/** Phân tích MỘT mục ("postgresql.org/docs (tài liệu chính thức…)") ⇒ MucTaiLieu. */
export function phanTichMuc(raw: string, loaiMacDinh: LoaiTaiLieu): MucTaiLieu[] {
  const text = boChamCuoi(goc(raw));
  if (!text) return [];
  const cl = mucCodeLab(text);
  if (cl) return cl;

  // Tệp đi kèm: "Kèm file syllabus gốc CEA201.pdf"
  const tep = /^Kèm\s+(?:file\s+)?(.+\.(?:pdf|docx?|pptx?|xlsx?|zip))$/i.exec(text);
  if (tep) return [{ ten: tep[1].replace(/^file\s+/i, ''), noiBo: true, loai: 'tai-ve', laTepDiKem: true, moTa: 'Tệp đi kèm khoá — xem ở mục Tệp tải về' }];

  // Ngoặc cuối ⇒ mô tả. "(1)", "(5)" của trang man giữ nguyên trong tên.
  let than = text; let ngoac = ''; let duoi = '';
  const mNgoac = /\s*\(([^()]*(?:\([^()]*\)[^()]*)*)\)$/.exec(text);
  if (mNgoac && mNgoac.index > 0 && !/^\d{1,2}$/.test(mNgoac[1].trim())) { ngoac = mNgoac[1].trim(); than = text.slice(0, mNgoac.index).trim(); }
  else {
    // Ngoặc GIỮA câu có tên miền hoặc tuyến nội bộ: "Cuốn "ISL" (statlearning.com, bản PDF miễn phí) là tài liệu…",
    // "My Language (/language/ja) để luyện kana" ⇒ tên = phần trước ngoặc, mô tả = phần còn lại.
    const giua = /\s*\(([^()]+)\)\s*/.exec(text);
    if (giua && giua.index > 0 && !coMien(text.slice(0, giua.index).replace(/["“][^"”]*["”]/g, ''))
      && (coMien(giua[1]) || /^\s*\/[a-z]/.test(giua[1]))) {
      ngoac = giua[1].trim(); than = text.slice(0, giua.index).trim(); duoi = text.slice(giua.index + giua[0].length).trim();
    }
  }

  const mienThan = [...than.matchAll(RE_MIEN)];
  const mienNgoac = [...ngoac.matchAll(RE_MIEN)];
  const tuyen = [...` ${text}`.matchAll(RE_TUYEN)].map((x) => x[1]).filter((t) => !mienThan.some((m) => m[0].includes(t)) && !mienNgoac.some((m) => m[0].includes(t)));

  let ten = than; let url: string | undefined; let moTa = ngoac || undefined; let noiBo = false;
  const phu: LienKetPhu[] = [];
  const themPhu = (raw2: string) => { const u = chuanUrl(raw2); if (u !== url && !phu.some((p) => p.url === u)) phu.push({ ten: tenMienCua(u) + (u.split('/').length > 3 ? '/' + u.split('/').slice(3).join('/') : ''), url: u, noiBo: false }); };

  if (mienThan.length) {
    const dau = mienThan[0];
    url = chuanUrl(dau[0]);
    const truoc = than.slice(0, dau.index).trim();
    const sau = than.slice((dau.index ?? 0) + dau[0].length).trim();
    if (!truoc || /^(?:và|and)$/i.test(truoc)) {
      // "postgresql.org/docs (…)" hoặc "explainshell.com để mổ xẻ một lệnh lạ"
      ten = dau[0].replace(/^https?:\/\//, '').replace(/[.,]+$/, '');
      const conLai = boDauCau(sau.replace(RE_MIEN, '').replace(/\s*(?:,|và|and)\s*$/i, ''));
      if (conLai && !moTa) moTa = conLai;
      else if (conLai) moTa = `${conLai} — ${moTa}`;
    } else {
      // "Distributed Systems … bản miễn phí tại distributed-systems.net" ⇒ giữ tên là phần chữ
      ten = boDauCau(truoc.replace(/\s+(?:tại|ở|at|on|trên)$/i, ''));
      const conLai = boDauCau(sau.replace(RE_MIEN, ''));
      if (conLai) moTa = moTa ? `${conLai} — ${moTa}` : conLai;
    }
    mienThan.slice(1).forEach((m) => themPhu(m[0]));
    mienNgoac.forEach((m) => themPhu(m[0]));
    if (moTa && mienNgoac.length) moTa = boDauCau(moTa.replace(RE_MIEN, '').replace(/\s*,\s*,/g, ',')) || undefined;
  } else if (mienNgoac.length) {
    url = chuanUrl(mienNgoac[0][0]);
    mienNgoac.slice(1).forEach((m) => themPhu(m[0]));
    const mt = boDauCau(ngoac.replace(RE_MIEN, '').replace(/\s*(?:,\s*){2,}/g, ', ').replace(/^\s*(?:—|–|-|,)\s*/, ''));
    moTa = mt && !/^(?:bản miễn phí tại|miễn phí tại|tại)$/i.test(mt) ? mt.replace(/\s*(?:bản miễn phí tại|miễn phí tại|tại)\s*$/i, '') : (/miễn phí/i.test(ngoac) ? 'Bản miễn phí' : undefined);
  } else if (tuyen.length) {
    url = tuyen[0]; noiBo = true;
    const tenTuyen = boDauCau(than.replace(/\(\s*\/[a-z0-9/-]+\s*\)/i, '').replace(tuyen[0], '').replace(/\s+(?:trên trang chủ|trên|tại|ở)\s*$/i, ''));
    // "/os-lab" đứng một mình ⇒ đặt tên theo nhóm thay vì in lại đường dẫn
    ten = tenTuyen || TEN_TUYEN[tuyen[0]] || tuyen[0];
    if (ngoac && ngoac.startsWith('/')) moTa = undefined;
  } else {
    const nb = TEN_NOI_BO.find(([re]) => re.test(text));
    if (nb) { url = nb[1]; noiBo = true; }
    // "RFC 9110 (HTTP semantics)" ⇒ link thẳng bản RFC
    const rfc = /^RFC\s?(\d{3,5})\b/i.exec(than);
    if (!url && rfc) url = `https://www.rfc-editor.org/rfc/rfc${rfc[1]}`;
  }

  // "cuongthai.com/work" là trang NỘI BỘ — giữ nguyên câu làm tên ("Làm theo trực tiếp tại cuongthai.com/work").
  if (url && /^https:\/\/(?:www\.)?cuongthai\.com(\/|$)/.test(url)) {
    url = url.replace(/^https:\/\/(?:www\.)?cuongthai\.com/, '').replace(/\/$/, '') || undefined;
    noiBo = !!url; ten = than;
  }
  if (duoi) moTa = moTa && !moTa.startsWith('/') && !coMien(moTa) ? `${moTa} ${duoi}` : duoi;

  ten = boDauCau(ten) || (url ? tenMienCua(url) : text);
  if (moTa) moTa = boDauCau(moTa) || undefined;
  const muc: MucTaiLieu = {
    ten, url, noiBo, moTa,
    tenMien: url && !noiBo ? tenMienCua(url) : undefined,
    loai: 'tham-khao',
    ...(phu.length ? { phu } : {}),
  };
  muc.loai = loaiMuc(muc, loaiMacDinh);
  return [muc];
}

/** Ghép đoạn "Công cụ: VS Code, Postman, DBeaver/pgAdmin" — nhóm công cụ liệt kê bằng dấu phẩy. */
const phanCachPhay = (s: string, i: number) => (s[i] === ',' && /\s/.test(s[i + 1] ?? ' ') ? 1 : 0);

/** Một câu ghi chú (không phải danh sách tài liệu)? — câu dài, có động từ, không tên miền, không câu dẫn. */
function laCauGhiChu(s: string): boolean {
  if (coMien(s)) return false;
  if (/code lab|\/[a-z]|Exp Hub|Phòng thi|\.pdf\b/i.test(s)) return false;
  const tu = s.split(/\s+/).length;
  return tu >= 9 && /\b(là|đổi|ghi|giúp|dùng|học|nên|phải|đều|được|có|không|bổ trợ|đi kèm|trọng tâm|vừa|mỗi|is|are|covers)\b/i.test(s);
}

/** Phân tích nguyên chuỗi `documentsNote` ⇒ nhóm + mục. Chuỗi rỗng ⇒ { nhom: [], ghiChu: [] }. */
export function phanTichGhiChuTaiLieu(note: string | null | undefined): KetQuaTaiLieu {
  const s = goc(String(note ?? '').replace(/\r/g, '').replace(/\n+/g, ' ⏎ ').replace(/ ⏎ /g, '\n'));
  if (!s) return { nhom: [], ghiChu: [] };
  const nhom: NhomTaiLieu[] = [];
  const ghiChu: string[] = [];
  const ref: { g: NhomTaiLieu | null } = { g: null };

  const moNhom = (tieuDe: string) => {
    const t = tieuDe.replace(/\s*\(.*\)\s*$/, (m) => m).trim();
    const n: NhomTaiLieu = { tieuDe: t.charAt(0).toUpperCase() + t.slice(1), loai: loaiNhom(t), muc: [] };
    nhom.push(n); ref.g = n; return n;
  };

  for (const cauGoc of tachNgoai(s, phanCachCau)) {
    let cau = cauGoc.trim();
    const dan = timCauDan(cau);
    if (dan) {
      const g = moNhom(dan.nhan.replace(/^Kèm$/i, 'Tài liệu đi kèm'));
      if (/^Kèm$/i.test(dan.nhan)) g.loai = 'sach';
      cau = cau.slice(dan.dai);
    }
    if (!dan && /không có track/i.test(cau)) { ghiChu.push(boChamCuoi(cau) + '.'); continue; }
    // "Công cụ cài đặt & template → Exp Hub" / "Git & Docker: Exp Hub" — câu ngắn trỏ trang nội bộ
    if (!dan && /→\s*Exp Hub|:\s*Exp Hub/i.test(cau)) {
      const ten = boDauCau(cau.replace(/→\s*Exp Hub|:\s*Exp Hub/i, ''));
      const g = ref.g && ref.g.loai === 'cong-cu' ? ref.g : nhom.find((x) => x.loai === 'cong-cu') ?? moNhom('Công cụ');
      g.muc.push({ ten: 'Exp Hub', url: '/exp-hub', noiBo: true, moTa: (ten.replace(RE_MIEN, '').replace(/\(\s*(?:,\s*)*\)/g, '').replace(/\s+/g, ' ').trim()) || 'Hướng dẫn cài công cụ & template', loai: 'cong-cu' });
      RE_MIEN.lastIndex = 0;
      // "Nguồn tra cứu chính chủ (tulieuvankien.dangcongsan.vn, hochiminh.vn) …" ⇒ giữ cả các trang được nhắc
      for (const m of ten.matchAll(RE_MIEN)) {
        const u = chuanUrl(m[0]);
        g.muc.push({ ten: tenMienCua(u), url: u, noiBo: false, tenMien: tenMienCua(u), loai: 'chinh-thuc' });
      }
      continue;
    }
    // "Kèm file syllabus gốc CSD201.pdf." / "Kèm slide FU, bài tập FU (pdf), code Java mẫu." ⇒ tệp đi kèm khoá
    if (!dan && /^Kèm\s+/i.test(cau)) {
      const g = nhom.find((x) => x.loai === 'tai-ve') ?? moNhom('Tệp đi kèm');
      g.loai = 'tai-ve';
      const ten = boChamCuoi(cau.replace(/^Kèm\s+(?:file\s+)?/i, ''));
      g.muc.push({ ten: ten.charAt(0).toUpperCase() + ten.slice(1), noiBo: true, loai: 'tai-ve', laTepDiKem: true, moTa: 'Tệp đi kèm khoá — xem ở mục Tệp tải về' });
      continue;
    }
    if (!dan && laCauGhiChu(cau)) { ghiChu.push(boChamCuoi(cau) + '.'); continue; }
    const g: NhomTaiLieu = ref.g ?? moNhom('Tài liệu');
    let manh = tachNgoai(cau, phanCachMuc);
    if (g.loai === 'cong-cu' && manh.length === 1) manh = tachNgoai(cau, phanCachPhay);
    for (const m of manh) {
      const ds = phanTichMuc(/code lab/i.test(g.tieuDe) && /^track\s/i.test(m) ? m.replace(/^track\s+/i, 'track Code Lab ') : m, g.loai);
      // Mục không link, dài, là một câu có động từ, không phải tên sách trong ngoặc kép ⇒ là câu ghi chú
      if (ds.length === 1 && !ds[0].url && !/["“(]/.test(m) && !/^Giáo trình/i.test(m) && m.split(/\s+/).length >= 12 && laCauGhiChu(m)) { ghiChu.push(boChamCuoi(m) + '.'); continue; }
      g.muc.push(...ds);
    }
  }
  return { nhom: nhom.filter((n) => n.muc.length), ghiChu: ghiChu.map((c) => c.charAt(0).toUpperCase() + c.slice(1)) };
}

/** Gộp trường có cấu trúc `documents` (nếu tệp khoá khai) — ưu tiên hơn ghi chú. */
export function taiLieuTuCauTruc(ds: TaiLieuCoCauTruc[] | null | undefined): KetQuaTaiLieu {
  const nhom: NhomTaiLieu[] = [];
  for (const d of ds ?? []) {
    if (!d?.title) continue;
    const url = d.url?.trim();
    const noiBo = !!url && url.startsWith('/');
    const muc: MucTaiLieu = {
      ten: d.title, url: url || undefined, noiBo, moTa: d.mo_ta,
      tenMien: url && !noiBo ? tenMienCua(chuanUrl(url)) : undefined,
      loai: (['chinh-thuc', 'thuc-hanh', 'video', 'sach', 'chuan', 'khoa-hoc', 'cong-cu', 'tai-ve', 'tham-khao'] as string[]).includes(String(d.loai)) ? d.loai as LoaiTaiLieu : 'tham-khao',
    };
    if (muc.url && !noiBo) muc.url = chuanUrl(muc.url);
    const tieuDe = d.nhom || NHAN_LOAI[muc.loai];
    const g = nhom.find((x) => x.tieuDe === tieuDe) ?? (nhom.push({ tieuDe, loai: muc.loai, muc: [] }), nhom[nhom.length - 1]);
    g.muc.push(muc);
  }
  return { nhom, ghiChu: [] };
}

/**
 * Điểm vào duy nhất cho giao diện: `documentsNote` của khoá ⇒ nhóm + mục.
 * Ghi chú là MẢNG JSON (`[{ title, url, mo_ta, loai, nhom }]` — tệp khoá khai `documents:` thì seeder ghi vào đây,
 * không cần cột mới) ⇒ dùng thẳng dạng có cấu trúc; còn lại ⇒ phân tích chữ.
 */
export function docTaiLieuKhoa(note: string | null | undefined): KetQuaTaiLieu {
  const s = String(note ?? '').trim();
  if (s.startsWith('[')) {
    try {
      const ds = JSON.parse(s);
      if (Array.isArray(ds)) return taiLieuTuCauTruc(ds as TaiLieuCoCauTruc[]);
    } catch { /* không phải JSON ⇒ đọc như chữ */ }
  }
  return phanTichGhiChuTaiLieu(s);
}

export const NHAN_LOAI: Record<LoaiTaiLieu, string> = {
  'chinh-thuc': 'Chính thức', 'thuc-hanh': 'Thực hành', video: 'Video', sach: 'Sách', chuan: 'Chuẩn / đặc tả',
  'khoa-hoc': 'Khoá học', 'cong-cu': 'Công cụ', 'tai-ve': 'Tệp đi kèm', 'tham-khao': 'Tham khảo',
};

/** Link tìm kiếm cho mục không có URL (sách, giáo trình) — để mọi mục đều bấm được. */
export const linkTimKiem = (ten: string) => `https://www.google.com/search?q=${encodeURIComponent(ten)}`;

/** Tệp tải về: đuôi ⇒ nhãn + màu. */
export function kieuTep(ten: string, fileType?: string | null): { nhan: string; mau: string } {
  const t = (fileType || '').toLowerCase();
  const ext = (ten.split('.').pop() || '').toLowerCase();
  if (t === 'link') return { nhan: 'LINK', mau: '#0ea5e9' };
  if (ext === 'pdf' || t.includes('pdf')) return { nhan: 'PDF', mau: '#ef4444' };
  if (['doc', 'docx'].includes(ext) || t.includes('word')) return { nhan: 'DOCX', mau: '#2563eb' };
  if (['ppt', 'pptx'].includes(ext) || t.includes('presentation')) return { nhan: 'PPTX', mau: '#ea580c' };
  if (['xls', 'xlsx', 'csv'].includes(ext) || t.includes('sheet')) return { nhan: 'XLSX', mau: '#16a34a' };
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext) || t.includes('zip')) return { nhan: 'ZIP', mau: '#a16207' };
  if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(ext) || t.startsWith('image/')) return { nhan: 'ẢNH', mau: '#9333ea' };
  if (['mp4', 'mov', 'webm', 'mkv'].includes(ext) || t.startsWith('video/')) return { nhan: 'VIDEO', mau: '#db2777' };
  return { nhan: (ext && ext.length <= 4 ? ext : 'TỆP').toUpperCase(), mau: '#64748b' };
}

export function dungLuong(bytes: number | null | undefined): string {
  const b = Number(bytes || 0);
  if (!b) return '';
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(0)} KB`;
  if (b < 1024 * 1024 * 1024) return `${(b / 1024 / 1024).toFixed(b < 10 * 1024 * 1024 ? 1 : 0)} MB`;
  return `${(b / 1024 / 1024 / 1024).toFixed(1)} GB`;
}
