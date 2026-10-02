/**
 * AI CHẤM BẰNG CHỨNG — `study_verify` (gpt-6-sol, nhìn được ảnh).
 *
 * Model chỉ ĐỀ NGHỊ: đạt/điểm/lỗi. Mã quyết định trạng thái (`ghiKetQua`:
 * đạt chỉ khi model nói đạt VÀ điểm ≥ 5). Mọi thứ model trả về đi qua `locKetQua`.
 *
 * Bằng chứng gom từ ba nguồn, không nguồn nào được tin mặc định:
 *   • chữ người học dán vào,
 *   • tệp đã lên R2 của CHÍNH web (ảnh ⇒ gửi kèm; tệp chữ/mã ⇒ đọc nội dung) —
 *     URL lạ bị bỏ qua, không tải hộ (SSRF),
 *   • link GitHub ⇒ đọc cây thư mục + vài tệp mã thật qua API công khai, để
 *     "nộp link repo trống" không qua mặt được.
 */
import sharp from 'sharp';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { prisma } from '../../config/database.js';
import { config } from '../../config/env.js';
import { getObjectText, getR2Client, keyFromUrl } from '../../config/r2.js';
import { AppError } from '../../middleware/errorHandler.js';
import { logger } from '../../utils/logger.js';
import { visionComplete, type VisionImage } from '../docTools/vision.js';
import { isProEffective } from '../pro.service.js';
import { isAdminUser } from '../games/game.service.js';
import { ghiKetQua, type KetQuaCham, type TepBangChung } from './hocTap.service.js';

// ─── Hạn mức ─────────────────────────────────────────────────────

const soLuot = (ten: string, macDinh: number) => {
  const n = Number(process.env[ten]);
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : macDinh;
};

/** Số lượt AI của /hoc-tap đã dùng hôm nay (chấm + soạn kế hoạch + nhận xét). */
async function daDungHomNay(userId: number): Promise<number> {
  const dau = new Date();
  dau.setUTCHours(dau.getUTCHours() - 24);
  return prisma.interviewLLMCallLog.count({ where: { userId, feature: 'hoc_tap', success: true, createdAt: { gte: dau } } });
}

export async function hanMucAI(userId: number) {
  const [admin, pro, daDung] = await Promise.all([
    isAdminUser(userId).catch(() => false),
    isProEffective(userId).catch(() => false),
    daDungHomNay(userId),
  ]);
  const tran = admin ? null : pro ? soLuot('HOC_TAP_AI_PRO_DAILY', 150) : soLuot('HOC_TAP_AI_FREE_DAILY', 20);
  return { admin, pro, daDung, tran, conLai: tran === null ? null : Math.max(0, tran - daDung) };
}

export async function canHanMuc(userId: number) {
  const h = await hanMucAI(userId);
  if (h.conLai !== null && h.conLai <= 0) {
    throw new AppError(`Đã dùng hết ${h.tran} lượt AI hôm nay (24 giờ qua). Gói Pro được ${soLuot('HOC_TAP_AI_PRO_DAILY', 150)} lượt/ngày.`, 402, 'HOC_TAP_AI_QUOTA_EXCEEDED');
  }
}

// ─── Gom bằng chứng ──────────────────────────────────────────────

const DUOI_CHU = /\.(txt|md|js|jsx|ts|tsx|java|py|c|cpp|cs|sql|html|css|json|xml|yml|yaml|sh|kt|swift)$/i;
const DUOI_ANH = /\.(png|jpe?g|webp|gif|heic|bmp)$/i;
const TRAN_CHU = 60_000;

async function docAnhR2(url: string): Promise<Buffer | null> {
  const key = keyFromUrl(url);
  if (!key) return null;
  try {
    const res = await getR2Client().send(new GetObjectCommand({ Bucket: config.r2.bucketName, Key: key }));
    if (typeof res.ContentLength === 'number' && res.ContentLength > 15 * 1024 * 1024) return null;
    const bytes = await res.Body?.transformToByteArray();
    return bytes ? Buffer.from(bytes) : null;
  } catch {
    return null;
  }
}

async function chuanHoaAnh(anh: Buffer): Promise<VisionImage | null> {
  try {
    const ra = await sharp(anh, { failOn: 'none' }).rotate().resize({ width: 1800, withoutEnlargement: true }).jpeg({ quality: 85 }).toBuffer();
    return { data: ra.toString('base64'), mediaType: 'image/jpeg' };
  } catch {
    return null;
  }
}

async function layJson(url: string, ms = 8000): Promise<unknown> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    const headers: Record<string, string> = { Accept: 'application/vnd.github+json', 'User-Agent': 'cuongthai-hoc-tap' };
    if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    const r = await fetch(url, { headers, signal: ctrl.signal });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return await r.json();
  } finally {
    clearTimeout(t);
  }
}

async function layChu(url: string, ms = 8000, tran = 8000): Promise<string> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    const r = await fetch(url, { signal: ctrl.signal, headers: { 'User-Agent': 'cuongthai-hoc-tap' } });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return (await r.text()).slice(0, tran);
  } finally {
    clearTimeout(t);
  }
}

/** Đọc một repo GitHub: cây thư mục + tối đa 8 tệp mã nhỏ trong src/. */
export async function docGithub(link: string): Promise<string> {
  const m = link.match(/^https?:\/\/github\.com\/([\w.-]+)\/([\w.-]+?)(?:\.git)?(?:\/tree\/([^/]+)(\/.*)?)?\/?$/);
  if (!m) return `- ${link}: (không phải link repo GitHub dạng github.com/chủ/tên)`;
  const [, chu, ten, nhanLink, duongLink] = m;
  try {
    const repo = (await layJson(`https://api.github.com/repos/${chu}/${ten}`)) as { default_branch?: string; private?: boolean };
    const nhanh = nhanLink ?? repo.default_branch ?? 'main';
    const cay = (await layJson(`https://api.github.com/repos/${chu}/${ten}/git/trees/${encodeURIComponent(nhanh)}?recursive=1`)) as { tree?: Array<{ path: string; type: string; size?: number }> };
    const goc = (duongLink ?? '').replace(/^\/+/, '');
    const tep = (cay.tree ?? []).filter((x) => x.type === 'blob' && (!goc || x.path.startsWith(goc)) && !/(^|\/)(node_modules|build|dist|\.git)\//.test(x.path));
    const dong = tep.slice(0, 250).map((x) => `  ${x.path}`).join('\n');
    const ma = tep
      .filter((x) => /(^|\/)src\/.*\.(jsx?|tsx?|java|py|css)$/i.test(x.path) && (x.size ?? 0) < 12_000)
      .slice(0, 8);
    const noiDung = await Promise.all(
      ma.map(async (x) => {
        try {
          const c = await layChu(`https://raw.githubusercontent.com/${chu}/${ten}/${encodeURIComponent(nhanh)}/${x.path.split('/').map(encodeURIComponent).join('/')}`, 8000, 6000);
          return `--- ${x.path} ---\n${c}`;
        } catch {
          return `--- ${x.path} --- (không đọc được)`;
        }
      }),
    );
    return `- Repo ${chu}/${ten} (nhánh ${nhanh}, ${tep.length} tệp):\n${dong}\n${noiDung.join('\n')}`;
  } catch (e) {
    return `- ${link}: KHÔNG đọc được repo (${e instanceof Error ? e.message : String(e)}) — có thể repo private, sai link hoặc không tồn tại.`;
  }
}

async function gomBangChung(b: { noiDung: string | null; lienKet: unknown; tep: unknown }) {
  const anh: VisionImage[] = [];
  const phan: string[] = [];
  if (b.noiDung) phan.push(`## Người học viết\n${b.noiDung.slice(0, TRAN_CHU)}`);

  const tep = (Array.isArray(b.tep) ? b.tep : []) as TepBangChung[];
  for (const t of tep.slice(0, 10)) {
    const ten = t.ten || t.url.split('/').pop() || 'tệp';
    const laAnh = (t.loai ?? '').startsWith('image/') || DUOI_ANH.test(t.url);
    if (laAnh && anh.length < 6) {
      const buf = await docAnhR2(t.url);
      const v = buf && (await chuanHoaAnh(buf));
      if (v) { anh.push(v); phan.push(`## Ảnh #${anh.length}: ${ten}`); } else phan.push(`## Ảnh ${ten}: KHÔNG mở được (tệp lạ hoặc hỏng)`);
    } else if (DUOI_CHU.test(ten) || DUOI_CHU.test(t.url) || (t.loai ?? '').startsWith('text/')) {
      const key = keyFromUrl(t.url);
      const chu = key ? await getObjectText(key, 400 * 1024) : null;
      phan.push(chu ? `## Tệp ${ten}\n\`\`\`\n${chu.slice(0, 20_000)}\n\`\`\`` : `## Tệp ${ten}: KHÔNG đọc được`);
    } else {
      phan.push(`## Tệp ${ten} (${t.loai || 'không rõ loại'}): không đọc được nội dung loại tệp này — chỉ biết là đã nộp`);
    }
  }

  const links = (Array.isArray(b.lienKet) ? b.lienKet : []) as string[];
  if (links.length) {
    const doc = await Promise.all(links.slice(0, 5).map((l) => (/github\.com\//.test(l) ? docGithub(l) : Promise.resolve(`- ${l} (link ngoài, không tự mở)`))));
    phan.push(`## Link\n${doc.join('\n')}`);
  }
  return { anh, chu: phan.join('\n\n').slice(0, 120_000) };
}

// ─── Lọc kết quả của model ───────────────────────────────────────

function bocJson(raw: string): Record<string, unknown> {
  const s = raw.trim().replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
  const dau = s.indexOf('{');
  const cuoi = s.lastIndexOf('}');
  if (dau < 0 || cuoi <= dau) throw new Error('AI không trả JSON');
  return JSON.parse(s.slice(dau, cuoi + 1)) as Record<string, unknown>;
}

const dsChu = (x: unknown, tran = 12): string[] =>
  (Array.isArray(x) ? x : []).map((s) => String(s ?? '').trim()).filter(Boolean).slice(0, tran).map((s) => s.slice(0, 600));

export function locKetQua(o: Record<string, unknown>): KetQuaCham {
  const diem = Number(o.diem);
  if (!Number.isFinite(diem)) throw new Error('AI không cho điểm');
  return {
    dat: o.dat === true,
    diem: Math.min(10, Math.max(0, diem)),
    nhanXet: String(o.nhanXet ?? '').trim().slice(0, 4000) || '(AI không ghi nhận xét)',
    loiCanSua: dsChu(o.loiCanSua),
    canCaiThien: dsChu(o.canCaiThien),
    diemManh: dsChu(o.diemManh, 6),
  };
}

const HE_THONG = `Bạn là giảng viên chấm bài NGHIÊM KHẮC nhưng tử tế cho một sinh viên IT (FPT University) đang học bù.
Sinh viên KHÔNG được tự tích hoàn thành; bạn là người duy nhất quyết định việc này đạt hay chưa, dựa trên BẰNG CHỨNG.

Quy tắc:
- Chỉ chấm theo bằng chứng thật có trong tin nhắn (chữ, ảnh, mã, cây thư mục repo). Không suy diễn "chắc là đã làm".
- Bằng chứng thiếu, mờ, không khớp yêu cầu, hoặc chỉ là lời khẳng định "em làm xong rồi" ⇒ dat=false, nói rõ cần nộp thêm gì.
- Câu trả lời lý thuyết: đúng ý chính là đủ, không bắt văn hay. Sai khái niệm ⇒ ghi vào loiCanSua và giải thích đúng.
- Có dấu hiệu chép nguyên từ AI/mẫu mà không hiểu (văn trơn tru khác hẳn phần còn lại, mã thừa phức tạp không liên quan đề) ⇒ ghi rõ trong nhanXet và yêu cầu tự giải thích.
- Điểm 0–10. dat=true chỉ khi đáp ứng ĐỦ yêu cầu bằng chứng và điểm ≥ 5.
- Viết tiếng Việt dễ hiểu; sinh viên yếu tiếng Anh nên thuật ngữ tiếng Anh phải kèm nghĩa.
- Sinh viên dùng macOS: tên thư mục/tệp KHÔNG phân biệt hoa thường (WebdesignFundamental = WebDesignFundamental) — đừng bắt lỗi chữ hoa/thường trừ khi đề yêu cầu chạy trên Linux/máy chủ; chỉ nhắc như thói quen tốt.
- Lỗi nhỏ không thuộc yêu cầu bằng chứng thì ghi vào canCaiThien, KHÔNG dùng để đánh trượt.

VẤN ĐÁP CHỐNG HỌC VẸT: nếu dat=true, soạn thêm 2–3 câu hỏi NGẮN về CHÍNH bài sinh viên vừa nộp
(bắt giải thích một dòng code/lệnh cụ thể của họ, dự đoán kết quả nếu đổi một chi tiết, hoặc vì sao chọn cách đó).
Câu hỏi phải trả lời được trong 1–3 câu bởi người THẬT SỰ tự làm; người chép từ AI sẽ lúng túng. Không hỏi có/không.

Trả về DUY NHẤT một JSON:
{"dat": boolean, "diem": number, "nhanXet": "2–5 câu", "loiCanSua": ["lỗi cụ thể + cách sửa"], "canCaiThien": ["điều nên luyện thêm"], "diemManh": ["điều làm tốt"], "cauHoiVanDap": ["câu 1", "câu 2"]}`;

// ─── Chấm ────────────────────────────────────────────────────────

/** Chấm một lần nộp. Hỏng thì trả việc về DANG_LAM kèm lời giải thích — không bao giờ tự cho đạt. */
export async function chamBangChungAI(bangChungId: number): Promise<void> {
  const bc = await prisma.bangChungHoc.findUnique({ where: { id: bangChungId }, include: { nhiemVu: { include: { mon: true } } } });
  if (!bc) return;
  const v = bc.nhiemVu;
  try {
    const { anh, chu } = await gomBangChung(bc);
    const userText = [
      `# Việc cần chấm (môn ${v.mon.maMon} — ${v.mon.ten}, tuần ${v.tuan}, loại ${v.loai})`,
      `Tiêu đề: ${v.tieuDe}`,
      v.huongDan ? `Hướng dẫn đã giao:\n${v.huongDan.slice(0, 8000)}` : '',
      `Bằng chứng yêu cầu: ${v.yeuCauBangChung || '(không ghi riêng — xét theo hướng dẫn)'}`,
      v.mon.trinhDo ? `Trình độ sinh viên tự mô tả: ${v.mon.trinhDo}` : '',
      `Lần nộp thứ ${bc.lanNop}${bc.nopTre ? ' (NỘP TRỄ so với giờ hẹn — nhắc nhẹ, không trừ điểm nội dung)' : ''}.`,
      '',
      '# Bằng chứng sinh viên nộp',
      chu || '(không có chữ)',
    ].filter(Boolean).join('\n');

    const r = await visionComplete({ system: HE_THONG, userText, images: anh, userId: bc.userId, purpose: 'study_verify', feature: 'hoc_tap', maxTokens: 2500 });
    const raw = bocJson(r.text);
    const kq = locKetQua(raw);
    const cauHoi = dsChu(raw.cauHoiVanDap, 3);
    await ghiKetQua(bc.id, kq, 'AI');
    // Bằng chứng đạt ⇒ CHƯA tích: chuyển sang VẤN ĐÁP (trả lời đúng mới DAT).
    if (kq.dat && kq.diem >= 5 && cauHoi.length) {
      await prisma.nhiemVuHoc.update({
        where: { id: v.id },
        data: { trangThai: 'VAN_DAP', vanDap: { cauHoi, diemBangChung: kq.diem, bangChungId: bc.id } },
      });
    }
  } catch (e) {
    const loi = e instanceof Error ? e.message : String(e);
    logger.warn('hocTap: AI chấm hỏng', { bangChungId, loi });
    await prisma.$transaction([
      prisma.bangChungHoc.update({ where: { id: bc.id }, data: { ketQua: { loi } } }),
      prisma.nhiemVuHoc.update({
        where: { id: v.id },
        data: { trangThai: 'CHO_CHAM', nhanXet: `AI chưa chấm được lần nộp này (${loi.slice(0, 200)}). Bấm "Chấm lại" hoặc nhờ Claude chấm.` },
      }),
    ]);
  }
}

/** Gọi không chờ — chấm có thể mất 20–60 giây, vượt trần 100 giây của Cloudflare nếu chờ đồng bộ. */
export function chamNen(bangChungId: number): void {
  void chamBangChungAI(bangChungId).catch((e) => logger.error('hocTap: chamNen', { bangChungId, e: String(e) }));
}

// ─── Vấn đáp ─────────────────────────────────────────────────────

export interface KetQuaVanDap { hieu: boolean; diem: number; nhanXet: string; tungCau: Array<{ dung: boolean; goiY: string }> }

export function locVanDap(o: Record<string, unknown>, soCau: number): KetQuaVanDap {
  const tung = (Array.isArray(o.tungCau) ? o.tungCau : []).slice(0, soCau).map((x) => {
    const r = (x ?? {}) as Record<string, unknown>;
    return { dung: r.dung === true, goiY: String(r.goiY ?? '').slice(0, 600) };
  });
  const diem = Math.min(10, Math.max(0, Number(o.diem) || 0));
  const dung = tung.filter((t) => t.dung).length;
  // MÃ quyết định "hiểu": đúng ít nhất 2/3 số câu (2/2, 2/3, 3/3) — không tin cờ của model.
  const hieu = tung.length > 0 && dung * 3 >= tung.length * 2;
  return { hieu, diem, nhanXet: String(o.nhanXet ?? '').slice(0, 2000), tungCau: tung };
}

export async function traLoiVanDap(userId: number, viecId: number, traLoi: string[]) {
  const v = await prisma.nhiemVuHoc.findFirst({ where: { id: viecId, userId }, include: { mon: true } });
  if (!v) throw new AppError('Không tìm thấy việc', 404, 'NOT_FOUND');
  if (v.trangThai !== 'VAN_DAP' || !v.vanDap) throw new AppError('Việc này không ở bước vấn đáp', 400, 'BAD_STATE');
  const vd = v.vanDap as { cauHoi: string[]; diemBangChung: number; bangChungId?: number };
  const tl = vd.cauHoi.map((_, i) => String(traLoi[i] ?? '').trim().slice(0, 3000));
  if (tl.some((x) => x.length < 3)) throw new AppError('Trả lời đủ mọi câu (bằng lời của bạn)', 400, 'MISSING');
  const bc = vd.bangChungId ? await prisma.bangChungHoc.findUnique({ where: { id: vd.bangChungId } }) : null;

  const { llmComplete } = await import('../interview/llm/index.js');
  const r = await llmComplete({
    step: 'generation',
    system: `Bạn là giảng viên vấn đáp. Sinh viên vừa nộp bài và được hỏi lại để chứng minh TỰ LÀM và HIỂU (không học vẹt, không chép AI).
Chấm từng câu: đúng ý chính bằng lời của họ là đạt (không cần văn hay, sai chính tả không sao). Trả lời chung chung, lạc đề, hoặc nghe như chép nguyên văn định nghĩa mà không gắn vào bài của họ ⇒ chưa đạt.
Viết tiếng Việt dễ hiểu. Trả về DUY NHẤT JSON: {"diem": 0-10, "nhanXet": "1–3 câu", "tungCau": [{"dung": boolean, "goiY": "đáp ý đúng ngắn gọn"}]}`,
    messages: [{ role: 'user', content: [
      `Việc: ${v.tieuDe} (${v.mon.maMon})`,
      bc?.noiDung ? `Bài sinh viên đã nộp:\n${bc.noiDung.slice(0, 12000)}` : '',
      ...vd.cauHoi.map((c, i) => `Câu ${i + 1}: ${c}\nTrả lời: ${tl[i]}`),
    ].filter(Boolean).join('\n\n') }],
    purpose: 'study_verify',
    feature: 'hoc_tap',
    userId,
    maxTokens: 1500,
    maxRetries: 1,
  });
  const kq = locVanDap(bocJson(r.text), vd.cauHoi.length);
  const diemCuoi = Math.round((vd.diemBangChung * 0.6 + kq.diem * 0.4) * 10) / 10;
  await prisma.nhiemVuHoc.update({
    where: { id: viecId },
    data: kq.hieu
      ? { trangThai: 'DAT', diem: diemCuoi, vanDap: { ...vd, traLoi: tl, ketQua: kq } as never, chamLuc: new Date() }
      : { trangThai: 'CHUA_DAT', vanDap: { ...vd, traLoi: tl, ketQua: kq } as never,
          nhanXet: `Bằng chứng ổn nhưng vấn đáp CHƯA chứng minh được bạn hiểu bài (${kq.tungCau.filter((t) => t.dung).length}/${kq.tungCau.length} câu). ${kq.nhanXet} Đọc gợi ý, học lại phần đó rồi nộp lại.` },
  });
  return { ...kq, diemCuoi: kq.hieu ? diemCuoi : null };
}
