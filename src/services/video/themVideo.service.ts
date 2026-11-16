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
import { randomUUID } from 'crypto';
import { Prisma } from '@prisma/client';
import { BadRequestError, NotFoundError } from '../../middleware/errorHandler.js';
import { logger } from '../../utils/logger.js';
import type { CauPhuDe } from './phuDe.service.js';
import { MA_NHOM_LON, nhomLonTuTheLoai } from './nhomChuDe.js';
import { chonTrack, chuanHoaMoc, lamSachCjk, laNnVideo, nnTuMa, type NnVideo } from './phuDeDaNgu.js';


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
export function phanTichUrl(raw: string, tuyChon: { choTikTok?: boolean } = {}): { nguon: NguonVideo; videoId: string } {
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

  // ── TikTok: CHƯA nhận, và nói rõ vì sao ──
  //
  // ⚠️ Không phải "chưa kịp làm". Cả màn học dựa vào việc TUA tới đúng câu
  // khi chạm vào phụ đề, mà trình nhúng của TikTok KHÔNG có API đọc/đặt
  // thời điểm phát — nên phụ đề sẽ nằm đó như một trang chữ chết, không
  // khớp với tiếng. Thêm vào mà không đồng bộ được thì tệ hơn là không có.
  // (Và đa số video TikTok cũng không có phụ đề để lấy.)
  //
  // CT Language (16/11/2026) — `choTikTok`: trình phát nhúng MỚI của TikTok (`tiktok.com/player/v1/<id>`) có API
  // postMessage `seekTo` + sự kiện `onCurrentTime` ⇒ tua theo phụ đề được. App CT Language dùng trình đó; app CuongThai
  // vẫn dùng trình phát YouTube nên đường cũ (không cờ) giữ nguyên lời từ chối.
  if ((host === 'tiktok.com' || host.endsWith('.tiktok.com')) && tuyChon.choTikTok) {
    const so = u.pathname.match(/\/(?:video|v|embed\/v2|player\/v1)\/(\d{8,24})/);
    if (so) return { nguon: 'tiktok', videoId: so[1] };
    const sub = host.split('.')[0];
    const ngan = u.pathname.match(/^\/([A-Za-z0-9]{5,16})\/?$/);
    if ((sub === 'vm' || sub === 'vt') && ngan) return { nguon: 'tiktok', videoId: `@${sub}/${ngan[1]}` };
    throw new BadRequestError('Không đọc được mã video TikTok trong link này');
  }
  if (host === 'tiktok.com' || host.endsWith('.tiktok.com')) {
    throw new BadRequestError(
      'Chưa học được bằng video TikTok: trình phát nhúng của TikTok không cho tua theo phụ đề, '
      + 'nên phụ đề sẽ không khớp với tiếng. Hiện dùng được link YouTube.');
  }

  throw new BadRequestError('Hiện chỉ nhận link YouTube');
}

function urlChuan(nguon: NguonVideo, videoId: string): string {
  if (nguon === 'youtube') return `https://www.youtube.com/watch?v=${videoId}`;
  // Link rút gọn `@vm/<mã>` | `@vt/<mã>` (mã đã kiểm chỉ gồm chữ + số ở `phanTichUrl`); bản cũ `@<mã>` = vm.
  const ngan = videoId.match(/^@(vm|vt)\/([A-Za-z0-9]{5,16})$/);
  if (ngan) return `https://${ngan[1]}.tiktok.com/${ngan[2]}/`;
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
      throw new BadRequestError('Video này không có phụ đề tiếng Anh (kể cả phụ đề tự động)');
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
              cues: true, dichVi: true, soCau: true, soTu: true,
              lang: true, trackGoc: true, tuDong: true, tacGia: true, giay: true, anhBia: true, soDich: true },
  });
  if (!d) throw new BadRequestError('Không tìm thấy video này');
  return {
    // CT Language (16/11/2026) — thêm trường, không đổi trường cũ: `cues[].en` là câu GỐC theo `lang`.
    lang: d.lang,
    trackGoc: d.trackGoc,
    tuDong: d.tuDong,
    kenh: d.tacGia,
    giay: d.giay,
    anhBiaUrl: d.anhBia,
    soDich: d.soDich,
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

// ════════════════════════════════════════════════════════════════
// YÊU THÍCH
// ════════════════════════════════════════════════════════════════

/**
 * App dùng MỘT con số để chỉ video: `lessonId` dương = bài giảng của web,
 * ÂM = video người dùng tự thêm (`-id`). Quy ước đó có từ `thuVien()`, giữ
 * nguyên ở đây để màn hình không phải mang hai loại khoá.
 */
function tachKhoa(ma: number): { lessonId: number | null; videoTuThemId: number | null } {
  return ma < 0 ? { lessonId: null, videoTuThemId: -ma } : { lessonId: ma, videoTuThemId: null };
}

/** Bật/tắt yêu thích. Trả về trạng thái SAU khi đổi. */
export async function doiYeuThich(userId: number, ma: number) {
  const { lessonId, videoTuThemId } = tachKhoa(ma);

  const cu = await prisma.videoYeuThich.findFirst({
    where: { userId, lessonId, videoTuThemId },
    select: { id: true },
  });
  if (cu) {
    await prisma.videoYeuThich.delete({ where: { id: cu.id } });
    return { ma, yeuThich: false };
  }

  try {
    await prisma.videoYeuThich.create({ data: { userId, lessonId, videoTuThemId } });
  } catch {
    // Khoá ngoại hỏng = video không còn. Nói thẳng, đừng để nút tim bấm
    // xong không có gì xảy ra và người dùng tưởng app đơ.
    throw new BadRequestError('Video này không còn tồn tại');
  }
  return { ma, yeuThich: true };
}

/** Danh sách mã video đã thích, mới nhất trước. */
export async function maYeuThich(userId: number): Promise<number[]> {
  const ds = await prisma.videoYeuThich.findMany({
    where: { userId },
    select: { lessonId: true, videoTuThemId: true },
    orderBy: { createdAt: 'desc' },
  });
  return ds.map((d: (typeof ds)[number]) =>
    d.lessonId ?? -(d.videoTuThemId as number));
}

// ════════════════════════════════════════════════════════════════
// CT LANGUAGE (16/11/2026) — THÊM VIDEO ĐA NGÔN NGỮ, CHẠY NỀN CÓ TIẾN TRÌNH
//
// Khác đường cũ (`themTuUrl`, app CuongThai — giữ NGUYÊN):
//   · Ngôn ngữ phụ đề theo video: en / ja / zh (app gửi `nn`, hoặc 'auto' = ngôn ngữ video đang nói).
//   · HAI bước yt-dlp: (1) đọc `info.json` (không tải phụ đề nào) ⇒ `chonTrack` chọn ĐÚNG một track (người làm trước,
//     tự động chỉ khi video nói đúng thứ tiếng đó — không học bằng bản máy dịch); (2) `--load-info-json` tải đúng track
//     ấy (không mở lại trang video).
//   · Chạy nền theo HÀNG: `POST /video-hoc/them` trả mã việc ngay, app hỏi `GET /video-hoc/them/:ma` để hiện TỪNG BƯỚC
//     (xếp hàng thứ mấy · đọc thông tin · chọn phụ đề · tải · làm sạch · lưu). Vẫn MỘT lượt yt-dlp mỗi lúc (chung khoá
//     `dangChay` với đường cũ: container 1 GB + YouTube 429).
//   · TikTok nhận được (trình phát `player/v1` của TikTok tua được — xem `phanTichUrl`).
// Hàng đợi nằm trong RAM (một tiến trình): khởi động lại máy chủ giữa chừng ⇒ app thấy "không còn việc" và mời thử lại.
// ════════════════════════════════════════════════════════════════


export type BuocThem = 'xep_hang' | 'doc_thong_tin' | 'chon_phu_de' | 'tai_phu_de' | 'lam_sach' | 'luu' | 'xong' | 'loi';

export const TEN_NN_VIDEO: Record<NnVideo, string> = { en: 'tiếng Anh', ja: 'tiếng Nhật', zh: 'tiếng Trung' };
/** Dưới ngần này CHỮ (CJK) thì coi như không có phụ đề dùng được — tương đương 30 từ tiếng Anh. */
const TOI_THIEU_CHU_CJK = 60;
const TRAN_VIEC_MOT_NGUOI = 3;
const GIU_VIEC_MS = 15 * 60_000;

/** Video tự thêm theo hình dạng thư viện của app (giống `cuaToi` của `/thu-vien`). */
export function hinhVideoCuaToi(v: {
  id: number; nguon: string; nhomLon: string; videoId: string; tieuDe: string; tacGia: string | null;
  anhBia: string | null; giay: number | null; soCau: number; soTu: number; lang: string; trackGoc: string | null;
  tuDong: boolean | null; soDich: number; createdAt?: Date;
}) {
  return {
    lessonId: -v.id,
    videoId: v.videoId,
    nguon: v.nguon,
    nhomLon: v.nhomLon,
    tieuDe: v.tieuDe,
    // App CuongThai đọc `tieuDeVi` làm dòng phụ (tên kênh) — giữ; app CT Language đọc `kenh`.
    tieuDeVi: v.tacGia,
    kenh: v.tacGia,
    anhBiaUrl: v.anhBia,
    giay: v.giay,
    soCau: v.soCau,
    soTu: v.soTu,
    lang: v.lang,
    trackGoc: v.trackGoc,
    tuDong: v.tuDong,
    soDich: v.soDich,
    themLuc: v.createdAt?.toISOString() ?? null,
  };
}

const CHON_VIDEO = {
  id: true, nguon: true, nhomLon: true, videoId: true, tieuDe: true, tacGia: true, anhBia: true, giay: true,
  soCau: true, soTu: true, lang: true, trackGoc: true, tuDong: true, soDich: true, createdAt: true,
} as const;

/** Lỗi yt-dlp ⇒ câu tiếng Việt người dùng hiểu được (không lộ đường dẫn/lệnh). */
export function cauLoiYtDlp(e: unknown): string {
  const s = `${(e as { stderr?: string })?.stderr ?? ''} ${(e as Error)?.message ?? ''}`;
  if (/Sign in to confirm|bot|429|Too Many Requests/i.test(s)) return 'YouTube đang tạm chặn máy chủ lấy phụ đề — thử lại sau ít phút nhé.';
  if (/Private video|private/i.test(s)) return 'Video này để riêng tư — chỉ video công khai mới thêm được.';
  if (/members-only|Join this channel/i.test(s)) return 'Video chỉ dành cho hội viên kênh — chưa thêm được.';
  if (/age|confirm your age/i.test(s)) return 'Video giới hạn độ tuổi — chưa thêm được.';
  if (/unavailable|removed|not available|404/i.test(s)) return 'Video không còn tồn tại hoặc không xem được ở khu vực này.';
  if (/timed? ?out|ETIMEDOUT|killed|SIGTERM/i.test(s)) return 'Lấy phụ đề quá lâu — video có thể quá dài, thử lại sau nhé.';
  return 'Không lấy được thông tin video — kiểm tra link rồi thử lại.';
}

function regexMa(ma: string): string {
  return ma.replace(/[^A-Za-z0-9_-]/g, (c) => `\\${c}`);
}

type KetQuaThem = ReturnType<typeof hinhVideoCuaToi> & { nnGoc: NnVideo | null };

/** Làm thật (đã giữ khoá `dangChay`). `bao` cập nhật bước cho màn tiến trình. */
async function themDaNguThat(
  userId: number,
  nguon: NguonVideo, videoId: string,
  o: { nn: NnVideo | 'auto'; nhomLon?: string },
  bao: (b: BuocThem) => void,
): Promise<KetQuaThem> {
  const thuMuc = await fs.mkdtemp(path.join(os.tmpdir(), 'ytsub-'));
  try {
    bao('doc_thong_tin');
    const url = urlChuan(nguon, videoId);
    try {
      await execFileAsync(YT_DLP, [
        '--skip-download', '--no-simulate', '--no-playlist', '--no-warnings', '--write-info-json',
        '--socket-timeout', '20', '--retries', '2', '-o', path.join(thuMuc, 'v'), url,
      ], { timeout: 120_000, maxBuffer: 8 * 1024 * 1024 });
    } catch (e) {
      throw new BadRequestError(cauLoiYtDlp(e));
    }
    const files = await fs.readdir(thuMuc);
    const infoF = files.find((f) => f.endsWith('.info.json'));
    if (!infoF) throw new BadRequestError('Không đọc được thông tin video (link riêng tư hoặc đã bị gỡ?)');
    const duongInfo = path.join(thuMuc, infoF);
    const info = JSON.parse(await fs.readFile(duongInfo, 'utf8')) as Record<string, unknown>;
    const giay = typeof info.duration === 'number' ? Math.round(info.duration) : null;
    if (giay && giay > TRAN_GIAY) throw new BadRequestError('Video dài hơn 4 tiếng — chưa nhận');

    bao('chon_phu_de');
    const { chon, nnGoc } = chonTrack({
      language: (info.language as string | null) ?? null,
      title: (info.title as string | null) ?? null,
      subtitles: (info.subtitles as Record<string, unknown> | null) ?? null,
      automatic_captions: (info.automatic_captions as Record<string, unknown> | null) ?? null,
    }, o.nn);
    if (!chon) {
      if (o.nn !== 'auto') {
        const them = nnGoc && nnGoc !== o.nn ? ` (video nói ${TEN_NN_VIDEO[nnGoc]} — chọn “${TEN_NN_VIDEO[nnGoc]}” hoặc “Tự nhận”)` : '';
        throw new BadRequestError(`Video không có phụ đề ${TEN_NN_VIDEO[o.nn]}${them}.`);
      }
      throw new BadRequestError('Không tìm thấy phụ đề tiếng Anh, Nhật hay Trung trong video này (kể cả phụ đề tự động).');
    }

    bao('tai_phu_de');
    try {
      await execFileAsync(YT_DLP, [
        '--load-info-json', duongInfo, '--skip-download', '--no-simulate', '--no-warnings',
        chon.tuDong ? '--write-auto-subs' : '--write-subs', '--sub-langs', regexMa(chon.ma),
        '--sub-format', 'vtt/srt/best', '--socket-timeout', '20', '--retries', '2',
        '-o', path.join(thuMuc, 's'),
      ], { timeout: 120_000, maxBuffer: 8 * 1024 * 1024 });
    } catch (e) {
      throw new BadRequestError(cauLoiYtDlp(e));
    }
    const subF = (await fs.readdir(thuMuc)).find((f) => f.startsWith('s.') && /\.(vtt|srt)$/i.test(f));
    if (!subF) throw new BadRequestError('Tải phụ đề không thành công (định dạng chưa hỗ trợ) — thử video khác nhé.');
    const tho = await fs.readFile(path.join(thuMuc, subF), 'utf8');

    bao('lam_sach');
    const { cues, soTu } = chon.nn === 'en'
      ? lamSachVtt(chuanHoaMoc(tho))
      : lamSachCjk(tho, { nn: chon.nn, tuDong: chon.tuDong });
    if (soTu < (chon.nn === 'en' ? TOI_THIEU_TU : TOI_THIEU_CHU_CJK) || !cues.length) {
      throw new BadRequestError('Phụ đề của video này quá ngắn để học');
    }

    bao('luu');
    const ma = String(info.id ?? '') || videoId;
    if (nguon === 'youtube' ? !/^[A-Za-z0-9_-]{11}$/.test(ma) : !/^\d{8,24}$/.test(ma)) {
      throw new BadRequestError('Mã video không hợp lệ');
    }
    const tieuDe = String(info.title ?? 'Video');
    const theLoai = Array.isArray(info.categories) ? (info.categories as string[]) : [];
    const nhom = o.nhomLon && MA_NHOM_LON.has(o.nhomLon) ? o.nhomLon : nhomLonTuTheLoai(theLoai);
    const tacGia = (info.uploader ?? info.channel ?? info.creator ?? null) as string | null;
    const ghi = {
      nhomLon: nhom,
      tieuDe: tieuDe.slice(0, 300),
      tacGia: tacGia ? String(tacGia).slice(0, 200) : null,
      anhBia: info.thumbnail ? String(info.thumbnail).slice(0, 600) : null,
      giay,
      cues: cues as unknown as object,
      soCau: cues.length,
      soTu,
      lang: chon.nn,
      trackGoc: chon.ma.slice(0, 24),
      tuDong: chon.tuDong,
    };
    // Thêm lại video đã có: phụ đề đổi (khác ngôn ngữ / YouTube sửa) ⇒ bỏ bản dịch cũ (lệch câu là dịch SAI câu).
    const cu = await prisma.videoNguoiDung.findUnique({
      where: { uk_video_nguoi_dung: { userId, nguon, videoId: ma } },
      select: { cues: true, lang: true },
    });
    const giuDich = !!cu && cu.lang === chon.nn && JSON.stringify(cu.cues) === JSON.stringify(cues);
    const hang = await prisma.videoNguoiDung.upsert({
      where: { uk_video_nguoi_dung: { userId, nguon, videoId: ma } },
      create: { userId, nguon, videoId: ma, ...ghi },
      update: giuDich ? ghi : { ...ghi, dichVi: Prisma.DbNull, soDich: 0 },
      select: CHON_VIDEO,
    });
    logger.info(`[video] ${userId} thêm ${nguon}:${ma} (${chon.nn}, ${chon.ma}${chon.tuDong ? ', tự động' : ''}) — ${cues.length} câu`);
    return { ...hinhVideoCuaToi(hang), nnGoc };
  } finally {
    await fs.rm(thuMuc, { recursive: true, force: true }).catch(() => {});
  }
}

// ── Hàng đợi ──────────────────────────────────────────────────────

type ViecThem = {
  ma: string; userId: number; nguon: NguonVideo; videoId: string;
  nn: NnVideo | 'auto'; nhomLon?: string;
  buoc: BuocThem; loi?: string; video?: KetQuaThem;
  taoLuc: number; capNhat: number;
};
const dsViec = new Map<string, ViecThem>();
const hangCho: string[] = [];
let dangXuLy = false;

function donViecCu(bayGio = Date.now()) {
  for (const [k, v] of dsViec) if (bayGio - v.capNhat > GIU_VIEC_MS) dsViec.delete(k);
}

function hinhViec(v: ViecThem) {
  const viTri = v.buoc === 'xep_hang' ? hangCho.indexOf(v.ma) + 1 : 0;
  return { ma: v.ma, buoc: v.buoc, viTri, loi: v.loi ?? null, video: v.video ?? null };
}

/** Gửi một link vào hàng. Kiểm link NGAY (link hỏng ⇒ 400 tức thì, không phải chờ hàng). */
export function guiViecThem(userId: number, url: string, o: { nn?: string; nhomLon?: string }) {
  donViecCu();
  const nn: NnVideo | 'auto' = laNnVideo(o.nn) ? o.nn : 'auto';
  const { nguon, videoId } = phanTichUrl(url, { choTikTok: true });
  const dangCho = [...dsViec.values()].filter((v) => v.userId === userId && !['xong', 'loi'].includes(v.buoc));
  if (dangCho.length >= TRAN_VIEC_MOT_NGUOI) {
    throw new BadRequestError('Bạn đang thêm 3 video rồi — đợi xong một video nhé.');
  }
  const trung = dangCho.find((v) => v.nguon === nguon && v.videoId === videoId);
  if (trung) return hinhViec(trung);
  const v: ViecThem = {
    ma: randomUUID(), userId, nguon, videoId, nn,
    nhomLon: o.nhomLon && MA_NHOM_LON.has(o.nhomLon) ? o.nhomLon : undefined,
    buoc: 'xep_hang', taoLuc: Date.now(), capNhat: Date.now(),
  };
  dsViec.set(v.ma, v);
  hangCho.push(v.ma);
  void chayHang();
  return hinhViec(v);
}

/** Trạng thái một việc — CHỈ người gửi xem được (mã việc khác người ⇒ như không có). */
export function xemViecThem(userId: number, ma: string) {
  const v = dsViec.get(ma);
  if (!v || v.userId !== userId) throw new NotFoundError('Không còn việc thêm video này — thử thêm lại nhé.');
  return hinhViec(v);
}

const ngu = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function chayHang(): Promise<void> {
  if (dangXuLy) return;
  dangXuLy = true;
  try {
    while (hangCho.length) {
      // Đường cũ (app CuongThai) đang chạy yt-dlp ⇒ chờ lượt.
      if (dangChay) { await ngu(800); continue; }
      const ma = hangCho.shift()!;
      const v = dsViec.get(ma);
      if (!v) continue;
      dangChay = true;
      const bao = (b: BuocThem) => { v.buoc = b; v.capNhat = Date.now(); };
      try {
        v.video = await themDaNguThat(v.userId, v.nguon, v.videoId, { nn: v.nn, nhomLon: v.nhomLon }, bao);
        bao('xong');
      } catch (e) {
        v.loi = e instanceof BadRequestError ? e.message : 'Có lỗi khi thêm video — thử lại sau nhé.';
        if (!(e instanceof BadRequestError)) logger.warn('[video] thêm đa ngữ lỗi', { error: (e as Error)?.message });
        bao('loi');
      } finally {
        dangChay = false;
      }
    }
  } finally {
    dangXuLy = false;
  }
}

/** Thư viện "Của tôi" theo ngôn ngữ (CT Language). */
export async function videoCuaToiTheoNn(userId: number, nn: NnVideo) {
  const ds = await prisma.videoNguoiDung.findMany({ where: { userId, lang: nn }, select: CHON_VIDEO, orderBy: { createdAt: 'desc' } });
  return ds.map(hinhVideoCuaToi);
}

/** Dùng trong test: xoá hàng đợi. */
export function _xoaHangThem() { dsViec.clear(); hangCho.length = 0; }
export { nnTuMa };
