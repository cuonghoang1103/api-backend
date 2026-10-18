/**
 * LINK NGOÀI — NHẬN DIỆN + DỰNG URL XUẤT + TÓM TẮT FIGMA (19/10/2026). FILE THUẦN, KHÔNG IMPORT GÌ.
 *
 * Dùng chung HAI nơi, nên cố ý không import gì (cả hai tsconfig đều nạp được: máy chủ NodeNext, app desktop
 * bundler + exactOptionalPropertyTypes + noUncheckedIndexedAccess):
 *   - máy chủ: `doc_web` của CuongMini (`agent/webTool.ts`) + AI CT Work (`work/aiMentor.ts`) — qua `docLink.ts`;
 *   - app (desktop / CLI / VS Code): tool `figma_doc` gọi Figma REST bằng token CẤT TRÊN MÁY (`agent/figmaKetNoi.ts`).
 *
 * Bối cảnh: trưởng nhóm gắn link Figma / Google Docs vào thẻ CT Work, AI chỉ thấy tiêu đề (trang Google trả HTML rỗng
 * chạy bằng JS, Figma là canvas). Đường đúng là URL XUẤT chính thức của từng dịch vụ.
 *
 * ⛔ AN TOÀN: mỗi loại link có DANH SÁCH HOST được gọi (`hostChoPhep`) — bộ tải (`taiAnToan.ts`) chỉ theo chuyển
 * hướng sang host trong danh sách đó, chỉ https, và vẫn kiểm IP nội bộ sau khi phân giải DNS.
 */

export type LoaiLink = 'gdoc' | 'gsheet' | 'gslide' | 'gdrive' | 'gfolder' | 'figma' | 'github' | 'notion' | 'canva';

export interface LinkNhanDien {
  loai: LoaiLink;
  /** URL gốc đã chuẩn hoá. */
  url: string;
  /** Google: id tài liệu/file · Figma: file key · GitHub: "owner/repo". */
  id: string;
  /** Sheets: trang tính trong URL (`gid=`). */
  gid?: string;
  /** Figma: node trong URL (`node-id=12-34` ⇒ "12:34"). */
  nodeId?: string;
  /** GitHub: issue / pull / blob / tree / repo. */
  github?: { kieu: 'repo' | 'issue' | 'pull' | 'blob'; so?: number; duong?: string };
}

const ID_GOOGLE = /^[A-Za-z0-9_-]{20,120}$/;
const KEY_FIGMA = /^[A-Za-z0-9]{10,64}$/;
const TEN_GH = /^[A-Za-z0-9_.-]{1,100}$/;

/** Tên đẹp cho người đọc / model. */
export const TEN_LOAI: Record<LoaiLink, string> = {
  gdoc: 'Google Docs', gsheet: 'Google Sheets', gslide: 'Google Slides', gdrive: 'Google Drive (file)', gfolder: 'Google Drive (thư mục)',
  figma: 'Figma', github: 'GitHub', notion: 'Notion', canva: 'Canva',
};

/** Một URL có phải link ngoài loại đặc biệt không. Không khớp ⇒ `null` (đọc như trang web thường). */
export function nhanDienLink(raw: string): LinkNhanDien | null {
  let u: URL;
  try {
    u = new URL(raw.trim().includes('://') ? raw.trim() : `https://${raw.trim()}`);
  } catch {
    return null;
  }
  if (u.protocol !== 'https:' && u.protocol !== 'http:') return null;
  if (u.username || u.password) return null;
  const host = u.hostname.toLowerCase().replace(/\.$/, '');
  const phan = u.pathname.split('/').filter(Boolean);
  const url = u.toString();

  if (host === 'docs.google.com') {
    // /document/d/<ID>/…  · /document/u/0/d/<ID>/… · KHÔNG nhận /d/e/<pubId> (bản "xuất bản lên web" — HTML đọc thường được).
    const loaiGoc = phan[0];
    const loai: LoaiLink | null = loaiGoc === 'document' ? 'gdoc' : loaiGoc === 'spreadsheets' ? 'gsheet' : loaiGoc === 'presentation' ? 'gslide' : null;
    if (!loai) return null;
    const iD = phan.indexOf('d');
    const id = iD >= 0 ? phan[iD + 1] : undefined;
    if (!id || id === 'e' || !ID_GOOGLE.test(id)) return null;
    if (loai === 'gsheet') {
      const gid = /(?:^|[#&?])gid=(\d{1,12})/.exec(`${u.search}${u.hash}`)?.[1];
      return { loai, url, id, ...(gid ? { gid } : {}) };
    }
    return { loai, url, id };
  }

  if (host === 'drive.google.com') {
    if (phan[0] === 'drive' && phan.includes('folders')) {
      const id = phan[phan.indexOf('folders') + 1];
      return id && ID_GOOGLE.test(id) ? { loai: 'gfolder', url, id } : null;
    }
    const iD = phan.indexOf('d');
    const id = (phan[0] === 'file' && iD >= 0 ? phan[iD + 1] : undefined) ?? u.searchParams.get('id') ?? undefined;
    return id && ID_GOOGLE.test(id) ? { loai: 'gdrive', url, id } : null;
  }

  if (host === 'figma.com' || host === 'www.figma.com') {
    // /file|design|proto|board|slides/<KEY>/<tên>?node-id=12-34
    if (!['file', 'design', 'proto', 'board', 'slides'].includes(phan[0] ?? '')) return null;
    const id = phan[1];
    if (!id || !KEY_FIGMA.test(id)) return null;
    const node = u.searchParams.get('node-id');
    const nodeId = node && /^\d{1,9}[-:]\d{1,9}$/.test(node) ? node.replace('-', ':') : undefined;
    return { loai: 'figma', url, id, ...(nodeId ? { nodeId } : {}) };
  }

  if (host === 'github.com' || host === 'www.github.com') {
    const [o, r, kieu, a] = phan;
    if (!o || !r || !TEN_GH.test(o) || !TEN_GH.test(r)) return null;
    const repo = `${o}/${r.replace(/\.git$/, '')}`;
    if (!kieu) return { loai: 'github', url, id: repo, github: { kieu: 'repo' } };
    if ((kieu === 'issues' || kieu === 'pull') && a && /^\d{1,9}$/.test(a)) {
      return { loai: 'github', url, id: repo, github: { kieu: kieu === 'issues' ? 'issue' : 'pull', so: Number(a) } };
    }
    if (kieu === 'blob' && phan.length >= 5) {
      const duong = phan.slice(3).map((x) => decodeURIComponent(x)).join('/');
      if (duong.split('/').some((x) => x === '..' || x === '.')) return null;
      return { loai: 'github', url, id: repo, github: { kieu: 'blob', duong } };
    }
    if (kieu === 'tree' || kieu === 'wiki' || kieu === 'pulls' || kieu === 'issues') return { loai: 'github', url, id: repo, github: { kieu: 'repo' } };
    return null;
  }

  if (host.endsWith('.notion.site') || host === 'notion.so' || host === 'www.notion.so') return { loai: 'notion', url, id: phan[phan.length - 1] ?? '' };
  if ((host === 'canva.com' || host === 'www.canva.com') && phan[0] === 'design') return { loai: 'canva', url, id: phan[1] ?? '' };
  return null;
}

/** Mọi link ngoài loại đặc biệt trong một đoạn chữ (mô tả thẻ, bình luận) — bỏ trùng, giữ thứ tự. */
export function timLinkNgoai(chu: string, toiDa = 8): LinkNhanDien[] {
  const ra: LinkNhanDien[] = [];
  const da = new Set<string>();
  for (const m of chu.matchAll(/https?:\/\/[^\s<>()"'`\]]+/g)) {
    const tho = m[0].replace(/[.,;:!?]+$/, '');
    const l = nhanDienLink(tho);
    if (!l) continue;
    const khoa = `${l.loai}:${l.id}:${l.gid ?? ''}:${l.nodeId ?? ''}:${l.github?.so ?? l.github?.duong ?? ''}`;
    if (da.has(khoa)) continue;
    da.add(khoa);
    ra.push(l);
    if (ra.length >= toiDa) break;
  }
  return ra;
}

/** URL xuất chính thức, theo thứ tự thử (cái đầu hỏng ⇒ cái sau). */
export function urlXuat(l: LinkNhanDien): string[] {
  const id = encodeURIComponent(l.id);
  switch (l.loai) {
    case 'gdoc': return [`https://docs.google.com/document/d/${id}/export?format=md`, `https://docs.google.com/document/d/${id}/export?format=txt`];
    // xlsx = MỌI trang tính trong một lượt (rút bằng docOffice); lùi về csv của trang trong URL.
    case 'gsheet': return [`https://docs.google.com/spreadsheets/d/${id}/export?format=xlsx`, `https://docs.google.com/spreadsheets/d/${id}/export?format=csv&gid=${l.gid ?? '0'}`];
    case 'gslide': return [`https://docs.google.com/presentation/d/${id}/export/txt`, `https://docs.google.com/presentation/d/${id}/export/pdf`];
    case 'gdrive': return [`https://drive.google.com/uc?export=download&id=${id}`];
    case 'figma': return [`https://www.figma.com/api/oembed?url=${encodeURIComponent(l.url)}`];
    default: return [];
  }
}

/** Host được gọi (kể cả chặng chuyển hướng) cho từng loại. So khớp CHÍNH XÁC hoặc đuôi `.<miền>` có dấu chấm. */
export function hostChoPhep(loai: LoaiLink, host: string): boolean {
  const h = host.toLowerCase().replace(/\.$/, '');
  const duoi = (d: string) => h === d || h.endsWith(`.${d}`);
  switch (loai) {
    case 'gdoc': case 'gsheet': case 'gslide': case 'gdrive':
      return h === 'docs.google.com' || h === 'drive.google.com' || h === 'drive.usercontent.google.com' || duoi('googleusercontent.com');
    case 'figma':
      // figma.com + mọi miền con của Figma (api, ảnh xem trước s3-alpha…) + bucket S3 trả ảnh frame của /v1/images.
      return duoi('figma.com') || h === 'figma-alpha-api.s3.us-west-2.amazonaws.com';
    case 'github':
      return h === 'api.github.com' || h === 'raw.githubusercontent.com';
    default:
      return false;
  }
}

/** Chuyển hướng tới trang đăng nhập Google ⇒ tài liệu RIÊNG TƯ (chưa mở "Bất kỳ ai có đường liên kết"). */
export function laDangNhapGoogle(url: string): boolean {
  try {
    const u = new URL(url);
    return u.hostname === 'accounts.google.com' || /ServiceLogin|signin/i.test(u.pathname);
  } catch {
    return false;
  }
}

/** Câu báo link riêng tư — song ngữ, model chép lại cho người dùng. */
export function cauLinkRiengTu(l: LinkNhanDien): string {
  const ten = TEN_LOAI[l.loai];
  if (l.loai === 'figma') {
    return `${ten}: file chưa mở chia sẻ công khai (hoặc không tồn tại) — nhờ chủ file bật Share → "Anyone with the link can view", `
      + 'hoặc dán Figma personal access token CHỈ ĐỌC (scope file_content:read) ở cài đặt (CLI: /ket-noi figma; web: Cài đặt dự án → Figma). '
      + `/ ${ten}: the file is not shared publicly (or does not exist) — ask the owner to set "Anyone with the link can view", or add a read-only Figma token in settings.`;
  }
  return `${ten}: link chưa mở chia sẻ — nhờ chủ tài liệu bật "Bất kỳ ai có đường liên kết" (Anyone with the link → Viewer). `
    + `/ ${ten}: the link is not shared publicly — ask the owner to set "Anyone with the link" → Viewer.`;
}

// ─── Figma: cây file ⇒ chữ ───────────────────────────────────────

export interface NodeFigma {
  id?: string;
  name?: string;
  type?: string;
  characters?: string;
  children?: NodeFigma[];
  absoluteBoundingBox?: { width?: number; height?: number } | null;
}

/** Các frame cấp cao (con trực tiếp của từng trang) — để xin ảnh + đọc sâu. */
export function frameCapCao(doc: NodeFigma | null | undefined, toiDa = 8): Array<{ id: string; ten: string; trang: string }> {
  const ra: Array<{ id: string; ten: string; trang: string }> = [];
  for (const trang of doc?.children ?? []) {
    for (const f of trang.children ?? []) {
      if (!f.id || !['FRAME', 'COMPONENT', 'COMPONENT_SET', 'SECTION', 'GROUP', 'INSTANCE'].includes(f.type ?? '')) continue;
      ra.push({ id: f.id, ten: f.name ?? '', trang: trang.name ?? '' });
      if (ra.length >= toiDa) return ra;
    }
  }
  return ra;
}

/**
 * Cây Figma ⇒ dàn ý chữ: trang → frame (cỡ) → khung con có tên → chữ trong layer TEXT. Trần ký tự; chữ lặp lại
 * (nút "Login" ở 20 màn) chỉ ghi một lần mỗi frame.
 */
export function tomTatCayFigma(goc: NodeFigma, tran = 12_000, sauToiDa = 6): string {
  const dong: string[] = [];
  let tong = 0;
  const them = (s: string): boolean => {
    if (tong + s.length + 1 > tran) return false;
    dong.push(s);
    tong += s.length + 1;
    return true;
  };
  const co = (n: NodeFigma) => {
    const b = n.absoluteBoundingBox;
    return b && typeof b.width === 'number' && typeof b.height === 'number' ? ` ${Math.round(b.width)}×${Math.round(b.height)}` : '';
  };
  const di = (n: NodeFigma, sau: number, daGhi: Set<string>): boolean => {
    const thut = '  '.repeat(sau);
    if (n.type === 'TEXT') {
      const chu = (n.characters ?? '').replace(/\s+/g, ' ').trim();
      if (!chu || daGhi.has(chu)) return true;
      daGhi.add(chu);
      return them(`${thut}“${chu.length > 300 ? `${chu.slice(0, 300)}…` : chu}”`);
    }
    const laKhung = ['CANVAS', 'FRAME', 'COMPONENT', 'COMPONENT_SET', 'SECTION', 'INSTANCE', 'GROUP'].includes(n.type ?? '');
    let sauCon = sau;
    if (laKhung && n.type !== 'DOCUMENT') {
      const ten = (n.name ?? '').trim();
      const laTenMacDinh = /^(Frame|Group|Rectangle|Vector|Ellipse|Line) ?\d*$/i.test(ten);
      if (n.type === 'CANVAS') { if (!them(`${thut}# Trang "${ten}"`)) return false; }
      else if (sau <= 2 || !laTenMacDinh) { if (!them(`${thut}- [${(n.type ?? '').toLowerCase()}] ${ten}${sau <= 2 ? co(n) : ''}`)) return false; }
      sauCon = sau + 1;
    }
    if (sau >= sauToiDa + 4) return true;
    const moi = n.type === 'FRAME' && sau <= 2 ? new Set<string>() : daGhi;
    for (const c of n.children ?? []) if (!di(c, sauCon, moi)) return false;
    return true;
  };
  const xong = di(goc, 0, new Set());
  return `${dong.join('\n')}${xong ? '' : '\n[… đã cắt — file còn nữa]'}`;
}

/** Bình luận Figma ⇒ chữ (tối đa `toiDa` cái mới nhất). Không ghi email người viết — chỉ handle. */
export function tomTatBinhLuanFigma(ds: Array<{ message?: string; user?: { handle?: string } | null; created_at?: string; resolved_at?: string | null }>, toiDa = 20): string {
  const ra = ds.slice(-toiDa).map((c) => `- ${c.user?.handle ?? '?'} (${(c.created_at ?? '').slice(0, 10)})${c.resolved_at ? ' [đã xử lý]' : ''}: ${(c.message ?? '').replace(/\s+/g, ' ').slice(0, 400)}`);
  return ra.join('\n');
}
