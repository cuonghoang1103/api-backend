/**
 * 📷 Sách gốc — ảnh từng trang sách giáo trình, CHỈ tài khoản được phép xem.
 * ─────────────────────────────────────────────────────────────────────────
 * Người dùng (29/09/2026): "phần ảnh sách đầy đủ và hướng dẫn + AI hướng dẫn
 * học chi tiết đúng cái trang sách đó, MỖI MÌNH XEM cũng được". Sách có bản
 * quyền còn web công khai, nên:
 *
 *  - Ảnh + hướng dẫn KHÔNG nằm trong repo, frontend/public hay URL công khai.
 *    Chúng nằm trên R2 ở tiền tố `rieng/sach/dekiru/`, MÃ HOÁ (maHoa.ts) — vì
 *    bucket được CDN phục vụ công khai theo tên khoá.
 *  - Mọi byte đi qua backend (proxy), không phát URL ký sẵn: URL ký lộ tên
 *    khoá, mà tên khoá + CDN công khai = tải được mãi.
 *  - Quyền: id nằm trong `SACH_RIENG_USER_IDS` (phẩy ngăn cách) HOẶC tài khoản
 *    có vai trò ADMIN. Người khác nhận 403, và web không hiện mục này.
 *
 * Dữ liệu dựng bằng scripts/sach-rieng/ (xuất ảnh → AI soạn hướng dẫn → mã
 * hoá + tải lên). Thiếu `SACH_RIENG_KHOA` hoặc R2 thì tính năng tắt êm.
 */
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { prisma } from '../../config/database.js';
import { config } from '../../config/env.js';
import { getR2Client } from '../../config/r2.js';
import { BadRequestError, ForbiddenError, NotFoundError } from '../../middleware/errorHandler.js';
import { logger } from '../../utils/logger.js';
import { visionComplete } from '../docTools/vision.js';
import { isAiAvailable } from '../interview/llm/index.js';
import { giaiMa, khoaTuEnv } from './maHoa.js';
import { BAI_CUA_TRANG, POINT_CUA_BAI, SO_TRANG, trangCuaBai, type HuongDanTrang } from './dekiru.js';

export const TIEN_TO = 'rieng/sach/dekiru/';
export const khoaR2 = {
  trang: (p: number) => `${TIEN_TO}trang/p-${String(p).padStart(3, '0')}.bin`,
  nho: (p: number) => `${TIEN_TO}nho/p-${String(p).padStart(3, '0')}.bin`,
  huongDan: `${TIEN_TO}huong-dan.bin`,
};

/* ── Quyền ──────────────────────────────────────────────────────────── */

function idDuocPhep(): Set<number> {
  return new Set(
    String(process.env.SACH_RIENG_USER_IDS ?? '')
      .split(/[,\s]+/)
      .map((x) => Number(x))
      .filter((x) => Number.isInteger(x) && x > 0),
  );
}

export function daBat(): boolean {
  return config.r2.enabled && !!khoaTuEnv();
}

const nhoQuyen = new Map<number, { co: boolean; den: number }>();

/** Có được xem sách riêng không. Hỏi DB vai trò (không tin `roles` trong JWT), nhớ 60 giây. */
export async function coQuyen(userId: number | undefined): Promise<boolean> {
  if (!userId) return false;
  if (idDuocPhep().has(userId)) return true;
  const n = nhoQuyen.get(userId);
  if (n && n.den > Date.now()) return n.co;
  const u = await prisma.user.findUnique({
    where: { id: userId },
    select: { roles: { select: { role: { select: { name: true } } } } },
  });
  const co = !!u?.roles.some((r) => r.role.name.toUpperCase().replace(/^ROLE_/, '') === 'ADMIN');
  nhoQuyen.set(userId, { co, den: Date.now() + 60_000 });
  return co;
}

export async function chanNeuKhongCoQuyen(userId: number | undefined): Promise<void> {
  if (!(await coQuyen(userId))) throw new ForbiddenError('Mục này chỉ dành cho tài khoản được phép.');
  if (!daBat()) throw new NotFoundError('Sách gốc chưa được bật trên máy chủ (thiếu SACH_RIENG_KHOA hoặc R2).');
}

/* ── Đọc R2 + giải mã, có đệm nhỏ trong bộ nhớ ─────────────────────── */

const dem = new Map<string, Buffer>();
const DEM_TOI_DA = 48; // ~12MB ảnh trang

async function docR2(key: string): Promise<Buffer | null> {
  const hit = dem.get(key);
  if (hit) {
    dem.delete(key);
    dem.set(key, hit);
    return hit;
  }
  const khoa = khoaTuEnv();
  if (!khoa) return null;
  try {
    const res = await getR2Client().send(new GetObjectCommand({ Bucket: config.r2.bucketName, Key: key }));
    const goi = Buffer.from(await res.Body!.transformToByteArray());
    const du = giaiMa(goi, khoa);
    dem.set(key, du);
    while (dem.size > DEM_TOI_DA) dem.delete(dem.keys().next().value!);
    return du;
  } catch (e) {
    const ten = (e as { name?: string }).name;
    if (ten === 'NoSuchKey' || ten === 'NotFound') return null;
    logger.warn('sachRieng: đọc R2 hỏng', { key, error: (e as Error).message });
    throw e;
  }
}

export function kiemTrang(raw: unknown): number {
  const p = Number(raw);
  if (!Number.isInteger(p) || p < 1 || p > SO_TRANG) throw new BadRequestError(`Trang phải từ 1 đến ${SO_TRANG}`);
  return p;
}

export async function anhTrang(p: number, nho: boolean): Promise<Buffer> {
  const b = await docR2(nho ? khoaR2.nho(p) : khoaR2.trang(p));
  if (!b) throw new NotFoundError(`Chưa có ảnh trang ${p}`);
  return b;
}

let huongDanDem: { luc: number; ds: Map<number, HuongDanTrang> } | null = null;

async function tatCaHuongDan(): Promise<Map<number, HuongDanTrang>> {
  if (huongDanDem && Date.now() - huongDanDem.luc < 10 * 60_000) return huongDanDem.ds;
  const b = await docR2(khoaR2.huongDan);
  const ds = new Map<number, HuongDanTrang>();
  if (b) for (const h of JSON.parse(b.toString('utf8')) as HuongDanTrang[]) ds.set(h.trang, h);
  // Bỏ khỏi đệm ảnh để lần đọc sau (sau khi tải lên bản mới) lấy lại từ R2.
  dem.delete(khoaR2.huongDan);
  huongDanDem = { luc: Date.now(), ds };
  return ds;
}

export async function huongDanTrang(p: number): Promise<HuongDanTrang | null> {
  return (await tatCaHuongDan()).get(p) ?? null;
}

/** Mục lục: bài → khoảng trang + mục của từng trang (không kèm nội dung hướng dẫn). */
export async function mucLuc() {
  const hd = await tatCaHuongDan();
  const trang = [];
  for (let p = 1; p <= SO_TRANG; p++) {
    const h = hd.get(p);
    const point = [...new Set((h?.nguPhap ?? []).map((g) => g.point).filter((x): x is number => typeof x === 'number'))];
    trang.push({ p, bai: BAI_CUA_TRANG(p).bai, muc: h?.muc ?? [], tinCay: h?.tinCay ?? null, coHuongDan: !!h, point });
  }
  return {
    soTrang: SO_TRANG,
    bai: Object.keys(POINT_CUA_BAI).map((k) => {
      const n = Number(k);
      const [tu, den] = trangCuaBai(n);
      return { n, tu, den, point: POINT_CUA_BAI[n] };
    }),
    phan: [
      { ten: 'Phần đầu sách', tu: 1, den: 14 },
      { ten: 'ポイント一覧 — Ngữ pháp', tu: 270, den: 281 },
      { ten: '表 — Bảng', tu: 282, den: 289 },
      { ten: '索引 — Tra từ', tu: 290, den: 304 },
    ],
    trang,
  };
}

/* ── Gia sư AI theo trang (model NHÌN ảnh trang) ─────────────────────── */

const DAN: Record<string, string> = {
  giang: 'Giảng TRANG SÁCH này cho người mới bắt đầu, như cô giáo ngồi cạnh: đi lần lượt từng phần trên trang (từ trên xuống), dịch câu tiếng Nhật, chỉ ra mẫu ngữ pháp và từ cần nhớ, và nói phải làm gì ở phần bài tập.',
  huongdan: 'Hướng dẫn cách HỌC trang này: làm gì trước, làm gì sau, mỗi bước bao lâu, luyện nói/nghe thế nào, và cách tự kiểm tra. Danh sách đánh số, tối đa 7 bước.',
  vidu: 'Cho 5 câu ví dụ MỚI dùng đúng mẫu câu và từ của trang này (không chép câu trên trang), mỗi câu có romaji và nghĩa.',
  kiemtra: 'Ra 3–5 câu hỏi kiểm tra người học đã nắm trang này chưa (có câu nhìn tranh trên trang để trả lời). Câu hỏi trước; đáp án để riêng cuối dưới dòng "**Đáp án**".',
};
export const CAC_Y_TRANG = Object.keys(DAN);

export async function hoiTrang(
  userId: number,
  b: { trang?: unknown; y?: unknown; cauHoi?: unknown; lichSu?: unknown; chu?: unknown },
) {
  const p = kiemTrang(b.trang);
  const y = String(b.y ?? '');
  const tuHoi = String(b.cauHoi ?? '').trim().slice(0, 500);
  const dan = DAN[y];
  if (!dan && !tuHoi) throw new BadRequestError('Thiếu `y` hợp lệ hoặc `cauHoi`');
  if (!isAiAvailable()) return { traLoi: null, lyDo: 'ai_unavailable' as const };

  const anh = await anhTrang(p, false);
  const hd = await huongDanTrang(p);
  const lichSu = (Array.isArray(b.lichSu) ? b.lichSu : [])
    .slice(-3)
    .map((t) => ({ q: String((t as { q?: unknown })?.q ?? '').slice(0, 300), a: String((t as { a?: unknown })?.a ?? '').slice(0, 900) }))
    .filter((t) => t.q && t.a);
  const chu = String(b.chu ?? '').trim().slice(0, 400);

  const kq = await visionComplete({
    userId,
    maxTokens: 2400,
    timeoutMs: 150_000,
    maxRetries: 1,
    system: [
      'Bạn là gia sư TIẾNG NHẬT cho sinh viên Việt học giáo trình できる日本語 初級 (môn JPD113/JPD123), trình độ mới bắt đầu. Trả lời bằng TIẾNG VIỆT, ngắn và thẳng.',
      'Bạn được xem ẢNH một trang của sách. Bám đúng trang đó: nhắc tới tranh/số thứ tự/câu CÓ trên trang; không bịa nội dung không có.',
      'Mọi chữ Hán trong câu tiếng Nhật kèm cách đọc ngay sau, dạng 漢字(かんじ). Câu ví dụ viết: `- *câu tiếng Nhật* (romaji) → nghĩa tiếng Việt`.',
      'Giải thích ngữ pháp bằng công thức rõ (vd `N1 は N2 です`), nói rõ trợ từ và lỗi người Việt hay mắc. Không dùng IPA.',
      dan ?? 'Trả lời đúng câu người học hỏi về trang này, rõ ràng, tối đa 12 câu.',
      'Không mở bài, không chúc, không nhắc lại câu hỏi.',
      'Định dạng markdown: tiêu đề nhỏ `### ` (tối đa 3), gạch đầu dòng ngắn, **đậm** từ khoá, bảng markdown khi so sánh, mẹo đặt trong `> 💡 ...`.',
    ].join('\n'),
    userText: [
      `Trang ${p} (${BAI_CUA_TRANG(p).nhan}).`,
      hd ? `Ghi chú đã soạn cho trang này (có thể sai — ảnh là nguồn đúng):\n${JSON.stringify({ muc: hd.muc, tomTat: hd.tomTat, nguPhap: hd.nguPhap, tuMoi: hd.tuMoi?.slice(0, 20) }).slice(0, 3500)}` : '',
      lichSu.length ? `Các lượt hỏi trước:\n${lichSu.map((t) => `Hỏi: ${t.q}\nĐáp: ${t.a}`).join('\n---\n')}` : '',
      chu ? `Phần người học đang nói tới: "${chu}"` : '',
      tuHoi ? `Câu hỏi: ${tuHoi}` : `Yêu cầu: ${dan}`,
    ].filter(Boolean).join('\n\n'),
    images: [{ data: anh.toString('base64'), mediaType: 'image/webp' }],
  });
  return { traLoi: kq.text.trim() || null };
}
