/**
 * AI SOẠN KẾ HOẠCH HỌC CHO MỘT MÔN — `study_plan` (gpt-6-sol).
 *
 * Đầu vào là DỮ LIỆU THẬT của web: mục lục khoá Academy cùng mã môn (bài nào
 * người học đã xong), danh sách khoá nền tảng đang có ở /courses, lịch thi,
 * tuần hiện tại, và đoạn người học tự kể trình độ.
 *
 * Kết quả KHÔNG ghi thẳng vào DB: trả bản xem trước, người học xem rồi bấm
 * "Áp dụng" (`themViec(..., 'AI')`). Liên kết bài học do MÃ dựng từ id bài/slug
 * khoá đã kiểm có thật — model bịa id thì liên kết bị bỏ, không ra link chết.
 *
 * Chạy NỀN (việc trong bộ nhớ, client hỏi lại): đo 02/10 soạn 42 việc mất ~6 phút,
 * — vượt xa trần 100 giây của Cloudflare nên không thể chờ đồng bộ.
 */
import { randomUUID } from 'node:crypto';
import { prisma } from '../../config/database.js';
import { BadRequestError, NotFoundError } from '../../middleware/errorHandler.js';
import { logger } from '../../utils/logger.js';
import { llmComplete } from '../interview/llm/index.js';
import { homNayVN, LOAI_VIEC, type ViecMoi } from './hocTap.service.js';
import { tuanHienTai } from './ruiRo.js';

export interface KeHoachDeNghi {
  tomTat: string;
  nenTang: Array<{ slug: string; ten: string; lyDo: string }>;
  viec: ViecMoi[];
  canhBao: string[];
}

type TrangThaiJob = { trangThai: 'dang_soan' | 'xong' | 'loi'; userId: number; monId: number; ketQua?: KeHoachDeNghi; loi?: string; luc: number };
const JOBS = new Map<string, TrangThaiJob>();

function donJob() {
  const cu = Date.now() - 60 * 60_000;
  for (const [k, v] of JOBS) if (v.luc < cu) JOBS.delete(k);
}

const HE_THONG = `Bạn là cố vấn học tập kiêm gia sư cho một sinh viên IT của FPT University đang BỊ CHẬM và sợ trượt môn.
Nhiệm vụ: soạn KẾ HOẠCH HỌC CHI TIẾT cho MỘT môn từ tuần hiện tại tới hết kỳ, gồm cả phần BÙ cho các tuần đã qua.

Nguyên tắc:
1. Sinh viên tự mô tả trình độ — nếu thiếu nền (ví dụ FER202 mà chưa vững HTML/CSS/JS) thì đặt việc loại NEN_TANG ở ĐẦU, chọn khoá nền từ danh sách được cung cấp.
2. Bù tuần đã qua dồn vào 1–2 tuần tới, nhưng mỗi ngày không quá ~3 giờ cho môn này (sinh viên học 6 môn).
3. Mỗi việc nhỏ, làm trong 15–90 phút, có "thoiLuongPhut" sát thực tế để sinh viên BẤM GIỜ.
4. "huongDan" viết CỤ THỂ bằng markdown: học bài nào, gõ tay lệnh/mã gì, tự trả lời câu hỏi nào. Giải nghĩa thuật ngữ tiếng Anh. Không viết sẵn lời giải.
5. "yeuCauBangChung" nói rõ phải nộp gì để chứng minh (ảnh màn hình chạy được, link GitHub, câu trả lời tự viết, điểm quiz…) — AI chấm sẽ dựa vào đây.
6. Có đủ các loại: BAI_HOC (học bài trong khoá), BAI_TAP, LAB, QUIZ (quiz chương), PE/FE (luyện đề thi thực hành/cuối kỳ trước ngày thi), ON_TAP, GHI_CHU (chép sổ tay).
7. Bài trong khoá Academy: ghi "baiHocId" = id bài lấy ĐÚNG từ mục lục; khoá nền: "khoaNen" = slug lấy ĐÚNG từ danh sách. Không bịa id/slug.
8. "trongSo" 1–5: việc quan trọng cho điểm thi (LAB, PE, FE) nặng hơn.
9. Việc luyện PE/FE phải xong TRƯỚC ngày thi ít nhất 2 ngày.

Trả về DUY NHẤT JSON:
{"tomTat":"3–5 câu: chiến lược, phần nguy hiểm nhất","nenTang":[{"slug":"...","ten":"...","lyDo":"..."}],
 "viec":[{"tuan":4,"thu":5,"loai":"BAI_HOC","tieuDe":"...","huongDan":"...","yeuCauBangChung":"...","baiHocId":123,"khoaNen":null,"thoiLuongPhut":45,"trongSo":2}]}
"thu": 1=thứ Hai … 7=Chủ nhật.`;

async function dungNguCanh(userId: number, monId: number, ghiChu: string | undefined) {
  const mon = await prisma.monHocKy.findFirst({ where: { id: monId, userId }, include: { hocKy: true } });
  if (!mon) throw new NotFoundError('Không tìm thấy môn');
  const now = new Date();
  const tuan = tuanHienTai(mon.hocKy.batDau, mon.hocKy.soTuan, now);

  let mucLuc = '(Môn này chưa có khoá trên Academy của web — tự dựa vào kiến thức về đề cương FPT của môn.)';
  const baiHopLe = new Map<number, string>();
  if (mon.courseId) {
    const course = await prisma.course.findUnique({
      where: { id: mon.courseId },
      select: { slug: true, title: true, sections: { orderBy: { sortOrder: 'asc' }, select: { title: true, lessons: { orderBy: { sortOrder: 'asc' }, where: { isPublished: true }, select: { id: true, title: true, lessonType: true } } } } },
    });
    if (course) {
      const xong = new Set(
        (await prisma.lessonProgress.findMany({ where: { isCompleted: true, enrollment: { userId, courseId: mon.courseId } }, select: { lessonId: true } })).map((x) => x.lessonId),
      );
      const dong: string[] = [`Khoá Academy "${course.title}" (slug ${course.slug}). [x] = sinh viên đã đánh dấu học xong trên web.`];
      let dem = 0;
      for (const s of course.sections) {
        dong.push(`## ${s.title}`);
        for (const l of s.lessons) {
          if (dem++ > 400) break;
          baiHopLe.set(l.id, course.slug);
          dong.push(`- [${xong.has(l.id) ? 'x' : ' '}] id ${l.id} · ${l.lessonType} · ${l.title}`);
        }
      }
      mucLuc = dong.join('\n').slice(0, 45_000);
    }
  }

  const khoaNen = await prisma.course.findMany({
    where: { semesterId: null, isPublished: true },
    select: { slug: true, title: true },
    orderBy: { title: 'asc' },
    take: 250,
  });
  const slugHopLe = new Map(khoaNen.map((k) => [k.slug, k.title]));

  const thi = await prisma.lichThi.findMany({ where: { userId, maMon: { equals: mon.maMon, mode: 'insensitive' } }, orderBy: { ngay: 'asc' } });
  const daCo = await prisma.nhiemVuHoc.findMany({ where: { monId }, select: { tieuDe: true, trangThai: true, tuan: true }, take: 200 });

  const userText = [
    `Hôm nay: ${homNayVN(now).toISOString().slice(0, 10)} — TUẦN ${tuan}/${mon.hocKy.soTuan} của kỳ "${mon.hocKy.ten}" (tuần 1 bắt đầu ${mon.hocKy.batDau.toISOString().slice(0, 10)}, tuần thi ${mon.hocKy.tuanThi}).`,
    `Môn: ${mon.maMon} — ${mon.ten}. Mục tiêu: ${mon.mucTieu || 'qua môn chắc chắn'}.`,
    `Sinh viên tự mô tả: ${mon.trinhDo || '(chưa mô tả — coi như đang chậm, nền yếu)'}`,
    thi.length ? `Lịch thi: ${thi.map((t) => `${t.loai} ngày ${t.ngay.toISOString().slice(0, 10)}`).join('; ')}` : `Lịch thi: chưa nhập — giả định PE/FE rơi vào tuần ${mon.hocKy.tuanThi}.`,
    daCo.length ? `Việc ĐÃ CÓ (không lặp lại):\n${daCo.map((v) => `- T${v.tuan} [${v.trangThai}] ${v.tieuDe}`).join('\n')}` : '',
    ghiChu ? `Ghi chú thêm của sinh viên: ${ghiChu.slice(0, 2000)}` : '',
    '',
    '# Mục lục môn',
    mucLuc,
    '',
    '# Khoá nền tảng đang có trên web (slug · tên)',
    khoaNen.map((k) => `${k.slug} · ${k.title}`).join('\n'),
  ].filter(Boolean).join('\n');

  return { mon, tuan, userText, baiHopLe, slugHopLe };
}

function bocJson(raw: string): Record<string, unknown> {
  const s = raw.trim().replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
  const dau = s.indexOf('{');
  const cuoi = s.lastIndexOf('}');
  if (dau < 0 || cuoi <= dau) throw new Error('AI không trả JSON');
  return JSON.parse(s.slice(dau, cuoi + 1)) as Record<string, unknown>;
}

/** Kiểm từng việc, dựng liên kết từ id/slug ĐÃ KIỂM. */
export function locKeHoach(o: Record<string, unknown>, baiHopLe: Map<number, string>, slugHopLe: Map<string, string>, tuanToiThieu: number): KeHoachDeNghi {
  const canhBao: string[] = [];
  const viec: ViecMoi[] = [];
  for (const [i, raw] of (Array.isArray(o.viec) ? o.viec : []).entries()) {
    const v = (raw ?? {}) as Record<string, unknown>;
    const loai = String(v.loai ?? '').toUpperCase();
    const tieuDe = String(v.tieuDe ?? '').trim();
    if (!tieuDe || !(LOAI_VIEC as readonly string[]).includes(loai)) { canhBao.push(`Bỏ việc #${i + 1}: thiếu tiêu đề hoặc loại lạ`); continue; }
    let lienKet: string | null = null;
    const baiId = Number(v.baiHocId);
    if (Number.isInteger(baiId) && baiHopLe.has(baiId)) lienKet = `/courses/${baiHopLe.get(baiId)}/learn?lessonId=${baiId}`;
    else if (v.baiHocId != null && v.baiHocId !== '') canhBao.push(`"${tieuDe}": id bài ${String(v.baiHocId)} không có trong mục lục — bỏ liên kết`);
    const slug = typeof v.khoaNen === 'string' ? v.khoaNen.trim() : '';
    if (!lienKet && slug) {
      if (slugHopLe.has(slug)) lienKet = `/courses/${slug}`;
      else canhBao.push(`"${tieuDe}": khoá "${slug}" không có trên web — bỏ liên kết`);
    }
    viec.push({
      tuan: Math.max(tuanToiThieu, Math.round(Number(v.tuan) || tuanToiThieu)),
      thu: Math.min(7, Math.max(1, Math.round(Number(v.thu) || 7))),
      loai,
      tieuDe: tieuDe.slice(0, 255),
      huongDan: v.huongDan ? String(v.huongDan) : null,
      yeuCauBangChung: v.yeuCauBangChung ? String(v.yeuCauBangChung) : null,
      lienKet,
      thoiLuongPhut: Math.min(600, Math.max(5, Math.round(Number(v.thoiLuongPhut) || 30))),
      trongSo: Math.min(5, Math.max(1, Math.round(Number(v.trongSo) || 1))),
    });
  }
  const nenTang = (Array.isArray(o.nenTang) ? o.nenTang : [])
    .map((x) => (x ?? {}) as Record<string, unknown>)
    .filter((x) => typeof x.slug === 'string' && slugHopLe.has(x.slug))
    .slice(0, 8)
    .map((x) => ({ slug: String(x.slug), ten: slugHopLe.get(String(x.slug)) ?? String(x.ten ?? ''), lyDo: String(x.lyDo ?? '').slice(0, 300) }));
  return { tomTat: String(o.tomTat ?? '').slice(0, 2000), nenTang, viec: viec.slice(0, 200), canhBao };
}

export function batDauSoanKeHoach(userId: number, monId: number, ghiChu?: string): string {
  donJob();
  const dangChay = [...JOBS.values()].some((j) => j.userId === userId && j.monId === monId && j.trangThai === 'dang_soan');
  if (dangChay) throw new BadRequestError('Kế hoạch môn này đang được soạn — đợi xong đã');
  const id = randomUUID();
  JOBS.set(id, { trangThai: 'dang_soan', userId, monId, luc: Date.now() });
  void (async () => {
    try {
      const { tuan, userText, baiHopLe, slugHopLe } = await dungNguCanh(userId, monId, ghiChu);
      const r = await llmComplete({
        step: 'generation',
        system: HE_THONG,
        messages: [{ role: 'user', content: userText }],
        purpose: 'study_plan',
        feature: 'hoc_tap',
        userId,
        maxTokens: 24_000,
        timeoutMs: 240_000,
        maxRetries: 1,
      });
      const kq = locKeHoach(bocJson(r.text), baiHopLe, slugHopLe, tuan);
      if (!kq.viec.length) throw new Error('AI không soạn được việc nào hợp lệ');
      JOBS.set(id, { trangThai: 'xong', userId, monId, ketQua: kq, luc: Date.now() });
    } catch (e) {
      const loi = e instanceof Error ? e.message : String(e);
      logger.warn('hocTap: soạn kế hoạch hỏng', { userId, monId, loi });
      JOBS.set(id, { trangThai: 'loi', userId, monId, loi, luc: Date.now() });
    }
  })();
  return id;
}

export function trangThaiSoan(userId: number, jobId: string) {
  const j = JOBS.get(jobId);
  if (!j || j.userId !== userId) throw new NotFoundError('Không tìm thấy lượt soạn (có thể máy chủ vừa khởi động lại — soạn lại nhé)');
  return { trangThai: j.trangThai, ketQua: j.ketQua ?? null, loi: j.loi ?? null };
}

// ─── Lời cảnh báo (study_coach) ──────────────────────────────────

export async function loiHuanLuyen(userId: number, soLieu: unknown): Promise<string> {
  const r = await llmComplete({
    step: 'generation',
    system: `Bạn là huấn luyện viên học tập nghiêm khắc, nói thẳng nhưng không xúc phạm, cho một sinh viên FPT đang chậm tiến độ và cần qua hết các môn để đi thực tập.
Bạn nhận SỐ LIỆU ĐÃ TÍNH SẴN (tỷ lệ trượt, tiến độ, việc quá hạn). KHÔNG được đổi hay tự tính lại con số nào.
Viết tiếng Việt, markdown ngắn (tối đa ~180 chữ): 1 câu báo động đúng mức nghiêm trọng, 2–4 gạch đầu dòng "làm gì trong 24 giờ tới" (cụ thể theo môn, theo việc có trong số liệu), 1 câu chốt.`,
    messages: [{ role: 'user', content: JSON.stringify(soLieu).slice(0, 30_000) }],
    purpose: 'study_coach',
    feature: 'hoc_tap',
    userId,
    maxTokens: 1200,
    maxRetries: 1,
  });
  return r.text.trim();
}
