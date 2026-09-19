/**
 * THÊM VIDEO CỦA NGƯỜI DÙNG — dán link YouTube/TikTok, hoặc chia sẻ từ app.
 *
 * Lấy phụ đề bằng `yt-dlp` (đã có sẵn trong ảnh backend cho tính năng nhạc,
 * xem `youtubeAudio.service.ts`), làm sạch rồi lưu. KHÔNG tải video về, và
 * người học vẫn xem bằng trình phát nhúng chính thức.
 */
import { execFile } from 'child_process';
import { promisify } from 'util';
import os from 'os';
import path from 'path';
import fs from 'fs/promises';
import { prisma } from '../../config/database.js';
import { BadRequestError } from '../../middleware/errorHandler.js';
import { logger } from '../../utils/logger.js';
import type { CauPhuDe } from './phuDe.service.js';
import { MA_NHOM_LON, nhomLonTuTheLoai } from './nhomChuDe.js';

const execFileAsync = promisify(execFile);
const YT_DLP = process.env.YT_DLP_PATH || 'yt-dlp';

/** Trần: video dài hơn 4 tiếng thì VTT phình và chẳng ai học hết. */
const TRAN_GIAY = 4 * 3600;
/** Dưới ngần này từ thì coi như KHÔNG có phụ đề dùng được. */
const TOI_THIEU_TU = 30;

// Mỗi lúc chỉ một lượt: container backend chỉ có 1GB, và hai lượt yt-dlp
// song song vừa dễ OOM vừa làm YouTube trả 429 nhanh hơn (đo 19/09/2026:
// phụ đề tiếng Việt tự dịch đã bị 429 ngay lượt đầu).
let dangChay = false;

export type NguonVideo = 'youtube' | 'tiktok';

/**
 * Tách nguồn + mã video từ link người dùng dán vào.
 *
 * ⚠️ Chỉ lấy MÃ, rồi dựng lại URL chuẩn ở dưới — KHÔNG bao giờ đưa thẳng
 * chuỗi người dùng nhập cho `yt-dlp`. Nhận nguyên chuỗi thì một link
 * `http://169.254.169.254/...` hay một tệp cục bộ cũng chạy được.
 */
export function phanTichUrl(raw: string): { nguon: NguonVideo; videoId: string } {
  const s = (raw || '').trim();
  if (!s) throw new BadRequestError('Chưa có link');

  let u: URL;
  try {
    u = new URL(s.startsWith('http') ? s : `https://${s}`);
  } catch {
    throw new BadRequestError('Link không hợp lệ');
  }
  const host = u.hostname.replace(/^www\./, '').toLowerCase();

  // ── YouTube ──
  const yt = ['youtube.com', 'm.youtube.com', 'music.youtube.com', 'youtu.be'];
  if (yt.includes(host)) {
    let id = '';
    if (host === 'youtu.be') id = u.pathname.slice(1);
    else if (u.searchParams.get('v')) id = u.searchParams.get('v')!;
    else {
      const m = u.pathname.match(/\/(?:shorts|embed|live|v)\/([^/?#]+)/);
      if (m) id = m[1];
    }
    id = id.split(/[?&#/]/)[0];
    if (!/^[A-Za-z0-9_-]{11}$/.test(id)) {
      throw new BadRequestError('Không đọc được mã video YouTube trong link này');
    }
    return { nguon: 'youtube', videoId: id };
  }

  // ── TikTok ──
  if (host === 'tiktok.com' || host.endsWith('.tiktok.com')) {
    const m = u.pathname.match(/\/video\/(\d{6,25})/);
    if (m) return { nguon: 'tiktok', videoId: m[1] };
    // Link rút gọn (vm.tiktok.com/xxx) chưa có mã trong đường dẫn — để
    // `yt-dlp` tự bám theo chuyển hướng, nhưng vẫn giữ nguyên HOST đã duyệt.
    if (/^[A-Za-z0-9._-]{3,64}$/.test(u.pathname.slice(1))) {
      return { nguon: 'tiktok', videoId: `@${u.pathname.slice(1)}` };
    }
    throw new BadRequestError('Không đọc được mã video TikTok trong link này');
  }

  throw new BadRequestError('Hiện chỉ nhận link YouTube hoặc TikTok');
}

function urlChuan(nguon: NguonVideo, videoId: string): string {
  if (nguon === 'youtube') return `https://www.youtube.com/watch?v=${videoId}`;
  if (videoId.startsWith('@')) return `https://vm.tiktok.com/${videoId.slice(1)}`;
  return `https://www.tiktok.com/@x/video/${videoId}`;
}

// ════════════════════════════════════════════════════════════════
// LÀM SẠCH VTT
// ════════════════════════════════════════════════════════════════

const RE_KHOI = /(\d\d:\d\d:\d\d\.\d\d\d) --> (\d\d:\d\d:\d\d\.\d\d\d)[^\n]*\n([\s\S]*?)(?=\n\n|$)/g;

function giay(t: string): number {
  const [h, m, s] = t.split(':');
  return Math.round((Number(h) * 3600 + Number(m) * 60 + Number(s)) * 100) / 100;
}

/**
 * Phụ đề tự động của YouTube chạy kiểu CỬA SỔ TRƯỢT: mỗi khối lặp lại đuôi
 * khối trước rồi thêm vài từ mới. Khử "dòng trùng dòng" là chưa đủ — vẫn còn
 * ~70% chữ lặp. Cách đúng: ghép thành MỘT DÒNG TỪ liên tục (mỗi khối chỉ góp
 * phần đuôi mới), rồi cắt lại theo câu.
 *
 * Bản gốc là `lam-sach-vtt.py` chạy ở máy nhà cho 963 bài giảng; chép sang
 * đây để video người dùng thêm cũng sạch y như vậy.
 */
export function lamSachVtt(raw: string): { cues: CauPhuDe[]; soTu: number } {
  const tu: Array<[number, string]> = [];
  let daCo: string[] = [];

  for (const m of raw.matchAll(RE_KHOI)) {
    let t = m[3].replace(/<[^>]+>/g, '');
    // Bỏ nhãn âm thanh ở BẤT KỲ ĐÂU, không chỉ khi cả dòng là nhãn — nếu
    // không, câu mở đầu ra thành "[Music] hey guys how's it going".
    t = t.replace(/\[[^\]]{0,40}\]/g, ' ');
    t = t.split(/\s+/).filter(Boolean).join(' ');
    if (!t) continue;

    const moi = t.split(' ');
    const n = Math.min(daCo.length, moi.length);
    let chong = 0;
    for (let k = n; k > 0; k--) {
      if (daCo.slice(-k).join(' ') === moi.slice(0, k).join(' ')) { chong = k; break; }
    }
    const them = moi.slice(chong);
    if (!them.length) continue;

    const b0 = giay(m[1]);
    for (const w of them) tu.push([b0, w]);
    daCo.push(...them);
    // Chỉ giữ đuôi 40 từ để so chồng lấn: so với cả bài thì O(n²) và một
    // video một tiếng mất hàng phút.
    if (daCo.length > 40) daCo = daCo.slice(-40);
  }

  const cues: CauPhuDe[] = [];
  let cum: string[] = [];
  let moc: number | null = null;
  for (const [gi, w] of tu) {
    if (moc === null) moc = gi;
    cum.push(w);
    if (/[.?!]$/.test(w) || cum.length >= 18) {
      cues.push({ t: moc, en: cum.join(' ') });
      cum = []; moc = null;
    }
  }
  if (cum.length) cues.push({ t: moc ?? 0, en: cum.join(' ') });

  return { cues, soTu: tu.length };
}

// ════════════════════════════════════════════════════════════════
// THÊM
// ════════════════════════════════════════════════════════════════

type ThongTin = { title: string; duration: number | null; uploader: string | null;
                  thumbnail: string | null; id: string; theLoai: string[] };

async function layPhuDe(nguon: NguonVideo, videoId: string):
    Promise<{ tin: ThongTin; vtt: string | null }> {
  const thuMuc = await fs.mkdtemp(path.join(os.tmpdir(), 'ytsub-'));
  try {
    const url = urlChuan(nguon, videoId);
    // `--print` một mình sẽ ngầm bật `--simulate` và KHÔNG tải gì cả — đã
    // mất một lượt đo vì chuyện đó (19/09/2026). Dùng `--write-info-json`.
    const args = [
      '--skip-download', '--no-simulate', '--no-playlist', '--no-warnings',
      '--write-auto-subs', '--write-subs', '--sub-langs', 'en,en-US,en-GB',
      '--sub-format', 'vtt', '--write-info-json',
      '--socket-timeout', '20', '--retries', '2',
      '-o', path.join(thuMuc, 'v'), url,
    ];
    await execFileAsync(YT_DLP, args, { timeout: 150_000, maxBuffer: 8 * 1024 * 1024 });

    const files = await fs.readdir(thuMuc);
    const infoF = files.find((f) => f.endsWith('.info.json'));
    if (!infoF) throw new BadRequestError('Không đọc được thông tin video (link riêng tư hoặc đã bị gỡ?)');
    const info = JSON.parse(await fs.readFile(path.join(thuMuc, infoF), 'utf8')) as Record<string, unknown>;

    const tin: ThongTin = {
      id: String(info.id ?? videoId),
      title: String(info.title ?? 'Video'),
      duration: typeof info.duration === 'number' ? Math.round(info.duration) : null,
      uploader: (info.uploader ?? info.channel ?? null) as string | null,
      thumbnail: (info.thumbnail ?? null) as string | null,
      theLoai: Array.isArray(info.categories) ? (info.categories as string[]) : [],
    };

    const vttF = files.find((f) => f.endsWith('.vtt'));
    const vtt = vttF ? await fs.readFile(path.join(thuMuc, vttF), 'utf8') : null;
    return { tin, vtt };
  } finally {
    await fs.rm(thuMuc, { recursive: true, force: true }).catch(() => {});
  }
}

export async function themTuUrl(userId: number, rawUrl: string, nhomLon?: string) {
  const { nguon, videoId } = phanTichUrl(rawUrl);

  if (dangChay) {
    throw new BadRequestError('Đang thêm một video khác — thử lại sau vài giây');
  }
  dangChay = true;
  try {
    const { tin, vtt } = await layPhuDe(nguon, videoId);

    if (tin.duration && tin.duration > TRAN_GIAY) {
      throw new BadRequestError('Video dài hơn 4 tiếng — chưa nhận');
    }
    if (!vtt) {
      throw new BadRequestError(
        nguon === 'tiktok'
          ? 'Video TikTok này không có phụ đề nên chưa học được'
          : 'Video này không có phụ đề tiếng Anh (kể cả phụ đề tự động)',
      );
    }

    const { cues, soTu } = lamSachVtt(vtt);
    if (soTu < TOI_THIEU_TU) {
      throw new BadRequestError('Phụ đề của video này quá ngắn để học');
    }

    const ma = tin.id || videoId;
    // Người dùng chọn thì nghe người dùng; không chọn thì đoán từ thể loại
    // YouTube tự khai. Đoán sai cũng không sao — đổi được sau, và một video
    // nằm nhầm nhóm vẫn tìm ra bằng ô tìm kiếm.
    const nhom = nhomLon && MA_NHOM_LON.has(nhomLon)
      ? nhomLon
      : nhomLonTuTheLoai(tin.theLoai);
    const ghi = {
      nhomLon: nhom,
      tieuDe: tin.title.slice(0, 300),
      tacGia: tin.uploader?.slice(0, 200) ?? null,
      anhBia: tin.thumbnail?.slice(0, 600) ?? null,
      giay: tin.duration,
      cues: cues as unknown as object,
      soCau: cues.length,
      soTu,
    };

    const hang = await prisma.videoNguoiDung.upsert({
      where: { uk_video_nguoi_dung: { userId, nguon, videoId: ma } },
      create: { userId, nguon, videoId: ma, ...ghi },
      update: ghi,
    });

    logger.info(`[video] ${userId} thêm ${nguon}:${ma} — ${cues.length} câu, ${soTu} từ`);
    return hang;
  } finally {
    dangChay = false;
  }
}

export async function videoCuaToi(userId: number) {
  const ds = await prisma.videoNguoiDung.findMany({
    where: { userId },
    select: { id: true, nguon: true, nhomLon: true, videoId: true, tieuDe: true,
              tacGia: true, anhBia: true, giay: true, soCau: true, soTu: true,
              createdAt: true },
    orderBy: { createdAt: 'desc' },
  });
  return ds;
}

export async function phuDeCuaToi(userId: number, id: number) {
  const d = await prisma.videoNguoiDung.findFirst({
    where: { id, userId },
    select: { id: true, nguon: true, videoId: true, tieuDe: true,
              cues: true, dichVi: true, soCau: true, soTu: true },
  });
  if (!d) throw new BadRequestError('Không tìm thấy video này');
  return {
    lessonId: -d.id,             // âm = video của người dùng, xem `VideoHoc`
    videoId: d.videoId,
    nguon: d.nguon,
    tieuDe: d.tieuDe,
    tieuDeVi: null,
    soCau: d.soCau,
    soTu: d.soTu,
    cues: d.cues as CauPhuDe[],
    dichVi: (d.dichVi as string[] | null) ?? null,
  };
}

export async function xoaVideo(userId: number, id: number) {
  const n = await prisma.videoNguoiDung.deleteMany({ where: { id, userId } });
  if (!n.count) throw new BadRequestError('Không tìm thấy video này');
  return { daXoa: true };
}

/** Đổi nhóm lớn của một video đã thêm. */
export async function doiNhom(userId: number, id: number, nhomLon: string) {
  if (!MA_NHOM_LON.has(nhomLon)) throw new BadRequestError('Nhóm không hợp lệ');
  const n = await prisma.videoNguoiDung.updateMany({
    where: { id, userId }, data: { nhomLon },
  });
  if (!n.count) throw new BadRequestError('Không tìm thấy video này');
  return { nhomLon };
}
