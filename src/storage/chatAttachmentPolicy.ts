/**
 * Luật tệp đính kèm của Messenger (`POST /api/v1/messages/upload`).
 *
 * ─── Vì sao có tệp này (13/11/2026) ───
 * Chủ kênh dùng app desktop trên Windows: gửi .md / .zip / .rar đều hỏng. Hai lớp lỗi:
 *  • Client (`MessageInput.tsx`) lọc theo `file.type` với danh sách trắng chỉ gồm ảnh/âm thanh/video/pdf/text/zip/
 *    Word/Excel — mà Chromium trên Windows lấy MIME từ registry, nên `.md` / `.rar` / `.7z` thường ra chuỗi RỖNG
 *    (hoặc `application/x-rar-compressed`), `.pptx` không có trong danh sách ⇒ bị từ chối trước khi chạm máy chủ.
 *  • Máy chủ thì ngược lại: KHÔNG kiểm gì, lưu nguyên MIME client khai lên bucket công khai (`text/html` vẫn lọt ⇒
 *    stored-XSS trên media.cuongthai.com), tên tệp tiếng Việt bị busboy đọc thành latin1.
 *
 * Luật ở đây theo đúng lối repo đã dùng cho tệp nộp bài CT Work (`services/work/classworkRules.ts`):
 * chặn theo ĐUÔI (đuôi cuối, bỏ dấu chấm/khoảng trắng thừa mà Windows tự bỏ), chặn tệp thực thi đổi tên theo CHỮ KÝ
 * đầu tệp, và MÁY CHỦ quyết Content-Type theo đuôi — không tin MIME client. Khác ở một chỗ: Messenger là "gửi mọi
 * tệp" nên đuôi lạ KHÔNG bị từ chối, chỉ lưu `application/octet-stream` + `Content-Disposition: attachment` để
 * trình duyệt luôn TẢI VỀ chứ không bao giờ hiển thị/chạy nội dung.
 *
 * ⚠️ Danh sách đuôi bị chặn có bản sao ở client: `frontend/src/lib/tinNhan/tepDinhKem.ts` (`DUOI_BI_CHAN`).
 * `chatAttachmentPolicy.test.ts` so hai bản — sửa một bên mà quên bên kia là test đỏ.
 */
import path from 'node:path';

/** Trần cỡ một tệp đính kèm chat. Client có cùng con số (`TRAN_CO_TEP`). */
export const CHAT_MAX_BYTES = 25 * 1024 * 1024;

/**
 * Đuôi KHÔNG BAO GIỜ nhận: chạy được khi nhấp đúp (Windows/macOS/Linux), script của Windows Script Host,
 * trình cài đặt, lối tắt, ảnh đĩa (lối né Mark-of-the-Web), Office có macro, và nội dung web chạy được.
 * Siêu tập của `BLOCKED_EXT` trong `classworkRules.ts`.
 */
export const CHAT_BLOCKED_EXT: ReadonlySet<string> = new Set([
  // Windows — chạy thẳng
  'exe', 'com', 'scr', 'pif', 'cpl', 'msi', 'msp', 'mst', 'msix', 'msixbundle', 'appx', 'appxbundle', 'appinstaller',
  'dll', 'sys', 'drv', 'ocx', 'gadget', 'msc', 'application', 'jnlp',
  // Windows — script / lối tắt / cấu hình chạy được
  'bat', 'cmd', 'ps1', 'psm1', 'psd1', 'ps1xml', 'psc1', 'vb', 'vbs', 'vbe', 'js', 'jse', 'mjs', 'cjs', 'ws', 'wsf',
  'wsh', 'wsc', 'sct', 'hta', 'lnk', 'url', 'scf', 'inf', 'reg', 'chm', 'settingcontent-ms',
  // Ảnh đĩa (bọc .exe để né cảnh báo tải về của Windows)
  'iso', 'img', 'vhd', 'vhdx',
  // macOS / Linux / Android / Java
  'app', 'dmg', 'pkg', 'command', 'sh', 'bash', 'zsh', 'csh', 'ksh', 'deb', 'rpm', 'run', 'apk', 'jar',
  // Office có macro
  'docm', 'dotm', 'xlsm', 'xltm', 'xlam', 'pptm', 'potm', 'ppam', 'ppsm',
  // Nội dung web chạy được nếu trình duyệt hiển thị nó
  'html', 'htm', 'xhtml', 'shtml', 'svg', 'svgz', 'php', 'phtml',
]);

/** MIME client khai mà tự nó đã là tệp thực thi — chặn dù đuôi có là gì. */
const CHAT_BLOCKED_MIME: ReadonlySet<string> = new Set([
  'application/x-msdownload', 'application/x-msdos-program', 'application/x-ms-installer', 'application/x-msi',
  'application/x-ms-shortcut', 'application/x-sh', 'application/x-executable', 'application/vnd.microsoft.portable-executable',
  'application/hta', 'text/html', 'application/xhtml+xml', 'image/svg+xml', 'text/javascript', 'application/javascript',
  'application/x-javascript',
]);

/** Ảnh đi qua sharp (nén → webp, có xem trước). Ảnh khác (psd, heic, tiff…) gửi như tệp. */
const IMAGE_EXT: Record<string, string> = {
  jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', gif: 'image/gif', webp: 'image/webp', avif: 'image/avif',
};

const AUDIO_VIDEO_EXT: Record<string, string> = {
  mp3: 'audio/mpeg', m4a: 'audio/mp4', aac: 'audio/aac', wav: 'audio/wav', ogg: 'audio/ogg', oga: 'audio/ogg',
  opus: 'audio/opus', flac: 'audio/flac', weba: 'audio/webm',
  mp4: 'video/mp4', m4v: 'video/mp4', mov: 'video/quicktime', webm: 'video/webm', mkv: 'video/x-matroska',
};

const TEXT = 'text/plain; charset=utf-8';
/** Content-Type do MÁY CHỦ quyết cho tệp thường. Không có trong bảng ⇒ `application/octet-stream`. */
const DOC_EXT: Record<string, string> = {
  pdf: 'application/pdf',
  zip: 'application/zip', rar: 'application/vnd.rar', '7z': 'application/x-7z-compressed',
  tar: 'application/x-tar', gz: 'application/gzip', tgz: 'application/gzip', bz2: 'application/x-bzip2', xz: 'application/x-xz',
  doc: 'application/msword', xls: 'application/vnd.ms-excel', ppt: 'application/vnd.ms-powerpoint',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  odt: 'application/vnd.oasis.opendocument.text', ods: 'application/vnd.oasis.opendocument.spreadsheet',
  odp: 'application/vnd.oasis.opendocument.presentation', rtf: 'application/rtf', epub: 'application/epub+zip',
  md: 'text/markdown; charset=utf-8', markdown: 'text/markdown; charset=utf-8', csv: 'text/csv; charset=utf-8',
  // Văn bản / mã nguồn: luôn text/plain (không bao giờ text/html, text/xml… để trình duyệt không diễn giải).
  txt: TEXT, log: TEXT, json: TEXT, xml: TEXT, yml: TEXT, yaml: TEXT, toml: TEXT, ini: TEXT, env: TEXT, sql: TEXT,
  java: TEXT, py: TEXT, c: TEXT, h: TEXT, cpp: TEXT, hpp: TEXT, cs: TEXT, ts: TEXT, tsx: TEXT, jsx: TEXT, css: TEXT,
  scss: TEXT, kt: TEXT, go: TEXT, rs: TEXT, rb: TEXT, swift: TEXT, dart: TEXT, ipynb: TEXT, puml: TEXT, prisma: TEXT,
  ...IMAGE_EXT,
  ...AUDIO_VIDEO_EXT,
};

export type ChatAttachmentKind = 'image' | 'media' | 'document';

export type ChatAttachmentCheck =
  | {
      ok: true;
      kind: ChatAttachmentKind;
      /** Tên đã sửa mã hoá (UTF-8) + bỏ ký tự điều khiển / dấu phân cách đường dẫn. */
      fileName: string;
      ext: string;
      /** Content-Type sẽ lưu — do máy chủ quyết (ảnh: sharp tự đặt webp). */
      contentType: string;
      /** `attachment; …` cho tệp thường; undefined cho ảnh/âm thanh/video (phát tại chỗ). */
      contentDisposition?: string;
    }
  | { ok: false; status: number; code: 'FILE_EMPTY' | 'FILE_TOO_LARGE' | 'FILE_BLOCKED'; message: string };

/**
 * busboy (bên dưới multer 1.x) đọc tên tệp trong multipart theo latin1 ⇒ "Báo cáo.md" thành "BÃ¡o cÃ¡o.md".
 * Đổi ngược lại về UTF-8; nếu kết quả không phải UTF-8 hợp lệ (tên vốn latin1 thật) thì giữ nguyên.
 */
export function utf8FileName(raw: string): string {
  try {
    const out = Buffer.from(raw, 'latin1').toString('utf8');
    return out.includes('\uFFFD') ? raw : out;
  } catch {
    return raw;
  }
}

/** Tên an toàn để lưu/hiện: bỏ ký tự điều khiển + `/` `\`, cắt 200 ký tự (giữ phần đuôi). */
export function cleanFileName(raw: string): string {
  const name = utf8FileName(raw || '')
    .replace(/[\u0000-\u001f\u007f\\/]+/g, '_')
    .trim();
  return (name.length > 200 ? name.slice(-200) : name) || 'file';
}

/**
 * Đuôi THẬT của tệp theo cách Windows hiểu: Explorer bỏ dấu chấm/khoảng trắng ở cuối tên, nên
 * "virus.exe." và "virus.exe   " là .exe. Đuôi kép "a.pdf.exe" ⇒ "exe" (đuôi cuối mới là thứ chạy).
 */
export function chatExtOf(name: string): string {
  const trimmed = (name || '').replace(/[.\s]+$/g, '');
  return path.extname(trimmed).slice(1).toLowerCase();
}

/** PE (Windows "MZ"), ELF, Mach-O — tệp thực thi dù đuôi là gì. */
export function looksExecutable(buf: Buffer): boolean {
  if (buf.length >= 2 && buf[0] === 0x4d && buf[1] === 0x5a) return true; // MZ
  if (buf.length < 4) return false;
  const head = buf.subarray(0, 4).toString('hex');
  return head === '7f454c46' // ELF
    || head === 'feedface' || head === 'feedfacf' || head === 'cefaedfe' || head === 'cffaedfe'; // Mach-O
}

const baseMime = (m: string) => (m || '').toLowerCase().split(';')[0].trim();

/** `attachment; filename="ascii"; filename*=UTF-8''utf8` — RFC 6266, trình duyệt luôn TẢI chứ không mở. */
export function attachmentDisposition(fileName: string): string {
  const ascii = fileName.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\x20-\x7e]/g, '_').replace(/["\\]/g, '_');
  return `attachment; filename="${ascii || 'file'}"; filename*=UTF-8''${encodeURIComponent(fileName)}`;
}

/**
 * Quyết một tệp đính kèm chat: nhận hay chặn, đi đường ảnh (sharp) / media (phát tại chỗ) / tệp (tải về),
 * và Content-Type + Content-Disposition sẽ lưu. MIME client chỉ dùng để NHẬN RA ảnh/âm thanh/video — không bao giờ
 * được lưu nguyên văn cho tệp thường.
 */
export function checkChatAttachment(input: {
  originalName: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
  maxImageBytes?: number;
}): ChatAttachmentCheck {
  const fileName = cleanFileName(input.originalName);
  if (!input.size || !input.buffer?.length) {
    return { ok: false, status: 400, code: 'FILE_EMPTY', message: 'Tệp rỗng' };
  }
  if (input.size > CHAT_MAX_BYTES) {
    return { ok: false, status: 413, code: 'FILE_TOO_LARGE', message: `Tệp vượt quá ${CHAT_MAX_BYTES / 1024 / 1024}MB` };
  }
  const ext = chatExtOf(fileName);
  const mime = baseMime(input.mimetype);
  if (CHAT_BLOCKED_EXT.has(ext)) {
    return { ok: false, status: 400, code: 'FILE_BLOCKED', message: `Không gửi được tệp .${ext} (tệp chạy được) — hãy nén vào .zip` };
  }
  if (CHAT_BLOCKED_MIME.has(mime)) {
    return { ok: false, status: 400, code: 'FILE_BLOCKED', message: `Không gửi được tệp kiểu ${mime} — hãy nén vào .zip` };
  }
  if (looksExecutable(input.buffer)) {
    return { ok: false, status: 400, code: 'FILE_BLOCKED', message: 'Nội dung tệp là chương trình chạy được — không gửi được, hãy nén vào .zip' };
  }

  const unknownMime = mime === '' || mime === 'application/octet-stream';
  const maxImage = input.maxImageBytes ?? Infinity;

  // Ảnh: MIME ảnh (trừ svg — đã chặn ở trên) hoặc MIME rỗng + đuôi ảnh. Quá cỡ ảnh ⇒ gửi nguyên tệp.
  const isImage = (mime.startsWith('image/') && ext in IMAGE_EXT) || (mime.startsWith('image/') && !ext)
    || (unknownMime && ext in IMAGE_EXT);
  if (isImage && input.size <= maxImage) {
    return { ok: true, kind: 'image', fileName, ext, contentType: IMAGE_EXT[ext] ?? mime };
  }

  // Âm thanh / video (tin thoại đi đường này): phát tại chỗ. Lưu MIME gốc (đã bỏ tham số codecs) khi hợp lệ.
  if (/^(audio|video)\/[a-z0-9.+-]+$/.test(mime)) {
    return { ok: true, kind: 'media', fileName, ext, contentType: mime };
  }
  if (unknownMime && ext in AUDIO_VIDEO_EXT) {
    return { ok: true, kind: 'media', fileName, ext, contentType: AUDIO_VIDEO_EXT[ext] };
  }

  // Mọi tệp còn lại: Content-Type theo đuôi (lạ ⇒ octet-stream) + luôn tải về.
  return {
    ok: true,
    kind: 'document',
    fileName,
    ext,
    contentType: DOC_EXT[ext] ?? 'application/octet-stream',
    contentDisposition: attachmentDisposition(fileName),
  };
}
