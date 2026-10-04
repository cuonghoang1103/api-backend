/**
 * ============================================================
 * BẢNG XẾP HẠNG NHẠC — Top 100 VN (Apple Music) + Thịnh hành YouTube
 * ============================================================
 *
 * ─── Nguồn ───
 *  • Top 100: RSS công khai của Apple Music, không cần khoá —
 *    `rss.applemarketingtools.com/api/v2/vn/music/most-played/100/songs.json`
 *    (có chuyển hướng, `fetch` tự theo). Trả 100 bài + `updated`.
 *  • Thịnh hành: YouTube Data API `videos.list?chart=mostPopular&videoCategoryId=10
 *    &regionCode=VN` — 1 đơn vị quota/lần, nhưng chỉ trả tối đa ~30 bài nhạc.
 *
 * ─── Ghép bài Apple ↔ video YouTube: tiết kiệm quota ───
 * `search.list` tốn **100 đơn vị** (quota cả ngày 10.000). Tìm cả 100 bài mỗi
 * ngày là 10.000 đơn vị — hết sạch quota chỉ vì một bảng. Nên:
 *   • chỉ tìm cho bài MỚI vào bảng (cron, tối đa `GHEP_MOI_NGAY` bài/ngày),
 *     hoặc khi người dùng bấm phát lần đầu (trần `TRAN_TIM_THEO_YEU_CAU`/ngày);
 *   • kết quả ghép lưu CỐ ĐỊNH theo id bài của Apple — bài nằm bảng 30 ngày chỉ
 *     tốn đúng một lần tìm.
 *
 * ─── Lưu ở đâu ───
 * Bảng `app_settings` (khoá/giá trị JSON) có sẵn — KHÔNG cần migration. Hai khoá:
 * bảng xếp hạng (ghi đè mỗi ngày) và bản đồ ghép (chỉ thêm, cắt bớt khi quá to).
 *
 * ⛔ Không tải, không rút âm thanh từ YouTube. App phát bằng trình nhúng chính
 * thức (`/nhung-video`) — xem `desktop/.../academy/KhungVideo.tsx`.
 */
import { prisma } from '../config/database.js';
import { config } from '../config/env.js';
import { logger } from '../utils/logger.js';

const KHOA_BXH = 'music.charts.v1';
const KHOA_GHEP = 'music.charts.videoMap.v1';
const APPLE_RSS = 'https://rss.applemarketingtools.com/api/v2/vn/music/most-played/100/songs.json';
/** Bảng cũ hơn mức này thì lời gọi đọc tự làm mới (phòng khi cron chưa chạy). */
const TUOI_TOI_DA_MS = 26 * 60 * 60 * 1000;
/** Cron: mỗi ngày tìm video cho tối đa bấy nhiêu bài MỚI vào bảng (×100 đơn vị). */
const GHEP_MOI_NGAY = 20;
/** Tìm theo yêu cầu (người dùng bấm phát bài chưa ghép) — trần mỗi ngày. */
const TRAN_TIM_THEO_YEU_CAU = 40;
/** Bản đồ ghép giữ tối đa bấy nhiêu mục (bài cũ rơi khỏi bảng lâu rồi thì bỏ). */
const GHEP_TOI_DA = 1500;

export interface BaiXepHang {
  hang: number;
  id: string;          // id bài của Apple
  ten: string;
  ngheSi: string;
  anh: string;
  theLoai: string[];
  phatHanh: string | null;
}
export interface VideoThinhHanh {
  hang: number;
  videoId: string;
  ten: string;
  kenh: string;
  anh: string;
  thoiLuong: number | null;
}
interface BangLuu {
  layLuc: string;
  appleCapNhat: string | null;
  top100: BaiXepHang[];
  thinhHanh: VideoThinhHanh[];
}
interface Ghep { videoId: string | null; tieuDe?: string; luc: string }

async function docKhoa<T>(khoa: string): Promise<T | null> {
  const row = await prisma.appSetting.findUnique({ where: { key: khoa } });
  if (!row?.value) return null;
  try { return JSON.parse(row.value) as T; } catch { return null; }
}
async function ghiKhoa(khoa: string, gia: unknown): Promise<void> {
  const value = JSON.stringify(gia);
  await prisma.appSetting.upsert({ where: { key: khoa }, create: { key: khoa, value }, update: { value } });
}

/** "PT3M45S" → 225 giây. */
function giayISO(s: string | undefined): number | null {
  const m = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/.exec(s ?? '');
  if (!m) return null;
  return Number(m[1] ?? 0) * 3600 + Number(m[2] ?? 0) * 60 + Number(m[3] ?? 0);
}

async function layApple(): Promise<{ capNhat: string | null; ds: BaiXepHang[] }> {
  const r = await fetch(APPLE_RSS, { redirect: 'follow', signal: AbortSignal.timeout(15_000) });
  if (!r.ok) throw new Error(`Apple RSS ${r.status}`);
  const j = (await r.json()) as { feed?: { updated?: string; results?: Array<Record<string, unknown>> } };
  const ds = (j.feed?.results ?? []).map((x, i) => ({
    hang: i + 1,
    id: String(x.id ?? ''),
    ten: String(x.name ?? ''),
    ngheSi: String(x.artistName ?? ''),
    // 100×100 quá nhỏ cho thẻ; CDN của Apple nhận cỡ khác trong chính đường dẫn.
    anh: String(x.artworkUrl100 ?? '').replace(/\/\d+x\d+bb\.(jpg|png)$/, '/300x300bb.$1'),
    theLoai: Array.isArray(x.genres) ? (x.genres as Array<{ name?: string }>).map((g) => g.name ?? '').filter((g) => g && g !== 'Music') : [],
    phatHanh: typeof x.releaseDate === 'string' ? x.releaseDate : null,
  })).filter((b) => b.id && b.ten);
  return { capNhat: j.feed?.updated ?? null, ds };
}

async function layThinhHanhYT(): Promise<VideoThinhHanh[]> {
  const key = config.youtubeApiKey;
  if (!key) return [];
  const u = new URL('https://www.googleapis.com/youtube/v3/videos');
  u.searchParams.set('part', 'snippet,contentDetails');
  u.searchParams.set('chart', 'mostPopular');
  u.searchParams.set('videoCategoryId', '10');
  u.searchParams.set('regionCode', 'VN');
  u.searchParams.set('maxResults', '50');
  u.searchParams.set('key', key);
  const r = await fetch(u, { signal: AbortSignal.timeout(15_000) });
  if (!r.ok) throw new Error(`YouTube chart ${r.status}`);
  const j = (await r.json()) as { items?: Array<{ id: string; snippet?: { title?: string; channelTitle?: string; thumbnails?: Record<string, { url?: string }> }; contentDetails?: { duration?: string } }> };
  return (j.items ?? []).map((v, i) => ({
    hang: i + 1,
    videoId: v.id,
    ten: v.snippet?.title ?? '',
    kenh: v.snippet?.channelTitle ?? '',
    anh: v.snippet?.thumbnails?.high?.url ?? v.snippet?.thumbnails?.medium?.url ?? '',
    thoiLuong: giayISO(v.contentDetails?.duration),
  }));
}

// ─── Đếm lượt tìm theo yêu cầu trong ngày (bộ nhớ tiến trình — đủ cho 1 máy) ───
let ngayDem = '';
let soLanTim = 0;
function conLuotTim(): boolean {
  const hom = new Date().toISOString().slice(0, 10);
  if (hom !== ngayDem) { ngayDem = hom; soLanTim = 0; }
  return soLanTim < TRAN_TIM_THEO_YEU_CAU;
}

/** Một lần `search.list` (100 đơn vị). Trả videoId hoặc null nếu không thấy. */
async function timVideo(bai: Pick<BaiXepHang, 'ten' | 'ngheSi'>): Promise<{ videoId: string | null; tieuDe?: string }> {
  const key = config.youtubeApiKey;
  if (!key) throw Object.assign(new Error('YouTube API key chưa cấu hình'), { code: 'NO_KEY' });
  const u = new URL('https://www.googleapis.com/youtube/v3/search');
  u.searchParams.set('part', 'snippet');
  u.searchParams.set('q', `${bai.ten} ${bai.ngheSi}`);
  u.searchParams.set('type', 'video');
  u.searchParams.set('videoCategoryId', '10');
  u.searchParams.set('videoEmbeddable', 'true');
  u.searchParams.set('regionCode', 'VN');
  u.searchParams.set('maxResults', '1');
  u.searchParams.set('key', key);
  const r = await fetch(u, { signal: AbortSignal.timeout(15_000) });
  if (!r.ok) throw Object.assign(new Error(`YouTube search ${r.status}`), { code: r.status === 403 ? 'QUOTA' : 'YT' });
  const j = (await r.json()) as { items?: Array<{ id?: { videoId?: string }; snippet?: { title?: string } }> };
  const dau = j.items?.[0];
  return { videoId: dau?.id?.videoId ?? null, tieuDe: dau?.snippet?.title };
}

let dangLamMoi: Promise<BangLuu> | null = null;

/** Lấy bảng mới từ hai nguồn, lưu, rồi ghép video cho bài MỚI vào bảng. Cron gọi mỗi sáng. */
export async function capNhatBangXepHang(ghepToiDa = GHEP_MOI_NGAY): Promise<BangLuu> {
  if (dangLamMoi) return dangLamMoi;
  dangLamMoi = (async () => {
    const cu = await docKhoa<BangLuu>(KHOA_BXH);
    const [apple, yt] = await Promise.allSettled([layApple(), layThinhHanhYT()]);
    const bang: BangLuu = {
      layLuc: new Date().toISOString(),
      appleCapNhat: apple.status === 'fulfilled' ? apple.value.capNhat : cu?.appleCapNhat ?? null,
      // Một nguồn hỏng thì GIỮ bản hôm qua của nguồn đó, không ghi đè bằng mảng rỗng.
      top100: apple.status === 'fulfilled' && apple.value.ds.length ? apple.value.ds : cu?.top100 ?? [],
      thinhHanh: yt.status === 'fulfilled' && yt.value.length ? yt.value : cu?.thinhHanh ?? [],
    };
    if (apple.status === 'rejected') logger.warn('[music-charts] Apple RSS lỗi', { error: String(apple.reason) });
    if (yt.status === 'rejected') logger.warn('[music-charts] YouTube chart lỗi', { error: String(yt.reason) });
    await ghiKhoa(KHOA_BXH, bang);

    // Ghép video cho bài chưa từng ghép, ưu tiên hạng cao. Hết quota thì dừng êm.
    if (ghepToiDa > 0 && config.youtubeApiKey) {
      const ghep = (await docKhoa<Record<string, Ghep>>(KHOA_GHEP)) ?? {};
      let da = 0;
      for (const b of bang.top100) {
        if (da >= ghepToiDa) break;
        if (ghep[b.id]) continue;
        try {
          const kq = await timVideo(b);
          ghep[b.id] = { ...kq, luc: new Date().toISOString() };
          da++;
        } catch (e) {
          logger.warn('[music-charts] ghép video dừng', { error: (e as Error).message });
          break;
        }
      }
      if (da) await ghiKhoa(KHOA_GHEP, catGhep(ghep, bang.top100));
      logger.info('[music-charts] đã cập nhật', { top100: bang.top100.length, thinhHanh: bang.thinhHanh.length, ghepMoi: da });
    }
    return bang;
  })().finally(() => { dangLamMoi = null; });
  return dangLamMoi;
}

/** Giữ bản đồ ghép gọn: bài đang trong bảng luôn giữ, còn lại giữ mới nhất. */
function catGhep(ghep: Record<string, Ghep>, top: BaiXepHang[]): Record<string, Ghep> {
  const ids = Object.keys(ghep);
  if (ids.length <= GHEP_TOI_DA) return ghep;
  const trongBang = new Set(top.map((b) => b.id));
  const giu = ids
    .sort((a, b) => (trongBang.has(b) ? 1 : 0) - (trongBang.has(a) ? 1 : 0) || (ghep[b]!.luc > ghep[a]!.luc ? 1 : -1))
    .slice(0, GHEP_TOI_DA);
  return Object.fromEntries(giu.map((id) => [id, ghep[id]!]));
}

export interface BangTraVe {
  layLuc: string;
  appleCapNhat: string | null;
  top100: Array<BaiXepHang & { videoId: string | null; daGhep: boolean }>;
  thinhHanh: VideoThinhHanh[];
}

/** Bảng cho client — kèm videoId nếu đã ghép. Bảng quá cũ (cron chưa chạy) thì làm mới. */
export async function layBangXepHang(): Promise<BangTraVe> {
  let bang = await docKhoa<BangLuu>(KHOA_BXH);
  if (!bang || Date.now() - new Date(bang.layLuc).getTime() > TUOI_TOI_DA_MS) {
    // Lời gọi của người dùng KHÔNG đốt quota ghép — chỉ cron làm việc đó.
    try { bang = await capNhatBangXepHang(0); } catch (e) {
      logger.warn('[music-charts] làm mới khi đọc lỗi', { error: (e as Error).message });
    }
  }
  const ghep = (await docKhoa<Record<string, Ghep>>(KHOA_GHEP)) ?? {};
  return {
    layLuc: bang?.layLuc ?? new Date().toISOString(),
    appleCapNhat: bang?.appleCapNhat ?? null,
    top100: (bang?.top100 ?? []).map((b) => ({ ...b, videoId: ghep[b.id]?.videoId ?? null, daGhep: Boolean(ghep[b.id]) })),
    thinhHanh: bang?.thinhHanh ?? [],
  };
}

/** Video cho một bài trong bảng — tìm MỘT lần rồi nhớ mãi. */
export async function videoChoBai(appleId: string): Promise<{ videoId: string | null }> {
  const ghep = (await docKhoa<Record<string, Ghep>>(KHOA_GHEP)) ?? {};
  if (ghep[appleId]) return { videoId: ghep[appleId]!.videoId };
  const bang = await docKhoa<BangLuu>(KHOA_BXH);
  const bai = bang?.top100.find((b) => b.id === appleId);
  if (!bai) throw Object.assign(new Error('Bài không có trong bảng xếp hạng hiện tại'), { code: 'NOT_FOUND' });
  if (!conLuotTim()) throw Object.assign(new Error('Đã hết lượt tìm video hôm nay — mai thử lại'), { code: 'QUOTA' });
  soLanTim++;
  const kq = await timVideo(bai);
  // Đọc lại trước khi ghi: cron hoặc người khác có thể vừa thêm mục khác.
  const moi = (await docKhoa<Record<string, Ghep>>(KHOA_GHEP)) ?? {};
  moi[appleId] = { ...kq, luc: new Date().toISOString() };
  await ghiKhoa(KHOA_GHEP, catGhep(moi, bang?.top100 ?? []));
  return { videoId: kq.videoId };
}

/** Bỏ dấu, thường hoá — để so tên nghệ sĩ "Sơn Tùng M-TP" với "son tung m-tp". */
function gap(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/gi, 'd').toLowerCase().trim();
}

/**
 * GỢI Ý theo gu — KHÔNG dùng AI: lấy nghệ sĩ trong lịch sử nghe + bài đã thích
 * của người dùng, rồi chọn những bài trong Top 100 / Thịnh hành có nghệ sĩ đó.
 * Thiếu thì bù bằng bài hạng cao nhất. Trả kèm lý do để giao diện nói thật vì
 * sao một bài được gợi ý.
 */
export async function goiYChoNguoiDung(userId: number): Promise<{ ngheSiGu: string[]; ds: Array<{ loai: 'top' | 'yt'; id: string; ten: string; ngheSi: string; anh: string; videoId: string | null; lyDo: string }> }> {
  const [lichSu, thich, bang] = await Promise.all([
    prisma.musicHistory.findMany({ where: { userId }, orderBy: { playedAt: 'desc' }, take: 60, select: { track: { select: { artist: true } } } }),
    prisma.musicLike.findMany({ where: { userId }, take: 100, select: { track: { select: { artist: true } } } }),
    layBangXepHang(),
  ]);
  const dem = new Map<string, { ten: string; n: number }>();
  for (const r of [...lichSu, ...thich, ...thich]) {   // thích tính gấp đôi
    const a = r.track?.artist?.trim();
    if (!a) continue;
    for (const ten of a.split(/,|&| ft\.? | feat\.? | x /i).map((x) => x.trim()).filter((x) => x.length > 1)) {
      const k = gap(ten);
      const cu = dem.get(k);
      dem.set(k, { ten, n: (cu?.n ?? 0) + 1 });
    }
  }
  const ngheSiGu = [...dem.values()].sort((a, b) => b.n - a.n).slice(0, 12);
  const ds: Array<{ loai: 'top' | 'yt'; id: string; ten: string; ngheSi: string; anh: string; videoId: string | null; lyDo: string }> = [];
  const daCo = new Set<string>();
  const hop = (chu: string) => ngheSiGu.find((a) => gap(chu).includes(gap(a.ten)));
  for (const b of bang.top100) {
    const a = hop(b.ngheSi);
    if (a && !daCo.has(b.id)) { daCo.add(b.id); ds.push({ loai: 'top', id: b.id, ten: b.ten, ngheSi: b.ngheSi, anh: b.anh, videoId: b.videoId, lyDo: `Bạn hay nghe ${a.ten} · #${b.hang} Top 100` }); }
  }
  for (const v of bang.thinhHanh) {
    const a = hop(`${v.kenh} ${v.ten}`);
    if (a && !daCo.has(v.videoId)) { daCo.add(v.videoId); ds.push({ loai: 'yt', id: v.videoId, ten: v.ten, ngheSi: v.kenh, anh: v.anh, videoId: v.videoId, lyDo: `Bạn hay nghe ${a.ten} · đang thịnh hành` }); }
  }
  for (const b of bang.top100) {
    if (ds.length >= 24) break;
    if (!daCo.has(b.id)) { daCo.add(b.id); ds.push({ loai: 'top', id: b.id, ten: b.ten, ngheSi: b.ngheSi, anh: b.anh, videoId: b.videoId, lyDo: `#${b.hang} Top 100 Việt Nam hôm nay` }); }
  }
  return { ngheSiGu: ngheSiGu.map((a) => a.ten), ds: ds.slice(0, 24) };
}
